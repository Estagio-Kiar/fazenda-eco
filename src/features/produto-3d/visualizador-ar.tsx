import type { ModelViewerElement } from '@google/model-viewer'
import { Smartphone, View } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { Modelo3D } from '@/api/tipos'
import { cn } from '@/lib/utils'

/**
 * Botão «Ver em AR» com o <model-viewer> da Google.
 * Android abre o Scene Viewer e iPhone o Quick Look (o USDZ é gerado automaticamente a partir do .glb).
 * O <model-viewer> só é descarregado quando o cliente abre este diálogo.
 */
export function BotaoAR({
  modelo,
  nome,
  className,
}: {
  modelo: Modelo3D
  nome: string
  className?: string
}) {
  const [aberto, setAberto] = useState(false)
  return (
    <Dialog open={aberto} onOpenChange={setAberto}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className={cn('bg-background/90 backdrop-blur', className)}
          >
            <View />
            Ver em AR
          </Button>
        }
      />
      <DialogContent
        title={`${nome} na sua mesa`}
        description="Realidade aumentada no telemóvel"
        className="max-w-xl"
      >
        {aberto && <ConteudoAR modelo={modelo} nome={nome} />}
      </DialogContent>
    </Dialog>
  )
}

function ConteudoAR({ modelo, nome }: { modelo: Modelo3D; nome: string }) {
  const ref = useRef<ModelViewerElement>(null)
  const [pronto, setPronto] = useState(false)
  const [podeAR, setPodeAR] = useState<boolean | null>(null)

  useEffect(() => {
    let vivo = true
    import('@google/model-viewer').then(() => vivo && setPronto(true))
    return () => {
      vivo = false
    }
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!pronto || !el) return
    const aoCarregar = () => setPodeAR(el.canActivateAR)
    el.addEventListener('load', aoCarregar)
    return () => el.removeEventListener('load', aoCarregar)
  }, [pronto])

  return (
    <div className="space-y-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-nevoa sm:aspect-[4/3]">
        {pronto ? (
          <model-viewer
            ref={ref}
            src={modelo.modeloUrl}
            poster={modelo.posterUrl}
            alt={`Modelo 3D de ${nome}`}
            ar
            ar-modes="webxr scene-viewer quick-look"
            ar-scale="auto"
            camera-controls
            touch-action="pan-y"
            shadow-intensity="1"
            exposure="1.05"
            style={{ width: '100%', height: '100%', backgroundColor: 'var(--verde-nevoa)' }}
          >
            <Button
              slot="ar-button"
              size="lg"
              className="absolute bottom-4 left-1/2 -translate-x-1/2"
            >
              <View />
              Abrir câmara
            </Button>
          </model-viewer>
        ) : (
          <img src={modelo.posterUrl} alt="" className="size-full object-contain" />
        )}
      </div>
      {podeAR === false && (
        <p className="flex items-start gap-2 rounded-lg bg-nevoa p-3 text-sm text-muted-foreground">
          <Smartphone className="mt-0.5 size-4 shrink-0 text-primary" />
          Este dispositivo não suporta realidade aumentada. Abra esta página no telemóvel (Android
          ou iPhone) para ver o produto em cima da sua mesa.
        </p>
      )}
      {podeAR && (
        <p className="text-sm text-muted-foreground">
          Toque em «Abrir câmara», aponte o telemóvel para uma superfície plana e mova-o devagar.
        </p>
      )}
    </div>
  )
}
