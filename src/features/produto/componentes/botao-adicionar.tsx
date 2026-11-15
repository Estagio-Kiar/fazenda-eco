import { Check, ShoppingBasket } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button, type ButtonProps } from '@/components/ui/button'
import type { LinhaCarrinho } from '@/features/carrinho/calculos'
import { useAdicionarAoCarrinho } from '@/features/carrinho/use-adicionar'

type Props = Omit<ButtonProps, 'onClick'> & {
  linha: Omit<LinhaCarrinho, 'quantidade'>
  quantidade?: number
  rotulo?: string
  mostrarIcone?: boolean
}

/** Botão «Adicionar» com animação de confirmação (Motion). */
export function BotaoAdicionar({
  linha,
  quantidade,
  rotulo = 'Adicionar',
  mostrarIcone = false,
  ...props
}: Props) {
  const adicionar = useAdicionarAoCarrinho()
  const [feito, setFeito] = useState(false)
  const esgotado = linha.stock <= 0

  useEffect(() => {
    if (!feito) return
    const t = setTimeout(() => setFeito(false), 1400)
    return () => clearTimeout(t)
  }, [feito])

  return (
    <Button
      {...props}
      disabled={esgotado || props.disabled}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (adicionar(linha, quantidade)) setFeito(true)
      }}
      aria-label={esgotado ? `${linha.nome} esgotado` : `${rotulo} ${linha.nome} ao carrinho`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <m.span
          key={feito ? 'ok' : esgotado ? 'esgotado' : 'normal'}
          initial={{ y: 8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -8, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="inline-flex items-center gap-2"
        >
          {feito ? (
            <>
              <Check /> Adicionado
            </>
          ) : esgotado ? (
            'Esgotado'
          ) : (
            <>
              {mostrarIcone && <ShoppingBasket />}
              {rotulo}
            </>
          )}
        </m.span>
      </AnimatePresence>
    </Button>
  )
}
