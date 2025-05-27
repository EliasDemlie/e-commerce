import { getCurrentUser } from '@/action/CurrentUser'
import NullData from '@/components/NullData'
import React from 'react'
import '@uploadthing/react/styles.css'
import AddProductPage from '@/components/manager/product/addProduct'

const page = async () => {
    const currentUser = await getCurrentUser()
    if (!currentUser || currentUser.role !== 'MANAGER')
      return <NullData title="Access denied!" />

    
  return (
   
        <AddProductPage/>
    
  )
}

export default page
