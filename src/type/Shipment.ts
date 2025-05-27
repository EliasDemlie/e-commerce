export type Shipment = {
  _id: string
  orderId: string
  trackingNumber: string
  carrierId: string
  carrier: {
    name: string
    trackingUrlTemplate: string
    logo?: string
  }
  status: 'processing' | 'in_transit' | 'delivered' | 'failed' | 'returned'
  dateShipped: string | null
  dateDelivered: string | null
  items: {
    productId: string
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
  createdAt: string
  updatedAt: string
}
