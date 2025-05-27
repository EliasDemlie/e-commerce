import { getCurrentUser } from "@/action/CurrentUser"
import UnauthorizedPage from "@/components/unauthorized"
import ConfirmationPage from "./Confirm"


const  page = async () => {
  const currentUser = await getCurrentUser()
  if(!currentUser) {
    return <div>
      <UnauthorizedPage/>
    </div>
  }
  return (
    <div>
      <ConfirmationPage/>
    </div>
  )
}

export default page
