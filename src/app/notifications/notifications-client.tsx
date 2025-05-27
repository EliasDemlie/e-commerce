'use client'

import { useState } from 'react'
import {
  Bell,
  ShoppingBag,
  Tag,
  Heart,
  Package,
  Check,
  Trash2,
  Filter,
  ChevronRight,
  Clock,
  BellRing,
  ShieldCheck,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { Button } from '@/components/ui/button2'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import Image from 'next/image'

// Notification types
type NotificationType = 'order' | 'price' | 'wishlist' | 'promotion' | 'account'

interface Notification {
  id: string
  type: NotificationType
  title: string
  description: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  actionText?: string
  image?: string
}

// Sample notifications data
const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'Order Shipped',
    description: 'Your order #12345 has been shipped and is on its way!',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
    actionUrl: '/orders/12345',
    actionText: 'Track Order',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: '2',
    type: 'price',
    title: 'Price Drop Alert',
    description:
      'The Sony WH-1000XM4 headphones in your wishlist are now 20% off!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    read: false,
    actionUrl: '/products/sony-wh-1000xm4',
    actionText: 'View Product',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: '3',
    type: 'wishlist',
    title: 'Back in Stock',
    description:
      'The Nike Air Max 270 shoes in your wishlist are back in stock!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: '/products/nike-air-max-270',
    actionText: 'Add to Cart',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: '4',
    type: 'promotion',
    title: 'Flash Sale: 24 Hours Only',
    description: 'Enjoy up to 50% off on selected items. Limited time offer!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    actionUrl: '/sale',
    actionText: 'Shop Now',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: '5',
    type: 'account',
    title: 'Security Alert',
    description:
      "Your password was changed successfully. If you didn't make this change, please contact support.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    read: true,
    actionUrl: '/account/security',
    actionText: 'Review Activity',
  },
  {
    id: '6',
    type: 'order',
    title: 'Order Delivered',
    description: 'Your order #12344 has been delivered. Enjoy your purchase!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96), // 4 days ago
    read: true,
    actionUrl: '/orders/12344',
    actionText: 'Leave Review',
    image: '/placeholder.svg?height=80&width=80',
  },
  {
    id: '7',
    type: 'promotion',
    title: 'New Collection Arrived',
    description:
      'Check out our Spring/Summer collection with exclusive early access!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120), // 5 days ago
    read: true,
    actionUrl: '/collections/spring-summer',
    actionText: 'Explore Collection',
    image: '/placeholder.svg?height=80&width=80',
  },
]

