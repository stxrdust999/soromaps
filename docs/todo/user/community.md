# 👥 Comunidade

> Área: usuário público · Rota: `/community` · Status: 💤 não iniciado

## Ideia

O diretório social: busca de usuários por nome e perfis públicos (avaliações, conquistas, lugares visitados). Complementa com um **ranking de contribuidores** — geral e por bairro.

**Sem seguir ninguém.** A decisão de 2026-08-17 tirou `Segue` do produto: o [Feed](./feed.md) é montado por vínculo com lugar, não por grafo de pessoas. Aqui isso significa que o perfil público não tem botão de seguir nem contador de seguidores — o que qualifica alguém é contribuição registrada e o selo de explorador verificado.

O recorte por bairro é deliberado: em ranking geral só os 10 mais ativos aparecem; por bairro, quase todo usuário ativo é top de alguma coisa. Reconhecimento distribuído é retenção distribuída.

## Por que vale

- Perfil público com histórico dá contexto à avaliação ("quem é essa pessoa que avaliou?") — a dor nº 2, confiança. Sem seguidores, é o histórico que faz esse papel.
- Ranking ataca a dor nº 6 (reconhecimento).

## Dependências

| O quê | Situação |
|---|---|
| Busca de usuários | 🟢 `GET /api/users` existe (precisa de filtro por nome no server p/ escalar) |
| Perfil público (`/community/[id]`) | ❌ rota não existe; `/profile` atual é placeholder |
| `Segue` | 🚫 fora de escopo por decisão — ver [Feed](./feed.md) |
| `Analise`/`Visita` (conteúdo do perfil e critério do ranking) | ❌ |
| Privacidade: API não devolver e-mail/hash em perfil público | 🔴 DTO de saída — item de segurança do backlog |

## Escopo inicial

- `/community` com busca + cards de usuário
- `/community/[id]` público: nome, desde quando, contadores, conquistas em destaque
- Ranking simples por contagem de avaliações (quando `Analise` existir)
- **Selo de explorador verificado** no perfil e ao lado do nome onde ele aparece (comentário em destaque na página do ponto, ranking, feed). É o mesmo problema da dor nº 2 — verificação é o que faz "quem avaliou" virar argumento de confiança. Critério em aberto: nº de visitas, avaliações aprovadas ou verificação manual pelo admin

## Fora do escopo inicial

- Seguir usuário, seguidores, perfil privado/bloqueio — não vão existir
- Ranking com pesos (avaliação vale mais que check-in etc.)
