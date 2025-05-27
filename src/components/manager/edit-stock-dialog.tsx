'use client'

import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button2'
import { toast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  UploadCloud,
  X,
  Save,
  Trash2,
  Loader2,
  Maximize2,
  Minimize2,
} from 'lucide-react'
import Image from 'next/image'

interface Product {
  _id: string
  name: string
  description: string
  category: {
    name: string
    subCategories: string[]
  }
  brand: string
  images: {
    color: string
    colorCode: string
    views: {
      front: string
      side: string
      back: string
    }
  }[]
  inStock: boolean
  quantity: number
  price: number
}

interface EditStockDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  product: Product
  onProductUpdated: () => void
}

export default function EditStockDialog({
  open,
  onOpenChange,
  product,
  onProductUpdated,
}: EditStockDialogProps) {
  const [name, setName] = useState(product.name)
  const [description, setDescription] = useState(product.description)
  const [brand, setBrand] = useState(product.brand)
  const [quantity, setQuantity] = useState(product.quantity.toString())
  const [price, setPrice] = useState(product.price.toString())
  const [inStock, setInStock] = useState(product.inStock)
  const [images, setImages] = useState(product.images)
  const [categories, setCategories] = useState<
    { name: string; subCategories: string[] }[]
  >([])
  const [selectedCategory, setSelectedCategory] = useState(
    product.category.name
  )
  const [selectedSubCategories, setSelectedSubCategories] = useState(
    product.category.subCategories
  )
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('inventory')
  const [brands, setBrands] = useState<string[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [dialogSize, setDialogSize] = useState<'default' | 'large'>('default')

  // Fetch product data, categories and brands
  useEffect(() => {
    const fetchData = async () => {
      if (!open) return

      setIsLoadingData(true)
      try {
        // Fetch product metadata (categories and brands)
        const metadataRes = await fetch('/api/products/metadata')
        if (!metadataRes.ok) throw new Error('Failed to fetch product metadata')

        const metadataData = await metadataRes.json()
        setCategories(metadataData.categories || [])
        setBrands(metadataData.brands || [])

        // Fetch full product details
        const productRes = await fetch(`/api/products/${product._id}`)
        if (!productRes.ok) throw new Error('Failed to fetch product details')

        const productData = await productRes.json()
        const fullProduct = productData.product

        // Update state with fresh data
        setName(fullProduct.name)
        setDescription(fullProduct.description)
        setBrand(fullProduct.brand)
        setQuantity(fullProduct.quantity.toString())
        setPrice(fullProduct.price.toString())
        setInStock(fullProduct.inStock)
        setImages(fullProduct.images)
        setSelectedCategory(fullProduct.category.name)
        setSelectedSubCategories(fullProduct.category.subCategories)
      } catch (error) {
        console.error('Error fetching data:', error)
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Failed to load product data',
        })
      } finally {
        setIsLoadingData(false)
      }
    }

    fetchData()
  }, [open, product._id])

  const handleUpdateProduct = async () => {
    setIsLoading(true)

    try {
      const updatedData = {
        name,
        description,
        brand,
        quantity: Number.parseInt(quantity),
        price: Number.parseFloat(price),
        inStock,
        images,
        category: {
          name: selectedCategory,
          subCategories: selectedSubCategories,
        },
      }

      const response = await fetch(`/api/products/${product._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update product')
      }

      toast({
        title: 'Product updated',
        description: `${name} has been successfully updated.`,
      })

      onProductUpdated()
      onOpenChange(false)
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update product. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async (
    file: File,
    colorIndex: number,
    viewType: 'front' | 'side' | 'back'
  ) => {
    if (!file) return

    try {
      // Create form data
      const formData = new FormData()
      formData.append('file', file)

      // Upload image to server
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()

      // Update the image URL in the state
      const updatedImages = [...images]
      updatedImages[colorIndex].views[viewType] = data.url
      setImages(updatedImages)

      toast({
        title: 'Image uploaded',
        description: 'Image has been successfully uploaded.',
      })
    } catch (error) {
      console.error('Error uploading image:', error)
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: 'Failed to upload image. Please try again.',
      })
    }
  }

  const handleColorChange = (index: number, field: string, value: string) => {
    const updatedImages = [...images]
    updatedImages[index] = {
      ...updatedImages[index],
      [field]: value,
    }
    setImages(updatedImages)
  }

  const addColorVariant = () => {
    setImages([
      ...images,
      {
        color: '',
        colorCode: '#000000',
        views: {
          front: '',
          side: '',
          back: '',
        },
      },
    ])
  }

  const removeColorVariant = (index: number) => {
    if (images.length <= 1) return
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const toggleSubCategory = (subCategory: string) => {
    if (selectedSubCategories.includes(subCategory)) {
      setSelectedSubCategories(
        selectedSubCategories.filter((sc) => sc !== subCategory)
      )
    } else {
      setSelectedSubCategories([...selectedSubCategories, subCategory])
    }
  }

  const toggleDialogSize = () => {
    setDialogSize(dialogSize === 'default' ? 'large' : 'default')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${
          dialogSize === 'large' ? 'max-w-5xl' : 'max-w-4xl'
        } h-[90vh] overflow-hidden flex flex-col bg-white border-2 border-gray-300 shadow-xl rounded-lg`}
      >
        <DialogHeader className="border-b pb-4 border-gray-100 flex flex-row justify-between items-center bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-t-lg">
          <div>
            <DialogTitle className="text-xl font-bold text-teal-700">
              Edit Product
            </DialogTitle>
            <DialogDescription className="text-gray-500">
              Update the details for {product.name}
            </DialogDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={toggleDialogSize}
            className="text-teal-600 border-teal-200 hover:bg-teal-50"
          >
            {dialogSize === 'default' ? (
              <>
                <Maximize2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Enlarge</span>
              </>
            ) : (
              <>
                <Minimize2 className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Reduce</span>
              </>
            )}
          </Button>
        </DialogHeader>

        {isLoadingData ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-gray-600 dark:text-gray-400">
                Loading product data...
              </p>
            </div>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col overflow-hidden"
          >
            <TabsList className="w-full justify-start border-b mb-4 bg-transparent border-gray-100 px-6">
              <TabsTrigger
                value="inventory"
                className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-700 rounded-none text-gray-500"
              >
                Inventory
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-700 rounded-none text-gray-500"
              >
                Product Details
              </TabsTrigger>
              <TabsTrigger
                value="images"
                className="data-[state=active]:border-b-2 data-[state=active]:border-teal-500 data-[state=active]:text-teal-700 rounded-none text-gray-500"
              >
                Images
              </TabsTrigger>
            </TabsList>

            <div className="overflow-y-auto flex-1 pr-2 pb-4">
              <TabsContent
                value="inventory"
                className="mt-0 h-full overflow-y-auto"
              >
                <div className="grid gap-6 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="quantity"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Quantity
                      </Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="price"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Price ($)
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="in-stock"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Availability
                    </Label>
                    <div className="flex items-center space-x-2 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                      <Switch
                        id="in-stock"
                        checked={inStock}
                        onCheckedChange={setInStock}
                        className="data-[state=checked]:bg-green-500"
                      />
                      <Label
                        htmlFor="in-stock"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        {inStock ? 'Available for purchase' : 'Not available'}
                      </Label>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent
                value="details"
                className="mt-0 h-full overflow-y-auto"
              >
                <div className="grid gap-6 py-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Product Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="description"
                      className="font-medium text-gray-700 dark:text-gray-300"
                    >
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={4}
                      className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label
                        htmlFor="brand"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Brand
                      </Label>
                      <Select value={brand} onValueChange={setBrand}>
                        <SelectTrigger className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                          <SelectValue placeholder="Select brand" />
                        </SelectTrigger>
                        <SelectContent>
                          {brands.map((brandName) => (
                            <SelectItem key={brandName} value={brandName}>
                              {brandName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="category"
                        className="font-medium text-gray-700 dark:text-gray-300"
                      >
                        Category
                      </Label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem
                              key={category.name}
                              value={category.name}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {selectedCategory && (
                    <div className="space-y-2">
                      <Label className="font-medium text-gray-700 dark:text-gray-300">
                        Sub Categories
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-white dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                        {categories
                          .find((cat) => cat.name === selectedCategory)
                          ?.subCategories.map((subCategory) => (
                            <div
                              key={subCategory}
                              className="flex items-center space-x-2"
                            >
                              <input
                                type="checkbox"
                                id={`subcat-${subCategory}`}
                                checked={selectedSubCategories.includes(
                                  subCategory
                                )}
                                onChange={() => toggleSubCategory(subCategory)}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                              />
                              <Label
                                htmlFor={`subcat-${subCategory}`}
                                className="text-gray-700 dark:text-gray-300"
                              >
                                {subCategory}
                              </Label>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent
                value="images"
                className="mt-0 h-full overflow-y-auto"
              >
                <div className="space-y-6 py-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                      Color Variants
                    </h3>
                    <Button
                      type="button"
                      onClick={addColorVariant}
                      variant="outline"
                      size="sm"
                      className="text-primary border-primary hover:bg-primary/10"
                    >
                      Add Color Variant
                    </Button>
                  </div>

                  {images.map((image, index) => (
                    <div
                      key={index}
                      className="p-6 border-2 rounded-lg space-y-4 bg-white border-gray-300 shadow-md"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium text-gray-800 dark:text-gray-200">
                          Color Variant {index + 1}
                        </h4>
                        {images.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeColorVariant(index)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label
                            htmlFor={`color-${index}`}
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Color Name
                          </Label>
                          <Input
                            id={`color-${index}`}
                            value={image.color}
                            onChange={(e) =>
                              handleColorChange(index, 'color', e.target.value)
                            }
                            placeholder="e.g., Red, Blue, Black"
                            className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label
                            htmlFor={`colorCode-${index}`}
                            className="font-medium text-gray-700 dark:text-gray-300"
                          >
                            Color Code
                          </Label>
                          <div className="flex space-x-2">
                            <Input
                              id={`colorCode-${index}`}
                              type="color"
                              value={image.colorCode}
                              onChange={(e) =>
                                handleColorChange(
                                  index,
                                  'colorCode',
                                  e.target.value
                                )
                              }
                              className="w-12 p-1 h-10 border-gray-300 dark:border-gray-700"
                            />
                            <Input
                              value={image.colorCode}
                              onChange={(e) =>
                                handleColorChange(
                                  index,
                                  'colorCode',
                                  e.target.value
                                )
                              }
                              placeholder="#000000"
                              className="border-gray-200 bg-white text-gray-800 focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-3">
                        {/* Front View */}
                        <div className="space-y-2">
                          <Label className="font-medium text-gray-700 dark:text-gray-300">
                            Front View
                          </Label>
                          {image.views.front ? (
                            <div className="relative aspect-square border rounded-md overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <Image
                                src={image.views.front || '/placeholder.svg'}
                                alt="Front view"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => {
                                  const updatedImages = [...images]
                                  updatedImages[index].views.front = ''
                                  setImages(updatedImages)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-[160px] bg-gray-100 border-teal-300 hover:border-teal-400 transition-colors">
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file)
                                    handleImageUpload(file, index, 'front')
                                }}
                                accept="image/*"
                              />
                              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                                <p>Click or drag to upload</p>
                                <p className="text-xs mt-1">PNG, JPG or WEBP</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Side View */}
                        <div className="space-y-2">
                          <Label className="font-medium text-gray-700 dark:text-gray-300">
                            Side View
                          </Label>
                          {image.views.side ? (
                            <div className="relative aspect-square border rounded-md overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <Image
                                src={image.views.side || '/placeholder.svg'}
                                alt="Side view"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => {
                                  const updatedImages = [...images]
                                  updatedImages[index].views.side = ''
                                  setImages(updatedImages)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-[160px] bg-gray-100 border-teal-300 hover:border-teal-400 transition-colors">
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file)
                                    handleImageUpload(file, index, 'side')
                                }}
                                accept="image/*"
                              />
                              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                                <p>Click or drag to upload</p>
                                <p className="text-xs mt-1">PNG, JPG or WEBP</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Back View */}
                        <div className="space-y-2">
                          <Label className="font-medium text-gray-700 dark:text-gray-300">
                            Back View
                          </Label>
                          {image.views.back ? (
                            <div className="relative aspect-square border rounded-md overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                              <Image
                                src={image.views.back || '/placeholder.svg'}
                                alt="Back view"
                                fill
                                className="object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-8 w-8 rounded-full"
                                onClick={() => {
                                  const updatedImages = [...images]
                                  updatedImages[index].views.back = ''
                                  setImages(updatedImages)
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="relative border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center h-[160px] bg-gray-100 border-teal-300 hover:border-teal-400 transition-colors">
                              <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => {
                                  const file = e.target.files?.[0]
                                  if (file)
                                    handleImageUpload(file, index, 'back')
                                }}
                                accept="image/*"
                              />
                              <UploadCloud className="h-10 w-10 text-gray-400 mb-2" />
                              <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                                <p>Click or drag to upload</p>
                                <p className="text-xs mt-1">PNG, JPG or WEBP</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}

        <DialogFooter className="pt-4 border-t mt-4 border-gray-200 bg-gray-100 p-6 rounded-b-lg">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-gray-200 text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateProduct}
            disabled={isLoading || isLoadingData}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
