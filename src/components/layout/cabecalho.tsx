import { Heart, Menu, ShoppingBasket, Truck, User } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { formatarKz } from '@/lib/format'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ENTREGA_GRATIS_A_PARTIR } from '@/features/carrinho/calculos'
import { useNumeroArtigos } from '@/features/carrinho/use-carrinho'
import { useFavoritos } from '@/features/favoritos/use-favoritos'
import { Logo } from './logo'
import { LIGACOES } from './navegacao'
import { CaixaPesquisa } from './pesquisa'

export function Cabecalho() {
  const artigos = useNumeroArtigos()
  const favoritos = useFavoritos((s) => s.ids.length)
  const [menuAberto, setMenuAberto] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-menta bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="bg-floresta text-white">
        <p className="container-loja flex h-8 items-center justify-center gap-2 text-xs font-medium">
          <Truck className="size-3.5 text-amarelo" />
          Entrega grátis em Luanda a partir de {formatarKz(ENTREGA_GRATIS_A_PARTIR)}
        </p>
      </div>

      <div className="container-loja flex h-16 items-center gap-3 lg:gap-6">
        <Sheet open={menuAberto} onOpenChange={setMenuAberto}>
          <SheetTrigger
            aria-label="Abrir menu"
            className="-ml-2 rounded-md p-2 text-floresta hover:bg-nevoa lg:hidden"
          >
            <Menu className="size-5" />
          </SheetTrigger>
          <SheetContent side="left" title="Menu">
            <CaixaPesquisa className="mb-4" onPesquisar={() => setMenuAberto(false)} />
            <nav aria-label="Principal (telemóvel)" className="flex flex-col">
              {LIGACOES.map((l) => (
                <Link
                  key={l.para}
                  to={l.para}
                  onClick={() => setMenuAberto(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-floresta hover:bg-nevoa"
                >
                  {l.rotulo}
                </Link>
              ))}
              <Link
                to="/favoritos"
                onClick={() => setMenuAberto(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-floresta hover:bg-nevoa"
              >
                Favoritos {favoritos > 0 && `(${favoritos})`}
              </Link>
              <Link
                to="/conta"
                onClick={() => setMenuAberto(false)}
                className="rounded-lg px-3 py-3 text-base font-medium text-floresta hover:bg-nevoa"
              >
                A minha conta
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <nav aria-label="Principal" className="hidden items-center lg:flex xl:gap-1">
          {LIGACOES.map((l) =>
            l.para.includes('#') ? (
              <Link
                key={l.para}
                to={l.para}
                className="rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-floresta"
              >
                {l.rotulo}
              </Link>
            ) : (
              <NavLink
                key={l.para}
                to={l.para}
                end={'exacto' in l}
                className={({ isActive }) =>
                  cn(
                    'rounded-md px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
                    isActive ? 'text-floresta' : 'text-muted-foreground hover:text-floresta',
                  )
                }
              >
                {l.rotulo}
              </NavLink>
            ),
          )}
        </nav>

        <CaixaPesquisa className="ml-auto hidden w-full max-w-xs md:block" />

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link
            to="/favoritos"
            aria-label={`Favoritos (${favoritos})`}
            className="relative hidden rounded-full p-2 text-floresta transition-colors hover:bg-nevoa sm:block"
          >
            <Heart className="size-5" />
            {favoritos > 0 && <Contador valor={favoritos} className="bg-menta text-floresta" />}
          </Link>
          <Link
            to="/conta"
            aria-label="A minha conta"
            className="hidden rounded-full p-2 text-floresta transition-colors hover:bg-nevoa sm:block"
          >
            <User className="size-5" />
          </Link>
          <Link
            to="/carrinho"
            aria-label={`Carrinho, ${artigos} ${artigos === 1 ? 'artigo' : 'artigos'}`}
            className="relative inline-flex h-10 items-center gap-2 rounded-full bg-primary px-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-campo-escuro sm:px-4"
          >
            <ShoppingBasket className="size-5" />
            <span className="hidden sm:inline">Carrinho</span>
            <AnimatePresence mode="popLayout" initial={false}>
              <m.span
                key={artigos}
                initial={{ scale: 0.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                className="flex min-w-5 items-center justify-center rounded-full bg-amarelo px-1.5 text-xs font-bold text-floresta tabular-nums"
              >
                {artigos}
              </m.span>
            </AnimatePresence>
          </Link>
        </div>
      </div>
    </header>
  )
}

function Contador({ valor, className }: { valor: number; className?: string }) {
  return (
    <span
      className={cn(
        'absolute -top-0.5 -right-0.5 flex min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
        className,
      )}
    >
      {valor}
    </span>
  )
}
