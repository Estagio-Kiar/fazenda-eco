/**
 * Gera modelos 3D de TESTE (.glb) para a prova de conceito, sem depender de fotogrametria.
 *
 * Quando houver modelos reais (Polycam / RealityScan + Blender), substitua os ficheiros
 * em public/modelos/ e comprima-os com:
 *   npx gltf-transform optimize entrada.glb public/modelos/tomate.glb --compress meshopt --texture-compress webp --texture-size 1024
 *
 * Uso: node scripts/gerar-modelos.mjs
 */
import { mkdirSync } from 'node:fs'
import path from 'node:path'
import { Document, NodeIO } from '@gltf-transform/core'

const SAIDA = path.resolve(import.meta.dirname, '../public/modelos')
mkdirSync(SAIDA, { recursive: true })

// ---------- geometria ----------

/** Superfície paramétrica f(u, v) com u,v em [0,1]. Normais suaves por acumulação de faces. */
function superficie(f, nu, nv) {
  const pos = []
  for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) pos.push(...f(i / nu, j / nv))
  const idx = []
  for (let j = 0; j < nv; j++)
    for (let i = 0; i < nu; i++) {
      const a = j * (nu + 1) + i
      const b = a + 1
      const c = a + nu + 1
      const d = c + 1
      idx.push(a, c, b, b, c, d)
    }
  return soldarCostura({ pos, idx }, nu, nv)
}

/** Une a costura u=0/u=1 e os pólos para não aparecerem riscas nas normais. */
function soldarCostura(g, nu, nv) {
  const chave = (k) =>
    `${g.pos[k * 3].toFixed(5)},${g.pos[k * 3 + 1].toFixed(5)},${g.pos[k * 3 + 2].toFixed(5)}`
  const mapa = new Map()
  const remap = []
  const pos = []
  const total = (nu + 1) * (nv + 1)
  for (let k = 0; k < total; k++) {
    const c = chave(k)
    if (!mapa.has(c)) {
      mapa.set(c, pos.length / 3)
      pos.push(g.pos[k * 3], g.pos[k * 3 + 1], g.pos[k * 3 + 2])
    }
    remap.push(mapa.get(c))
  }
  const idx = []
  for (let t = 0; t < g.idx.length; t += 3) {
    const a = remap[g.idx[t]]
    const b = remap[g.idx[t + 1]]
    const c = remap[g.idx[t + 2]]
    if (a !== b && b !== c && a !== c) idx.push(a, b, c)
  }
  return { pos, idx }
}

function normais({ pos, idx }) {
  const n = new Float32Array(pos.length)
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]]
    const ax = pos[a * 3],
      ay = pos[a * 3 + 1],
      az = pos[a * 3 + 2]
    const e1 = [pos[b * 3] - ax, pos[b * 3 + 1] - ay, pos[b * 3 + 2] - az]
    const e2 = [pos[c * 3] - ax, pos[c * 3 + 1] - ay, pos[c * 3 + 2] - az]
    const fn = [
      e1[1] * e2[2] - e1[2] * e2[1],
      e1[2] * e2[0] - e1[0] * e2[2],
      e1[0] * e2[1] - e1[1] * e2[0],
    ]
    for (const v of [a, b, c]) for (let k = 0; k < 3; k++) n[v * 3 + k] += fn[k]
  }
  for (let v = 0; v < n.length; v += 3) {
    const l = Math.hypot(n[v], n[v + 1], n[v + 2]) || 1
    n[v] /= l
    n[v + 1] /= l
    n[v + 2] /= l
  }
  return n
}

/** Sólido de revolução: perfil(t) → [raio, y], t em [0,1] de baixo para cima; mod(φ, t) multiplica o raio. */
function revolucao(perfil, { nu = 48, nv = 32, mod = () => 1 } = {}) {
  return superficie(
    (u, v) => {
      const phi = u * Math.PI * 2
      const [r, y] = perfil(v)
      const rr = r * mod(phi, v)
      return [Math.cos(phi) * rr, y, Math.sin(phi) * rr]
    },
    nu,
    nv,
  )
}

