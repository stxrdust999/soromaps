# 🤖 CLAUDE.md — Soromaps

> Registro vivo do projeto. Atualizado no momento em que decisões são tomadas.
> Última atualização: 2026-07-28

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
| Mapas | MapLibre GL + basemaps CARTO (`positron` / `dark-matter`) |
| Backend | ASP.NET Core 10 (`net10.0`) + EF Core — repo `../soromaps_api` |
| Banco de Dados | PostgreSQL (Npgsql) |
| Hash de senha | BCrypt.Net-Next |
| Lint/format | Biome 2 |
| Mobile | Expo (React Native) — **não iniciado** |
| Nuvem | **não provisionada** |

Stack projetada no TCC (Node.js + Express + TypeScript, SQL Server, Mapbox,
AWS) está preservada em `/docs` e comparada em
`docs/wiki/12-gap-modelo-vs-implementacao.md`.

---

## 📐 Convenções

- Código em inglês, comentários e docs em pt-BR
- Commits: Conventional Commits
- Diagramas: Mermaid como fonte de verdade; exports originais em `/docs/archive`
- Docs numerados `NN-tema.md` em `/docs`; wiki numerada em `/docs/wiki`
- Estrutura de pastas: padrão Dara (Stardust)
- Material obsoleto vai para `/docs/archive` em subpasta por contexto, nunca é apagado

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

### 2026-07-28 — Mermaid como fonte de verdade dos diagramas
**Decisão:** todo diagrama vive em Mermaid dentro do Markdown; os PNGs
exportados foram para `/docs/archive/diagramas-originais/`.
**Motivo:** PNG não gera diff legível — ajuste de cardinalidade vira blob novo.
Mermaid entra no code review como texto.

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

### 🔴 Próximos passos — segurança (antes de qualquer deploy)
- [ ] Registrar autenticação na API (`AddAuthentication` + `[Authorize]`) — hoje **todo endpoint é público**
- [ ] Parar de devolver `user_password` nas respostas de `/api/users` (DTO de saída)
- [ ] `UNIQUE` em `user_name` e `user_email`
- [ ] Resposta genérica no login (hoje diferencia "usuário não encontrado" de "senha incorreta")
- [ ] Papel/role de administrador, checado no middleware e na API

### 🟠 Próximos passos — fundação
- [ ] EF Core Migrations (schema hoje é manual)
- [ ] FK ligando `markers` ao usuário criador
- [ ] Padronizar nomenclatura de tabelas/colunas (`tbUsuario` × `markers`)
- [ ] Origem de CORS configurável (hoje `http://localhost:3000` fixo em `Program.cs`)
- [ ] `.env.example` nos dois repos

### 🟡 Próximos passos — produto
- [ ] `Categoria` + `Analise` (RF-07, RF-11, RF-12)
- [ ] `Comentario` (RF-09)
- [ ] Upload de fotos (RF-08)
- [ ] `Segue` (RF-13)
- [ ] Gamificação: `Conquista` + `GanhaConquista`
- [ ] Paginação e filtro por bounding box em `/api/markers`
- [ ] App mobile Expo

### 🟢 Próximos passos — limpeza
- [ ] Remover deps não importadas (`firebase`, `hono`, `@hono/node-server`, `leaflet`, `react-leaflet`) e mover `shadcn` para `devDependencies`
- [ ] Apagar Route Handlers órfãos (`src/app/api/auth/{login,logout}`) e o `WeatherForecastController`
- [ ] Limpar regras obsoletas do `.gitignore` (`/src/services/Soromaps`)
- [ ] Corrigir `src/types/user.ts` (`id: number`, sem `password`)
- [ ] Remover `registerSchema` de `src/validations/auth.ts` (sem uso) ou passar a usá-lo no cadastro
