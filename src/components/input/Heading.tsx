import React from 'react'

interface HeadingProps {
  text: string
  level?: 1 | 2 | 3 | 4 | 5 | 6
  className?: string
  gradient?: boolean
  underline?: boolean
}


const Heading: React.FC<HeadingProps> = ({
  text,
  level = 1,
  className = '',
  gradient = false,
  underline = false,
}) => {
  const sizeMap: Record<number, string> = {
    1: 'text-5xl md:text-6xl',
    2: 'text-4xl md:text-5xl',
    3: 'text-3xl md:text-4xl text-center',
    4: 'text-2xl md:text-3xl',
    5: 'text-xl md:text-2xl',
    6: 'text-sm md:text-sm',
  }

  const baseStyles = `font-bold tracking-wide transition-transform transform hover:scale-105 
    ${sizeMap[level] || 'text-base'} ${className}`

  const gradientStyle = gradient
    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text'
    : ''

  const underlineStyle = underline
    ? 'underline decoration-wavy decoration-blue-500'
    : ''

  const Tag: React.ElementType = `h${level}`

  return (
    <Tag className={`${baseStyles} ${gradientStyle} ${underlineStyle}`}>
      {text}
    </Tag>
  )
}

export default Heading
