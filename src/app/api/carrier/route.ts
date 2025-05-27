import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'

interface CarrierQuery {
  role: string
  $or?: Array<{ [key: string]: { $regex: string; $options: string } }>
  zone?: string
  isActive?: boolean
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect()

   
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const zone = searchParams.get('zone') || ''
    const status = searchParams.get('status')
    const sort = searchParams.get('sort') || 'name:asc'
    const limit = Number.parseInt(searchParams.get('limit') || '100')
    const page = Number.parseInt(searchParams.get('page') || '1')

    const query: CarrierQuery = { role: 'CARRIER' }

    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { contactPhone: { $regex: search, $options: 'i' } },
        { contactEmail: { $regex: search, $options: 'i' } },
      ]
    }

    
    if (zone) {
      query.zone = zone
    }

   
    if (status === 'active') {
      query.isActive = true
    } else if (status === 'inactive') {
      query.isActive = false
    }

    // Parse sort parameter
    const [sortField, sortOrder] = sort.split(':')
    const sortOptions: Record<string, 1 | -1> = {
      [sortField]: sortOrder === 'desc' ? -1 : 1,
    }

    // Calculate pagination
    const skip = (page - 1) * limit

    // Execute query
    const carriers = await User.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-hashedPassword') // Exclude sensitive data

    // Get total count for pagination
    const totalCount = await User.countDocuments(query)

    // Format carriers to match the expected Carrier type
    const formattedCarriers = carriers.map((carrier) => ({
      _id: carrier._id.toString(),
      name: carrier.name,
      contactPhone: carrier.contactPhone,
      contactEmail: carrier.contactEmail || carrier.email,
      vehicle: carrier.vehicle,
      zone: carrier.zone,
      isActive: carrier.isActive || false,
      activatedAt: carrier.activatedAt,
      currentShipment: carrier.currentShipment,
    }))

    return NextResponse.json({
      carriers: formattedCarriers,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching carriers:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
