import type React from 'react'
import { getCurrentUser } from '@/action/CurrentUser'
import { Toaster } from '@/components/ui/toaster'
import { NotificationBell } from '@/components/admin/notification-bell'
import { SidebarProvider } from '@/components/ui/sidebar'
import AdminSidebar from '@/components/admin/adminSideBar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const currentUser = await getCurrentUser()

  if (!currentUser || currentUser.role !== 'ADMIN') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Toaster />
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-background sticky top-0 z-10">
            <h1 className="text-xl font-semibold md:hidden">Admin Portal</h1>
            <div className="flex items-center gap-4 ml-auto">
              <NotificationBell />
            </div>
          </header>
          <main className="p-6 bg-gray-50  flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
