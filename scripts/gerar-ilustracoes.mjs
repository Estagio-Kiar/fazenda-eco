/**
 * Gera ilustrações SVG provisórias dos produtos (public/produtos) e os posters dos modelos 3D (public/modelos).
 * São IMAGENS ILUSTRATIVAS para desenvolvimento: devem ser substituídas pelas fotos reais da fazenda.
 *
 * Uso: node scripts/gerar-ilustracoes.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const RAIZ = path.resolve(import.meta.dirname, '../public')
mkdirSync(path.join(RAIZ, 'produtos'), { recursive: true })
mkdirSync(path.join(RAIZ, 'modelos'), { recursive: true })

let uid = 0
const id = (p) => `${p}${++uid}`

/** Esfera com brilho (gradiente radial). */
function bola(cx, cy, r, cor, escura, { rx, ry } = {}) {
  const g = id('g')
  return `<defs><radialGradient id="${g}" cx="35%" cy="30%" r="75%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".25" stop-color="${cor}"/><stop offset="1" stop-color="${escura}"/></radialGradient></defs>
<ellipse cx="${cx}" cy="${cy}" rx="${rx ?? r}" ry="${ry ?? r}" fill="url(#${g})"/>`
}

const folhaPath = (x, y, comp, larg, rot, cor = '#3e8e2e') =>
  `<path transform="translate(${x} ${y}) rotate(${rot})" d="M0 0 C ${comp * 0.3} ${-larg} ${comp * 0.75} ${-larg} ${comp} 0 C ${comp * 0.75} ${larg} ${comp * 0.3} ${larg} 0 0Z" fill="${cor}"/>
<path transform="translate(${x} ${y}) rotate(${rot})" d="M2 0 L ${comp * 0.9} 0" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`

const sombra = (cx = 200, cy = 320, rx = 120) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${rx * 0.14}" fill="#1f3d2b" opacity=".12"/>`

// ---------------- ilustrações ----------------

