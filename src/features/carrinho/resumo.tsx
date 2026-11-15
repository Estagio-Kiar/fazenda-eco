import { useQuery } from '@tanstack/react-query'
import { ArrowRight, Truck } from 'lucide-react'
import { Link } from 'react-router'
import { consultas } from '@/api/consultas'
import { buttonVariants } from '@/components/ui/button'
import { NativeSelect } from '@/components/ui/native-select'
import { Separator } from '@/components/ui/separator'
import { formatarKz } from '@/lib/format'
import { cn } from '@/lib/utils'
import { calcularResumo, ENTREGA_GRATIS_A_PARTIR } from './calculos'
import { FormularioCupao } from './cupao'
import { useCarrinho } from './use-carrinho'

export function ResumoCarrinho() {
  const linhas = useCarrinho((s) => s.linhas)
  const cupao = useCarrinho((s) => s.cupao)
  const zona = useCarrinho((s) => s.zona)
  const definirZona = useCarrinho((s) => s.definirZona)
  const { data: zonas } = useQuery(consultas.zonasEntrega())
  const r = calcularResumo(linhas, cupao, zona)
  const progresso = Math.min(100, (r.subtotal / ENTREGA_GRATIS_A_PARTIR) * 100)

  return (
    <aside
      aria-labelledby="titulo-resumo"
      className="rounded-2xl border border-menta bg-nevoa p-5 sm:p-6 lg:sticky lg:top-32"
    >
      <h2 id="titulo-resumo" className="text-lg font-bold">
        Resumo da encomenda
      </h2>

      <div className="mt-4 rounded-xl bg-background p-3 ring-1 ring-menta">
        <p className="flex items-center gap-2 text-sm text-floresta">
          <Truck className="size-4 shrink-0 text-primary" />
          {r.faltaParaEntregaGratis > 0 ? (
            <span>
              Faltam <strong>{formatarKz(r.faltaParaEntregaGratis)}</strong> para a entrega grátis
            </span>
          ) : (
            <strong>Tem entrega grátis!</strong>
          )}
        </p>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-menta"
          role="progressbar"
          aria-label="Progresso para a entrega grátis"
          aria-valuenow={Math.round(progresso)}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="zona" className="mb-1.5 block text-sm font-medium text-floresta">
            Zona de entrega
          </label>
          <NativeSelect
            id="zona"
            value={zona?.id ?? ''}
            onChange={(e) => definirZona(zonas?.find((z) => z.id === e.target.value) ?? null)}
          >
            <option value="" disabled>
              Escolha a zona…
            </option>
            {zonas?.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nome} — {z.custo ? formatarKz(z.custo) : 'grátis'} · {z.prazo}
              </option>
            ))}
          </NativeSelect>
        </div>
        <FormularioCupao subtotal={r.subtotal} />
      </div>

      <Separator className="my-5" />

      <dl className="space-y-2.5 text-sm">
        <Linha rotulo="Subtotal" valor={formatarKz(r.subtotal)} />
        {r.desconto > 0 && (
          <Linha rotulo="Desconto" valor={`−${formatarKz(r.desconto)}`} className="text-primary" />
        )}
        <Linha
          rotulo="Entrega"
          valor={
            r.entrega == null
              ? 'Escolha a zona'
              : r.entrega === 0
                ? 'Grátis'
                : formatarKz(r.entrega)
          }
          className={cn(r.entrega == null && 'text-muted-foreground')}
        />
        <Separator className="!my-4" />
        <div className="flex items-baseline justify-between">
          <dt className="text-base font-bold text-floresta">Total</dt>
          <dd className="text-2xl font-bold text-floresta tabular-nums">{formatarKz(r.total)}</dd>
        </div>
      </dl>

      <Link
        to="/checkout"
        aria-disabled={!zona}
        onClick={(e) => !zona && e.preventDefault()}
        className={cn(
          buttonVariants({ size: 'lg' }),
          'mt-5 w-full',
          !zona && 'pointer-events-none opacity-50',
        )}
      >
        Finalizar encomenda <ArrowRight />
      </Link>
      {!zona && (
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Escolha a zona de entrega para continuar.
        </p>
      )}
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Os preços e o stock são confirmados no checkout.
      </p>
    </aside>
  )
}

function Linha({
  rotulo,
  valor,
  className,
}: {
  rotulo: string
  valor: string
  className?: string
}) {
  return (
    <div className={cn('flex justify-between gap-4', className)}>
      <dt className="text-muted-foreground">{rotulo}</dt>
      <dd className="font-medium tabular-nums">{valor}</dd>
    </div>
  )
}
