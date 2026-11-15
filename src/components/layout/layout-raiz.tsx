import { m } from 'motion/react'
import { useEffect } from 'react'
import { ScrollRestoration, useLocation, useOutlet } from 'react-router'
import { Toaster } from '@/components/ui/sonner'
import { Cabecalho } from './cabecalho'
import { Rodape } from './rodape'

/** Leva até à secção quando o endereço tem #âncora (ex.: /#sobre). */
function useAncora() {
  const { hash, pathname } = useLocation()
  useEffect(() => {
    if (!hash) return
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50)
    return () => clearTimeout(t)
  }, [hash, pathname])
}

export function LayoutRaiz() {
  const local = useLocation()
  const outlet = useOutlet()
  useAncora()

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-md bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
      >
        Saltar para o conteúdo
      </a>
      <Cabecalho />
      <m.main
        id="conteudo"
        key={local.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        className="flex-1"
      >
        {outlet}
      </m.main>
      <Rodape />
      <Toaster />
      <ScrollRestoration />
    </div>
  )
}
