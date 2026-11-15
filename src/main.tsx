import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { LazyMotion } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './rotas'
import './index.css'

const carregarMotion = () => import('./lib/motion-funcionalidades').then((m) => m.default)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* Motion em modo "lazy": as funcionalidades de animação chegam num ficheiro à parte */}
      <LazyMotion features={carregarMotion} strict>
        <RouterProvider router={router} />
      </LazyMotion>
    </QueryClientProvider>
  </StrictMode>,
)
