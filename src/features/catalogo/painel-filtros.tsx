import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { consultas } from '@/api/consultas'
import { EPOCAS, type Epoca } from '@/api/tipos'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { formatarKz } from '@/lib/format'
import { cn } from '@/lib/utils'
import { PRECO_MAX, PRECO_MIN, type FiltrosUrl } from './use-filtros-url'

export function PainelFiltros({ f, className }: { f: FiltrosUrl; className?: string }) {
  const { data: categorias, isPending } = useQuery(consultas.categorias())
  const { filtros } = f

  // Valor local do slider enquanto o cliente arrasta; só actualiza o endereço quando larga.
  const doEndereco = `${filtros.precoMin ?? PRECO_MIN}-${filtros.precoMax ?? PRECO_MAX}`
  const [preco, setPreco] = useState<number[]>([
    filtros.precoMin ?? PRECO_MIN,
    filtros.precoMax ?? PRECO_MAX,
  ])
  const [anterior, setAnterior] = useState(doEndereco)
  if (anterior !== doEndereco) {
    setAnterior(doEndereco)
    setPreco([filtros.precoMin ?? PRECO_MIN, filtros.precoMax ?? PRECO_MAX])
  }

  return (
    <div className={cn('space-y-6', className)}>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-floresta">Categoria</legend>
        <div className="space-y-2.5">
          {isPending
            ? Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-5 w-32" />)
            : categorias?.map((c) => (
                <label
                  key={c.id}
                  className="flex cursor-pointer items-center gap-3 text-sm text-floresta"
                >
                  <Checkbox
                    checked={filtros.categorias?.includes(c.id) ?? false}
                    onCheckedChange={() => f.alternarCategoria(c.id)}
                  />
                  {c.nome}
                </label>
              ))}
        </div>
      </fieldset>

      <Separator />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-floresta">Preço</legend>
        <Slider
          min={PRECO_MIN}
          max={PRECO_MAX}
          step={100}
          minStepsBetweenValues={5}
          value={preco}
          onValueChange={(v) => setPreco(v as number[])}
          onValueCommitted={(v) => {
            const [min, max] = v as number[]
            f.definirPreco(min, max)
          }}
          thumbLabels={['Preço mínimo', 'Preço máximo']}
        />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
          <span>{formatarKz(preco[0])}</span>
          <span>
            {formatarKz(preco[1])}
            {preco[1] >= PRECO_MAX && '+'}
          </span>
        </div>
      </fieldset>

      <Separator />

      <fieldset>
        <legend className="mb-3 text-sm font-semibold text-floresta">Época</legend>
        <div className="flex flex-wrap gap-2">
          <Pilula activa={!filtros.epoca} onClick={() => f.definirEpoca(undefined)}>
            Todas
          </Pilula>
          {(Object.keys(EPOCAS) as Epoca[])
            .filter((e) => e !== 'todo-ano')
            .map((e) => (
              <Pilula key={e} activa={filtros.epoca === e} onClick={() => f.definirEpoca(e)}>
                {EPOCAS[e]}
              </Pilula>
            ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Inclui produtos disponíveis todo o ano.
        </p>
      </fieldset>

      <Separator />

      <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-floresta">
        <Checkbox checked={!!filtros.apenasPromocoes} onCheckedChange={f.alternarPromocoes} />
        Só promoções
      </label>
    </div>
  )
}

function Pilula({
  activa,
  onClick,
  children,
}: {
  activa: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-pressed={activa}
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
        activa
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-salvia text-floresta hover:bg-nevoa',
      )}
    >
      {children}
    </button>
  )
}
