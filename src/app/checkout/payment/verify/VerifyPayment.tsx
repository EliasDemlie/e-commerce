'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button2'

export default function VerifyPaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'error'
  >('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const tx_ref = searchParams.get('tx_ref')

    if (!tx_ref) {
      setVerificationStatus('error')
      setMessage('Missing transaction reference')
      return
    }

    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/payment/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tx_ref }),
        })

        const data = await response.json()

        if (data.success) {
          setVerificationStatus('success')
          setMessage('Payment verified successfully!')
          // Clear cart here if needed
          // localStorage.removeItem('cart')
        } else {
          setVerificationStatus('error')
          setMessage(data.message || 'Payment verification failed')
        }
      } catch (error) {
        console.error('Verification error:', error)
        setVerificationStatus('error')
        setMessage('An error occurred during payment verification')
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex flex-col items-center text-center">
          {verificationStatus === 'loading' && (
            <>
              <Loader2 className="w-16 h-16 text-yellow-500 animate-spin mb-4" />
              <h1 className="text-2xl font-bold mb-2">Verifying Payment</h1>
              <p className="text-gray-600 mb-4">
                Please wait while we verify your payment...
              </p>
            </>
          )}

          {verificationStatus === 'success' && (
            <>
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
              <p className="text-gray-600 mb-4">{message}</p>
              <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
            </>
          )}

          {verificationStatus === 'error' && (
            <>
              <XCircle className="w-16 h-16 text-red-500 mb-4" />
              <h1 className="text-2xl font-bold mb-2">
                Payment Verification Failed
              </h1>
              <p className="text-gray-600 mb-4">{message}</p>
            </>
          )}

          <div className="flex gap-4 mt-6">
            <Button onClick={() => router.push('/')} variant="outline">
              Return to Home
            </Button>

            {verificationStatus === 'success' && (
              <Button
                onClick={() => router.push('/orders')}
                className="bg-yellow-500 hover:bg-yellow-600"
              >
                View Orders
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
