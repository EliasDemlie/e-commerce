export interface Review {
  _id: string
  userId: ReviewUser
  productId: string
  rating: number
  title?: string
  comment: string
  status: string
  images: string[]
  helpful: number
  notHelpful: number
  verified: boolean
  createdAt: string
  updatedAt: string
}

export interface ReviewUser {
  _id: string
  name: string
  image?: string
}

export interface ReviewFormData {
  productId: string
  rating: number
  title?: string
  comment: string
  images?: File[]
}

export interface ReviewVote {
  reviewId: string
  userId: string
  action: 'helpful' | 'notHelpful'
  createdAt: string
}

export interface ReviewReport {
  reviewId: string
  userId: string
  reason: string
  createdAt: string
  status: 'pending' | 'reviewed' | 'dismissed'
}
