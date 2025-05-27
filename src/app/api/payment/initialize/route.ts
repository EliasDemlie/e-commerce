import { type NextRequest, NextResponse } from 'next/server'

import { initializePayment } from '@/lib/chapa'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'

interface PaymentData {
  amount: number
  currency: string
  email: string
  first_name: string
  last_name: string
  tx_ref: string
  callback_url: string
  return_url: string
  customization: {
    title: string
    description: string
  }
}
export async function POST(request: NextRequest) {
  try {
   
    await dbConnect()

    const body = await request.json()
    const { orderId, customerInfo } = body

    const order = await Order.findById(orderId)

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    
    const paymentData: PaymentData = {
      amount: order.subtotal + order.tax + order.shipping,
      currency: 'ETB',
      email: customerInfo.email,
      first_name: customerInfo.firstName,
      last_name: customerInfo.lastName,
      tx_ref: `tx-${order.orderNumber}`,
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
      return_url: `http://localhost:3000/checkout/orders/${order._id}/confirmation?tx_ref=tx-${order.orderNumber}`,
      customization: {
        title: 'Order Payment',
        description: `Payment for order ${order.orderNumber}`,
      },
    }
   
    const paymentResponse = await initializePayment(paymentData)
    
    await Order.findByIdAndUpdate(orderId, {
      transactionRef: paymentData.tx_ref,
    })
   
    return NextResponse.json({
      checkoutUrl: paymentResponse.data.checkout_url,
      transactionRef: paymentData.tx_ref,
    })
  } catch (error) {
    console.error('Error initializing payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
