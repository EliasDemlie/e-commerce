// 'use server'

// import dbConnect from '@/lib/dbConnect'
// import { Product } from '@/server/models/Product'
// import { revalidatePath } from 'next/cache'
// import  LeanDocument  from 'mongoose'

// // Define the Products type
// type Products = {
//   _id: string
//   name: string
//   description: string
//   category: {
//     name: string
//     subCategories: string[]
//   }
//   brand: string
//   images: {
//     color: string
//     colorCode: string
//     views: {
//       front: string
//       side: string
//       back: string
//     }
//   }[]
//   inStock: boolean
//   quantity?: number
//   rating: number
//   price: number
//   selectedSize?: string
// }

// // Define a type for the lean document
// type LeanProduct = LeanDocument<Products> & { _id: any } // _id can be ObjectId or string

// export async function fetchProducts(
//   searchQuery?: string,
//   category?: string,
//   limit: number = 50
// ) {
//   try {
//     await dbConnect()

//     const query: any = { inStock: true }

//     if (searchQuery) {
//       query.$or = [
//         { name: { $regex: searchQuery, $options: 'i' } },
//         { description: { $regex: searchQuery, $options: 'i' } },
//         { brand: { $regex: searchQuery, $options: 'i' } },
//       ]
//     }

//     if (category && category !== 'all') {
//       query['category.name'] = category
//     }

//     const products = await Product.find(query)
//       .limit(limit)
//       .sort({ createdAt: -1 })
//       .lean<LeanProduct[]>()

//     return products.map((product) => ({
//       ...product,
//       _id: product._id.toString(), // Safe to call toString() on ObjectId
//     })) as Products[]
//   } catch (error) {
//     console.error('Error fetching products:', error)
//     throw new Error('Failed to fetch products')
//   }
// }

// export async function fetchProductCategories() {
//   try {
//     await dbConnect()
//     const categories = await Product.distinct('category.name')
//     return categories as string[]
//   } catch (error) {
//     console.error('Error fetching categories:', error)
//     return []
//   }
// }

// export async function updateProductStock(productId: string, quantity: number) {
//   try {
//     await dbConnect()

//     await Product.findByIdAndUpdate(productId, {
//       quantity,
//       inStock: quantity > 0,
//     })

//     revalidatePath('/manager')
//     return { success: true }
//   } catch (error) {
//     console.error('Error updating product stock:', error)
//     throw new Error('Failed to update product stock')
//   }
// }
