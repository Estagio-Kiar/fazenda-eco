import { criarApiHttp } from './api-http'
import type { ApiLoja } from './contrato'
import { apiMock } from './mock/api-mock'

const url = import.meta.env.VITE_API_URL as string | undefined
const forcarMock = import.meta.env.VITE_USE_MOCK === 'true'

/** Usa os dados fictícios enquanto não houver VITE_API_URL (ou se VITE_USE_MOCK=true). */
export const usandoMock = forcarMock || !url
export const api: ApiLoja = usandoMock ? apiMock : criarApiHttp(url!)

export { ErroApi } from './contrato'
export type * from './tipos'
