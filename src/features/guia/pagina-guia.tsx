import { Box, Heart, ShoppingBasket } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { produtos } from '@/api/mock/dados'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { NativeSelect } from '@/components/ui/native-select'
import { QuantityStepper } from '@/components/ui/quantity-stepper'
import { Skeleton } from '@/components/ui/skeleton'
import { Slider } from '@/components/ui/slider'
import { CartaoProduto } from '@/features/produto/componentes/cartao-produto'
import { EstadoStock } from '@/features/produto/componentes/estado-stock'
import { Preco } from '@/features/produto/componentes/preco'

const PALETA = [
  { nome: 'Branco', cor: '#FFFFFF', uso: 'Fundo principal, cartões, formulários', contraste: '—' },
  {
    nome: 'Verde névoa',
    cor: '#F6FBF4',
    uso: 'Secções alternadas, Hero, fundo do 3D',
    contraste: '—',
  },
  {
    nome: 'Verde menta',
    cor: '#E3F2DC',
    uso: 'Bordas suaves, etiquetas, pesquisa',
    contraste: '—',
  },
  { nome: 'Verde sálvia', cor: '#B7DCA8', uso: 'Destaques, botões de contorno', contraste: '—' },
  {
    nome: 'Verde folha',
    cor: '#7CB86A',
    uso: 'Ícones e decoração (nunca texto)',
    contraste: '2,4 : 1',
  },
  {
    nome: 'Verde campo',
    cor: '#2E7D32',
    uso: 'Botões de compra, links, preços',
    contraste: '5,1 : 1',
  },
  { nome: 'Verde floresta', cor: '#1F3D2B', uso: 'Títulos e texto corrido', contraste: '11,9 : 1' },
  { nome: 'Cinza-verde', cor: '#5B6B60', uso: 'Texto secundário', contraste: '5,7 : 1' },
  {
    nome: 'Amarelo',
    cor: '#F2B705',
    uso: 'Promoções e selos (texto floresta)',
    contraste: '—',
  },
  { nome: 'Vermelho', cor: '#C62828', uso: 'Erros, esgotado, alertas', contraste: '5,6 : 1' },
]

