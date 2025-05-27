import { IconType } from 'react-icons'

interface ButtonProps {
  label: string
  disabled?: boolean
  outline?: boolean
  small?: boolean
  custom?: string
  icon?: IconType
  iconColor?: string
  size?: 'small' | 'medium' | 'large'
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const Button: React.FC<ButtonProps> = ({
  label,
  disabled,
  
  outline,
  small,
  custom,
  size,
  icon: Icon,
  iconColor = 'black',
  onClick,
}) => {
  const sizeClasses = {
    small: 'px-2 py-1 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg',
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        disabled:opacity-80
        disabled:cursor-not-allowed
        rounded-md
        hover:opacity-75
        w-full
        border-slate-700
        transition
        flex
        items-center
        justify-center
        gap-2
        ${outline ? 'bg-orange-500' : 'bg-white'}
        ${outline ? 'text-white' : 'text-slate-700'}
        ${small ? 'text-sm font-light' : 'text-md font-semibold'}
        ${small ? 'py-1 px-2 border-[1px]' : 'py-3 px-4 border-[2px]'}
        ${custom || ''}
        ${size ? sizeClasses[size] : ''}
      `}
    >
      {Icon && <Icon className="text-xl" style={{ color: iconColor }} />}
      {label}
    </button>
  )
}

export default Button
