'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect } from 'react'

interface RoleGuardProps {
  children: ReactNode
  allowedRoles: ('USER' | 'ADMIN' | 'MANAGER')[]
  fallback?: ReactNode
}

export default function RoleGuard({
  children,
  allowedRoles,
  fallback,
}: RoleGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = session?.user?.role

      if (!userRole || !allowedRoles.includes(userRole)) {
        router.push('/unauthorized')
      }
    } else if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, session, router, allowedRoles])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    )
  }

  if (status === 'authenticated') {
    const userRole = session?.user?.role

    if (userRole && allowedRoles.includes(userRole)) {
      return <>{children}</>
    }
  }

  return fallback ? <>{fallback}</> : null
}
