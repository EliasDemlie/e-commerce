'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button2'
import { toast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { MoreHorizontal } from 'lucide-react'

type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

interface Address {
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
}

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
}

interface ViewOrderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: Order | null
  onOrderUpdated: () => void
}

export default function ViewOrderDialog({
  open,
  onOpenChange,
  order,
  onOrderUpdated,
}: ViewOrderDialogProps) {
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending')
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<Address | null>(null)
  const [isLoadingAddress, setIsLoadingAddress] = useState(false)
  const [addressError, setAddressError] = useState<string | null>(null)

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus)
      setPaymentStatus(order.paymentStatus)
      setNotes(order.notes || '')
    }
  }, [order])

  useEffect(() => {
    const fetchShippingAddress = async () => {
      if (!order || !order.shippingAddressId) {
        setAddressError('No shipping address provided')
        setIsLoadingAddress(false)
        return
      }

      setIsLoadingAddress(true)
      setAddressError(null)

      try {
        const res = await fetch(`/api/addresses/${order.shippingAddressId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch shipping address')
        }
        const data = await res.json()
        if (!data.address) {
          throw new Error('Invalid address data')
        }
        setShippingAddress(data.address)
      } catch (error) {
        setAddressError('Failed to load shipping address')
        console.error('Error fetching shipping address:', error)
      } finally {
        setIsLoadingAddress(false)
      }
    }

    if (open && order) {
      fetchShippingAddress()
    }
  }, [open, order])

  const handleUpdateOrder = async () => {
    if (!order) return

    setIsLoading(true)

    try {
      const updatedData = {
        orderStatus,
        paymentStatus,
        notes,
      }

      const response = await fetch(`/api/orders/${order._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update order')
      }

      toast({
        title: 'Order updated',
        description: `Order #${order.orderNumber} has been successfully updated.`,
      })

      onOrderUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update order. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch {
      return 'Invalid date'
    }
  }

  const getOrderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
            Pending
          </span>
        )
      case 'processing':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Processing
          </span>
        )
      case 'shipped':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
            Shipped
          </span>
        )
      case 'delivered':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Delivered
          </span>
        )
      case 'cancelled':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        )
      case 'refunded':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Refunded
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        )
      case 'completed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
            Completed
          </span>
        )
      case 'failed':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Failed
          </span>
        )
      case 'refunded':
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Refunded
          </span>
        )
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  if (!order) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Loading Order</DialogTitle>
            <DialogDescription>Loading order details...</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white border-2 border-gray-300 shadow-xl rounded-lg">
        <DialogHeader className="border-b border-gray-200 pb-4 bg-gradient-to-r from-cyan-100 to-blue-100 p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-cyan-700">
            Order #{order.orderNumber}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Created on {formatDate(order.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-700 border-b border-gray-100 pb-2">
                Order Details
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Order Status</Label>
                    <div className="flex items-center justify-between mt-1 p-2 border-2 rounded-md bg-white border-gray-300 shadow-sm">
                      {getOrderStatusBadge(orderStatus)}
                      <Select
                        value={orderStatus}
                        onValueChange={(value) =>
                          setOrderStatus(value as OrderStatus)
                        }
                      >
                        <SelectTrigger className="border-0 p-0 h-auto w-auto bg-transparent shadow-none focus:ring-0">
                          <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </SelectTrigger>
                        <SelectContent>
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

                  <div>
                    <Label>Payment Status</Label>
                    <div className="flex items-center justify-between mt-1 p-2 border-2 rounded-md bg-white border-gray-300 shadow-sm">
                      {getPaymentStatusBadge(paymentStatus)}
                      <Select
                        value={paymentStatus}
                        onValueChange={(value) =>
                          setPaymentStatus(value as PaymentStatus)
                        }
                      >
                        <SelectTrigger className="border-0 p-0 h-auto w-auto bg-transparent shadow-none focus:ring-0">
                          <MoreHorizontal className="h-5 w-5 text-gray-500" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="refunded">Refunded</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {order.transactionRef && (
                  <div>
                    <Label>Transaction Reference</Label>
                    <div className="p-3 bg-cyan-100 rounded-md text-sm font-mono border-2 border-cyan-200">
                      {order.transactionRef}
                    </div>
                  </div>
                )}

                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this order..."
                    rows={3}
                  />
                </div>
              </div>

              <h3 className="text-lg font-semibold mt-6 mb-3 text-cyan-700 border-b border-gray-100 pb-2">
                Customer Details
              </h3>
              {isLoadingAddress ? (
                <div className="p-4 text-center text-gray-500">
                  Loading address...
                </div>
              ) : addressError ? (
                <div className="p-3 border rounded-md text-gray-500 bg-gray-50 italic">
                  {addressError}
                </div>
              ) : shippingAddress ? (
                <div className="p-4 border-2 rounded-md bg-white shadow-md border-gray-300">
                  <p className="font-medium">{shippingAddress.fullName}</p>
                  <p>{shippingAddress.phoneNumber}</p>
                  <p>{shippingAddress.addressLine1}</p>
                  {shippingAddress.addressLine2 && (
                    <p>{shippingAddress.addressLine2}</p>
                  )}
                  <p>
                    {shippingAddress.city}, {shippingAddress.state}{' '}
                    {shippingAddress.postalCode}
                  </p>
                  <p>{shippingAddress.country}</p>
                </div>
              ) : (
                <div className="p-3 border rounded-md text-gray-500 bg-gray-50 italic">
                  Address information not available
                </div>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3 text-cyan-700 border-b border-gray-100 pb-2">
                Order Items
              </h3>
              <div className="border-2 rounded-md overflow-hidden shadow-md border-gray-300">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-cyan-50">
                      <TableHead className="font-semibold text-cyan-900">
                        Item
                      </TableHead>
                      <TableHead className="text-right font-semibold text-cyan-900">
                        Qty
                      </TableHead>
                      <TableHead className="text-right font-semibold text-cyan-900">
                        Price
                      </TableHead>
                      <TableHead className="text-right font-semibold text-cyan-900">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.items.map((item) => (
                      <TableRow key={item.productId}>
                        <TableCell>
                          <div className="font-medium">{item.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">
                            {item.productId.substring(0, 8)}...
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.unitPrice.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          ${item.subtotal.toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="mt-4 space-y-1 text-sm bg-cyan-100 p-4 rounded-md border-2 border-cyan-200">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t border-cyan-200 font-medium text-base text-cyan-900">
                  <span>Total:</span>
                  <span>
                    ${(order.subtotal + order.tax + order.shipping).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="border-t p-4 bg-gray-100 rounded-b-lg border-t-2 border-gray-200">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateOrder}
            disabled={isLoading || !order}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            {isLoading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
