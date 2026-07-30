# 📋 TODO — módulos pendentes por área

> Rastreio do que ainda não existe, organizado por área do sistema. Cada módulo tem um `.md` próprio com a ideia desenvolvida, dependências e escopo inicial.
>
> Isto complementa o [backlog técnico da wiki](../wiki/12-gap-modelo-vs-implementacao.md) — lá vive a dívida técnica (segurança, migrations, proxy); aqui vivem os **módulos de produto** que populam a sidebar.

## Convenção de status

| Status | Significado |
|---|---|
| 💤 | Não iniciado |
| 🔨 | Em desenvolvimento |
| 🟡 | Parcial — funciona com limitações |
| ✅ | Entregue |

Regra: concluiu um módulo → atualiza o status aqui e no `.md` dele, **na mesma entrega**.

---

## 👤 Usuário público (`user/`)

| Módulo | Rota | Status | Depende de |
|---|---|---|---|
| [Descobrir](./user/explore.md) | `/explore` | 💤 | Nada bloqueia (melhora com `Categoria`/`Analise`) |
| [Favoritos](./user/favorites.md) | `/favorites` | 💤 | `Favorita` |
| [Minhas visitas](./user/visits.md) | `/visits` | 💤 | `Visita` |
| [Conquistas](./user/achievements.md) | `/achievements` | 💤 | `Conquista` + `GanhaConquista` |
| [Feed](./user/feed.md) | `/feed` | 💤 | `Segue` + `Analise` |
| [Comunidade](./user/community.md) | `/users` | 💤 | Nada bloqueia (ranking precisa de `Analise`/`Visita`) |
| [Estatísticas](./user/stats.md) | `/stats` | 💤 | `Visita` |
| [Notificações](./user/notifications.md) | `/notifications` | 💤 | Entidade nova `Notificacao` |
| [Configurações](./user/settings.md) | `/settings` | 💤 | `PATCH` parcial de usuário na API |
| [Sobre](./user/about.md) | `/about` | 💤 | Nada |

## 🏪 Estabelecimento (`business/`)

| Módulo | Rota | Status | Depende de |
|---|---|---|---|
| [Painel do negócio](./business/dashboard.md) | `/business` | 💤 | `tipoUsuario` + `Analise` + `Visita` |
| [Responder avaliações](./business/reviews.md) | `/business/reviews` | 💤 | `Analise` + `Comentario` |
| [Meu ponto](./business/place.md) | `/business/place` | 💤 | `tipoUsuario` + FK `UsuarioDono` em markers |

## 🛡️ Admin (`admin/`)

| Módulo | Rota | Status | Depende de |
|---|---|---|---|
| [Dashboard](./admin/dashboard.md) | `/admin` | 💤 | Nada bloqueia |
| [Categorias](./admin/categories.md) | `/admin/categories` | 💤 | Tabela `Categoria` (CRUD simples) |
| [Moderação](./admin/moderation.md) | `/admin/moderation` | 💤 | Coluna `status` em markers |
| [Conquistas (catálogo)](./admin/achievements.md) | `/admin/achievements` | 💤 | Tabela `Conquista` |
| [Denúncias](./admin/reports.md) | `/admin/reports` | 💤 | Entidade nova `Denuncia` |

---

## 🚦 Ordem sugerida

1. **[Categorias](./admin/categories.md)** — destrava categoria em todo o resto e é o caso de uso perfeito pra reusar o padrão de tabela
2. **[Descobrir](./user/explore.md)** — funciona parcialmente com os dados de hoje
3. **[Painel do negócio](./business/dashboard.md)** — o módulo que mais justifica o produto (persona do Augusto) e ainda não tem nenhuma tela

> ⚠️ Nada disso antes da prioridade 0/1 do [backlog técnico](../wiki/12-gap-modelo-vs-implementacao.md): proxy dos markers e autenticação na API. Módulo novo sobre API pública aberta só aumenta a superfície.
