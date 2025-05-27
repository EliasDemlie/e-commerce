import type { Types } from 'mongoose'

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export interface IOrderItem {
  productId: Types.ObjectId | string
  name: string
  quantity: number
  unitPrice: number
  subtotal: number
  imageUrl?: string
}

export interface IAddress {
  name: string
  street: string
  city: string
  zipCode: string
  country: string
  phone: string
  email: string
}

export interface IOrder {
  _id: Types.ObjectId | string
  userId: Types.ObjectId | string
  orderNumber: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  items: IOrderItem[]
  subtotal: number
  tax: number
  shipping: number
  shippingAddressId: Types.ObjectId | string
  billingAddressId: Types.ObjectId | string
  transactionRef?: string
  notes?: string
  createdAt: Date | string
  updatedAt: Date | string
}


export type Order = IOrder
