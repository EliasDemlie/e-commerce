import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartProduct } from '@/type/CartProduct'

const loadCartFromStorage = (): CartProduct[] => {
  if (typeof window === 'undefined') return []
  const storedCart = localStorage.getItem('cart')
  return storedCart ? JSON.parse(storedCart) : []
}

interface CartState {
  cartProducts: CartProduct[]
}

const initialState: CartState = {
  cartProducts: loadCartFromStorage(),
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartProduct>) => {
      const existingItem = state.cartProducts.find(
        (p) => p.id === action.payload.id
      )

      if (existingItem) {
        existingItem.qty += action.payload.qty
      } else {
        state.cartProducts.push(action.payload)
      }

      localStorage.setItem('cart', JSON.stringify(state.cartProducts))
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartProducts = state.cartProducts.filter(
        (p) => p.id !== action.payload
      )
      localStorage.setItem('cart', JSON.stringify(state.cartProducts))
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; qty: number }>
    ) => {
      const product = state.cartProducts.find(
        (p) => p.id === action.payload.productId
      )
      if (product) product.qty = action.payload.qty
      localStorage.setItem('cart', JSON.stringify(state.cartProducts))
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions
export default cartSlice.reducer
