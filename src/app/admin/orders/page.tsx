'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Search, Filter, Download, Package, Loader2 } from 'lucide-react'
import { useNotificationContext } from '@/provider/NotificationProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Order, OrderStatus } from '@/type/Order'
import OrdersTable from '@/components/admin/order-table'
import Image from 'next/image'
import { OrderItem } from '@/type/OrderItem'

export default function OrdersPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const [filteredOrder, setFilteredOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const { addNotification } = useNotificationContext()

  useEffect(() => {
    fetchOrder()
  }, [])

  useEffect(() => {
    filterOrder()
  }, [order, searchQuery, statusFilter])

  const fetchOrder = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Failed to fetch order')
      }
      const data = await response.json()
      console.log("orders",data.orders)
      setOrder(data.orders || data)
    } catch (error) {
      console.error('Error fetching order:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to fetch order',
        type: 'system',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterOrder = () => {
    if (!order) {
      setFilteredOrder(null)
      return
    }

    let matches = true

    if (searchQuery) {
      matches =
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some((item: OrderItem) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    }

    if (statusFilter !== 'all') {
      matches = matches && order.orderStatus === statusFilter
    }

    setFilteredOrder(matches ? order : null)
  }

  const handleStatusChange = async (
    orderId: string,
    newStatus: OrderStatus
  ) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderStatus: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      setOrder((prev) =>
        prev && prev._id === orderId
          ? { ...prev, orderStatus: newStatus }
          : prev
      )

      addNotification({
        title: 'Success',
        message: `Order #${order?.orderNumber || 'Unknown'} status updated to ${newStatus}`,
        type: 'order',
      })
    } catch (error) {
      console.error('Error updating order status:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to update order status',
        type: 'system',
      })
    }
  }

  const handleViewDetails = (orderId: string) => {
    if (order && order._id === orderId) {
      setSelectedOrder(order)
      setIsDetailsOpen(true)
    }
  }

  const exportOrder = () => {
    addNotification({
      title: 'Export Started',
      message: 'Your order export is being processed',
      type: 'system',
    })
  }


  console.log("orderfrom orderpage",order)
  if (isLoading) {
      return (
        <div className="container mx-auto py-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
        </div>
      )
    }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Order</h1>
        <Button onClick={exportOrder}>
          <Download className="w-4 h-4 mr-2" />
          Export Order
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search order by number or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filteredOrder ? (
            <OrdersTable
              order={filteredOrder}
              onStatusChange={handleStatusChange}
              onViewDetails={handleViewDetails}
            />
          ) : (
            <p className="text-muted-foreground">
              No order matches the current filters.
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              Placed on{' '}
              {selectedOrder &&
                new Date(selectedOrder.createdAt).toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>

          {selectedOrder && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Order Details</TabsTrigger>
                <TabsTrigger value="customer">Customer Info</TabsTrigger>
                <TabsTrigger value="history">Order History</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 pt-4">
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Order Status
                      </h3>
                      <p className="font-medium">{selectedOrder.orderStatus}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Payment Status
                      </h3>
                      <p className="font-medium">
                        {selectedOrder.paymentStatus}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Items
                    </h3>
                    <div className="border rounded-md divide-y">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-muted rounded-md flex items-center justify-center">
                              {item.imageUrl ? (
                                <Image
                                  src={item.imageUrl || '/placeholder.svg'}
                                  alt={item.name}
                                  width={80}
                                  height={80}
                                  className="w-full h-full object-cover rounded-md"
                                />
                              ) : (
                                <Package className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{item.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {item.quantity} × ${item.unitPrice.toFixed(2)}
                              </p>
                            </div>
                          </div>
                          <p className="font-medium">
                            ${item.subtotal.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border rounded-md p-3 space-y-2">
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Subtotal</p>
                      <p>${selectedOrder.subtotal.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Tax</p>
                      <p>${selectedOrder.tax.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-muted-foreground">Shipping</p>
                      <p>${selectedOrder.shipping.toFixed(2)}</p>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <p className="font-medium">Total</p>
                      <p className="font-medium">
                        $
                        {(
                          selectedOrder.subtotal +
                          selectedOrder.tax +
                          selectedOrder.shipping
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="customer" className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  Customer information would be displayed here.
                </p>
              </TabsContent>

              <TabsContent value="history" className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  Order history and tracking information would be displayed
                  here.
                </p>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}