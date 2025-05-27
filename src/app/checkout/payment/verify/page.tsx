import { getCurrentUser } from "@/action/CurrentUser"
import UnauthorizedPage from "@/components/unauthorized"
import VerifyPaymentPage from "./VerifyPayment"


const page = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser) { 
    return <div>
      <UnauthorizedPage />
    </div>
  }
  return (
    <div>
      <VerifyPaymentPage/>
    </div>
  )
}

export default page
