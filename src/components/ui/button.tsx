import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

export const buttonVariants = cva(
  'inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all outline-none select-none focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:ring-destructive/30 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*="size-"])]:size-4',
  {
    variants: {
      variant: {
        /** Comprar / Adicionar: verde campo com texto branco (5,1 : 1) */
        default:
          'bg-primary text-primary-foreground shadow-sm hover:bg-campo-escuro active:scale-[0.98]',
        /** Secundário: contorno verde sálvia */
        outline:
          'border border-salvia bg-background text-floresta hover:border-folha hover:bg-nevoa active:scale-[0.98]',
        secondary: 'bg-menta text-floresta hover:bg-salvia/60',
        ghost: 'text-floresta hover:bg-nevoa',
        destaque: 'bg-amarelo text-floresta shadow-sm hover:brightness-95',
        destructive: 'bg-destructive text-white hover:bg-destructive/90',
        link: 'h-auto px-0 text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-4',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-12 rounded-xl px-6 text-base',
        icon: 'size-10',
        'icon-sm': 'size-8 rounded-md',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
)

export type ButtonProps = ComponentProps<'button'> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}
