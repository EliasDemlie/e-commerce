'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  LogOut,
  ShoppingCart,
  BarChart3,
  Bell,
  Truck,
  Tag,
  Percent,
  HelpCircle,
  FileText,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  
} from '@/components/ui/sidebar'

export default function AdminSidebar() {
  const pathname = usePathname()

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Managers', href: '/admin/managers', icon: Users },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Shipping', href: '/admin/shipping', icon: Truck },
    { name: 'Categories', href: '/admin/categories', icon: Tag },
    { name: 'Discounts', href: '/admin/discounts', icon: Percent },
    { name: 'Reports', href: '/admin/reports', icon: FileText },
    { name: 'Support', href: '/admin/support', icon: HelpCircle },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <Sidebar className="border-r border-border">
      <SidebarHeader className="border-b">
        <div className="flex items-center h-16 px-6">
          <h1 className="text-xl font-bold">Admin Portal</h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navigation.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                className="flex items-center px-4 py-3 text-sm"
              >
                <Link href={item.href}>
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center w-full px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
              <LogOut className="w-5 h-5 mr-3" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
