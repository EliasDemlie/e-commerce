'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { ShoppingCart, X, ArrowLeft } from 'lucide-react'
import Button from '@/components/input/Button'
import type { SafeUser } from '@/type/SafeUser'
import CartItem from './cart-item'
import CartSummary from './cartSummery'

interface CartPageProps {
  currentUser: SafeUser | null
}

const Cart: React.FC<CartPageProps> = ({ currentUser }) => {
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleUpdateQuantity,
    clearCart,
  } = useCart()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="text-center relative p-10">
        <div className="relative w-16 h-16 mx-auto">
          <ShoppingCart className="w-16 h-16 text-gray-400" />
          <X className="w-8 h-8 text-red-500 absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white rounded-full" />
        </div>
        <p className="text-lg mt-2">Your cart is empty.</p>
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

  // Calculate cart totals
  const subtotal = cartProducts.reduce(
    (total, product) => total + product.price * product.qty,
    0
  )

  const discountRate = 10
  const discount = (discountRate / 100) * subtotal
  const taxRate = 8
  const tax = (taxRate / 100) * subtotal
  const shipping = subtotal > 100 ? 0 : 15
  const total = subtotal - discount + tax + shipping

  return (
    <div className="container mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 p-6 rounded-lg shadow bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cart Items</h2>
          <Button label="Clear Cart" onClick={clearCart} size="small" />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">Product</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Quantity</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartProducts.map((product) => (
                <CartItem
                  key={product._id}
                  product={product}
                  handleRemoveProductFromCart={handleRemoveProductFromCart}
                  handleUpdateQuantity={handleUpdateQuantity}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CartSummary
        subtotal={subtotal}
        discount={discount}
        discountRate={discountRate}
        tax={tax}
        taxRate={taxRate}
        shipping={shipping}
        total={total}
        currentUser={currentUser}
      />
    </div>
  )
}

export default Cart
