import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { UserService } from './userService'

export const authOptions = {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   authorization: {
    //     params: {
    //       prompt: "consent",
    //       access_type: "offline",
    //       response_type: "code"
    //     }
    //   }
    // }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const result = await UserService.authenticateUser(
          credentials.email,
          credentials.password
        )

        if (result.success && result.user) {
          return {
            id: result.user.id,
            email: result.user.email,
            name: result.user.name,
            plan: result.user.plan,
          }
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt' as const,
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account, profile }: { user: any; account: any; profile?: any }) {
      if (account?.provider === 'google') {
        try {
          // Check if user exists, if not create them
          const existingUser = await UserService.getUserByEmail(user.email!)
          if (!existingUser) {
            // Create new user for Google OAuth
            const result = await UserService.createUser({
              name: user.name || user.email!.split('@')[0],
              email: user.email!,
              password: 'google-oauth-user', // Dummy password for OAuth users
              plan: 'free'
            })
            
            if (result.success && result.user) {
              user.id = result.user.id
              ;(user as any).plan = result.user.plan
            }
          } else {
            user.id = existingUser.id
            ;(user as any).plan = existingUser.plan
          }
        } catch (error) {
          console.error('Google OAuth user creation error:', error)
          return false
        }
      }
      return true
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id
        token.plan = (user as any).plan || 'free'
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string
        (session.user as any).plan = token.plan as string || 'free'
      }
      return session
    },
  },
}
