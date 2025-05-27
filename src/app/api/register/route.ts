import dbConnect from '@/lib/dbConnect'
import User, { IUser } from '@/server/models/User'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'
import { z } from 'zod'

const baseUserSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  contactPhone: z.string().optional(),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' }),
  role: z.enum(['USER', 'ADMIN', 'MANAGER', 'CARRIER']).default('USER'),
})

const carrierSchema = baseUserSchema.extend({
  isActive: z.boolean().default(false),
  vehicle: z.string({ message: 'Vehicle is required for CARRIER' }),
  zone: z.string().optional(),
  activatedAt: z
    .string()
    .datetime({ message: 'Invalid activatedAt date' })
    .optional(),
  currentShipment: z
    .object({
      shipmentId: z.string({ message: 'Shipment ID is required for CARRIER' }),
      trackingNumber: z.string({
        message: 'Tracking number is required for CARRIER',
      }),
      orderNumber: z.string({
        message: 'Order number is required for CARRIER',
      }),
      estimatedDelivery: z.string({
        message: 'Estimated delivery is required for CARRIER',
      }),
    })
    .optional(),
})

const managerSchema = baseUserSchema.extend({
  warehouse: z.string({ message: 'Warehouse is required for MANAGER' }),
  contactPhone: z.string().optional(),
})

export async function POST(req: Request) {
  await dbConnect()

  try {
    const body = await req.json()
    console.log('Received data:', body)

    
    const baseValidation = baseUserSchema.safeParse(body)
    if (!baseValidation.success) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: baseValidation.error.format(),
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

 
    const existingUser = await User.findOne({ email: body.email })
    if (existingUser) {
      return new Response(JSON.stringify({ error: 'Email already in use' }), {
        status: 409,
        headers: { 'Content-Type': 'application/json' },
      })
    }

  
    const hashedPassword = await bcrypt.hash(body.password, 10)

 
    let userData: Partial<IUser> = {
      name: body.name,
      email: body.email,
      hashedPassword,
      contactPhone: body.contactPhone,
      role: body.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    if (body.role === 'CARRIER') {
      
      const carrierValidation = carrierSchema.safeParse(body)
      if (!carrierValidation.success) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed for carrier fields',
            details: carrierValidation.error.format(),
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      userData = {
        ...userData,
        isActive: body.isActive ?? false,
        vehicle: body.vehicle,
        zone: body.zone,
        activatedAt: body.activatedAt ? new Date(body.activatedAt) : undefined,
        currentShipment: body.currentShipment
          ? {
              ...body.currentShipment,
              shipmentId: new mongoose.Types.ObjectId(
                body.currentShipment.shipmentId
              ),
            }
          : undefined,
      }
    } else if (body.role === 'MANAGER') {
      
      const managerValidation = managerSchema.safeParse(body)
      if (!managerValidation.success) {
        return new Response(
          JSON.stringify({
            error: 'Validation failed for manager fields',
            details: managerValidation.error.format(),
          }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        )
      }

      userData = {
        ...userData,
        warehouse: body.warehouse,
      }
    }

    
    const user = new User(userData)
    const savedUser = await user.save()

   
    const userResponse = {
      _id: savedUser._id,
      name: savedUser.name,
      email: savedUser.email,
      role: savedUser.role,
      contactPhone: savedUser.contactPhone,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
      ...(savedUser.role === 'CARRIER' && {
        isActive: savedUser.isActive,
        vehicle: savedUser.vehicle,
        zone: savedUser.zone,
        activatedAt: savedUser.activatedAt,
        currentShipment: savedUser.currentShipment,
      }),
      ...(savedUser.role === 'MANAGER' && {
        warehouse: savedUser.warehouse,
      }),
    }

    console.log(`${body.role} created:`, savedUser)

    return new Response(
      JSON.stringify({
        message: `${body.role} created successfully`,
        user: userResponse,
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return new Response(
        JSON.stringify({
          error: 'Validation failed',
          details: error.errors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    console.error('Error creating user:', error)
    return new Response(
      JSON.stringify({ error: 'An unknown error occurred' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
