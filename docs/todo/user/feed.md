# 📰 Feed

> Área: usuário público · Rota: `/feed` · Status: 🟡 tela pronta sobre `src/mocks/feed.ts`

## Ideia

Página de atividade **sem grafo social**. Não existe seguir, seguidor nem
"Seguindo": nenhum item entra no feed porque alguém que você segue postou. Todo
item entra por um **vínculo com a cidade**, e o card diz qual foi.

Cinco fontes, cada uma virando um chip de filtro:

| Motivo | Entra quando | Deriva de |
|---|---|---|
| `perto` | o lugar está no seu bairro ou no raio configurado | `lat`/`lng` do ponto + posição do usuário |
| `salvo` | o lugar é um que você acompanha | `Favorita` |
| `categoria` | é da categoria/vibe que você mais explora | `Visita` + `Analise` agregadas |
| `cidade` | é movimento relevante em Sorocaba | qualquer evento público |
| `curadoria` | é roteiro montado pela equipe | conteúdo editorial |

E seis tipos de item, porque atividade de lugar não é toda igual:

| Tipo | O que mostra |
|---|---|
| `avaliacao` | avaliação de alguém, com nota, texto e foto |
| `movimento` | **rajada já agregada** — "4 pessoas avaliaram o Cabocafé nas últimas 6 horas" |
| `novo-ponto` | ponto aprovado pela moderação e publicado no mapa |
| `conquista` | conquista de outro explorador, **com o critério junto** |
| `marco` | marco do próprio lugar — 100 avaliações, liderança de bairro |
| `curadoria` | roteiro de 3 lugares assinado pela equipe |

## Por que sem seguidores

- **O cold start deixa de existir.** Feed de grafo abre vazio para quem acabou
  de chegar; feed de cidade abre cheio no primeiro acesso, e fica mais pessoal
  conforme a pessoa salva lugar e registra visita.
- **Não precisa de tabela nova.** `Segue` seria auto-relacionamento N:N só para
  o feed. Os cinco motivos saem de `Visita`, `Favorita` e da geolocalização, que
  o produto já precisa ter.
- **Tira do escopo a moderação de vínculo social** — bloqueio, perfil privado,
  denúncia de perseguição. Num TCC isso é superfície que nunca fecharia.
- **Mantém o assunto em lugar, não em gente.** A tese é "review de conhecido >
  review de estranho"; o que faz um estranho virar referência aqui é o selo de
  explorador verificado e a contribuição registrada, não o número de
  seguidores.
- **Rajada agregada resolve o problema que o grafo esconde.** Sem "seguindo",
  o lugar mais movimentado do dia soterraria o resto — daí o item `movimento`,
  que conta o volume em vez de repetir cinco cards do mesmo café.

## O que a tela faz

- Chip por fonte, com contagem — fonte vazia fica desabilitada, então nunca dá
  para confundir "sem conteúdo" com bug
- Ordenação por **relevância** (mistura fontes de ritmos diferentes) ou
  **cronológica** (agrupada em Hoje / Ontem / Esta semana / Antes disso)
- **Selo de motivo em todo card**, com o detalhe que casou ("Perto de você ·
  Centro, 1,4 km de você")
- **"Ver menos disso"** por card, em três escopos: bairro, categoria e tipo de
  item. As regras viram chips removíveis no topo, com contador — filtro
  invisível que o usuário esqueceu de ter criado é pior que nenhum filtro
- **Acompanhar lugar** direto do card: é a única "assinatura" do produto, e é
  de lugar, não de pessoa
- **Útil** em vez de curtir: mede se a dica ajudou a decidir, não simpatia pelo
  autor
- Coluna de apoio com "Seu recorte" (de onde veio o feed, com contagem por
  fonte, cada linha filtrando), desafio da semana, exploradores por
  contribuição e movimento da semana

## Dependências

| O quê | Situação |
|---|---|
| `Analise` (item `avaliacao`, `movimento`, `marco`) | ❌ não existe |
| `Visita` (item `movimento` de visitas, motivo `categoria`) | ❌ não existe |
| `Favorita` (motivo `salvo` e o botão de acompanhar) | ❌ não existe |
| `GanhaConquista` (item `conquista`) | ❌ não existe |
| Coluna `status` em `markers` (item `novo-ponto` sai da moderação) | ❌ não existe |
| Posição do usuário / bairro no perfil (motivo `perto`) | ❌ não existe |
| Entidade de pauta editorial (item `curadoria`) | ❌ nem modelada |
| `Segue` | 🚫 **fora de escopo por decisão** |

## Quando a API existir

- `motivo` e `relevancia` vêm **do backend**, não do cliente: é a consulta que
  sabe o que casou. O front só desenha e permite corrigir
- `relevancia` = decaimento por idade × peso da fonte. Não precisa ser precisa,
  precisa ser comparável
- Agregação de rajada é `GROUP BY` de eventos do mesmo tipo, mesmo lugar e
  mesma janela — feita no servidor, não na tela
- Paginação por cursor (`created_at` + id), substituindo o "Carregar mais" que
  hoje só fatia o array
- "Ver menos disso" vira preferência persistida do usuário; hoje só vive na
  sessão
- Os mocks `feedProfileMock`, `feedChallengeMock`, `feedContributorsMock` e
  `feedTrendingMock` morrem junto

## Fora do escopo

- Seguir usuário, seguidores, perfil privado — não vai existir
- Comentar item do feed direto na lista (a conversa mora na avaliação, RF-09)
- Notificação de atividade — é do módulo [Notificações](./notifications.md)
- Publicar do próprio feed: registrar visita e avaliar continuam no lugar,
  a partir de `/places/[id]`
