'use client'

import { useEffect, useState } from 'react'
import type { Product } from '@/type/Product'
export function useProductData() {
  const [brands, setBrands] = useState<string[]>([])
  const [categories, setCategories] = useState<{ name: string; subCategories: string[] }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProductData = async () => {
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

        const fetchedBrands = Array.from(
          new Set((data.products as Product[]).map((product) => product.brand))
        )
        setBrands(fetchedBrands)

       
        const fetchedCategories = Array.from(
          new Map(
            (data.products as Product[]).map((product) => [
              product.category.name,
              product.category,
            ])
          ).values()
        )
        setCategories(fetchedCategories)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchProductData()
  }, [])

  return { brands, categories, isLoading, error }
}
