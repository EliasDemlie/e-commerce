'use client'

import type React from 'react'
import { useEffect, useState } from 'react'
import type { Product } from '@/type/Product'
import { ProductCard } from './productCard'


interface RecentlyViewedProps {
  currentProductId: string
  maxItems?: number
}

const RecentlyViewed: React.FC<RecentlyViewedProps> = ({
  currentProductId,
  maxItems = 4,
}) => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    // For now, we'll simulate it
    const fetchRecentlyViewed = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get recently viewed from localStorage
        const recentlyViewed = JSON.parse(
          localStorage.getItem('recentlyViewed') || '[]'
        )

        // Filter out current product
        const filteredIds = recentlyViewed
          .filter((id: string) => id !== currentProductId)
          .slice(0, maxItems)

        if (filteredIds.length === 0) {
          setLoading(false)
          return
        }

        // In a real app, you would fetch these products from your API
        // For now, we'll create dummy products
        const dummyProducts: Product[] = filteredIds.map(
          (id: string, index: number) => ({
            _id: id,
            name: `Recently Viewed Product ${index + 1}`,
            description: 'This is a placeholder for a recently viewed product',
            price: 99.99,
            images: [
              {
                color: 'default',
                views: {
                  front: '/placeholder.png',
                },
              },
            ],
            brand: 'Brand Name',
            category: {
              name: 'Category',
              subCategories: [],
            },
            inStock: true,
            rating: 4,
          })
        )

        setProducts(dummyProducts)
      } catch (error) {
        console.error('Error fetching recently viewed products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecentlyViewed()

    // Add current product to recently viewed
    if (currentProductId) {
      const recentlyViewed = JSON.parse(
        localStorage.getItem('recentlyViewed') || '[]'
      )

      // Remove if already exists (to move it to the front)
      const filtered = recentlyViewed.filter(
        (id: string) => id !== currentProductId
      )

      // Add to front of array
      const newRecentlyViewed = [currentProductId, ...filtered].slice(0, 10) // Keep last 10

      localStorage.setItem('recentlyViewed', JSON.stringify(newRecentlyViewed))
    }
  }, [currentProductId, maxItems])

  if (loading) {
    return (
      <div className="h-40 flex items-center justify-center">
        Loading recently viewed...
      </div>
    )
  }

  if (products.length === 0) {
    return null // Don't show section if no recently viewed products
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-4">Recently Viewed</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  )
}

export default RecentlyViewed
