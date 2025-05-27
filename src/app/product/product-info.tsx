'use client'
import { useEffect, useState } from 'react'
import type React from 'react'

import { MdClose, MdInfoOutline, MdLocalShipping } from 'react-icons/md'
import {
  FaTruck,
  FaShieldAlt,
  FaBox,
  FaRegClock,
  FaStore,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import type { Product } from '@/type/Product'
import type { CartProduct } from '@/type/CartProduct'
import Button from '@/components/input/Button'
import SetQuantity from '@/components/ProductCard/SetQuantity'
import WishlistButton from '@/components/ProductCard/WishlistButton'
import ShareProduct from '@/components/ProductCard/ShareProduct'
import RatingDisplay from '@/components/ProductCard/RatingDisplay'
import { toast } from 'react-toastify'
import { FormatPrice } from '@/hooks/utils/formatPrice'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
}

interface ProductInfoProps {
  product: Product
  cartProduct: CartProduct
  handleQtyIncrease: () => void
  handleQtyDecrease: () => void
  handleAddToCart: () => void
  handleBuyNow: () => void
  setCartProduct: React.Dispatch<React.SetStateAction<CartProduct>>
  reviewStats: ReviewStats | null
  selectedSize: string
  setSelectedSize: React.Dispatch<React.SetStateAction<string>>
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  product,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
  handleAddToCart,
  handleBuyNow,
  setCartProduct,
  reviewStats,
  selectedSize,
  setSelectedSize,
}) => {
  const router = useRouter()
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false)
  const [isStockNotificationEnabled, setIsStockNotificationEnabled] =
    useState(false)
  const [isProductInCart, setProductInCart] = useState(false)
  const [email, setEmail] = useState('')

  const handleStockNotification = (e: React.FormEvent): void => {
    e.preventDefault()
    setIsStockNotificationEnabled(true)
    toast.success("You'll be notified when this product is back in stock!", {
      position: 'top-right',
      autoClose: 3000,
    })
    setEmail('')
  }

  const { cartProducts } = useCart()
  const Horizontal = () => {
    return <hr className="border-t-4 w-1/2 mb-5 mt-2" />
  }

  useEffect(() => {
    setProductInCart(false)
    if (cartProducts) {
      const existItem = cartProducts.find((item) => item._id === product._id)

      if (existItem) {
        setProductInCart(true)
        setCartProduct((prev) => ({
          ...prev,
          qty: existItem.qty,
        }))
      }
    }
  }, [cartProducts, product])

  const SizeGuideModal = () => (
    <AnimatePresence>
      {showSizeGuide && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowSizeGuide(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Size Guide</h3>
              <button
                onClick={() => setShowSizeGuide(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium mb-2">How to Measure</h4>
              <p className="text-sm text-gray-600 mb-4">
                For the best fit, take measurements directly on your body
                wearing minimal clothing.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium">Chest</h5>
                    <p className="text-sm text-gray-600">
                      Measure around the fullest part of your chest, keeping the
                      tape horizontal.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium">Waist</h5>
                    <p className="text-sm text-gray-600">
                      Measure around your natural waistline, keeping the tape
                      comfortably loose.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border px-4 py-2 text-left">Size</th>
                    <th className="border px-4 py-2 text-left">
                      Chest (inches)
                    </th>
                    <th className="border px-4 py-2 text-left">
                      Waist (inches)
                    </th>
                    <th className="border px-4 py-2 text-left">Hip (inches)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2">XS</td>
                    <td className="border px-4 py-2">34-36</td>
                    <td className="border px-4 py-2">28-30</td>
                    <td className="border px-4 py-2">34-36</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">S</td>
                    <td className="border px-4 py-2">36-38</td>
                    <td className="border px-4 py-2">30-32</td>
                    <td className="border px-4 py-2">36-38</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">M</td>
                    <td className="border px-4 py-2">38-40</td>
                    <td className="border px-4 py-2">32-34</td>
                    <td className="border px-4 py-2">38-40</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="border px-4 py-2">L</td>
                    <td className="border px-4 py-2">40-42</td>
                    <td className="border px-4 py-2">34-36</td>
                    <td className="border px-4 py-2">40-42</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2">XL</td>
                    <td className="border px-4 py-2">42-44</td>
                    <td className="border px-4 py-2">36-38</td>
                    <td className="border px-4 py-2">42-44</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const DeliveryInfoModal = () => (
    <AnimatePresence>
      {showDeliveryInfo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={() => setShowDeliveryInfo(false)}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Delivery Information</h3>
              <button
                onClick={() => setShowDeliveryInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <MdClose size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Standard Delivery</h4>
                  <p className="text-sm text-gray-600">2-4 business days</p>
                  <p className="text-sm font-medium">$4.99</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Express Delivery</h4>
                  <p className="text-sm text-gray-600">1-2 business days</p>
                  <p className="text-sm font-medium">$9.99</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <FaStore className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-medium">Store Pickup</h4>
                  <p className="text-sm text-gray-600">
                    Available at selected stores
                  </p>
                  <p className="text-sm font-medium">Free</p>
                </div>
              </div>

              <div className="pt-2 text-sm text-gray-600">
                <p>Free standard delivery on orders over $50.</p>
                <p>
                  Please note that delivery times may be extended during peak
                  periods.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="flex flex-col gap-1 w-full mb-10 p-5">
      <SizeGuideModal />

      <DeliveryInfoModal />

      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-medium text-stone-900">
            {product?.name || 'No Name Available'}
          </h2>
          <p className="text-sm text-gray-500">SKU: {product._id}</p>
        </div>
        <WishlistButton productId={product._id} />
      </div>

      <div className="flex items-center gap-3 mt-2">
        <RatingDisplay
          rating={reviewStats?.averageRating || product.rating || 0}
          reviewCount={reviewStats?.totalReviews || 0}
        />
        <button
          onClick={() => {
            // Scroll to reviews section
            document
              .getElementById('product-tabs')
              ?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="text-sm text-teal-600 hover:underline"
        >
          Read reviews
        </button>
      </div>

      <div className="mt-4 text-xl font-bold text-teal-700">
        {FormatPrice(product.price)}
      </div>

      <div className="mt-4 text-justify">{product.description}</div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FaTruck className="text-teal-500" />
          <span className="text-sm">Free shipping over $50</span>
        </div>
        <div className="flex items-center gap-2">
          <FaShieldAlt className="text-teal-500" />
          <span className="text-sm">1 Year Warranty</span>
        </div>
        <div className="flex items-center gap-2">
          <FaBox className="text-teal-500" />
          <span className="text-sm">Easy Returns</span>
        </div>
        <div className="flex items-center gap-2">
          <FaRegClock className="text-teal-500" />
          <span className="text-sm">24/7 Support</span>
        </div>
      </div>

      <Horizontal />

      <div>
        <div className="flex justify-between items-center">
          <span className="font-semibold">Category:</span>
          <span>{product.category.name}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold">Brand:</span>
          <span>{product.brand}</span>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="font-semibold">Availability:</span>
          <span
            className={
              product.inStock
                ? 'text-teal-600 font-medium'
                : 'text-red-500 font-medium'
            }
          >
            {product.inStock
              ? `In Stock (${product.quantity} available)`
              : 'Out of Stock'}
          </span>
        </div>
      </div>

      {product.category.name === 'clothing' && (
        <div>
          <Horizontal />
          <div className="flex items-center justify-between">
            <span className="font-semibold">Size:</span>
            <button
              onClick={() => setShowSizeGuide(true)}
              className="text-sm text-teal-600 hover:underline flex items-center gap-1"
            >
              <MdInfoOutline size={16} />
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2 mt-2">
            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
              <button
                key={size}
                className={`border rounded-md py-2 transition-colors ${
                  selectedSize === size
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
      <Horizontal />

      {product.inStock ? (
        <>
          <div className="grid grid-cols-2 gap-4">
            {isProductInCart ? (
              <div>
                <div className="text-teal-600 font-medium mb-2">
                  This product is already in your cart!
                </div>
                <Button
                  label="Goto Cart"
                  onClick={() => {
                    router.push('/cart')
                  }}
                  outline={false}
                  icon={FaBox}
                />
              </div>
            ) : (
              <>
                <div className="text-teal-600 font-medium mb-5">
                  <SetQuantity
                    cartProduct={cartProduct}
                    handleQtyDecrease={handleQtyDecrease}
                    handleQtyIncrease={handleQtyIncrease}
                  />
                </div>
                <Horizontal />
                <div className="grid  gap-4">
                  <Button
                    label="Add to Cart"
                    onClick={() => {
                      handleAddToCart()
                      setProductInCart(true)
                    }}
                    outline
                    icon={FaBox}
                  />
                </div>
              </>
            )}
            <div className={`${isProductInCart ? 'mt-8' : 'mt-0'}`}>
              <Button
                label="Buy Now"
                onClick={handleBuyNow}
                outline={false}
                icon={FaBox}
              />
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-700 mb-3">
            This product is currently out of stock.
          </p>
          {!isStockNotificationEnabled ? (
            <form onSubmit={handleStockNotification} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                required
                className="flex-1 px-3 py-2 border rounded-md"
              />
              <Button
                label="Notify Me"
                onClick={(e) => handleStockNotification(e)}
                outline
                size="small"
              />
            </form>
          ) : (
            <p className="text-teal-600 font-medium">
              We will notify you when this product is back in stock!
            </p>
          )}
        </div>
      )}

      <div className="flex items-center gap-4 mt-6">
        <ShareProduct productId={product._id} productName={product.name} />
        <button
          onClick={() => setShowDeliveryInfo(true)}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <MdLocalShipping size={18} />
          <span>Delivery Info</span>
        </button>
      </div>
    </div>
  )
}

export default ProductInfo
