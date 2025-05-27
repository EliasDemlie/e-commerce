export type Address = {
  userId: string
  fullName: string
  email?: string
  phoneNumber: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}