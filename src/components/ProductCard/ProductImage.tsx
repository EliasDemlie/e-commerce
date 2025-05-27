'use client'

import { useState } from 'react'
import Image from 'next/image'


 type SelectedImg = {
  color: string
  colorCode: string
  views: {
    front: string
    side: string
    back: string
  }
}

interface Props {
  cartProduct: {
    _id: string
    name: string
    description: string
    brand: string
    category: string
    selectedImg: SelectedImg
    qty: number
    price: number
    selectedSize?: string
  }
}
const ProductImage = ( {cartProduct}:Props ) => {
  const [selectedView, setSelectedView] = useState<'front' | 'side' | 'back'>(
    'front'
  )

  return (
    <div className="col-span-5 flex flex-col gap-2">
      <div className="relative aspect-square">
        <Image
          src={
            cartProduct.selectedImg.views[selectedView] 
          }
          alt={cartProduct.name}
          fill
          className="object-contain
        h-full
        max-h-[500px]
        min-h-[300px]
        sm:min-h-[400px]
      "
        />
      </div>

      {/* View thumbnails */}
      <div className="flex gap-2 justify-center">
        <div
          className={`relative w-16 h-16 cursor-pointer border-2 ${
            selectedView === 'front' ? 'border-teal-300' : 'border-transparent'
          }`}
          onClick={() => setSelectedView('front')}
        >
          <Image
            src={cartProduct.selectedImg.views.front}
            alt={`${cartProduct.name} front view`}
            fill
            className="object-contain"
          />
        </div>

        <div
          className={`relative w-16 h-16 cursor-pointer border-2 ${
            selectedView === 'side' ? 'border-teal-300' : 'border-transparent'
          }`}
          onClick={() => setSelectedView('side')}
        >
          <Image
            src={cartProduct.selectedImg.views.side}
            alt={`${cartProduct.name} side view`}
            fill
            className="object-contain"
          />
        </div>

        <div
          className={`relative w-16 h-16 cursor-pointer border-2 ${
            selectedView === 'back' ? 'border-teal-300' : 'border-transparent'
          }`}
          onClick={() => setSelectedView('back')}
        >
          <Image
            src={cartProduct.selectedImg.views.back }
            alt={`${cartProduct.name} back view`}
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default ProductImage
