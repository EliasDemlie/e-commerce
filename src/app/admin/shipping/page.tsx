'use client'

import { useState, useEffect, Suspense } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import { Input } from '@/components/ui/input'
import { Search, Filter, Truck, Download } from 'lucide-react'
import { useNotificationContext } from '@/provider/NotificationProvider'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
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
import { MoreHorizontal, Eye, Edit, MapPin, Package } from 'lucide-react'
import PaginationControls from '@/components/admin/pagination-controls'
import { Shipment } from '@/type/Shipment'
import { toast } from '@/components/ui/use-toast'

export const dynamic = 'force-dynamic'

export default function ShippingPage() {
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [filteredShipments, setFilteredShipments] = useState<Shipment[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { addNotification } = useNotificationContext()

  useEffect(() => {
    fetchShipments()
  }, [])

  useEffect(() => {
    filterShipments()
  }, [shipments, searchQuery, statusFilter])

  const fetchShipments = async () => {
    setIsLoading(true)

    try {
      const query = new URLSearchParams({
        limit: '50',
        sort: 'createdAt:desc',
        ...(statusFilter !== 'all' && { status: statusFilter }),
      }).toString()

      const response = await fetch(`/api/shipments?${query}`)
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Unauthorized: Please log in to view shipments')
        }
        throw new Error(`Failed to fetch shipments: ${response.statusText}`)
      }

      const data = await response.json()
      if (!Array.isArray(data.shipments)) {
        throw new Error('Expected an array of shipments')
      }
      setShipments(data.shipments)
    } catch (error) {
      console.error('Error fetching shipments:', error)

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load shipments. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const filterShipments = () => {
    let filtered = [...shipments]

    if (searchQuery) {
      filtered = filtered.filter(
        (shipment) =>
          shipment.trackingNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment.customer.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((shipment) => shipment.status === statusFilter)
    }

    setFilteredShipments(filtered)
    setCurrentPage(1)
  }

  const handleUpdateStatus = async (
    shipmentId: string,
    newStatus: Shipment['status']
  ) => {
    try {
      const response = await fetch(`/api/shipments/${shipmentId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update shipment status')
      }

      setShipments((prev) =>
        prev.map((shipment) =>
          shipment._id === shipmentId
            ? { ...shipment, status: newStatus }
            : shipment
        )
      )

      const shipment = shipments.find((s) => s._id === shipmentId)
      addNotification({
        title: 'Success',
        message: `Shipment ${shipment?.trackingNumber} status updated to ${newStatus}`,
        type: 'system',
      })
    } catch (error) {
      console.error('Error updating shipment status:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to update shipment status',
        type: 'system',
      })
    }
  }

  const getStatusColor = (status: Shipment['status']) => {
    switch (status) {
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'in_transit':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'returned':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const totalPages = Math.ceil(filteredShipments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentShipments = filteredShipments.slice(startIndex, endIndex)

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Shipping</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Truck className="w-4 h-4 mr-2" />
            Create Shipment
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Shipment Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 w-full"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="in_transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tracking #</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Customer
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Carrier
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Shipped
                  </TableHead>
                  <TableHead className="w-[80px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : currentShipments.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-muted-foreground"
                    >
                      No shipments found
                    </TableCell>
                  </TableRow>
                ) : (
                  currentShipments.map((shipment) => (
                    <TableRow key={shipment._id}>
                      <TableCell className="font-medium">
                        {shipment.trackingNumber}
                      </TableCell>
                      <TableCell>#{shipment.orderId}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div>
                          <p className="font-medium">
                            {shipment.customer.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.customer.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {shipment.carrier.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(shipment.status)}
                        >
                          {shipment.status.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {shipment.dateShipped
                          ? new Date(shipment.dateShipped).toLocaleDateString()
                          : '—'}
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
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <MapPin className="mr-2 h-4 w-4" />
                              Track Package
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Shipment
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(shipment._id, 'in_transit')
                              }
                              disabled={shipment.status === 'in_transit'}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Mark In Transit
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(shipment._id, 'delivered')
                              }
                              disabled={shipment.status === 'delivered'}
                            >
                              <Package className="mr-2 h-4 w-4" />
                              Mark Delivered
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6">
            <Suspense fallback={<div>Loading pagination...</div>}>
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredShipments.length}
                itemsPerPage={itemsPerPage}
              />
            </Suspense>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
