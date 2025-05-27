import { type NextRequest, NextResponse } from 'next/server'
import { verifyPayment } from '@/lib/chapa'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'


export async function GET(
  req: NextRequest,
  context: { params: { txRef: string } }
) {
  try {
    const { txRef } = context.params

    const verificationResult = await verifyPayment(txRef)

    if (verificationResult.status === 'success') {
      await dbConnect()

      const orderNumber = txRef.split('tx-')[1]

      await Order.findOneAndUpdate(
        { orderNumber },
        {
          paymentStatus: 'completed',
          orderStatus: 'processing',
        }
      )

      return NextResponse.json({
        success: true,
        data: verificationResult.data,
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          message: 'Payment verification failed',
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}