const arte = {
  tomate: () =>
    sombra() +
    bola(200, 210, 110, '#e3342a', '#9e1510', { rx: 120, ry: 100 }) +
    [0, 72, 144, 216, 288]
      .map((a) => folhaPath(200, 118, 60, 14, a - 90 + 20, '#3e8e2e'))
      .join('') +
    `<rect x="195" y="88" width="10" height="34" rx="5" fill="#2f6b23"/>`,

  'tomate-cereja': () =>
    sombra(200, 320, 130) +
    `<path d="M120 110 C 170 80 240 80 290 110" stroke="#2f6b23" stroke-width="7" fill="none" stroke-linecap="round"/>` +
    [
      [130, 200],
      [205, 175],
      [280, 205],
      [170, 265],
      [245, 270],
    ]
      .map(
        ([x, y], i) =>
          `<path d="M${x} ${y - 45} L ${[150, 205, 260, 175, 240][i]} ${[115, 92, 118, 105, 112][i]}" stroke="#2f6b23" stroke-width="4"/>` +
          bola(x, y, 46, '#e8392c', '#a3160f'),
      )
      .join(''),

  laranja: () =>
    sombra() +
    bola(200, 210, 112, '#f7931e', '#c75a00') +
    folhaPath(205, 102, 80, 22, -30, '#2f7a25') +
    `<circle cx="200" cy="102" r="7" fill="#5b6b2a"/>`,

  tangerina: () =>
    sombra(200, 320, 140) +
    bola(145, 225, 80, '#ff8f1f', '#c95200', { rx: 86, ry: 74 }) +
    bola(255, 215, 85, '#ff9a2a', '#cf5a00', { rx: 92, ry: 78 }) +
    folhaPath(255, 140, 70, 18, -40, '#2f7a25'),

  maracuja: () =>
    sombra() +
    bola(200, 210, 105, '#7b3f8c', '#3d1747') +
    `<g fill="#fff" opacity=".25">${Array.from({ length: 14 }, (_, i) => `<circle cx="${150 + ((i * 37) % 110)}" cy="${150 + ((i * 53) % 120)}" r="3"/>`).join('')}</g>` +
    `<path d="M200 106 q 5 -25 22 -32" stroke="#4b6b2a" stroke-width="7" fill="none" stroke-linecap="round"/>`,

  'cebola-roxa': () =>
    sombra() +
    `<path d="M200 70 C 214 120 300 140 300 220 C 300 285 255 315 200 315 C 145 315 100 285 100 220 C 100 140 186 120 200 70Z" fill="#8e3a6b"/>` +
    `<path d="M200 80 C 240 140 270 170 262 260" stroke="#c76a9e" stroke-width="5" fill="none" opacity=".7"/><path d="M200 80 C 165 140 132 175 140 262" stroke="#c76a9e" stroke-width="5" fill="none" opacity=".7"/><path d="M200 80 L 200 300" stroke="#c76a9e" stroke-width="4" opacity=".5"/>` +
    `<path d="M160 120 C 140 160 135 200 145 230" stroke="#fff" stroke-opacity=".35" stroke-width="10" fill="none" stroke-linecap="round"/>`,

  abacate: () =>
    sombra() +
    `<path d="M200 75 C 245 75 255 140 285 200 C 315 265 270 320 200 320 C 130 320 85 265 115 200 C 145 140 155 75 200 75Z" fill="#355e1e"/>` +
    `<path d="M200 125 C 230 125 238 170 255 210 C 275 255 245 290 200 290 C 155 290 125 255 145 210 C 162 170 170 125 200 125Z" fill="#c9df7a"/>` +
    `<circle cx="200" cy="235" r="40" fill="#8a5a2b"/><circle cx="188" cy="222" r="10" fill="#fff" opacity=".25"/>`,

  manga: () => {
    const g = id('m')
    return (
      sombra() +
      `<defs><linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#e2452c"/><stop offset=".45" stop-color="#f6b400"/><stop offset="1" stop-color="#6fae3a"/></linearGradient></defs>` +
      `<path d="M110 200 C 100 120 190 80 250 105 C 320 135 320 250 260 300 C 200 345 120 290 110 200Z" fill="url(#${g})"/>` +
      `<path d="M140 170 C 150 140 175 120 205 115" stroke="#fff" stroke-opacity=".4" stroke-width="10" fill="none" stroke-linecap="round"/>` +
      `<rect x="240" y="88" width="8" height="26" rx="4" fill="#5b4a2a" transform="rotate(20 244 100)"/>`
    )
  },

  banana: () =>
    sombra(200, 320, 140) +
    [0, 1, 2, 3]
      .map(
        (i) =>
          `<path transform="translate(${i * 14 - 20} ${i * 18})" d="M120 120 C 110 220 190 290 300 260 C 305 252 300 245 292 246 C 200 262 150 210 150 120Z" fill="${['#f6c624', '#f2bf1c', '#eab515', '#e2ab10'][i]}" stroke="#b8860b" stroke-width="2"/>`,
      )
      .join('') +
    `<rect x="102" y="100" width="56" height="30" rx="8" fill="#6b5a2a"/>`,

  ananas: () => {
    const c = id('clip')
    return (
      sombra() +
      [-50, -25, 0, 25, 50].map((a) => folhaPath(200, 125, 95, 15, -90 + a, '#3e8e2e')).join('') +
      `<defs><clipPath id="${c}"><ellipse cx="200" cy="225" rx="85" ry="100"/></clipPath></defs>` +
      `<ellipse cx="200" cy="225" rx="85" ry="100" fill="#e0a21a"/>` +
      `<g clip-path="url(#${c})" stroke="#9c6b0d" stroke-width="3" opacity=".7">${Array.from({ length: 12 }, (_, i) => `<path d="M${40 + i * 28} 120 L ${-60 + i * 28} 330"/><path d="M${-60 + i * 28} 120 L ${40 + i * 28} 330"/>`).join('')}</g>`
    )
  },

  cenoura: () =>
    sombra(200, 325, 120) +
    [-30, -10, 10, 30].map((a) => folhaPath(225, 95, 85, 10, -90 + a + 20, '#3e8e2e')).join('') +
    `<path d="M190 95 C 230 85 265 100 262 120 C 250 190 180 290 130 320 C 120 326 112 318 118 308 C 150 240 165 160 190 95Z" fill="#f07a1a"/>` +
    `<g stroke="#b9530a" stroke-width="3" stroke-linecap="round" opacity=".6"><path d="M200 150 l 25 5"/><path d="M180 200 l 22 6"/><path d="M160 250 l 18 5"/></g>`,

  'batata-doce': () =>
    sombra(200, 320, 140) +
    `<path d="M80 230 C 70 180 140 150 220 160 C 300 170 335 210 320 245 C 300 285 210 290 150 280 C 110 272 85 260 80 230Z" fill="#9b4a5c"/>` +
    `<path d="M120 200 C 160 185 210 185 250 192" stroke="#fff" stroke-opacity=".3" stroke-width="9" fill="none" stroke-linecap="round"/>`,

  mandioca: () =>
    sombra(200, 320, 150) +
    [0, 1, 2]
      .map(
        (i) =>
          `<path transform="translate(0 ${i * 38}) rotate(${-8 + i * 6} 200 200)" d="M60 190 C 120 165 260 165 345 195 C 350 200 345 206 338 205 C 260 200 140 215 70 215 C 55 212 52 196 60 190Z" fill="${['#7a5236', '#6c4830', '#835a3c'][i]}"/>`,
      )
      .join(''),

  alface: () =>
    sombra() +
    [
      [200, 220, 120, '#8cc75f'],
      [150, 200, 80, '#7cb86a'],
      [250, 200, 80, '#7cb86a'],
      [200, 175, 75, '#a4d878'],
      [200, 230, 60, '#c8e89c'],
    ]
      .map(([x, y, r, c]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`)
      .join('') +
    `<g stroke="#5f9a3e" stroke-width="3" fill="none" opacity=".6"><path d="M200 300 C 190 240 160 200 130 170"/><path d="M200 300 C 210 240 240 200 270 170"/></g>`,

  couve: () =>
    sombra() +
    [-55, -25, 5, 35]
      .map((a, i) =>
        folhaPath(
          200,
          315,
          210 - i * 10,
          55,
          -90 + a,
          ['#2f7a25', '#3e8e2e', '#2f7a25', '#3e8e2e'][i],
        ),
      )
      .join(''),

  gindungo: () =>
    sombra(200, 320, 130) +
    [0, 1, 2, 3, 4]
      .map(
        (i) =>
          `<g transform="rotate(${-40 + i * 20} 200 300)"><path d="M193 140 C 205 140 212 170 210 230 C 208 270 200 290 198 290 C 194 288 188 260 188 220 C 188 170 186 140 193 140Z" fill="${['#d41f1f', '#e8342a', '#c41a1a', '#ef4b2c', '#d02626'][i]}"/><path d="M196 140 l -2 -22" stroke="#2f6b23" stroke-width="6" stroke-linecap="round"/></g>`,
      )
      .join(''),

  pimento: () =>
    sombra() +
    `<path d="M130 140 C 120 100 180 110 200 125 C 220 110 280 100 270 140 C 300 200 290 300 240 310 C 220 313 210 300 200 300 C 190 300 180 313 160 310 C 110 300 100 200 130 140Z" fill="#2e8b3a"/>` +
    `<path d="M150 150 C 140 190 140 240 155 280" stroke="#fff" stroke-opacity=".3" stroke-width="10" fill="none" stroke-linecap="round"/>` +
    `<path d="M200 125 C 200 105 210 92 225 88" stroke="#3f6b23" stroke-width="10" fill="none" stroke-linecap="round"/>`,

  abobora: () =>
    sombra(200, 320, 150) +
    [
      [120, 70, '#e07a1f'],
      [280, 70, '#e07a1f'],
      [160, 80, '#f08c2a'],
      [240, 80, '#f08c2a'],
      [200, 82, '#f79b38'],
    ]
      .map(([x, rx, c]) => `<ellipse cx="${x}" cy="225" rx="${rx}" ry="95" fill="${c}"/>`)
      .join('') +
    `<path d="M200 135 C 198 110 205 95 222 88" stroke="#5a6b2a" stroke-width="14" fill="none" stroke-linecap="round"/>`,

  milho: () =>
    sombra(200, 325, 110) +
    folhaPath(200, 320, 230, 45, -112, '#7cb86a') +
    folhaPath(200, 320, 230, 45, -68, '#6aa858') +
    `<ellipse cx="200" cy="200" rx="52" ry="118" fill="#f2c230"/>` +
    `<g fill="#f7d24f" stroke="#d9a41a" stroke-width="1.5">${Array.from({ length: 8 }, (_, r) => Array.from({ length: 4 }, (_, c) => `<rect x="${168 + c * 16}" y="${110 + r * 24}" width="14" height="20" rx="6"/>`).join('')).join('')}</g>`,

  feijao: () =>
    sombra(200, 325, 140) +
    `<path d="M80 200 C 80 290 140 320 200 320 C 260 320 320 290 320 200Z" fill="#c9a26b"/><ellipse cx="200" cy="200" rx="120" ry="28" fill="#a5814e"/>` +
    `<g>${Array.from({ length: 22 }, (_, i) => `<ellipse cx="${100 + ((i * 41) % 200)}" cy="${180 + ((i * 17) % 30)}" rx="13" ry="9" fill="${i % 3 ? '#8a2f2a' : '#a8443c'}" transform="rotate(${(i * 37) % 180} ${100 + ((i * 41) % 200)} ${180 + ((i * 17) % 30)})"/>`).join('')}</g>`,

  ovos: () =>
    sombra(200, 325, 150) +
    `<rect x="70" y="230" width="260" height="70" rx="16" fill="#d9c7a3"/>` +
    [110, 170, 230, 290]
      .map((x, i) =>
        bola(x, 215, 34, ['#f3e2c4', '#eed6b0', '#f5e7cf', '#ecd2a8'][i], '#c9a874', {
          rx: 32,
          ry: 44,
        }),
      )
      .join(''),

  mel: () => {
    const g = id('mel')
    return (
      sombra() +
      `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f7b733"/><stop offset="1" stop-color="#c77d05"/></linearGradient></defs>` +
      `<rect x="125" y="120" width="150" height="190" rx="28" fill="url(#${g})"/>` +
      `<rect x="135" y="92" width="130" height="36" rx="8" fill="#2e7d32"/>` +
      `<rect x="145" y="185" width="110" height="70" rx="10" fill="#fff"/>` +
      `<circle cx="200" cy="220" r="18" fill="#f2b705"/><circle cx="200" cy="220" r="7" fill="#1f3d2b"/>` +
      `<rect x="145" y="140" width="14" height="150" rx="7" fill="#fff" opacity=".3"/>`
    )
  },

  cabaz: () =>
    sombra(200, 330, 160) +
    bola(150, 165, 48, '#e3342a', '#9e1510') +
    bola(235, 160, 50, '#f7931e', '#c75a00') +
    `<path d="M175 100 C 205 90 225 100 222 115 C 215 160 200 180 190 185 C 180 160 172 130 175 100Z" fill="#f07a1a"/>` +
    folhaPath(280, 150, 70, 22, -60, '#3e8e2e') +
    `<path d="M70 190 L 330 190 L 300 315 L 100 315Z" fill="#c69149"/>` +
    `<g stroke="#9c6b2f" stroke-width="4" opacity=".7"><path d="M80 225 L 320 225"/><path d="M90 260 L 310 260"/><path d="M98 292 L 302 292"/></g>` +
    `<path d="M110 190 C 110 70 290 70 290 190" stroke="#9c6b2f" stroke-width="10" fill="none"/>`,

  'cabaz-fruta': () =>
    sombra(200, 330, 160) +
    bola(140, 160, 46, '#f7931e', '#c75a00') +
    `<path d="M175 90 C 170 150 210 185 265 175 C 268 171 265 167 260 168 C 220 172 195 150 195 90Z" fill="#f6c624"/>` +
    bola(255, 160, 44, '#7b3f8c', '#3d1747') +
    `<path d="M70 190 L 330 190 L 300 315 L 100 315Z" fill="#c69149"/>` +
    `<g stroke="#9c6b2f" stroke-width="4" opacity=".7"><path d="M80 225 L 320 225"/><path d="M90 260 L 310 260"/><path d="M98 292 L 302 292"/></g>`,

  'cabaz-salada': () =>
    sombra(200, 330, 160) +
    `<circle cx="160" cy="160" r="55" fill="#8cc75f"/><circle cx="175" cy="150" r="35" fill="#a4d878"/>` +
    bola(250, 165, 40, '#e3342a', '#9e1510') +
    `<path d="M285 120 C 295 125 300 150 296 180" stroke="#2e8b3a" stroke-width="22" stroke-linecap="round" fill="none"/>` +
    `<path d="M70 190 L 330 190 L 300 315 L 100 315Z" fill="#c69149"/>` +
    `<g stroke="#9c6b2f" stroke-width="4" opacity=".7"><path d="M80 225 L 320 225"/><path d="M90 260 L 310 260"/><path d="M98 292 L 302 292"/></g>`,
}

