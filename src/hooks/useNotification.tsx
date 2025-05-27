import { create } from 'zustand'
import { toast, Toast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

export interface Notification {
  id: string
  type: 'order' | 'user' | 'product' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: Date
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (
    notification: Omit<Notification, 'id' | 'read' | 'createdAt'>
  ) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  clearNotifications: () => void
}

const NotificationToast = ({
  t,
  title,
  message,
}: {
  t: Toast
  title: string
  message: string
}) => (
  <div
    role="alert"
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
  >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 text-lg">🔔</span>
          </div>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{title}</p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Close
      </button>
    </div>
  </div>
)

export const useNotification = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    try {
      const validTypes = ['order', 'user', 'product', 'system'] as const
      if (!validTypes.includes(notification.type)) {
        throw new Error(`Invalid notification type: ${notification.type}`)
      }

      const newNotification: Notification = {
        ...notification,
        id: uuidv4(),
        read: false,
        createdAt: new Date(),
      }

      set((state) => ({
        notifications: [newNotification, ...state.notifications].slice(0, 100), // Limit to 100 notifications
      }))

      toast.custom(
        (t: Toast) => (
          <NotificationToast
            t={t}
            title={notification.title}
            message={notification.message}
          />
        ),
        { duration: 4000 }
      )
    } catch (error) {
      console.error('Failed to add notification:', error)
      toast.error('Failed to display notification')
    }
  },
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    })),
  clearNotifications: () => set({ notifications: [] }),
}))
