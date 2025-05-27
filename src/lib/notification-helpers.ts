export interface Notification {
  id: string
  userId?: string
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
  read: boolean
  createdAt: Date
  actionUrl?: string
  actionText?: string
  image?: string
  relatedId?: string
  expiresAt?: Date
  metadata?:
    | OrderMetadata
    | PriceMetadata
    | WishlistMetadata
    | PromotionMetadata
    | AccountMetadata
}

export interface OrderMetadata {
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  totalAmount: number
}

export interface PriceMetadata {
  oldPrice: number
  newPrice: number
  discount: number
  currency: string
}

export interface WishlistMetadata {
  productName: string
  category?: string
  variant?: string
}

export interface PromotionMetadata {
  promotionId?: string
  code?: string
  discountValue?: number
  discountType?: 'percentage' | 'fixed'
  validUntil?: string
}

export interface AccountMetadata {
  action?: 'password_change' | 'login' | 'profile_update' | 'email_change'
  ipAddress?: string
  browser?: string
  location?: string
}

export interface NotificationContextType {
  notifications: Notification[]
  unreadCount: number
  addNotification: (notification: {
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
  }) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearAllNotifications: () => void
}
