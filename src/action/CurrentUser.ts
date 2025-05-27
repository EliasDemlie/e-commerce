import { getServerSession } from 'next-auth'

import User from '@/server/models/User'
import dbConnect from '@/lib/dbConnect'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const getSession = async () => {
  return await getServerSession(authOptions)
}

export async function getCurrentUser() {
  try {
    const session = await getSession()

    if (!session?.user?.email) {
      return null
    }

    await dbConnect()
    const currentUser = await User.findOne({ email: session.user.email })

    if (!currentUser) {
      return null
    }

    return {
      ...currentUser.toObject(),
      _id: currentUser._id.toString(),
      updatedAt: currentUser.updatedAt?.toISOString() || null,
      emailVerified: currentUser.emailVerified?.toISOString() || null,
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

export async function requireAuth(
  req: Request,
  roles?: ('USER' | 'ADMIN' | 'MANAGER' | 'CARRIER')[]
) {
  const session = await getSession()

  if (!session?.user) {
    return {
      success: false,
      message: 'Authentication required',
      status: 401,
    }
  }

  if (roles && roles.length > 0) {
    const user = await getCurrentUser()

    if (!user || !roles.includes(user.role)) {
      return {
        success: false,
        message: 'Insufficient permissions',
        status: 403,
      }
    }
  }

  return { success: true, user: session.user }
}

interface Session {
  expires: string
  [key: string]: unknown
}

export function isSessionExpired(session: Session | null | undefined): boolean {
  if (!session || !session.expires) return true

  const expiryDate = new Date(session.expires)
  return expiryDate < new Date()
}
