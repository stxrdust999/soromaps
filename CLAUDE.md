# 🤖 CLAUDE.md — Soromaps

> Registro vivo do projeto. Atualizado no momento em que decisões são tomadas.
> Última atualização: 2026-08-03

---

## 🎯 Ideia original

TCC (FATEC Sorocaba): plataforma digital interativa para descobrir, avaliar e
compartilhar experiências em estabelecimentos locais de Sorocaba. Combina
geolocalização (mapa interativo + GPS), gamificação (conquistas, badges,
pontuação/nível) e rede social (seguir usuários, comentários com resposta,
feed). Foco em avaliações locais e autênticas, dando visibilidade a
estabelecimentos menores.

---

## 🧱 Stack (real)

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui (Radix), lucide-react, sonner, vaul |
| Tabelas | TanStack Table 8 (via hook global `useTableConfig`) |
| Formulários | React Hook Form + Zod (`@hookform/resolvers`) |
| Mapas | MapLibre GL + basemaps CARTO (`positron` / `dark-matter`) |
| Backend | ASP.NET Core 10 (`net10.0`) + EF Core — repo `../soromaps_api` |
| Banco de Dados | PostgreSQL (Npgsql) — **Supabase** em produção |
| Hash de senha | BCrypt.Net-Next |
| Lint/format | Biome 2 |
| Mobile | Expo (React Native) — **não iniciado** |
| Nuvem | **Vercel** (front) + **Azure App Service** (API) + **Supabase** (banco) |

Stack projetada no TCC (Node.js + Express + TypeScript, SQL Server, Mapbox,
AWS) está preservada em `/docs` e comparada em
`docs/wiki/12-gap-modelo-vs-implementacao.md`.

---

## 📐 Convenções

- Código em inglês, comentários e docs em pt-BR
- Commits: Conventional Commits
- Diagramas: Mermaid como fonte de verdade; exports originais em `/docs/archive`
- Docs numerados `NN-tema.md` em `/docs`; wiki numerada em `/docs/wiki`
- Módulos de produto pendentes em `/docs/todo/{user,business,admin}/` — um `.md` por módulo, índice com status em `docs/todo/README.md`; concluiu módulo → atualiza status na mesma entrega
- Spec técnico escrito antes da implementação vai para `/docs/propostas`, com bloco de status no topo; implementou → conteúdo migra para `/docs/wiki` e a proposta vai para `/docs/archive`
- Estrutura de pastas: padrão Dara (Stardust)
- Material obsoleto vai para `/docs/archive` em subpasta por contexto, nunca é apagado

### Comentários no código

O código deve falar por si; comentário existe para o que ele não consegue dizer.

- **JSDoc** vai no símbolo exportado (componente, hook, função de `http`/
  `actions`): uma a três linhas com o que é e a restrição que o tipo não
  expressa — ex.: "precisa rodar dentro de `<Map>`".
- **JSDoc em campo** só quando há informação não-inferível: default não-óbvio,
  unidade, faixa válida, efeito colateral. Campo com nome autoexplicativo não
  recebe comentário. Se ele *precisa* de um, geralmente o nome está errado.
- **`//` inline** responde *por quê*, nunca *o quê*.
  Bom: `// moveend, não move: move dispara a cada frame durante o gesto`.
  Ruim: `// Faz o GET para a rota que retorna a lista de markers`.
- **Dívida** vira `// TODO:` de uma linha apontando o backlog, não um parágrafo.
- **Fora:** rótulo de bloco de JSX (`{/* titulo */}`, `{/* 1. CAMADA DO MAPA */}`)
  — se um bloco precisa de rótulo, ele quer virar componente — e comentário que
  repete a linha seguinte.
- Comentário desatualizado se apaga, não se contorna.

---

## 🧭 Decisões arquiteturais

### 2026-07-28 — Backend em ASP.NET Core, em repositório separado
**Decisão:** API em C# com ASP.NET Core 10 + EF Core, movida para o repo
`soromaps_api` (commit `a210a31`). Substitui o Node.js + Express do desenho
original.
**Motivo:** alinhamento com a stack que o time domina e com as disciplinas de
C#; tipagem forte e ORM maduro sem montar estrutura na mão. Repos separados dão
deploy independente (host Node × host .NET) e histórico limpo por
responsabilidade. Custo aceito: mudança de contrato exige PR nos dois lados.

### 2026-07-28 — PostgreSQL em vez de SQL Server
**Decisão:** persistência em PostgreSQL via `Npgsql.EntityFrameworkCore.PostgreSQL`.
**Motivo:** custo zero de licença, provisionamento simples em qualquer provedor
gratuito e caminho natural para PostGIS caso a busca por raio (RF-11) saia do
papel. SQL Server era a escolha do TCC por familiaridade da disciplina.

