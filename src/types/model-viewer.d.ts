import type { ModelViewerElement } from '@google/model-viewer'
import type { DetailedHTMLProps, HTMLAttributes } from 'react'

type AtributosModelViewer = DetailedHTMLProps<
  HTMLAttributes<ModelViewerElement>,
  ModelViewerElement
> & {
  src?: string
  poster?: string
  alt?: string
  ar?: boolean
  'ar-modes'?: string
  'ar-scale'?: 'auto' | 'fixed'
  'camera-controls'?: boolean
  'touch-action'?: string
  'shadow-intensity'?: string
  exposure?: string
  loading?: 'auto' | 'lazy' | 'eager'
  reveal?: 'auto' | 'manual'
}

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': AtributosModelViewer
    }
  }
}
