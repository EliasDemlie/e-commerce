'use client'

import { Badge } from '@/components/ui/badge'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Search, Filter, Plus, Download, Loader2 } from 'lucide-react'
import { useNotificationContext } from '@/provider/NotificationProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import PaginationControls from '@/components/admin/pagination-controls'
import Image from 'next/image'
import { Product } from '@/type/Product'
import ProductsTable from '@/components/admin/product-table'
import { Category } from '@/type/category'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { addNotification } = useNotificationContext()
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, searchQuery, categoryFilter, stockFilter])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/category')
      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : data.categories || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/product')
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }
      const data = await response.json()
      setProducts(Array.isArray(data) ? data : data.products || [])
      setFilteredProducts(Array.isArray(data) ? data : data.products || [])
    } catch (error) {
      console.error('Error fetching products:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to fetch products',
        type: 'system',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterProducts = () => {
    if (!Array.isArray(products)) {
      setFilteredProducts([])
      return
    }

    let filtered = [...products]

    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product?.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          product?.brand?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((product) => {
        if (!product) return false
        if (typeof product.category === 'string') {
          return product.category === categoryFilter
        } else {
          return product.category?.name === categoryFilter
        }
      })
    }

    if (stockFilter !== 'all') {
      filtered = filtered.filter((product) => {
        if (!product) return false
        if (stockFilter === 'inStock') {
          return product.inStock
        } else if (stockFilter === 'outOfStock') {
          return !product.inStock
        }
        return true
      })
    }

    setFilteredProducts(filtered)
  }

  const handleEditProduct = (productId: string) => {
    const product = products.find((p) => p?._id === productId)
    if (product) {
      addNotification({
        title: 'Edit Product',
        message: `Editing product ${productId}`,
        type: 'product',
      })
    }
  }

  const handleDeleteProduct = (productId: string) => {
    const product = products.find((p) => p?._id === productId) || null
    setSelectedProduct(product)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!selectedProduct) return

    try {
      const response = await fetch(`/api/product/${selectedProduct._id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete product')
      }

      setProducts(
        products.filter((product) => product?._id !== selectedProduct._id)
      )
      setFilteredProducts(
        filteredProducts.filter(
          (product) => product?._id !== selectedProduct._id
        )
      )

      addNotification({
        title: 'Success',
        message: `Product "${selectedProduct.name}" has been deleted`,
        type: 'product',
      })

      setIsDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting product:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to delete product',
        type: 'system',
      })
    }
  }

  const handleDuplicateProduct = async (productId: string) => {
    const productToDuplicate = products.find((p) => p?._id === productId)
    if (productToDuplicate) {
      try {
        const { ...productData } = productToDuplicate
        const newProductData = {
          ...productData,
          name: `${productToDuplicate.name} (Copy)`,
        }

        const response = await fetch('/api/product', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProductData),
        })

        if (!response.ok) {
          throw new Error('Failed to duplicate product')
        }

        const duplicatedProduct = await response.json()
        setProducts((prev) => [...prev, duplicatedProduct])
        setFilteredProducts((prev) => [...prev, duplicatedProduct])

        addNotification({
          title: 'Success',
          message: `Product "${productToDuplicate.name}" has been duplicated`,
          type: 'product',
        })
      } catch (error) {
        console.error('Error duplicating product:', error)
        addNotification({
          title: 'Error',
          message: 'Failed to duplicate product',
          type: 'system',
        })
      }
    }
  }

  const handleViewProductDetails = (productId: string) => {
    const product = products.find((p) => p?._id === productId) || null
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const handleToggleStock = async (productId: string, inStock: boolean) => {
    const productIndex = products.findIndex((p) => p?._id === productId)
    if (productIndex !== -1 && products[productIndex]) {
      try {
        const response = await fetch(`/api/product/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inStock }),
        })

        if (!response.ok) {
          throw new Error('Failed to update product stock status')
        }

        const updatedProduct = { ...products[productIndex], inStock }
        const updatedProducts = [...products]
        updatedProducts[productIndex] = updatedProduct
        setProducts(updatedProducts)
        const filteredIndex = filteredProducts.findIndex(
          (p) => p?._id === productId
        )
        if (filteredIndex !== -1) {
          const updatedFiltered = [...filteredProducts]
          updatedFiltered[filteredIndex] = updatedProduct
          setFilteredProducts(updatedFiltered)
        }

        addNotification({
          title: 'Success',
          message: `${products[productIndex].name} is now ${
            inStock ? 'in stock' : 'out of stock'
          }`,
          type: 'product',
        })
      } catch (error) {
        console.error('Error updating product stock status:', error)
        addNotification({
          title: 'Error',
          message: 'Failed to update product stock status',
          type: 'system',
        })
      }
    }
  }

  const exportProducts = () => {
    addNotification({
      title: 'Export Started',
      message: 'Your product export is being processed',
      type: 'system',
    })
  }

  const totalPages = filteredProducts
    ? Math.ceil(filteredProducts.length / itemsPerPage)
    : 0
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentProducts = Array.isArray(filteredProducts)
    ? filteredProducts.slice(startIndex, endIndex)
    : []

    if (isLoading) {
        return (
          <div className="container mx-auto py-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#4a6bff]" />
          </div>
        )
      }
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Products</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={exportProducts} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <Select
                  value={categoryFilter}
                  onValueChange={setCategoryFilter}
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {Array.isArray(categories) &&
                      categories.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Select value={stockFilter} onValueChange={setStockFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Stock Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Stock</SelectItem>
                    <SelectItem value="inStock">In Stock</SelectItem>
                    <SelectItem value="outOfStock">Out of Stock</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <ProductsTable
            products={currentProducts}
            onEdit={handleEditProduct}
            onDelete={handleDeleteProduct}
            onDuplicate={handleDuplicateProduct}
            onViewDetails={handleViewProductDetails}
            onToggleStock={handleToggleStock}
          />
          <div className="mt-6">
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              totalItems={filteredProducts ? filteredProducts.length : 0}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-3xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedProduct.name}</DialogTitle>
                <DialogDescription>
                  {selectedProduct.brand} •{' '}
                  {typeof selectedProduct.category === 'string'
                    ? selectedProduct.category
                    : selectedProduct.category?.name}
                </DialogDescription>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="aspect-square relative overflow-hidden rounded-lg border">
                    <Image
                      src={
                        selectedProduct.images?.[0]?.views?.front ||
                        '/placeholder.svg'
                      }
                      alt={selectedProduct.name || 'Product'}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.values(
                      selectedProduct.images?.[0]?.views || {}
                    ).map((url, index) => (
                      <div
                        key={index}
                        className="aspect-square relative overflow-hidden rounded-md border"
                      >
                        <Image
                          src={url || '/placeholder.svg'}
                          alt={`View ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold">
                      ${selectedProduct.price?.toFixed(2) || '0.00'}
                    </h3>
                    <div className="flex items-center mt-1">
                      <Badge
                        className="ml-2"
                        variant={
                          selectedProduct.inStock ? 'default' : 'destructive'
                        }
                      >
                        {selectedProduct.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Description
                    </h3>
                    <p className="mt-1">
                      {selectedProduct.description || 'No description'}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Category
                    </h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="outline">
                        {typeof selectedProduct.category === 'string'
                          ? selectedProduct.category
                          : selectedProduct.category?.name || 'Uncategorized'}
                      </Badge>
                      {typeof selectedProduct.category !== 'string' &&
                        selectedProduct.category?.subCategories?.map(
                          (subCategory, index) => (
                            <Badge key={index} variant="outline">
                              {subCategory}
                            </Badge>
                          )
                        )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">
                      Colors
                    </h3>
                    <div className="flex gap-2 mt-1">
                      {selectedProduct.images?.map((image, index) => (
                        <div
                          key={index}
                          className="w-6 h-6 rounded-full border"
                          style={{
                            backgroundColor: image?.colorCode || '#000',
                          }}
                          title={image?.color || 'Unknown'}
                        />
                      ))}
                    </div>
                  </div>

                  {selectedProduct.inStock && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Inventory
                      </h3>
                      <p className="mt-1">
                        {selectedProduct.quantity || 0} units available
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => handleEditProduct(selectedProduct._id)}
                >
                  Edit Product
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product 
              {selectedProduct?.name || 'Unknown'}
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
