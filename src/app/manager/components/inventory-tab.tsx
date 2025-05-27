'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowUpDown,
  Download,
  Plus,
  SlidersHorizontal,
  AlertTriangle,
  XCircle,
  Check,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import EditStockDialog from '@/components/manager/edit-stock-dialog'
import { toast } from '@/components/ui/use-toast'
import { Category } from '@/type/category'

interface InventoryTabProps {
  searchInventory: string
  setSearchInventory: (value: string) => void
  categoryFilter: string
  setCategoryFilter: (value: string) => void
  locationFilter: string
  setLocationFilter: (value: string) => void
}

interface Product {
  _id: string
  name: string
  description: string
  category: {
    _id: string
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

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function EnhancedInventoryTab({
  searchInventory,
  setSearchInventory,
  categoryFilter,
  setCategoryFilter,
  locationFilter,
  setLocationFilter,
}: InventoryTabProps) {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [showLowStock, setShowLowStock] = useState(true)
  const [showOutOfStock, setShowOutOfStock] = useState(true)
  const [showInStock, setShowInStock] = useState(true)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  })

  const loadData = async (page: number = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (searchInventory) {
        params.append('search', searchInventory)
      }
      if (categoryFilter !== 'all') {
        params.append('category', categoryFilter)
      }
      if (locationFilter !== 'all') {
        params.append('location', locationFilter)
      }

      // Add stock filters
      const stockFilters = []
      if (showLowStock) stockFilters.push('low')
      if (showOutOfStock) stockFilters.push('out')
      if (showInStock) stockFilters.push('in')
      if (stockFilters.length > 0) {
        params.append('stockFilter', stockFilters.join(','))
      }

      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/product?${params.toString()}`),
        fetch('/api/product?type=categories'),
      ])

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error('Failed to fetch data')
      }

      const productsData = await productsResponse.json()
      const categoriesData = await categoriesResponse.json()

      setProducts(productsData.products || [])
      setPagination(
        productsData.pagination || {
          total: productsData.products?.length || 0,
          page: 1,
          limit: 20,
          pages: 1,
        }
      )
      setCategories(categoriesData.categories || [])
    } catch (error) {
      console.error('Error fetching inventory data:', error)
      setError(
        error instanceof Error ? error.message : 'Unknown error occurred'
      )
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load inventory data. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(1)
  }, [
    searchInventory,
    categoryFilter,
    locationFilter,
    showLowStock,
    showOutOfStock,
    showInStock,
  ])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    loadData(page)
  }

  const handleExportInventory = () => {
    const headers = [
      'ID',
      'Product',
      'Brand',
      'Category',
      'In Stock',
      'Quantity',
      'Price',
    ]
    const csvContent = [
      headers.join(','),
      ...products.map((product) =>
        [
          product._id,
          product.name.replace(/,/g, ' '),
          product.brand.replace(/,/g, ' '),
          product.category.name.replace(/,/g, ' '),
          product.inStock ? 'Yes' : 'No',
          product.quantity,
          product.price.toFixed(2),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inventory-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product)
    setShowEditDialog(true)
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    const currentPage = pagination.page
    const totalPages = pagination.pages

    // Always show first page
    pages.push(1)

    // Add ellipsis if there's a gap
    if (currentPage > 3) {
      pages.push('ellipsis1')
    }

    // Add pages around current page
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(totalPages - 1, currentPage + 1);
      i++
    ) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    // Add ellipsis if there's a gap
    if (currentPage < totalPages - 2) {
      pages.push('ellipsis2')
    }

    // Always show last page if more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage <= 1
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === 'string' ? (
                <PaginationEllipsis />
              ) : (
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={page === currentPage}
                  className="cursor-pointer"
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < totalPages && handlePageChange(currentPage + 1)
              }
              className={
                currentPage >= totalPages
                  ? 'pointer-events-none opacity-50'
                  : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">
              Error loading inventory: {error}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            value={searchInventory}
            onChange={(e) => setSearchInventory(e.target.value)}
            className="w-full sm:w-[280px]"
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <SlidersHorizontal className="h-4 w-4" />
                <span className="sr-only">Filter by stock</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuCheckboxItem
                checked={showLowStock}
                onCheckedChange={setShowLowStock}
              >
                Low Stock Items
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showOutOfStock}
                onCheckedChange={setShowOutOfStock}
              >
                Out of Stock Items
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={showInStock}
                onCheckedChange={setShowInStock}
              >
                In Stock Items
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem
                  key={category._id}
                  value={category.name.toLowerCase()}
                >
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={locationFilter} onValueChange={setLocationFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="warehouse1">Warehouse 1</SelectItem>
              <SelectItem value="warehouse2">Warehouse 2</SelectItem>
              <SelectItem value="storefront">Storefront</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportInventory}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => router.push('/manager/product')}>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {products.length} of {pagination.total} products
        </span>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 shadow-sm">
        <CardHeader className="border-b border-emerald-100 bg-emerald-50/50">
          <CardTitle className="text-emerald-800 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-emerald-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
              />
            </svg>
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-emerald-100">
                  <TableHead className="w-[80px] text-emerald-900">
                    ID
                  </TableHead>
                  <TableHead className="text-emerald-900">
                    <div className="flex items-center space-x-1 cursor-pointer">
                      <span>Product</span>
                      <ArrowUpDown className="h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-emerald-900">Brand</TableHead>
                  <TableHead className="text-emerald-900">Category</TableHead>
                  <TableHead className="text-emerald-900">Status</TableHead>
                  <TableHead className="text-right text-emerald-900">
                    Quantity
                  </TableHead>
                  <TableHead className="text-right text-emerald-900">
                    Price
                  </TableHead>
                  <TableHead className="text-right text-emerald-900">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No products found.
                    </TableCell>
                  </TableRow>
                ) : (
                  products.map((product) => (
                    <TableRow
                      key={product._id.toString()}
                      className="hover:bg-emerald-50"
                    >
                      <TableCell className="font-mono text-xs">
                        {product._id.toString().substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                      </TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{product.category.name}</TableCell>
                      <TableCell>
                        {!product.inStock || product.quantity === 0 ? (
                          <Badge
                            variant="destructive"
                            className="flex items-center w-fit gap-1 bg-red-500 text-white"
                          >
                            <XCircle className="h-3 w-3" />
                            Out of Stock
                          </Badge>
                        ) : product.quantity <= 10 ? (
                          <Badge
                            variant={'outline'}
                            className="flex items-center w-fit gap-1 bg-orange-500 text-white"
                          >
                            <AlertTriangle className="h-3 w-3" />
                            Low Stock
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="flex items-center w-fit gap-1 bg-emerald-100 text-emerald-800 border-emerald-300"
                          >
                            <Check className="h-3 w-3" />
                            In Stock
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {product.quantity}
                      </TableCell>
                      <TableCell className="text-right">
                        ${product.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-emerald-700 hover:text-emerald-900 hover:bg-emerald-100"
                        >
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {renderPagination()}
        </CardContent>
      </Card>

      {selectedProduct && (
        <EditStockDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          product={selectedProduct}
          onProductUpdated={() => loadData(pagination.page)}
        />
      )}
    </div>
  )
}
