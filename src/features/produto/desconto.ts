export const percentagemDesconto = (preco: number, anterior?: number) =>
  anterior ? Math.round((1 - preco / anterior) * 100) : 0