### 2026-07-28 — MapLibre GL + basemaps CARTO em vez de Mapbox
**Decisão:** renderizar o mapa com MapLibre GL consumindo estilos públicos da CARTO.
**Motivo:** fork open-source do Mapbox GL sem token, conta ou cota de
requisições; os estilos `positron`/`dark-matter` ainda acompanham o tema do app.
Mapbox exigiria chave em variável de ambiente e teria limite mensal.

### 2026-07-28 — Sessão assinada pelo Next.js, não pela API
**Decisão:** a API valida credenciais e devolve os dados do usuário; quem assina
o JWT HS256 e grava o cookie `httpOnly` é o Next.js (`src/lib/session.ts`), com
`crypto.subtle` em vez de biblioteca de JWT.
**Motivo:** `crypto.subtle` roda no runtime Edge, então o `middleware.ts` decide
acesso sem round-trip à API a cada navegação, sem polyfill nem dependência
extra. **Consequência conhecida e ainda aberta:** a API em si segue sem
autenticação — é o item 1 do backlog.

### 2026-07-28 — Server Actions como caminho padrão de mutação
**Decisão:** mutações passam por `src/actions/*` com `"use server"`, validando
com Zod antes de chamar a API. Exceção: markers, chamados do cliente.
**Motivo:** validação e mutação no mesmo lugar, sem endpoint público extra, e a
URL da API fica privada em `API_URL`. Markers ficaram no cliente porque
recarregam conforme o zoom do mapa muda — custo: exige CORS e expõe
`NEXT_PUBLIC_API_URL`. Os Route Handlers em `src/app/api/auth/*` são resquício
dessa migração e estão órfãos.

### 2026-07-28 — Estrutura de pastas Dara (Stardust), com `_components/` colocado
**Decisão:** adotar a árvore Dara completa em `src/`, mas **manter
`_components/` dentro das rotas** de `app/`, contrariando a regra do padrão de
que `app/` só contenha rotas.
**Motivo:** pasta com prefixo `_` é *private folder* do App Router e colocação é
o idioma da comunidade Next.js para componente exclusivo de uma rota. Regra
prática adotada: usado por uma rota só → `_components/` da rota; usado por duas
ou mais → `src/components/`.

### 2026-07-28 — Documentação em duas trilhas
**Decisão:** `/docs/wiki` separa o que foi **projetado no TCC** do que está
**implementado**, com uma página de gap ligando os dois.
**Motivo:** a stack e o modelo divergiram bastante da entrega acadêmica.
Sobrescrever a modelagem original destruiria o entregável do TCC; deixar só ela
faria a documentação mentir sobre o sistema. Manter as duas com a diferença
explícita resolve os dois lados.

### 2026-07-29 — Padrão interno de telas de listagem adotado em `/admin/users`
**Decisão:** adotar o padrão de telas do time (documentado em
`~/Desktop/standards`) na tela de usuários, portando junto a infraestrutura
reutilizável: hook global `useTableConfig`, peças em `src/components/table/`,
`SheetFilterDialog` e os utilitários de `src/utils/{formatters,sorts,table}`.
**Motivo:** a tela anterior era HTML de tabela escrito à mão, sem ordenação,
filtro, paginação ou visibilidade de coluna — e com um bug que renderizava
`userName` nas três colunas de dados. Portar a biblioteca inteira custa mais
agora, mas a próxima listagem (comércios, avaliações, marcadores) passa a ser
só `columns.tsx` + `table.tsx`. **Regra que vem junto:** nenhuma tela chama
`useReactTable` diretamente; comportamento novo entra no hook global.
Fora de escopo por ora: `fetcher`/proxy/env validado, e o Orval (a API não
publica Swagger consumível).

### 2026-07-29 — Leitura em `src/http`, escrita em `src/actions`
**Decisão:** separar o cliente HTTP de leitura — que devolve o envelope
discriminado `{ data, status, headers }` e aceita `RequestInit` para o
chamador declarar `next: { tags: [...] }` — das mutações, que ficam em Server
Actions com `"use server"`, validação Zod e retorno `FormState`.
**Motivo:** são contratos diferentes. Leitura precisa ser componível e
cacheável; escrita precisa validar, invalidar cache e devolver algo que o
componente transforme em toast. Misturar os dois foi o que produziu o
`router.refresh()` da versão anterior. **Consequência:** erro de leitura é um
status (`status === 200 ? data : []`), não uma exceção — não há `try/catch` na
leitura.

