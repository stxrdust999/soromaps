# 📰 Feed

> Área: usuário público · Rota: `/feed` · Status: 💤 não iniciado

## Ideia

Página dedicada de atividade social, em duas abas: **Seguindo** (avaliações, check-ins e conquistas de quem você segue) e **Sorocaba** (atividade pública recente da cidade toda). Cada item é acionável — abre o ponto no mapa, curte, comenta a avaliação.

Hoje o "feed" vive espremido no drawer da Home com dados mockados. A Home deve continuar sendo o mapa; o feed merece página própria, e o drawer passa a mostrar um recorte ("3 novidades — ver feed").

## Por que vale

- É a tese do produto: review de conhecido > review de estranho (dor nº 2). O `Segue` sem feed é só um contador.
- Aba "Sorocaba" resolve o cold start — usuário novo sem seguir ninguém já vê vida na plataforma.
- É onde comentário-com-resposta (RF-09) ganha palco.

## Dependências

| O quê | Situação |
|---|---|
| `Segue` (auto-relacionamento N:N) | ❌ não existe — já modelada |
| `Analise` + `Comentario` | ❌ não existem |
| `Visita` e `GanhaConquista` (tipos de item do feed) | ❌ |
| Botão seguir/deixar de seguir no perfil ([Comunidade](./community.md)) | ❌ |

## Escopo inicial

- Feed cronológico simples (sem algoritmo de relevância — cronológico é honesto e barato)
- Três tipos de item: avaliou, fez check-in, conquistou
- Paginação por cursor (`created_at`)
- Estado vazio da aba Seguindo apontando pra [Comunidade](./community.md)

## Fora do escopo inicial

- Curtidas em itens do feed
- Notificação de atividade (é do módulo [Notificações](./notifications.md))
- Ranking de relevância
