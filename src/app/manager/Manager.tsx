"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart3,
  Package,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Truck,
  Menu,
  X,
  Activity,
  Users,
  TrendingUp,
  UserPlus,
  MapPin,
  Phone,
  Mail,
} from "lucide-react"
import { Button } from "@/components/ui/button2"
import { cn } from "@/lib/utils"

import InventoryTab from "./components/inventory-tab"
import OrdersTab from "./components/orders-tab"
import ShipmentsTab from "./components/shipments-tab"
import CarriersTab from "./components/carriers-tab"
import AnalyticsDashboard from "./Dashboard"
import { fetchDashboardStats } from "./product/action/dashboard-action"



interface DashboardStats {
  totalInventory: {
    count: number
    percentChange: number
  }
  pendingOrders: {
    count: number
    percentChange: number
  }
  activeShipments: {
    count: number
    percentChange: number
  }
  monthlyRevenue: {
    amount: number
    percentChange: number
  }
  activeCarriers: {
    count: number
    percentChange: number
  }
}

const sidebarItems = [
  {
    id: "analytics",
    label: "Analytics Dashboard",
    icon: BarChart3,
    description: "Comprehensive business insights",
  },
  {
    id: "inventory",
    label: "Inventory Management",
    icon: Package,
    description: "Stock levels and product management",
  },
  {
    id: "orders",
    label: "Order Management",
    icon: ShoppingCart,
    description: "Order processing and tracking",
  },
  {
    id: "shipments",
    label: "Shipment Tracking",
    icon: Truck,
    description: "Delivery and logistics management",
  },
  {
    id: "carriers",
    label: "Carrier Management",
    icon: Users,
    description: "Carrier performance and assignments",
  },
]

export default function ManagerLayoutWithSidebar() {
  const [activeSection, setActiveSection] = useState("analytics")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [searchInventory, setSearchInventory] = useState("")
  const [searchOrders, setSearchOrders] = useState("")
  const [searchShipment, setSearchShipment] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  const [carrierFilter, setCarrierFilter] = useState("all")
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardStats = async () => {
    setIsLoading(true)
    try {
      const data = await fetchDashboardStats()
      setStats(data)
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      setError(error instanceof Error ? error.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    loadDashboardStats()
  }
  console.log(error)
  const renderContent = () => {
    switch (activeSection) {
      case "analytics":
        return <AnalyticsDashboard />

      case "inventory":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">Inventory Management</h1>
                <p className="text-gray-600 mt-1">Manage your product inventory and stock levels</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || refreshing}
                className="text-gray-600 border-gray-300"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>

            
            {stats && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Total Inventory</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalInventory.count.toLocaleString()}</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      {stats.totalInventory.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(stats.totalInventory.percentChange).toFixed(1)}% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Monthly Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${stats.monthlyRevenue.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      {stats.monthlyRevenue.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(stats.monthlyRevenue.percentChange).toFixed(1)}% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Low Stock Alert</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">12</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      Items need restocking
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$2.4M</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Total inventory worth
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <InventoryTab
              searchInventory={searchInventory}
              setSearchInventory={setSearchInventory}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              locationFilter={locationFilter}
              setLocationFilter={setLocationFilter}
            />
          </div>
        )

      case "orders":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">Order Management</h1>
                <p className="text-gray-600 mt-1">Process and track customer orders</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || refreshing}
                className="text-gray-600 border-gray-300"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>

            {/* Quick Stats for Orders */}
            {stats && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Pending Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.pendingOrders.count}</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      {stats.pendingOrders.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(stats.pendingOrders.percentChange).toFixed(1)}% from yesterday
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Processing</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">24</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <Activity className="h-4 w-4 mr-1" />
                      Orders in processing
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Completed Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">156</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Orders completed
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Revenue Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$12.4K</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <ArrowUpRight className="h-4 w-4 mr-1" />
                      Daily revenue
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <OrdersTab
              searchOrders={searchOrders}
              setSearchOrders={setSearchOrders}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
            />
          </div>
        )

      case "shipments":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">Shipment Tracking</h1>
                <p className="text-gray-600 mt-1">Monitor deliveries and logistics</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isLoading || refreshing}
                className="text-gray-600 border-gray-300"
              >
                {refreshing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Refresh
              </Button>
            </div>

            {/* Quick Stats for Shipments */}
            {stats && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Active Shipments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeShipments.count}</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      {stats.activeShipments.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(stats.activeShipments.percentChange).toFixed(1)}% from last week
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">In Transit</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">89</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <Truck className="h-4 w-4 mr-1" />
                      Currently shipping
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Delivered Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">142</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Successful deliveries
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">On-Time Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <Activity className="h-4 w-4 mr-1" />
                      Delivery performance
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <ShipmentsTab
              searchShipment={searchShipment}
              setSearchShipment={setSearchShipment}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              carrierFilter={carrierFilter}
              setCarrierFilter={setCarrierFilter}
            />
          </div>
        )

      case "carriers":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800">Carrier Management</h1>
                <p className="text-gray-600 mt-1">Manage delivery partners and performance</p>
              </div>
              <div className="flex gap-2">
                <Button variant="default" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Carrier
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isLoading || refreshing}
                  className="text-gray-600 border-gray-300"
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

            {/* Quick Stats for Carriers */}
            {stats && (
              <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Active Carriers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeCarriers.count}</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      {stats.activeCarriers.percentChange >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      {Math.abs(stats.activeCarriers.percentChange).toFixed(1)}% from last month
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Available Now</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <Activity className="h-4 w-4 mr-1" />
                      Ready for pickup
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">On Delivery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">7</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <Truck className="h-4 w-4 mr-1" />
                      Currently delivering
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Avg. Rating</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">4.8</div>
                    <div className="flex items-center mt-2 text-sm opacity-90">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Customer satisfaction
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Carrier Actions */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <UserPlus className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Recruit New Carrier</h3>
                      <p className="text-sm text-gray-600">Add new delivery partners to your network</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Assign Delivery Zones</h3>
                      <p className="text-sm text-gray-600">Manage carrier coverage areas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <BarChart3 className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Performance Review</h3>
                      <p className="text-sm text-gray-600">Evaluate carrier performance metrics</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <CarriersTab />
          </div>
        )

      default:
        return <AnalyticsDashboard />
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 relative">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-white shadow-lg transition-all duration-300 ease-in-out border-r border-gray-200 relative",
          sidebarOpen ? "w-80" : "w-16",
        )}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div>
                <h2 className="text-xl font-bold text-gray-800">Manager Portal</h2>
                <p className="text-sm text-gray-600">Business Management Suite</p>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-gray-600 hover:text-gray-800"
            >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <nav className="p-4 space-y-2 pb-32">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = activeSection === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200",
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800",
                )}
              >
                <Icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-500")} />
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <div className={cn("font-medium truncate", isActive ? "text-blue-700" : "text-gray-700")}>
                      {item.label}
                    </div>
                    <div className={cn("text-xs truncate", isActive ? "text-blue-600" : "text-gray-500")}>
                      {item.description}
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">{renderContent()}</div>
      </div>

      {/* Support Section - Fixed to bottom-right */}
      {sidebarOpen && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-lg shadow-lg max-w-xs">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1 bg-white/20 rounded">
                <Phone className="h-4 w-4" />
              </div>
              <div className="text-sm font-medium">Need Help?</div>
            </div>
            <div className="text-xs opacity-90 mb-3">Contact support for assistance</div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1 text-xs">
                <Mail className="h-3 w-3 mr-1" />
                Email
              </Button>
              <Button variant="secondary" size="sm" className="flex-1 text-xs">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
