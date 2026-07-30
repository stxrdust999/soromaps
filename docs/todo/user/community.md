# 👥 Comunidade

> Área: usuário público · Rota: `/users` · Status: 💤 não iniciado

## Ideia

O diretório social: busca de usuários por nome, perfis públicos (avaliações, conquistas, lugares visitados, seguidores/seguindo) e o botão seguir/deixar de seguir. Complementa com um **ranking de contribuidores** — geral e por bairro.

O recorte por bairro é deliberado: em ranking geral só os 10 mais ativos aparecem; por bairro, quase todo usuário ativo é top de alguma coisa. Reconhecimento distribuído é retenção distribuída.

## Por que vale

- É a porta de entrada do pilar social — `Segue` (RF-13) precisa de um lugar onde se descobre quem seguir.
- Perfil público com histórico dá contexto à avaliação ("quem é essa pessoa que avaliou?") — de novo a dor nº 2, confiança.
- Ranking ataca a dor nº 6 (reconhecimento).

## Dependências

| O quê | Situação |
|---|---|
| Busca de usuários | 🟢 `GET /api/users` existe (precisa de filtro por nome no server p/ escalar) |
| Perfil público (`/users/[id]`) | ❌ rota não existe; `/profile` atual é placeholder |
| `Segue` | ❌ não existe |
| `Analise`/`Visita` (conteúdo do perfil e critério do ranking) | ❌ |
| Privacidade: API não devolver e-mail/hash em perfil público | 🔴 DTO de saída — item de segurança do backlog |

## Escopo inicial

- `/users` com busca + cards de usuário
- `/users/[id]` público: nome, desde quando, contadores, conquistas em destaque
- Seguir/deixar de seguir com update otimista
- Ranking simples por contagem de avaliações (quando `Analise` existir)

## Fora do escopo inicial

- Perfil privado/bloqueio de usuários
- Ranking com pesos (avaliação vale mais que check-in etc.)
