# 🏷️ Categorias

> Área: admin · Rota: `/admin/categories` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

CRUD do catálogo de categorias de ponto (restaurante, café, bar, parque, cultura…): nome, ícone e cor — os dois últimos são o que deixa o mapa legível, com pin visualmente distinto por tipo.

**É o primeiro módulo a fazer, de propósito:** é a tabela mais simples do modelo (`CategoriaID` + descrição, mais ícone/cor), destrava categoria em todos os outros módulos (filtros do RF-11/12, cards do Descobrir, comparativo do painel do negócio) e é o caso de uso perfeito pra **reusar o padrão de tabela** recém-portado — a prova de que a próxima tela custa só `columns.tsx` + `table.tsx`.

## Por que vale

- Pré-requisito de meio produto: busca com filtro, mapa com pins distintos, "aberto agora" por tipo.
- Valida o investimento no padrão de listagem: se esta tela sair rápido, o padrão pagou.
- Primeiro passo concreto do caminho `markers` → `PontoNoMapa` completo.

## Dependências

| O quê | Situação |
|---|---|
| Tabela `Categoria` | ❌ — a mais simples do modelo do TCC |
| `CategoriaID` FK em `markers` | ❌ — segunda etapa, com backfill dos pontos existentes |
| `CategoriesController` na API | ❌ — CRUD idêntico ao de markers |
| Papel de admin | 🔴 pré-requisito da área toda |

## Escopo inicial

- Migration/DDL da tabela + endpoint CRUD
- Tela no padrão: tabela + modais de criar/editar/excluir no slot global
- Seletor de ícone (subset do lucide) e cor
- Proteção contra excluir categoria em uso (ou reatribuição obrigatória)

## Fora do escopo inicial

- Subcategorias/hierarquia
- Sugestão de categoria por usuário comum (moderada)

## O que já existe (2026-08-09)

Tela em `src/app/(app)/admin/categories/`, portada de um mockup do Claude
Design. **A aposta do padrão de listagem se confirmou em parte:** busca,
ordenação, visibilidade de coluna, paginação e o sheet de filtro vieram de
`useTableConfig` + `src/components/table/*` + `SheetFilterDialog` sem tocar em
nada compartilhado. O que custou foi o que é específico do domínio — pin,
alerta de cor e reatribuição na exclusão.

| Peça | Arquivo |
|---|---|
| Catálogo em memória, CRUD, reordenação, colisão de cor | `_components/use-categories.ts` |
| Colunas | `_components/columns.tsx` |
| Toolbar (busca + sheet + colunas) | `_components/toolbar.tsx`, `filter-form.tsx` |
| Tabela | `_components/categories-table.tsx` |
| Pin como aparece no mapa | `_components/category-pin.tsx` |
| Faixa "Conjunto no mapa" | `_components/map-preview-strip.tsx` |
| Criar/editar com preview ao vivo | `_components/category-form-dialog.tsx` |
| Excluir com reatribuição | `_components/delete-category-dialog.tsx` |
| Ícones e paleta liberados | `src/constants/categories.ts` |
| Schemas | `src/validations/categories.ts` |

**Tudo sobre `src/mocks/admin-categories.ts`.** As contagens de `pontos` batem
com a rosca do [dashboard](./dashboard.md) — enquanto as duas forem mock, mexer
numa exige mexer na outra.

### Decisões que o escopo original não previa

- **Slug, e ele não é editável.** O doc só citava nome/ícone/cor, mas filtro por
  URL (`/discover?categoria=cafeteria`) precisa de chave estável. Ele deriva do
  nome via `slugify` na hora de salvar, com sufixo numérico quando colide.
  Campo editável seria um identificador público que o admin quebra sem
  perceber, levando junto todo link já compartilhado.
- **Alerta de colisão de cor.** Distância RGB < 70 entre duas categorias marca
  a linha e avisa dentro do formulário antes de salvar. Duas cores parecidas
  tornam o mapa ilegível, e isso é invisível olhando uma linha por vez.
- **Faixa "Conjunto no mapa"**, com todos os pins ativos juntos — a paleta só
  se julga como sistema.
- **Pin renderizado no formato final** em vez de amostra de cor quadrada, na
  tabela e nas três pré-visualizações do formulário (mapa, chip de filtro, card
  de local).
- **"Desativar em vez de excluir"** oferecido dentro do diálogo de exclusão. É
  o que o admin quase sempre queria: preserva histórico e some do filtro.
- **Duplicar nasce inativa.** Cópia publicada antes de trocar cor e ícone é
  exatamente como se cria a colisão que a tela denuncia.

### Decisões de implementação

- **Diálogo local, não rota do slot `@modals`.** `/admin/users` navega para
  `admin/users/update/[id]`, mas ali existe API. Aqui o catálogo vive em
  `useState`: uma rota separada leria o mock original e salvaria no vazio.
  Migra para `@modals` junto com a API.
- **Três filtros fora do `ColumnFiltersState`.** Status até caberia numa
  coluna, mas faixa de pontos e alerta de cor comparam a categoria com o
  catálogo inteiro — nenhum `filterFn` de coluna enxerga isso. A tela filtra os
  dados antes de entregá-los à tabela.
- **Ordem por "Mover para cima/baixo" no menu da linha**, não arrastar. O
  mockup previa alça de arraste; drag-and-drop exigiria uma dependência nova
  (`dnd-kit`) para uma tela com dez linhas.
- **`CATEGORY_ICONS` é mapa explícito**, não resolução de ícone por nome em
  runtime: mantém o bundle tree-shakeable e impede o banco de guardar nome de
  ícone que sumiu num bump da lucide.
- **`columns` é fábrica**, não constante como em `/admin/users`, porque as
  ações abrem diálogo em vez de navegar — os callbacks entram por parâmetro, e
  o objeto de ações precisa chegar memoizado ou a tabela remonta.

### Pendências visíveis na tela

- Seleção múltipla existe mas não tem ação em lote
- Reatribuição de pontos só mexe no contador; não há ponto de verdade para
  reatribuir enquanto `markers` não tiver `CategoriaID`