/** Ordem: rx, depois rz (inclinar), depois ry (rodar à volta do eixo vertical), depois translação. */
function transformar(g, { s = [1, 1, 1], r = [0, 0, 0], t = [0, 0, 0] }) {
  const [rx, ry, rz] = r
  const pos = []
  for (let k = 0; k < g.pos.length; k += 3) {
    let x = g.pos[k] * s[0],
      y = g.pos[k + 1] * s[1],
      z = g.pos[k + 2] * s[2]
    ;[y, z] = [y * Math.cos(rx) - z * Math.sin(rx), y * Math.sin(rx) + z * Math.cos(rx)]
    ;[x, y] = [x * Math.cos(rz) - y * Math.sin(rz), x * Math.sin(rz) + y * Math.cos(rz)]
    ;[x, z] = [x * Math.cos(ry) + z * Math.sin(ry), -x * Math.sin(ry) + z * Math.cos(ry)]
    pos.push(x + t[0], y + t[1], z + t[2])
  }
  return { pos, idx: g.idx }
}

function juntar(...gs) {
  const pos = []
  const idx = []
  for (const g of gs) {
    const base = pos.length / 3
    pos.push(...g.pos)
    idx.push(...g.idx.map((i) => i + base))
  }
  return { pos, idx }
}

const esfera = (nu = 32, nv = 20) =>
  revolucao((t) => [Math.sin(t * Math.PI), -Math.cos(t * Math.PI)], { nu, nv })

/** Folha: elipsóide achatado, base na origem, aponta para +x. */
const folha = (comp, larg, esp = 0.02) =>
  transformar(esfera(16, 10), { s: [comp / 2, esp, larg / 2], t: [comp / 2, 0, 0] })

// ruído determinístico para dar um ar orgânico
const ruido = (a, b) => {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453
  return s - Math.floor(s)
}

// ---------- modelos ----------

