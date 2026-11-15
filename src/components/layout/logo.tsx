import { Link } from 'react-router'
import { cn } from '@/lib/utils'

/** Marca provisória: um rebento com duas folhas e o sol. Substituir pelo logótipo oficial da fazenda. */
export function MarcaFazenda({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={cn('size-8', className)}>
      <rect width="64" height="64" rx="16" fill="#2E7D32" />
      <circle cx="46" cy="18" r="7" fill="#F2B705" />
      <path d="M32 52 V30" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      <path d="M32 34 C 31 24 23 18 13 19 C 13 29 21 35 32 34 Z" fill="#fff" />
      <path d="M32 40 C 33 31 40 26 49 28 C 48 37 41 41 32 40 Z" fill="#B7DCA8" />
      <path d="M20 52 H44" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn('flex items-center gap-2 font-bold text-floresta', className)}
      aria-label="Fazenda — início"
    >
      <MarcaFazenda className="size-8" />
      <span className="text-lg tracking-tight whitespace-nowrap">Fazenda</span>
    </Link>
  )
}
