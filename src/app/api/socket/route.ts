import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  console.log('request received at /api/socket',request.url)
  return new Response(
    JSON.stringify({
      message: 'Socket.IO endpoint ready',
      timestamp: new Date().toISOString(),
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    
    console.log('Received notification request:', body)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Notification processed',
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error processing notification:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to process notification',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
