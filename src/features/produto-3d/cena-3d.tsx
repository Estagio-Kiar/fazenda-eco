import { ContactShadows, OrbitControls, useGLTF } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'

export type ControlosCena = {
  aproximar: () => void
  afastar: () => void
  rodar: (radianos: number) => void
  repor: () => void
}

type Props = {
  url: string
  nome: string
  onPronto?: () => void
  onControlos?: (c: ControlosCena) => void
}

const POSICAO_INICIAL = new THREE.Vector3(0, 1.1, 5.6)
const DIST_MIN = 2.4
const DIST_MAX = 8

/** Carrega o .glb, normaliza o tamanho (2 unidades de altura) e assenta-o no "chão" (y = -1). */
function Modelo({ url, onPronto }: { url: string; onPronto?: () => void }) {
  const { scene } = useGLTF(url)
  const objecto = useMemo(() => {
    const copia = scene.clone(true)
    const caixa = new THREE.Box3().setFromObject(copia)
    const tamanho = caixa.getSize(new THREE.Vector3())
    const escala = 2 / Math.max(tamanho.x, tamanho.y, tamanho.z)
    copia.scale.setScalar(escala)
    const centro = caixa.getCenter(new THREE.Vector3()).multiplyScalar(escala)
    copia.position.set(-centro.x, -centro.y + (tamanho.y * escala) / 2 - 1, -centro.z)
    copia.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).castShadow = true
    })
    return copia
  }, [scene])

  useEffect(() => {
    onPronto?.()
  }, [objecto, onPronto])

  return <primitive object={objecto} />
}

/** Expõe zoom/rotação/repor para os botões e para o teclado (acessibilidade). */
function Controlos({ onControlos }: { onControlos?: (c: ControlosCena) => void }) {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as OrbitControlsImpl | null
  const invalidate = useThree((s) => s.invalidate)

  useEffect(() => {
    if (!controls || !onControlos) return
    const zoom = (factor: number) => {
      const alvo = controls.target
      const dir = camera.position.clone().sub(alvo)
      const d = THREE.MathUtils.clamp(dir.length() * factor, DIST_MIN, DIST_MAX)
      camera.position.copy(alvo.clone().add(dir.setLength(d)))
      controls.update()
      invalidate()
    }
    onControlos({
      aproximar: () => zoom(0.8),
      afastar: () => zoom(1.25),
      rodar: (r) => {
        controls.setAzimuthalAngle(controls.getAzimuthalAngle() + r)
        controls.update()
        invalidate()
      },
      repor: () => {
        camera.position.copy(POSICAO_INICIAL)
        controls.target.set(0, 0, 0)
        controls.update()
        invalidate()
      },
    })
  }, [camera, controls, invalidate, onControlos])

  return null
}

/**
 * Cena 3D do produto. Este ficheiro (e o Three.js) só é descarregado quando o cliente pede o 3D.
 * frameloop="demand": só desenha quando há movimento, para poupar bateria em telemóveis modestos.
 */
export default function Cena3D({ url, nome, onPronto, onControlos }: Props) {
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.75]}
      shadows={false}
      camera={{ position: POSICAO_INICIAL.toArray(), fov: 35, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      aria-label={`Modelo 3D de ${nome}`}
      role="img"
    >
      <hemisphereLight args={['#ffffff', '#cfe8c4', 1.1]} />
      <directionalLight position={[3, 5, 4]} intensity={2.2} />
      <directionalLight position={[-4, 2, -3]} intensity={0.6} color="#e3f2dc" />
      {/* O aviso «A preparar o 3D…» fica fora do canvas (drei <Html> num fallback dá erros ao desmontar). */}
      <Suspense fallback={null}>
        <Modelo url={url} onPronto={onPronto} />
        <ContactShadows
          position={[0, -1.005, 0]}
          opacity={0.35}
          scale={5}
          blur={2.4}
          far={2}
          frames={1}
          color="#1f3d2b"
        />
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        dampingFactor={0.12}
        minDistance={DIST_MIN}
        maxDistance={DIST_MAX}
        minPolarAngle={0.25}
        maxPolarAngle={Math.PI / 1.9}
        target={[0, 0, 0]}
      />
      <Controlos onControlos={onControlos} />
    </Canvas>
  )
}
