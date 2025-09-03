import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router/Router'
import AuthProvider from './contaxts/AuthContext/AuthProvider'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './contaxts/CartContext/CartContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider  client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Toaster
            position="top-right"
            reverseOrder={false}
          />
          <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
