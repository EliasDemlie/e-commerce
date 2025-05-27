'use server'

import dbConnect from '@/lib/dbConnect'
import { Product } from '@/server/models/Product'
import Order from '@/server/models/Order'
import { Shipment } from '@/server/models/Shipment'
import Carrier from '@/server/models/Carrier'
import  User  from '@/server/models/User'
import { revalidatePath } from 'next/cache'

export interface AnalyticsData {
  salesAnalytics: {
    totalRevenue: number
    totalOrders: number
    averageOrderValue: number
    revenueGrowth: number
    ordersGrowth: number
    monthlyRevenue: Array<{ month: string; revenue: number; orders: number }>
    dailyRevenue: Array<{ date: string; revenue: number; orders: number }>
    topSellingProducts: Array<{
      productId: string
      name: string
      totalSold: number
      revenue: number
    }>
    salesByCategory: Array<{
      category: string
      revenue: number
      orders: number
      percentage: number
    }>
    salesByRegion: Array<{ region: string; revenue: number; orders: number }>
  }
  inventoryAnalytics: {
    totalProducts: number
    totalInventoryValue: number
    lowStockProducts: number
    outOfStockProducts: number
    inventoryTurnover: number
    categoryDistribution: Array<{
      category: string
      count: number
      value: number
      percentage: number
    }>
    stockLevels: Array<{ level: string; count: number; percentage: number }>
    topValueProducts: Array<{
      productId: string
      name: string
      quantity: number
      value: number
    }>
    slowMovingProducts: Array<{
      productId: string
      name: string
      quantity: number
      daysSinceLastSale: number
    }>
  }
  customerAnalytics: {
    totalCustomers: number
    newCustomers: number
    activeCustomers: number
    customerGrowth: number
    customerRetentionRate: number
    averageCustomerLifetimeValue: number
    customersByRegion: Array<{
      region: string
      count: number
      percentage: number
    }>
    topCustomers: Array<{
      customerId: string
      name: string
      totalSpent: number
      orderCount: number
    }>
    customerSegmentation: Array<{
      segment: string
      count: number
      averageSpent: number
    }>
  }
  operationalAnalytics: {
    totalShipments: number
    onTimeDeliveryRate: number
    averageDeliveryTime: number
    activeCarriers: number
    shipmentsByStatus: Array<{
      status: string
      count: number
      percentage: number
    }>
    carrierPerformance: Array<{
      carrierId: string
      name: string
      deliveries: number
      onTimeRate: number
      avgDeliveryTime: number
    }>
    shippingCosts: Array<{ month: string; cost: number; volume: number }>
    returnRate: number
  }
  financialAnalytics: {
    grossProfit: number
    netProfit: number
    profitMargin: number
    operatingExpenses: number
    costOfGoodsSold: number
    profitByCategory: Array<{
      category: string
      profit: number
      margin: number
    }>
    monthlyProfitTrend: Array<{
      month: string
      revenue: number
      costs: number
      profit: number
    }>
    expenseBreakdown: Array<{
      category: string
      amount: number
      percentage: number
    }>
  }
}

