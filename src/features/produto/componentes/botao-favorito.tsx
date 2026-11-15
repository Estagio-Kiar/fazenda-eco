import { Heart } from 'lucide-react'
import { m } from 'motion/react'
import { toast } from 'sonner'
import { useEFavorito, useFavoritos } from '@/features/favoritos/use-favoritos'
import { cn } from '@/lib/utils'

export function BotaoFavorito({
  id,
  nome,
  className,
}: {
  id: string
  nome: string
  className?: string
}) {
  const favorito = useEFavorito(id)
  const alternar = useFavoritos((s) => s.alternar)
  return (
    <m.button
      type="button"
      whileTap={{ scale: 0.85 }}
      aria-pressed={favorito}
      aria-label={favorito ? `Remover ${nome} dos favoritos` : `Guardar ${nome} nos favoritos`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        const agora = alternar(id)
        toast(agora ? 'Guardado nos favoritos' : 'Removido dos favoritos', { description: nome })
      }}
      className={cn(
        'flex size-9 items-center justify-center rounded-full bg-background/90 text-floresta shadow-sm ring-1 ring-menta backdrop-blur transition-colors hover:text-vermelho',
        className,
      )}
    >
      <Heart className={cn('size-4', favorito && 'fill-vermelho text-vermelho')} />
    </m.button>
  )
}
