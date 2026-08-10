# 🛂 Moderação de pontos

> Área: admin · Rota: `/admin/moderation` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

Fila de aprovação do conteúdo que entra no mapa: ponto criado por usuário nasce `pendente` e só aparece publicamente depois do aceite do admin. A tela é a fila — dados do ponto, quem criou, mini-mapa da localização, aprovar/rejeitar (rejeição com motivo).

A coluna `status` em `PontoNoMapa` **já estava no modelo lógico do TCC** — o desenho sempre previu moderação; nunca foi implementada.

Esta fila julga **o ponto**, não quem o reivindica: pedido de posse é vínculo entre pessoa e empresa e vive em [Comércios](./businesses.md).

## Por que vale

- Mapa é vitrine pública: um ponto-lixo ("asdasd" no meio da praça) destrói a confiança que é a tese do produto.
- Duplicatas são inevitáveis com criação aberta; a fila é onde se detecta ("já existe ponto a 30m com nome parecido").
- Fecha os casos de uso do ator Administrador do TCC (remover conteúdo).

## Dependências

| O quê | Situação |
|---|---|
| Coluna `status` em `markers` (`pendente`/`aprovado`/`rejeitado`) | ❌ — prevista no modelo, nunca criada |
| Filtro de status no `GET /api/markers` público (só aprovados) | ❌ |
| Papel de admin | 🔴 pré-requisito |
| Aviso ao criador sobre o resultado | 💤 vira tipo em [Notificações](../user/notifications.md) |

**Decisão a tomar:** pontos já existentes entram como aprovados (grandfathering) — trivial, mas precisa estar no script da migração.

## Escopo inicial

- Fila com padrão de tabela + painel de detalhe com mini-mapa
- Aprovar / rejeitar com motivo (server actions)
- Alerta de possível duplicata por proximidade + nome similar

## Fora do escopo inicial

- Moderação de avaliações/comentários (é do módulo [Denúncias e feedback](./reports.md))
- Aprovação de reivindicação de ponto (é [Comércios](./businesses.md))
- Auto-aprovação por reputação do criador

## O que já existe (2026-08-09)

Tela inteira em `src/app/(app)/admin/moderation/`, portada de um mockup feito
no Claude Design. Layout **mestre-detalhe** (fila à esquerda, revisão à
direita), não tabela + modal: moderar é trabalho repetitivo e o admin precisa
varrer a fila sem perder o contexto do item.

| Peça | Componente |
|---|---|
| Estado da fila, filtros, seleção, desfazer | `_components/use-moderation-queue.ts` |
| Quatro números do topo | `moderation-stats.tsx` |
| Fila + filtros + ação em lote | `queue-panel.tsx`, `queue-item.tsx` |
| Painel de revisão + barra de decisão | `point-review.tsx` |
| Ficha com completude | `point-fields.tsx` |
| Card do autor | `author-card.tsx` |
| Mini-mapa da vizinhança | `neighborhood-map.tsx` |
| Rejeição com motivo · comparação de duplicata | `reject-dialog.tsx`, `duplicate-dialog.tsx` |
| Aba de auditoria | `history-table.tsx` |

**Tudo sobre `src/mocks/admin-moderation.ts`** — decidir só troca o `status` no
array em memória. Sai de 🟡 quando `markers` tiver `status` e as Server Actions
de aprovar/devolver/rejeitar existirem.

### Decisões que o escopo original não previa

- **Terceiro estado: "devolvido ao autor".** O doc só tinha aprovar/rejeitar.
  Ponto incompleto não é ponto ruim, e rejeitar afasta contribuidor — a fila
  ganhou `devolvido` e um contador próprio no topo.
- **Taxa de aprovação do autor** no painel de revisão. É o dado que mais
  acelera a decisão: 24 de 25 aprovados passa rápido, 0 de 3 pede lupa.
- **Motivo de rejeição em lista fechada** (`REJECTION_REASONS`), com observação
  livre opcional. Texto livre não vira métrica de fila nem mensagem decente
  para quem enviou.
- **Vizinhos no mini-mapa.** O escopo pedia "alerta de duplicata"; sem ver o
  que já existe em volta, o alerta não é acionável. Daí também a comparação
  lado a lado com "Mesclar no existente".
- **Barra de completude** contando os 10 campos do formulário, com campo vazio
  aparecendo como "não informado" em vez de sumir da ficha. Amarra com o
  gráfico "Qualidade de dados" do [dashboard](./dashboard.md).
- **Atalhos de teclado** `A`/`D`/`R` e `J`/`K`, com a decisão avançando
  sozinha para o próximo item.

### Decisões de implementação

- **Mini-mapa é SVG, não MapLibre.** Aqui não se navega — só se responde "tem
  coisa colada neste pin?". Uma instância de mapa por seleção custaria estilo,
  tiles e ciclo de vida para entregar a mesma resposta. As ruas são
  decorativas; só os pins carregam dado (`vizinhos`, em coordenada normalizada).
- **Tokens `--success` e `--warning`** entraram no `globals.css` com variantes
  correspondentes no `Badge`. Só de estado, nunca de marca: o azul continua
  sendo a cor do produto.
- **Desfazer é o `action` do toast do sonner**, sobre um único snapshot da
  lista anterior. A janela de arrependimento é a última decisão, e só.
- **Página fecha altura com `h-dvh`**: o `main` de `(app)/layout.tsx` é
  `min-h-screen overflow-hidden`, então sem altura fechada a lista seria
  cortada em vez de rolar.

### Pendências visíveis na tela

- Contador ao lado de "Moderação" na sidebar (o mockup tem; depende do
  agregado `GET /api/admin/stats`)
- "Desfazer" da aba Histórico é decorativo
- O modal de rejeição não persiste motivo nem observação em lugar nenhum