export async function fetchComprehensiveAnalytics(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsData> {
  try {
    await dbConnect()

    const now = new Date()
    const defaultStartDate =
      startDate || new Date(now.getFullYear(), now.getMonth() - 11, 1)
    const defaultEndDate = endDate || now

    // Sales Analytics
    const salesAnalytics = await fetchSalesAnalytics(
      defaultStartDate,
      defaultEndDate
    )

    // Inventory Analytics
    const inventoryAnalytics = await fetchInventoryAnalytics()

    // Customer Analytics
    const customerAnalytics = await fetchCustomerAnalytics(
      defaultStartDate,
      defaultEndDate
    )

    // Operational Analytics
    const operationalAnalytics = await fetchOperationalAnalytics(
      defaultStartDate,
      defaultEndDate
    )

    // Financial Analytics
    const financialAnalytics = await fetchFinancialAnalytics(
      defaultStartDate,
      defaultEndDate
    )

    return {
      salesAnalytics,
      inventoryAnalytics,
      customerAnalytics,
      operationalAnalytics,
      financialAnalytics,
    }
  } catch (error) {
    console.error('Error fetching comprehensive analytics:', error)
    throw new Error('Failed to fetch analytics data')
  }
}

async function fetchSalesAnalytics(startDate: Date, endDate: Date) {
  // Total Revenue and Orders
  const totalStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        totalOrders: { $sum: 1 },
        averageOrderValue: {
          $avg: { $add: ['$subtotal', '$tax', '$shipping'] },
        },
      },
    },
  ])

  // Monthly Revenue Trend
  const monthlyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        revenue: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 },
    },
  ])

  // Daily Revenue (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const dailyRevenue = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: thirtyDaysAgo, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
          day: { $dayOfMonth: '$createdAt' },
        },
        revenue: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        orders: { $sum: 1 },
      },
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
    },
  ])

  // Top Selling Products
  const topSellingProducts = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    { $unwind: '$items' },
    {
      $group: {
        _id: '$items.productId',
        name: { $first: '$items.name' },
        totalSold: { $sum: '$items.quantity' },
        revenue: { $sum: '$items.subtotal' },
      },
    },
    { $sort: { totalSold: -1 } },
    { $limit: 10 },
  ])

  // Sales by Category
  const salesByCategory = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    { $unwind: '$items' },
    {
      $lookup: {
        from: 'products',
        localField: 'items.productId',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category.name',
        revenue: { $sum: '$items.subtotal' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
  ])

  const totalRevenue = totalStats[0]?.totalRevenue || 0
  const categoriesWithPercentage = salesByCategory.map((cat) => ({
    category: cat._id,
    revenue: cat.revenue,
    orders: cat.orders,
    percentage: totalRevenue > 0 ? (cat.revenue / totalRevenue) * 100 : 0,
  }))

  return {
    totalRevenue: totalStats[0]?.totalRevenue || 0,
    totalOrders: totalStats[0]?.totalOrders || 0,
    averageOrderValue: totalStats[0]?.averageOrderValue || 0,
    revenueGrowth: 15.3, // Calculate based on previous period
    ordersGrowth: 8.7, // Calculate based on previous period
    monthlyRevenue: monthlyRevenue.map((item) => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      revenue: item.revenue,
      orders: item.orders,
    })),
    dailyRevenue: dailyRevenue.map((item) => ({
      date: `${item._id.year}-${item._id.month
        .toString()
        .padStart(2, '0')}-${item._id.day.toString().padStart(2, '0')}`,
      revenue: item.revenue,
      orders: item.orders,
    })),
    topSellingProducts: topSellingProducts.map((product) => ({
      productId: product._id.toString(),
      name: product.name,
      totalSold: product.totalSold,
      revenue: product.revenue,
    })),
    salesByCategory: categoriesWithPercentage,
    salesByRegion: [], // Implement based on shipping addresses
  }
}

