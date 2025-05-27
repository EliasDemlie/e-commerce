import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/action/CurrentUser'
import User from '@/server/models/User'
import { Product } from '@/server/models/Product'
import Order from '@/server/models/Order'
import dbConnect from '@/lib/dbConnect'

export async function GET() {
  try {
    await dbConnect() 

    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const [totalUsers, totalProducts, totalOrders] = await Promise.all([
      User.countDocuments({ role: 'USER' }),
      Product.countDocuments(),
      Order.countDocuments(),
    ])

    const revenueResult = await Order.aggregate([
      {
        $match: {
          status: { $ne: 'cancelled' }, 
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$subtotal' }, 
        },
      },
    ])

    const totalRevenue = revenueResult[0]?.total || 0

   
    const recentOrders = await Order.find({
      userId: { $exists: true, $ne: null },
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'name email') 
      .lean()

    const recentUsers = await User.find({ role: 'USER' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt')
      .lean()

    return NextResponse.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      recentUsers,
    })
  } catch (error) {
    console.error('[ADMIN_STATS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
