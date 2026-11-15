import { UNIDADES, type Unidade } from '@/api/tipos'
import { formatarKz } from '@/lib/format'
import { cn } from '@/lib/utils'

export function Preco({
  preco,
  precoAnterior,
  unidade,
  tamanho = 'md',
  className,
}: {
  preco: number
  precoAnterior?: number
  unidade?: Unidade
  tamanho?: 'md' | 'lg'
  className?: string
}) {
  return (
    <div className={cn('flex flex-wrap items-baseline gap-x-2', className)}>
      <span
        className={cn(
          'font-bold text-primary tabular-nums',
          tamanho === 'lg' ? 'text-3xl' : 'text-base',
        )}
      >
        {formatarKz(preco)}
      </span>
      {unidade && (
        <span className={cn('text-muted-foreground', tamanho === 'lg' ? 'text-base' : 'text-xs')}>
          {UNIDADES[unidade].longa}
        </span>
      )}
      {precoAnterior != null && (
        <s
          className={cn(
            'text-muted-foreground tabular-nums',
            tamanho === 'lg' ? 'text-base' : 'text-xs',
          )}
        >
          <span className="sr-only">Antes: </span>
          {formatarKz(precoAnterior)}
        </s>
      )}
    </div>
  )
}
