import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/action/CurrentUser'
import Order from '@/server/models/Order'
import User from '@/server/models/User'
import { Product } from '@/server/models/Product'

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    // Get current date and last month's date
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)

    // Get total revenue and change
    const currentMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ])

    const lastMonthRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: lastMonth,
            $lt: new Date(now.getFullYear(), now.getMonth(), 1),
          },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' },
        },
      },
    ])

    const totalRevenue = currentMonthRevenue[0]?.total || 0
    const revenueChange = lastMonthRevenue[0]?.total
      ? ((totalRevenue - lastMonthRevenue[0].total) /
          lastMonthRevenue[0].total) *
        100
      : 0

    // Get revenue history for the last 6 months
    const revenueHistory = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          },
          status: { $ne: 'cancelled' },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          amount: { $sum: '$total' },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get total orders and change
    const currentMonthOrders = await Order.countDocuments({
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
    })

    const lastMonthOrders = await Order.countDocuments({
      createdAt: {
        $gte: lastMonth,
        $lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    })

    const totalOrders = currentMonthOrders
    const ordersChange = lastMonthOrders
      ? ((totalOrders - lastMonthOrders) / lastMonthOrders) * 100
      : 0

    // Get orders history for the last 6 months
    const ordersHistory = await Order.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get total customers and change
    const currentMonthCustomers = await User.countDocuments({
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
      role: 'USER',
    })

    const lastMonthCustomers = await User.countDocuments({
      createdAt: {
        $gte: lastMonth,
        $lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
      role: 'USER',
    })

    const totalCustomers = currentMonthCustomers
    const customersChange = lastMonthCustomers
      ? ((totalCustomers - lastMonthCustomers) / lastMonthCustomers) * 100
      : 0

    // Get customers history for the last 6 months
    const customersHistory = await User.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth() - 6, 1),
          },
          role: 'USER',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ])

    // Get total products and change
    const currentMonthProducts = await Product.countDocuments({
      createdAt: { $gte: new Date(now.getFullYear(), now.getMonth(), 1) },
    })

    const lastMonthProducts = await Product.countDocuments({
      createdAt: {
        $gte: lastMonth,
        $lt: new Date(now.getFullYear(), now.getMonth(), 1),
      },
    })

    const totalProducts = currentMonthProducts
    const productsChange = lastMonthProducts
      ? ((totalProducts - lastMonthProducts) / lastMonthProducts) * 100
      : 0

    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ])

    return NextResponse.json({
      revenue: {
        total: totalRevenue,
        change: revenueChange,
        history: revenueHistory.map((item) => ({
          date: item._id,
          amount: item.amount,
        })),
      },
      orders: {
        total: totalOrders,
        change: ordersChange,
        history: ordersHistory.map((item) => ({
          date: item._id,
          count: item.count,
        })),
      },
      customers: {
        total: totalCustomers,
        change: customersChange,
        history: customersHistory.map((item) => ({
          date: item._id,
          count: item.count,
        })),
      },
      products: {
        total: totalProducts,
        change: productsChange,
        byCategory: productsByCategory.map((item) => ({
          category: item._id,
          count: item.count,
        })),
      },
    })
  } catch (error) {
    console.error('[ANALYTICS_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
