import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/[...nextauth]'
import { Order } from '@/app/checkout/orders/myorder/types'


export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      })
    }

    // This would be replaced with your actual database query
    // For example: const orders = await db.order.findMany({ where: { userId: session.user.id } })

    // Mock data for demonstration
    const mockOrders: Order[] = [
      {
        _id: '65f8a1b2c3d4e5f6a7b8c9d0',
        user: session.user.id || 'user123',
        amount: 2499,
        currency: 'ETB',
        status: 'completed',
        deliveryStatus: 'delivered',
        createDate: new Date(
          Date.now() - 7 * 24 * 60 * 60 * 1000
        ).toISOString(), // 7 days ago
        paymentIntentId: 'pi_3NpXsLKj6lGwF8Kj1lGwF8Kj',
        products: [
          {
            name: 'Premium Leather Jacket',
            description:
              'Genuine leather jacket with premium stitching and comfortable fit',
            category: 'Clothing',
            brand: 'LeatherCraft',
            selectedImg: {
              color: 'Brown',
              colorCode: '#8B4513',
              image: '/placeholder.svg?height=300&width=300',
            },
            quantity: 1,
            price: 2499,
          },
        ],
        address: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+251925254436',
          street: '123 Main St',
          city: 'Bahir Dar',
          country: 'Ethiopia',
          zipCode: '10001',
        },
      },
      {
        _id: '75f8a1b2c3d4e5f6a7b8c9d1',
        user: session.user.id || 'user123',
        amount: 3750,
        currency: 'ETB',
        status: 'pending',
        deliveryStatus: 'shipped',
        createDate: new Date(
          Date.now() - 3 * 24 * 60 * 60 * 1000
        ).toISOString(), // 3 days ago
        paymentIntentId: 'pi_4NpXsLKj6lGwF8Kj1lGwF8Kj',
        products: [
          {
            name: 'Wireless Headphones',
            description:
              'High-quality wireless headphones with noise cancellation',
            category: 'Electronics',
            brand: 'SoundWave',
            selectedImg: {
              color: 'Black',
              colorCode: '#000000',
              image: '/placeholder.svg?height=300&width=300',
            },
            quantity: 1,
            price: 1500,
          },
          {
            name: 'Smartphone Case',
            description: 'Durable smartphone case with shock absorption',
            category: 'Accessories',
            brand: 'TechProtect',
            selectedImg: {
              color: 'Blue',
              colorCode: '#0000FF',
              image: '/placeholder.svg?height=300&width=300',
            },
            quantity: 3,
            price: 750,
          },
        ],
        address: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+251925254436',
          street: '123 Main St',
          city: 'Bahir Dar',
          country: 'Ethiopia',
          zipCode: '10001',
        },
      },
      {
        _id: '85f8a1b2c3d4e5f6a7b8c9d2',
        user: session.user.id || 'user123',
        amount: 1200,
        currency: 'ETB',
        status: 'cancelled',
        deliveryStatus: 'returned',
        createDate: new Date(
          Date.now() - 14 * 24 * 60 * 60 * 1000
        ).toISOString(), // 14 days ago
        paymentIntentId: 'pi_5NpXsLKj6lGwF8Kj1lGwF8Kj',
        products: [
          {
            name: 'Cotton T-Shirt',
            description: 'Comfortable cotton t-shirt with modern design',
            category: 'Clothing',
            brand: 'FashionBasics',
            selectedImg: {
              color: 'White',
              colorCode: '#FFFFFF',
              image: '/placeholder.svg?height=300&width=300',
            },
            quantity: 2,
            price: 600,
          },
        ],
        address: {
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+251925254436',
          street: '123 Main St',
          city: 'Bahir Dar',
          country: 'Ethiopia',
          zipCode: '10001',
        },
      },
    ]

    // Return the array directly, not wrapped in another object
    return NextResponse.json(mockOrders)
  } catch (error) {
    console.error('[ORDERS_GET]', error)
    // Return an empty array on error instead of an error object
    return NextResponse.json([])
  }
}
