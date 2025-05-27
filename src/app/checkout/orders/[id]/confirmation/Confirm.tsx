'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button2'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function ConfirmationPage() {
  const params = useParams()
  const orderId = params?.id as string
  const searchParams = useSearchParams()

  const [status, setStatus] = useState<'success' | 'failed' | 'verifying'>(
    'verifying'
  )
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function verifyPayment() {
      if (!orderId || !searchParams) {
        setStatus('failed')
        setLoading(false)
        return
      }

      const txRef = searchParams.get('tx_ref')

      console.log('txRef', txRef)
      if (!txRef) {
        setStatus('failed')
        setLoading(false)
        return
      }

      try {
        const response = await fetch(`/api/payment/verify/${txRef}`)
        const data = await response.json()
        console.log('Payment verification response:', data)

        if (data.success) {
          setStatus('success')
        } else {
          setStatus('failed')
        }
      } catch (error) {
        console.error('Error verifying payment:', error)
        setStatus('failed')
      } finally {
        setLoading(false)
      }
    }

    verifyPayment()
  }, [orderId, searchParams])

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-md mx-auto text-center">
          <Card className="border-gray-200 shadow-lg">
            <CardHeader className="pb-2">
              <div className="flex justify-center mb-4">
                <div className="h-16 w-16 rounded-full bg-blue-50 flex items-center justify-center">
                  <AlertCircle className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                Verifying Payment
              </CardTitle>
              <CardDescription className="text-base">
                Please wait while we verify your payment...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-14 w-14 border-4 border-gray-200 border-t-primary"></div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16">
      <div className="max-w-md mx-auto text-center">
        <Card
          className={`border-gray-200 shadow-lg ${
            status === 'success' ? 'bg-green-50/30' : 'bg-red-50/30'
          }`}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-center mb-6">
              {status === 'success' ? (
                <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                </div>
              ) : (
                <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center">
                  <XCircle className="h-12 w-12 text-red-500" />
                </div>
              )}
            </div>
            <CardTitle className="text-3xl font-bold mb-2 text-gray-800">
              {status === 'success' ? 'Payment Successful!' : 'Payment Failed'}
            </CardTitle>
            <CardDescription className="text-base">
              {status === 'success'
                ? 'Your order has been confirmed and is now being processed.'
                : 'We were unable to process your payment. Please try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            {status === 'success' ? (
              <p className="text-gray-600 bg-green-50 p-4 rounded-lg border border-green-100">
                Thank you for your purchase! You will receive an email
                confirmation shortly.
              </p>
            ) : (
              <p className="text-gray-600 bg-red-50 p-4 rounded-lg border border-red-100">
                There was an issue processing your payment. Please check your
                payment details and try again.
              </p>
            )}
          </CardContent>
          <CardFooter className="flex justify-center gap-4 pt-2 pb-6">
            <Button
              asChild
              size="lg"
              className={
                status === 'success' ? 'bg-green-600 hover:bg-green-700' : ''
              }
            >
              <Link href={`/checkout/orders/myorder`}>View Order</Link>
            </Button>
            {status === 'failed' && (
              <Button
                variant="outline"
                asChild
                size="lg"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                <Link href={`/checkout/orders/${orderId}/pay`}>Try Again</Link>
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
