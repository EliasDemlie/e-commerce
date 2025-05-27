'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { formatDate } from '@/hooks/utils/formatDate'


interface Manager {
  _id: string
  name: string
  email: string
  createdAt: string
  contactPhone?: string
}

export default function ManagersList() {
  const [managers, setManagers] = useState<Manager[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const response = await fetch('/api/register/manager')
        const data = await response.json()

        if (data.success) {
          setManagers(data.managers)
        } else {
          setError(data.error || 'Failed to fetch managers')
        }
      } catch (err) {
        setError('An error occurred while fetching managers')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchManagers()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-red-500">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (managers.length === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="text-center py-4 text-muted-foreground">
            No managers found. Add your first manager.
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managers.map((manager) => (
              <TableRow key={manager._id}>
                <TableCell className="font-medium">{manager.name}</TableCell>
                <TableCell>{manager.email}</TableCell>
                <TableCell>{manager.contactPhone || '—'}</TableCell>
                <TableCell>{formatDate(manager.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
