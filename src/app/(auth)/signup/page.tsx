import React from 'react'
import Register from './RegisterPage'
import { getCurrentUser } from '@/action/CurrentUser'

const page = async () => {
  const currentUser = await getCurrentUser()
  return <Register currentUser={currentUser} />
}

export default page
