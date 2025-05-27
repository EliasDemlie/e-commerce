'use client'
import { IconType } from "react-icons"

interface CategoryProps {

    label: string
    selected?: boolean
    icon: IconType
    onClick: (value: string) => void
    }
const CategoryInput:React.FC<CategoryProps> = ({
    label,
    selected,
    icon:Icon,
    onClick
}) => {
  return (
    <div onClick={()=>onClick(label)} className={`flex flex-col gap-2 p-4 rounded-xl border-2 hover:border-black transition cursor-pointer ${selected ? 'border-black' : 'border-neutral-200'}`}>
      <Icon size={30} className="text-neutral-600" />
      <div className="font-semibold text-sm">{label}</div>
    </div>
  )
}

export default CategoryInput