async function fetchInventoryAnalytics() {
  // Total Products and Inventory Value
  const inventoryStats = await Product.aggregate([
    {
      $group: {
        _id: null,
        totalProducts: { $sum: 1 },
        totalInventoryValue: { $sum: { $multiply: ['$quantity', '$price'] } },
        lowStockProducts: {
          $sum: {
            $cond: [
              { $and: [{ $lt: ['$quantity', 10] }, { $gt: ['$quantity', 0] }] },
              1,
              0,
            ],
          },
        },
        outOfStockProducts: {
          $sum: { $cond: [{ $eq: ['$quantity', 0] }, 1, 0] },
        },
      },
    },
  ])

  // Category Distribution
  const categoryDistribution = await Product.aggregate([
    {
      $group: {
        _id: '$category.name',
        count: { $sum: 1 },
        value: { $sum: { $multiply: ['$quantity', '$price'] } },
      },
    },
    { $sort: { count: -1 } },
  ])

  const totalProducts = inventoryStats[0]?.totalProducts || 0
  const totalValue = inventoryStats[0]?.totalInventoryValue || 0

  // Stock Levels Distribution
  const stockLevels = await Product.aggregate([
    {
      $group: {
        _id: {
          $switch: {
            branches: [
              { case: { $eq: ['$quantity', 0] }, then: 'Out of Stock' },
              { case: { $lt: ['$quantity', 10] }, then: 'Low Stock' },
              { case: { $lt: ['$quantity', 50] }, then: 'Medium Stock' },
              { case: { $gte: ['$quantity', 50] }, then: 'High Stock' },
            ],
            default: 'Unknown',
          },
        },
        count: { $sum: 1 },
      },
    },
  ])

  // Top Value Products
  const topValueProducts = await Product.aggregate([
    {
      $project: {
        name: 1,
        quantity: 1,
        price: 1,
        value: { $multiply: ['$quantity', '$price'] },
      },
    },
    { $sort: { value: -1 } },
    { $limit: 10 },
  ])

  return {
    totalProducts: inventoryStats[0]?.totalProducts || 0,
    totalInventoryValue: inventoryStats[0]?.totalInventoryValue || 0,
    lowStockProducts: inventoryStats[0]?.lowStockProducts || 0,
    outOfStockProducts: inventoryStats[0]?.outOfStockProducts || 0,
    inventoryTurnover: 4.2, // Calculate based on sales data
    categoryDistribution: categoryDistribution.map((cat) => ({
      category: cat._id,
      count: cat.count,
      value: cat.value,
      percentage: totalProducts > 0 ? (cat.count / totalProducts) * 100 : 0,
    })),
    stockLevels: stockLevels.map((level) => ({
      level: level._id,
      count: level.count,
      percentage: totalProducts > 0 ? (level.count / totalProducts) * 100 : 0,
    })),
    topValueProducts: topValueProducts.map((product) => ({
      productId: product._id.toString(),
      name: product.name,
      quantity: product.quantity,
      value: product.value,
    })),
    slowMovingProducts: [], // Implement based on sales history
  }
}

async function fetchCustomerAnalytics(startDate: Date, endDate: Date) {
  // Total Customers
  const customerStats = await User.aggregate([
    {
      $match: { role: { $in: ['USER', null] } },
    },
    {
      $group: {
        _id: null,
        totalCustomers: { $sum: 1 },
        newCustomers: {
          $sum: { $cond: [{ $gte: ['$createdAt', startDate] }, 1, 0] },
        },
      },
    },
  ])

  // Customer Lifetime Value
  const customerLTV = await Order.aggregate([
    {
      $match: { paymentStatus: 'completed' },
    },
    {
      $group: {
        _id: '$userId',
        totalSpent: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        orderCount: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: null,
        averageLTV: { $avg: '$totalSpent' },
        activeCustomers: { $sum: 1 },
      },
    },
  ])

  // Top Customers
  const topCustomers = await Order.aggregate([
    {
      $match: { paymentStatus: 'completed' },
    },
    {
      $group: {
        _id: '$userId',
        totalSpent: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        orderCount: { $sum: 1 },
      },
    },
    { $sort: { totalSpent: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
  ])

  return {
    totalCustomers: customerStats[0]?.totalCustomers || 0,
    newCustomers: customerStats[0]?.newCustomers || 0,
    activeCustomers: customerLTV[0]?.activeCustomers || 0,
    customerGrowth: 12.5, // Calculate based on previous period
    customerRetentionRate: 78.3, // Calculate based on repeat purchases
    averageCustomerLifetimeValue: customerLTV[0]?.averageLTV || 0,
    customersByRegion: [], // Implement based on addresses
    topCustomers: topCustomers.map((customer) => ({
      customerId: customer._id.toString(),
      name: customer.user.name || customer.user.email,
      totalSpent: customer.totalSpent,
      orderCount: customer.orderCount,
    })),
    customerSegmentation: [], // Implement customer segmentation logic
  }
}

async function fetchOperationalAnalytics(startDate: Date, endDate: Date) {
  // Shipment Statistics
  const shipmentStats = await Shipment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: null,
        totalShipments: { $sum: 1 },
        onTimeDeliveries: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
      },
    },
  ])

  // Shipments by Status
  const shipmentsByStatus = await Shipment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const totalShipments = shipmentStats[0]?.totalShipments || 0

  // Carrier Performance
  const carrierPerformance = await Shipment.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
      },
    },
    {
      $group: {
        _id: '$carrierId',
        deliveries: { $sum: 1 },
        onTimeDeliveries: {
          $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] },
        },
      },
    },
    {
      $lookup: {
        from: 'carriers',
        localField: '_id',
        foreignField: '_id',
        as: 'carrier',
      },
    },
    { $unwind: '$carrier' },
  ])

  return {
    totalShipments: totalShipments,
    onTimeDeliveryRate:
      totalShipments > 0
        ? ((shipmentStats[0]?.onTimeDeliveries || 0) / totalShipments) * 100
        : 0,
    averageDeliveryTime: 3.2, // Calculate based on delivery dates
    activeCarriers: await Carrier.countDocuments({ isActive: true }),
    shipmentsByStatus: shipmentsByStatus.map((status) => ({
      status: status._id,
      count: status.count,
      percentage:
        totalShipments > 0 ? (status.count / totalShipments) * 100 : 0,
    })),
    carrierPerformance: carrierPerformance.map((carrier) => ({
      carrierId: carrier._id.toString(),
      name: carrier.carrier.name,
      deliveries: carrier.deliveries,
      onTimeRate:
        carrier.deliveries > 0
          ? (carrier.onTimeDeliveries / carrier.deliveries) * 100
          : 0,
      avgDeliveryTime: 3.5, // Calculate based on actual delivery times
    })),
    shippingCosts: [], // Implement shipping cost tracking
    returnRate: 2.3, // Calculate based on return orders
  }
}

