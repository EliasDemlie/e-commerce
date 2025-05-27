'use client'
import { Loader2, AlertCircle, Phone, Mail } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import type { Carrier } from '@/type/Carrier'

interface CarrierSelectionProps {
  carriers: Carrier[]
  activeCarriers: Carrier[]
  isLoadingCarriers: boolean
  carrierId: string
  setCarrierId: (id: string) => void
  autoAssignCarrier: boolean
  setAutoAssignCarrier: (value: boolean) => void
  assignBestLocalCarrier: () => void
  selectedCarrier: Carrier | undefined
  trackingNumber: string
  status: string
  estimatedDeliveryTime: string
}

export default function CarrierSelection({
 
  activeCarriers,
  isLoadingCarriers,
  carrierId,
  setCarrierId,
  autoAssignCarrier,
  setAutoAssignCarrier,
  assignBestLocalCarrier,
  selectedCarrier,
  trackingNumber,
  status,
  estimatedDeliveryTime,
}: CarrierSelectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label className="text-gray-800">Auto-assign local carrier</Label>
          <p className="text-xs text-gray-500">
            Best local carrier will be selected for city delivery
          </p>
        </div>
        <Switch
          checked={autoAssignCarrier}
          onCheckedChange={(checked) => {
            setAutoAssignCarrier(checked)
            if (checked) {
              assignBestLocalCarrier()
            } else {
              setCarrierId('')
            }
          }}
          className="data-[state=checked]:bg-emerald-600"
        />
      </div>

      {!autoAssignCarrier && (
        <div className="pt-2 border-t border-gray-200">
          <Label className="text-gray-600 block mb-1">Select Carrier:</Label>
          <p className="text-xs text-amber-600 mb-2">
            <AlertCircle className="h-3 w-3 inline mr-1" />
            Manual selection required
          </p>
          <Select value={carrierId} onValueChange={setCarrierId}>
            <SelectTrigger className="w-full border-gray-200 focus:ring-emerald-600">
              <SelectValue placeholder="Select a carrier" />
            </SelectTrigger>
            <SelectContent>
              {activeCarriers.length === 0 ? (
                <div className="p-2 text-sm text-gray-500">
                  No active carriers available
                </div>
              ) : (
                activeCarriers.map((carrier) => (
                  <SelectItem
                    key={carrier._id}
                    value={carrier._id}
                    className="cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span>{carrier.name}</span>
                      {carrier.activatedAt && (
                        <span className="text-xs text-gray-500">
                          Active since:{' '}
                          {new Date(carrier.activatedAt).toLocaleTimeString()}
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center mb-1">
          <Label className="text-gray-600">Tracking Number:</Label>
          <span className="text-sm font-mono text-gray-800">
            {trackingNumber}
          </span>
        </div>

        <div className="mb-1">
          <Label className="text-gray-600">Carrier:</Label>
          <div className="text-sm text-gray-800">
            {isLoadingCarriers ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : selectedCarrier ? (
              <div>
                <div>{selectedCarrier.name}</div>
                {selectedCarrier.contactPhone && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Phone className="h-3 w-3 mr-1" />
                    {selectedCarrier.contactPhone}
                  </div>
                )}
                {selectedCarrier.contactEmail && (
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <Mail className="h-3 w-3 mr-1" />
                    {selectedCarrier.contactEmail}
                  </div>
                )}
              </div>
            ) : autoAssignCarrier ? (
              'Auto-assigned Local Carrier'
            ) : (
              'Please select a carrier'
            )}
          </div>
        </div>

        <div className="flex justify-between items-center mb-1">
          <Label className="text-gray-600">Status:</Label>
          <Badge className="bg-amber-500">{status.replace('_', ' ')}</Badge>
        </div>

        <div className="flex justify-between items-center">
          <Label className="text-gray-600">Estimated Delivery:</Label>
          <Badge className="bg-emerald-600">{estimatedDeliveryTime}</Badge>
        </div>
      </div>
    </div>
  )
}
