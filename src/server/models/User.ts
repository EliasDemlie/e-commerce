import mongoose, { Document, Schema } from 'mongoose'

interface CurrentShipment {
  shipmentId: mongoose.Types.ObjectId
  trackingNumber: string
  orderNumber: string
  estimatedDelivery: string
}

export interface IUser extends Document {
  name: string
  email: string
  hashedPassword?: string
  emailVerified?: Date
  image?: string
  contactPhone?: string
  createdAt: Date
  updatedAt: Date
  role: 'USER' | 'ADMIN' | 'MANAGER' | 'CARRIER'
  isActive?: boolean 
  vehicle?: string 
  zone?: string 
  activatedAt?: Date 
  currentShipment?: CurrentShipment 
  warehouse?: string 
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: false },
    emailVerified: { type: Date },
    image: { type: String },
    contactPhone: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'MANAGER', 'CARRIER'],
      default: 'USER',
    },
    isActive: {
      type: Boolean,
      default: false,
      
    },
    vehicle: {
      type: String,
      
    },
    zone: {
      type: String,
      
    },
    activatedAt: {
      type: Date, 
      
    },
    currentShipment: {
      shipmentId: {
        type: Schema.Types.ObjectId,
        ref: 'Shipment', 
       
      },
      trackingNumber: {
        type: String,
       
      },
      orderNumber: {
        type: String,
       
      },
      estimatedDelivery: {
        type: String,
        
      },
    },
    warehouse: {
      type: String,
      required: function () {
        return this.role === 'MANAGER'
      },
    },
  },
  {
    toJSON: {
      getters: true,
      transform: (doc, ret) => {
        if (ret.role !== 'CARRIER') {
          delete ret.isActive
          delete ret.vehicle
          delete ret.zone
          delete ret.activatedAt
          delete ret.currentShipment
        }
        if (ret.role !== 'MANAGER') {
          delete ret.warehouse
        }
        return ret
      },
    },
  }
)

userSchema.pre('save', function (next) {
  this.updatedAt = new Date()
  next()
})

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema)

export default User
