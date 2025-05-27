"use client"

import { useState, useEffect } from "react"
import { Download, Plus, Eye, Filter, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button2"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"
import ViewShipmentDialog from "@/components/manager/view-shipment-dialog"
import type { Shipment } from "@/type/Shipment"
import type { Carrier } from "@/type/Carrier"
import AddShipmentDialog from "@/components/manager/add-shippment"

interface ShipmentsTabProps {
  searchShipment: string
  setSearchShipment: (value: string) => void
  statusFilter: string
  setStatusFilter: (value: string) => void
  carrierFilter: string
  setCarrierFilter: (value: string) => void
}

interface PaginationInfo {
  total: number
  page: number
  limit: number
  pages: number
}

export default function EnhancedShipmentsTab({
  searchShipment,
  setSearchShipment,
  statusFilter,
  setStatusFilter,
  carrierFilter,
  setCarrierFilter,
}: ShipmentsTabProps) {
  const { toast } = useToast()
  const [shipments, setShipments] = useState<Shipment[]>([])
  const [carriers, setCarriers] = useState<Carrier[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showViewDialog, setShowViewDialog] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null)
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  })

  const loadData = async (page = 1) => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pagination.limit.toString(),
      })

      if (statusFilter !== "all") {
        params.append("status", statusFilter)
      }
      if (carrierFilter !== "all") {
        const carrier = carriers.find((c) => c.name.toLowerCase() === carrierFilter.toLowerCase())
        if (carrier) {
          params.append("carrierId", carrier._id)
        }
      }
      if (searchShipment) {
        params.append("search", searchShipment)
      }

      const [shipmentsResponse, carriersResponse] = await Promise.all([
        fetch(`/api/shipments?${params.toString()}`),
        fetch("/api/carrier"),
      ])

      if (!shipmentsResponse.ok || !carriersResponse.ok) {
        throw new Error("Failed to fetch data")
      }

      const shipmentsData = await shipmentsResponse.json()
      const carriersData = await carriersResponse.json()

      setShipments(shipmentsData.shipments || [])
      setPagination(
        shipmentsData.pagination || {
          total: shipmentsData.shipments?.length || 0,
          page: 1,
          limit: 20,
          pages: 1,
        },
      )
      setCarriers(carriersData.carriers || [])
    } catch (error) {
      console.error("Error fetching data:", error)
      setError(error instanceof Error ? error.message : "Unknown error occurred")
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load shipment data. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadData(1)
  }, [statusFilter, carrierFilter, searchShipment])

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }))
    loadData(page)
  }

  const handleExportShipments = () => {
    if (shipments.length === 0) {
      toast({
        title: "No shipments to export",
        description: "There are no shipments matching your current filters.",
      })
      return
    }

    const headers = ["ID", "Tracking #", "Customer", "Status", "Carrier", "Date Shipped", "Date Delivered", "Items"]
    const csvContent = [
      headers.join(","),
      ...shipments.map((shipment) => {
        return [
          shipment._id,
          shipment.trackingNumber,
          shipment.customer.name.replace(/,/g, " "),
          shipment.status,
          shipment.carrier.name.replace(/,/g, " "),
          shipment.dateShipped || "",
          shipment.dateDelivered || "",
          shipment.items.reduce((total, item) => total + item.quantity, 0),
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `shipments-${new Date().toISOString().split("T")[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Export successful",
      description: `${shipments.length} shipments exported to CSV.`,
    })
  }

  const handleViewShipment = (shipment: Shipment) => {
    setSelectedShipment(shipment)
    setShowViewDialog(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "—"
    try {
      return format(new Date(dateString), "MMM dd, yyyy")
    } catch (e) {
      if (e instanceof Error) {
        console.error("Error formatting date:", e.message)
      }
      return "Invalid date"
    }
  }

  const getStatusBadge = (status: Shipment["status"]) => {
    switch (status) {
      case "processing":
        return <Badge className="bg-orange-500 text-white">Processing</Badge>
      case "in_transit":
        return <Badge className="bg-blue-500 text-white">In Transit</Badge>
      case "delivered":
        return <Badge className="bg-green-600 text-white">Delivered</Badge>
      case "failed":
        return <Badge className="bg-red-500 text-white">Failed</Badge>
      case "returned":
        return <Badge className="bg-purple-500 text-white">Returned</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const renderPagination = () => {
    if (pagination.pages <= 1) return null

    const pages = []
    const currentPage = pagination.page
    const totalPages = pagination.pages

    pages.push(1)

    if (currentPage > 3) {
      pages.push("ellipsis1")
    }

    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (currentPage < totalPages - 2) {
      pages.push("ellipsis2")
    }

    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages)
    }

    return (
      <Pagination className="mt-6">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>

          {pages.map((page, index) => (
            <PaginationItem key={index}>
              {typeof page === "string" ? (
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
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
      <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Filter className="h-5 w-5 text-destructive" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-destructive">Error loading shipments: {error}</p>
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
            placeholder="Search shipments..."
            value={searchShipment}
            onChange={(e) => setSearchShipment(e.target.value)}
            className="w-full sm:w-[280px]"
          />

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Status" />
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

          <Select value={carrierFilter} onValueChange={setCarrierFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Carrier" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Carriers</SelectItem>
              {carriers.map((carrier) => (
                <SelectItem key={carrier._id.toString()} value={carrier.name.toLowerCase()}>
                  {carrier.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={handleExportShipments}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Shipment
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <span>
          Showing {shipments.length} of {pagination.total} shipments
        </span>
        <span>
          Page {pagination.page} of {pagination.pages}
        </span>
      </div>

      <Card className="bg-gradient-to-br from-purple-50 to-white border border-purple-100 shadow-sm dark:from-purple-950/20 dark:to-background dark:border-purple-900/20">
        <CardHeader className="border-b border-purple-100 bg-purple-50/50 dark:border-purple-900/20 dark:bg-purple-950/10">
          <CardTitle className="text-purple-800 dark:text-purple-300 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 text-purple-600 dark:text-purple-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
            Shipment Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-purple-100 dark:bg-purple-950/30">
                  <TableHead className="w-[80px] text-purple-900 dark:text-purple-300">ID</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Tracking #</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Customer</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Status</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Carrier</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Date Shipped</TableHead>
                  <TableHead className="text-purple-900 dark:text-purple-300">Date Delivered</TableHead>
                  <TableHead className="text-right text-purple-900 dark:text-purple-300">Items</TableHead>
                  <TableHead className="text-right text-purple-900 dark:text-purple-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shipments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                      No shipments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  shipments.map((shipment) => (
                    <TableRow key={shipment._id.toString()} className="hover:bg-purple-50 dark:hover:bg-purple-950/10">
                      <TableCell className="font-mono text-xs">{shipment._id.toString().substring(0, 8)}...</TableCell>
                      <TableCell className="font-medium">{shipment.trackingNumber}</TableCell>
                      <TableCell>{shipment.customer.name}</TableCell>
                      <TableCell>{getStatusBadge(shipment.status)}</TableCell>
                      <TableCell>{shipment.carrier.name}</TableCell>
                      <TableCell>{formatDate(shipment.dateShipped)}</TableCell>
                      <TableCell>{formatDate(shipment.dateDelivered)}</TableCell>
                      <TableCell className="text-right">
                        {shipment.items.reduce((total, item) => total + item.quantity, 0)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewShipment(shipment)}
                          className="text-purple-700 hover:text-purple-900 hover:bg-purple-100 dark:text-purple-400 dark:hover:text-purple-300 dark:hover:bg-purple-900/20"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View
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

      <AddShipmentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onShipmentAdded={() => loadData(pagination.page)}
      />

      {selectedShipment && (
        <ViewShipmentDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          shipment={selectedShipment}
          carriers={carriers}
          onShipmentUpdated={() => loadData(pagination.page)}
        />
      )}
    </div>
  )
}
