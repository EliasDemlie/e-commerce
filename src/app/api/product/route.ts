import { getCurrentUser } from '@/action/CurrentUser'
import dbConnect from '@/lib/dbConnect'

import Category from '@/server/models/Category'

import { Product } from '@/server/models/Product'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'MANAGER') {
    return NextResponse.error()
  }

  await dbConnect()
  const body = await req.json()
  const {
    name,
    description,
    category,
    brand,
    images,
    inStock,
    quantity,
    price,
    
  } = body


  if (quantity < 1) {
    return new Response(
      JSON.stringify({ error: 'Quantity must be at least 1' }),
      { status: 400 }
    )
  }
   if (!category || !category.name) {
    console.error('Category name is required')
     return new Response(
      
       JSON.stringify({ error: 'Category name is required' }),
       { status: 400 }
     )
   }
   console.log('The product Categoty:',category)
  try {
    let categoryDoc = await Category.findOne({ name: category.name })
   if (!categoryDoc) {
       categoryDoc = await Category.create({
       name: category.name,
       subCategories: category?.subCategories || [],
       icon: category?.icon || '',
     })
   }

    const imageGroup =
      Array.isArray(images) && images.length > 0 ? images[0] : null
    console.log('Image group:', imageGroup)
    const product = new Product({
      name,
      description,
      category: categoryDoc._id,
      brand,
      images: {
        color: imageGroup.color,
        colorCode: imageGroup.colorCode,
        views: {
          front: imageGroup.views.front,
          side: imageGroup.views.side,
          back: imageGroup.views.back,
        },
      },
      inStock,
      quantity,
      price,
    })

    const savedProduct = await product.save()
    console.log('Product created:', savedProduct)
    
    return new Response(
      JSON.stringify({ message: 'Product created', product: savedProduct }),
      {
        status: 201,
      }

    )
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error creating product:', error.message)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }
}


export async function GET() {
  try {
    await dbConnect()

    const products = await Product.find()
      .populate('category')
        
      console.log('Fetched products:', products)

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

