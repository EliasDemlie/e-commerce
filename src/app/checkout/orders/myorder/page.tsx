import type { Metadata } from 'next'
import MyOrdersClient from './myOrder'
import { getCurrentUser } from '@/action/CurrentUser'
import UnauthorizedPage from '@/components/unauthorized'

export const metadata: Metadata = {
  title: 'My Orders | Your Store',
  description: 'View and track your order history',
}

export default async function MyOrdersPage() {
  const currentUser = await getCurrentUser()
  if (!currentUser) {
    return <UnauthorizedPage />
  }
  return (
    <div className="container py-10 p-8">
      <MyOrdersClient />
    </div>
  )
}
