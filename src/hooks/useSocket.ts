'use client'

import { useEffect, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'

export function useSocket(): Socket | null {
  const socketRef = useRef<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'

    socketRef.current = io(socketUrl, {
      path: '/api/socket',
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    })

    const socket = socketRef.current

    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
      setIsConnected(true)
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
      setIsConnected(false)
    })

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
      setIsConnected(false)
    })
    if (isConnected) {
      console.log('Socket is connected:', socket.id)
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
        setIsConnected(false)
      }
    }
  }, [])

  return socketRef.current
}

export function useSocketConnection() {
  const socket = useSocket()
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (socket) {
      const handleConnect = () => setIsConnected(true)
      const handleDisconnect = () => setIsConnected(false)

      socket.on('connect', handleConnect)
      socket.on('disconnect', handleDisconnect)

      setIsConnected(socket.connected)

      return () => {
        socket.off('connect', handleConnect)
        socket.off('disconnect', handleDisconnect)
      }
    }
  }, [socket])

  return { socket, isConnected }
}
