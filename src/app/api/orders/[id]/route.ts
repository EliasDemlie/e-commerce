import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'
import { getCurrentUser } from '@/action/CurrentUser'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || !['ADMIN', 'MANAGER'].includes(currentUser.role)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 403 })
    }
    await dbConnect()

    
    const { id } = await context.params

    const order = await Order.findById(id).populate('userId', 'name email')
    if (!order) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({ order }, { status: 200 })
  } catch (error) {
    console.error('Error fetching order:', error)
    return NextResponse.json(
      { message: 'Error fetching order' },
      { status: 500 }
    )
  }
}
