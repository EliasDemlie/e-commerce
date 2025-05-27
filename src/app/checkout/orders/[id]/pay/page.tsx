import { getCurrentUser } from "@/action/CurrentUser"
import PaymentPage from "./Payment"
import UnauthorizedPage from "@/components/unauthorized"


const  page = async () => {
  const currentUser = await getCurrentUser()
  if(!currentUser) {
    return <div>
      <UnauthorizedPage/>
    </div>
  }
  return (
    <div>
      <PaymentPage/>
    </div>
  )
}

export default page
