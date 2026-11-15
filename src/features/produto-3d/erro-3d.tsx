import { Component, type ReactNode } from 'react'

/** Se o 3D falhar (ficheiro em falta, GPU sem memória…), voltamos às fotos sem partir a página. */
export class LimiteErro3D extends Component<
  { onErro: (e: Error) => void; children: ReactNode },
  { falhou: boolean }
> {
  state = { falhou: false }
  static getDerivedStateFromError() {
    return { falhou: true }
  }
  componentDidCatch(erro: Error) {
    this.props.onErro(erro)
  }
  render() {
    return this.state.falhou ? null : this.props.children
  }
}
