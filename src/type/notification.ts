export interface Notification {
  id: string
  title: string
  message: string
  type: 'order' | 'user' | 'product' | 'system'
  read: boolean
  createdAt: Date
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: {
    type: 'order' | 'user' | 'product' | 'system'
    title: string
    message: string
  }) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}
