import { useQuery } from '@tanstack/react-query'
import { Heart } from 'lucide-react'
import { Link } from 'react-router'
import { consultas } from '@/api/consultas'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import {
  CartaoProduto,
  CartaoProdutoEsqueleto,
} from '@/features/produto/componentes/cartao-produto'
import { useFavoritos } from './use-favoritos'

export default function PaginaFavoritos() {
  const ids = useFavoritos((s) => s.ids)
  const { data, isPending } = useQuery(consultas.porIds(ids))
  // Mantém a ordem pela qual o cliente guardou e esconde logo os que foram removidos
  const produtos = ids.map((id) => data?.find((p) => p.id === id)).filter((p) => p != null)

  return (
    <div className="container-loja py-8 sm:py-10">
      <title>Favoritos — Fazenda</title>
      <h1 className="mb-6 text-3xl font-bold sm:text-4xl">Favoritos</h1>
      {ids.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Ainda não guardou nenhum produto"
          description="Toque no coração de um produto para o guardar aqui."
          action={
            <Link to="/loja" className={buttonVariants()}>
              Explorar a loja
            </Link>
          }
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {isPending
            ? ids.map((id) => <CartaoProdutoEsqueleto key={id} />)
            : produtos.map((p) => <CartaoProduto key={p.id} produto={p} />)}
        </div>
      )}
    </div>
  )
}
