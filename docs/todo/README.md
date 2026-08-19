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
| [Descobrir](./user/explore.md) | `/discover` | 🟡 | Tela pronta sobre `src/mocks/markers.ts` — falta o modelo real do ponto. Absorveu `/places` em 2026-08-17; a trilha personalizada espera `Visita` |
| [Perfil](./user/profile.md) | `/profile` | 💤 | Nada bloqueia o básico (contadores precisam de `Visita`/`Analise`) |
| [Favoritos](./user/favorites.md) | `/favorites` | 💤 | `Favorita` |
| [Minhas visitas](./user/visits.md) | `/visits` | 💤 | `Visita` |
| [Conquistas](./user/achievements.md) | `/achievements` | 💤 | `Conquista` + `GanhaConquista` |
| [Feed](./user/feed.md) | `/feed` | 🟡 | Tela pronta sobre `src/mocks/feed.ts` — faltam `Analise`, `Visita`, `Favorita` e `GanhaConquista`. **Sem `Segue`: o feed não tem grafo social** |
| [Comunidade](./user/community.md) | `/community` | 🟡 | Telas prontas sobre `src/mocks/{community,stories}.ts` — faltam `Analise`/`Visita` e a entidade de pauta. Inclui `/community/[id]` e `/pautas/[slug]` |
| [Estatísticas](./user/stats.md) | `/stats` | 💤 | `Visita` |
| [Notificações](./user/notifications.md) | `/notifications` | 💤 | Entidade nova `Notificacao` — ⚠️ sem rota nem item de sidebar |
| [Configurações](./user/settings.md) | `/settings` | 💤 | `PATCH` parcial de usuário na API — ⚠️ sem rota nem item de sidebar |
| [Sobre](./user/about.md) | `/about` | 💤 | Nada — ⚠️ sem rota nem item de sidebar |

> ⚠️ Os três marcados foram escritos antes de a navegação fechar no Figma e **não existem** como rota nem na sidebar. Precisam entrar em algum grupo de `src/constants/navigation.ts` ou serem movidos para `/docs/archive`.

## 🛡️ Admin (`admin/`)

| Módulo | Rota | Status | Depende de |
|---|---|---|---|
| [Dashboard](./admin/dashboard.md) | `/admin/dashboard` | 🟡 | Tela pronta sobre `src/mocks/admin-dashboard.ts` — falta `GET /api/admin/stats` |
| [Categorias](./admin/categories.md) | `/admin/categories` | 🟡 | Tela pronta sobre `src/mocks/admin-categories.ts` — falta a tabela `Categoria` |
| [Moderação](./admin/moderation.md) | `/admin/moderation` | 🟡 | Tela pronta sobre `src/mocks/admin-moderation.ts` — falta coluna `status` em markers |
| [Conquistas (catálogo)](./admin/achievements.md) | `/admin/achievements` | 🟡 | Tela pronta sobre `src/mocks/admin-achievements.ts` — falta a tabela `Conquista` |
| [Denúncias e feedback](./admin/reports.md) | `/admin/reports` | 🟡 | Tela pronta sobre `src/mocks/admin-reports.ts` — faltam `Denuncia` e `Feedback` |
| [Avaliações](./admin/reviews.md) | `/admin/reviews` | 🟡 | Tela pronta sobre `src/mocks/admin-reviews.ts` — faltam `Analise` e `Comentario` |

> `/admin/users` não aparece aqui porque já está entregue — este índice rastreia pendência, não o que existe.

---

## 🚦 Ordem sugerida

1. **Expansão do modelo de Ponto** ([proposta](../propostas/2026-08-03-expansao-modelo-ponto.md)) — é o que tira [Descobrir](./user/explore.md) do parcial. Tela pronta esperando só o dado chegar; enquanto isso, foto, categoria, tags e nota são fixos em `src/mocks/markers.ts`
2. **[Categorias](./admin/categories.md)** — destrava categoria como entidade (hoje é constante no front) e é o caso de uso perfeito pra reusar o padrão de tabela

> ⚠️ Nada disso antes da prioridade 0/1 do [backlog técnico](../wiki/12-gap-modelo-vs-implementacao.md): proxy dos markers e autenticação na API. Módulo novo sobre API pública aberta só aumenta a superfície.