const modelos = {
  tomate() {
    const corpo = revolucao(
      (t) => {
        const a = t * Math.PI
        const r = Math.sin(a)
        let y = -Math.cos(a) * 0.8
        if (t > 0.9) y -= (t - 0.9) * 0.6 // pequena depressão no topo
        return [r, y]
      },
      {
        nu: 64,
        nv: 40,
        mod: (phi, t) => 1 + 0.04 * Math.cos(phi * 5) * Math.pow(Math.sin(t * Math.PI), 2),
      },
    )
    const topo = 0.76
    const sepalas = []
    for (let i = 0; i < 5; i++) {
      const ang = (i / 5) * Math.PI * 2 + 0.3
      sepalas.push(transformar(folha(0.5, 0.17, 0.035), { r: [0, ang, 0.22], t: [0, topo, 0] }))
    }
    const pe = transformar(
      revolucao((t) => [0.045 - t * 0.012, t * 0.22], { nu: 12, nv: 4 }),
      { r: [0, 0, 0.15], t: [0, topo - 0.02, 0] },
    )
    return [
      { nome: 'polpa', geo: corpo, cor: [0.78, 0.07, 0.05], rug: 0.28 },
      { nome: 'sepalas', geo: juntar(...sepalas, pe), cor: [0.18, 0.45, 0.14], rug: 0.6 },
    ]
  },

  laranja() {
    const corpo = revolucao((t) => [Math.sin(t * Math.PI) * 0.98, -Math.cos(t * Math.PI) * 0.95], {
      nu: 72,
      nv: 48,
      mod: (phi, t) => 1 + 0.008 * (ruido(Math.round(phi * 30), Math.round(t * 60)) - 0.5),
    })
    const pe = transformar(
      revolucao((t) => [0.06 * (1 - t * 0.5), t * 0.05], { nu: 12, nv: 3 }),
      {
        t: [0, 0.93, 0],
      },
    )
    const f = transformar(folha(0.55, 0.22, 0.02), { r: [0, 0.6, 0.35], t: [0.02, 0.96, 0] })
    return [
      { nome: 'casca', geo: corpo, cor: [0.94, 0.42, 0.04], rug: 0.55 },
      { nome: 'folha', geo: juntar(pe, f), cor: [0.17, 0.42, 0.13], rug: 0.5 },
    ]
  },

  cenoura() {
    const corpo = revolucao(
      (t) => {
        // t=0 ponta, t=1 topo
        const r = 0.24 * Math.pow(t, 0.55) * (t > 0.96 ? Math.sqrt(Math.max(0, (1 - t) / 0.04)) : 1)
        return [r, -1.1 + t * 2.0]
      },
      {
        nu: 40,
        nv: 48,
        mod: (phi, t) =>
          1 + 0.035 * Math.sin(t * 90) * Math.max(0, 0.9 - t) + 0.01 * Math.cos(phi * 3),
      },
    )
    const ramas = []
    for (let i = 0; i < 6; i++) {
      const ang = (i / 6) * Math.PI * 2
      ramas.push(
        transformar(folha(0.9 + (i % 2) * 0.25, 0.09, 0.03), {
          r: [0, ang, Math.PI / 2 - 0.25 - (i % 3) * 0.12],
          t: [0, 0.88, 0],
        }),
      )
    }
    return [
      {
        nome: 'raiz',
        geo: transformar(corpo, { r: [0, 0, 0.0] }),
        cor: [0.93, 0.36, 0.05],
        rug: 0.5,
      },
      { nome: 'rama', geo: juntar(...ramas), cor: [0.22, 0.5, 0.16], rug: 0.6 },
    ]
  },

  'cebola-roxa'() {
    const corpo = revolucao(
      (t) => {
        const a = t * Math.PI
        const r = Math.sin(a) * (t > 0.6 ? 1 - Math.pow((t - 0.6) / 0.4, 1.6) * 0.9 : 1)
        const y = -Math.cos(a) * 0.8 + (t > 0.6 ? (t - 0.6) * 0.7 : 0)
        return [r, y]
      },
      { nu: 56, nv: 40, mod: (phi) => 1 + 0.012 * Math.cos(phi * 9) },
    )
    const raiz = transformar(
      revolucao((t) => [0.12 * (1 - t), -t * 0.06], { nu: 16, nv: 3 }),
      {
        t: [0, -0.79, 0],
      },
    )
    return [
      { nome: 'bolbo', geo: corpo, cor: [0.48, 0.12, 0.3], rug: 0.35 },
      { nome: 'raiz', geo: raiz, cor: [0.8, 0.72, 0.6], rug: 0.9 },
    ]
  },

  abacate() {
    const corpo = revolucao(
      (t) => {
        const a = t * Math.PI
        const largura = 0.72 + 0.28 * Math.cos(t * Math.PI * 0.9) // mais largo em baixo
        return [Math.sin(a) * largura, -Math.cos(a) * 1.15]
      },
      {
        nu: 56,
        nv: 44,
        mod: (phi, t) => 1 + 0.02 * (ruido(Math.round(phi * 18), Math.round(t * 40)) - 0.5),
      },
    )
    const pe = transformar(
      revolucao((t) => [0.04, t * 0.12], { nu: 10, nv: 2 }),
      { t: [0, 1.12, 0] },
    )
    return [
      { nome: 'casca', geo: corpo, cor: [0.15, 0.25, 0.08], rug: 0.75 },
      { nome: 'pe', geo: pe, cor: [0.35, 0.24, 0.12], rug: 0.9 },
    ]
  },
}

// ---------- exportação ----------

const io = new NodeIO()

for (const [nome, criar] of Object.entries(modelos)) {
  const doc = new Document()
  const buffer = doc.createBuffer()
  const mesh = doc.createMesh(nome)
  for (const parte of criar()) {
    const pos = new Float32Array(parte.geo.pos)
    const n = normais(parte.geo)
    const idx =
      pos.length / 3 > 65535 ? new Uint32Array(parte.geo.idx) : new Uint16Array(parte.geo.idx)
    const mat = doc
      .createMaterial(parte.nome)
      .setBaseColorFactor([...parte.cor, 1])
      .setRoughnessFactor(parte.rug)
      .setMetallicFactor(0)
    const prim = doc
      .createPrimitive()
      .setAttribute(
        'POSITION',
        doc.createAccessor().setType('VEC3').setArray(pos).setBuffer(buffer),
      )
      .setAttribute('NORMAL', doc.createAccessor().setType('VEC3').setArray(n).setBuffer(buffer))
      .setIndices(doc.createAccessor().setType('SCALAR').setArray(idx).setBuffer(buffer))
      .setMaterial(mat)
    mesh.addPrimitive(prim)
  }
  const node = doc.createNode(nome).setMesh(mesh)
  doc.createScene(nome).addChild(node)
  const ficheiro = path.join(SAIDA, `${nome}.glb`)
  await io.write(ficheiro, doc)
  console.log('✓', path.relative(process.cwd(), ficheiro))
}
