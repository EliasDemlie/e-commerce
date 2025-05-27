import { type NextRequest, NextResponse } from 'next/server'

interface Notification {
  id: number
  type: string
  title: string
  message: string
  userId: string
  read: boolean
  createdAt: string
  metadata: Record<string, unknown>
  actionUrl?: string
  actionText?: string
  image?: string
}

const notifications: Notification[] = []
let notificationId = 1

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId')
  const type = searchParams.get('type')
  const limit = Number.parseInt(searchParams.get('limit') || '50')
  const offset = Number.parseInt(searchParams.get('offset') || '0')

  try {
    let filteredNotifications = notifications

    if (userId) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.userId === userId
      )
    }

    if (type) {
      filteredNotifications = filteredNotifications.filter(
        (n) => n.type === type
      )
    }

    const paginatedNotifications = filteredNotifications
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(offset, offset + limit)

    return NextResponse.json({
      notifications: paginatedNotifications,
      total: filteredNotifications.length,
      hasMore: offset + limit < filteredNotifications.length,
    })
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      type,
      title,
      message,
      userId,
      metadata,
      actionUrl,
      actionText,
      image,
    } = body

    if (!type || !title || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const notification: Notification = {
      id: notificationId++,
      type,
      title,
      message,
      userId: userId || 'system',
      read: false,
      createdAt: new Date().toISOString(),
      metadata: metadata || {},
      actionUrl,
      actionText,
      image,
    }

    notifications.push(notification)

    // Emit to Socket.IO if available
    const { emitNotification } = await import('@/lib/socket-server')
    // emitNotification(
    //   {
    //     type: 'notification',
    //     ...notification,
    //   },
    //   userId
    // )

    return NextResponse.json({ success: true, notification })
  } catch {
    return NextResponse.json(
      { error: 'Failed to create notification' },
      { status: 500 }
    )
  }
}
