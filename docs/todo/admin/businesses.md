# 🏪 Comércios

> Área: admin · Rota: `/admin/businesses` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

A listagem administrativa dos estabelecimentos: quem são, qual ponto do mapa cada um reivindica, e o estado da reivindicação. É a tela que transforma "usuário que marcou que tem comércio" em "dono verificado do ponto X" — e sem ela o [Painel do negócio](../business/dashboard.md) não tem como confiar em quem entra.

Também é onde o admin vê os comércios sem dono: pontos de estabelecimento que ninguém reivindicou, que são alvo natural de prospecção.

**A reivindicação se aprova aqui, não na [Moderação](./moderation.md).** A pergunta das duas telas é diferente: lá é "este ponto merece estar no mapa?", aqui é "esta pessoa é mesmo dona deste ponto?". A primeira julga conteúdo, a segunda julga vínculo — e um ponto já aprovado há meses pode receber um pedido de posse a qualquer momento.

## Por que vale

- Reivindicação de ponto é a única porta de entrada do lado B2B. Sem verificação, qualquer um se declara dono de qualquer lugar e responde avaliação em nome dele.
- É o par administrativo do [Meu ponto](../business/place.md): o dono pede, o admin concede.
- Reusa o padrão de listagem inteiro (`useTableConfig` + `src/components/table/*`) que já roda em `/admin/users` — é `columns.tsx` + `table.tsx`.

## Dependências

| O quê | Situação |
|---|---|
| `tipoUsuario` + `CNPJ` em `tbUsuario` | ❌ a distinção normal/estabelecimento não existe no banco |
| FK `UsuarioDono` em `markers` | ❌ |
| Estado da reivindicação (`pendente`/`aprovada`/`recusada`) | ❌ entidade ou coluna a definir |
| Papel de admin checado na API | 🔴 pré-requisito — hoje qualquer sessão acessa `/admin` |
| Padrão de listagem | 🟢 pronto, portado em `/admin/users` |

## Escopo inicial

- Tabela de estabelecimentos com busca, filtro por estado e paginação
- Detalhe da reivindicação: dados do usuário, ponto pedido, mini-mapa
- Aprovar / recusar com motivo (server actions + `updateTag`)

## Fora do escopo inicial

- Rede com múltiplos pontos por dono
- Planos pagos e cobrança
- Verificação automática por CNPJ em base externa

## O que já existe (2026-08-09)

Tela em `src/app/(app)/admin/businesses/`, portada de um mockup do Claude
Design. **Três abas, porque são três trabalhos diferentes:** `Pedidos
pendentes` (a fila que exige decisão), `Comércios verificados` (onde se revoga,
não se aprova) e `Pontos sem dono` (lista de prospecção, não fila).

| Peça | Arquivo |
|---|---|
| Fila em memória, sinais de risco, decisões | `_components/use-business-claims.ts` |
| Casca de tabela das três abas | `_components/business-table.tsx` |
| Colunas por aba | `columns-claims.tsx`, `columns-verified.tsx`, `columns-unclaimed.tsx` |
| Selos de risco | `_components/risk-signal-badges.tsx` |
| Painel de decisão | `_components/claim-detail-sheet.tsx` |
| Mini-mapa ponto × CNPJ | `_components/claim-map-preview.tsx` |
| Comparação de conflito | `_components/conflict-dialog.tsx` |
| Recusa e revogação | `_components/decision-dialog.tsx` |
| Convite de reivindicação | `_components/invite-dialog.tsx` |

**Tudo sobre `src/mocks/admin-businesses.ts`.** Sai de 🟡 quando `tbUsuario`
tiver `tipoUsuario`/`CNPJ`, `markers` tiver FK de dono e existir entidade de
reivindicação.

### Decisões que o escopo original não previa

- **Cinco sinais de risco por pedido**, e são o coração da tela: `conflito`
  (dois pedidos pelo mesmo ponto), `distancia` (CNPJ a mais de 1 km do pin),
  `dono` (o pedido é transferência, não concessão), `naoComercial` (alguém
  reivindicando parque ou mirante) e `novo` (conta sem histórico). Cada um
  responde a uma forma concreta de fraude.
- **Conflito fecha os dois lados de uma vez.** Aprovar um e deixar o outro na
  fila devolveria o ponto ao perdedor no dia seguinte — daí `resolveConflict`
  receber vencedor e perdedor juntos.
- **Terceiro estado "pedir mais evidência"**, ao lado de aprovar e recusar. É
  o mesmo raciocínio do "devolver ao autor" da [moderação](./moderation.md):
  pedido incompleto não é pedido falso.
- **Distância entre o endereço do CNPJ e o pin.** Consulta externa continua
  fora de escopo, mas comparar o que foi declarado com a coordenada do ponto é
  grátis e é o sinal mais forte disponível.
- **Revogar vínculo** na aba de verificados, com motivo próprio — o doc só
  cobria conceder, e vínculo concedido por engano precisava de saída.
- **"Convidar dono"** nos pontos sem dono, gerando link de reivindicação. Não
  há envio automático: o contato do estabelecimento não existe em lugar nenhum.

### Decisões de implementação

- **`BusinessTable` é casca genérica.** As três abas mostram entidades
  diferentes, mas a moldura — chips ligados a filtro de coluna, tabela, rodapé
  de paginação — é a mesma. Genérica em vez de três cópias porque o que muda é
  só `columns`, e comportamento novo entra num lugar só.
- **Painel lateral, não página nem mestre-detalhe.** Aqui a listagem é o
  trabalho principal (ao contrário da moderação, onde a fila *é* a tela) e o
  admin precisa despachar vários pedidos sem perder posição na tabela.
- **Recusa e revogação no mesmo diálogo.** Mesma forma — motivo de lista
  fechada, observação livre, aviso opcional — e o que muda entre elas é texto.
- **Mini-mapa em SVG com posição ilustrativa.** O pino do CNPJ é jogado longe
  quando a distância passa de 1 km; não é projeção real, e a pergunta ("esses
  dois endereços são o mesmo lugar?") não pede mais que perto × longe.
- **`COMMERCIAL_CATEGORIES` foi para `src/constants/categories.ts`** — é
  conhecimento de produto, não desta tela.

### Pendências visíveis na tela

- Seleção múltipla na fila existe mas não tem ação em lote
- Miniaturas de evidência não abrem o anexo
- Os contadores de "comércios verificados" e "pontos sem dono" saem do tamanho
  das listas mock, não de um agregado
