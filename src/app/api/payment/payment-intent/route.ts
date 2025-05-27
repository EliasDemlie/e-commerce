import { NextResponse } from 'next/server'
import Order from '@/server/models/Order'
import { generateOrderNumber } from '@/lib/utils'

import dbConnect from '@/lib/dbConnect'
import { getCurrentUser } from '@/action/CurrentUser'

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await request.json()

    await dbConnect()

    if (!data.items || data.items.length === 0) {
      return NextResponse.json({ error: 'No items in the order' }, { status: 400 })
    }
    const orderNumber = generateOrderNumber()

    const existingOrder = await Order.findOne({
      userId: currentUser._id,
      orderNumber,
    })
   
    if (existingOrder) {
      return NextResponse.json({ error: 'Order already exists' }, { status: 400 })
    }

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
  } catch (error) 
  {
    if (error instanceof Error) {
      console.error('Error creating order:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    else {
      console.error('Error creating order:', error)
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    
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
    
      const orders = await Order.find({ userId: currentUser._id }).sort({
        createdAt: -1,
      })

      return NextResponse.json({ orders })
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error retrieving orders:', error.message)
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