function svg(conteudo, { fundo = '#F6FBF4', transform = '' } = {}) {
  const g = id('bg')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="800" height="800">
<defs><radialGradient id="${g}" cx="50%" cy="40%" r="70%"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="${fundo}"/></radialGradient></defs>
<rect width="400" height="400" fill="url(#${g})"/>
<g transform="${transform}">${conteudo}</g>
</svg>`
}

// slug do produto → arte
export const PRODUTOS = {
  'tomate-maduro': 'tomate',
  'tomate-cereja': 'tomate-cereja',
  'laranja-do-dande': 'laranja',
  tangerina: 'tangerina',
  maracuja: 'maracuja',
  'cebola-roxa': 'cebola-roxa',
  abacate: 'abacate',
  'manga-rosa': 'manga',
  'banana-pao': 'banana',
  ananas: 'ananas',
  cenoura: 'cenoura',
  'batata-doce': 'batata-doce',
  mandioca: 'mandioca',
  'alface-crespa': 'alface',
  couve: 'couve',
  gindungo: 'gindungo',
  'pimento-verde': 'pimento',
  abobora: 'abobora',
  'milho-fresco': 'milho',
  'feijao-catarino': 'feijao',
  'ovos-caseiros': 'ovos',
  'mel-do-planalto': 'mel',
  'cabaz-familia': 'cabaz',
  'cabaz-fruta': 'cabaz-fruta',
  'cabaz-salada': 'cabaz-salada',
}

for (const [slug, chave] of Object.entries(PRODUTOS)) {
  const desenho = arte[chave]
  writeFileSync(path.join(RAIZ, 'produtos', `${slug}.svg`), svg(desenho()))
  writeFileSync(
    path.join(RAIZ, 'produtos', `${slug}-2.svg`),
    svg(desenho(), {
      fundo: '#E3F2DC',
      transform: 'translate(200 200) scale(1.25) rotate(-8) translate(-200 -205)',
    }),
  )
}

// posters dos modelos 3D (fundo verde névoa, como o visualizador)
for (const m of ['tomate', 'laranja', 'cenoura', 'cebola-roxa', 'abacate']) {
  writeFileSync(path.join(RAIZ, 'modelos', `${m}-poster.svg`), svg(arte[m](), { fundo: '#F6FBF4' }))
}

console.log(`✓ ${Object.keys(PRODUTOS).length * 2} ilustrações + 5 posters`)
