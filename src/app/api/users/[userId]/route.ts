import { getCurrentUser } from '@/action/CurrentUser'
import User from '@/server/models/User'
import { NextResponse } from 'next/server'


export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { status } = body

    if (!status) {
      return new NextResponse('Status is required', { status: 400 })
    }

    const user = await User.findByIdAndUpdate(params.userId, {
      status,
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('[USER_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await User.findByIdAndDelete(params.userId)

    return NextResponse.json(user)
  } catch (error) {
    console.error('[USER_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
} 