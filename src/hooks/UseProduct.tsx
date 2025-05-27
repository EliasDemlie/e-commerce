'use client'

import { Product } from '@/type/Product'
import { useState, useEffect } from 'react'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/product`,
        {
          cache: 'no-store',
        }
      )

      if (!res.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await res.json()
      setProducts(data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      setError(
        error instanceof Error ? error.message : 'An unknown error occurred'
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { products, isLoading, error, refreshProducts: fetchProducts }
}
