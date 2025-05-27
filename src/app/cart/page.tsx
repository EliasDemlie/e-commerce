
import { getCurrentUser } from "@/action/CurrentUser"
import Cart from "./CartPage"

const  CartPage =  async () => {
  const currentUser = await getCurrentUser()
  return (
    <div>
    <Cart currentUser={currentUser}/>
    </div>
  )
}

export default CartPage
