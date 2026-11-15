import { useQuery } from '@tanstack/react-query'
import { consultas } from '@/api/consultas'
import { CartaoCabaz, CartaoCabazEsqueleto } from './cartao-cabaz'

export default function PaginaCabazes() {
  const { data: cabazes, isPending } = useQuery(consultas.cabazes())
  return (
    <div className="container-loja py-10">
      <header className="mb-8 max-w-2xl">
        <p className="text-sm font-semibold text-primary">Preparados todas as segundas-feiras</p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Cabazes da semana</h1>
        <p className="mt-3 text-muted-foreground">
          Uma selecção do que está melhor na fazenda esta semana, a um preço mais baixo do que
          comprar cada produto em separado.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isPending
          ? Array.from({ length: 3 }, (_, i) => <CartaoCabazEsqueleto key={i} />)
          : cabazes?.map((c) => <CartaoCabaz key={c.id} cabaz={c} />)}
      </div>
    </div>
  )
}
