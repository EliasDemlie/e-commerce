'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button2'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Package,
  ShoppingCart,
} from 'lucide-react'
import { useNotificationContext } from '@/provider/NotificationProvider'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ReportData {
  id: string
  name: string
  type: string
  generatedAt: string
  status: 'completed' | 'processing' | 'failed'
  downloadUrl?: string
  size?: string
}

export default function ReportsPage() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('last_30_days')
  const [selectedReportType, setSelectedReportType] = useState('sales')
  const { addNotification } = useNotificationContext()

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setIsLoading(true)
      // Mock data for demonstration
      const mockReports: ReportData[] = [
        {
          id: '1',
          name: 'Sales Report - November 2024',
          type: 'sales',
          generatedAt: new Date().toISOString(),
          status: 'completed',
          downloadUrl: '/reports/sales-nov-2024.pdf',
          size: '2.4 MB',
        },
        {
          id: '2',
          name: 'Inventory Report - November 2024',
          type: 'inventory',
          generatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          status: 'completed',
          downloadUrl: '/reports/inventory-nov-2024.xlsx',
          size: '1.8 MB',
        },
        {
          id: '3',
          name: 'Customer Report - October 2024',
          type: 'customers',
          generatedAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          status: 'processing',
        },
        {
          id: '4',
          name: 'Financial Report - Q3 2024',
          type: 'financial',
          generatedAt: new Date(Date.now() - 72 * 60 * 60 * 1000).toISOString(),
          status: 'failed',
        },
      ]

      setReports(mockReports)
    } catch (error) {
      console.error('Error fetching reports:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to fetch reports',
        type: 'system',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateReport = async () => {
    try {
      const newReport: ReportData = {
        id: `report-${Date.now()}`,
        name: `${
          selectedReportType.charAt(0).toUpperCase() +
          selectedReportType.slice(1)
        } Report - ${new Date().toLocaleDateString()}`,
        type: selectedReportType,
        generatedAt: new Date().toISOString(),
        status: 'processing',
      }

      setReports((prev) => [newReport, ...prev])

      addNotification({
        title: 'Report Generation Started',
        message: `Your ${selectedReportType} report is being generated`,
        type: 'system',
      })

      // Simulate report generation
      setTimeout(() => {
        setReports((prev) =>
          prev.map((report) =>
            report.id === newReport.id
              ? {
                  ...report,
                  status: 'completed' as const,
                  downloadUrl: `/reports/${selectedReportType}-${Date.now()}.pdf`,
                  size: '1.2 MB',
                }
              : report
          )
        )

        addNotification({
          title: 'Report Ready',
          message: `Your ${selectedReportType} report is ready for download`,
          type: 'system',
        })
      }, 3000)
    } catch (error) {
      console.error('Error generating report:', error)
      addNotification({
        title: 'Error',
        message: 'Failed to generate report',
        type: 'system',
      })
    }
  }

  const handleDownloadReport = (report: ReportData) => {
    if (report.downloadUrl) {
      // In a real app, this would trigger a file download
      addNotification({
        title: 'Download Started',
        message: `Downloading ${report.name}`,
        type: 'system',
      })
    }
  }

  const getStatusColor = (status: ReportData['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  const getReportIcon = (type: string) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="w-4 h-4" />
      case 'customers':
        return <Users className="w-4 h-4" />
      case 'inventory':
        return <Package className="w-4 h-4" />
      case 'financial':
        return <ShoppingCart className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Report Type</label>
                  <Select
                    value={selectedReportType}
                    onValueChange={setSelectedReportType}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Report</SelectItem>
                      <SelectItem value="customers">Customer Report</SelectItem>
                      <SelectItem value="inventory">
                        Inventory Report
                      </SelectItem>
                      <SelectItem value="financial">
                        Financial Report
                      </SelectItem>
                      <SelectItem value="orders">Orders Report</SelectItem>
                      <SelectItem value="products">Products Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Time Period</label>
                  <Select
                    value={selectedPeriod}
                    onValueChange={setSelectedPeriod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select time period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                      <SelectItem value="last_3_months">
                        Last 3 Months
                      </SelectItem>
                      <SelectItem value="last_6_months">
                        Last 6 Months
                      </SelectItem>
                      <SelectItem value="last_year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleGenerateReport}>
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Report
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Type
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        Generated
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="hidden md:table-cell">
                        Size
                      </TableHead>
                      <TableHead className="w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : reports.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-muted-foreground"
                        >
                          No reports found
                        </TableCell>
                      </TableRow>
                    ) : (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getReportIcon(report.type)}
                              <span className="font-medium">{report.name}</span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline">
                              {report.type.charAt(0).toUpperCase() +
                                report.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {new Date(report.generatedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className={getStatusColor(report.status)}
                            >
                              {report.status.charAt(0).toUpperCase() +
                                report.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {report.size || '—'}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownloadReport(report)}
                              disabled={report.status !== 'completed'}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
