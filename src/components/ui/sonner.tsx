import { Toaster as Sonner, type ToasterProps } from 'sonner'

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      position="bottom-center"
      closeButton
      toastOptions={{
        classNames: {
          toast: '!rounded-xl !border-menta !bg-background !text-floresta !shadow-lg !font-sans',
          description: '!text-muted-foreground',
          actionButton: '!bg-primary !text-primary-foreground !font-semibold',
          success: '[&_[data-icon]]:!text-primary',
          error: '[&_[data-icon]]:!text-destructive',
        },
      }}
      {...props}
    />
  )
}
