import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { paginasVisiveis } from './paginas'

export function Paginacao({
  pagina,
  totalPaginas,
  onMudar,
}: {
  pagina: number
  totalPaginas: number
  onMudar: (n: number) => void
}) {
  if (totalPaginas <= 1) return null
  const base =
    'flex h-10 min-w-10 items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40'
  return (
    <nav aria-label="Paginação" className="mt-10 flex items-center justify-center gap-1">
      <button
        type="button"
        className={cn(base, 'hover:bg-nevoa')}
        onClick={() => onMudar(pagina - 1)}
        disabled={pagina <= 1}
      >
        <ChevronLeft className="size-4" /> <span className="sr-only sm:not-sr-only">Anterior</span>
      </button>
      {paginasVisiveis(pagina, totalPaginas).map((n, i) =>
        n === '…' ? (
          <span key={`r${i}`} className="px-2 text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={n}
            type="button"
            aria-current={n === pagina ? 'page' : undefined}
            onClick={() => onMudar(n)}
            className={cn(
              base,
              n === pagina ? 'bg-primary text-primary-foreground' : 'text-floresta hover:bg-nevoa',
            )}
          >
            {n}
          </button>
        ),
      )}
      <button
        type="button"
        className={cn(base, 'hover:bg-nevoa')}
        onClick={() => onMudar(pagina + 1)}
        disabled={pagina >= totalPaginas}
      >
        <span className="sr-only sm:not-sr-only">Seguinte</span> <ChevronRight className="size-4" />
      </button>
    </nav>
  )
}
