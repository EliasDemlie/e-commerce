'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Separator } from '@/components/ui/separator'
import { format } from 'date-fns'
import type { IOrder } from './types'
import { ChevronRight, Package, CreditCard } from 'lucide-react'
import type { JSX } from 'react'

interface OrderCardProps {
  order: IOrder
  getStatusIcon: (status: string) => JSX.Element
  getDeliveryStatusIcon: (status: string) => JSX.Element
  getStatusBadge: (status: string) => JSX.Element
  getDeliveryStatusBadge: (status: string) => JSX.Element
  onViewDetails: () => void
}

export default function OrderCard({
  order,
  getStatusIcon,
  getDeliveryStatusIcon,
  getStatusBadge,
  getDeliveryStatusBadge,
  onViewDetails,
}: OrderCardProps) {
  // Calculate total amount
  const totalAmount = order.subtotal + order.tax + order.shipping

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white border-slate-200">
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-white">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 text-emerald-800">
              <Package className="h-5 w-5 text-emerald-600" />
              Order #{order.orderNumber}
            </CardTitle>
            <CardDescription className="mt-1 text-slate-600">
              {format(new Date(order.createdAt), 'MMMM dd, yyyy')}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2 justify-end">
            {getStatusBadge(order.paymentStatus)}
            {getDeliveryStatusBadge(order.orderStatus)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-5">
        <div className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <CreditCard className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-slate-500 text-sm block">
                  Payment Status
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getStatusIcon(order.paymentStatus)}
                  <span className="capitalize font-medium text-slate-800">
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-lg border border-slate-100">
              <Package className="h-5 w-5 text-slate-600" />
              <div>
                <span className="text-slate-500 text-sm block">
                  Order Status
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {getDeliveryStatusIcon(order.orderStatus)}
                  <span className="capitalize font-medium text-slate-800">
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h4 className="font-medium mb-3 text-slate-800 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Order Summary
              </h4>
              <div className="text-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Items:</span>
                  <span className="font-medium text-slate-700">
                    {order.items.length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Subtotal:</span>
                  <span className="font-medium text-slate-700">
                    {order.subtotal.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Tax:</span>
                  <span className="font-medium text-slate-700">
                    {order.tax.toLocaleString()} ETB
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Shipping:</span>
                  <span className="font-medium text-slate-700">
                    {order.shipping.toLocaleString()} ETB
                  </span>
                </div>
                <Separator className="my-2 bg-slate-200" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">
                    Total Amount:
                  </span>
                  <span className="font-semibold text-emerald-700">
                    {totalAmount.toLocaleString()} ETB
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
              <h4 className="font-medium mb-3 text-slate-800 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                Order Information
              </h4>
              <div className="text-sm space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Transaction Ref:</span>
                  <span className="font-medium text-slate-700 max-w-[180px] truncate">
                    {order.transactionRef || 'N/A'}
                  </span>
                </div>
                {order.notes && (
                  <div className="pt-1">
                    <span className="text-slate-500 block mb-1">Notes:</span>
                    <p className="text-slate-700 bg-white p-2 rounded border border-slate-200 text-sm">
                      {order.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <Button
              variant="outline"
              className="hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors"
              onClick={onViewDetails}
            >
              View Order Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
