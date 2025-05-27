//import WrapForm from '@/components/ui/WrapForm'
import { Toaster } from '@/components/ui/toaster'
import Checkout from './Checkout'
import { getCurrentUser } from '@/action/CurrentUser'
import UnauthorizedPage from '@/components/unauthorized'

const CheckoutPage = async () => {
  const currentUser = await getCurrentUser()
  if(!currentUser) {
    return <div>
      <UnauthorizedPage/>
    </div>
  }
  return (
    <div className="p-8 bg-slate-100">
         <Toaster/>
        <Checkout />
      
    </div>
  )
}

export default CheckoutPage
