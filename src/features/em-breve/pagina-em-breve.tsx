import { Construction } from 'lucide-react'
import { Link } from 'react-router'
import { buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'

/** Páginas reservadas para as partes 7 (checkout e conta) e 8 (painel /admin). */
export function PaginaEmBreve({ titulo, parte }: { titulo: string; parte: string }) {
  return (
    <div className="container-loja py-12">
      <title>{`${titulo} — Fazenda`}</title>
      <EmptyState
        icon={Construction}
        title={`${titulo}: em construção`}
        description={`Esta área faz parte da ${parte} do desenvolvimento e depende da API.`}
        action={
          <Link to="/loja" className={buttonVariants({ variant: 'outline' })}>
            Voltar à loja
          </Link>
        }
      />
    </div>
  )
}
