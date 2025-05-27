import { type NextRequest, NextResponse } from 'next/server'

import { verifyPayment } from '@/lib/chapa'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    const body = await request.json()
    const { tx_ref } = body

    const verificationResult = await verifyPayment(tx_ref)

    if (verificationResult.status === 'success') {
      const orderNumber = tx_ref.split('tx-')[1]
      

      await Order.findOneAndUpdate(
        { orderNumber },
        {
          paymentStatus: 'completed',
          orderStatus: 'processing',
        }
      )

      return NextResponse.json({ success: true })
    } else {
      
      const orderNumber = tx_ref.split('tx-')[1]

      await Order.findOneAndUpdate({ orderNumber }, { paymentStatus: 'failed' })

      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error processing payment callback:', error)
    return NextResponse.json(
      { error: 'Failed to process payment callback' },
      { status: 500 }
    )
  }
}
