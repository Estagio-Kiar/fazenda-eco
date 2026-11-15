import { Search } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { cn } from '@/lib/utils'

export function CaixaPesquisa({
  className,
  onPesquisar,
}: {
  className?: string
  onPesquisar?: () => void
}) {
  const [params] = useSearchParams()
  const [termo, setTermo] = useState(params.get('q') ?? '')
  const navegar = useNavigate()

  const submeter = (e: FormEvent) => {
    e.preventDefault()
    const q = termo.trim()
    navegar(q ? `/loja?q=${encodeURIComponent(q)}` : '/loja')
    onPesquisar?.()
  }

  return (
    <form role="search" onSubmit={submeter} className={cn('relative', className)}>
      <label htmlFor="pesquisa-loja" className="sr-only">
        Procurar produtos
      </label>
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id="pesquisa-loja"
        type="search"
        value={termo}
        onChange={(e) => setTermo(e.target.value)}
        placeholder="Procurar produtos…"
        className="h-10 w-full rounded-full border border-menta bg-nevoa pr-4 pl-9 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:bg-background focus:ring-[3px] focus:ring-ring/20"
      />
    </form>
  )
}
