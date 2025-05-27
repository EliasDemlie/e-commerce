import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import {Shipment} from '@/server/models/Shipment'

interface CarrierUpdateData {
  name?: string
  contactPhone?: string
  contactEmail?: string
  vehicle?: string
  notes?: string
  zone?: string
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect()
    const { id } = await params

    const carrier = await User.findById(id).select('-hashedPassword')

    if (!carrier || carrier.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }

    return NextResponse.json({ carrier })
  } catch (error) {
    console.error('Error fetching carrier:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params
    const body = await request.json()

    // Fields that are allowed to be updated
    const allowedFields = [
      'name',
      'contactPhone',
      'contactEmail',
      'vehicle',
      'notes',
      'zone',
    ]

    // Filter out any fields that aren't in the allowed list
    const updateData: CarrierUpdateData = Object.keys(body)
      .filter((key) => allowedFields.includes(key))
      .reduce((obj: CarrierUpdateData, key) => {
        obj[key as keyof CarrierUpdateData] = body[key]
        return obj
      }, {})

    const carrier = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select('-hashedPassword')

    if (!carrier || carrier.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }

    return NextResponse.json({ carrier })
  } catch (error) {
    console.error('Error updating carrier:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const { id } = params

    // Check if carrier has active shipments
    const carrier = await User.findById(id)

    if (!carrier || carrier.role !== 'CARRIER') {
      return NextResponse.json({ error: 'Carrier not found' }, { status: 404 })
    }

    if (carrier.currentShipment) {
      return NextResponse.json(
        { error: 'Cannot delete carrier with active shipments' },
        { status: 400 }
      )
    }

    // Check if carrier has any shipment history
    const shipmentCount = await Shipment.countDocuments({ carrierId: id })

    if (shipmentCount > 0) {
      // If carrier has shipment history, just deactivate instead of deleting
      carrier.isActive = false
      carrier.isDeleted = true
      await carrier.save()

      return NextResponse.json({
        message: 'Carrier has been deactivated and marked as deleted',
        deactivated: true,
      })
    }

    // If no shipment history, can safely delete
    await User.findByIdAndDelete(id)

    return NextResponse.json({
      message: 'Carrier has been permanently deleted',
      deleted: true,
    })
  } catch (error) {
    console.error('Error deleting carrier:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
