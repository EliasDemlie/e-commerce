import { type NextRequest, NextResponse } from 'next/server'

// Mock products database
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
    const { price } = body

    const productIndex = products.findIndex(
      (product) => product.id === productId
    )

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = products[productIndex]
    const oldPrice = product.price

    products[productIndex] = {
      ...product,
      price,
      updatedAt: new Date().toISOString(),
    }

    // Check for price drop notification (if price decreased by more than 5%)
    if (price < oldPrice && (oldPrice - price) / oldPrice > 0.05) {
      const discount = Math.round(((oldPrice - price) / oldPrice) * 100)

      await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        }/api/notifications`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'price_drop',
            title: 'Price Drop Alert',
            message: `${
              product.name
            } is now ${discount}% off! Was $${oldPrice.toFixed(
              2
            )}, now $${price.toFixed(2)}`,
            userId: 'all', // Broadcast to all users
            actionUrl: `/products/${productId}`,
            actionText: 'View Deal',
            image: product.image,
            metadata: {
              productId,
              productName: product.name,
              oldPrice,
              newPrice: price,
              discount,
              currency: 'USD',
            },
          }),
        }
      )
    }

    return NextResponse.json({ success: true, product: products[productIndex] })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update price' },
      { status: 500 }
    )
  }
}
