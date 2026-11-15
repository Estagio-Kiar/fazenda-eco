import { useCallback, useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/lib/utils'
import type { UseEmblaCarouselType } from 'embla-carousel-react'

type Api = UseEmblaCarouselType[1]

/** Galeria de fotos com miniaturas (Embla). */
export function Galeria({ imagens, nome }: { imagens: string[]; nome: string }) {
  const [api, setApi] = useState<Api>()
  const [actual, setActual] = useState(0)

  const aoSelecionar = useCallback((a: Api) => a && setActual(a.selectedScrollSnap()), [])
  useEffect(() => {
    if (!api) return
    api.on('select', aoSelecionar)
    return () => {
      api.off('select', aoSelecionar)
    }
  }, [api, aoSelecionar])

  return (
    <div>
      <Carousel setApi={setApi} aria-label={`Fotos de ${nome}`}>
        <CarouselContent>
          {imagens.map((src, i) => (
            <CarouselItem key={src}>
              <img
                src={src}
                alt={`${nome} — foto ${i + 1} de ${imagens.length}`}
                className="aspect-square w-full rounded-2xl bg-nevoa object-cover ring-1 ring-menta"
                draggable={false}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      {imagens.length > 1 && (
        <div className="mt-3 flex gap-2" role="tablist" aria-label="Escolher foto">
          {imagens.map((src, i) => (
            <button
              key={src}
              type="button"
              role="tab"
              aria-selected={i === actual}
              aria-label={`Foto ${i + 1}`}
              onClick={() => api?.scrollTo(i)}
              className={cn(
                'size-16 overflow-hidden rounded-lg ring-2 transition sm:size-20',
                i === actual ? 'ring-primary' : 'opacity-70 ring-transparent hover:opacity-100',
              )}
            >
              <img src={src} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
