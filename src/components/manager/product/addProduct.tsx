'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'


import { Button } from '@/components/ui/button2'
import type { Product } from '@/type/Product'
import CategorySection from './section/category'
import BasicInformationSection from './section/basicInfo'
import ImagesSection from './section/image'
import PricingSection from './section/price'
import { toast } from '@/components/ui/use-toast'



export default function AddProductPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchInput, setSearchInput] = useState('')
  const [brands, setBrand] = useState<string[]>([])
  const [product, setProduct] = useState<
    Omit<Product, '_id' | 'id' | 'rating'>
  >({
    name: '',
    description: '',
    category: {
      name: '',
      subCategories: [],
    },
    brand: '',
    images: [
      {
        color: '',
        colorCode: '#000000',
        views: {
          front: '',
          side: '',
          back: '',
        },
      },
    ],
    inStock: true,
    quantity: 0,
    price: 0,
  })

  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategories, setNewSubcategories] = useState<string[]>([])
  const [categories, setCategories] = useState<
    { name: string; subCategories: string[] }[]
  >([])
  const [newSubcategoryInput, setNewSubcategoryInput] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_APP_URL}/api/product`,
          {
            cache: 'no-store',
          }
        )

        if (!res.ok) {
          console.error('Failed to fetch products')
          return
        }

        const data = await res.json()

        const fetchedBrands = Array.from(
          new Set((data.products as Product[]).map((product) => product.brand))
        )

        setBrand(fetchedBrands)

        const fetchCategory = Array.from(
          new Map(
            (data.products as Product[]).map((product) => [
              product.category.name,
              product.category,
            ])
          ).values()
        )
        setCategories(fetchCategory)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProduct()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const finalSubcategories = [...newSubcategories]
    if (isAddingNewCategory && newSubcategoryInput.trim()) {
      finalSubcategories.push(newSubcategoryInput.trim())
    }

    const finalProduct = {
      ...product,
      category: isAddingNewCategory
        ? {
            name: newCategory.trim(),
            subCategories: finalSubcategories,
          }
        : product.category,
    }

    try {
      const missingImages = product.images.some(
        (img) => !img.views.front || !img.views.side || !img.views.back
      )

      if (missingImages) {
        toast({
          title: 'All Images should be filled',
          description: 'Please fill all the images',
          variant: 'destructive',
        })
      }

      const response = await fetch('/api/product', {
        method: 'POST',
        body: JSON.stringify(finalProduct),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Product creation failed:', errorText)
      }
      else {

      toast({
        title: 'Product added successfully!',
        description: 'Your product has been added to the store.',
       
      })
    }
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: 'Error Adding Product!',
        description: 'There was an error adding your product.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-slate-50">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <BasicInformationSection
          product={product}
          setProduct={setProduct}
          brands={brands}
          searchInput={searchInput}
          setSearchInput={setSearchInput}
        />

        <CategorySection
          product={product}
          setProduct={setProduct}
          categories={categories}
          isAddingNewCategory={isAddingNewCategory}
          setIsAddingNewCategory={setIsAddingNewCategory}
          newCategory={newCategory}
          setNewCategory={setNewCategory}
          newSubcategories={newSubcategories}
          setNewSubcategories={setNewSubcategories}
          newSubcategoryInput={newSubcategoryInput}
          setNewSubcategoryInput={setNewSubcategoryInput}
        />

        <ImagesSection product={product} setProduct={setProduct} />

        <PricingSection product={product} setProduct={setProduct} />

        {/* Submit Button */}
        <div className="flex justify-end ">
          <div className="bg-gray-400 rounded-lg">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="hover:bg-slate-500"
            >
              {isSubmitting ? 'Saving...' : 'Add Product'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
