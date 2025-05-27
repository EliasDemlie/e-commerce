// import { getCurrentUser } from "@/action/CurrentUser"
import AdminDashboard from "./Dashboard"


const page = async () => {
  // const currentUser = await getCurrentUser()
  return (
    <div>
      <AdminDashboard/>
    </div>
  )
}

export default page
