'use client'
import type React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import {
  AddressForm,
  type AddressData,
} from '@/components/checkout/address-form'
import { OrderSummary } from '@/components/checkout/order-summary'
import { useCart } from '@/hooks/useCart'
import { MapPin, CreditCard } from 'lucide-react'
import { type UseFormReturn } from 'react-hook-form'

export default function CheckoutPage() {
  const router = useRouter()
  const { cartProducts } = useCart()
  const [loading, setLoading] = useState(false)
  const [sameAsBilling, setSameAsBilling] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [shippingForm, setShippingForm] =
    useState<UseFormReturn<AddressData> | null>(null)
  const [billingForm, setBillingForm] =
    useState<UseFormReturn<AddressData> | null>(null)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const [shippingAddress, setShippingAddress] = useState<AddressData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ethiopia',
  })

  const [billingAddress, setBillingAddress] = useState<AddressData>({
    fullName: '',
    email: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Ethiopia',
  })

  const subtotal = cartProducts.reduce(
    (total, item) => total + item.price * item.qty,
    0
  )
  const shipping = 150
  const tax = Math.round(subtotal * 0.15)
  const total = subtotal + shipping + tax

  const handleShippingChange = (data: AddressData) => {
    setShippingAddress(data)
    if (sameAsBilling) {
      setBillingAddress(data)
    }
  }

  const handleBillingChange = (data: AddressData) => {
    setBillingAddress(data)
  }

  const handleSameAsBillingChange = (checked: boolean) => {
    setSameAsBilling(checked)
    if (checked) {
      setBillingAddress(shippingAddress)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate forms
    if (!shippingForm) {
      toast({
        title: 'Error',
        description: 'Shipping form is not initialized.',
        variant: 'destructive',
      })
      setLoading(false)
      return
    }

    const shippingValid = await shippingForm.trigger()
    let billingValid = true
    if (!sameAsBilling && billingForm) {
      billingValid = await billingForm.trigger()
    }

    if (!shippingValid || !billingValid) {
      setLoading(false)
      return
    }

    try {
      const addressResponse = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shipping: shippingAddress,
          billing: sameAsBilling ? shippingAddress : billingAddress,
        }),
      })

      if (!addressResponse.ok) throw new Error('Failed to create addresses')

      const addressData = await addressResponse.json()

      const orderItems = cartProducts.map((item) => ({
        productId: item._id,
        name: item.name,
        quantity: item.qty,
        unitPrice: item.price,
        subtotal: item.price * item.qty,
        imageUrl: item.selectedImg.views.front,
      }))

      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: orderItems,
          subtotal,
          tax,
          shipping,
          total,
          shippingAddressId: addressData.shippingAddressId,
          billingAddressId: addressData.billingAddressId,
        }),
      })

      if (!orderResponse.ok) throw new Error('Failed to create order')

      const orderData = await orderResponse.json()

      toast({
        title: 'Order created successfully',
        description: 'Redirecting to payment page...',
      })

      router.push(`/checkout/orders/${orderData.order.id}/pay`)
    } catch (error) {
      console.error('Error creating order:', error)
      toast({
        title: 'Error',
        description: 'Failed to create order. Please try again.',
        variant: 'destructive',
      })
      setLoading(false)
    }
  }

  if (!isMounted) return null

  return (
    <div className="container mx-auto py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Complete your purchase by providing your shipping and payment details
        </p>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-200">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <MapPin className="h-5 w-5" />
                    Shipping Address
                  </CardTitle>
                  <CardDescription>
                    Enter your shipping information
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <AddressForm
                    type="shipping"
                    address={shippingAddress}
                    onChange={handleShippingChange}
                    onFormInstance={setShippingForm}
                  />
                </CardContent>
              </Card>

              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50 border-b border-gray-200 flex flex-row items-center">
                  <div className="space-y-1.5">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                      <CreditCard className="h-5 w-5" />
                      Billing Address
                    </CardTitle>
                    <CardDescription>
                      Enter your billing information
                    </CardDescription>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    <Checkbox
                      id="sameAsBilling"
                      checked={sameAsBilling}
                      onCheckedChange={handleSameAsBillingChange}
                      className="data-[state=checked]:bg-primary border-gray-800"
                    />
                    <Label htmlFor="sameAsBilling" className="font-medium">
                      Same as shipping
                    </Label>
                  </div>
                </CardHeader>
                {!sameAsBilling && (
                  <CardContent className="pt-6">
                    <AddressForm
                      type="billing"
                      address={billingAddress}
                      onChange={handleBillingChange}
                      onFormInstance={setBillingForm}
                    />
                  </CardContent>
                )}
              </Card>
            </div>

            <div className="space-y-6">
              <OrderSummary
                cartItems={cartProducts}
                loading={loading}
                onSubmit={() => {
                  const form = document.querySelector('form')
                  if (form) form.requestSubmit()
                }}
              />

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-600">
                <p className="mb-2 font-medium">Secure Checkout</p>
                <p>
                  Your payment information is processed securely. We do not
                  store credit card details nor have access to your credit card
                  information.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
