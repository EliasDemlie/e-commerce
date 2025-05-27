import type { Metadata } from 'next'
// import { redirect } from 'next/navigation'
// import { getCurrentUser } from '@/action/CurrentUser'

import AddManagerForm from '@/components/admin/add-manager-form'
import ManagersList from '@/components/admin/managers-table'

export const metadata: Metadata = {
  title: 'Manage Shipping Managers',
  description: 'Add and manage shipping stock managers',
}

export default async function ManagersPage() {
//   const currentUser = await getCurrentUser()

//   if (!currentUser || currentUser.role !== 'ADMIN') {
//     redirect('/')
//   }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Shipping Managers</h1>
      </div>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">Add New Manager</h2>
          <AddManagerForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Current Managers</h2>
          <ManagersList />
        </div>
      </div>
    </div>
  )
}
