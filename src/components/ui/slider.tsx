import { Slider as SliderPrimitive } from '@base-ui/react/slider'
import { cn } from '@/lib/utils'

export function Slider({
  className,
  thumbLabels,
  ...props
}: SliderPrimitive.Root.Props & { thumbLabels?: string[] }) {
  const valores = Array.isArray(props.value ?? props.defaultValue)
    ? ((props.value ?? props.defaultValue) as number[])
    : [0]
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn('w-full touch-none', className)}
      {...props}
    >
      <SliderPrimitive.Control className="flex h-6 w-full cursor-pointer items-center">
        <SliderPrimitive.Track className="relative h-1.5 w-full rounded-full bg-menta">
          <SliderPrimitive.Indicator className="rounded-full bg-primary" />
          {valores.map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              aria-label={thumbLabels?.[i]}
              className="block size-5 rounded-full border-2 border-primary bg-background shadow-sm outline-none focus-visible:ring-[3px] focus-visible:ring-ring/30"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}
