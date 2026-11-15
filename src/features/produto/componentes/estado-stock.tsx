import { cn } from '@/lib/utils'

export const POUCO_STOCK = 5

export function EstadoStock({ stock, className }: { stock: number; className?: string }) {
  const [texto, cor] =
    stock <= 0
      ? ['Esgotado', 'bg-vermelho']
      : stock <= POUCO_STOCK
        ? [`Últimas unidades (${stock})`, 'bg-amarelo']
        : ['Em stock', 'bg-primary']
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-sm text-muted-foreground',
        stock <= 0 && 'text-destructive',
        className,
      )}
    >
      <span className={cn('size-2 rounded-full', cor)} aria-hidden="true" />
      {texto}
    </span>
  )
}
