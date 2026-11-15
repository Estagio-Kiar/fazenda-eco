import { Tabs } from '@base-ui/react/tabs'
import { Box, Images } from 'lucide-react'
import type { Produto } from '@/api/tipos'
import { Visualizador3D } from '@/features/produto-3d/visualizador-3d'
import { Galeria } from './galeria'

const separador =
  'inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-floresta focus-visible:ring-[3px] focus-visible:ring-ring/30 data-[active]:bg-background data-[active]:text-floresta data-[active]:shadow-sm [&_svg]:size-4'

/** Visualizador 3D e fotos reais lado a lado (em separadores). */
export function MediaProduto({ produto }: { produto: Produto }) {
  if (!produto.modelo3d) return <Galeria imagens={produto.imagens} nome={produto.nome} />

  return (
    <Tabs.Root defaultValue="3d">
      <Tabs.Panel value="3d" keepMounted className="data-[hidden]:hidden">
        <Visualizador3D modelo={produto.modelo3d} nome={produto.nome} />
      </Tabs.Panel>
      <Tabs.Panel value="fotos" className="data-[hidden]:hidden">
        <Galeria imagens={produto.imagens} nome={produto.nome} />
      </Tabs.Panel>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <Tabs.List
          className="inline-flex rounded-full bg-nevoa p-1 ring-1 ring-menta"
          aria-label="Ver o produto"
        >
          <Tabs.Tab value="3d" className={separador}>
            <Box /> 3D
          </Tabs.Tab>
          <Tabs.Tab value="fotos" className={separador}>
            <Images /> Fotos
          </Tabs.Tab>
        </Tabs.List>
        <p className="text-xs text-muted-foreground">
          Imagem ilustrativa — o produto real pode variar.
        </p>
      </div>
    </Tabs.Root>
  )
}
