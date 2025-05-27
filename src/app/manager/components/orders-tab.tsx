'use client'

import { useState, useEffect } from 'react'
import { Download, Eye, Filter, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { format } from 'date-fns'
import ViewOrderDialog from '@/components/manager/view-order-dialog'
import { toast } from '@/components/ui/use-toast'

interface OrdersTabProps {
  searchOrders: string
  setSearchOrders: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
}

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

interface OrderItem {
  productId: string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  imageUrl?: string
}

interface Order {
  _id: string
  userId: string
  orderNumber: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  shippingAddressId: string
  billingAddressId: string
  transactionRef?: string
  notes?: string
  createdAt: string
  updatedAt: string
  customer?: {
    name: string
    email: string
  }
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function EnhancedOrdersTab({
  searchOrders,
  setSearchOrders,
  statusFilter,
  setStatusFilter,
}: OrdersTabProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  })

  const loadOrders = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchOrders) {
        params.append('search', searchOrders)
      }
      if (statusFilter !== 'all') {
        params.append('status', statusFilter)
      }

      const response = await fetch(`/api/orders?${params.toString()}`)

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setPagination(
        data.pagination || {
          total: data.orders?.length || 0,
          page: 1,
          limit: 20,
          pages: 1,
        }
      )
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load orders. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders(1)
  }, [searchOrders, statusFilter])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    loadOrders(page)
  }

  const handleExportOrders = () => {
    if (orders.length === 0) {
      toast({
        title: 'No orders to export',
        description: 'There are no orders matching your current filters.',
      })
      return
    }

    const headers = [
      'Order #',
      'Customer ID',
      'Date',
      'Status',
      'Payment',
      'Items',
      'Total',
    ]
    const csvContent = [
      headers.join(','),
      ...orders.map((order) => {
        const total = (order.subtotal + order.tax + order.shipping).toFixed(2)
        return [
          order.orderNumber,
          order.userId,
          new Date(order.createdAt).toLocaleDateString(),
          order.orderStatus,
          order.paymentStatus,
          order.items.length,
          total,
        ].join(',')
      }),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: 'Export successful',
      description: `${orders.length} orders exported to CSV.`,
    })
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setShowViewDialog(true)
  }

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-orange-500 text-white">Pending</Badge>
      case 'processing':
        return <Badge className="bg-teal-500 text-white">Processing</Badge>
      case 'shipped':
        return <Badge className="bg-cyan-500 text-white">Shipped</Badge>
      case 'delivered':
        return <Badge className="bg-green-600 text-white">Delivered</Badge>
      case 'cancelled':
        return <Badge className="bg-red-500 text-white">Cancelled</Badge>
      case 'refunded':
        return <Badge className="bg-violet-500 text-white">Refunded</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPaymentBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <Badge
            variant="outline"
            className="border-orange-500 text-orange-500"
          >
            Pending
          </Badge>
        )
      case 'completed':
        return (
          <Badge variant="outline" className="border-teal-600 text-teal-600">
            Completed
          </Badge>
        )
      case 'failed':
        return (
          <Badge variant="outline" className="border-red-500 text-red-500">
            Failed
          </Badge>
        )
      case 'refunded':
        return (
          <Badge
            variant="outline"
            className="border-violet-500 text-violet-500"
          >
            Refunded
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    const currentPage = pagination.page
    const totalPages = pagination.pages

    pages.push(1)

    if (currentPage > 3) {
      pages.push('ellipsis1')
    }

    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis2')
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Filter className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading orders: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search orders..."
            value={searchOrders}
            onChange={(e) => setSearchOrders(e.target.value)}
            className="w-full sm:w-[280px]"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
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

        <Button variant="outline" onClick={handleExportOrders}>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {orders.length} of {pagination.total} orders
        </span>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 shadow-sm">
        <CardHeader className="border-b border-blue-100 bg-blue-50/50">
          <CardTitle className="text-blue-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            Order Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-blue-100">
                  <TableHead className="text-blue-900">Order #</TableHead>
                  <TableHead className="text-blue-900">Customer</TableHead>
                  <TableHead className="text-blue-900">Date</TableHead>
                  <TableHead className="text-blue-900">Items</TableHead>
                  <TableHead className="text-blue-900">Total</TableHead>
                  <TableHead className="text-blue-900">Status</TableHead>
                  <TableHead className="text-blue-900">Payment</TableHead>
                  <TableHead className="text-right text-blue-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                ) : (
                  orders.map((order) => (
                    <TableRow
                      key={order._id.toString()}
                      className="hover:bg-blue-50"
                    >
                      <TableCell className="font-medium">
                        {order.orderNumber}
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {order.customer?.name ||
                          order.userId.substring(0, 8) + '...'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell>{order.items.length}</TableCell>
                      <TableCell>
                        $
                        {(order.subtotal + order.tax + order.shipping).toFixed(
                          2
                        )}
                      </TableCell>
                      <TableCell>{getStatusBadge(order.orderStatus)}</TableCell>
                      <TableCell>
                        {getPaymentBadge(order.paymentStatus)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-700 hover:text-blue-900 hover:bg-blue-100"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </CardContent>
      </Card>

      {selectedOrder && (
        <ViewOrderDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          order={selectedOrder}
          onOrderUpdated={() => loadOrders(pagination.page)}
        />
      )}
    </div>
  )
}
