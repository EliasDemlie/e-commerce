import mongoose, { Schema, type Document } from 'mongoose'

export interface IAnswer extends Document {
  content: string
  answeredBy: mongoose.Types.ObjectId | string 
  isStaff: boolean
  isVerifiedPurchase?: boolean
  helpfulVotes?: number
  createdAt: Date
  updatedAt: Date
}

export interface IProductQuestion extends Document {
  productId: mongoose.Types.ObjectId
  question: string
  askedBy: mongoose.Types.ObjectId | string 
  email?: string
  isVerifiedPurchase?: boolean
  status: 'pending' | 'published' | 'rejected'
  answers: IAnswer[]
  helpfulVotes?: number
  createdAt: Date
  updatedAt: Date
}

const AnswerSchema = new Schema<IAnswer>(
  {
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    answeredBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
    isStaff: {
      type: Boolean,
      default: false,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    helpfulVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

const ProductQuestionSchema = new Schema<IProductQuestion>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },
    askedBy: {
      type: Schema.Types.Mixed,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['pending', 'published', 'rejected'],
      default: 'pending',
    },
    answers: [AnswerSchema],
    helpfulVotes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)


ProductQuestionSchema.index({ productId: 1, status: 1 })
ProductQuestionSchema.index({ productId: 1, createdAt: -1 })

export default mongoose.models.ProductQuestion ||  mongoose.model<IProductQuestion>('ProductQuestion', ProductQuestionSchema)


