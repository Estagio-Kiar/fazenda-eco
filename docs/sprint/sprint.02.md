# SPRINT 02 — DESENVOLVIMENTO DO PAINEL ADMINISTRATIVO

## 1. Informações gerais

| Campo | Informação |
|---|---|
| Projeto | Fazenda Eco — E-commerce Agrícola e Gestão de Stock (KIAR) |
| Sprint | Sprint 02 |
| Responsável | Goven (desenvolvimento frontend); Sprint Leader (planeamento e acompanhamento) |
| Data de início | 17/11/2026 |
| Data de término | 20/11/2026 |
| Estado | Planeado |

## 2. Objetivo do Sprint

Desenvolver a primeira versão visual e navegável do painel administrativo, permitindo demonstrar os principais ambientes de gestão, a navegação entre módulos e as diferenças de acesso entre perfis de utilizador.

Nesta fase, a informação será simulada através de dados mockados, sem integração com a API ou com a base de dados. O resultado deverá ser uma interface consistente, organizada e suficientemente funcional para uma demonstração do produto à KIAR.

## 3. Missões atribuídas

### Missão 01 — Estrutura e navegação do painel administrativo

- **Responsável:** Goven
- **Descrição:** Criar a estrutura principal do painel administrativo e estabelecer a navegação entre os diferentes módulos.
- **Prioridade:** Alta
- **Prazo:** 17/11/2026
- **Estado:** Pendente

**Orientações técnicas:**
- Integrar o logótipo e a identidade visual definidos para o projecto.
- Criar o layout principal, a sidebar, o cabeçalho, as rotas e a estrutura das páginas.
- Criar os ambientes de Super Admin e Supervisor e adaptar a navegação ao perfil simulado.
- Manter uma interface profissional, intuitiva e responsiva.

**Critérios de aceitação:**
- [ ] O painel apresenta uma estrutura visual consistente.
- [ ] Os menus permitem navegar entre as páginas.
- [ ] Os dois perfis apresentam experiências de navegação distintas.
- [ ] A interface adapta-se a diferentes dimensões de ecrã.

**Entrega esperada:**

Layout administrativo funcional, navegação entre páginas e estrutura inicial dos ambientes de Super Admin e Supervisor.

---

### Missão 02 — Dashboard administrativo

- **Responsável:** Goven
- **Descrição:** Desenvolver o dashboard principal com indicadores e informações relevantes para o acompanhamento geral da operação.
- **Prioridade:** Alta
- **Prazo:** 18/11/2026
- **Estado:** Pendente

**Orientações técnicas:**
- Utilizar dados fictícios e coerentes, mantendo os dados mockados separados dos componentes visuais.
- Preparar os serviços frontend como camada de acesso aos dados, para permitir substituir futuramente os mocks por chamadas à API.
- Não implementar integrações reais com serviços externos.

**Critérios de aceitação:**
- [ ] Os indicadores apresentam informações coerentes.
- [ ] Os gráficos são alimentados por dados simulados.
- [ ] As informações são visualmente compreensíveis.
- [ ] O dashboard apresenta uma visão geral da operação, incluindo encomendas, stock, pagamentos e actividade recente.

**Entrega esperada:**

Dashboard visualmente completo, com gráficos e indicadores funcionais alimentados por dados fictícios organizados.

---

### Missão 03 — Gestão administrativa

- **Responsável:** Goven
- **Descrição:** Desenvolver as primeiras interfaces de gestão de utilizadores, funcionários, clientes e permissões.
- **Prioridade:** Alta
- **Prazo:** 19/11/2026
- **Estado:** Pendente

**Orientações técnicas:**
- Apresentar dados fictícios coerentes e separar os dados mockados da interface.
- Incluir utilizadores, funcionários, clientes individuais e empresas.
- Demonstrar os perfis e as permissões associadas, incluindo as diferenças entre Super Admin e Supervisor.

**Critérios de aceitação:**
- [ ] As páginas apresentam dados fictícios coerentes.
- [ ] As tabelas permitem visualizar e organizar as informações.
- [ ] As interfaces apresentam acções visuais de gestão.
- [ ] As diferenças entre perfis são demonstráveis.

**Entrega esperada:**

Interfaces de gestão de utilizadores, funcionários e clientes, bem como uma interface demonstrativa de perfis e permissões.

---

### Missão 04 — Autenticação simulada e consolidação

- **Responsável:** Goven
- **Descrição:** Preparar uma experiência demonstrativa de acesso ao painel e consolidar as funcionalidades desenvolvidas.
- **Prioridade:** Alta
- **Prazo:** 20/11/2026
- **Estado:** Pendente

**Orientações técnicas:**
- Implementar apenas autenticação demonstrativa com credenciais fictícias; não implementar autenticação real.
- Permitir seleccionar ou alternar entre perfis de demonstração e adaptar a navegação ao perfil seleccionado.
- Rever a consistência visual, estados vazios e mensagens de feedback.
- Não utilizar dados pessoais reais nem integrar serviços externos.

