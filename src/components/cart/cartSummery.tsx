'use client'

import type React from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import Button from '@/components/input/Button'
import { useRouter } from 'next/navigation'
import type { SafeUser } from '@/type/SafeUser'

interface CartSummaryProps {
  subtotal: number
  discount: number
  discountRate: number
  tax: number
  taxRate: number
  shipping: number
  total: number
  currentUser: SafeUser | null
}

const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  discount,
  discountRate,
  tax,
  taxRate,
  shipping,
  total,
  currentUser,
}) => {
  const router = useRouter()

  return (
    <div className="p-6 rounded-lg shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Cart Summary</h2>
      <div className="space-y-2">
        <p className="flex justify-between">
          <span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Discount ({discountRate}%):</span>{' '}
          <span>-${discount.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Taxes ({taxRate}%):</span> <span>${tax.toFixed(2)}</span>
        </p>
        <p className="flex justify-between">
          <span>Estimated Shipping:</span> <span>${shipping.toFixed(2)}</span>
        </p>
        {shipping === 0 && (
          <p className="text-green-600 text-sm">
            You qualify for free shipping!
          </p>
        )}
        <hr />
        <p className="flex justify-between font-bold text-lg">
          <span>Total:</span> <span>${total.toFixed(2)}</span>
        </p>
      </div>

      <div className="mt-4 mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Coupon code"
            className="flex-1 p-2 border rounded"
          />
          <Button label="Apply" onClick={() => {}} size="small" />
        </div>
      </div>

      <div className="max-w-[400px] flex flex-row gap-6 mt-5">
        <Button
          label={currentUser ? 'Checkout' : 'Login to Checkout'}
          onClick={() => {
            if (currentUser) {
              router.push('/checkout')
            } else {
              router.push('/login')
            }
          }}
          outline
        />
      </div>
      <Link
        href="/"
        className="text-blue-500 hover:underline mt-4 inline-flex items-center"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Continue Shopping
      </Link>
    </div>
  )
}

export default CartSummary
