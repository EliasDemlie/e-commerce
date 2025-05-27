import { NextResponse } from 'next/server'
import Order from '@/server/models/Order'
import { generateOrderNumber } from '@/lib/utils'
import dbConnect from '@/lib/dbConnect'
import { getCurrentUser } from '@/action/CurrentUser'

// Define the query type for filtering orders
interface OrderQuery {
  userId: string
  orderStatus?: string
}

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    const data = await request.json()
    console.log('Received data:', data)

    await dbConnect()

    const orderNumber = generateOrderNumber()

    const order = new Order({
      userId: currentUser._id,
      orderNumber,
      items: data.items,
      subtotal: data.subtotal,
      tax: data.tax,
      shipping: data.shipping,
      shippingAddressId: data.shippingAddressId,
      billingAddressId: data.billingAddressId,
      notes: data.notes,
      orderStatus: 'pending',
      paymentStatus: 'pending',
    })

    await order.save()

    return NextResponse.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
      },
    })
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating order:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      console.error('Error creating order:', error)
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }
  }
}

export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get('id')
    const limit = searchParams.get('limit')
    const sort = searchParams.get('sort')
    const status = searchParams.get('status')

    await dbConnect()

    if (orderId) {
      const order = await Order.findOne({
        _id: orderId,
        userId: currentUser._id,
      })

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      return NextResponse.json({ order })
    } else {
      const query: OrderQuery = { userId: currentUser._id }

      if (status) {
        query.orderStatus = status
      }

      let sortOption: Record<string, 1 | -1> = { createdAt: -1 }
      if (sort) {
        const [field, direction] = sort.split(':')
        sortOption = { [field]: direction === 'desc' ? -1 : 1 }
      }

      let ordersQuery = Order.find(query).sort(sortOption)

      if (limit) {
        const limitNumber = parseInt(limit, 10)
        if (isNaN(limitNumber) || limitNumber <= 0) {
          return NextResponse.json(
            { error: 'Invalid limit value' },
            { status: 400 }
          )
        }
        ordersQuery = ordersQuery.limit(limitNumber)
      }

      const orders = await ordersQuery.exec()

      return NextResponse.json({ orders })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching orders:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    } else {
      return NextResponse.json(
        { error: 'An unexpected error occurred' },
        { status: 500 }
      )
    }
  }
}
