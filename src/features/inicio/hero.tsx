import { ArrowRight, Leaf, Truck } from 'lucide-react'
import { m } from 'motion/react'
import { Link } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { Visualizador3D } from '@/features/produto-3d/visualizador-3d'

const MODELO_HERO = {
  modeloUrl: '/modelos/tomate.glb',
  posterUrl: '/modelos/tomate-poster.svg',
  tamanho: 122_428,
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-nevoa to-background">
      <div className="container-loja grid items-center gap-10 py-10 sm:py-14 lg:grid-cols-2 lg:gap-16 lg:py-20">
        <m.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        >
          <Badge className="mb-5">
            <Leaf /> Do campo para a sua mesa
          </Badge>
          <h1 className="text-4xl leading-[1.05] font-extrabold sm:text-5xl lg:text-6xl">
            Produtos frescos, <span className="text-primary">vistos em 3D.</span>
          </h1>
          <p className="mt-5 max-w-lg text-lg text-muted-foreground">
            Rode, aproxime e conheça cada produto antes de o comprar. Colhido na Fazenda e entregue
            em sua casa.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/loja" className={buttonVariants({ size: 'lg' })}>
              Ver a loja <ArrowRight />
            </Link>
            <Link to="/cabazes" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Cabazes da semana
            </Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
            <Truck className="size-4 text-primary" /> Entregas em Luanda de segunda a sábado
          </p>
        </m.div>

        <m.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
          className="relative"
        >
          <div
            aria-hidden="true"
            className="absolute -inset-6 -z-10 rounded-[2.5rem] bg-menta/50 blur-2xl"
          />
          <Visualizador3D
            modelo={MODELO_HERO}
            nome="Tomate maduro"
            carregar="visivel"
            className="mx-auto max-w-lg shadow-xl shadow-floresta/5 lg:max-w-none"
          />
          <p className="mt-3 text-center text-xs text-muted-foreground">Imagem ilustrativa</p>
        </m.div>
      </div>
    </section>
  )
}
