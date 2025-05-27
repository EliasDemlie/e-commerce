

type CurrentShipment = {
  shipmentId: string
  trackingNumber: string
  orderNumber: string
  estimatedDelivery: string
}

export type User = Document & {
  _id: string
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
