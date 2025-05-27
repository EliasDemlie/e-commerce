'use client'

import type React from 'react'

import { useState } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import type { SafeUser } from '@/type/SafeUser'
import {
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  UserPlus,
  LogIn,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button2'

interface UserMenuProps {
  currentUser: SafeUser | null
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const image = currentUser?.image
  const email = currentUser?.email
  const name = currentUser?.name
  const fallbackLetter =
    email?.[0]?.toUpperCase() ?? name?.[0]?.toUpperCase() ?? '?'

  const handleMenuClick = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-10 rounded-full p-0 data-[state=open]:bg-accent bg-sky-600"
        >
          <Avatar className="h-9 w-9 border-2 border-primary/10 transition-all hover:border-primary/20">
            <AvatarImage src={image || ''} alt={name || 'User'} />
            <AvatarFallback className="bg-primary/5 text-primary">
              {fallbackLetter}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full bg-background text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56 p-2 bg-white">
        {currentUser ? (
          <>
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium leading-none">
                {name || email} {currentUser.role}
              </p>
              {name && email && (
                <p className="text-xs leading-none text-muted-foreground">
                  {email}
                </p>
              )}
            </div>
            <DropdownMenuSeparator />
            <hr className="bg-slate-400 mb-2" />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 p-2 text-sm hover:bg-slate-300 rounded-lg"
              onClick={() => handleMenuClick('/profile')}
            >
              <User className="h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 p-2 text-sm hover:bg-slate-300 rounded-lg"
              onClick={() => handleMenuClick('/checkout/orders/myorder')}
            >
              <ShoppingBag className="h-4 w-4" />
              <span>My Orders</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 p-2 text-sm text-destructive focus:text-destructive hover:bg-slate-300 rounded-lg"
              onClick={() => {
                signOut()
                setOpen(false)
              }}
            >
              <LogOut className="h-4 w-4" />
              <span className="text-red-700">Logout</span>
            </DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 p-2 text-sm hover:bg-slate-300 rounded-lg"
              onClick={() => handleMenuClick('/signin')}
            >
              <LogIn className="h-4 w-4" />
              <span className="text-red-700">Login</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="flex cursor-pointer items-center gap-2 p-2 text-sm hover:bg-slate-300 rounded-lg"
              onClick={() => handleMenuClick('/signup')}
            >
        
        
              <UserPlus className="h-4 w-4" />
              <span className="text-red-700">Register</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserMenu
