import { MapPinOff } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

export default function PaginaNaoEncontrada() {
  return (
    <div className="container-loja py-16">
      <title>Página não encontrada — Fazenda</title>
      <EmptyState
        icon={MapPinOff}
        title="Esta página não existe"
        description="O endereço pode estar errado ou a página foi retirada."
        action={
          <Link to="/" className={buttonVariants()}>
            Ir para o início
          </Link>
        }
      />
    </div>
  )
}
