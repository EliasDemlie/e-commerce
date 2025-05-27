'use client'
import { MdPlayCircleOutline } from 'react-icons/md'
import type React from 'react'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductImage from '@/components/ProductCard/ProductImage'
import type { Product } from '@/type/Product'
import type { CartProduct, SelectedImg } from '@/type/CartProduct'

interface ProductGalleryProps {
  product: Product
  cartProduct: CartProduct
  handleColorSelect: (value: SelectedImg) => void
}

const ProductGallery: React.FC<ProductGalleryProps> = ({
  product,
  cartProduct,
  handleColorSelect,
}) => {
  const [showVideoModal, setShowVideoModal] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const VideoModal = () => (
    <AnimatePresence>
      {showVideoModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowVideoModal(false)
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-black rounded-lg overflow-hidden max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-auto"
              src="/enatwagonder.mp4" 
            >
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="relative">
      <ProductImage
        cartProduct={cartProduct}
        product={product}
        handleColorSelect={handleColorSelect}
      />

      {/* Video preview button */}
      <button
        onClick={() => setShowVideoModal(true)}
        className="absolute bottom-4 right-4 bg-white bg-opacity-80 rounded-full p-2 shadow-md hover:bg-opacity-100 transition-all"
        aria-label="Watch product video"
      >
        <MdPlayCircleOutline size={32} className="text-teal-600" />
      </button>

      {/* Video Modal */}
      <VideoModal />
    </div>
  )
}

export default ProductGallery
