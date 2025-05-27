'use client'

import { CartProduct } from '@/type/CartProduct'

interface SetQtyProps {
  cartCounter?: boolean
  cartProduct: CartProduct
  handleQtyIncrease: () => void
  handleQtyDecrease: () => void
  showLabel?: boolean // 👈 New prop to control label visibility
}

const SetQuantity: React.FC<SetQtyProps> = ({
  cartCounter,
  cartProduct,
  handleQtyIncrease,
  handleQtyDecrease,
  showLabel = true, 
}) => {
  return (
    <div className="flex gap-8 items-center">
      {cartCounter || !showLabel ? null : (
        <div className="font-semibold">Quantity:</div>
      )}
      <div className="flex gap-5">
        <button
          onClick={handleQtyDecrease}
          className="border-[1.2px] border-slate-300 px-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          -
        </button>
        <div>{cartProduct.qty}</div>
        <button
          onClick={handleQtyIncrease}
          className="border-[1.2px] border-slate-300 px-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default SetQuantity
