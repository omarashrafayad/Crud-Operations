// src/store/Providers.tsx
'use client'

import { ReactNode, useEffect } from 'react'
import { Provider } from 'react-redux'
import { store } from './store'
import { hydrate } from './productSlice'

export default function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('products') || '[]')
      store.dispatch(hydrate(data))
    } catch { /* ignore */ }
  }, [])

  return <Provider store={store}>{children}</Provider>
}
