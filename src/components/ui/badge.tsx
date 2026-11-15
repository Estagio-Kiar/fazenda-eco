import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const badgeVariants = cva(
  'inline-flex w-fit items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap [&_svg]:size-3',
  {
    variants: {
      variant: {
        default: 'bg-menta text-floresta',
        /** Promoções e selos: amarelo sempre com texto verde floresta */
        promocao: 'bg-amarelo text-floresta',
        primaria: 'bg-primary text-primary-foreground',
        contorno: 'border border-salvia bg-background/90 text-floresta backdrop-blur',
        alerta: 'bg-destructive/10 text-destructive',
        neutro: 'bg-nevoa text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export function Badge({
  className,
  variant,
  ...props
}: ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />
}
