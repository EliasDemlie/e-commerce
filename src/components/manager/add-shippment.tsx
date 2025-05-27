'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button2'
import { useToast } from '@/components/ui/use-toast'
import {
  Loader2,
  Truck,
  Package,
  MapPin,
  Clock,
  AlertCircle,
} from 'lucide-react'
import type { IOrder } from '@/server/models/Order'
import type { IAddress } from '@/server/models/Address'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import type { Carrier } from '@/type/Carrier'
import type { Shipment } from '@/type/Shipment'
import { cn } from '@/lib/utils'
import CarrierSelection from './carrier-selection'
import ShipmentConfirmation from './shipment-confirmation'

interface AddShipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onShipmentAdded: () => void
}

export default function AddShipmentDialog({
  open,
  onOpenChange,
  onShipmentAdded,
}: AddShipmentDialogProps) {
  const { toast } = useToast()
  const [orderSearchTerm, setOrderSearchTerm] = useState('')
  const [isSearchingOrder, setIsSearchingOrder] = useState(false)
  const [orderResults, setOrderResults] = useState<IOrder[]>([])
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
  const [recentOrders, setRecentOrders] = useState<IOrder[]>([])
  const [isLoadingRecentOrders, setIsLoadingRecentOrders] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [carrierId, setCarrierId] = useState('')
  const [status, setStatus] = useState<Shipment['status']>('processing')
  const [dateShipped, setDateShipped] = useState('')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [activeCarriers, setActiveCarriers] = useState<Carrier[]>([])
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<{
    name: string
    email: string
    address: {
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }>({
    name: '',
    email: '',
    address: {
      addressLine1: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  })
  const [autoAssignCarrier, setAutoAssignCarrier] = useState(true)
  const [autoUpdateStatus, setAutoUpdateStatus] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newOrdersCount, setNewOrdersCount] = useState(0)
  const [estimatedDeliveryTime, setEstimatedDeliveryTime] = useState('')
  const [carrierAssignments, setCarrierAssignments] = useState<{
    [key: string]: number
  }>({})

  const fetchCarriers = async () => {
    setIsLoadingCarriers(true)
    setError(null)

    try {
      const response = await fetch('/api/carrier')

      if (!response.ok) {
        throw new Error('Failed to fetch carriers')
      }

      const data = await response.json()
      const fetchedCarriers = data.carriers || []
      setCarriers(fetchedCarriers)

      // Filter active carriers and sort by activation time (oldest first)
      const active = fetchedCarriers
        .filter((c: Carrier) => c.isActive)
        .sort((a: Carrier, b: Carrier) => {
          // Sort by activation time if available
          if (a.activatedAt && b.activatedAt) {
            return (
              new Date(a.activatedAt).getTime() -
              new Date(b.activatedAt).getTime()
            )
          } else if (a.activatedAt) {
            return -1 // a has activatedAt, b doesn't, so a comes first
          } else if (b.activatedAt) {
            return 1 // b has activatedAt, a doesn't, so b comes first
          }
          return 0
        })

      setActiveCarriers(active)

      const initialAssignments = fetchedCarriers.reduce(
        (acc: { [key: string]: number }, carrier: Carrier) => {
          acc[carrier._id] = 0
          return acc
        },
        {}
      )
      setCarrierAssignments(initialAssignments)
    } catch (error) {
      if (error) {
        setError('Failed to load carriers.')
      }
    } finally {
      setIsLoadingCarriers(false)
    }
  }

  const fetchRecentOrders = async () => {
    setIsLoadingRecentOrders(true)
    setError(null)

    try {
      const response = await fetch(
        '/api/orders?limit=5&sort=createdAt:desc&status=processing'
      )

      if (!response.ok) {
        throw new Error('Failed to fetch recent orders')
      }

      const data = await response.json()
      setRecentOrders(data.orders || [])

      const unshippedOrders = data.orders.filter(
        (order: IOrder) =>
          order.orderStatus === 'pending' || order.orderStatus === 'delivered'
      )
      setNewOrdersCount(unshippedOrders.length)
    } catch (error) {
      if (error instanceof Error) {
        setError('Failed to load recent orders.')
        setRecentOrders([])
      }
    } finally {
      setIsLoadingRecentOrders(false)
    }
  }

  const searchOrders = async () => {
    if (!orderSearchTerm.trim()) return

    setIsSearchingOrder(true)
    setError(null)

    try {
      const response = await fetch(
        `/api/orders?search=${encodeURIComponent(orderSearchTerm)}`
      )

      if (!response.ok) {
        throw new Error('Failed to search orders')
      }

      const data = await response.json()
      setOrderResults(data.orders || [])

      if (data.orders.length === 0) {
        toast({
          title: 'No orders found',
          description: 'No orders match your search criteria.',
        })
      }
    } catch (error) {
      if (error) {
        setError('Failed to search orders.')
        setOrderResults([])
      }
    } finally {
      setIsSearchingOrder(false)
    }
  }

  useEffect(() => {
    if (open) {
      fetchCarriers()
      fetchRecentOrders()
    }
  }, [open])

  const fetchOrderDetails = async (orderId: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/orders/${orderId}`)

      if (!response.ok) {
        throw new Error('Failed to fetch order details')
      }

      const orderData1 = await response.json()
      const orderData = orderData1.order

      let addressData: Partial<IAddress> | null = null

      if (orderData.shippingAddressId) {
        if (
          typeof orderData.shippingAddressId === 'object' &&
          orderData.shippingAddressId.addressLine1
        ) {
          addressData = orderData.shippingAddressId as Partial<IAddress>
        } else {
          try {
            const addressResponse = await fetch(
              `/api/addresses/${orderData.shippingAddressId}`
            )
            if (addressResponse.ok) {
              const addressResult = await addressResponse.json()
              addressData = addressResult.address
            }
          } catch (error) {
            if (error instanceof Error) {
              console.error('Error fetching address:', error.message)
            }
          }
        }
      }

      if (!addressData && orderData.shippingAddress) {
        addressData = orderData.shippingAddress
      }

      setShippingAddress({
        name:
          addressData?.fullName ||
          orderData.userId?.name ||
          orderData.customerName,
        email:
          addressData?.email ||
          orderData.userId?.email ||
          orderData.customerEmail ||
          '',
        address: {
          addressLine1:
            addressData?.addressLine1 ||
            orderData.shippingAddress?.addressLine1 ||
            '',
          addressLine2:
            addressData?.addressLine2 ||
            orderData.shippingAddress?.addressLine2,
          city: addressData?.city || orderData.shippingAddress?.city || '',
          state: addressData?.state || orderData.shippingAddress?.state || '',
          postalCode:
            addressData?.postalCode ||
            orderData.shippingAddress?.postalCode ||
            '',
          country:
            addressData?.country || orderData.shippingAddress?.country || '',
        },
      })

      return orderData
    } catch (error) {
      if( error instanceof Error) {   
        console.error('Error fetching order details:', error.message)
      }
      setError('Failed to fetch order details.')
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const selectOrder = async (order: IOrder) => {
    setSelectedOrder(order)
    setError(null) 

    await fetchOrderDetails(order._id?.toString() || '')
    generateTrackingNumber()

    // Calculate estimated delivery time
    calculateEstimatedDeliveryTime()

    // Set date shipped to today's date
    const today = new Date().toISOString().split('T')[0]
    setDateShipped(today)

    // Set initial status
    setStatus('processing')

    // Handle carrier assignment
    if (autoAssignCarrier && activeCarriers.length > 0) {
      assignBestLocalCarrier()
    } else if (autoAssignCarrier && activeCarriers.length === 0) {
      setError('No active carriers available for assignment.')
    }
  }

  const generateTrackingNumber = () => {
    const prefix = 'LC'
    const randomPart = Math.floor(Math.random() * 10000000)
      .toString()
      .padStart(7, '0')
    const timestamp = Date.now().toString().slice(-4)
    setTrackingNumber(`${prefix}${randomPart}${timestamp}`)
  }

  const calculateEstimatedDeliveryTime = () => {
    const now = new Date()
    const hour = now.getHours()

    if (hour < 14) {
      setEstimatedDeliveryTime('Today, by 6 PM')
    } else {
      const tomorrow = new Date(now)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const options: Intl.DateTimeFormatOptions = { weekday: 'long' }
      const dayName = tomorrow.toLocaleDateString('en-US', options)
      setEstimatedDeliveryTime(`${dayName}, by 12 PM`)
    }
  }

  const assignBestLocalCarrier = () => {
    if (!activeCarriers.length) {
      setError('No active carriers available.')
      return
    }

    // Prioritize by activation time (first activated first assigned)
    const bestCarrier = activeCarriers.reduce((prev, current) => {
      // If both have activation times, compare them
      if (prev.activatedAt && current.activatedAt) {
        return new Date(prev.activatedAt).getTime() <
          new Date(current.activatedAt).getTime()
          ? prev
          : current
      }
      // If only one has activation time, prioritize that one
      else if (prev.activatedAt) {
        return prev
      } else if (current.activatedAt) {
        return current
      }

      // If neither has activation time, compare by assignments
      const prevAssignments = carrierAssignments[prev._id] || 0
      const currentAssignments = carrierAssignments[current._id] || 0
      return prevAssignments <= currentAssignments ? prev : current
    })

    setCarrierId(bestCarrier._id)

    setCarrierAssignments((prev) => ({
      ...prev,
      [bestCarrier._id]: (prev[bestCarrier._id] || 0) + 1,
    }))
  }

  const resetForm = () => {
    setOrderSearchTerm('')
    setOrderResults([])
    setSelectedOrder(null)
    setTrackingNumber('')
    setCarrierId('')
    setStatus('processing')
    setDateShipped('')
    setNotes('')
    setShippingAddress({
      name: '',
      email: '',
      address: {
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: '',
      },
    })
    setIsComplete(false)
    setIsProcessing(false)
    setError(null)
    setEstimatedDeliveryTime('')
    const resetAssignments = carriers.reduce(
      (acc: { [key: string]: number }, carrier: Carrier) => {
        acc[carrier._id] = 0
        return acc
      },
      {}
    )
    setCarrierAssignments(resetAssignments)
  }

  const handleSubmit = async () => {
    setError(null)

    if (!selectedOrder || !trackingNumber) {
      setError(
        'Please select an order and ensure tracking number is generated.'
      )
      return
    }

    // Validate carrier selection
    if (!carrierId && !autoAssignCarrier) {
      setError('Please select a carrier for this shipment.')
      return
    }

    if (!carrierId && autoAssignCarrier && activeCarriers.length === 0) {
      setError('No active carriers available for assignment.')
      return
    }

    setIsProcessing(true)

    // Ensure we have a carrier ID
    let finalCarrierId = carrierId

    if (!finalCarrierId && autoAssignCarrier && activeCarriers.length > 0) {
      assignBestLocalCarrier()
      finalCarrierId = carrierId
    }

    // Double check we have a carrier ID before proceeding
    if (!finalCarrierId) {
      setError('No carrier available for assignment.')
      setIsProcessing(false)
      return
    }

    try {
      const shipmentData = {
        orderId: selectedOrder._id,
        trackingNumber,
        carrierId: finalCarrierId,
        status: 'processing',
        dateShipped: dateShipped || new Date().toISOString(),
        customer: {
          name: shippingAddress.name,
          email: shippingAddress.email,
          address: {
            addressLine1: shippingAddress.address.addressLine1 || '',
            addressLine2: shippingAddress.address.addressLine2,
            city: shippingAddress.address.city || '',
            state: shippingAddress.address.state || '',
            postalCode: shippingAddress.address.postalCode || '',
            country: shippingAddress.address.country || '',
          },
        },
        notes,
        items: selectedOrder.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          name: item.name,
        })),
        estimatedDelivery: estimatedDeliveryTime,
        isLocalDelivery: true,
      }

      const response = await fetch('/api/shipments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shipmentData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create shipment')
      }

      // Update carrier status to inactive since they are now shipping
      if (finalCarrierId) {
        await fetch(`/api/carrier/${finalCarrierId}/status`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive: false }),
        })
      }

      if (autoUpdateStatus) {
        await fetch(`/api/orders/${selectedOrder._id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            orderStatus: 'processing',
          }),
        })
      }

      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus('processing')

      await new Promise((resolve) => setTimeout(resolve, 800))
      setStatus('in_transit')

      await new Promise((resolve) => setTimeout(resolve, 800))

      toast({
        title: 'Local Shipment Created',
        description: `The shipment has been successfully created and will be delivered ${estimatedDeliveryTime.toLowerCase()}.`,
      })

      setIsComplete(true)
      setIsProcessing(false)

      setNewOrdersCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'Failed to create shipment.'
      )
      setIsProcessing(false)
    }
  }

  // Find the selected carrier - fixed to prevent undefined
  const selectedCarrier = carrierId
    ? carriers.find((c) => c._id === carrierId)
    : undefined
    
    if(recentOrders.length === 0){

    }


  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) resetForm()
        onOpenChange(isOpen)
      }}
    >
      <DialogContent className="max-w-md bg-white border-gray-200 p-0 overflow-hidden rounded-xl">
        <DialogHeader className="bg-gradient-to-r from-emerald-600 to-teal-500 text-white p-4">
          <DialogTitle className="text-xl font-bold flex items-center">
            <Package className="mr-2 h-5 w-5" />
            Create Local Shipment
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {!selectedOrder && !isComplete && (
            <div className="text-sm text-gray-600 mb-4 flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-emerald-600" />
              Select an order to create a local city delivery.
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {!isComplete ? (
            <>
              {!selectedOrder ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Search by order number"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      className="flex-1 border-gray-200 focus-visible:ring-emerald-600"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          searchOrders()
                        }
                      }}
                    />
                    <Button
                      onClick={searchOrders}
                      disabled={isSearchingOrder}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    >
                      {isSearchingOrder ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        'Search'
                      )}
                    </Button>
                  </div>

                  {isLoadingRecentOrders ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    <>
                      {recentOrders.length > 0 && !orderResults.length && (
                        <Card className="border-gray-200 shadow-sm">
                          <CardContent className="p-0">
                            <div className="bg-gray-50 px-4 py-2 font-medium text-sm border-b border-gray-200 flex items-center justify-between">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1 text-emerald-600" />
                                Recent Orders
                              </div>
                              {newOrdersCount > 0 && (
                                <Badge className="bg-emerald-600 text-white">
                                  {newOrdersCount} new
                                </Badge>
                              )}
                            </div>
                            <div className="divide-y divide-gray-200">
                              {recentOrders.map((order) => (
                                <div
                                  key={order._id?.toString()}
                                  className={cn(
                                    'p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors',
                                    order.orderStatus === 'processing' &&
                                      'border-l-4 border-emerald-500'
                                  )}
                                  onClick={() => selectOrder(order)}
                                >
                                  <div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                      Order #{order.orderNumber}
                                      {order.orderStatus === 'processing' && (
                                        <Badge className="ml-2 bg-emerald-500 text-white text-xs">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {shippingAddress.name || 'Unknown'} -{' '}
                                      {order.items.length} items
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                  >
                                    Select
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {recentOrders.length === 0 && !orderResults.length && (
                        <Card className="border-gray-200 shadow-sm">
                          <CardContent className="p-6 text-center">
                            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">
                              No Recent Orders
                            </h3>
                            <p className="text-sm text-gray-600 mb-4">
                              There are no recent orders available for shipment.
                              Try searching for an order by number or contact
                              support for assistance.
                            </p>
                            
                          </CardContent>
                        </Card>
                      )}

                      {orderResults.length > 0 && (
                        <Card className="border-gray-200 shadow-sm">
                          <CardContent className="p-0">
                            <div className="bg-gray-50 px-4 py-2 font-medium text-sm border-b border-gray-200">
                              Search Results
                            </div>
                            <div className="divide-y divide-gray-200">
                              {orderResults.map((order) => (
                                <div
                                  key={order._id?.toString()}
                                  className={cn(
                                    'p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors',
                                    (order.orderStatus === 'pending' ||
                                      order.orderStatus === 'delivered') &&
                                      'border-l-4 border-emerald-500'
                                  )}
                                  onClick={() => selectOrder(order)}
                                >
                                  <div>
                                    <div className="font-medium text-gray-800 flex items-center">
                                      Order #{order.orderNumber}
                                      {(order.orderStatus === 'pending' ||
                                        order.orderStatus === 'delivered') && (
                                        <Badge className="ml-2 bg-emerald-500 text-white text-xs">
                                          New
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      {shippingAddress.name || 'Unknown'} -{' '}
                                      {order.items.length} items
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                                  >
                                    Select
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    </div>
                  ) : (
                    <>
                      <Card className="border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                              <Package className="h-5 w-5 text-emerald-600 mr-2" />
                              <h3 className="font-medium text-gray-800">
                                Order Details
                              </h3>
                            </div>
                            <Badge className="bg-emerald-600">
                              #{selectedOrder.orderNumber}
                            </Badge>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Customer:</span>
                              <span className="font-medium text-gray-800">
                                {shippingAddress.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Items:</span>
                              <span className="font-medium text-gray-800">
                                {selectedOrder.items.length}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Total:</span>
                              <span className="font-medium text-gray-800">
                                $
                                {(
                                  selectedOrder.subtotal +
                                  selectedOrder.tax +
                                  selectedOrder.shipping
                                ).toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <div className="text-xs text-gray-600 mb-1 flex items-center">
                              <MapPin className="h-3 w-3 mr-1 text-emerald-600" />
                              Delivery address:
                            </div>
                            <div className="text-sm text-gray-800">
                              {shippingAddress.address.addressLine1 ||
                                'No address available'}{' '}
                              {shippingAddress.address.addressLine1 &&
                                shippingAddress.address.city && (
                                  <>
                                    , {shippingAddress.address.city},{' '}
                                    {shippingAddress.address.postalCode}
                                  </>
                                )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-gray-200 shadow-sm">
                        <CardContent className="p-4">
                          <div className="flex items-center mb-3">
                            <Truck className="h-5 w-5 text-emerald-600 mr-2" />
                            <h3 className="font-medium text-gray-800">
                              Local Delivery Settings
                            </h3>
                          </div>

                          <CarrierSelection
                            carriers={carriers}
                            activeCarriers={activeCarriers}
                            isLoadingCarriers={isLoadingCarriers}
                            carrierId={carrierId}
                            setCarrierId={setCarrierId}
                            autoAssignCarrier={autoAssignCarrier}
                            setAutoAssignCarrier={setAutoAssignCarrier}
                            assignBestLocalCarrier={assignBestLocalCarrier}
                            selectedCarrier={selectedCarrier}
                            trackingNumber={trackingNumber}
                            status={status}
                            estimatedDeliveryTime={estimatedDeliveryTime}
                          />

                          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                            <div>
                              <Label className="text-gray-800">
                                Auto-update status
                              </Label>
                              <p className="text-xs text-gray-500">
                                Status will update automatically based on time
                              </p>
                            </div>
                            <Switch
                              checked={autoUpdateStatus}
                              onCheckedChange={setAutoUpdateStatus}
                              className="data-[state=checked]:bg-emerald-600"
                            />
                          </div>
                        </CardContent>
                      </Card>

                      <div className="pt-2">
                        <Textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add delivery instructions or notes..."
                          rows={2}
                          className="border-gray-200 focus-visible:ring-emerald-600 text-sm"
                        />
                      </div>
                    </>
                  )}
                </div>
              )}
            </>
          ) : (
            <ShipmentConfirmation
              trackingNumber={trackingNumber}
              estimatedDeliveryTime={estimatedDeliveryTime}
              selectedCarrier={selectedCarrier}
              resetForm={resetForm}
              onShipmentAdded={onShipmentAdded}
              onOpenChange={onOpenChange}
            />
          )}
        </div>

        {!isComplete && (
          <DialogFooter className="bg-gray-50 border-t border-gray-200 p-4">
            <div className="w-full flex justify-between">
              <Button
                variant="outline"
                onClick={() => {
                  if (selectedOrder) {
                    setSelectedOrder(null)
                  } else {
                    onOpenChange(false)
                  }
                }}
                className="border-gray-200 text-gray-600 hover:bg-gray-100"
              >
                {selectedOrder ? 'Back' : 'Cancel'}
              </Button>

              {selectedOrder && (
                <Button
                  onClick={handleSubmit}
                  disabled={
                    isProcessing ||
                    isLoading ||
                    isLoadingCarriers ||
                    (!autoAssignCarrier && !carrierId)
                  }
                  className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center"
                >
                  {isProcessing ? (
                    <div className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </div>
                  ) : (
                    <>
                      <Truck className="h-4 w-4 mr-2" />
                      Create Local Shipment
                    </>
                  )}
                </Button>
              )}
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}
