# Fazenda: loja online (front-end)

Loja online da Fazenda, com os produtos apresentados em 3D. Projecto da **KIAR Group**.

- Front-end (UI/UX e Arquitetura Técnica): Goven Leya
- Back-end (API): Artur M. Paulo

> Estado: **partes 1 a 6 concluídas** (fundação, design system, prova de conceito 3D, camada de dados,
> início + catálogo, produto + carrinho). Por agora a loja funciona com **dados fictícios** (mock), até a API estar pronta.

## Começar

Precisa do Node.js 20.19 ou mais recente.

```bash
npm install
npm run dev          # http://localhost:5173
```

| Comando                     | O que faz                                                        |
| --------------------------- | ---------------------------------------------------------------- |
| `npm run dev`               | Servidor de desenvolvimento                                      |
| `npm run build`             | Verifica os tipos e gera a versão de produção em `dist/`         |
| `npm run preview`           | Serve a versão de produção localmente                            |
| `npm run verificar`         | Tipos + ESLint + Prettier + testes (correr antes de cada commit) |
| `npm test`                  | Testes (Vitest)                                                  |
| `npm run format`            | Formata o código com o Prettier                                  |
| `npm run gerar:modelos`     | Gera os modelos 3D de teste em `public/modelos/`                 |
| `npm run gerar:ilustracoes` | Gera as ilustrações provisórias em `public/produtos/`            |

### Ligar à API

Copie `.env.example` para `.env.local` e preencha:

```env
VITE_API_URL=http://localhost:3000/api
VITE_USE_MOCK=false
```

Sem `VITE_API_URL` (ou com `VITE_USE_MOCK=true`) a loja usa os dados fictícios de `src/api/mock/`.

## Páginas

| Rota                  | Página                                                                                                                                                 | Parte |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ----- |
| `/`                   | Início: Hero com 3D, destaques, cabazes, categorias, como funciona, sobre                                                                              | 5     |
| `/loja`               | Catálogo com filtros (categoria, preço, época, promoções), pesquisa, ordenação e paginação. Os filtros ficam no endereço (`?categoria=frutas&min=500`) | 5     |
| `/produto/:slug`      | Visualizador 3D + fotos, preço por kg/unidade, stock, quantidade, relacionados                                                                         | 6     |
| `/cabazes`            | Cabazes da semana                                                                                                                                      | 5     |
| `/carrinho`           | Quantidades, subtotal, zona e custo de entrega, cupões                                                                                                 | 6     |
| `/favoritos`          | Produtos guardados                                                                                                                                     | 6     |
| `/guia`               | Guia de componentes (design system)                                                                                                                    | 2     |
| `/checkout`, `/conta` | Reservadas (em construção)                                                                                                                             | 7     |
| `/admin`              | Reservada (em construção)                                                                                                                              | 8     |

Cupões de teste (mock): `FAZENDA10` (10%), `BEMVINDO` (1 000 Kz a partir de 8 000 Kz), `ENTREGAGRATIS`.

## Estrutura

```
src/
  api/                 contrato da API, tipos, cliente HTTP, mock e consultas (TanStack Query)
    contrato.ts        interface ApiLoja: o que o front precisa da API
    tipos.ts           Produto, Cabaz, Categoria, Cupao, ZonaEntrega…
    api-http.ts        implementação com fetch (endpoints propostos)
    mock/              dados fictícios + implementação mock
    consultas.ts       chaves e funções de cada pedido
  components/
    ui/                componentes base (botão, selo, sheet, diálogo, carrossel, slider…)
    layout/            cabeçalho, rodapé, layout raiz
  features/            organização por funcionalidade
    inicio/  catalogo/  produto/  produto-3d/  carrinho/  favoritos/  cabazes/  guia/  em-breve/
  lib/                 utilitários (cn, formatação em kwanzas)
  rotas.tsx            rotas (React Router 7), cada página num ficheiro à parte
public/
  modelos/             .glb de teste + posters
  produtos/            ilustrações provisórias (SUBSTITUIR por fotos reais)
scripts/               geradores dos modelos e ilustrações de teste
```

## Identidade visual

A paleta do relatório (A.4) está em `src/index.css` como variáveis do tema Tailwind:
`bg-nevoa`, `bg-menta`, `border-salvia`, `text-folha`, `bg-campo` / `bg-primary`, `text-floresta`,
`text-cinza-verde` / `text-muted-foreground`, `bg-amarelo`, `text-vermelho` / `text-destructive`.

Regras: nunca usar verde folha, sálvia ou amarelo como cor de texto sobre branco. Os botões de compra
são verde campo com texto branco. O amarelo é só para promoções e selos, sempre com texto verde floresta.

## Produtos em 3D

