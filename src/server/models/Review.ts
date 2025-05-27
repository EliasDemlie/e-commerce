import { Schema, type Document, type Types, models, model } from 'mongoose'

export interface IReview extends Document {
  userId: Types.ObjectId
  productId: Types.ObjectId
  rating: number
  title?: string
  comment: string
  status: string
  images?: string[]
  helpful: number
  notHelpful: number
  verified: boolean
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, trim: true },
    comment: { type: String, required: true, trim: true },
    status: {
      type: String,
      required: false,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    images: [
       { type: String, required: false }
    ],
    helpful: { type: Number, default: 0 },
    notHelpful: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Create compound index for efficient querying
ReviewSchema.index({ productId: 1, status: 1 })

export const Review = models.Review || model<IReview>('Review', ReviewSchema)
