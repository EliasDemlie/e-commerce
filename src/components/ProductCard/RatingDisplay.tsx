'use client'

import type React from 'react'
import { Rating } from '@mui/material'

interface RatingDisplayProps {
  rating: number
  reviewCount: number
  showCount?: boolean
  size?: 'small' | 'medium' | 'large'
  className?: string
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  rating,
  reviewCount,
  showCount = true,
  size = 'medium',
  className = '',
}) => {
  // Calculate percentage of each star rating (for a more detailed view)
  const getStarPercentage = (starValue: number) => {
    // This would normally come from your API
    // For now, we'll generate random percentages
    console.log(`Calculating percentage for ${starValue} star`)
    return Math.floor(Math.random() * 100)
  }

  return (
    <div className={`flex items-center ${className}`}>
      <Rating value={rating} readOnly precision={0.5} size={size} />

      {showCount && (
        <span className="ml-2 text-sm text-gray-600">
          ({reviewCount} {reviewCount === 1 ? 'review' : 'reviews'})
        </span>
      )}

      {/* Tooltip with detailed rating breakdown */}
      <div className="group relative">
        <button
          className="ml-1 text-sm text-gray-500 hover:text-gray-700"
          aria-label="View rating details"
        >
          ⓘ
        </button>

        <div className="absolute left-0 mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border z-10 hidden group-hover:block">
          <h4 className="font-medium mb-2">Rating Breakdown</h4>
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-2 mb-1">
              <span className="w-8 text-sm">{star} star</span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-400 rounded-full"
                  style={{ width: `${getStarPercentage(star)}%` }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {getStarPercentage(star)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RatingDisplay