### 2026-07-29 — `updateTag` em vez de `revalidateTag`
**Decisão:** as Server Actions invalidam cache com `updateTag(tag)`.
**Motivo:** no Next 16 o `revalidateTag` passou a exigir um segundo argumento
de perfil de cache, e é o `updateTag` que dá semântica de
*read-your-own-writes* dentro de uma Server Action — a leitura seguinte já
enxerga a escrita. É o que faz a tabela chegar atualizada quando o modal
fecha, sem `router.refresh()`.

### 2026-07-29 — Modais no slot paralelo global `(app)/@modals`
**Decisão:** mover os modais de `admin/users/@modals` para
`src/app/(app)/@modals/`, com nomenclatura `create` / `update/[id]` /
`delete/[id]` e rotas espelho com `redirect()`.
**Motivo:** um slot só serve todas as rotas autenticadas, então a próxima tela
não precisa criar um layout novo. Modal é rota, não estado: ganha URL
compartilhável, botão voltar funcionando e busca de dados no servidor. Custo
aceito: três arquivos por modal e uma rota espelho que só existe para acesso
direto e F5 não darem 404.

### 2026-07-29 — `ui/form.tsx` escrito à mão
**Decisão:** reconstruir a API `Form`/`FormField`/`FormItem`/`FormControl`/
`FormMessage` sobre o React Hook Form em vez de instalar do registry.
**Motivo:** o style `radix-vega` do shadcn não distribui mais o `form` — foi
substituído pelo `field`, agnóstico de biblioteca de formulário. Como o padrão
de telas depende da API clássica, ela foi reimplementada sobre `Label` e o
`Slot` do Radix.

### 2026-07-29 — Deploy: Vercel + Azure + Supabase
**Decisão:** front na Vercel (deploy automático no push), API em Azure App
Service (publish manual) e PostgreSQL gerenciado no Supabase.
**Motivo:** cada camada foi para onde tem melhor tier gratuito e menos
configuração — Next.js na Vercel é deploy sem configuração alguma, ASP.NET
Core no Azure é o caminho de menor atrito, e Postgres gerenciado evita
administrar servidor de banco. Substitui a AWS do desenho original, que nunca
chegou a ser provisionada. **Custo:** três painéis para configurar e três
lugares onde uma variável de ambiente pode faltar.
Schema criado à mão no SQL Editor do Supabase — segue sem migrations, agora
com o agravante de haver **dois** schemas mantidos manualmente (local e
Supabase) sem nada que os compare.

### 2026-07-29 — URL da API como segredo (e o que isso quebrou)
**Decisão:** não definir `NEXT_PUBLIC_API_URL` em produção.
**Motivo:** `NEXT_PUBLIC_` significa público — o valor é gravado em texto puro
no JavaScript que qualquer visitante baixa. Como a API ainda não tem
autenticação, publicar a URL entregaria um CRUD de usuários aberto a quem
abrisse o DevTools.
**Consequência que se materializou:** `/home`, `/places/new` e o popup do
marcador leem essa variável no cliente e caem no fallback `""`, então o
`fetch` vira caminho relativo e dá 404 na Vercel — e, mesmo que não desse, o
CORS do `Program.cs` só conhece `http://localhost:3000`. **O mapa não carrega
marcadores em produção.** Login, cadastro e o CRUD de usuários seguem
funcionando, porque passam pelo servidor.
**Correção definida:** rota `/api/proxy/[...path]` no Next repassando
server-side — resolve o 404, dispensa o CORS e mantém a URL fora do bundle.
É o item 1 do backlog. Detalhes em `docs/wiki/14-deploy.md`.

### 2026-07-29 — Vulnerabilidades de pacote: 15 → 0
**Decisão:** remover as cinco dependências sem nenhum import em `src/`
(`firebase`, `hono`, `@hono/node-server`, `leaflet`, `react-leaflet`), mover
`shadcn` para `devDependencies`, atualizar o Next para 16.2.12, e apertar os
overrides de `postcss` (`^8.5.25`) e `sharp` (`^0.35.3`).
**Motivo:** as órfãs carregavam 9 avisos, incluindo a única `critical`
(`websocket-driver`, via firebase). O Next 16.2.12 corrige um *bypass de
middleware/proxy no App Router* — relevante porque o `middleware.ts` é a
guarda de rota do projeto. O `sharp` só é corrigido na 0.35, e o Next
16.2.12 ainda declara `^0.34.5` (a 0.35 só é dependência oficial a partir da
canary `16.3.0`); o override antecipa a correção, validado com `npm run
build` nas quatro telas que usam `next/image`.
**Ponto de atenção:** por sair do range oficialmente testado pelo Next, este
override merece reconferência a cada bump de versão do Next.
**Nunca rodar `npm audit fix --force` aqui:** antes deste ajuste, a
"correção" que ele propunha para o `sharp` era instalar `next@14.2.35`, uma
regressão de dois majors.

