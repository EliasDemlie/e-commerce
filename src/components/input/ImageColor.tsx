'use client'
import Image from 'next/image'
import { FC } from 'react'

interface ImageColorProps {
  color: string
  colorCode: string
  image: string | null
  selected?: boolean
  onClick: (value: string) => void
}

const ImageColorInput: FC<ImageColorProps> = ({
  color,
  colorCode,
  image,
  selected,
  onClick,
}) => {
  return (
    <div
      onClick={() => onClick(color)}
      className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 hover:border-black transition cursor-pointer ${
        selected ? 'border-black' : 'border-neutral-200'
      }`}
      style={{ backgroundColor: colorCode }}
    >
      {image ? (
        <Image
          src={image}
          alt={color}
          className="w-16 h-16 object-cover rounded-full"
        />
      ) : (
        <div className="w-16 h-16 bg-white border-2 border-gray-200 rounded-full" />
      )}
      <div className="font-semibold text-sm text-neutral-600">{color}</div>
    </div>
  )
}

export default ImageColorInput
