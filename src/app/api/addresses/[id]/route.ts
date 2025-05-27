import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Address from '@/server/models/Address'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()

    
    const { id } = await context.params

    const address = await Address.findById(id)
    if (!address) {
      return NextResponse.json(
        { message: 'Address not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ address }, { status: 200 })
  } catch (error) {
    console.error('Error fetching address:', error)
    return NextResponse.json(
      { message: 'Error fetching address' },
      { status: 500 }
    )
  }
}
