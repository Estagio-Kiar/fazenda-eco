let webglEmCache: boolean | null = null

/** Detecta se o navegador consegue desenhar WebGL. Sem WebGL mostramos só as fotos. */
export function temWebGL() {
  if (webglEmCache != null) return webglEmCache
  try {
    const c = document.createElement('canvas')
    webglEmCache = !!(
      window.WebGLRenderingContext &&
      (c.getContext('webgl2') || c.getContext('webgl'))
    )
  } catch {
    webglEmCache = false
  }
  return webglEmCache
}

type Ligacao = { saveData?: boolean; effectiveType?: string }

/** O cliente pediu para poupar dados, ou está numa rede lenta (2G)? */
export function devePouparDados() {
  const ligacao = (navigator as Navigator & { connection?: Ligacao }).connection
  return !!ligacao?.saveData || /(^|-)2g$/.test(ligacao?.effectiveType ?? '')
}

export const prefereMenosMovimento = () =>
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

export const eDispositivoTactil = () => window.matchMedia?.('(pointer: coarse)').matches ?? false

export function formatarTamanho(bytes?: number) {
  if (!bytes) return ''
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`
}
