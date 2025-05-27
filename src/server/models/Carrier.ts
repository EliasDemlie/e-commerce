import mongoose, { Schema, type Document } from 'mongoose'

export interface ICarrier extends Document {
  name: string
  isActive: boolean
  contactPhone?: string
  contactEmail?: string
  vehicle?: string
  zone?: string
  activatedAt?: string
  currentShipment?: {
    shipmentId: mongoose.Types.ObjectId
    trackingNumber: string
    orderNumber: string
    estimatedDelivery: string
  }
  createdAt: Date
  updatedAt: Date
}

const CarrierSchema = new Schema<ICarrier>(
  {
    name: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    contactPhone: { type: String },
    contactEmail: { type: String },
    vehicle: { type: String },
    zone: { type: String },
    activatedAt: { type: String },
    currentShipment: {
      shipmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Shipment',
        
      },
      trackingNumber: { type: String },
      orderNumber: { type: String},
      estimatedDelivery: { type: String},
    },
  },
  { timestamps: true }
)

export default mongoose.models.Carrier ||
  mongoose.model<ICarrier>('Carrier', CarrierSchema)