### 2026-08-02 — `MapDrawerLayout`: a home vira casca reutilizável
**Decisão:** extrair de `/home` o padrão "mapa ao fundo + painel arrastável que
sobe até virar a página" para `src/components/blocks/map-drawer-layout/`, com
`map` como slot das camadas do mapa e `children` livre. A página voltou a ser
Server Component; o feed deixou de ser client.
**Motivo:** o arquivo acumulava layout, estado do drawer, busca de markers e
conteúdo do feed em ~190 linhas de client component. Três consequências reais:
o mapa era **desmontado** ao expandir (`{!isFullyExpanded && <Map/>}`),
recarregando estilo CARTO e tiles ao recolher; o `useEffect` dependia de
`viewport.zoom`, que muda a cada frame do evento `move`, disparando dezenas de
`GET /api/markers` por gesto de zoom; e o viewport em state re-renderizava
drawer e feed a 60fps durante o pan.
**O que mudou junto:**
- **Viewport deixou de ser state React.** O `<Map>` roda em modo não-controlado
  e as camadas leem a instância via `useMap()`. `src/hooks/use-markers.ts`
  assina `moveend` e guarda só o boolean `zoom >= minZoom`, então o fetch
  depende de um booleano e não de um float — uma requisição por cruzamento de
  limiar, com `AbortController`.
- **`overlay` no `DrawerContent`** (`src/components/ui/drawer.tsx`, default
  `true`): o `DrawerOverlay` era renderizado sempre, deixando o mapa sob um
  `bg-black/10 backdrop-blur-xs` permanente — indesejado num drawer
  `modal={false}` que nunca fecha.
- **`noPortal` no lugar do `container` state**, já que o `main` de
  `(app)/layout.tsx` tem `transform-[translateZ(0)]` e serve de containing
  block para o `fixed` do vaul.
**Vive em `components/blocks/` mesmo com um consumidor só**, contrariando a
regra "uma rota → `_components/`": foi extraído justamente para ser reusado, e
`/places/new` deve ser aposentada migrando a criação de local para dentro dele
(`collapse()` do contexto desce o painel e libera o mapa).
**Limite conhecido:** o vaul lê `document.body` durante o render, então não
sobrevive ao SSR — foi por isso que a versão anterior tinha o gate `mounted`
devolvendo tela vazia. O layout mantém o gate, mas renderiza no lugar um
esqueleto com a moldura do painel recolhido, então a primeira pintura já tem a
casca em vez de fundo vazio.

### 2026-08-03 — CRUD de pontos no padrão do projeto, criação em dois estágios
**Decisão:** markers passam a seguir a mesma trilha de `/admin/users` —
`src/validations/markers.ts` (Zod), `src/http/markers/markers.ts` (leitura com
envelope discriminado por `status`), `src/actions/markers.ts` (Server Actions
com `FormState` + `updateTag`). A criação continua em rota própria
(`/places/new`), agora em **dois estágios dentro do mesmo card flutuante**:
`picking` posiciona o pin, `form` coleta os dados, e "Trocar de lugar" volta
sem perder o preenchido.
**Motivo:** as três telas de marker eram `fetch` cru no cliente com `alert()`
de erro, e a criação gravava o nome hardcoded `"Novo Ponto"` porque não havia
campo de nome. Sobre o layout: card flutuante em vez de `Dialog` porque o
mapa **não pode** escurecer — ver a posição escolhida enquanto se preenche o
formulário é o que comunica que dá para voltar e mudar. E rota própria em vez
de painel dentro do `MapDrawerLayout` (o que a decisão de 2026-08-02 previa)
porque criar é responsabilidade diferente de navegar; aninhar traria de volta
a mistura de estado que aquele refactor acabou de resolver.
**Conversão `FormData` → número mora na action** (`toMarkerInput`), não no
schema: `z.coerce.number()` deixa o tipo de entrada `unknown` e quebra o
`zodResolver` do React Hook Form.
**O formulário coleta 8 campos, a API recebe 3.** Foto, descrição, categoria,
wifi, petfriendly, melhor horário e segredo local são validados no navegador e
descartados — o schema da API ainda é `nome`/`lat`/`lng`. É deliberado: o time
aprovou o conceito em 2026-08-03 e queria ver o fluxo inteiro antes de mexer
no banco. O spec técnico está em
`docs/propostas/2026-08-03-expansao-modelo-ponto.md`, com o DER em `.dbml`.
**Continua em aberto, e nada aqui mudou isso:** a API segue sem autenticação,
`markers` segue sem dono, e `use-markers.ts` segue buscando do cliente com
`NEXT_PUBLIC_API_URL` — esse último depende do `/api/proxy`, item 1 do
backlog.

