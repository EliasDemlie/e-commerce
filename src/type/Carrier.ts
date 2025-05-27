export type Carrier = {
  _id: string
  name: string
  isActive: boolean
  contactPhone?: string
  contactEmail?: string
  vehicle?: string
  zone?: string
  trackingUrlTemplate?:string
  activatedAt?: string
  currentShipment?: {
    shipmentId: string
    trackingNumber: string
    orderNumber: string
    estimatedDelivery: string
  }
}
