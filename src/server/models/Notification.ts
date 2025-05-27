import mongoose, { Schema, type Document } from 'mongoose'

export type NotificationType =
  | 'order'
  | 'price'
  | 'wishlist'
  | 'promotion'
  | 'account'


export interface OrderMetadata {
  orderNumber: string
  orderStatus: string
  paymentStatus: string
  totalAmount?: number
}

export interface PriceMetadata {
  oldPrice: number
  newPrice: number
  discount: number
  currency?: string
}

export interface WishlistMetadata {
  productName: string
  variant?: string
  category?: string
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


export type NotificationMetadata =
  | OrderMetadata
  | PriceMetadata
  | WishlistMetadata
  | PromotionMetadata
  | AccountMetadata
  | Record<string, string | number | boolean | null>

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  type: NotificationType
  title: string
  description: string
  read: boolean
  actionUrl?: string
  actionText?: string
  image?: string
  relatedId?: mongoose.Types.ObjectId 
  metadata?: NotificationMetadata 
  expiresAt?: Date
  createdAt: Date
  updatedAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, 
    },
    type: {
      type: String,
      enum: ['order', 'price', 'wishlist', 'promotion', 'account'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionUrl: {
      type: String,
    },
    actionText: {
      type: String,
    },
    image: {
      type: String,
    },
    relatedId: {
      type: Schema.Types.ObjectId,
      index: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    expiresAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
  }
)


NotificationSchema.index({ userId: 1, read: 1 })


NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export default mongoose.models.Notification ||
  mongoose.model<INotification>('Notification', NotificationSchema)
