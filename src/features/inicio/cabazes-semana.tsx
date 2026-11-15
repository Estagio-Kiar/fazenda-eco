import { useQuery } from '@tanstack/react-query'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { consultas } from '@/api/consultas'
import { buttonVariants } from '@/components/ui/button'
import { SectionHeading } from '@/components/ui/section-heading'
import { CartaoCabaz, CartaoCabazEsqueleto } from '@/features/cabazes/cartao-cabaz'

export function CabazesSemana() {
  const { data, isPending } = useQuery(consultas.cabazes())
  return (
    <section className="bg-nevoa py-12 sm:py-16" aria-labelledby="titulo-cabazes">
      <div className="container-loja">
        <SectionHeading
          eyebrow="Poupe e simplifique"
          title={<span id="titulo-cabazes">Cabazes da semana</span>}
          description="Seleccionados pela equipa da fazenda com o que está melhor na época."
          action={
            <Link to="/cabazes" className={buttonVariants({ variant: 'link' })}>
              Todos os cabazes <ArrowRight />
            </Link>
          }
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isPending
            ? Array.from({ length: 3 }, (_, i) => <CartaoCabazEsqueleto key={i} />)
            : data?.map((c) => <CartaoCabaz key={c.id} cabaz={c} />)}
        </div>
      </div>
    </section>
  )
}
