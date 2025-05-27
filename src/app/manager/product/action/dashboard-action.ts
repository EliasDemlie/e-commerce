'use server'

import dbConnect from '@/lib/dbConnect'
import Carrier from '@/server/models/Carrier'
import Order from '@/server/models/Order'
import { Product } from '@/server/models/Product'
import { Shipment } from '@/server/models/Shipment'
import { revalidatePath } from 'next/cache'

export async function fetchDashboardStats() {
  try {
    await dbConnect()

    // Get total inventory count
    const totalInventory = await Product.aggregate([
      { $group: { _id: null, count: { $sum: '$quantity' } } },
    ])

    // Get pending orders count
    const pendingOrders = await Order.countDocuments({ orderStatus: 'pending' })

    // Get active shipments count
    const activeShipments = await Shipment.countDocuments({
      status: { $in: ['processing', 'in_transit'] },
    })

    // Get active carriers count
    const activeCarriers = await Carrier.countDocuments({ isActive: true })

    // Get monthly revenue
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: 'completed',
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        },
      },
    ])

    // Calculate percentage changes (you can implement historical comparison logic here)
    return {
      totalInventory: {
        count: totalInventory.length > 0 ? totalInventory[0].count : 0,
        percentChange: 5.2, // Replace with actual calculation
      },
      pendingOrders: {
        count: pendingOrders,
        percentChange: -12.5, // Replace with actual calculation
      },
      activeShipments: {
        count: activeShipments,
        percentChange: 8.7, // Replace with actual calculation
      },
      monthlyRevenue: {
        amount: monthlyRevenue.length > 0 ? monthlyRevenue[0].total : 0,
        percentChange: 15.3, // Replace with actual calculation
      },
      activeCarriers: {
        count: activeCarriers,
        percentChange: 0, // Replace with actual calculation
      },
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    throw new Error('Failed to fetch dashboard statistics')
  }
}

export async function refreshDashboard() {
  revalidatePath('/manager')
  return { success: true }
}
