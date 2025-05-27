import type { DefaultSession, DefaultUser } from 'next-auth'


declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      role: 'USER' | 'ADMIN' | 'MANAGER'
      emailVerified?: Date | null
    } & DefaultSession['user']
  }

  // This is the important part - extend the User type
  interface User extends DefaultUser {
    id: string
    role: 'USER' | 'ADMIN' | 'MANAGER'
    emailVerified?: Date | null
  }
}

// Extend JWT type
declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: 'USER' | 'ADMIN' | 'MANAGER'
    emailVerified?: Date | null
    loginTime?: number
  }
}