### 2026-08-03 — Marcador em três camadas, detalhe em `/places/[id]`
**Decisão:** separar a visualização de um ponto em tooltip (hover, uma linha),
popup (clique, card de display + "Ver detalhes") e página cheia
`/places/[id]`, que é onde moram editar e excluir. O popup deixou de ter
formulário.
**Motivo:** `MarkerTooltip` é `pointer-events-none` e some no `mouseleave`
(`src/components/ui/map.tsx`) — nada dentro dele é clicável, nunca, e no touch
ele nem aparece. Tooltip rico seria uma tela que metade dos usuários não vê e
ninguém consegue usar. Editar dentro de um popup de 208px já era apertado com
um campo só; com os 8 campos do modelo proposto, inviável.
**Rota normal, não `@modals`:** o slot paralelo existe para abrir modal por
cima de uma listagem (`/admin/users`); aqui se quer página de verdade, então
não há interceptação nem rota espelho.
**Nasce com a visão de administrador**, sem gate: hoje qualquer sessão válida
já editava e excluía pelo popup, então isso não regride nada. Quando existir
papel de usuário, entram o gate e o fluxo de sugestão do explorador — item do
backlog de segurança.
**Dados fictícios centralizados em `src/mocks/markers.ts`**, escolhidos de
forma determinística pelo id (`id % lista.length`), para o mesmo ponto não
trocar de foto a cada render. A página avisa explicitamente quais campos são
exemplo. As seções do feed, que tinham picsum e nomes hardcoded inline,
passaram a ler dessa mesma fonte.

### 2026-08-09 — Telas de admin construídas sobre mock, antes do schema
**Decisão:** `/admin/dashboard`, `/admin/moderation`, `/admin/categories`,
`/admin/businesses` e `/admin/achievements` foram implementadas inteiras —
layout, interação, estados vazios — lendo de `src/mocks/admin-*.ts`, sem
nenhuma chamada à API. As cinco ficam 🟡 no `docs/todo/README.md` até existir
dado real.
**Motivo:** as duas dependem de coisas que o banco não tem (`status` em
`markers`, tabela de decisão, agregado `GET /api/admin/stats`), e esperar o
schema deixaria o produto sem tela para revisar. É a mesma aposta do formulário
de ponto de 2026-08-03: ver o fluxo inteiro antes de mexer no banco. **Custo
aceito:** dois arquivos de mock que precisam morrer na migração, e o risco de
alguém confundir tela pronta com módulo entregue — daí o 🟡 e o aviso no topo
de cada mock.
**O que veio junto e vale além destas telas:**
- **`--success` e `--warning` no `globals.css`**, com variantes no `Badge`. São
  cores **de estado**, nunca de marca: aprovado/atrasado precisam de semáforo,
  o resto do produto continua azul.
- **`PageBreadcrumb`** (`src/components/blocks/`) — primeira trilha do projeto;
  as demais telas de admin devem adotar.
- **`ui/chart.tsx` + Recharts** entraram para o dashboard; a paleta
  `--chart-1..5` já existia.
- **Nada de `Math.random()`/`Date.now()` em mock.** Série temporal é ruído
  determinístico sobre data-âncora fixa, e "há N dias" é `number` formatado por
  `formatWaitingDays`. Valor aleatório ou relativo a `now` renderiza diferente
  no servidor e no cliente e quebra a hidratação.
- **Mestre-detalhe em vez de tabela + modal na moderação**, e mini-mapa em SVG
  em vez de MapLibre — detalhe e justificativa em
  `docs/todo/admin/moderation.md`.
- **A aposta do padrão de listagem (decisão de 2026-07-29) se pagou em
  `/admin/categories`:** busca, ordenação, visibilidade de coluna, paginação e
  sheet de filtro vieram prontos de `useTableConfig` e `src/components/table/*`
  sem tocar em nada compartilhado. O que custou foi só o domínio — pin,
  colisão de cor, reatribuição na exclusão.
- **Diálogo local em vez do slot `@modals` onde o dado é mock.** Rota
  interceptada precisa de um servidor como fonte da verdade; com o catálogo em
  `useState`, a rota leria o mock original e salvaria no vazio. Migra junto com
  a API.
