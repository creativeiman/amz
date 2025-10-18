import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import { env, features } from '@/config/env'

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN'
      plan: 'FREE' | 'DELUXE' | 'ONE_TIME'
      isOwner?: boolean // True if user owns an account, false if just a team member
    } & DefaultSession['user']
  }

  interface User {
    role: 'USER' | 'ADMIN'
    plan: 'FREE' | 'DELUXE' | 'ONE_TIME'
    isOwner?: boolean
  }
}

// Base configuration for Edge runtime (middleware)
const baseConfig = {
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: env.NEXTAUTH_SECRET,
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...baseConfig,
  providers: [
    // Credentials Provider
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[Auth] Missing credentials')
            return null
          }

          // Import dynamically to avoid edge runtime issues
          const { prisma } = await import('@/db/client')
          const bcrypt = await import('bcryptjs')

          console.log('[Auth] Attempting login for:', credentials.email)

          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          include: {
            ownedAccounts: {
              select: {
                id: true,
                plan: true,
                isActive: true,
              },
              take: 1,
            },
            accountMemberships: {
              select: {
                id: true,
                isActive: true,
                account: {
                  select: {
                    id: true,
                    plan: true,
                    isActive: true,
                  },
                },
              },
              take: 1,
            },
          },
        })

        if (!user || !user.password) {
          return null
        }

        // Check if user is active
        if (!user.isActive) {
          throw new Error('Your account has been deactivated. Please contact support.')
        }

        const isValidPassword = await bcrypt.compare(
          credentials.password as string,
          user.password
        )

        if (!isValidPassword) {
          return null
        }

        // For regular users, check if their account is active (either owned or member)
        if (user.role === 'USER') {
          let plan: 'FREE' | 'DELUXE' | 'ONE_TIME' = 'FREE'
          let isOwner = false
          
          // Check if they own an account
          if (user.ownedAccounts && user.ownedAccounts.length > 0) {
            const primaryAccount = user.ownedAccounts[0]
            
            if (!primaryAccount.isActive) {
              throw new Error('Your account workspace has been deactivated. Please contact support.')
            }
            
            plan = primaryAccount.plan
            isOwner = true
          } 
          // Otherwise, check if they're a member of an account
          else if (user.accountMemberships && user.accountMemberships.length > 0) {
            const membership = user.accountMemberships[0]
            
            // Check if membership is active
            if (!membership.isActive) {
              throw new Error('Your team membership has been deactivated. Please contact your team administrator.')
            }
            
            // Check if account is active
            if (!membership.account.isActive) {
              throw new Error('The team workspace has been deactivated. Please contact your team administrator.')
            }
            
            plan = membership.account.plan
            isOwner = false
          } else {
            throw new Error('No account found. Please contact support.')
          }

          console.log('[Auth] User login successful:', user.email, '| Plan:', plan, '| isOwner:', isOwner)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            plan,
            isOwner,
            image: user.image,
          }
        }

        // For admin users, no account check needed
        console.log('[Auth] Admin login successful:', user.email)
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          plan: 'FREE' as const,
          isOwner: false, // Admins don't have accounts
          image: user.image,
        }
        } catch (error) {
          console.error('[Auth] Authorization error:', error)
          return null
        }
      },
    }),

    // Google OAuth (only if configured)
    ...(features.hasGoogleAuth
      ? [
          Google({
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth providers, create or update user
      if (account?.provider === 'google') {
        const { prisma } = await import('@/db/client')
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            ownedAccounts: {
              select: {
                id: true,
                isActive: true,
              },
              take: 1,
            },
          },
        })

        if (!existingUser) {
          // Create new user and account for OAuth
          await prisma.user.create({
            data: {
              name: user.name,
              email: user.email!,
              image: user.image,
              role: 'USER',
              isActive: true,
              emailVerified: new Date(),
              ownedAccounts: {
                create: {
                  name: `${user.name}'s Workspace`,
                  slug: `${user.email!.split('@')[0]}-workspace-${Date.now()}`,
                  plan: 'FREE',
                  subscriptionStatus: 'ACTIVE',
                  isActive: true,
                  scanLimitPerMonth: 3,
                  scansUsedThisMonth: 0,
                },
              },
            },
          })
          return true
        }

        // Check if existing user is active
        if (!existingUser.isActive) {
          return '/login?error=Your account has been deactivated. Please contact support.'
        }

        // Check if user's account is active
        const primaryAccount = existingUser.ownedAccounts[0]
        if (primaryAccount && !primaryAccount.isActive) {
          return '/login?error=Your account workspace has been deactivated. Please contact support.'
        }
      }
      return true
    },

    async jwt({ token, user, trigger, session: _session }) {
      // Initial sign in
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image
        token.role = user.role
        token.plan = user.plan
        token.isOwner = user.isOwner
      }

      // Update session - refetch user data from DB
      if (trigger === 'update') {
        try {
          const { prisma } = await import('@/db/client')
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              name: true,
              email: true,
              image: true,
              role: true,
              ownedAccounts: {
                select: { plan: true },
                take: 1,
              },
              accountMemberships: {
                select: {
                  account: {
                    select: { plan: true },
                  },
                },
                take: 1,
              },
            },
          })

          if (dbUser) {
            token.name = dbUser.name
            token.email = dbUser.email
            token.picture = dbUser.image
            token.role = dbUser.role
            
            // Determine if owner
            const isOwner = dbUser.ownedAccounts && dbUser.ownedAccounts.length > 0
            token.isOwner = isOwner
            
            // Get plan from owned account or member account
            if (isOwner && dbUser.ownedAccounts[0]) {
              token.plan = dbUser.ownedAccounts[0].plan
            } else if (dbUser.accountMemberships && dbUser.accountMemberships[0]) {
              token.plan = dbUser.accountMemberships[0].account.plan
            }
          }
        } catch (error) {
          console.error('Error updating token:', error)
        }
      }

      // Periodically verify user and account are still active
      // Check every ~5 minutes (token is refreshed periodically)
      const lastChecked = token.lastChecked as number | undefined
      const now = Date.now()
      const fiveMinutes = 5 * 60 * 1000

      if (!lastChecked || now - lastChecked > fiveMinutes) {
        try {
          const { prisma } = await import('@/db/client')
          
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: {
              isActive: true,
              role: true,
              ownedAccounts: {
                select: {
                  isActive: true,
                },
                take: 1,
              },
              accountMemberships: {
                select: {
                  isActive: true,
                  account: {
                    select: {
                      isActive: true,
                    },
                  },
                },
                take: 1,
              },
            },
          })

          // If user not found or inactive, invalidate token
          if (!dbUser || !dbUser.isActive) {
            return null
          }

          // For regular users, check account status (either owned or member)
          if (dbUser.role === 'USER') {
            let accountActive = false
            
            // Check owned accounts
            if (dbUser.ownedAccounts && dbUser.ownedAccounts.length > 0) {
              const account = dbUser.ownedAccounts[0]
              accountActive = account.isActive
            } 
            // Check account memberships
            else if (dbUser.accountMemberships && dbUser.accountMemberships.length > 0) {
              const membership = dbUser.accountMemberships[0]
              accountActive = membership.isActive && membership.account.isActive
            }
            
            if (!accountActive) {
              return null
            }
          }

          token.lastChecked = now
        } catch (error) {
          console.error('Error checking user/account status:', error)
          // On error, don't invalidate immediately, just skip the check
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string | null | undefined
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.user.plan = token.plan as 'FREE' | 'DELUXE' | 'ONE_TIME'
        session.user.isOwner = token.isOwner as boolean | undefined
      }
      return session
    },
  },
})

