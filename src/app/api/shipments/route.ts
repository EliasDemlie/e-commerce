import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'
import Order from '@/server/models/Order'
import { Shipment } from '@/server/models/Shipment'
import User from '@/server/models/User'
import { Carrier } from '@/type/Carrier'
import { OrderItem } from '@/type/OrderItem'
import { type NextRequest, NextResponse } from 'next/server'

// Define the query interface
interface ShipmentQuery {
  status?: string
  carrierId?: string
  trackingNumber?: { $regex: string; $options: string }
}

export async function GET(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (
      !currentUser ||
      (currentUser.role !== 'MANAGER' && currentUser.role !== 'ADMIN' && currentUser.role !== 'CARRIER')
    ) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    const searchParams = req.nextUrl.searchParams
    const status = searchParams.get('status')
    const carrierId = searchParams.get('carrierId')
    const trackingNumber = searchParams.get('trackingNumber')
    const limit = searchParams.get('limit')
      ? Number.parseInt(searchParams.get('limit')!)
      : 50
    const page = searchParams.get('page')
      ? Number.parseInt(searchParams.get('page')!)
      : 1

    // Build query
    const query: ShipmentQuery = {}
    if (status) query.status = status
    if (carrierId) query.carrierId = carrierId
    if (trackingNumber)
      query.trackingNumber = { $regex: trackingNumber, $options: 'i' }

    const shipments = await Shipment.find(query)
      .populate<{ carrierId: Carrier | null }>('carrierId')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)

    const formattedShipments = shipments.map((shipment) => {
      const carrier = shipment.carrierId as Carrier | null
      return {
        _id: shipment._id,
        orderId: shipment.orderId,
        trackingNumber: shipment.trackingNumber,
        carrierId: carrier?._id,
        carrier: {
          name: carrier?.name ?? 'Unknown',
          trackingUrlTemplate: carrier?.trackingUrlTemplate,
        },
        status: shipment.status,
        dateShipped: shipment.dateShipped,
        dateDelivered: shipment.dateDelivered,
        items: shipment.items,
        customer: shipment.customer,
        notes: shipment.notes,
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
      }
    })

    const totalShipments = await Shipment.countDocuments(query)

    return NextResponse.json({
      shipments: formattedShipments,
      pagination: {
        total: totalShipments,
        page,
        limit,
        pages: Math.ceil(totalShipments / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching shipments:', error)
    return NextResponse.json(
      { message: 'Error fetching shipments' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'MANAGER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()
    const shipmentData = await req.json()

    if (!shipmentData.trackingNumber || !shipmentData.carrierId) {
      return NextResponse.json(
        { message: 'Tracking number and carrier are required' },
        { status: 400 }
      )
    }

    const carrier = await User.findById(shipmentData.carrierId)
    if (!carrier) {
      return NextResponse.json(
        { message: 'Carrier not found' },
        { status: 404 }
      )
    }

    if (shipmentData.orderId) {
      const order = await Order.findById(shipmentData.orderId)
      if (!order) {
        return NextResponse.json(
          { message: 'Order not found' },
          { status: 404 }
        )
      }

      if (['pending', 'processing'].includes(order.orderStatus)) {
        order.orderStatus = 'shipped'
        await order.save()
      }

      if (!shipmentData.items || !shipmentData.items.length) {
        shipmentData.items = order.items.map((item: OrderItem) => ({
          productId: item.productId,
          quantity: item.quantity,
        }))
      }
    }

    const shipment = new Shipment(shipmentData)
    await shipment.save()

    return NextResponse.json({
      message: 'Shipment created successfully',
      shipment,
    })
  } catch (error) {
    console.error('Error creating shipment:', error)
    return NextResponse.json(
      { message: 'Error creating shipment' },
      { status: 500 }
    )
  }
}