- `features/produto-3d/visualizador-3d.tsx` mostra primeiro o **poster** e só descarrega o Three.js e o
  modelo quando o cliente toca em «Ver em 3D». No Hero o 3D carrega sozinho quando fica visível,
  **excepto** se o cliente tiver o modo de poupança de dados ou estiver numa rede 2G.
- `frameloop="demand"`: só desenha quando há movimento (poupa bateria).
- Sem WebGL, ou se o modelo falhar, a página mostra as fotos e um aviso.
- Controlos por teclado: setas para rodar, `+`/`-` para zoom, `0` para repor.
- «Ver em AR» abre o `<model-viewer>` da Google (Scene Viewer no Android, Quick Look no iPhone).
  Só é descarregado quando o cliente abre o diálogo.
- Na grelha do catálogo usamos só imagens; o 3D aparece apenas na página do produto e no Hero.

Os modelos em `public/modelos/` são **de teste**, gerados por código (`npm run gerar:modelos`). Para um
modelo real (Polycam / RealityScan + Blender):

```bash
npx gltf-transform optimize entrada.glb public/modelos/tomate.glb \
  --texture-compress webp --texture-size 1024
```

Meta: 1 a 3 MB por modelo. Evite a compressão Draco: o descodificador vem de um CDN externo.
A Meshopt funciona no visualizador, mas convém testar o «Ver em AR» no Android antes de a usar.

## Publicação (Render)

A loja é publicada no Render como **site estático**, com a configuração em `render.yaml`:

1. Fazer push para a branch `main` no GitHub.
2. No Render: **New → Blueprint** e escolher o repositório `Estagio-Kiar/fazenda-girassol`.
3. O Render corre `npm ci && npm run build` e publica a pasta `dist`. Cada push para `main` publica de novo.

Notas:

- A regra de rewrite (`/*` → `/index.html`) é obrigatória: sem ela, abrir `/loja` directamente ou fazer refresh dá 404.
- As variáveis `VITE_` são lidas no build. Depois de as mudar, fazer **Manual Deploy → Clear build cache & deploy**.
- Quando a API existir: `VITE_USE_MOCK=false` e `VITE_API_URL=https://<api>.onrender.com`. A API tem de permitir (CORS) o endereço da loja.

## Para acertar com o back-end (Artur)

O contrato está em `src/api/contrato.ts` e os caminhos propostos em `src/api/api-http.ts`:

| Método | Caminho                                                                                       | Notas                                                       |
| ------ | --------------------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| GET    | `/produtos?q=&categoria=&epoca=&preco_min=&preco_max=&promocao=&ordenar=&pagina=&por_pagina=` | Devolve `{ itens, total, pagina, porPagina, totalPaginas }` |
| GET    | `/produtos?id=…&id=…`                                                                         | Favoritos                                                   |
| GET    | `/produtos/:slug`                                                                             | 404 se não existir                                          |
| GET    | `/produtos/destaques`                                                                         |                                                             |
| GET    | `/produtos/:slug/relacionados?limite=8`                                                       |                                                             |
| GET    | `/categorias` · `/cabazes` · `/cabazes/:slug` · `/zonas-entrega`                              |                                                             |
| POST   | `/cupoes/validar` `{ codigo, subtotal }`                                                      | 4xx com `{ mensagem }` se inválido                          |

Campos do produto para o 3D: `model_url` e `poster_url` (no front: `modelo3d.modeloUrl` / `posterUrl`).
Os erros devem vir como `{ "mensagem": "…" }`. Quando o Swagger estiver pronto, gerar os tipos a partir dele
(por exemplo com `openapi-typescript`) e alinhar `src/api/tipos.ts`.

## Notas técnicas

- **Versões:** a stack segue o relatório, com dois ajustes:
  - **Vitest 4** em vez de 3, porque o 3 não suporta o Vite 8.
  - **three 0.183**, porque é a versão que o `<model-viewer>` 4.4 exige.
- **`.npmrc` com `legacy-peer-deps=true`:** o npm 10 tem um erro ao resolver os peers opcionais do Vitest 4.
- **Motion em modo lazy** (`LazyMotion` + componentes `m.`): as animações chegam num ficheiro à parte.
  Use sempre `m.div`, nunca `motion.div`.
- **Carrinho e favoritos** ficam guardados no navegador (Zustand + localStorage). Os preços guardados são uma
  cópia; no checkout (parte 7) a API tem de confirmar preços e stock.
- O **jQuery**, o **React Hook Form** e o **Zod** já estão instalados, para a parte 7 (checkout e widget de pagamento).
- **Conteúdo provisório:** imagens, contactos, preços e o texto «Sobre» precisam de ser confirmados no levantamento (fase 1).

## Próximas partes

7. Checkout e conta do cliente (React Hook Form + Zod, autenticação, encomendas, pagamento)
8. Painel `/admin` (produtos, stock, encomendas, upload de fotos e `.glb`)
9. Testes ponta-a-ponta (Playwright), desempenho em telemóveis e publicação no Render
