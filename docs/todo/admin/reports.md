# 🚩 Denúncias

> Área: admin · Rota: `/admin/reports` · Status: 💤 não iniciado

## Ideia

O canal de report da comunidade: qualquer usuário denuncia avaliação, comentário, ponto ou perfil (botão "denunciar" discreto + motivo). Do lado admin, a fila agrupa denúncias **por alvo** — o item denunciado 5 vezes é um caso, não cinco — com o conteúdo, o histórico do autor e as ações: descartar, remover conteúdo, advertir.

Complementa a [Moderação](./moderation.md): lá é o filtro **preventivo** (conteúdo novo aguardando aprovação); aqui é o **reativo** (conteúdo já público que a comunidade sinalizou). Juntos cobrem os casos de uso de remoção do ator Administrador do TCC.

## Por que vale

- Moderação preventiva não escala pra comentários e avaliações (volume alto, dano baixo) — pra esses, publicar e reagir a report é o custo certo.
- Plataforma com conteúdo público de usuário **precisa** de canal de denúncia — é higiene básica, inclusive legal.
- Denúncias por usuário/alvo geram o sinal de reputação que outros módulos podem consumir depois.

## Dependências

| O quê | Situação |
|---|---|
| Entidade nova `Denuncia` (`id`, `autorID`, `alvoTipo`, `alvoID`, `motivo`, `status`, `created_at`) | ❌ — **não estava no modelo do TCC**, é adição nossa. Alvo polimórfico (`alvoTipo` + `alvoID`) |
| Conteúdo denunciável (`Analise`, `Comentario`) | ❌ — pontos e perfis já existem |
| Papel de admin | 🔴 pré-requisito |

## Escopo inicial

- Botão denunciar com motivos fixos (spam, ofensa, informação falsa, outro)
- Fila agrupada por alvo, no padrão de tabela
- Ações: descartar / remover conteúdo (soft delete), ambas encerrando o caso
- Anti-abuso mínimo: uma denúncia por usuário por alvo

## Fora do escopo inicial

- Advertência/suspensão de conta (precisa de sistema de punição)
- Automação (auto-ocultar após N denúncias)
- Notificar o denunciante do desfecho
