import  Order  from '@/server/models/Order'
import { NextResponse } from 'next/server'

const CHAPA_SECRET_KEY = process.env.CHAPA_SECRET_KEY as string
const CHAPA_VERIFY_URL = 'https://api.chapa.co/v1/transaction/verify/'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { tx_ref } = body

    if (!tx_ref) {
      return NextResponse.json(
        { error: 'Transaction reference is required' },
        { status: 400 }
      )
    }

    const chapaResponse = await fetch(`${CHAPA_VERIFY_URL}${tx_ref}`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${CHAPA_SECRET_KEY}` },
    })

    const chapaData = await chapaResponse.json()
   

    if (chapaData.status !== 'success' || chapaData.data.status !== 'success') {
      return NextResponse.json(
        { error: 'Payment not successful' },
        { status: 400 }
      )
    }

    const order = await Order.findOneAndUpdate(
      { paymentIntentId: tx_ref },
      { status: 'processing' },
      { new: true }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    return NextResponse.json({
      message: 'Payment verified successfully',
      order,
    })
  } catch (error) {
    console.error('Error verifying payment:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
