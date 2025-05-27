'use client'

import { useState } from 'react'
import Link from 'next/link'
import NavItems from './NavItems'

import { MdDashboard, MdMenu, MdClose } from 'react-icons/md'
import { usePathname } from 'next/navigation'
import { AdminSidebar } from './adminSideBar'

const AdminNav = () => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full shadow-sm border-b-[1px]  relative">
      <div className="hidden md:flex pl-4 md:gap-12 mt-[-29] bg-gray-300">
        <button className="  text-2xl" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <MdClose /> : <MdMenu />}
        </button>
        <Link href="/admin">
          <NavItems
            label="Dashboard"
            icon={MdDashboard}
            selected={pathname === '/admin'}
          />
        </Link>
      </div>
      {isOpen && (
        <div className=" top-50 left-0 h-full w-64 bg-white shadow-lg transition-transform duration-600">
          <AdminSidebar />
        </div>
      )}
    </div>
  )
}

export default AdminNav
