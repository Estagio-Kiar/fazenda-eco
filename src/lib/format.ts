const kwanza = new Intl.NumberFormat('pt-AO', {
  style: 'currency',
  currency: 'AOA',
  maximumFractionDigits: 0,
})

/** Formata um valor em kwanzas, ex.: 1 500 Kz */
export function formatarKz(valor: number) {
  return kwanza.format(Math.round(valor)).replace(/ /g, ' ')
}

const numero = new Intl.NumberFormat('pt-AO', { maximumFractionDigits: 2 })

export function formatarNumero(valor: number) {
  return numero.format(valor)
}

/** Arredonda quantidades fraccionadas (ex.: 1,5 kg) sem erros de vírgula flutuante. */
export function arredondar(valor: number, casas = 2) {
  const f = 10 ** casas
  return Math.round(valor * f) / f
}
