import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router'
import { consultas } from '@/api/consultas'
import type { CategoriaId } from '@/api/tipos'
import { Skeleton } from '@/components/ui/skeleton'
import { SectionHeading } from '@/components/ui/section-heading'

const IMAGEM: Record<CategoriaId, string> = {
  frutas: '/produtos/manga-rosa.svg',
  legumes: '/produtos/tomate-maduro.svg',
  hortalicas: '/produtos/alface-crespa.svg',
  tuberculos: '/produtos/cenoura.svg',
  graos: '/produtos/milho-fresco.svg',
  'ovos-mel': '/produtos/mel-do-planalto.svg',
}

export function Categorias() {
  const { data, isPending } = useQuery(consultas.categorias())
  return (
    <section className="container-loja py-12" aria-labelledby="titulo-categorias">
      <SectionHeading title={<span id="titulo-categorias">Compre por categoria</span>} />
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {isPending
          ? Array.from({ length: 6 }, (_, i) => (
              <Skeleton key={i} className="aspect-[4/5] rounded-2xl" />
            ))
          : data?.map((c) => (
              <li key={c.id}>
                <Link
                  to={`/loja?categoria=${c.id}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-menta bg-nevoa transition hover:border-salvia hover:shadow-md"
                >
                  <img
                    src={IMAGEM[c.id]}
                    alt=""
                    loading="lazy"
                    className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="p-3">
                    <span className="block text-sm font-semibold text-floresta">{c.nome}</span>
                    <span className="mt-0.5 line-clamp-2 block text-xs text-muted-foreground">
                      {c.descricao}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
      </ul>
    </section>
  )
}
