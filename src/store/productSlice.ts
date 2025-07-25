// src/store/productSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type Product = {
  id: number
  title: string
  price: number
  taxes: number
  ads: number
  discount: number
  total: number
  category: string
  image: string | null
}

type ProductState = {
  products: Product[]
  editingProduct: Product | null
}

const initialState: ProductState = {
  products: [],            // مهم: مفيش قراءة من localStorage هنا
  editingProduct: null,
}

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // هنستخدمها في المزج مع localStorage بعد الـ mount
    hydrate(state, action: PayloadAction<Product[]>) {
      state.products = action.payload || []
    },

    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(state.products))
      }
    },
    deleteProduct(state, action: PayloadAction<number>) {
      state.products = state.products.filter(p => p.id !== action.payload)
      if (typeof window !== 'undefined') {
        localStorage.setItem('products', JSON.stringify(state.products))
      }
    },
    deleteAllProducts(state) {
      state.products = []
      if (typeof window !== 'undefined') {
        localStorage.removeItem('products')
      }
    },
    updateProduct(state, action: PayloadAction<{ id: number; updated: Partial<Product> }>) {
      const index = state.products.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...action.payload.updated }
        if (typeof window !== 'undefined') {
          localStorage.setItem('products', JSON.stringify(state.products))
        }
      }
    },
    setEditingProduct(state, action: PayloadAction<Product>) {
      state.editingProduct = action.payload
    },
  },
})

export const { hydrate, addProduct, deleteProduct, deleteAllProducts, updateProduct, setEditingProduct } =
  productSlice.actions
export default productSlice.reducer
