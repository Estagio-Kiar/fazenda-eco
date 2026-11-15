import { ArrowLeft, ShoppingBasket, Trash2 } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { UNIDADES } from '@/api/tipos'
import { Button, buttonVariants } from '@/components/ui/button'
import { EmptyState } from '@/components/ui/empty-state'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { formatarKz } from '@/lib/format'
import { totalLinha, type LinhaCarrinho } from './calculos'
import { ligacaoLinha } from './linhas'
import { ResumoCarrinho } from './resumo'
import { useCarrinho } from './use-carrinho'

export default function PaginaCarrinho() {
  const linhas = useCarrinho((s) => s.linhas)
  const limpar = useCarrinho((s) => s.limpar)

  if (linhas.length === 0)
    return (
      <div className="container-loja py-12">
        <title>Carrinho — Fazenda</title>
        <EmptyState
          icon={ShoppingBasket}
          title="O seu carrinho está vazio"
          description="Explore a loja e adicione frutas, legumes ou um cabaz da semana."
          action={
            <Link to="/loja" className={buttonVariants({ size: 'lg' })}>
              Ir para a loja
            </Link>
          }
        />
      </div>
    )

  return (
    <div className="container-loja py-8 sm:py-10">
      <title>{`Carrinho (${linhas.length}) — Fazenda`}</title>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-3xl font-bold sm:text-4xl">Carrinho</h1>
        <Button variant="ghost" size="sm" onClick={limpar} className="text-muted-foreground">
          <Trash2 /> Esvaziar carrinho
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section aria-label="Artigos no carrinho">
          <ul className="divide-y divide-menta rounded-2xl border border-menta">
            <AnimatePresence initial={false}>
              {linhas.map((l) => (
                <LinhaItem key={l.id} linha={l} />
              ))}
            </AnimatePresence>
          </ul>
          <Link to="/loja" className={buttonVariants({ variant: 'link', className: 'mt-4' })}>
            <ArrowLeft /> Continuar a comprar
          </Link>
        </section>
        <ResumoCarrinho />
      </div>
    </div>
  )
}

function LinhaItem({ linha }: { linha: LinhaCarrinho }) {
  const definir = useCarrinho((s) => s.definirQuantidade)
  const remover = useCarrinho((s) => s.remover)
  const adicionar = useCarrinho((s) => s.adicionar)
  const u = UNIDADES[linha.unidade]

  const aoRemover = () => {
    const { quantidade, ...resto } = linha
    remover(linha.id)
    toast('Removido do carrinho', {
      description: linha.nome,
      action: { label: 'Desfazer', onClick: () => adicionar(resto, quantidade) },
    })
  }

  return (
    <m.li
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
      className="overflow-hidden"
    >
      <div className="flex gap-4 p-4">
        <Link to={ligacaoLinha(linha)} className="shrink-0">
          <img
            src={linha.imagem}
            alt=""
            className="size-20 rounded-xl bg-nevoa object-cover sm:size-24"
          />
        </Link>
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <Link to={ligacaoLinha(linha)} className="font-semibold text-floresta hover:underline">
              {linha.nome}
            </Link>
            <p className="text-sm text-muted-foreground">
              {formatarKz(linha.preco)} {u.longa}
            </p>
            {linha.quantidade >= linha.stock && (
              <p className="mt-0.5 text-xs text-muted-foreground">Máximo disponível em stock</p>
            )}
          </div>
          <div className="flex items-center justify-between gap-4 sm:justify-end">
            <QuantityStepper
              size="sm"
              value={linha.quantidade}
              onChange={(q) => definir(linha.id, q)}
              min={linha.minimo}
              max={linha.stock}
              step={linha.passo}
              unidade={u.curta}
              label={`Quantidade de ${linha.nome}`}
            />
            <p className="w-24 text-right font-semibold text-floresta tabular-nums">
              {formatarKz(totalLinha(linha))}
            </p>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={aoRemover}
              aria-label={`Remover ${linha.nome}`}
            >
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>
    </m.li>
  )
}
