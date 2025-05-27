import { getCurrentUser } from '@/action/CurrentUser'
import NullData from '@/components/NullData'
import Manager from './Manager'


const page = async () => {
  const currentUser = await getCurrentUser()
  if (!currentUser || currentUser.role !== 'MANAGER')
    return <NullData title="Access denied!" />

  return <Manager />
}

export default page
