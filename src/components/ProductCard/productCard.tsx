'use client'
import type React from 'react'
import { useState } from 'react'
import type { Product } from '@/type/Product'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { truncateText } from '@/hooks/utils/truncateText'
import { Rating } from '@mui/material'
import { FormatPrice } from '@/hooks/utils/formatPrice'
import WishlistButton from './WishlistButton'
import { useCart } from '@/hooks/useCart'
import { toast } from 'react-toastify'
import { MdCheckCircle } from 'react-icons/md'
import { JSX } from 'react'
interface ProductCardProps {
  product: Product
}
export const ProductCard: React.FC<ProductCardProps> = ({
  product,
}): JSX.Element => {
  const router = useRouter()
  const { handleAddProductToCart, cartProducts } = useCart()
  const [isHovered, setIsHovered] = useState(false)
 
  const isInCart = cartProducts?.some((item) => item._id === product._id)

  const handleQuickAdd = (e: React.MouseEvent): void => {
    e.stopPropagation() 

    const cartProduct = {
      _id: product._id,
      name: product.name,
      description: product.description,
      brand: product.brand,
      category: product.category.name, 
      selectedImg: {
        ...product.images[0],
      },
      qty: 1,
      price: product.price,
      
    }

    handleAddProductToCart(cartProduct)
    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: <MdCheckCircle className="text-green-500" />,
    })
  }

  return (
    <div
      className="col-span-1 cursor-pointer rounded-sm p-2 transition hover:shadow-lg text-center text-sm relative group"
      onClick={() => {
        router.push(`/product/${product._id}`)
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center w-full gap-1">
        <div className="aspect-square overflow-hidden relative w-full h-36">
          <Image
            src={product?.images?.[0]?.views?.front }
            alt={product?.name || 'Product Image'}
            fill
            className={`w-full h-36 object-cover rounded-md transition-transform duration-300 ${
              isHovered ? 'scale-110' : 'scale-100'
            }`}
          />

          {/* Badge for new or sale items
          {product.isNew && (
            <div className="absolute top-2 left-2 bg-teal-500 text-white text-xs px-2 py-1 rounded">
              NEW
            </div>
          )}
          {product.onSale && (
            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              SALE
            </div>
          )} */}

          {/* Quick actions overlay */}
          <div
            className={`absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute top-2 right-2">
              <WishlistButton
                productId={product._id || ''}
                size={18}
                className="bg-white p-2 rounded-full"
              />
            </div>

            <button
              onClick={handleQuickAdd}
              className="bg-white text-gray-800 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-100 transition"
            >
              {isInCart ? 'Added to Cart' : 'Quick Add'}
            </button>
          </div>
        </div>

        <div className="mt-3 flex flex-col items-center">
          <div className="font-medium">
            {truncateText(product?.name || 'No Name Available')}
          </div>

          <div className="mt-1">
            <Rating value={product.rating || 3} readOnly size="small" />
          </div>

          <div className="mt-1 font-bold">{FormatPrice(product?.price)}</div>

          
          {product.images && product.images.length > 1 && (
            <div className="flex gap-1 mt-2">
              {product.images.slice(0, 4).map((img, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: img.colorCode || 'gray' }}
                  title={img.color}
                />
              ))}
              {product.images.length > 4 && (
                <div className="text-xs text-gray-500">
                  +{product.images.length - 4}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
