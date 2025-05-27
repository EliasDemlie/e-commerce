'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { FaHeart, FaRegHeart } from 'react-icons/fa'
import { toast } from 'react-toastify'

interface WishlistButtonProps {
  productId: string
  className?: string
  size?: number
}

const WishlistButton: React.FC<WishlistButtonProps> = ({
  productId,
  className = '',
  size = 24,
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    setIsInWishlist(wishlist.includes(productId))
  }, [productId])

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent click from bubbling to parent elements

    setIsLoading(true)

    try {
      // In a real app, you would call your API here
      // await fetch('/api/wishlist', {
      //   method: isInWishlist ? 'DELETE' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ productId }),
      // })

      // For now, we'll just use localStorage
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')

      let newWishlist
      if (isInWishlist) {
        newWishlist = wishlist.filter((id: string) => id !== productId)
        toast.success('Removed from wishlist')
      } else {
        newWishlist = [...wishlist, productId]
        toast.success('Added to wishlist')
      }

      localStorage.setItem('wishlist', JSON.stringify(newWishlist))
      setIsInWishlist(!isInWishlist)
    } catch (error) {
      if (error instanceof Error) {
        toast.error('Failed to update wishlist')
      }
     
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={isLoading}
      className={`transition-all duration-200 ${
        isLoading ? 'opacity-50' : 'hover:scale-110'
      } ${className}`}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {isInWishlist ? (
        <FaHeart size={size} className="text-red-500" />
      ) : (
        <FaRegHeart size={size} className="text-gray-700" />
      )}
    </button>
  )
}

export default WishlistButton
