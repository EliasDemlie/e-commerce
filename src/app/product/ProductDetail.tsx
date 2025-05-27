'use client'
import { useCallback, useState, useEffect } from 'react'
import type React from 'react'

import { MdCheckCircle, MdSecurity, MdLoop } from 'react-icons/md'
import { FaTruck, FaQuestion } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import type { Product } from '@/type/Product'
import type { CartProduct, SelectedImg } from '@/type/CartProduct'
import type { Review } from '@/type/Review'
import { useCart } from '@/hooks/useCart'
import RecentlyViewed from '@/components/ProductCard/RecentlyViewed'
import ProductGallery from './product-gallery'
import ProductInfo from './product-info'

import ReviewList from '@/components/review/ReviewList'
import ReviewForm from '@/components/review/ReveiwForm'

import { QuestionForm } from './questions/Questions'

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
}

interface ProductDetailsProps {
  product: Product
}

interface Answer {
  _id: string
  content: string
  answeredBy: string
  isStaff: boolean
  isVerifiedPurchase?: boolean
  helpfulVotes?: number
  createdAt: string
  updatedAt: string
}

interface Question {
  _id: string
  productId: string
  question: string
  askedBy: string
  isVerifiedPurchase?: boolean
  status: 'pending' | 'published' | 'rejected'
  answers: Answer[]
  helpfulVotes?: number
  createdAt: string
  updatedAt: string
}
const ProductDetail: React.FC<ProductDetailsProps> = ({ product }) => {
  const router = useRouter()
  const [cartProduct, setCartProduct] = useState<CartProduct>({
    _id: product._id,
    name: product.name,
    description: product.description,
    brand: product.brand,
    category: product.category.name,
    selectedImg: {
      ...product.images[0],
    },
    qty: 1,
    price: product.price,
    selectedSize: 'M',
  })

  // State for reviews
  const [reviews, setReviews] = useState<Review[]>([])
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null)
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewsError, setReviewsError] = useState<string | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [questionsLoading, setQuestionsLoading] = useState(false)
  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!product._id) return

      try {
        setReviewsLoading(true)
        const response = await fetch(
          `/api/product/review?productId=${product._id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch reviews')
        }

        const data = await response.json()
        setReviews(data.reviews)
        setReviewStats(data.stats)
      } catch (err) {
        setReviewsError(
          err instanceof Error ? err.message : 'An error occurred'
        )
      } finally {
        setReviewsLoading(false)
      }
    }

   
    const fetchQuestions = async () => {

      if (!product._id) return

      try {
        setQuestionsLoading(true)
        const response = await fetch(
          `/api/product/questions?productId=${product._id}`
        )

        if (!response.ok) {
          throw new Error('Failed to fetch questions')
        }

        const data = await response.json()
        setQuestions(data)
        console.log('Fetched questions:', questions)
      } catch (err) {
        console.error('Error fetching questions:', err)
      } finally {
        setQuestionsLoading(false)
      }
    }
     fetchReviews()
    fetchQuestions()
  }, [product._id])



  const handleColorSelect = useCallback(
    (value: SelectedImg) => {
      setCartProduct((prev: CartProduct) => ({ ...prev, selectedImg: value }))
    },
    [cartProduct.selectedImg]
  )

  const { handleAddProductToCart } = useCart()
  const [activeTab, setActiveTab] = useState<
    'description' | 'reviews' | 'questions' | 'shipping'
  >('description')
  const [selectedSize, setSelectedSize] = useState('M')

  const handleQtyIncrease = useCallback(() => {
    if (cartProduct.qty === 50) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty + 1,
      }
    })
  }, [cartProduct])

  const handleQtyDecrease = useCallback(() => {
    if (cartProduct.qty === 1) {
      return
    }
    setCartProduct((prev) => {
      return {
        ...prev,
        qty: prev.qty - 1,
      }
    })
  }, [cartProduct])

  const handleAddToCart = (): void => {
    handleAddProductToCart(cartProduct)
    toast.success('Product added to cart!', {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      icon: <MdCheckCircle className="text-green-500" />,
    })
  }

  const handleBuyNow = (): void => {
    // handleAddProductToCart(cartProduct)
    router.push('/checkout')
  }


  const handleReviewSubmitted = async () => {
    
    if (!product._id) return

    try {
      const response = await fetch(
        `/api/product/review?productId=${product._id}`
      )

      if (!response.ok) {
        throw new Error('Failed to fetch reviews')
      }

      const data = await response.json()
      setReviews(data.reviews)
      setReviewStats(data.stats)
    } catch (err) {
      console.error('Error refreshing reviews:', err)
    }
  }

 console.log('questiond', questions)

  return (
    <div className="flex flex-col mr-5">
      <div className="grid grid-cols-1 md:grid-cols-2 md:w-full gap-10">
        <ProductGallery
          product={product}
          cartProduct={cartProduct}
          handleColorSelect={handleColorSelect}
        />

        <ProductInfo
          product={product}
          cartProduct={cartProduct}
          handleQtyIncrease={handleQtyIncrease}
          handleQtyDecrease={handleQtyDecrease}
          handleAddToCart={handleAddToCart}
          handleBuyNow={handleBuyNow}
          setCartProduct={setCartProduct}
          reviewStats={reviewStats}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />
      </div>

      <div id="product-tabs" className="mt-10">
        <div className="border-b border-gray-200">
          <div className="flex flex-wrap -mb-px">
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'description'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('description')}
            >
              Product Details
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({reviewStats?.totalReviews || 0})
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'questions'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('questions')}
            >
              Q&A ({questions.length})
            </button>
            <button
              className={`py-2 px-4 font-medium text-sm border-b-2 ${
                activeTab === 'shipping'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => setActiveTab('shipping')}
            >
              Shipping & Returns
            </button>
          </div>
        </div>

        <div className="py-6">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <h3 className="text-lg font-semibold mb-4">
                Product Description
              </h3>
              <p className="mb-4">{product.description}</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-3">Features</h4>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Premium quality materials for durability</li>
                    <li>Ergonomic design for maximum comfort</li>
                    <li>Versatile style suitable for various occasions</li>
                    <li>Easy to maintain and clean</li>
                    <li>Eco-friendly manufacturing process</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Material</span>
                      <span>Premium Cotton</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Weight</span>
                      <span>0.5 kg</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Dimensions</span>
                      <span>30 x 20 x 10 cm</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Warranty</span>
                      <span>1 Year</span>
                    </div>
                    <div className="flex justify-between border-b pb-2">
                      <span className="text-gray-600">Country of Origin</span>
                      <span>United States</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-medium mb-3">Care Instructions</h4>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Machine wash cold with similar colors</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Do not bleach</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Tumble dry low</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Cool iron if needed</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span>Do not dry clean</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              {reviewsLoading ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : reviewsError ? (
                <div className="text-center py-8 text-red-500">
                  {reviewsError}
                </div>
              ) : (
                <>
                  <ReviewList
                    reviews={reviews}
                    stats={reviewStats}
                    productId={product._id || ''}
                  />
                  <div className="mt-8">
                    <ReviewForm
                      productId={product._id || ''}
                      onReviewSubmitted={handleReviewSubmitted}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">
                  Customer Questions
                </h3>
                {questionsLoading && (
                  <div className="text-center py-8">Loading questions...</div>
                )}
                {questions.length === 0 && !questionsLoading && ( 
                    
                    <div className="text-center py-8 text-gray-500">
                      No questions have been asked yet.
                    </div>
                  )}

                {questions.map((q) => (
                  <div key={q._id} className="border-b pb-4 mb-4">
                    <div className="flex items-start gap-2">
                      <FaQuestion className="text-teal-600 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{q.question}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Asked by {q.askedBy} •{' '}
                          {new Date(q.createdAt).toLocaleDateString() +
                            ' at ' +
                            new Date(
                              q.createdAt
                            ).toLocaleTimeString() 
                            }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2 mt-3 ml-6">
                      <MdCheckCircle className="text-green-600 mt-1 flex-shrink-0" />
                      <div>
                        <p>
                          {q.answers.length > 0
                            ? q.answers[0].content
                            : 'No answers yet.'}
                        </p>
                        {q.answers.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Answered by {q.answers[0].answeredBy} •{' '}
                            {new Date(
                              q.answers[0].createdAt
                            ).toLocaleDateString() +
                              ' at ' +
                              new Date(
                                q.answers[0].createdAt
                              ).toLocaleTimeString() +
                              ' UTC'}
                          </p>
                        )}
                        {q.answers.length > 1 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Answered by{' '}
                            {q.answers.length > 0
                              ? q.answers[0].answeredBy
                              : 'N/A'}{' '}
                            •{' '}
                            {q.answers.length > 0
                              ? new Date(
                                  q.answers[0].createdAt
                                ).toLocaleDateString() +
                                ' at ' +
                                new Date(
                                  q.answers[0].createdAt
                                ).toLocaleTimeString() +
                                ' UTC'
                              : 'N/A'}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-medium mb-3">Ask a Question</h4>
                <QuestionForm product={product} />
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  Shipping Information
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Standard Shipping</h4>
                        <p className="text-sm text-gray-600">
                          Delivery in 2-4 business days
                        </p>
                        <p className="text-sm font-medium">$4.99</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <FaTruck className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Express Shipping</h4>
                        <p className="text-sm text-gray-600">
                          Delivery in 1-2 business days
                        </p>
                        <p className="text-sm font-medium">$9.99</p>
                      </div>
                    </div>

                    <div className="pt-2 text-sm text-gray-600 border-t">
                      <p>Free standard shipping on orders over $50.</p>
                      <p>
                        We ship to all 50 US states and select international
                        destinations.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Return Policy</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <MdLoop className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">30-Day Returns</h4>
                        <p className="text-sm text-gray-600">
                          We offer a 30-day return policy for most items.
                        </p>
                        <p className="text-sm text-gray-600">
                          Items must be in original condition with tags
                          attached.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MdSecurity className="text-teal-500 text-xl flex-shrink-0 mt-1" />
                      <div>
                        <h4 className="font-medium">Warranty</h4>
                        <p className="text-sm text-gray-600">
                          All products come with a 1-year manufacturer warranty.
                        </p>
                        <p className="text-sm text-gray-600">
                          Covers defects in materials and workmanship.
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 text-sm text-gray-600 border-t">
                      <p>
                        Please contact our customer service team for any
                        questions about returns or warranty claims.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <RecentlyViewed currentProductId={product._id || ''} />
    </div>
  )
}

export default ProductDetail
