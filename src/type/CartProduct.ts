export type CartProduct = {

  _id: string
  name: string
  description: string
  brand: string
  category: string
  selectedImg: SelectedImg
  qty: number
  price: number
  selectedSize?: string
}
export type SelectedImg = {
  color: string
  colorCode: string
  views: {
    front: string
    side: string
    back: string
  }

}