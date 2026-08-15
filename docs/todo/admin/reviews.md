# ⭐ Avaliações

> Área: admin · Rota: `/admin/reviews` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

A visão administrativa de todas as avaliações da plataforma, em listagem única com busca por local ou autor, filtro por nota e ordenação por data. O admin lê, e remove o que viola as regras — com o motivo registrado.

É a única tela que enxerga avaliação **fora** do contexto do local. As outras duas veem um recorte: o estabelecimento vê só as do próprio ponto ([Responder avaliações](../business/reviews.md)), e a [Moderação](./moderation.md) vê só as que alguém denunciou.

## Por que vale

- Avaliação é o conteúdo mais sensível do produto: é o que sustenta a confiança que é a tese, e o que mais atrai abuso (nota comprada, vingança contra concorrente).
- Padrão de nota anômalo — dez avaliações 5 estrelas no mesmo dia, no mesmo lugar — só aparece olhando o conjunto, nunca uma a uma.
- Fecha o caso de uso "remover conteúdo" do ator Administrador do TCC.

## Dependências

| O quê | Situação |
|---|---|
| `Analise` | ❌ não existe — já modelada no TCC |
| `Comentario` (a conversa pendurada na avaliação) | ❌ |
| Papel de admin checado na API | 🔴 pré-requisito |
| Padrão de listagem | 🟢 pronto, portado em `/admin/users` |
| Registro de quem removeu e por quê | ❌ decidir se vira log próprio ou coluna de exclusão lógica |

## Escopo inicial

- Tabela com busca por local/autor, filtro por nota e ordenação por data
- Remoção com motivo obrigatório, por server action
- Exclusão lógica, não física: avaliação removida some da vitrine mas fica auditável

## Fora do escopo inicial

- Detecção automática de avaliação suspeita
- Edição do texto de avaliação alheia — admin remove, nunca reescreve
- Fila de denúncias, que é [Denúncias e feedback](./reports.md)

## O que já existe (2026-08-15)

Tela em `src/app/(app)/admin/reviews/`, desenhada direto no código (sem passar
pelo Claude Design). KPIs no topo + listagem no padrão do projeto.

| Peça | Arquivo |
|---|---|
| Estado, sinais derivados, remoção lógica | `_components/use-reviews.ts` |
| Quatro KPIs | `_components/reviews-stats.tsx` |
| Colunas e ações de linha | `_components/columns.tsx` |
| Linha com painel expansível | `_components/review-row.tsx` |
| Chips de filtro | `_components/toolbar.tsx` |
| Tabela + barra de lote | `_components/reviews-table.tsx` |

**Tudo sobre `src/mocks/admin-reviews.ts`** — 33 avaliações, 3 já removidas.

### A peça compartilhada, que era o aviso desta página

A fronteira que este doc já registrava foi cumprida **antes** da API existir:

- `src/constants/content-removal.ts` — `REMOVAL_REASONS` saiu de
  `mocks/admin-reports.ts`. Motivo de remoção é conhecimento de produto, não
  dado fictício, e é o vocabulário que as duas telas precisam dividir.
- `src/components/blocks/removal-dialog.tsx` — promovido de
  `admin/reports/_components/`, com `count` novo para remoção em lote.
  `/admin/reports` continua chamando sem `count`.
- `src/components/blocks/star-rating.tsx` — promovido pelo mesmo motivo.

Quando a Server Action nascer, ela já encontra as duas telas falando igual.

### Sinais: três categorias formais

| Categoria | Como se decide |
|---|---|
| `Suspeita de spam` | flag no registro |
| `Duplicada` | mesmo autor já avaliou o mesmo local |
| `Discrepante` | \|nota − média do local\| ≥ 2,5, com o local tendo ≥ 4 avaliações |

`Duplicada` e `Discrepante` são **derivadas do conjunto** — é o que esta página
quer dizer com "só aparece olhando o conjunto". `spam` é flag porque marcar
exige analisar texto, e fingir que temos classificador seria mentira.

Os limiares moram nomeados em `use-reviews.ts` (`DISCREPANCY_THRESHOLD = 2.5`,
`MIN_REVIEWS_FOR_AVERAGE = 4`), com o porquê do número no comentário.

**A rajada de notas máximas não vira selo.** Detectar janela temporal seria a
heurística complicada que o escopo evita; ela aparece pivotando "Ver todas
deste local", que é a ação construída para isso.

### Decisões

- **Ações de pivô são o coração da tela.** "Ver todas deste autor" e "Ver todas
  deste local" custam um `setColumnFilters` e transformam a linha numa lente
  sobre o conjunto — sem elas o padrão anômalo continua invisível.
- **Remoção em lote**, com um motivo só para todas. Achar dez avaliações
  fraudulentas do mesmo dia e remover uma a uma é castigo.
- **Removidas ficam na mesma tabela**, atrás do chip de Status, com quem
  removeu e por quê no painel expandido. Exclusão lógica precisa de vitrine
  auditável, e uma aba separada seria superfície a mais.
- **Linha expansível, não tabela aninhada.** Sub-row do TanStack serve para
  dado da mesma forma em hierarquia; comentário tem forma diferente de
  avaliação, e tabela dentro de tabela traria coluna, ordenação e paginação
  para dois ou três itens. `RowCommon` compartilhado ficou intocado — ele serve
  seis telas e não deve ganhar expansão por causa de uma.
- **`src/types/review.ts` e `src/validations/review.ts` foram apagados.** Eram
  órfãos da era firebase (`rating`/`content`/`username` em inglês,
  `createdAt?: any`, sem referência a local), sem nenhum importador.

### Pendências visíveis na tela

- A variação da nota média é fixa no mock
- A observação do diálogo de remoção não é persistida
- "Abrir o local" aponta para `/places/[id]` com o id do mock, que pode não
  existir no banco

## Fronteira com as telas vizinhas

Esta tela e [Denúncias e feedback](./reports.md) removem a mesma coisa por caminhos diferentes: aqui o admin varre por conta própria, lá ele reage ao que a comunidade sinalizou. **A remoção precisa ser uma única server action**, consumida pelas duas — duas implementações divergem no primeiro ajuste de regra, e o motivo deixa de ser registrado igual.
