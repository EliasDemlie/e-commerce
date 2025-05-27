'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  BarChart3,
  DollarSign,
  Users,
  Package,
  Truck,
  Download,
  Calendar,
  RefreshCw,
  Loader2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  LineChart,
  Activity,
} from 'lucide-react'
import {
  fetchComprehensiveAnalytics,
  exportAnalyticsData,
  type AnalyticsData,
} from './product/action/analytic-action'

export default function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [dateRange, setDateRange] = useState('last30days')
  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf' | 'excel'>(
    'csv'
  )
  const [activeTab, setActiveTab] = useState('overview')

  const loadAnalytics = async () => {
    setIsLoading(true)
    try {
      const data = await fetchComprehensiveAnalytics()
      setAnalytics(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [dateRange])

  const handleRefresh = () => {
    setRefreshing(true)
    loadAnalytics()
  }

  const handleExport = async () => {
    try {
      await exportAnalyticsData()
      
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 bg-white rounded-lg shadow-sm border">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">Error loading analytics: {error}</p>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Manager Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive business insights and performance metrics
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 Days</SelectItem>
              <SelectItem value="last30days">Last 30 Days</SelectItem>
              <SelectItem value="last90days">Last 90 Days</SelectItem>
              <SelectItem value="last12months">Last 12 Months</SelectItem>
              <SelectItem value="thisyear">This Year</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Select
              value={exportFormat}
              onValueChange={(value: 'csv' | 'pdf' | 'excel') =>
                setExportFormat(value)
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            <Button
              onClick={handleRefresh}
              variant="outline"
              size="sm"
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {analytics.salesAnalytics.totalRevenue.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              {analytics.salesAnalytics.revenueGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(analytics.salesAnalytics.revenueGrowth).toFixed(1)}%
              from last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.salesAnalytics.totalOrders.toLocaleString()}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              {analytics.salesAnalytics.ordersGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(analytics.salesAnalytics.ordersGrowth).toFixed(1)}% from
              last period
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Active Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.customerAnalytics.activeCustomers.toLocaleString()}
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              {analytics.customerAnalytics.customerGrowth >= 0 ? (
                <ArrowUpRight className="h-4 w-4 mr-1" />
              ) : (
                <ArrowDownRight className="h-4 w-4 mr-1" />
              )}
              {Math.abs(analytics.customerAnalytics.customerGrowth).toFixed(1)}%
              growth rate
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">
              Profit Margin
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.financialAnalytics.profitMargin.toFixed(1)}%
            </div>
            <div className="flex items-center mt-2 text-sm opacity-90">
              <Activity className="h-4 w-4 mr-1" />
              Net Profit: $
              {analytics.financialAnalytics.netProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5 bg-white border">
          <TabsTrigger
            value="overview"
            className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="sales"
            className="data-[state=active]:bg-green-50 data-[state=active]:text-green-700"
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Sales
          </TabsTrigger>
          <TabsTrigger
            value="inventory"
            className="data-[state=active]:bg-purple-50 data-[state=active]:text-purple-700"
          >
            <Package className="h-4 w-4 mr-2" />
            Inventory
          </TabsTrigger>
          <TabsTrigger
            value="customers"
            className="data-[state=active]:bg-orange-50 data-[state=active]:text-orange-700"
          >
            <Users className="h-4 w-4 mr-2" />
            Customers
          </TabsTrigger>
          <TabsTrigger
            value="operations"
            className="data-[state=active]:bg-red-50 data-[state=active]:text-red-700"
          >
            <Truck className="h-4 w-4 mr-2" />
            Operations
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5" />
                  Revenue Trend (Monthly)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesAnalytics.monthlyRevenue
                    .slice(-6)
                    .map((month) => (
                      <div
                        key={month.month}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-600">
                          {month.month}
                        </span>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${month.revenue.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {month.orders} orders
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Sales by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesAnalytics.salesByCategory
                    .slice(0, 5)
                    .map((category) => (
                      <div key={category.category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">
                            {category.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {category.percentage.toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${category.percentage}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-xs text-gray-500">
                          <span>${category.revenue.toLocaleString()}</span>
                          <span>{category.orders} orders</span>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-blue-600">
                {analytics.inventoryAnalytics.totalProducts}
              </div>
              <div className="text-sm text-gray-600">Total Products</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-green-600">
                $
                {analytics.inventoryAnalytics.totalInventoryValue.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Inventory Value</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-orange-600">
                {analytics.operationalAnalytics.onTimeDeliveryRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">On-Time Delivery</div>
            </Card>
            <Card className="text-center p-4">
              <div className="text-2xl font-bold text-purple-600">
                {analytics.customerAnalytics.customerRetentionRate.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Customer Retention</div>
            </Card>
          </div>
        </TabsContent>

        {/* Sales Analytics Tab */}
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Sales Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Average Order Value</span>
                  <span className="font-semibold">
                    ${analytics.salesAnalytics.averageOrderValue.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Revenue</span>
                  <span className="font-semibold">
                    ${analytics.salesAnalytics.totalRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Total Orders</span>
                  <span className="font-semibold">
                    {analytics.salesAnalytics.totalOrders}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Revenue Growth</span>
                  <span
                    className={`font-semibold ${
                      analytics.salesAnalytics.revenueGrowth >= 0
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {analytics.salesAnalytics.revenueGrowth >= 0 ? '+' : ''}
                    {analytics.salesAnalytics.revenueGrowth.toFixed(1)}%
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Top Selling Products */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.salesAnalytics.topSellingProducts.map(
                    (product, index) => (
                      <div
                        key={product.productId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-sm text-gray-600">
                              {product.totalSold} units sold
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${product.revenue.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Revenue</div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Daily Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Revenue Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-1">
                {analytics.salesAnalytics.dailyRevenue
                  .slice(-30)
                  .map((day, index) => (
                    <div
                      key={day.date}
                      className="flex-1 flex flex-col items-center"
                    >
                      <div
                        className="w-full bg-blue-500 rounded-t"
                        style={{
                          height: `${Math.max(
                            (day.revenue /
                              Math.max(
                                ...analytics.salesAnalytics.dailyRevenue.map(
                                  (d) => d.revenue
                                )
                              )) *
                              200,
                            4
                          )}px`,
                        }}
                        title={`${day.date}: $${day.revenue.toLocaleString()}`}
                      />
                      {index % 5 === 0 && (
                        <div className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-left">
                          {new Date(day.date).getDate()}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Analytics Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Inventory Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Inventory Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.inventoryAnalytics.totalProducts}
                    </div>
                    <div className="text-sm text-gray-600">Total Products</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      $
                      {analytics.inventoryAnalytics.totalInventoryValue.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Value</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {analytics.inventoryAnalytics.lowStockProducts}
                    </div>
                    <div className="text-sm text-gray-600">Low Stock</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {analytics.inventoryAnalytics.outOfStockProducts}
                    </div>
                    <div className="text-sm text-gray-600">Out of Stock</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stock Levels Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Stock Levels Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.inventoryAnalytics.stockLevels.map((level) => (
                    <div key={level.level} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          {level.level}
                        </span>
                        <span className="text-sm text-gray-600">
                          {level.count} products ({level.percentage.toFixed(1)}
                          %)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            level.level === 'Out of Stock'
                              ? 'bg-red-500'
                              : level.level === 'Low Stock'
                              ? 'bg-yellow-500'
                              : level.level === 'Medium Stock'
                              ? 'bg-blue-500'
                              : 'bg-green-500'
                          }`}
                          style={{ width: `${level.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.inventoryAnalytics.categoryDistribution.map(
                  (category) => (
                    <div
                      key={category.category}
                      className="p-4 border rounded-lg"
                    >
                      <div className="font-semibold">{category.category}</div>
                      <div className="text-sm text-gray-600 mt-1">
                        {category.count} products
                      </div>
                      <div className="text-sm text-gray-600">
                        ${category.value.toLocaleString()} value
                      </div>
                      <div className="text-xs text-gray-500">
                        {category.percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Top Value Products */}
          <Card>
            <CardHeader>
              <CardTitle>Highest Value Products</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analytics.inventoryAnalytics.topValueProducts.map(
                  (product, index) => (
                    <div
                      key={product.productId}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">
                            Quantity: {product.quantity}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          ${product.value.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Total Value</div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Customer Analytics Tab */}
        <TabsContent value="customers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Customer Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Metrics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {analytics.customerAnalytics.totalCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Total Customers</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {analytics.customerAnalytics.newCustomers}
                  </div>
                  <div className="text-sm text-gray-600">New Customers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {analytics.customerAnalytics.activeCustomers}
                  </div>
                  <div className="text-sm text-gray-600">Active Customers</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    $
                    {analytics.customerAnalytics.averageCustomerLifetimeValue.toFixed(
                      0
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    Avg. Lifetime Value
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Top Customers */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top Customers by Spending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.customerAnalytics.topCustomers.map(
                    (customer, index) => (
                      <div
                        key={customer.customerId}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-semibold">
                            {index + 1}
                          </div>
                          <div>
                            <div className="font-medium">{customer.name}</div>
                            <div className="text-sm text-gray-600">
                              {customer.orderCount} orders
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">
                            ${customer.totalSpent.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Spent
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Growth Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.customerAnalytics.customerGrowth >= 0 ? '+' : ''}
                  {analytics.customerAnalytics.customerGrowth.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Growth rate this period</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Retention Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {analytics.customerAnalytics.customerRetentionRate.toFixed(1)}
                  %
                </div>
                <p className="text-sm text-gray-600">Customer retention</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Avg. Lifetime Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  $
                  {analytics.customerAnalytics.averageCustomerLifetimeValue.toFixed(
                    0
                  )}
                </div>
                <p className="text-sm text-gray-600">Per customer</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operations Analytics Tab */}
        <TabsContent value="operations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Operational Metrics */}
            <Card>
              <CardHeader>
                <CardTitle>Operational Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {analytics.operationalAnalytics.totalShipments}
                    </div>
                    <div className="text-sm text-gray-600">Total Shipments</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {analytics.operationalAnalytics.onTimeDeliveryRate.toFixed(
                        1
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      On-Time Delivery
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {analytics.operationalAnalytics.averageDeliveryTime}
                    </div>
                    <div className="text-sm text-gray-600">
                      Avg. Delivery Days
                    </div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {analytics.operationalAnalytics.activeCarriers}
                    </div>
                    <div className="text-sm text-gray-600">Active Carriers</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shipment Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Shipment Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.operationalAnalytics.shipmentsByStatus.map(
                    (status) => (
                      <div key={status.status} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium capitalize">
                            {status.status.replace('_', ' ')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {status.count} ({status.percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              status.status === 'delivered'
                                ? 'bg-green-500'
                                : status.status === 'in_transit'
                                ? 'bg-blue-500'
                                : status.status === 'processing'
                                ? 'bg-yellow-500'
                                : 'bg-red-500'
                            }`}
                            style={{ width: `${status.percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Carrier Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Carrier Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.operationalAnalytics.carrierPerformance.map(
                  (carrier, index) => (
                    <div
                      key={carrier.carrierId}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{carrier.name}</div>
                          <div className="text-sm text-gray-600">
                            {carrier.deliveries} deliveries
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">
                          {carrier.onTimeRate.toFixed(1)}% on-time
                        </div>
                        <div className="text-sm text-gray-600">
                          {carrier.avgDeliveryTime.toFixed(1)} days avg
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </CardContent>
          </Card>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-red-600 mb-2">
                  {analytics.operationalAnalytics.returnRate.toFixed(1)}%
                </div>
                <p className="text-sm text-gray-600">Of total shipments</p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-lg">Delivery Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {analytics.operationalAnalytics.onTimeDeliveryRate.toFixed(1)}
                  %
                </div>
                <p className="text-sm text-gray-600">On-time delivery rate</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