/** Guia de componentes (parte 2). Disponível em /guia durante o desenvolvimento. */
export default function PaginaGuia() {
  const [q, setQ] = useState(1.5)
  const [preco, setPreco] = useState([500, 3500])
  return (
    <div className="container-loja space-y-14 py-10">
      <title>Guia de componentes — Fazenda</title>
      <header>
        <p className="text-sm font-semibold text-primary">Parte 2 · Design system</p>
        <h1 className="mt-1 text-4xl font-bold">Guia de componentes</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Paleta, tipografia e componentes da loja. Proporção sugerida: ~60% branco, ~30% verdes
          claros, ~10% verde campo, texto escuro e amarelo só para destaques.
        </p>
      </header>

      <Seccao titulo="Paleta">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {PALETA.map((c) => (
            <div key={c.nome} className="overflow-hidden rounded-xl border border-menta">
              <div className="h-20" style={{ background: c.cor }} />
              <div className="p-3 text-xs">
                <p className="font-semibold text-floresta">{c.nome}</p>
                <p className="font-mono text-muted-foreground">{c.cor}</p>
                <p className="mt-1 text-muted-foreground">{c.uso}</p>
                <p className="mt-1 font-medium text-floresta">Contraste: {c.contraste}</p>
              </div>
            </div>
          ))}
        </div>
      </Seccao>

      <Seccao titulo="Tipografia (Inter)">
        <div className="space-y-3">
          <p className="text-5xl font-extrabold text-floresta">Produtos frescos</p>
          <p className="text-3xl font-bold text-floresta">Destaques da colheita</p>
          <p className="text-xl font-semibold text-floresta">Cabaz Família</p>
          <p className="text-base text-floresta">
            Texto corrido em verde floresta, para leitura confortável.
          </p>
          <p className="text-sm text-muted-foreground">
            Texto secundário em cinza-verde: unidades, descrições.
          </p>
        </div>
      </Seccao>

      <Seccao titulo="Botões">
        <div className="flex flex-wrap items-center gap-3">
          <Button>
            <ShoppingBasket /> Adicionar
          </Button>
          <Button variant="outline">Cabazes da semana</Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="ghost">Fantasma</Button>
          <Button variant="destaque">Promoção</Button>
          <Button variant="destructive">Remover</Button>
          <Button variant="link">Ligação</Button>
          <Button size="sm">Pequeno</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" variant="outline" aria-label="Favorito">
            <Heart />
          </Button>
          <Button disabled>Desactivado</Button>
        </div>
      </Seccao>

      <Seccao titulo="Selos">
        <div className="flex flex-wrap gap-2">
          <Badge>Do campo para a sua mesa</Badge>
          <Badge variant="promocao">Promoção −20%</Badge>
          <Badge variant="contorno">
            <Box /> 3D
          </Badge>
          <Badge variant="primaria">Novo</Badge>
          <Badge variant="neutro">Últimas unidades</Badge>
          <Badge variant="alerta">Esgotado</Badge>
        </div>
      </Seccao>

      <Seccao titulo="Formulários">
        <div className="grid max-w-3xl gap-6 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="g-nome">Nome</Label>
            <Input id="g-nome" placeholder="O seu nome" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-erro">Telefone</Label>
            <Input id="g-erro" aria-invalid defaultValue="9xx" />
            <p className="text-xs text-destructive">Introduza um número com 9 dígitos.</p>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="g-zona">Zona</Label>
            <NativeSelect id="g-zona" defaultValue="t">
              <option value="t">Talatona</option>
              <option value="k">Kilamba</option>
            </NativeSelect>
          </div>
          <label className="flex items-center gap-3 self-end text-sm text-floresta">
            <Checkbox defaultChecked /> Receber novidades da colheita
          </label>
          <div className="space-y-2">
            <Label>Quantidade (passo 0,5 kg)</Label>
            <div>
              <QuantityStepper value={q} onChange={setQ} min={0.5} step={0.5} unidade="kg" />
            </div>
          </div>
          <div className="space-y-3">
            <Label>Intervalo de preço</Label>
            <Slider
              value={preco}
              onValueChange={(v) => setPreco(v as number[])}
              min={0}
              max={5000}
              step={100}
              thumbLabels={['Mínimo', 'Máximo']}
            />
          </div>
        </div>
      </Seccao>

      <Seccao titulo="Preço e stock">
        <div className="flex flex-wrap items-center gap-8">
          <Preco preco={1500} unidade="kg" tamanho="lg" />
          <Preco preco={1800} precoAnterior={2200} unidade="unidade" />
          <EstadoStock stock={50} />
          <EstadoStock stock={3} />
          <EstadoStock stock={0} />
        </div>
      </Seccao>

      <Seccao titulo="Notificações (Sonner)">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() =>
              toast.success('Produto adicionado ao carrinho', {
                description: '1 kg · Tomate maduro',
              })
            }
          >
            Sucesso
          </Button>
          <Button variant="outline" onClick={() => toast.error('Não foi possível validar o cupão')}>
            Erro
          </Button>
          <Button variant="outline" onClick={() => toast('Guardado nos favoritos')}>
            Simples
          </Button>
        </div>
      </Seccao>

      <Seccao titulo="Cartões de produto">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[produtos[0], produtos[1], produtos[3], produtos[9]].map((p) => (
            <CartaoProduto key={p.id} produto={p} />
          ))}
        </div>
      </Seccao>

      <Seccao titulo="A carregar (esqueletos)">
        <div className="flex gap-4">
          <Skeleton className="size-24" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
      </Seccao>
    </div>
  )
}

function Seccao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-5 border-b border-menta pb-2 text-xl font-bold">{titulo}</h2>
      {children}
    </section>
  )
}
