/** Lista compacta de páginas: 1 … 4 5 6 … 12 */
export function paginasVisiveis(actual: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const s = new Set([1, total, actual - 1, actual, actual + 1].filter((n) => n >= 1 && n <= total))
  const ordenadas = [...s].sort((a, b) => a - b)
  const r: (number | '…')[] = []
  ordenadas.forEach((n, i) => {
    if (i > 0 && n - ordenadas[i - 1] > 1) r.push('…')
    r.push(n)
  })
  return r
}
