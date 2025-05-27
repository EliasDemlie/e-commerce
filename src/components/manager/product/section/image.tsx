'use client'

import type React from 'react'
import { Trash2, Plus, X } from 'lucide-react'
import Image from 'next/image'
import { toast } from 'react-toastify'
import { MdCheckCircle } from 'react-icons/md'

import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button2'
import { UploadDropzone } from '@/hooks/utils/uploadthing'
import type { Product } from '@/type/Product'

interface UploadResponse {
  url: string
}

interface ImagesSectionProps {
  product: Omit<Product, '_id' | 'id' | 'rating'>
  setProduct: React.Dispatch<
    React.SetStateAction<Omit<Product, '_id' | 'id' | 'rating'>>
  >
}

export default function ImagesSection({
  product,
  setProduct,
}: ImagesSectionProps) {
  const handleColorChange = (index: number, field: string, value: string) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images]
      updatedImages[index] = {
        ...updatedImages[index],
        [field]: value,
      }
      return {
        ...prev,
        images: updatedImages,
      }
    })
  }

  const handleUploadComplete = (
    res: UploadResponse[],
    index: number,
    viewType: 'front' | 'side' | 'back'
  ) => {
    if (!res || res.length === 0) return

    const imageUrl = res[0].url

    setProduct((prev) => {
      const updatedImages = [...prev.images]
      updatedImages[index] = {
        ...updatedImages[index],
        views: {
          ...updatedImages[index].views,
          [viewType]: imageUrl,
        },
      }
      return { ...prev, images: updatedImages }
    })

    toast.success('Image uploaded successfully!', {
      position: 'top-right',
      autoClose: 2000,
      icon: <MdCheckCircle className="text-green-600" />,
    })
  }

  const removeImage = (
    index: number,
    view: keyof Product['images'][0]['views']
  ) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images]
      updatedImages[index] = {
        ...updatedImages[index],
        views: {
          ...updatedImages[index].views,
          [view]: '',
        },
      }
      return {
        ...prev,
        images: updatedImages,
      }
    })
  }

  const addColorVariant = () => {
    setProduct((prev) => ({
      ...prev,
      images: [
        ...prev.images,
        {
          color: '',
          colorCode: '#000000',
          views: {
            front: '',
            side: '',
            back: '',
          },
        },
      ],
    }))
  }

  const removeColorVariant = (index: number) => {
    setProduct((prev) => {
      const updatedImages = [...prev.images]
      updatedImages.splice(index, 1)
      return {
        ...prev,
        images: updatedImages.length
          ? updatedImages
          : [
              {
                color: '',
                colorCode: '#000000',
                views: {
                  front: '',
                  side: '',
                  back: '',
                },
              },
            ],
      }
    })
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Images & Color Variants</h2>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addColorVariant}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Color Variant
          </Button>
        </div>

        <div className="space-y-6">
          {product.images.map((image, index) => (
            <div key={index} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Color Variant {index + 1}</h3>
                {product.images.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeColorVariant(index)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`color-${index}`}>Color Name</Label>
                  <Input
                    id={`color-${index}`}
                    value={image.color}
                    onChange={(e) =>
                      handleColorChange(index, 'color', e.target.value)
                    }
                    placeholder="e.g., Red, Blue, Black"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`colorCode-${index}`}>Color Code</Label>
                  <div className="flex space-x-2">
                    <Input
                      id={`colorCode-${index}`}
                      type="color"
                      value={image.colorCode}
                      onChange={(e) =>
                        handleColorChange(index, 'colorCode', e.target.value)
                      }
                      className="w-12 p-1 h-10"
                    />
                    <Input
                      value={image.colorCode}
                      onChange={(e) =>
                        handleColorChange(index, 'colorCode', e.target.value)
                      }
                      placeholder="#000000"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {/* Front View Upload */}
                <div className="space-y-2">
                  <Label>Front View</Label>
                  {image.views.front ? (
                    <div className="relative aspect-square border rounded-md overflow-hidden">
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
                        onClick={() => removeImage(index, 'front')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      className="p-2 border border-gray-600"
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) =>
                        handleUploadComplete(res, index, 'front')
                      }
                      onUploadError={(error) => {
                        console.log('Error uploading image:', error)
                        toast.error('Upload Error!', {
                          position: 'top-right',
                          autoClose: 3000,
                          icon: <MdCheckCircle className="text-red-600" />,
                        })
                      }}
                    />
                  )}
                </div>

                {/* Side View Upload */}
                <div className="space-y-2">
                  <Label>Side View</Label>
                  {image.views.side ? (
                    <div className="relative aspect-square border rounded-md overflow-hidden">
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
                        onClick={() => removeImage(index, 'side')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) =>
                        handleUploadComplete(res, index, 'side')
                      }
                      onUploadError={(error) => {
                        console.log('Error uploading image:', error)
                        toast.error('Upload Error!', {
                          position: 'top-right',
                          autoClose: 3000,
                          icon: <MdCheckCircle className="text-red-600" />,
                        })
                      }}
                    />
                  )}
                </div>

                {/* Back View Upload */}
                <div className="space-y-2">
                  <Label>Back View</Label>
                  {image.views.back ? (
                    <div className="relative aspect-square border rounded-md overflow-hidden">
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
                        onClick={() => removeImage(index, 'back')}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <UploadDropzone
                      endpoint="imageUploader"
                      onClientUploadComplete={(res) =>
                        handleUploadComplete(res, index, 'back')
                      }
                      onUploadError={(error) => {
                        console.log('Error uploading image:', error)
                        toast.error('Upload Error!', {
                          position: 'top-right',
                          autoClose: 3000,
                          icon: <MdCheckCircle className="text-red-600" />,
                        })
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
