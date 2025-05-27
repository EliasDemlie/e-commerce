import { getCurrentUser } from '@/action/CurrentUser'
import User from '@/server/models/User'
import { NextResponse } from 'next/server'


export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const users = await User.find()
    console.log('users', users)
    return NextResponse.json(users)
  } catch (error) {
    console.error('[USERS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
