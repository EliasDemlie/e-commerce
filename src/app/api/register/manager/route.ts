import { type NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/server/models/User'
import { getCurrentUser } from '@/action/CurrentUser'

export async function GET(req: NextRequest) {
  try {
    
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    await dbConnect()
    const searchParams = req.nextUrl.searchParams
    console.log('searchParams', searchParams)
    const managers = await User.find(
      { role: 'MANAGER' },
      '_id name email createdAt contactPhone'
    ).sort({
      createdAt: -1,
    })

    return NextResponse.json({
      success: true,
      managers,
    })
  } catch (error) {
    console.error('Error fetching managers:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch managers' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {


    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      )
    }

    // Parse request body
    const body = await req.json()
    const { name, email, password } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Connect to database
    await dbConnect()

    // Check if email already exists
    const existingUser = await User.findOne({ email })

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Create new manager (using the server action instead)
    // This API endpoint can be used as an alternative to the server action

    return NextResponse.json({
      success: true,
      message: 'Please use the server action to add managers',
    })
  } catch (error) {
    console.error('Error adding manager:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to add manager' },
      { status: 500 }
    )
  }
}
