'use client'

import type React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button2'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { formatCurrency } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { IOrder } from '@/server/models/Order'
import { CreditCard, ShoppingBag, Mail, User } from 'lucide-react'
import Link from 'next/link'

type ErrorState = {
  firstName?: boolean
  lastName?: boolean
  email?: boolean
  emailFormat?: boolean
}
export default function PaymentPage() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string

  const [order, setOrder] = useState<IOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [paymentLoading, setPaymentLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
  })

  const [errors, setErrors] = useState<ErrorState>({})

  useEffect(() => {
    async function fetchOrder() {
      if (!id) {
        toast({
          title: 'Error',
          description: 'Order ID is missing',
          variant: 'destructive',
        })
        router.push('/orders')
        return
      }

      try {
        const response = await fetch(`/api/orders?id=${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }

        const data = await response.json()

        setOrder(data.order)

        if (data.paymentStatus === 'completed') {
          toast({
            title: 'Order already paid',
            description: 'This order has already been paid for.',
          })
          router.push(`/orders/${id}`)
        }
      } catch (error) {
        console.error('Error fetching order:', error)
        toast({
          title: 'Error',
          description: 'Failed to fetch order details',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [id, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomerInfo((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: false,
      ...(name === 'email' ? { emailFormat: false } : {}),
    }))
  }

  const handlePayment = async () => {
    const newErrors: ErrorState = {}
    let hasErrors = false

    if (!customerInfo.firstName) {
      newErrors.firstName = true
      hasErrors = true
    }

    if (!customerInfo.lastName) {
      newErrors.lastName = true
      hasErrors = true
    }

    if (!customerInfo.email) {
      newErrors.email = true
      hasErrors = true
    } else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) {
      newErrors.emailFormat = true
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields correctly',
        variant: 'destructive',
      })
      return
    }

    setPaymentLoading(true)

    try {
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: id,
          customerInfo,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to initialize payment')
      }

      const data = await response.json()
      window.location.href = data.checkoutUrl
    } catch (error) {
      console.error('Error initializing payment:', error)
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      })
      setPaymentLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="animate-pulse space-y-4">
              <div className="h-8 w-1/3 bg-gray-200 rounded mx-auto"></div>
              <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-primary"></div>
              </div>
              <div className="h-4 w-1/2 bg-gray-200 rounded mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-red-50 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 mb-4">
              We could not find the order you are looking for.
            </p>
            <Button asChild>
              <Link href="/orders">Return to Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-16 bg-gray-50">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          Complete Your Payment
        </h1>
        <p className="text-gray-600 mb-8">
          Please provide your payment details to finalize your order.
        </p>

        <div className="grid gap-8">
          <Card className="border-gray-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Order Summary</CardTitle>
                  <CardDescription>Order #{order.orderNumber}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(order.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {formatCurrency(order.shipping)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">
                    {formatCurrency(order.tax)}
                  </span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>Total</span>
                  <span className="text-primary">
                    {formatCurrency(
                      order.subtotal + order.shipping + order.tax
                    )}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 shadow-md overflow-hidden">
            <CardHeader className="bg-gray-50 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-primary" />
                <div>
                  <CardTitle>Payment Information</CardTitle>
                  <CardDescription>
                    Enter your details to complete the payment
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label
                      htmlFor="firstName"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={customerInfo.firstName}
                      onChange={handleInputChange}
                      required
                      className={`border ${
                        errors.firstName
                          ? 'border-red-500 bg-red-50 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-2 focus:ring-primary/20'
                      }`}
                      placeholder="John"
                      aria-invalid={errors.firstName ? 'true' : 'false'}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-alert-circle"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        First name is required
                      </p>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label
                      htmlFor="lastName"
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4 text-gray-500" />
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={customerInfo.lastName}
                      onChange={handleInputChange}
                      required
                      className={`border ${
                        errors.lastName
                          ? 'border-red-500 bg-red-50 focus:ring-red-200'
                          : 'border-gray-300 focus:ring-2 focus:ring-primary/20'
                      }`}
                      aria-invalid={errors.lastName ? 'true' : 'false'}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-alert-circle"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="8" x2="12" y2="12" />
                          <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        Last name is required
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    required
                    className={`border ${
                      errors.email || errors.emailFormat
                        ? 'border-red-500 bg-red-50 focus:ring-red-200'
                        : 'border-gray-300 focus:ring-2 focus:ring-primary/20'
                    }`}
                    aria-invalid={
                      errors.email || errors.emailFormat ? 'true' : 'false'
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-alert-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Email is required
                    </p>
                  )}
                  {errors.emailFormat && (
                    <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-alert-circle"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Please enter a valid email address
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t border-gray-200 py-4">
              <Button
                className="w-full font-medium text-base py-6 bg-slate-400 hover:bg-slate-300"
                onClick={handlePayment}
                disabled={paymentLoading}
                size="lg"
              >
                {paymentLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block"></span>
                    Processing...
                  </span>
                ) : (
                  `Pay ${formatCurrency(
                    order.subtotal + order.shipping + order.tax
                  )}`
                )}
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
            <p className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-shield-check"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              Your payment information is processed securely through Chapa. We
              do not store your payment details.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
