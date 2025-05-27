'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import ProductDetail from '../ProductDetail'
import Loading from '@/components/Loading'

const Page = () => {
  const params = useParams()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      
      if (!params || !params.id) {
        setError('Invalid product ID')
        setLoading(false)
        return
      }
    console.log('Fetching product with ID1:', params.id)

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/product/${params.id}`) 
        console.log('Fetching product with ID:', params.id)
        console.log('Response:', res)
        if (!res.ok) {
          throw new Error('Failed to fetch product')
        }
                

        const productData = await res.json()
        setProduct(productData)
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
        else {  
          setError('An unknown error occurred')
        }
        
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params?._id])

  if (loading) {
    return <Loading/>
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  if (!product) {

    return <div>Product not found</div>
  }

  return (
    <div className="grid grid-cols-1 gap-11 p-3">
      <ProductDetail product={product} />
    </div>
  )
}

export default Page
