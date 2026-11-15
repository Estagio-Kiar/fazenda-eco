import { Box, ShoppingBasket, Sprout, Truck } from 'lucide-react'
import { SectionHeading } from '@/components/ui/section-heading'

const PASSOS = [
  {
    icone: Box,
    titulo: 'Veja em 3D',
    texto: 'Rode e aproxime cada produto. No telemóvel, veja-o em cima da sua mesa (AR).',
  },
  {
    icone: ShoppingBasket,
    titulo: 'Faça a encomenda',
    texto: 'Escolha a quantidade ao quilo ou à unidade, ou um cabaz pronto.',
  },
  {
    icone: Sprout,
    titulo: 'Colhemos para si',
    texto: 'A colheita é feita na véspera da entrega, para chegar mesmo fresco.',
  },
  {
    icone: Truck,
    titulo: 'Entregamos em Luanda',
    texto: 'Escolha a zona de entrega ou levante na fazenda sem custos.',
  },
]

export function ComoFunciona() {
  return (
    <section
      id="como-funciona"
      className="container-loja scroll-mt-28 py-12 sm:py-16"
      aria-labelledby="titulo-como"
    >
      <SectionHeading
        title={<span id="titulo-como">Como funciona</span>}
        className="justify-center text-center [&>div]:mx-auto"
      />
      <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {PASSOS.map(({ icone: Icone, titulo, texto }, i) => (
          <li key={titulo} className="relative rounded-2xl border border-menta bg-card p-5">
            <span
              className="absolute top-4 right-5 text-3xl font-extrabold text-menta"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-menta text-primary">
              <Icone className="size-5" />
            </div>
            <h3 className="font-semibold">{titulo}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{texto}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
