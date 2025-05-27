export type Product = {
  _id: string
  name: string
  description: string
  category: {
    name: string
    subCategories: string[]
  }
  brand: string
  images: {
    color: string
    colorCode: string
    views: {
      front: string
      side: string
      back: string
    }
  }[]
  inStock: boolean
  quantity?: number
  rating: number
  price: number
  selectedSize?: string
}
