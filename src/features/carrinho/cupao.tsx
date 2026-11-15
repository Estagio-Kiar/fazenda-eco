import { useMutation } from '@tanstack/react-query'
import { TicketPercent, X } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { toast } from 'sonner'
import { api, ErroApi } from '@/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCarrinho } from './use-carrinho'

export function FormularioCupao({ subtotal }: { subtotal: number }) {
  const cupao = useCarrinho((s) => s.cupao)
  const aplicar = useCarrinho((s) => s.aplicarCupao)
  const remover = useCarrinho((s) => s.removerCupao)
  const [codigo, setCodigo] = useState('')

  const validar = useMutation({
    mutationFn: (c: string) => api.validarCupao(c, subtotal),
    onSuccess: (c) => {
      aplicar(c)
      setCodigo('')
      toast.success('Cupão aplicado', { description: c.descricao })
    },
  })

  const submeter = (e: FormEvent) => {
    e.preventDefault()
    if (codigo.trim()) validar.mutate(codigo)
  }

  if (cupao)
    return (
      <div className="flex items-center justify-between gap-3 rounded-lg bg-menta/60 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2">
          <TicketPercent className="size-4 text-primary" />
          <span>
            <strong className="font-semibold text-floresta">{cupao.codigo}</strong>
            <span className="block text-xs text-muted-foreground">{cupao.descricao}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={remover}
          className="rounded-md p-1 text-muted-foreground hover:bg-background hover:text-floresta"
          aria-label="Remover cupão"
        >
          <X className="size-4" />
        </button>
      </div>
    )

  const erro =
    validar.error instanceof ErroApi
      ? validar.error.message
      : validar.error
        ? 'Não foi possível validar o cupão.'
        : null

  return (
    <form onSubmit={submeter} noValidate>
      <label htmlFor="cupao" className="mb-1.5 block text-sm font-medium text-floresta">
        Cupão de desconto
      </label>
      <div className="flex gap-2">
        <Input
          id="cupao"
          value={codigo}
          onChange={(e) => {
            setCodigo(e.target.value.toUpperCase())
            if (validar.isError) validar.reset()
          }}
          placeholder="Ex.: FAZENDA10"
          autoComplete="off"
          aria-invalid={!!erro}
          aria-describedby={erro ? 'cupao-erro' : undefined}
        />
        <Button type="submit" variant="outline" disabled={validar.isPending || !codigo.trim()}>
          {validar.isPending ? 'A validar…' : 'Aplicar'}
        </Button>
      </div>
      {erro && (
        <p id="cupao-erro" role="alert" className="mt-1.5 text-xs text-destructive">
          {erro}
        </p>
      )}
    </form>
  )
}
