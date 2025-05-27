import NextAuth, { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import bcrypt from 'bcrypt'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        remember: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        await dbConnect()

        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid email or password!')
        }

        const user = await User.findOne({ email: credentials.email })
        if (!user || !user.hashedPassword) {
          throw new Error('Invalid email or password!')
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        )
        if (!isPasswordValid) {
          throw new Error('Invalid email or password!')
        }

        // Important: Convert Mongoose document to a plain object with explicit typing
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
        }
      },
    }),
  ],
  pages: {
    signIn: '/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 4 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'USER' | 'ADMIN' | 'MANAGER'
        session.user.emailVerified = token.emailVerified as Date | null
      }
      return session
    },
  },
  jwt: {
    maxAge: 4 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === 'development',
}

export default NextAuth(authOptions)
