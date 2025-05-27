export type Category = {
  _id: string
  name: string
  subCategories?: string[]
  icon?: string
  createdAt: Date
  updatedAt: Date
}