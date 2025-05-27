import React from 'react'
import Header from './NavBar'
import { getCurrentUser } from '@/action/CurrentUser'
const Nav = async () => {
  const currentUser = await getCurrentUser()
  return (
    <div>
      <Header currentUser={currentUser} />
    </div>
  )
}

export default Nav
