'use client'

import type React from 'react'
import { X, PlusCircle } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Product } from '@/type/Product'

interface CategorySectionProps {
  product: Omit<Product, '_id' | 'id' | 'rating'>
  setProduct: React.Dispatch<
    React.SetStateAction<Omit<Product, '_id' | 'id' | 'rating'>>
  >
  categories: { name: string; subCategories: string[] }[]
  isAddingNewCategory: boolean
  setIsAddingNewCategory: React.Dispatch<React.SetStateAction<boolean>>
  newCategory: string
  setNewCategory: React.Dispatch<React.SetStateAction<string>>
  newSubcategories: string[]
  setNewSubcategories: React.Dispatch<React.SetStateAction<string[]>>
  newSubcategoryInput: string
  setNewSubcategoryInput: React.Dispatch<React.SetStateAction<string>>
}

export default function CategorySection({
  product,
  setProduct,
  categories,
  isAddingNewCategory,
  setIsAddingNewCategory,
  newCategory,
  setNewCategory,
  newSubcategories,
  setNewSubcategories,
  newSubcategoryInput,
  setNewSubcategoryInput,
}: CategorySectionProps) {
  const handleCategoryChange = (value: string) => {
    if (isAddingNewCategory) {
      setProduct((prev) => ({
        ...prev,
        category: {
          name: newCategory,
          subCategories: newSubcategories,
        },
      }))
    } else {
      
      const categoryExists = categories.some((cat) => cat.name === value)

      if (categoryExists) {
        setProduct((prev) => ({
          ...prev,
          category: {
            name: value,
            subCategories:
              prev.category.name === value ? prev.category.subCategories : [],
          },
        }))
      }
    }
  }

  const addNewSubcategory = () => {
    if (newSubcategoryInput.trim()) {
      setNewSubcategories([...newSubcategories, newSubcategoryInput.trim()])
      setNewSubcategoryInput('')
    }
  }

  const removeNewSubcategory = (index: number) => {
    setNewSubcategories(newSubcategories.filter((_, idx) => idx !== index))
  }

  const handleSubCategoryToggle = (subCategory: string) => {
    setProduct((prev) => {
      const currentSubCategories = prev.category.subCategories
      const updatedSubCategories = currentSubCategories.includes(subCategory)
        ? currentSubCategories.filter((sc) => sc !== subCategory)
        : [...currentSubCategories, subCategory]

      return {
        ...prev,
        category: {
          ...prev.category,
          subCategories: updatedSubCategories,
        },
      }
    })
  }
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Category</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="category">Main Category</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
              className="text-xs"
            >
              {isAddingNewCategory ? 'Select Existing' : 'Add New Category'}
            </Button>
          </div>

          {!isAddingNewCategory ? (
            <Select
              value={product.category.name}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.name} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="space-y-4">
              <Input
                placeholder="Enter new category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                required={isAddingNewCategory}
              />
              <div className="space-y-2">
                <Label>Subcategories</Label>
                <div className="flex flex-wrap gap-2">
                  {newSubcategories.map((subcat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center border rounded-md pl-3 pr-1 py-1 bg-muted/30"
                    >
                      <span>{subcat}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-1"
                        onClick={() => removeNewSubcategory(idx)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-2">
                  <Input
                    placeholder="Add subcategory"
                    value={newSubcategoryInput}
                    onChange={(e) => setNewSubcategoryInput(e.target.value)}
                    required={isAddingNewCategory}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newSubcategoryInput.trim()) {
                        e.preventDefault()
                        addNewSubcategory()
                      }
                    }}
                  />

                  <Button
                    type="button"
                    size="icon"
                    onClick={addNewSubcategory}
                    disabled={!newSubcategoryInput.trim()}
                  >
                    <PlusCircle className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {product.category.name && !isAddingNewCategory && (
            <div className="space-y-2">
              <Label>Sub Categories </Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {categories
                  .find((cat) => cat.name === product.category.name)
                  ?.subCategories.map((subCategory) => (
                    <div
                      key={subCategory}
                      className="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        id={`subcat-${subCategory}`}
                        checked={product.category.subCategories.includes(
                          subCategory
                        )}
                        onChange={() => handleSubCategoryToggle(subCategory)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <Label htmlFor={`subcat-${subCategory}`}>
                        {subCategory}
                      </Label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
