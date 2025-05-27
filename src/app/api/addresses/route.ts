import { type NextRequest, NextResponse } from 'next/server'
import Address from '@/server/models/Address'
import connectDB from '@/lib/dbConnect'
import { getCurrentUser } from '@/action/CurrentUser'


type AddressResponse = {
  _id: string
  userId: string
  fullName: string
  email?: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

type AddressDocument = {
  _id: string
  userId: string
  fullName: string
  email?: string
  phoneNumber?: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
  __v: number
}

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const addresses = await Address.find({ userId }).lean<AddressDocument[]>()

    const formattedAddresses: AddressResponse[] = addresses.map((address) => ({
      ...address,
      _id: address._id.toString(),
      userId: address.userId.toString(),
      createdAt: address.createdAt.toISOString(),
      updatedAt: address.updatedAt.toISOString(),
    }))

    return NextResponse.json(formattedAddresses)
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    await connectDB()

    const body = await request.json()
    console.log('POST /api/addresses received:', body)

    const userId = currentUser._id 
   
    const shippingData = {
      userId,
      fullName: body.shipping.fullName,
      email: body.shipping.email,
      phoneNumber: body.shipping.phoneNumber || '000-000-0000',
      addressLine1: body.shipping.addressLine1,
      addressLine2: body.shipping.addressLine2,
      city: body.shipping.city,
      state: body.shipping.state,
      postalCode: body.shipping.postalCode,
      country: body.shipping.country,
      isDefault: body.shipping.isDefault || false,
    }

    if (
      !shippingData.fullName ||
      !shippingData.addressLine1 ||
      !shippingData.city ||
      !shippingData.state ||
      !shippingData.postalCode ||
      !shippingData.country
    ) {
      return NextResponse.json(
        { error: 'Missing required shipping address fields' },
        { status: 400 }
      )
    }

    // Validate and process billing address
    const billingData = {
      userId,
      fullName: body.billing.fullName,
      email: body.billing.email,
      phoneNumber: body.billing.phoneNumber || '000-000-0000',
      addressLine1: body.billing.addressLine1,
      addressLine2: body.billing.addressLine2,
      city: body.billing.city,
      state: body.billing.state,
      postalCode: body.billing.postalCode,
      country: body.billing.country,
      isDefault: body.billing.isDefault || false,
    }

    if (
      !billingData.fullName ||
      !billingData.addressLine1 ||
      !billingData.city ||
      !billingData.state ||
      !billingData.postalCode ||
      !billingData.country
    ) {
      return NextResponse.json(
        { error: 'Missing required billing address fields' },
        { status: 400 }
      )
    }

    // Handle default address logic
    if (shippingData.isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      )
    }
    if (billingData.isDefault) {
      await Address.updateMany(
        { userId, isDefault: true },
        { isDefault: false }
      )
    }

    // Create addresses
    const [shippingAddress, billingAddress] = await Promise.all([
      Address.create(shippingData),
      Address.create(billingData),
    ])

    const formattedShipping: AddressResponse = {
      ...shippingAddress.toObject(),
      _id: shippingAddress._id.toString(),
      userId: shippingAddress.userId.toString(),
      createdAt: shippingAddress.createdAt.toISOString(),
      updatedAt: shippingAddress.updatedAt.toISOString(),
    }

    const formattedBilling: AddressResponse = {
      ...billingAddress.toObject(),
      _id: billingAddress._id.toString(),
      userId: billingAddress.userId.toString(),
      createdAt: billingAddress.createdAt.toISOString(),
      updatedAt: billingAddress.updatedAt.toISOString(),
    }

    return NextResponse.json(
      {
        shippingAddressId: formattedShipping._id,
        billingAddressId: formattedBilling._id,
        shippingAddress: formattedShipping,
        billingAddress: formattedBilling,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating addresses:', error)
    return NextResponse.json(
      { error: `Failed to create addresses` },
      { status: 500 }
    )
  }
}
