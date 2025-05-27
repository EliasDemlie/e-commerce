'use client'

import type React from 'react'
import { createContext, useContext, useEffect, useState } from 'react'
import { toast } from '@/components/ui/use-toast'
import type {
  Notification,
  NotificationContextType,
} from '@/type/notification'
import { useSocket } from '@/hooks/useSocket'

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
)

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const socket = useSocket()

  const unreadCount = notifications.filter((n) => !n.read).length

  const addNotification = (notification: {
    type:
      | 'order'
      | 'user'
      | 'product'
      | 'system'
      | 'price'
      | 'wishlist'
      | 'promotion'
      | 'account'
    title: string
    message: string
    description?: string
    actionUrl?: string
    actionText?: string
    image?: string
  }) => {
    const newNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      read: false,
      createdAt: new Date(),
    }

    setNotifications((prev) => [newNotification, ...prev].slice(0, 100))

    toast({
      title: notification.title,
      description: notification.message || notification.description,
    })
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Load notifications from localStorage
  useEffect(() => {
    try {
      const savedNotifications = localStorage.getItem('notifications')
      if (savedNotifications) {
        const parsed = JSON.parse(savedNotifications) as Notification[]
        if (Array.isArray(parsed)) {
          setNotifications(
            parsed.map((n) => ({
              ...n,
              createdAt: new Date(n.createdAt),
            }))
          )
        }
      }
    } catch (error) {
      console.error('Error loading notifications from localStorage:', error)
      localStorage.removeItem('notifications')
    }
  }, [])

  // Save notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications))
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error)
    }
  }, [notifications])

  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Socket.IO connection established')
        // Join user-specific room if you have user authentication
        // socket.emit('join-user-room', userId)
      })

      socket.on('notification', (data: any) => {
        console.log('Received notification:', data)

        // Handle different notification types
        switch (data.type) {
          case 'new_order':
            addNotification({
              type: 'order',
              title: 'New Order',
              message: `Order #${data.orderId} has been placed`,
              actionUrl: `/orders/${data.orderId}`,
              actionText: 'View Order',
            })
            break
          case 'order_status':
            addNotification({
              type: 'order',
              title: 'Order Status Update',
              message: `Order #${data.orderId} status changed to ${data.status}`,
              actionUrl: `/orders/${data.orderId}`,
              actionText: 'View Order',
            })
            break
          case 'new_user':
            addNotification({
              type: 'user',
              title: 'New User',
              message: `New user ${data.userName} has registered`,
              actionUrl: '/users',
              actionText: 'View Users',
            })
            break
          case 'low_stock':
            addNotification({
              type: 'product',
              title: 'Low Stock Alert',
              message: `Product ${data.productName} is running low on stock`,
              actionUrl: `/products/${data.productId}`,
              actionText: 'Manage Stock',
            })
            break
          case 'price_drop':
            addNotification({
              type: 'price',
              title: 'Price Drop Alert',
              message: `${data.productName} is now ${data.discount}% off!`,
              actionUrl: `/products/${data.productId}`,
              actionText: 'View Product',
              image: data.imageUrl,
            })
            break
          case 'back_in_stock':
            addNotification({
              type: 'wishlist',
              title: 'Back in Stock',
              message: `${data.productName} in your wishlist is back in stock!`,
              actionUrl: `/products/${data.productId}`,
              actionText: 'Add to Cart',
              image: data.imageUrl,
            })
            break
          case 'promotion':
            addNotification({
              type: 'promotion',
              title: data.title || 'Special Promotion',
              message: data.message || 'Check out our latest promotion!',
              actionUrl: data.actionUrl || '/promotions',
              actionText: data.actionText || 'View Promotion',
              image: data.imageUrl,
            })
            break
          case 'account':
            addNotification({
              type: 'account',
              title: data.title || 'Account Update',
              message: data.message || 'Your account has been updated',
              actionUrl: data.actionUrl || '/account',
              actionText: data.actionText || 'View Account',
            })
            break
          default:
            addNotification({
              type: 'system',
              title: data.title || 'System Notification',
              message: data.message || 'Unknown notification',
              actionUrl: data.actionUrl,
              actionText: data.actionText,
            })
        }
      })

      socket.on('connect_error', (error) => {
        console.error('Socket.IO connection error:', error)
        addNotification({
          type: 'system',
          title: 'Connection Error',
          message: 'Unable to connect to notification server',
        })
      })

      socket.on('disconnect', (reason) => {
        console.log('Socket.IO disconnected:', reason)
      })

      return () => {
        socket.off('notification')
        socket.off('connect')
        socket.off('connect_error')
        socket.off('disconnect')
      }
    }
  }, [socket])

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotificationContext(): NotificationContextType {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error(
      'useNotificationContext must be used within a NotificationProvider'
    )
  }
  return context
}