- **Primeira dependência de UI de terceiro: o [Trophy UI Kit](https://ui.trophy.so).**
  `AchievementBadge` entrou por registry (`npx shadcn@latest add
  https://ui.trophy.so/achievement-badge`) e foi **adaptado**, não consumido
  como está — o registry entrega o código, então ele vira nosso. O original
  tinha os estados travado/desbloqueado invertidos, só renderizava troféu ou
  imagem (o catálogo escolhe ícone lucide + cor) e estava em inglês. Detalhe
  em `docs/todo/admin/achievements.md`.
- **Três formas de tela para três formas de trabalho:** fila mestre-detalhe
  onde a decisão *é* a tela (moderação), listagem simples onde o CRUD é o
  trabalho (categorias), e listagem com painel lateral onde se despacha vários
  itens sem perder a posição na tabela (comércios). Em `/admin/businesses` a
  casca de tabela virou componente genérico porque as três abas mostram
  entidades diferentes com a mesma moldura.

### 2026-08-12 — Gamificação sem XP: conquista só, e "nível" vira contagem
**Decisão:** o pilar de gamificação fica **só com conquista** (`Conquista` +
`GanhaConquista`). As colunas `pontuacao`/`nivel` do modelo conceitual do TCC
seguem sem prazo, e o "Nível N" que já apareceu na UI é substituído por um
**título derivado do número de conquistas** — função pura sobre
`COUNT(GanhaConquista)`, sem coluna, sem curva, sem ledger:
`0–2 Novato · 3–6 Explorador · 7–12 Guia local · 13+ Veterano`.
**Motivo:** a diferença de custo entre os dois não é número de tabela, é a
natureza do dado. **Conquista é estado idempotente** — a PK composta de
`GanhaConquista` impede duplicata, então errar o critério e reprocessar é
seguro. **XP é acumulador** — conceder duas vezes deixa o saldo errado para
sempre, e tornar isso reprocessável exige uma tabela de transações. Some a
curva de nível (segundo catálogo de regras, mutável) e o balanceamento: cada
conquista nova passaria a exigir a decisão extra "quanto isso vale em XP?",
acoplando os dois sistemas. É o dobro de superfície de calibragem para a mesma
sensação — hierarquia visível ao lado do nome —, que o título derivado entrega
de graça. Confirma o que `docs/todo/user/achievements.md` já registrava como
fase 2.
**Consequência pendente:** cinco lugares mostram "Nível N" sobre mock e
precisam migrar para a contagem —
`components/blocks/{place-leaderboard,verified-comment-card}.tsx`,
`admin/moderation/_components/author-card.tsx` (via `nivel` em
`mocks/admin-moderation.ts`) e os stubs de `/stats` e `/admin/achievements`,
cujo texto ainda promete "evolução de nível" e "pontuação".

### 2026-07-28 — Mermaid como fonte de verdade dos diagramas
**Decisão:** todo diagrama vive em Mermaid dentro do Markdown; os PNGs
exportados foram para `/docs/archive/diagramas-originais/`.
**Motivo:** PNG não gera diff legível — ajuste de cardinalidade vira blob novo.
Mermaid entra no code review como texto.

### 2026-07-30 — Rotas reorganizadas por tipo de usuário (admin/business/explorer)
**Decisão:** dentro de `src/app/(app)/`, `admin/` e `business/` continuam como
pastas reais (prefixo de URL próprio, `/admin/*` e `/business/*`); as rotas de
usuário comum (`/home`, `/places`, `/profile`) — que não têm prefixo em
comum — foram agrupadas no route group `(explorer)`. Sidebar e layout
(`(app)/layout.tsx`) continuam únicos e compartilhados entre os três tipos.
**Motivo:** o nome `(explorer)` (em vez de `(users)`) evita o vocabulário de
"papel de acesso" no nome da pasta, combinando com o texto já usado nas telas
("Explorar Sorocaba", "Explorar Lugares"). Na prática isso é redundante como
proteção — route group (pasta entre parênteses) nunca aparece na URL,
independente do nome escolhido — mas mantém a nomenclatura limpa mesmo para
quem só olha o código-fonte. `admin`/`business` não precisam de route group
porque o prefixo de URL real já cumpre o papel de agrupar por pasta.
`/business` é rota nova (stub); `middleware.ts` ganhou `/business` em
`PROTECTED_ROUTES` e no `matcher`. **Fora de escopo:** layout/sidebar
distintos por tipo e checagem de role/permissão — `/admin` continua acessível
por qualquer sessão válida, item de backlog já registrado e não afetado por
esta reorganização.

### 2026-07-30 — `globals.css` em `src/styles/`, favicon em `public/`
**Decisão:** `globals.css` saiu de `src/app/` para `src/styles/globals.css`
(importado em `src/app/layout.tsx` via `@/styles/globals.css`); o favicon
saiu de `src/app/favicon.ico` para `public/favicon.ico`.
**Motivo:** alinhar com o scaffold Dara/Stardust — `src/styles/` já existia
reservado para isso, e favicon é asset estático, não arquivo de rota.
**Custo aceito:** o favicon deixa de usar a convenção de Metadata File do App
Router (que gera a tag `<link rel="icon">` automaticamente a partir de
`app/favicon.ico`) — o navegador continua buscando `/favicon.ico` direto,
só sem o `<link>` automático. `components.json` (`tailwind.css`) também foi
atualizado para o novo caminho, senão o CLI do shadcn volta a escrever no
lugar antigo.

---

## 🗄️ Modelagem — projetado × implementado

Modelo lógico do TCC tem 10 tabelas. O banco hoje tem **2**: `tbUsuario`
(`id`, `user_name`, `user_email`, `user_password`, `created_at`, `updated_at`) e
`markers` (`id`, `nome`, `lat`, `lng`), sem relacionamento entre elas e **sem
migrations** (schema criado à mão).

Ausentes: `Categoria`, `Analise`, `Comentario`, `Favorita`, `Visita`, `Segue`,
`Conquista`, `GanhaConquista` — ou seja, dos três pilares do produto, só a
geolocalização tem persistência.

### 2026-07-28 — Decisões de modelagem herdadas do TCC (ainda válidas como destino)
- **Single table para tipos de usuário:** `tipoUsuario` + `CPF`/`CNPJ` nullable, porque os dois tipos compartilham quase todos os relacionamentos.
- **`data` na PK de `Visita`:** visita é evento repetível e alimenta as estatísticas (RF-10); favoritar é estado, então `Favorita` não leva `data` na PK.
- **`Comentario` pendurado em `Analise`, não em `PontoNoMapa`:** RF-09 pede comentário *com resposta* — conversa em torno de uma avaliação, não mural do estabelecimento.
- **`Coordenadas` sumiu do DER para o modelo lógico:** lacuna, não simplificação. A implementação resolveu com `lat`/`lng` em `markers`.

---

## ✅ Estado atual

### Feito — documentação e modelagem
- [x] Levantamento de dores e modelo de negócio (Canvas)
- [x] Personas (Augusto Silva — dono de estabelecimento; Sara Almeida — usuária)
- [x] Requisitos de alto nível (13 requisitos)
- [x] Diagrama de casos de uso (Usuário + Administrador)
- [x] Modelo conceitual (classes), DER e modelo lógico
- [x] Diagrama de sequência (criação de ponto, MVC)
- [x] Protótipo interativo (Lovable + Figma)
- [x] Vídeos de apresentação (protótipo + final)
- [x] Documentação `/docs` no padrão docs-stardust
- [x] Wiki em `/docs/wiki` (14 páginas, duas trilhas + gap)
- [x] Diagramas convertidos para Mermaid; originais em `/docs/archive`

### Feito — código
- [x] Estrutura de pastas Dara em `src/`
- [x] Cadastro e login (Server Actions + BCrypt na API + cookie de sessão HS256)
- [x] Guarda de rota no `middleware.ts`
- [x] CRUD de usuários (API + tela `/admin/users` com rotas interceptadas)
- [x] CRUD de marcadores (API + criação em `/places/new` + editar/excluir no popup)
- [x] Mapa MapLibre com tema sincronizado e carregamento por zoom
- [x] Biblioteca de tabela reutilizável (`useTableConfig` + `src/components/table/*`)
- [x] `/admin/users` no padrão de listagem: ordenação, busca por coluna, sheet de filtro, visibilidade de colunas, seleção e paginação
- [x] Camada `src/http` (leitura com envelope + cache tags) e `src/actions/users.ts` (escrita com `FormState`)
- [x] Markers no mesmo padrão: `validations` + `http` + Server Actions, criação em dois estágios e edição/exclusão sem `fetch` cru no cliente
- [x] Página de detalhe do ponto (`/places/[id]`) com editar/excluir; marcador do mapa virou só display
- [x] Dashboard admin (`/admin/dashboard`): filas de atenção, quatro cards de número e dois gráficos Recharts — **inteiro sobre `src/mocks/admin-dashboard.ts`**, sem chamada à API
- [x] Moderação de pontos (`/admin/moderation`): fila mestre-detalhe com filtros, ação em lote, atalhos de teclado, rejeição com motivo, comparação de duplicata e aba de histórico — **inteiro sobre `src/mocks/admin-moderation.ts`**
- [x] Categorias (`/admin/categories`) no padrão de listagem, reusando `useTableConfig` + `src/components/table/*` + chips de filtro: pin renderizado, alerta de colisão de cor, formulário com preview ao vivo e exclusão com reatribuição — **inteiro sobre `src/mocks/admin-categories.ts`**
- [x] Comércios (`/admin/businesses`): três abas (pedidos, verificados, sem dono) sobre uma casca de tabela genérica, com cinco sinais de risco, painel lateral de decisão, comparação de conflito e revogação de vínculo — **inteiro sobre `src/mocks/admin-businesses.ts`**
- [x] Conquistas (`/admin/achievements`): catálogo com construtor de critério declarativo, estimativa de alcance, faixa de badges, prévia de desbloqueio e aba de calibragem — **inteiro sobre `src/mocks/admin-achievements.ts`**, com `AchievementBadge` adaptado do Trophy UI Kit
- [x] Slot de modal global `(app)/@modals` com rotas espelho
- [x] Deploy: front na Vercel, API no Azure App Service, banco no Supabase

### 🔥 Próximo passo — quebrado em produção
- [ ] Rota `/api/proxy/[...path]` + migrar as chamadas de markers — hoje o mapa **não carrega marcadores em produção** (sem `NEXT_PUBLIC_API_URL` o fetch vira caminho relativo e dá 404; e o CORS só conhece localhost). Ver `docs/wiki/14-deploy.md`

### 🔴 Próximos passos — segurança (a API já está publicada na internet)
- [ ] Registrar autenticação na API (`AddAuthentication` + `[Authorize]`) — hoje **todo endpoint é público**
- [ ] Parar de devolver `user_password` nas respostas de `/api/users` (DTO de saída)
- [ ] `UNIQUE` em `user_name` e `user_email`
- [ ] Resposta genérica no login (hoje diferencia "usuário não encontrado" de "senha incorreta")
- [ ] Papel/role de administrador, checado no middleware e na API — destrava o gate de `/places/[id]`, que hoje mostra editar/excluir para qualquer sessão

### 🟠 Próximos passos — fundação
- [ ] EF Core Migrations — hoje o schema é mantido à mão em dois lugares (local e Supabase), sem nada que os compare
- [ ] FK ligando `markers` ao usuário criador
- [ ] Padronizar nomenclatura de tabelas/colunas (`tbUsuario` × `markers`)
- [ ] Origem de CORS configurável (hoje `http://localhost:3000` fixo em `Program.cs`)
- [ ] Versionar o `.env.example` (a regra `.env*` do `.gitignore` o captura) e criar um no repo da API
- [ ] `.gitignore` no repo da API — `bin/` e `obj/` estão versionados
- [ ] Pipeline de deploy da API (hoje é publish manual pelo Visual Studio)
- [ ] `PUT /api/users/{id}` aceitar atualização parcial — hoje re-hasheia a senha sempre, por isso o formulário de edição a exige
- [ ] Levar `use-markers.ts` para `src/http` — é a última chamada de marker no cliente, e depende do `/api/proxy`
- [ ] `src/lib/fetcher.ts` + `/api/proxy` + env validado com `server-only`

### 🟡 Próximos passos — produto
- [ ] Expandir o modelo de Ponto (foto, sobre, categoria, wifi, petfriendly, melhor horário, segredo local) — conceito aprovado, spec pronto em `docs/propostas/2026-08-03-expansao-modelo-ponto.md`; até lá o formulário coleta e descarta esses campos
- [ ] `Categoria` + `Analise` (RF-07, RF-11, RF-12)
- [ ] `Comentario` (RF-09)
- [ ] Selo de **explorador verificado** — usuário cuja contribuição foi validada; a página do ponto já reserva espaço para o comentário dele. Falta definir o critério (nº de visitas? avaliações aprovadas? verificação manual pelo admin?), a coluna em `tbUsuario` e onde o selo aparece
- [ ] Upload de fotos (RF-08)
- [ ] `Segue` (RF-13)
- [ ] Gamificação: `Conquista` + `GanhaConquista`
- [ ] `GET /api/admin/stats` — endpoint agregado que tira o dashboard admin do mock (evita N chamadas de lista só para contar)
- [ ] Paginação e filtro por bounding box em `/api/markers`
- [ ] App mobile Expo

### 🟢 Próximos passos — limpeza
- [ ] Apagar Route Handlers órfãos (`src/app/api/auth/{login,logout}`) e o `WeatherForecastController`
- [ ] Limpar regras obsoletas do `.gitignore` (`/src/services/Soromaps`)
- [ ] Remover `registerSchema` de `src/validations/auth.ts` (sem uso) ou passar a usá-lo no cadastro
- [ ] Aplicar o padrão de listagem em `/admin/businesses` e `/admin/reviews` (hoje stubs)
- [ ] Reconferir o override de `sharp` a cada bump do Next (ver decisão abaixo)
