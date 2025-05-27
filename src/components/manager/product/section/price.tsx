'use client'

import type React from 'react'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import type { Product } from '@/type/Product'

interface PricingSectionProps {
  product: Omit<Product, '_id' | 'id' | 'rating'>
  setProduct: React.Dispatch<
    React.SetStateAction<Omit<Product, '_id' | 'id' | 'rating'>>
  >
}

export default function PricingSection({
  product,
  setProduct,
}: PricingSectionProps) {
  const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: Number.parseFloat(value) || 0,
    }))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Pricing & Inventory</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleNumericChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="0"
              value={product.quantity}
              onChange={handleNumericChange}
              required
            />
          </div>
          <div className="space-y-2 flex items-end">
            <div className="flex items-center space-x-2 ">
              <Switch
                id="inStock"
                checked={product.inStock}
                onCheckedChange={(checked) =>
                  setProduct((prev) => ({ ...prev, inStock: checked }))
                }
                className="bg-slate-600"
              />
              <Label htmlFor="inStock">In Stock</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
