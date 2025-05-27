'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button2'
import { useToast } from '@/components/ui/use-toast'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import type { Shipment } from '@/type/Shipment'
import type { Carrier } from '@/type/Carrier'

interface ViewShipmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment: Shipment
  carriers: Carrier[]
  onShipmentUpdated: () => void
}

export default function ViewShipmentDialog({
  open,
  onOpenChange,
  shipment,
  carriers,
  onShipmentUpdated,
}: ViewShipmentDialogProps) {
  const { toast } = useToast()
  const [trackingNumber, setTrackingNumber] = useState(shipment.trackingNumber)
  const [carrierId, setCarrierId] = useState(shipment.carrierId)
  const [status, setStatus] = useState(shipment.status)
  const [dateShipped, setDateShipped] = useState(
    shipment.dateShipped
      ? new Date(shipment.dateShipped).toISOString().split('T')[0]
      : ''
  )
  const [dateDelivered, setDateDelivered] = useState(
    shipment.dateDelivered
      ? new Date(shipment.dateDelivered).toISOString().split('T')[0]
      : ''
  )
  const [notes, setNotes] = useState(shipment.notes || '')
  const [isLoading, setIsLoading] = useState(false)

  const handleUpdateShipment = async () => {
    setIsLoading(true)

    try {
      // Basic validation
      if (!trackingNumber || !carrierId) {
        throw new Error('Please fill in all required fields')
      }

      const updatedData = {
        trackingNumber,
        carrierId,
        status,
        dateShipped: dateShipped ? new Date(dateShipped).toISOString() : null,
        dateDelivered: dateDelivered
          ? new Date(dateDelivered).toISOString()
          : null,
        notes: notes || undefined,
      }

      const response = await fetch(`/api/shipments/${shipment._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update shipment')
      }

      toast({
        title: 'Shipment updated',
        description: `Tracking #${trackingNumber} has been successfully updated.`,
      })

      onShipmentUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating shipment:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to update shipment.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy HH:mm')
    } catch (e) {
      if (e) return 'Invalid date'
    }
  }

  // Generate tracking URL if carrier template is available
  const getTrackingUrl = () => {
    const carrier = carriers.find((c) => c._id.toString() === carrierId)
    if (carrier && carrier.trackingUrlTemplate) {
      return carrier.trackingUrlTemplate.replace(
        '{trackingNumber}',
        trackingNumber
      )
    }
    return null
  }

  const trackingUrl = getTrackingUrl()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col bg-white border border-gray-200 shadow-lg rounded-lg">
        <DialogHeader className="border-b border-gray-100 pb-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-t-lg">
          <DialogTitle className="text-xl font-bold text-blue-700">
            Shipment Details
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            Created on {formatDate(shipment.createdAt)}
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="shipment-id">Shipment ID</Label>
                <div className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                  {shipment._id.toString()}
                </div>
              </div>

              {shipment.orderId && (
                <div>
                  <Label htmlFor="order-id">Order ID</Label>
                  <div className="flex h-10 w-full rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm">
                    {shipment.orderId}
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="tracking-number">Tracking Number *</Label>
                <Input
                  id="tracking-number"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="carrier">Carrier *</Label>
                <Select value={carrierId} onValueChange={setCarrierId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select carrier" />
                  </SelectTrigger>
                  <SelectContent>
                    {carriers.map((carrier) => (
                      <SelectItem
                        key={carrier._id.toString()}
                        value={carrier._id.toString()}
                      >
                        {carrier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={status}
                  onValueChange={setStatus as (value: string) => void}
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="in_transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="date-shipped">Date Shipped</Label>
                <Input
                  id="date-shipped"
                  type="date"
                  value={dateShipped}
                  onChange={(e) => setDateShipped(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="date-delivered">Date Delivered</Label>
                <Input
                  id="date-delivered"
                  type="date"
                  value={dateDelivered}
                  onChange={(e) => setDateDelivered(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="customer-name">Customer</Label>
                <div className="p-3 border rounded-md border-gray-200 bg-white shadow-sm">
                  <p className="font-medium">{shipment.customer.name}</p>
                  {shipment.customer.email && (
                    <p className="text-muted-foreground">
                      {shipment.customer.email}
                    </p>
                  )}
                  <div className="mt-2 text-sm">
                    <p>{shipment.customer.address.addressLine1}</p>
                    {shipment.customer.address.addressLine2 && (
                      <p>{shipment.customer.address.addressLine2}</p>
                    )}
                    <p>
                      {shipment.customer.address.city},{' '}
                      {shipment.customer.address.state}{' '}
                      {shipment.customer.address.postalCode}
                    </p>
                    <p>{shipment.customer.address.country}</p>
                  </div>
                </div>
              </div>

              {shipment.items.length > 0 && (
                <div>
                  <Label>Items</Label>
                  <div className="border rounded-md divide-y max-h-[200px] overflow-y-auto border-gray-200 bg-white">
                    {shipment.items.map((item, index) => (
                      <div key={index} className="p-3 flex justify-between">
                        <div className="font-mono text-xs">
                          {item.productId.substring(0, 8)}...
                        </div>
                        <div>x{item.quantity}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {trackingUrl && (
                <div>
                  <Label>Tracking</Label>
                  <div className="mt-1">
                    <Button
                      variant="outline"
                      asChild
                      className="w-full border-blue-200 text-blue-600 hover:bg-blue-50"
                      size="sm"
                    >
                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Track Package
                      </a>
                    </Button>
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this shipment..."
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-4 border-t mt-4 border-gray-100 bg-gray-50 p-6 rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateShipment}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? 'Updating...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
