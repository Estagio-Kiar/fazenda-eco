import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export const Sheet = DialogPrimitive.Root
export const SheetTrigger = DialogPrimitive.Trigger
export const SheetClose = DialogPrimitive.Close

type Lado = 'left' | 'right' | 'bottom'

const lados: Record<Lado, string> = {
  left: 'inset-y-0 left-0 h-dvh w-[86vw] max-w-sm border-r data-[starting-style]:-translate-x-full data-[ending-style]:-translate-x-full',
  right:
    'inset-y-0 right-0 h-dvh w-[92vw] max-w-md border-l data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full',
  bottom:
    'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-2xl border-t data-[starting-style]:translate-y-full data-[ending-style]:translate-y-full',
}

export function SheetContent({
  side = 'right',
  title,
  description,
  className,
  children,
  footer,
}: {
  side?: Lado
  title: ReactNode
  description?: ReactNode
  className?: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-floresta/30 backdrop-blur-[2px] transition-opacity duration-200 data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
      <DialogPrimitive.Popup
        className={cn(
          'fixed z-50 flex flex-col bg-background shadow-xl transition-transform duration-300 ease-out outline-none',
          lados[side],
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
          <div>
            <DialogPrimitive.Title className="text-lg font-semibold text-floresta">
              {title}
            </DialogPrimitive.Title>
            {description && (
              <DialogPrimitive.Description className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </DialogPrimitive.Description>
            )}
          </div>
          <DialogPrimitive.Close
            aria-label="Fechar"
            className="-mr-2 rounded-md p-2 text-muted-foreground transition-colors hover:bg-nevoa hover:text-floresta"
          >
            <X className="size-5" />
          </DialogPrimitive.Close>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4">{children}</div>
        {footer && <div className="border-t px-5 py-4">{footer}</div>}
      </DialogPrimitive.Popup>
    </DialogPrimitive.Portal>
  )
}