**Critérios de aceitação:**
- [ ] O utilizador consegue simular a entrada no painel.
- [ ] É possível demonstrar diferentes perfis.
- [ ] Os menus e páginas apresentados correspondem ao perfil seleccionado.
- [ ] A aplicação permite simular o encerramento de sessão.
- [ ] Os principais fluxos de navegação funcionam correctamente.

**Entrega esperada:**

Página de login demonstrativa, simulação de acesso por perfil, navegação consolidada e aplicação preparada para demonstração.

---

## 4. Dependências e observações

- **Dependências:** Disponibilidade do logótipo e da identidade visual definidos para o projecto.
- **Restrições:** Não fazem parte deste Sprint a integração com a API, a persistência de dados na base de dados, a autenticação real, a gestão real de sessões, a implementação efectiva de permissões, a autenticação de dois factores (2FA), a geração e validação de códigos de recuperação, a verificação de identidade por SMS ou e-mail, as integrações com serviços externos nem operações reais de encomendas, stock e pagamentos.
- **Observações:** As restrições de acesso por perfil são apenas demonstrativas. A autorização efectiva deverá ser implementada e validada no backend. Os serviços frontend devem permitir substituir os mocks pela API sem alterações significativas nos componentes visuais. Pode-se utilizar IA para gerar os dados mockados, tomando como referência o schema Prisma do backend para manter os campos, relações e formatos coerentes com o modelo de dados. Os dados gerados devem ser fictícios e não conter informações pessoais reais.

Estrutura de referência para os dados mockados e serviços:

```text
src/
├── mocks/
│   ├── users.mock.ts
│   ├── employees.mock.ts
│   ├── clients.mock.ts
│   ├── products.mock.ts
│   ├── orders.mock.ts
│   ├── stock.mock.ts
│   └── dashboard.mock.ts
├── services/
│   ├── users.service.ts
│   ├── clients.service.ts
│   └── dashboard.service.ts
└── ...
```

Esta estrutura é uma orientação e poderá ser adaptada à organização existente no projecto.

O painel deverá contemplar dois ambientes demonstrativos:

- **Super Admin:** visão global da operação; gestão de utilizadores, funcionários, clientes, empresas, perfis e permissões; acesso visual aos módulos de catálogo, stock, encomendas, pagamentos e logística.
- **Supervisor:** visão operacional; consulta de informações relevantes para as operações; acompanhamento de stock, preparação de encomendas e consulta de entregas e actividades operacionais.

## 5. Entregáveis do Sprint

- [ ] Painel administrativo com a identidade visual do projecto e navegação funcional.
- [ ] Dashboard com indicadores e gráficos simulados de encomendas, stock e pagamentos.
- [ ] Interfaces iniciais de gestão administrativa e de perfis demonstrativos.
- [ ] Ambientes de demonstração para Super Admin e Supervisor.
- [ ] Autenticação simulada e encerramento de sessão demonstrativo.
- [ ] Dados mockados organizados e preparados para futura substituição pela API.
- [ ] Aplicação preparada para apresentação e avaliação.

## 6. Regras de execução

1. Respeitar a arquitectura e a estrutura de pastas definidas para o projecto.
2. Não criar novas estruturas ou dependências arquitecturais sem alinhamento com a equipa.
3. Manter o código organizado e seguir as convenções estabelecidas.
4. Realizar commits com mensagens claras e relacionadas com as alterações.
5. Não considerar uma missão concluída sem cumprir os respectivos critérios de aceitação.
6. Comunicar antecipadamente bloqueios ou dificuldades que possam comprometer os prazos.
7. Actualizar o estado das missões durante a execução.
8. Utilizar apenas dados fictícios e coerentes; não utilizar dados pessoais reais.
9. Não antecipar funcionalidades dependentes da conclusão do backend ou de integrações reais.

Uma missão será considerada concluída quando todas as actividades previstas estiverem implementadas, os critérios de aceitação forem cumpridos, os dados forem coerentes e fictícios, a interface estiver integrada na estrutura geral da aplicação, não existirem erros que impeçam os fluxos demonstrativos e o resultado estiver disponível para revisão.

O Sprint será considerado concluído quando a aplicação apresentar uma experiência administrativa navegável, consistente e preparada para demonstração.

## 7. Revisão do Sprint

Preencher no final do Sprint.

**Resultados alcançados:**
- [Descrever o que foi concluído.]

**Missões não concluídas:**
- [Identificar as actividades pendentes e justificar.]

**Problemas encontrados:**
- [Registar dificuldades técnicas ou organizacionais.]

**Observações para o próximo Sprint:**
- [Identificar melhorias, dependências ou tarefas a dar continuidade.]

## 8. Aprovação

| Responsabilidade | Nome | Estado |
|---|---|---|
| Responsável pelo Sprint | Sprint Leader | Pendente / Validado |
| Responsável pela revisão | [Nome] | Pendente / Validado |

---

*Documento de acompanhamento e execução do Sprint. As missões devem ser consideradas concluídas após a validação dos respectivos critérios de aceitação.*