export default function NotificationsClient() {
  const [notifications, setNotifications] =
    useState<Notification[]>(sampleNotifications)
  const [activeTab, setActiveTab] = useState<string>('all')

  const unreadCount = notifications.filter((n) => !n.read).length

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === 'all'
      ? notifications
      : activeTab === 'unread'
      ? notifications.filter((n) => !n.read)
      : notifications.filter((n) => n.type === activeTab)

  // Mark a notification as read
  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    )
  }

  // Delete a notification
  const deleteNotification = (id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    )
  }

  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([])
  }

  // Get icon based on notification type
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return <ShoppingBag className="h-5 w-5 text-teal-500" />
      case 'price':
        return <Tag className="h-5 w-5 text-emerald-500" />
      case 'wishlist':
        return <Heart className="h-5 w-5 text-rose-500" />
      case 'promotion':
        return <Package className="h-5 w-5 text-violet-500" />
      case 'account':
        return <ShieldCheck className="h-5 w-5 text-amber-500" />
    }
  }

  // Get notification background class based on type and read status
  const getNotificationBgClass = (type: NotificationType, isRead: boolean) => {
    if (isRead) return 'bg-background hover:bg-muted/30 transition-colors'

    switch (type) {
      case 'order':
        return 'bg-teal-50 dark:bg-teal-900/10 hover:bg-teal-100/70 dark:hover:bg-teal-900/20 transition-colors'
      case 'price':
        return 'bg-emerald-50 dark:bg-emerald-900/10 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/20 transition-colors'
      case 'wishlist':
        return 'bg-rose-50 dark:bg-rose-900/10 hover:bg-rose-100/70 dark:hover:bg-rose-900/20 transition-colors'
      case 'promotion':
        return 'bg-violet-50 dark:bg-violet-900/10 hover:bg-violet-100/70 dark:hover:bg-violet-900/20 transition-colors'
      case 'account':
        return 'bg-amber-50 dark:bg-amber-900/10 hover:bg-amber-100/70 dark:hover:bg-amber-900/20 transition-colors'
    }
  }

  // Get icon container class based on notification type and read status
  const getIconContainerClass = (type: NotificationType, isRead: boolean) => {
    if (isRead) return 'border-muted bg-muted/30'

    switch (type) {
      case 'order':
        return 'border-teal-200 dark:border-teal-800/50 bg-teal-100/50 dark:bg-teal-900/20'
      case 'price':
        return 'border-emerald-200 dark:border-emerald-800/50 bg-emerald-100/50 dark:bg-emerald-900/20'
      case 'wishlist':
        return 'border-rose-200 dark:border-rose-800/50 bg-rose-100/50 dark:bg-rose-900/20'
      case 'promotion':
        return 'border-violet-200 dark:border-violet-800/50 bg-violet-100/50 dark:bg-violet-900/20'
      case 'account':
        return 'border-amber-200 dark:border-amber-800/50 bg-amber-100/50 dark:bg-amber-900/20'
    }
  }

  // Get badge class based on notification type
  const getBadgeClass = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return 'bg-teal-100 text-teal-700 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800/50'
      case 'price':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800/50'
      case 'wishlist':
        return 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800/50'
      case 'promotion':
        return 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800/50'
      case 'account':
        return 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800/50'
    }
  }

  // Get action button class based on notification type
  const getActionButtonClass = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return 'text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300'
      case 'price':
        return 'text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300'
      case 'wishlist':
        return 'text-rose-600 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300'
      case 'promotion':
        return 'text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300'
      case 'account':
        return 'text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300'
    }
  }

  // Get tab indicator class based on notification type
  const getTabIndicatorClass = (type: NotificationType) => {
    switch (type) {
      case 'order':
        return 'data-[state=active]:border-teal-500'
      case 'price':
        return 'data-[state=active]:border-emerald-500'
      case 'wishlist':
        return 'data-[state=active]:border-rose-500'
      case 'promotion':
        return 'data-[state=active]:border-violet-500'
      case 'account':
        return 'data-[state=active]:border-amber-500'
      default:
        return 'data-[state=active]:border-primary'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BellRing className="h-8 w-8 text-primary" />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2 rounded-full">
                {unreadCount} new
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your orders, wishlist, and promotions
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs h-9 border-primary/20 hover:bg-primary/5 hover:text-primary"
            >
              <Check className="mr-1 h-3.5 w-3.5" />
              Mark all as read
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-1 h-3.5 w-3.5" />
                <span className="hidden sm:inline">Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => setActiveTab('all')}>
                All Notifications
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('unread')}>
                Unread
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('order')}>
                <ShoppingBag className="h-4 w-4 mr-2 text-teal-500" />
                Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('price')}>
                <Tag className="h-4 w-4 mr-2 text-emerald-500" />
                Price Alerts
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('wishlist')}>
                <Heart className="h-4 w-4 mr-2 text-rose-500" />
                Wishlist Updates
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('promotion')}>
                <Package className="h-4 w-4 mr-2 text-violet-500" />
                Promotions
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveTab('account')}>
                <ShieldCheck className="h-4 w-4 mr-2 text-amber-500" />
                Account
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {notifications.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllNotifications}
              className="text-xs h-9 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="mr-1 h-3.5 w-3.5" />
              <span className="hidden sm:inline">Clear all</span>
            </Button>
          )}
        </div>
      </div>

      <Tabs
        defaultValue="all"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="border-b">
          <TabsList className="h-12 bg-transparent rounded-none w-full justify-start overflow-x-auto">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-background rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
            >
              All
              {notifications.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {notifications.length}
                </Badge>
              )}
            </TabsTrigger>
            {unreadCount > 0 && (
              <TabsTrigger
                value="unread"
                className="data-[state=active]:bg-background rounded-t-lg data-[state=active]:border-b-2 data-[state=active]:border-primary"
              >
                Unread
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
            )}
            <TabsTrigger
              value="order"
              className={cn(
                'data-[state=active]:bg-background rounded-t-lg data-[state=active]:border-b-2',
                getTabIndicatorClass('order')
              )}
            >
              <ShoppingBag className="h-4 w-4 mr-2 text-teal-500" />
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="price"
              className={cn(
                'data-[state=active]:bg-background rounded-t-lg data-[state=active]:border-b-2',
                getTabIndicatorClass('price')
              )}
            >
              <Tag className="h-4 w-4 mr-2 text-emerald-500" />
              Price Alerts
            </TabsTrigger>
            <TabsTrigger
              value="promotion"
              className={cn(
                'data-[state=active]:bg-background rounded-t-lg data-[state=active]:border-b-2 hidden sm:flex',
                getTabIndicatorClass('promotion')
              )}
            >
              <Package className="h-4 w-4 mr-2 text-violet-500" />
              Promotions
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-muted/50 blur-xl transform scale-75 opacity-70"></div>
                <Bell className="h-16 w-16 text-muted-foreground/50 mb-4 relative" />
              </div>
              <h3 className="text-xl font-medium mt-4">No notifications</h3>
              <p className="text-muted-foreground mt-2 max-w-md">
                {activeTab === 'all'
                  ? "You don't have any notifications yet."
                  : `You don't have any ${
                      activeTab === 'unread' ? 'unread' : activeTab
                    } notifications.`}
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[calc(100vh-300px)] min-h-[400px] pr-4">
              <div className="space-y-4">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={cn(
                      'relative flex gap-4 rounded-xl border p-4 animate-in fade-in slide-in-from-bottom-4 duration-300',
                      getNotificationBgClass(
                        notification.type,
                        notification.read
                      )
                    )}
                    style={{
                      animationDelay: `${
                        filteredNotifications.indexOf(notification) * 50
                      }ms`,
                    }}
                  >
                    {!notification.read && (
                      <div className="absolute top-4 right-4 h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    )}

                    <div
                      className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2',
                        getIconContainerClass(
                          notification.type,
                          notification.read
                        )
                      )}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-semibold leading-none">
                            {notification.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-1.5">
                            <p className="text-xs text-muted-foreground flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {formatDistanceToNow(notification.timestamp, {
                                addSuffix: true,
                              })}
                            </p>
                            <Badge
                              variant="outline"
                              className={cn(
                                'text-[10px] px-1.5 py-0 h-4',
                                getBadgeClass(notification.type)
                              )}
                            >
                              {notification.type.charAt(0).toUpperCase() +
                                notification.type.slice(1)}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-1">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-primary/10 hover:text-primary"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Check className="h-3.5 w-3.5" />
                              <span className="sr-only">Mark as read</span>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 mt-3">
                        {notification.image && (
                          <div className="shrink-0">
                            <Avatar className="h-20 w-20 rounded-lg border shadow-sm">
                              <Image
                                src={notification.image }
                                alt={notification.title}
                                width={80}
                                height={80}
                                className="object-cover"
                              />
                            </Avatar>
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-foreground/90">
                            {notification.description}
                          </p>

                          {notification.actionUrl && (
                            <Button
                              variant="link"
                              className={cn(
                                'h-auto p-0 text-sm mt-2.5 font-medium',
                                getActionButtonClass(notification.type)
                              )}
                              onClick={() => {
                                markAsRead(notification.id)
                                window.location.href = notification.actionUrl!
                              }}
                            >
                              {notification.actionText || 'View Details'}
                              <ChevronRight className="h-3.5 w-3.5 ml-1" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
