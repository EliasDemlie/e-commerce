'use client'

import type React from 'react'
import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import SetQuantity from '@/components/ProductCard/SetQuantity'
import type { CartProduct } from '@/type/CartProduct'

interface CartItemProps {
  product: CartProduct
  handleRemoveProductFromCart: (id: string) => void
  handleUpdateQuantity: (id: string, qty: number) => void
}

const CartItem: React.FC<CartItemProps> = ({
  product,
  handleRemoveProductFromCart,
  handleUpdateQuantity,
}) => {
  const router = useRouter()

  return (
    <tr key={product._id}>
      <td className="px-4 py-2 flex items-center space-x-3 mt-8">
        <div
          onClick={() => router.push(`/product/${product._id}`)}
          role="button"
          tabIndex={0}
          className="cursor-pointer"
        >
          <Image
            src={product.selectedImg.views.front || '/placeholder.svg'}
            alt={product.name}
            width={50}
            height={50}
            className="rounded-lg object-cover"
          />
        </div>
        <span>{product.name}</span>
      </td>
      <td className="px-4 py-2 text-center pt-8">
        ${product.price.toFixed(2)}
      </td>
      <td className="px-4 py-2 text-center pt-8">
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
      </td>
      <td className="px-4 py-2 text-center font-semibold pt-8">
        ${(product.price * product.qty).toFixed(2)}
      </td>
      <td className="px-4 py-2 text-center pt-8">
        <div className="flex items-center justify-center space-x-2">
          <button
            className="text-red-600 hover:text-red-800"
            onClick={() => handleRemoveProductFromCart(product._id)}
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            className="text-blue-600 hover:text-blue-800"
            onClick={() => {}}
            title="Save for later"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  )
}

export default CartItem
