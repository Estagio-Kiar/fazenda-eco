import { Box, ImageOff, Minus, Plus, RotateCcw, Rotate3d } from 'lucide-react'
import { lazy, Suspense, useCallback, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import type { Modelo3D } from '@/api/tipos'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ControlosCena } from './cena-3d'
import { LimiteErro3D } from './erro-3d'
import { devePouparDados, formatarTamanho, temWebGL } from './suporte'
import { BotaoAR } from './visualizador-ar'

const Cena3D = lazy(() => import('./cena-3d'))

type Estado = 'poster' | 'a-carregar' | 'pronto' | 'erro' | 'sem-webgl'

type Props = {
  modelo: Modelo3D
  nome: string
  /**
   * 'interacao' (por omissão): mostra o poster e só carrega o 3D quando o cliente toca.
   * 'visivel': carrega sozinho quando aparece no ecrã (usado no Hero), excepto se o cliente poupa dados.
   */
  carregar?: 'interacao' | 'visivel'
  mostrarAR?: boolean
  className?: string
}

export function Visualizador3D({
  modelo,
  nome,
  carregar = 'interacao',
  mostrarAR = true,
  className,
}: Props) {
  const [estado, setEstado] = useState<Estado>(() => (temWebGL() ? 'poster' : 'sem-webgl'))
  const contentor = useRef<HTMLDivElement>(null)
  const controlos = useRef<ControlosCena | null>(null)

  const activar = useCallback(() => setEstado((e) => (e === 'poster' ? 'a-carregar' : e)), [])

  // Carregamento automático quando visível (Hero)
  useEffect(() => {
    if (carregar !== 'visivel' || estado !== 'poster' || devePouparDados()) return
    const el = contentor.current
    if (!el) return
    // Safari ainda não tem requestIdleCallback
    const temIdle = typeof window.requestIdleCallback === 'function'
    let idle = 0
    const obs = new IntersectionObserver(([entrada]) => {
      if (!entrada.isIntersecting) return
      obs.disconnect()
      idle = temIdle
        ? window.requestIdleCallback(activar, { timeout: 1500 })
        : window.setTimeout(activar, 300)
    })
    obs.observe(el)
    return () => {
      obs.disconnect()
      if (temIdle) window.cancelIdleCallback(idle)
      else window.clearTimeout(idle)
    }
  }, [carregar, estado, activar])

  const aoPronto = useCallback(() => setEstado('pronto'), [])
  const aoControlos = useCallback((c: ControlosCena) => (controlos.current = c), [])

  const teclado = (e: KeyboardEvent) => {
    const c = controlos.current
    if (!c) return
    const accoes: Record<string, () => void> = {
      ArrowLeft: () => c.rodar(-0.3),
      ArrowRight: () => c.rodar(0.3),
      '+': c.aproximar,
      '=': c.aproximar,
      '-': c.afastar,
      '0': c.repor,
    }
    const accao = accoes[e.key]
    if (accao) {
      e.preventDefault()
      accao()
    }
  }

  const com3D = estado === 'a-carregar' || estado === 'pronto'
  const tamanho = formatarTamanho(modelo.tamanho)

  return (
    <div
      ref={contentor}
      className={cn(
        'relative isolate aspect-square w-full overflow-hidden rounded-2xl bg-nevoa ring-1 ring-menta',
        className,
      )}
    >
      {/* Poster: aparece logo e fica até o modelo estar pronto */}
      <img
        src={modelo.posterUrl}
        alt={`${nome} — imagem ilustrativa`}
        className={cn(
          'absolute inset-0 size-full object-contain transition-opacity duration-500',
          estado === 'pronto' && 'pointer-events-none opacity-0',
        )}
        draggable={false}
      />

      {com3D && (
        <div
          className="absolute inset-0 cursor-grab touch-none outline-none focus-visible:ring-[3px] focus-visible:ring-ring/40 active:cursor-grabbing"
          tabIndex={0}
          aria-label={`Visualizador 3D de ${nome}. Use as setas para rodar, + e - para zoom, 0 para repor.`}
          onKeyDown={teclado}
        >
          <LimiteErro3D onErro={() => setEstado('erro')}>
            <Suspense fallback={null}>
              <Cena3D
                url={modelo.modeloUrl}
                nome={nome}
                onPronto={aoPronto}
                onControlos={aoControlos}
              />
            </Suspense>
          </LimiteErro3D>
        </div>
      )}

      {/* Botão inicial */}
      {estado === 'poster' && (
        <button
          type="button"
          onClick={activar}
          className="group absolute inset-0 flex items-end justify-center p-4 outline-none"
          aria-label={`Ver ${nome} em 3D`}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-md transition group-hover:bg-campo-escuro group-focus-visible:ring-[3px] group-focus-visible:ring-ring/40">
            <Box className="size-4" />
            Ver em 3D
            {tamanho && <span className="font-normal opacity-80">· {tamanho}</span>}
          </span>
        </button>
      )}

      {estado === 'a-carregar' && (
        <div className="pointer-events-none absolute inset-x-0 bottom-4 flex justify-center">
          <span className="rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-floresta shadow">
            A preparar o 3D…
          </span>
        </div>
      )}

      {/* Barra de controlos quando o 3D está pronto */}
      {estado === 'pronto' && (
        <>
          <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-salvia bg-background/90 px-2.5 py-1 text-xs font-medium text-floresta backdrop-blur">
              <Rotate3d className="size-3.5" /> Arraste para rodar
            </span>
            <div className="pointer-events-auto flex gap-1">
              <BotaoIcone rotulo="Aproximar" onClick={() => controlos.current?.aproximar()}>
                <Plus />
              </BotaoIcone>
              <BotaoIcone rotulo="Afastar" onClick={() => controlos.current?.afastar()}>
                <Minus />
              </BotaoIcone>
              <BotaoIcone rotulo="Repor vista" onClick={() => controlos.current?.repor()}>
                <RotateCcw />
              </BotaoIcone>
            </div>
          </div>
          {mostrarAR && (
            <div className="absolute right-3 bottom-3">
              <BotaoAR modelo={modelo} nome={nome} />
            </div>
          )}
        </>
      )}

      {(estado === 'erro' || estado === 'sem-webgl') && (
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-lg bg-background/95 px-3 py-2 text-xs text-muted-foreground shadow-sm">
          <ImageOff className="size-4 shrink-0 text-primary" />
          {estado === 'sem-webgl'
            ? 'O seu navegador não mostra 3D. Veja as fotos do produto.'
            : 'Não foi possível carregar o 3D. Veja as fotos do produto.'}
        </div>
      )}
    </div>
  )
}

function BotaoIcone({
  rotulo,
  onClick,
  children,
}: {
  rotulo: string
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      variant="outline"
      size="icon-sm"
      aria-label={rotulo}
      title={rotulo}
      onClick={onClick}
      className="rounded-full bg-background/90 backdrop-blur"
    >
      {children}
    </Button>
  )
}
