export type Order = {
  _id:  string
  userId:  string
  orderNumber: string
  orderStatus: OrderStatus
  paymentStatus: PaymentStatus
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  shippingAddressId:  string
  billingAddressId:  string
  transactionRef?: string
  notes?: string
  createdAt: Date | string
  updatedAt: Date | string
}

 interface OrderItem {
  productId:  string
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

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
