import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'
import { Shipment } from '@/server/models/Shipment'
import { type NextRequest, NextResponse } from 'next/server'


export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const shipment = await Shipment.findById(params.id).populate('carrierId')

    if (!shipment) {
      return NextResponse.json(
        { message: 'Shipment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ shipment })
  } catch (error) {
    console.error('Error fetching shipment:', error)
    return NextResponse.json(
      { message: 'Error fetching shipment' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get current user
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'MANAGER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const updateData = await req.json()

    // Find shipment
    const shipment = await Shipment.findById(params.id)

    if (!shipment) {
      return NextResponse.json(
        { message: 'Shipment not found' },
        { status: 404 }
      )
    }

    // Update shipment status logic
    const oldStatus = shipment.status
    const newStatus = updateData.status

    // Update shipment
    Object.assign(shipment, updateData)
    await shipment.save()

    // If shipment is delivered, update order status
    if (
      oldStatus !== 'delivered' &&
      newStatus === 'delivered' &&
      shipment.orderId
    ) {
      const order = await Order.findById(shipment.orderId)

      if (order && order.orderStatus === 'shipped') {
        order.orderStatus = 'delivered'
        await order.save()
      }
    }

    return NextResponse.json({
      message: 'Shipment updated successfully',
      shipment,
    })
  } catch (error) {
    console.error('Error updating shipment:', error)
    return NextResponse.json(
      { message: 'Error updating shipment' },
      { status: 500 }
    )
  }
}
