'use client'

import type React from 'react'
import { useState, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { toast } from 'react-toastify'
import { MdCheckCircle, MdClose, MdImage, MdSend } from 'react-icons/md'
import { FaStar } from 'react-icons/fa'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button2'

interface ReviewFormProps {
  productId: string
  onReviewSubmitted?: () => void
}

interface ReviewFormData {
  rating: number
  title?: string
  comment: string
  images?: { url: string; alt?: string }[]
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onReviewSubmitted,
}) => {
  const [showForm, setShowForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [images, setImages] = useState<{ url: string; alt?: string }[]>([])
  const [hoverRating, setHoverRating] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    defaultValues: {
      rating: 0,
      comment: '',
      title: '',
      images: [],
    },
  })

  const ratingValue = watch('rating')

  const ratingLabels: Record<number, string> = {
    1: 'Poor',
    2: 'Fair',
    3: 'Good',
    4: 'Very Good',
    5: 'Excellent',
  }

  const onSubmit = async (data: ReviewFormData) => {
    setIsSubmitting(true)

    try {
     
      const reviewData = {
        productId,
        rating: data.rating,
        title: data.title || undefined,
        comment: data.comment,
        images: images.length > 0 ? images : undefined,
      }

     
      const response = await fetch('/api/product/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit review')
      }

      toast.success('Your review has been submitted and is pending approval!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        icon: <MdCheckCircle className="text-green-500" />,
      })

      // Reset form
      reset()
      setImages([])
      setShowForm(false)

      if (onReviewSubmitted) {
        onReviewSubmitted()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to submit review. Please try again.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    // In a real app, you would upload these to your server/cloud storage
    // For now, we'll just create object URLs
    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      alt: file.name,
    }))

    setImages((prev) => [...prev, ...newImages])

    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const CustomRatingInput = () => (
    <div className="flex flex-col items-center">
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setValue('rating', value)}
            onMouseEnter={() => setHoverRating(value)}
            onMouseLeave={() => setHoverRating(null)}
            className="focus:outline-none transition-transform hover:scale-110"
          >
            <FaStar
              className={`w-8 h-8 ${
                (
                  hoverRating !== null
                    ? value <= hoverRating
                    : value <= ratingValue
                )
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
      {(ratingValue > 0 || hoverRating) && (
        <div className="text-sm font-medium mt-1 text-teal-600">
          {ratingLabels[hoverRating || ratingValue || 0]}
        </div>
      )}
    </div>
  )

  if (!showForm) {
    return (
      <div className="mt-6">
        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <MdSend className="h-4 w-4" />
          Write a Review
        </Button>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mt-6 bg-gray-50 p-6 rounded-lg shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold">Write a Review</h3>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <MdClose size={20} />
            </button>
          </div>

          <div className="mb-6">
            <label className="block mb-3 text-sm font-medium text-center">
              How would you rate this product?{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex justify-center">
              <Controller
                name="rating"
                control={control}
                rules={{ required: 'Please select a rating', min: 1 }}
                render={({ field }) => (
                  <div>
                    <CustomRatingInput />
                    <input type="hidden" {...field} value={field.value || 0} />
                  </div>
                )}
              />
            </div>
            {errors.rating && (
              <p className="mt-1 text-sm text-red-500 text-center">
                {errors.rating.message || 'Please select a rating'}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-title"
              className="block mb-2 text-sm font-medium"
            >
              Review Title
            </label>
            <Controller
              name="title"
              control={control}
              render={({ field }) => (
                <input
                  type="text"
                  id="review-title"
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Summarize your experience (optional)"
                  {...field}
                />
              )}
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="review-comment"
              className="block mb-2 text-sm font-medium"
            >
              Your Review <span className="text-red-500">*</span>
            </label>
            <Controller
              name="comment"
              control={control}
              rules={{
                required: 'Please write a review',
                minLength: {
                  value: 10,
                  message: 'Your review must be at least 10 characters',
                },
              }}
              render={({ field }) => (
                <textarea
                  id="review-comment"
                  rows={4}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="What did you like or dislike about this product? How was your experience using it?"
                  {...field}
                ></textarea>
              )}
            />
            {errors.comment && (
              <p className="mt-1 text-sm text-red-500">
                {errors.comment.message}
              </p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Your review helps other shoppers make informed decisions and
              improves our products.
            </p>
          </div>

          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">
              Add Photos (optional)
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 border rounded-md overflow-hidden group"
                >
                  <Image
                    src={image.url || '/placeholder.svg'}
                    alt={image.alt || `Review image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MdClose size={12} />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:border-gray-400"
                >
                  <MdImage size={24} />
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <p className="text-xs text-gray-500">
              You can upload up to 5 images. Each image must be less than 5MB.
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
              {!isSubmitting && <MdSend className="h-4 w-4" />}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowForm(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  )
}

export default ReviewForm
