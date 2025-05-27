'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button2'
import type { Carrier } from '@/type/Carrier'

interface ShipmentConfirmationProps {
  trackingNumber: string
  estimatedDeliveryTime: string
  selectedCarrier: Carrier | undefined
  resetForm: () => void
  onShipmentAdded: () => void
  onOpenChange: (open: boolean) => void
}

export default function ShipmentConfirmation({
  trackingNumber,
  estimatedDeliveryTime,
  selectedCarrier,
  resetForm,
  onShipmentAdded,
  onOpenChange,
}: ShipmentConfirmationProps) {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="bg-emerald-50 rounded-full p-3 mb-4">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
      </div>
      <h3 className="text-xl font-bold text-emerald-700 mb-2">
        Local Shipment Created!
      </h3>
      <p className="text-center text-gray-600 mb-4">
        Your local shipment has been successfully created and will be delivered{' '}
        {estimatedDeliveryTime.toLowerCase()}.
      </p>
      <div className="bg-gray-50 rounded-md p-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tracking Number:</span>
          <span className="text-sm font-mono font-medium">
            {trackingNumber}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Carrier:</span>
          <span className="text-sm font-medium">
            {selectedCarrier?.name || 'Local Carrier'}
          </span>
        </div>
      </div>

      <Button
        onClick={() => {
          resetForm()
          onShipmentAdded()
          onOpenChange(false)
        }}
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-4"
      >
        Close
      </Button>
    </div>
  )
}