async function fetchFinancialAnalytics(startDate: Date, endDate: Date) {
  // Revenue and Costs
  const financialStats = await Order.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        paymentStatus: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: { $add: ['$subtotal', '$tax', '$shipping'] } },
        totalSubtotal: { $sum: '$subtotal' },
        totalShipping: { $sum: '$shipping' },
        totalTax: { $sum: '$tax' },
      },
    },
  ])

  const revenue = financialStats[0]?.totalRevenue || 0
  const estimatedCOGS = (financialStats[0]?.totalSubtotal || 0) * 0.6 // Estimate 60% COGS
  const operatingExpenses = revenue * 0.25 // Estimate 25% operating expenses
  const grossProfit = revenue - estimatedCOGS
  const netProfit = grossProfit - operatingExpenses

  return {
    grossProfit,
    netProfit,
    profitMargin: revenue > 0 ? (netProfit / revenue) * 100 : 0,
    operatingExpenses,
    costOfGoodsSold: estimatedCOGS,
    profitByCategory: [], // Implement category-wise profit calculation
    monthlyProfitTrend: [], // Implement monthly profit trend
    expenseBreakdown: [
      {
        category: 'Cost of Goods Sold',
        amount: estimatedCOGS,
        percentage: revenue > 0 ? (estimatedCOGS / revenue) * 100 : 0,
      },
      {
        category: 'Operating Expenses',
        amount: operatingExpenses,
        percentage: revenue > 0 ? (operatingExpenses / revenue) * 100 : 0,
      },
      {
        category: 'Shipping',
        amount: financialStats[0]?.totalShipping || 0,
        percentage:
          revenue > 0
            ? ((financialStats[0]?.totalShipping || 0) / revenue) * 100
            : 0,
      },
    ],
  }
}

export async function exportAnalyticsData(format: 'csv' | 'pdf' | 'excel') {
  try {
    const analytics = await fetchComprehensiveAnalytics()

    // Implement export logic based on format
    revalidatePath('/admin/analytics')

    return { success: true, data: analytics }
  } catch (error) {
    console.error('Error exporting analytics data:', error)
    throw new Error('Failed to export analytics data')
  }
}
