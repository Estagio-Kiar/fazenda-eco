import { useQuery } from '@tanstack/react-query'
import { consultas } from '@/api/consultas'
import { Carousel, CarouselContent, CarouselControls, CarouselItem } from '@/components/ui/carousel'
import { SectionHeading } from '@/components/ui/section-heading'
import { CartaoProduto, CartaoProdutoEsqueleto } from './componentes/cartao-produto'

const ITEM = 'basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4'

export function Relacionados({ slug }: { slug: string }) {
  const { data, isPending } = useQuery(consultas.relacionados(slug))
  if (!isPending && !data?.length) return null
  return (
    <section className="mt-16" aria-labelledby="titulo-relacionados">
      <Carousel>
        <SectionHeading
          title={<span id="titulo-relacionados">Também pode gostar</span>}
          action={<CarouselControls className="hidden sm:flex" />}
        />
        <CarouselContent>
          {isPending
            ? Array.from({ length: 4 }, (_, i) => (
                <CarouselItem key={i} className={ITEM}>
                  <CartaoProdutoEsqueleto />
                </CarouselItem>
              ))
            : data!.map((p) => (
                <CarouselItem key={p.id} className={ITEM}>
                  <CartaoProduto produto={p} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
