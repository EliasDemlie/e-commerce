import mongoose, { Schema, type Document } from 'mongoose'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  imageUrl?: string
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  orderNumber: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  items: IOrderItem[]
  subtotal: number
  tax: number
  shipping: number

  shippingAddressId: mongoose.Types.ObjectId
  billingAddressId: mongoose.Types.ObjectId
  transactionRef?: string // Added for Chapa payment tracking
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const OrderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  imageUrl: { type: String },
})

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderNumber: { type: String, required: true, unique: true },
    orderStatus: {
      type: String,
      enum: [
        'pending',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
      ],
      default: 'pending',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
      required: true,
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    shipping: { type: Number, required: true },
    shippingAddressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    billingAddressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    transactionRef: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
)

export default mongoose.models.Order ||
  mongoose.model<IOrder>('Order', OrderSchema)
