'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'
import {
  FaThumbsUp,
  FaThumbsDown,
  FaFlag,
  FaFilter,
  FaStar,
} from 'react-icons/fa'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button2'
import type { Review } from '@/type/Review'

interface ReviewStats {
  totalReviews: number
  averageRating: number
  ratingDistribution: Record<number, number>
}

interface ReviewListProps {
  reviews: Review[]
  stats: ReviewStats | null
  productId: string
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  stats,
  
}) => {
  const [expandedReviews, setExpandedReviews] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'recent' | 'highest' | 'lowest'>(
    'recent'
  )
  const [filterRating, setFilterRating] = useState<number | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([])
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'positive' | 'negative' | 'verified'
  >('all')
  const [helpfulClicked, setHelpfulClicked] = useState<
    Record<string, 'helpful' | 'notHelpful' | null>
  >({})

  useEffect(() => {
    let result = [...reviews]


    if (filterRating !== null) {
      result = result.filter((review) => review.rating === filterRating)
    }

   
    if (activeFilter === 'positive') {
      result = result.filter((review) => review.rating >= 4)
    } else if (activeFilter === 'negative') {
      result = result.filter((review) => review.rating <= 2)
    } else if (activeFilter === 'verified') {
      result = result.filter((review) => review.verified)
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else if (sortBy === 'highest') {
        return b.rating - a.rating
      } else {
        return a.rating - b.rating
      }
    })

    setFilteredReviews(result)
  }, [reviews, filterRating, sortBy, activeFilter])

  const toggleExpand = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    )
  }

  const handleHelpfulClick = async (
    reviewId: string,
    type: 'helpful' | 'notHelpful'
  ) => {
    setHelpfulClicked((prev) => {
      // If already clicked the same button, unclick it
      if (prev[reviewId] === type) {
        const newState = { ...prev }
        delete newState[reviewId]
        return newState
      }
      // Otherwise set to the new type
      return { ...prev, [reviewId]: type }
    })

    try {
      // Send the vote to the API
      await fetch(`/api/reviews/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: type }),
      })
    } catch (error) {
      console.error('Error voting on review:', error)
    }
  }

  const handleReportReview = async (reviewId: string) => {
    const reason = prompt('Please provide a reason for reporting this review:')
    if (!reason) return

    try {
      const response = await fetch('/api/reviews/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reviewId, reason }),
      })

      if (response.ok) {
        alert('Thank you for your report. We will review it shortly.')
      } else {
        const data = await response.json()
        alert(data.error || 'Failed to report review. Please try again.')
      }
    } catch (error) {
      console.error('Error reporting review:', error)
      alert('An error occurred. Please try again.')
    }
  }

  const FilterButton = ({
    label,
    isActive,
    onClick,
  }: {
    label: string
    isActive: boolean
    onClick: () => void
  }) => (
    <Button
      onClick={onClick}
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      className={`rounded-full ${isActive ? 'bg-teal-500' : ''}`}
    >
      {label}
    </Button>
  )

  const averageRating = stats?.averageRating || 0
  const totalReviews = stats?.totalReviews || 0
  const ratingCounts = stats?.ratingDistribution || {}

  return (
    <div className="w-full">
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          <div className="flex flex-col items-center">
            <div className="text-5xl font-bold text-teal-600">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(averageRating)
                      ? 'text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {totalReviews} reviews
            </div>
          </div>

          <div className="flex-1">
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = ratingCounts[rating] || 0
                const percentage =
                  totalReviews > 0 ? (count / totalReviews) * 100 : 0

                return (
                  <div key={rating} className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setFilterRating(filterRating === rating ? null : rating)
                      }
                      className="w-12 text-sm hover:underline flex items-center"
                    >
                      {rating}{' '}
                      <FaStar className="w-3 h-3 ml-1 text-yellow-400" />
                    </button>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-16">
                      {count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
          >
            <FaFilter size={12} />
            <span>Filter</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterButton
            label="All Reviews"
            isActive={activeFilter === 'all'}
            onClick={() => setActiveFilter('all')}
          />
          <FilterButton
            label="Positive"
            isActive={activeFilter === 'positive'}
            onClick={() => setActiveFilter('positive')}
          />
          <FilterButton
            label="Critical"
            isActive={activeFilter === 'negative'}
            onClick={() => setActiveFilter('negative')}
          />
          <FilterButton
            label="Verified Purchases"
            isActive={activeFilter === 'verified'}
            onClick={() => setActiveFilter('verified')}
          />
        </div>
      </div>

      {showFilters && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="bg-gray-50 p-4 rounded-lg mb-6 overflow-hidden"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Sort by</label>
              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'recent' | 'highest' | 'lowest')
                }
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rated</option>
                <option value="lowest">Lowest Rated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Filter by rating
              </label>
              <select
                className="px-3 py-2 border rounded-md text-sm w-full"
                value={filterRating || ''}
                onChange={(e) =>
                  setFilterRating(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              >
                <option value="">All Ratings</option>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars ({ratingCounts[rating] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        <div className="space-y-6">
          {filteredReviews.length > 0 ? (
            filteredReviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="border-b pb-6"
              >
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                    <Image
                      src={review.userId?.image || '/placeholder.svg'}
                      alt={review.userId?.name || 'User'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {review.userId?.name || 'Anonymous User'}
                          </p>
                          {review.verified && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                              Verified Purchase
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(review.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {review.title && (
                      <h4 className="font-medium mt-2">{review.title}</h4>
                    )}

                    <p
                      className={`mt-2 text-gray-700 ${
                        expandedReviews.includes(review._id)
                          ? ''
                          : 'line-clamp-3'
                      }`}
                    >
                      {review.comment}
                    </p>

                    {review.comment.length > 150 && (
                      <button
                        onClick={() => toggleExpand(review._id)}
                        className="text-sm text-teal-600 mt-1 hover:underline"
                      >
                        {expandedReviews.includes(review._id)
                          ? 'Show less'
                          : 'Read more'}
                      </button>
                    )}

                    {review.images && review.images.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                        {review.images.map((image, idx) => (
                          <div
                            key={idx}
                            className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden border"
                          >
                            <Image
                              src={image || '/placeholder.svg'}
                              alt={`Review image ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() =>
                          handleHelpfulClick(review._id, 'helpful')
                        }
                        className={`flex items-center gap-1 text-sm ${
                          helpfulClicked[review._id] === 'helpful'
                            ? 'text-teal-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaThumbsUp size={14} />
                        <span>
                          Helpful (
                          {review.helpful +
                            (helpfulClicked[review._id] === 'helpful' ? 1 : 0)}
                          )
                        </span>
                      </button>
                      <button
                        onClick={() =>
                          handleHelpfulClick(review._id, 'notHelpful')
                        }
                        className={`flex items-center gap-1 text-sm ${
                          helpfulClicked[review._id] === 'notHelpful'
                            ? 'text-red-600 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <FaThumbsDown size={14} />
                        <span>
                          Not helpful (
                          {review.notHelpful +
                            (helpfulClicked[review._id] === 'notHelpful'
                              ? 1
                              : 0)}
                          )
                        </span>
                      </button>
                      <button
                        onClick={() => handleReportReview(review._id)}
                        className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                      >
                        <FaFlag size={14} />
                        <span>Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-gray-50 rounded-lg"
            >
              <div className="text-gray-500 mb-2">
                {filterRating
                  ? `No ${filterRating}-star reviews yet`
                  : 'No reviews match your current filters'}
              </div>
              <button
                onClick={() => {
                  setFilterRating(null)
                  setActiveFilter('all')
                }}
                className="text-teal-600 hover:underline text-sm"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    </div>
  )
}

export default ReviewList
