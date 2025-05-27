'use client'

import type React from 'react'
import { Check } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button2'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { cn } from '@/hooks/utils/cn'
import type { Product } from '@/type/Product'

interface BasicInformationSectionProps {
  product: Omit<Product, '_id' | 'id' | 'rating'>
  setProduct: React.Dispatch<
    React.SetStateAction<Omit<Product, '_id' | 'id' | 'rating'>>
  >
  brands: string[]
  searchInput: string
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
}

export default function BasicInformationSection({
  product,
  setProduct,
  brands,
  searchInput,
  setSearchInput,
}: BasicInformationSectionProps) {
  const handleBasicInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              name="name"
              value={product.name}
              onChange={handleBasicInfoChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="brand">Brand</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between"
                >
                  {product.brand ? product.brand : 'Select brand'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search brands..."
                    value={searchInput}
                    onValueChange={setSearchInput}
                  />
                  <CommandEmpty>
                    <div
                      className="px-4 py-2 cursor-pointer hover:bg-muted"
                      onClick={() =>
                        setProduct((prev) => ({
                          ...prev,
                          brand: searchInput,
                        }))
                      }
                    >
                      <strong>{searchInput}</strong>
                    </div>
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {brands.map((brand) => (
                        <CommandItem
                          key={brand}
                          value={brand}
                          onSelect={(value) =>
                            setProduct((prev) => ({
                              ...prev,
                              brand: value,
                            }))
                          }
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              product.brand === brand
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {brand}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleBasicInfoChange}
              rows={4}
              required
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
