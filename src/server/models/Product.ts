
import { Schema, Document, Types, models, model } from 'mongoose'


export interface IProduct extends Document {
  name: string
  description: string
  category: Types.ObjectId
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
  quantity: number
  price: number

}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brand: { type: String, required: true, trim: true },

  images: [
    {
      color: { type: String, required: true, trim: true },
      colorCode: { type: String, required: true, trim: true },
      views: {
        front: { type: String, required: true },
        side: { type: String, required: false },
        back: { type: String, required: false },
      },
    },
  ],
  inStock: { type: Boolean, required: true },
  quantity: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true },
})

export const Product = models.Product || model<IProduct>('Product', ProductSchema)

