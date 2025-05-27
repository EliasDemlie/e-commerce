'use client'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button2'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, Truck, CheckCircle, XCircle } from 'lucide-react'
import type { Order, OrderStatus, PaymentStatus } from '@/type/Order'

interface OrdersTableProps {
  order: Order | null // Single order object
  onStatusChange: (orderId: string, status: OrderStatus) => void
  onViewDetails: (orderId: string) => void
}

export default function OrdersTable({
  order,
  onStatusChange,
  onViewDetails,
}: OrdersTableProps) {
  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'processing':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'shipped':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getPaymentStatusColor = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'refunded':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  // Debug log to verify the order object
  console.log('Received order in OrdersTable:', order)

  // Check if order is valid and has items
  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden md:table-cell">Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead className="hidden md:table-cell">Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                No order available
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden md:table-cell">Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="hidden md:table-cell">Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Date</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">#{order.orderNumber}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">
                  {order.shippingAddressId ? 'Customer Name' : 'N/A'}
                </span>
                <span className="text-xs text-muted-foreground">
                  {order.items.length} items
                </span>
              </div>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {order.items.map((item, index) => (
                <div key={index} className="text-sm">
                  {item.quantity}x {item.name}
                </div>
              ))}
            </TableCell>
            <TableCell>
              ${(order.subtotal + order.tax + order.shipping).toFixed(2)}
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <Badge
                variant="secondary"
                className={getPaymentStatusColor(order.paymentStatus)}
              >
                {order.paymentStatus}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="secondary"
                className={getStatusColor(order.orderStatus)}
              >
                {order.orderStatus}
              </Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              {formatDate(order.createdAt)}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => onViewDetails(order._id)}>
                    <Eye className="mr-2 h-4 w-4" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange(order._id, 'processing')}
                    disabled={order.orderStatus === 'processing'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Processing
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(order._id, 'shipped')}
                    disabled={order.orderStatus === 'shipped'}
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Mark as Shipped
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onStatusChange(order._id, 'delivered')}
                    disabled={order.orderStatus === 'delivered'}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Delivered
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onStatusChange(order._id, 'cancelled')}
                    disabled={order.orderStatus === 'cancelled'}
                    className="text-red-600"
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Cancel Order
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}
