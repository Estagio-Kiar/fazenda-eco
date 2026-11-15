import { Droplets, HandHeart, Sun } from 'lucide-react'
import { MarcaFazenda } from '@/components/layout/logo'

/** Texto provisório: substituir pela história real da fazenda (levantamento, fase 1). */
export function SobreFazenda() {
  return (
    <section id="sobre" className="scroll-mt-28 py-12 sm:py-16" aria-labelledby="titulo-sobre">
      <div className="container-loja">
        <div className="grid items-center gap-10 overflow-hidden rounded-3xl bg-floresta p-8 text-white sm:p-12 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="text-sm font-semibold text-amarelo">Sobre a fazenda</p>
            <h2 id="titulo-sobre" className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Cultivamos como se fosse para a nossa mesa.
            </h2>
            <p className="mt-4 max-w-xl text-white/80">
              A Fazenda produz frutas, legumes, ovos e mel com rega gota-a-gota e o mínimo de
              químicos. Vendemos directamente a quem come, sem intermediários, para que o produto
              chegue mais fresco e o agricultor receba um preço justo.
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                { i: Sun, t: 'Colheita na véspera' },
                { i: Droplets, t: 'Rega gota-a-gota' },
                { i: HandHeart, t: 'Venda directa' },
              ].map(({ i: Icone, t }) => (
                <li key={t} className="flex items-center gap-2 text-sm font-medium">
                  <span className="flex size-9 items-center justify-center rounded-full bg-white/10">
                    <Icone className="size-4 text-amarelo" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <div
            className="relative mx-auto hidden aspect-square w-full max-w-xs lg:block"
            aria-hidden="true"
          >
            <div className="absolute inset-0 rounded-full bg-white/5" />
            <div className="absolute inset-8 rounded-full bg-white/5" />
            <MarcaFazenda className="absolute inset-16 size-auto rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
