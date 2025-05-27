import React from 'react'
import Login from './LoginPage'

import { getCurrentUser } from '@/action/CurrentUser'


const page = async () => {
  const currentUser = await getCurrentUser()
  return (
 
      <Login currentUser={currentUser} />

  )
}

export default page
