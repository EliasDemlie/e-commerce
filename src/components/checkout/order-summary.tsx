'use client'

import Image from 'next/image'
import { Button } from '@/components/ui/button2'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

export interface CartItem {
  _id: string
  name: string
  price: number
  selectedImg: {
    views: {
      front: string
    }
  }
  qty: number
}

interface OrderSummaryProps {
  cartItems: CartItem[]
  loading: boolean
  onSubmit?: () => void
  showButton?: boolean
  buttonText?: string
  
}

export function OrderSummary({
  cartItems,
  loading,
  onSubmit,
  showButton = true,
  buttonText = 'Continue to Payment',
}: OrderSummaryProps) {
  // Calculate order totals
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.qty,
    0
  )
  const shipping = 150
  const tax = Math.round(subtotal * 0.15)
  const total = subtotal + shipping + tax

  return (
    <Card className="border-gray-200 shadow-md">
      <CardHeader className="bg-gray-50 border-b border-gray-200 rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <ShoppingBag className="h-5 w-5" />
          Order Summary
        </CardTitle>
        <CardDescription>Review your items before checkout</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {cartItems.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="h-16 w-16 rounded-md overflow-hidden bg-muted border border-gray-200">
                  <Image
                    src={item.selectedImg.views.front || '/placeholder.svg'}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} × {item.qty}
                  </p>
                </div>
                <div className="font-medium text-gray-900">
                  {formatCurrency(item.price * item.qty)}
                </div>
              </div>
            ))}
          </div>
        )}

        <Separator className="my-6" />

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{formatCurrency(shipping)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (15%)</span>
            <span className="font-medium">{formatCurrency(tax)}</span>
          </div>
          <Separator className="my-3" />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
      {showButton && (
        <CardFooter className="bg-gray-50 border-t border-gray-200 rounded-b-lg">
          <Button
            className="w-full font-medium bg-slate-300 hover:bg-slate-400"
            onClick={onSubmit}
            disabled={loading || cartItems.length === 0}
            size="lg"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
                Processing...
              </span>
            ) : (
              buttonText
            )}
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
