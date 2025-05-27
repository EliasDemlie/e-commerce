import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import bcrypt from 'bcrypt'

export async function POST(req: Request) {
  await dbConnect()
  const body = await req.json()

  const {
    name,
    email,
    password,
    contactPhone,
    vehicle,
    zone,
    isActive,
    notes,
  } = body

  // Validate required fields
  if (!name || !email || !password) {
    return new Response(
      JSON.stringify({ error: 'Name, email, and password are required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Check if user with this email already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create carrier with specific role and properties
    const carrier = new User({
      name,
      email,
      hashedPassword,
      role: 'CARRIER',
      isActive: isActive || false,
      contactPhone,
      vehicle,
      zone,
      notes,
      // Set activatedAt if carrier is active
      ...(isActive ? { activatedAt: new Date().toISOString() } : {}),
    })

    const savedCarrier = await carrier.save()

    // Remove sensitive information before returning
    const carrierToReturn = {
      _id: savedCarrier._id,
      name: savedCarrier.name,
      email: savedCarrier.email,
      role: savedCarrier.role,
      isActive: savedCarrier.isActive,
      contactPhone: savedCarrier.contactPhone,
      vehicle: savedCarrier.vehicle,
      zone: savedCarrier.zone,
      createdAt: savedCarrier.createdAt,
    }

    return new Response(
      JSON.stringify({
        message: 'Carrier created successfully',
        carrier: carrierToReturn,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating carrier:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
