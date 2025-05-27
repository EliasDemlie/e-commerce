'use client'

import type React from 'react'

import { useRouter, useSearchParams } from 'next/navigation'
import { FaShoppingCart, FaBell } from 'react-icons/fa'
import { useState, useEffect } from 'react'

import Heading from '../input/Heading'
import UserMenu from './UserMenu'
import { useCart } from '@/hooks/useCart'

import type { SafeUser } from '@/type/SafeUser'
import type { Product } from '@/type/Product'
import { AdvancedSearchBar } from '../search/SearchBar'

interface HeaderProps {
  currentUser: SafeUser | null
  products?: Product[] | null
}

const Header: React.FC<HeaderProps> = ({ currentUser, products = [] }) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { cartProducts } = useCart()
  const [cartCount, setCartCount] = useState(0)

  // Get search query from URL
  const searchQuery = searchParams?.get('q') || ''

  useEffect(() => {
    const totalQty = cartProducts?.reduce((acc, item) => acc + item.qty, 0) || 0
    setCartCount(totalQty)
  }, [cartProducts])

  const handleClick = () => {
    router.push('/')
  }

  return (
    <header className="bg-slate-300 fixed top-0 left-0 right-0 z-50 h-16 flex items-center justify-between px-4 shadow-md">
      <button onClick={handleClick}>
        <Heading text="Gulit" gradient level={4} />
      </button>

      <div className="w-40 sm:w-80">
        <AdvancedSearchBar
          initialQuery={searchQuery}
          products={products || []}
        />
      </div>

      <div className="flex space-x-4 flex-shrink-0 justify-between">
        <button onClick={() => router.push('/cart')} className="relative">
          <FaShoppingCart className="text-2xl text-lime-600" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-1 py-0.5">
              {cartCount}
            </span>
          )}
        </button>

        <button onClick={() => router.push('/notifications')}>
          <FaBell className="text-2xl text-blue-500" />
        </button>

        <UserMenu currentUser={currentUser} />
      </div>
    </header>
  )
}

export default Header
