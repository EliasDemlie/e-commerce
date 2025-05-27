import type { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import type { NextApiResponse } from 'next'
import { Notification } from '@/type/notification'

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: HTTPServer & {
      io?: SocketIOServer
    }
  }
}

let io: SocketIOServer | undefined

export const initializeSocket = (server: HTTPServer) => {
  if (!io) {
    io = new SocketIOServer(server, {
      path: '/api/socket',
      cors: {
        origin:
          process.env.NODE_ENV === 'production'
            ? process.env.NEXT_PUBLIC_APP_URL
            : ['http://localhost:3000', 'http://localhost:3001'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      transports: ['websocket', 'polling'],
    })

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id)

      socket.emit('notification', {
        type: 'system',
        title: 'Connected',
        message: 'Welcome to the real-time notification system!',
        timestamp: new Date().toISOString(),
      })

      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`)
        console.log(`User ${userId} joined their notification room`)
      })

      socket.on('send-notification', (data) => {
        console.log('Broadcasting notification:', data)
        io?.emit('notification', {
          ...data,
          timestamp: new Date().toISOString(),
        })
      })

      socket.on('disconnect', (reason) => {
        console.log('Client disconnected:', socket.id, 'Reason:', reason)
      })
    })

    console.log('Socket.IO server initialized')
  }

  return io
}

export const getSocketIO = () => io

export const emitNotification = (notification: Notification, userId?: string) => {
  if (io) {
    if (userId) {
      io.to(`user-${userId}`).emit('notification', notification)
    } else {
      io.emit('notification', notification)
    }
  }
}
