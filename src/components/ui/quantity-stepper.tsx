import { Minus, Plus } from 'lucide-react'
import { arredondar, formatarNumero } from '@/lib/format'
import { cn } from '@/lib/utils'

type Props = {
  value: number
  onChange: (valor: number) => void
  min?: number
  max?: number
  step?: number
  unidade?: string
  size?: 'sm' | 'default'
  className?: string
  label?: string
}

/** Seletor de quantidade; aceita passos fraccionados (ex.: 0,5 kg). */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 99,
  step = 1,
  unidade,
  size = 'default',
  className,
  label = 'Quantidade',
}: Props) {
  const mudar = (delta: number) => onChange(Math.min(max, Math.max(min, arredondar(value + delta))))
  const btn =
    'flex items-center justify-center text-floresta transition-colors hover:bg-nevoa disabled:cursor-not-allowed disabled:opacity-40'
  const dim = size === 'sm' ? 'h-8 w-8' : 'h-10 w-10'
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        'inline-flex items-center overflow-hidden rounded-lg border border-input bg-background',
        className,
      )}
    >
      <button
        type="button"
        className={cn(btn, dim)}
        onClick={() => mudar(-step)}
        disabled={value <= min}
        aria-label="Diminuir"
      >
        <Minus className="size-4" />
      </button>
      <output
        aria-live="polite"
        className={cn(
          'min-w-14 px-1 text-center font-semibold text-floresta tabular-nums',
          size === 'sm' ? 'text-xs' : 'text-sm',
        )}
      >
        {formatarNumero(value)}
        {unidade && <span className="ml-0.5 font-normal text-muted-foreground">{unidade}</span>}
      </output>
      <button
        type="button"
        className={cn(btn, dim)}
        onClick={() => mudar(step)}
        disabled={value >= max}
        aria-label="Aumentar"
      >
        <Plus className="size-4" />
      </button>
    </div>
  )
}
