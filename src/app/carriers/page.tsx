import { getCurrentUser } from "@/action/CurrentUser"
import UnauthorizedPage from "@/components/unauthorized"
import CarrierProfilePage from "./Carrier"



const page = async () => {
  
  const currentUser = await getCurrentUser()

  if (!currentUser || !currentUser.role.includes('CARRIER')) {
    return <UnauthorizedPage/>
  }
  return (
    <div>
      <CarrierProfilePage currentUser={currentUser} />
    </div>
  )
}

export default page
