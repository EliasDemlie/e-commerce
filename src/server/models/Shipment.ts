import mongoose, { Schema, type Document } from 'mongoose'

export interface IShipment extends Document {
  orderId?: mongoose.Types.ObjectId
  trackingNumber: string
  carrierId: mongoose.Types.ObjectId
  status: 'processing' | 'in_transit' | 'delivered' | 'failed' | 'returned'
  dateShipped: Date | null
  dateDelivered: Date | null
  items: {
    productId: mongoose.Types.ObjectId
    quantity: number
  }[]
  customer: {
    name: string
    email: string
    address: {
      addressLine1: string
      addressLine2?: string
      city: string
      state: string
      postalCode: string
      country: string
    }
  }
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ShipmentSchema = new Schema<IShipment>(
  {
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    trackingNumber: { type: String, required: true },
    carrierId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['processing', 'in_transit', 'delivered', 'failed', 'returned'],
      default: 'processing',
      required: true,
    },
    dateShipped: { type: Date, default: null },
    dateDelivered: { type: Date, default: null },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    customer: {
      name: { type: String, required: true },
      email: { type: String },
      address: {
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
      },
    },
    notes: { type: String },
  },
  { timestamps: true }
)

export const Shipment =
  (mongoose.models.Shipment as mongoose.Model<IShipment>) ||
  mongoose.model<IShipment>('Shipment', ShipmentSchema)
