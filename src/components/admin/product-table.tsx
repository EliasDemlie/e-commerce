'use client'

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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button2'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Eye, Edit, Trash, Copy } from 'lucide-react'
import Image from 'next/image'
import { Product } from '@/type/Product'

interface ProductsTableProps {
  products: Product[]
  onEdit: (productId: string) => void
  onDelete: (productId: string) => void
  onDuplicate: (productId: string) => void
  onViewDetails: (productId: string) => void
  onToggleStock: (productId: string, inStock: boolean) => void
}

export default function ProductsTable({
  products,
  onEdit,
  onDelete,
  onDuplicate,
  onViewDetails,
  onToggleStock,
}: ProductsTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="hidden md:table-cell">Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead className="hidden md:table-cell">Rating</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 || !Array.isArray(products) ? (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No products found
              </TableCell>
            </TableRow>
          ) : (
            products.map(
              (product) =>
                product && (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="relative h-10 w-10 overflow-hidden rounded-md">
                        <Image
                          src={
                            product.images?.[0]?.views?.front ||
                            '/placeholder.svg'
                          }
                          alt={product.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {product.name || 'Unnamed Product'}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {product.description || 'No description'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {typeof product.category === 'string'
                        ? product.category
                        : product.category?.name || 'Uncategorized'}
                    </TableCell>
                    <TableCell>
                      ${product.price?.toFixed(2) || '0.00'}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center">
                        <span className="text-sm">
                          {product.rating?.toFixed(1) || '0.0'}
                        </span>
                        <span className="text-yellow-500 ml-1">★</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={product.inStock ? 'default' : 'destructive'}
                      >
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => onViewDetails(product._id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEdit(product._id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Product
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDuplicate(product._id)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              onToggleStock(product._id, !product.inStock)
                            }
                          >
                            {product.inStock
                              ? 'Mark Out of Stock'
                              : 'Mark In Stock'}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(product._id)}
                            className="text-red-600"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Product
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
            )
          )}
        </TableBody>
      </Table>
    </div>
  )
}
