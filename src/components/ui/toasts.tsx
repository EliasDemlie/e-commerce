import { toast } from 'react-toastify'
import { MdCheckCircle } from 'react-icons/md'


export const showCustomToast = (message: string, bgColor = 'bg-green-500') => {
  toast(
     () => (

      <div className={`flex items-center p-3 text-white rounded ${bgColor}`}>
        <MdCheckCircle className="mr-2 text-white" size={20} />
        <span>{message}</span>
      </div>
    ),
    {
      position: 'top-right',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      closeButton: false,
    }
  )
}
