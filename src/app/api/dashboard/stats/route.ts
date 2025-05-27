import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/action/CurrentUser'
import { Product } from '@/server/models/Product'
import Order from '@/server/models/Order'
import { Shipment } from '@/server/models/Shipment'
import dbConnect from '@/lib/dbConnect'


export async function GET() {
  try {
    
    const currentUser = await getCurrentUser()

    if (!currentUser || currentUser.role !== 'MANAGER') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }

    await dbConnect()

    
    const now = new Date()
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const firstDayOfPrevMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    )
    const lastDayOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    const lastWeek = new Date(now)
    lastWeek.setDate(now.getDate() - 7)

    console.log('lastdayofprevmonth:', lastDayOfPrevMonth)
    const totalInventory = await Product.countDocuments({ inStock: true })
    const prevMonthInventory = await Product.countDocuments({
      inStock: true,
      updatedAt: { $lt: firstDayOfMonth, $gte: firstDayOfPrevMonth },
    })

    const inventoryPercentChange =
      prevMonthInventory > 0
        ? ((totalInventory - prevMonthInventory) / prevMonthInventory) * 100
        : 0

    
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['pending', 'processing'] },
    })
    const yesterdayPendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['pending', 'processing'] },
      createdAt: { $lt: yesterday },
    })

    const pendingOrdersPercentChange =
      yesterdayPendingOrders > 0
        ? ((pendingOrders - yesterdayPendingOrders) / yesterdayPendingOrders) *
          100
        : 0

    const activeShipments = await Shipment.countDocuments({
      status: { $in: ['processing', 'in_transit'] },
    })
    const lastWeekActiveShipments = await Shipment.countDocuments({
      status: { $in: ['processing', 'in_transit'] },
      createdAt: { $lt: lastWeek },
    })

    const shipmentsPercentChange =
      lastWeekActiveShipments > 0
        ? ((activeShipments - lastWeekActiveShipments) /
            lastWeekActiveShipments) *
          100
        : 0

  
    const currentMonthOrders = await Order.find({
      createdAt: { $gte: firstDayOfMonth },
      orderStatus: { $nin: ['cancelled', 'refunded'] },
      paymentStatus: 'completed',
    })

    const prevMonthOrders = await Order.find({
      createdAt: { $gte: firstDayOfPrevMonth, $lt: firstDayOfMonth },
      orderStatus: { $nin: ['cancelled', 'refunded'] },
      paymentStatus: 'completed',
    })

    const currentMonthRevenue = currentMonthOrders.reduce(
      (total, order) => total + order.subtotal + order.tax + order.shipping,
      0
    )

    const prevMonthRevenue = prevMonthOrders.reduce(
      (total, order) => total + order.subtotal + order.tax + order.shipping,
      0
    )

    const revenuePercentChange =
      prevMonthRevenue > 0
        ? ((currentMonthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
        : 0

    return NextResponse.json({
      totalInventory: {
        count: totalInventory,
        percentChange: inventoryPercentChange,
      },
      pendingOrders: {
        count: pendingOrders,
        percentChange: pendingOrdersPercentChange,
      },
      activeShipments: {
        count: activeShipments,
        percentChange: shipmentsPercentChange,
      },
      monthlyRevenue: {
        amount: currentMonthRevenue,
        percentChange: revenuePercentChange,
      },
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Error fetching dashboard statistics' },
      { status: 500 }
    )
  }
}
