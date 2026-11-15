import { CabazesSemana } from './cabazes-semana'
import { Categorias } from './categorias'
import { ComoFunciona } from './como-funciona'
import { Destaques } from './destaques'
import { Hero } from './hero'
import { SobreFazenda } from './sobre'

export default function PaginaInicio() {
  return (
    <>
      <Hero />
      <Destaques />
      <CabazesSemana />
      <Categorias />
      <ComoFunciona />
      <SobreFazenda />
    </>
  )
}
