import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { consultas } from '@/api/consultas'
import { buttonVariants } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselControls, CarouselItem } from '@/components/ui/carousel'
import { SectionHeading } from '@/components/ui/section-heading'
import {
  CartaoProduto,
  CartaoProdutoEsqueleto,
} from '@/features/produto/componentes/cartao-produto'

const ITEM = 'basis-[72%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4'

export function Destaques() {
  const { data, isPending } = useQuery(consultas.destaques())
  return (
    <section className="container-loja py-12 sm:py-16" aria-labelledby="titulo-destaques">
      <Carousel aria-labelledby="titulo-destaques">
        <SectionHeading
          eyebrow="Colhido esta semana"
          title={<span id="titulo-destaques">Destaques da colheita</span>}
          action={
            <div className="flex items-center gap-3">
              <Link to="/loja" className={buttonVariants({ variant: 'link' })}>
                Ver tudo <ArrowRight />
              </Link>
              <CarouselControls className="hidden sm:flex" />
            </div>
          }
        />
        <CarouselContent>
          {isPending
            ? Array.from({ length: 4 }, (_, i) => (
                <CarouselItem key={i} className={ITEM}>
                  <CartaoProdutoEsqueleto />
                </CarouselItem>
              ))
            : data?.map((p) => (
                <CarouselItem key={p.id} className={ITEM}>
                  <CartaoProduto produto={p} />
                </CarouselItem>
              ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}
