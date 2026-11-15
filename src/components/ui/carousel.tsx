import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { createContext, use, useCallback, useEffect, useState, type ComponentProps } from 'react'
import { cn } from '@/lib/utils'

type Api = UseEmblaCarouselType[1]
type Opcoes = Parameters<typeof useEmblaCarousel>[0]

type Ctx = {
  viewportRef: UseEmblaCarouselType[0]
  api: Api
  anterior: () => void
  seguinte: () => void
  podeAnterior: boolean
  podeSeguinte: boolean
}

const CarouselContext = createContext<Ctx | null>(null)

export function useCarousel() {
  const ctx = use(CarouselContext)
  if (!ctx) throw new Error('useCarousel tem de estar dentro de <Carousel>')
  return ctx
}

export function Carousel({
  opts,
  setApi,
  className,
  children,
  ...props
}: ComponentProps<'section'> & { opts?: Opcoes; setApi?: (api: Api) => void }) {
  const [viewportRef, api] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    ...opts,
  })
  const [podeAnterior, setPodeAnterior] = useState(false)
  const [podeSeguinte, setPodeSeguinte] = useState(false)

  const actualizar = useCallback((a: Api) => {
    if (!a) return
    setPodeAnterior(a.canScrollPrev())
    setPodeSeguinte(a.canScrollNext())
  }, [])

  useEffect(() => {
    if (!api) return
    setApi?.(api)
    const raf = requestAnimationFrame(() => actualizar(api))
    api.on('reInit', actualizar).on('select', actualizar)
    return () => {
      cancelAnimationFrame(raf)
      api.off('reInit', actualizar).off('select', actualizar)
    }
  }, [api, setApi, actualizar])

  return (
    <CarouselContext
      value={{
        viewportRef,
        api,
        anterior: () => api?.scrollPrev(),
        seguinte: () => api?.scrollNext(),
        podeAnterior,
        podeSeguinte,
      }}
    >
      <section
        aria-roledescription="carrossel"
        className={cn('relative', className)}
        onKeyDownCapture={(e) => {
          if (e.key === 'ArrowLeft') api?.scrollPrev()
          if (e.key === 'ArrowRight') api?.scrollNext()
        }}
        {...props}
      >
        {children}
      </section>
    </CarouselContext>
  )
}

export function CarouselContent({ className, ...props }: ComponentProps<'div'>) {
  const { viewportRef } = useCarousel()
  return (
    <div ref={viewportRef} className="overflow-hidden">
      <div className={cn('-ml-4 flex touch-pan-y', className)} {...props} />
    </div>
  )
}

export function CarouselItem({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      role="group"
      aria-roledescription="diapositivo"
      className={cn('min-w-0 shrink-0 grow-0 basis-full pl-4', className)}
      {...props}
    />
  )
}

export function CarouselControls({ className }: { className?: string }) {
  const { anterior, seguinte, podeAnterior, podeSeguinte } = useCarousel()
  const btn =
    'flex size-9 items-center justify-center rounded-full border border-salvia bg-background text-floresta shadow-sm transition hover:bg-nevoa disabled:opacity-35 disabled:cursor-not-allowed'
  if (!podeAnterior && !podeSeguinte) return null
  return (
    <div className={cn('flex gap-2', className)}>
      <button
        type="button"
        className={btn}
        onClick={anterior}
        disabled={!podeAnterior}
        aria-label="Anterior"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        className={btn}
        onClick={seguinte}
        disabled={!podeSeguinte}
        aria-label="Seguinte"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  )
}
