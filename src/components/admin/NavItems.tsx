import React from 'react'
import { IconType } from 'react-icons'
interface NaveItemsProps{
    selected?:boolean
    label:string
    icon:IconType

}
const NavItems:React.FC<NaveItemsProps> = ({selected,label,icon:Icon}) => {
  return (
    <div className={`flex items-center justify-center gap-1 p-2
    border-b-2 hover:text-slate-800 transition cursor-pointer ${selected? 
    'border-b-slate-800  text-slate-800':'transparent text-slate-500'}`}>
      <Icon size={20}/>
      <div className='font-medium text-center break-normal'>{label}</div>
    </div>
  )
}

export default NavItems
