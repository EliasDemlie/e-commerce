import { type NextRequest, NextResponse } from 'next/server'

const products: any[] = [
  {
    id: 'PROD-001',
    name: 'iPhone 15 Pro',
    price: 999.99,
    stock: 50,
    category: 'Electronics',
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 'PROD-002',
    name: 'MacBook Air M2',
    price: 1299.99,
    stock: 25,
    category: 'Electronics',
    image: '/placeholder.svg?height=200&width=200',
  },
  {
    id: 'PROD-003',
    name: 'AirPods Pro',
    price: 249.99,
    stock: 5,
    category: 'Electronics',
    image: '/placeholder.svg?height=200&width=200',
  },
]

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id
    const body = await request.json()
    const { stock } = body

    const productIndex = products.findIndex(
      (product) => product.id === productId
    )

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = products[productIndex]
    const oldStock = product.stock

    products[productIndex] = {
      ...product,
      stock,
      updatedAt: new Date().toISOString(),
    }

    // Check for low stock notification
    if (stock <= 10 && oldStock > 10) {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }/api/notifications`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'low_stock',
            title: 'Low Stock Alert',
            message: `${product.name} is running low on stock (${stock} remaining)`,
            userId: 'admin',
            actionUrl: `/products/${productId}`,
            actionText: 'Manage Stock',
            image: product.image,
            metadata: {
              productId,
              productName: product.name,
              currentStock: stock,
              threshold: 10,
            },
          }),
        }
      )
    }

    // Check for back in stock notification
    if (stock > 0 && oldStock === 0) {
      await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }/api/notifications`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'back_in_stock',
            title: 'Back in Stock',
            message: `${product.name} is back in stock!`,
            userId: 'all', // Broadcast to all users
            actionUrl: `/products/${productId}`,
            actionText: 'View Product',
            image: product.image,
            metadata: {
              productId,
              productName: product.name,
              category: product.category,
            },
          }),
        }
      )
    }

    return NextResponse.json({ success: true, product: products[productIndex] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update stock' },
      { status: 500 }
    )
  }
}
