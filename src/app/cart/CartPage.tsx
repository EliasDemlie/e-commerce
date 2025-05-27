'use client'

import type React from 'react'
import { useEffect, useState } from 'react'

import { useCart } from '@/hooks/useCart'
import Link from 'next/link'
import { ShoppingCart, X, ArrowLeft, Trash2 } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import SetQuantity from '@/components/ProductCard/SetQuantity'
import Button from '@/components/input/Button'

import type { SafeUser } from '@/type/SafeUser'

interface CartProps {
  currentUser: SafeUser | null
}

const Cart: React.FC<CartProps> = ({ currentUser }) => {
  const {
    cartProducts,
    handleRemoveProductFromCart,
    handleUpdateQuantity,
    clearCart,
  } = useCart()
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="relative w-20 h-20 mx-auto mb-4">
          <ShoppingCart className="w-20 h-20 text-gray-400" />
          <X className="w-10 h-10 text-red-500 absolute top-0 right-0 transform translate-x-2 -translate-y-2 bg-white rounded-full p-1" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          Looks like you havent added any products to your cart yet.
        </p>
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition flex items-center"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Continue Shopping
        </Link>
      </div>
    )
  }

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

  // const handleApplyCoupon = () => {
  //   if (couponCode.trim()) {
  //     // This would typically call an API to validate the coupon
  //     alert(`Coupon "${couponCode}" applied!`)
  //     setCouponCode('')
  //   }
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items Section */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Cart Items ({cartProducts.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">
                    Product
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                    Price
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                    Quantity
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                    Total
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-medium text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div
                          onClick={() => router.push(`/product/${product._id}`)}
                          role="button"
                          tabIndex={0}
                          className="cursor-pointer flex-shrink-0"
                        >
                          <Image
                            src={
                              product.selectedImg.views.front ||
                              '/placeholder.svg'
                            }
                            alt={product.name}
                            width={70}
                            height={70}
                            className="rounded-md object-cover"
                          />
                        </div>
                        <div>
                          <h3
                            className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                            onClick={() =>
                              router.push(`/product/${product._id}`)
                            }
                          >
                            {product.name}
                          </h3>
                          {product.selectedImg.color && (
                            <p className="text-sm text-gray-500">
                              Color: {product.selectedImg.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-gray-900">
                        ETB {product.price.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        <SetQuantity
                          cartProduct={product}
                          handleQtyDecrease={() => {
                            if (product.qty > 1) {
                              handleUpdateQuantity(product._id, product.qty - 1)
                            }
                          }}
                          handleQtyIncrease={() => {
                            if (product.qty < 50) {
                              handleUpdateQuantity(product._id, product.qty + 1)
                            }
                          }}
                          showLabel={false}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">
                      ETB {(product.price * product.qty).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-3">
                        <button
                          className="text-red-600 hover:text-red-800 transition p-1 rounded-full hover:bg-red-50"
                          onClick={() =>
                            handleRemoveProductFromCart(product._id)
                          }
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-6 border-t flex justify-between items-center">
            <Button label="Clear Cart" onClick={clearCart} size="medium" />
            <Link
              href="/"
              className="text-blue-600 hover:text-blue-800 flex pl-20 items-center"
            >
              <ArrowLeft className="w-8 h-4 mr-2" />
              Continue Shopping
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 h-fit">
          <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span>ETB {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Discount ({discountRate}%)</span>
              <span className="text-red-600">-ETB {discount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Taxes ({taxRate}%)</span>
              <span>ETB {tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span>
                {shipping === 0 ? 'Free' : `ETB ${shipping.toFixed(2)}`}
              </span>
            </div>

            {shipping === 0 ? (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                You qualify for free shipping!
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                Add ETB {(100 - subtotal).toFixed(2)} more to qualify for free
                shipping
              </div>
            )}

            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  ETB {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* <div className="mb-6">
            <label
              htmlFor="coupon"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Have a coupon?
            </label>
            <div className="flex gap-2">
              <input
                id="coupon"
                type="text"
                placeholder="Enter coupon code"
                className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
              <Button
                label="Apply"
                onClick={handleApplyCoupon}
                size="small"
                disabled={!couponCode.trim()}
              />
            </div>
          </div> */}

          <Button
            label={currentUser ? 'Proceed to Checkout' : 'Login to Checkout'}
            onClick={() => {
              if (currentUser) {
                router.push('/checkout')
              } else {
                router.push('/signin')
              }
            }}
            outline
            size="large"
          />
        </div>
      </div>
    </div>
  )
}

export default Cart
