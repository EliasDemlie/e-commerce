'use client'

import { useForm, Controller } from 'react-hook-form'
import Button from '@/components/input/Button'

type FormData = {
  question: string
  name: string
  email: string
}

export function QuestionForm({ product }: { product: { _id: string } }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      question: '',
      name: '',
      email: '',
    },
  })

  const handleQuestionSubmitted = async (data: FormData) => {
    if (!product._id) return

    try {
      const response = await fetch('/api/product/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product._id,
          question: data.question,
          name: data.name,
          email: data.email,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit question')
      }

      reset()
    } catch (err) {
      console.error('Error submitting question:', err)
    }
  }

  return (
    <form
      className="space-y-4"
      onSubmit={handleSubmit(handleQuestionSubmitted)}
    >
      <div>
        <label htmlFor="question" className="block text-sm font-medium mb-1">
          Your Question
        </label>
        <Controller
          name="question"
          control={control}
          rules={{ required: 'Question is required' }}
          render={({ field }) => (
            <textarea
              {...field}
              id="question"
              rows={3}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="What would you like to know about this product?"
            />
          )}
        />
        {errors.question && (
          <p className="text-sm text-red-500 mt-1">{errors.question.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                placeholder="Your name"
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
          />
          {errors.name && (
            <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        <div className="flex-1">
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Invalid email address',
              },
            }}
            render={({ field }) => (
              <input
                {...field}
                type="email"
                placeholder="Your email"
                className="w-full px-3 py-2 border rounded-md"
              />
            )}
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>
      </div>

      <Button
        label={isSubmitting ? 'Submitting...' : 'Submit Question'}
        outline
        disabled={isSubmitting}
      />
    </form>
  )
}
