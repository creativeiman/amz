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
      authProvider?: 'credentials' | 'google' // Track how user authenticated
    } & DefaultSession['user']
  }

  interface User {
    role: 'USER' | 'ADMIN'
    plan: 'FREE' | 'DELUXE' | 'ONE_TIME'
    isOwner?: boolean
    authProvider?: 'credentials' | 'google'
  }
}

// Base configuration for Edge runtime (middleware)
const baseConfig = {
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  secret: env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production', // Only use secure cookies in production (HTTPS)
  trustHost: true, // Trust the host header from Railway's proxy
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
        console.log('[SignIn Callback] Google OAuth sign-in for:', user.email)
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
          console.log('[SignIn Callback] Creating new user for:', user.email)
          // Calculate next month's first day for scan limit reset
          const nextMonthReset = new Date()
          nextMonthReset.setMonth(nextMonthReset.getMonth() + 1)
          nextMonthReset.setDate(1)
          nextMonthReset.setHours(0, 0, 0, 0)

          // Create new user and account for OAuth
          const newUser = await prisma.user.create({
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
                  slug: `${user.email!.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '-')}-workspace-${Date.now()}`,
                  plan: 'FREE',
                  subscriptionStatus: 'ACTIVE',
                  isActive: true,
                  scanLimitPerMonth: 1, // 1 scan per account lifetime for FREE plan
                  scansUsedThisMonth: 0,
                  scanLimitResetAt: nextMonthReset, // First day of NEXT month
                },
              },
            },
          })
          console.log('[SignIn Callback] New user created:', newUser.id)
          return true
        }

        console.log('[SignIn Callback] Existing user found:', existingUser.id)

        // Check if existing user is active
        if (!existingUser.isActive) {
          console.log('[SignIn Callback] User is inactive:', existingUser.id)
          return '/login?error=Your account has been deactivated. Please contact support.'
        }

        // Check if user's account is active
        const primaryAccount = existingUser.ownedAccounts[0]
        if (primaryAccount && !primaryAccount.isActive) {
          console.log('[SignIn Callback] User account is inactive:', primaryAccount.id)
          return '/login?error=Your account workspace has been deactivated. Please contact support.'
        }

        console.log('[SignIn Callback] User is active, allowing sign-in')
      }
      return true
    },

    async jwt({ token, user, trigger, account }) {
      console.log('[JWT Callback] Called with:', { 
        hasUser: !!user, 
        hasAccount: !!account, 
        provider: account?.provider,
        trigger,
        userId: user?.id || token.id
      })

      // Initial sign in - fetch user data from database for OAuth users
      if (user) {
        token.id = user.id
        token.name = user.name
        token.email = user.email
        token.picture = user.image

        // Set authProvider based on account provider
        if (account?.provider === 'google') {
          token.authProvider = 'google'
          console.log('[JWT Callback] Set authProvider to google for user:', user.email)
        } else {
          token.authProvider = 'credentials'
          console.log('[JWT Callback] Set authProvider to credentials for user:', user.email)
        }

        // For OAuth providers, fetch additional data from database
        if (account?.provider === 'google') {
          console.log('[JWT Callback] Processing Google OAuth user:', user.email)
          // Set defaults first
          token.role = 'USER'
          token.plan = 'FREE'
          token.isOwner = true

          try {
            const { prisma } = await import('@/db/client')
            // For OAuth, find user by email instead of ID (Google ID != our DB ID)
            const dbUser = await prisma.user.findUnique({
              where: { email: user.email! },
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

            if (dbUser) {
              // Update token with database user ID, not Google's ID
              token.id = dbUser.id
              token.role = dbUser.role
              const primaryAccount = dbUser.ownedAccounts[0]
              const memberAccount = dbUser.accountMemberships[0]?.account

              if (primaryAccount) {
                token.plan = primaryAccount.plan
                token.isOwner = true
                console.log('[JWT Callback] Set token from owned account:', { plan: token.plan, isOwner: token.isOwner, dbUserId: dbUser.id })
              } else if (memberAccount) {
                token.plan = memberAccount.plan
                token.isOwner = false
                console.log('[JWT Callback] Set token from member account:', { plan: token.plan, isOwner: token.isOwner, dbUserId: dbUser.id })
              } else {
                // User exists but has no account (shouldn't happen with our signIn callback)
                token.plan = 'FREE'
                token.isOwner = true
                console.log('[JWT Callback] User has no account, using defaults, dbUserId:', dbUser.id)
              }
            } else {
              console.log('[JWT Callback] User not found in database by email:', user.email)
            }
          } catch (error) {
            console.error('[JWT Callback] Error fetching OAuth user data:', error)
            // Defaults are already set above, so just log and continue
          }
        } else {
          // For credentials provider, use data from user object
          token.role = user.role
          token.plan = user.plan
          token.isOwner = user.isOwner
          console.log('[JWT Callback] Credentials login, set token from user object')
        }
      }

      console.log('[JWT Callback] Returning token with role:', token.role, 'plan:', token.plan, 'isOwner:', token.isOwner)

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
            
            // Preserve authProvider - don't overwrite it during updates
            // authProvider should only be set during initial sign-in
            console.log('[JWT Callback] Preserving authProvider during update:', token.authProvider)
          }
        } catch (error) {
          // If running in Edge runtime, Prisma won't work - skip the update
          if (error instanceof Error && error.message.includes('edge runtime')) {
            console.log('[Auth] Skipping Prisma update in Edge runtime')
          } else {
            console.error('Error updating token:', error)
          }
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
          // If running in Edge runtime (middleware), Prisma won't work - skip the check
          // This is expected and not a critical error
          if (error instanceof Error && error.message.includes('edge runtime')) {
            console.log('[Auth] Skipping Prisma check in Edge runtime (middleware)')
          } else {
            console.error('Error checking user/account status:', error)
          }
          // On error, don't invalidate immediately, just skip the check
        }
      }

      return token
    },

    async session({ session, token }) {
      if (token) {
        console.log('[Session Callback] Token authProvider:', token.authProvider)
        session.user.id = token.id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string | null | undefined
        session.user.role = token.role as 'USER' | 'ADMIN'
        session.user.plan = token.plan as 'FREE' | 'DELUXE' | 'ONE_TIME'
        session.user.isOwner = token.isOwner as boolean | undefined
        session.user.authProvider = token.authProvider as 'credentials' | 'google' | undefined
        console.log('[Session Callback] Session authProvider:', session.user.authProvider)
      }
      return session
    },
  },
})

