# 🌆 Soromaps

> Plataforma interativa para descobrir, avaliar e compartilhar experiências em estabelecimentos locais de Sorocaba — geolocalização + gamificação + rede social.

🌐 [**Aplicação publicada**](https://soromaps-sigma.vercel.app)
👉 [**Esboço do Projeto (Figma)**](https://www.figma.com/make/QeH6cpMMMLzWpcahXSmB4E/Plataforma-Interativa-Sorocaba?node-id=0-1&p=f&t=4B6XvFunslTZ5fr7-0)
🎥 [**Vídeo da Apresentação Final**](https://youtu.be/ikABfE7xs0U?si=GWaXctGDIQR5dzzm)

---

## ✨ Features

- 🗺️ Mapa interativo com GPS e criação de pontos pela comunidade
- ⭐ Avaliações com estrelas + análises detalhadas (atendimento, ambiente, cardápio)
- 💬 Comentários com respostas e interação entre usuários
- 📸 Upload de fotos dos estabelecimentos
- 🏆 Gamificação: conquistas, badges, pontuação e níveis
- 👥 Sistema de seguir usuários e feed social
- 📊 Estatísticas e tendências baseadas em avaliações
- 🔍 Busca de pontos com filtros por categoria

---

## 🚩 Principais dores atacadas

1. Dificuldade em descobrir lugares novos e autênticos
2. Falta de confiança em avaliações impessoais ou não locais
3. Falta de engajamento social em torno da cultura local
4. Baixa visibilidade de estabelecimentos menores
5. Experiência turística pouco imersiva e personalizada
6. Falta de reconhecimento para quem contribui com indicações

---

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 16 (App Router) + React 19 + TypeScript |
| UI | Tailwind CSS 4 + shadcn/ui |
| Backend | ASP.NET Core 10 + EF Core — repo separado (`soromaps_api`) |
| Banco de Dados | PostgreSQL (Supabase) |
| Mapas | MapLibre GL + basemaps CARTO |
| Mobile | Expo (React Native) — não iniciado |
| Nuvem | Vercel (front) + Azure App Service (API) + Supabase (banco) |

> A stack originalmente projetada no TCC (Node.js + Express, SQL Server, Mapbox, AWS) está registrada em [`/docs`](./docs) e comparada com a atual em [Gap modelo × implementação](./docs/wiki/12-gap-modelo-vs-implementacao.md).

---

## 🚀 Como rodar

O projeto são **dois repositórios**, clonados lado a lado. Precisa dos dois de pé, mais um PostgreSQL:

```bash
# 1. clonar os dois repos na mesma pasta pai
git clone https://github.com/stxrdust999/soromaps.git soromaps_web
git clone https://github.com/stxrdust999/soromaps_api.git

# 2. API (.NET 10) — sobe em http://localhost:5068
cd soromaps_api
dotnet run

# 3. web (Next.js 16) — sobe em http://localhost:3000
cd ../soromaps_web
npm install
npm run dev
```

Antes do `npm run dev`, crie um `.env.local` na raiz do repo web:

```bash
API_URL=http://localhost:5068              # usada pelo servidor Next.js
NEXT_PUBLIC_API_URL=http://localhost:5068  # usada pelo navegador
SESSION_SECRET=uma-string-longa-e-aleatoria
```

E preencha a connection string do PostgreSQL em `appsettings.Development.json` no repo da API.

> ⚠️ O projeto **não tem migrations** — as tabelas precisam ser criadas à mão na primeira vez. O DDL pronto, a explicação de cada variável de ambiente e os problemas comuns estão em **[Ambiente e setup](./docs/wiki/13-ambiente-e-setup.md)** — é o guia completo, este aqui é só o resumo.

💡 Nos PCs da FATEC, subir o dev server pelo terminal integrado do VSCode costuma falhar — rode `npm run dev` direto no terminal do sistema.

---

## ☁️ Produção

| Camada | Provedor | Deploy |
|---|---|---|
| Front | Vercel — [soromaps-sigma.vercel.app](https://soromaps-sigma.vercel.app) | automático no push |
| API | Azure App Service | manual |
| Banco | Supabase (PostgreSQL) | schema criado à mão |

> 🔴 **Defeito conhecido:** o mapa não carrega marcadores em produção. Login, cadastro e o CRUD de usuários funcionam. Diagnóstico e correção em [Deploy e infraestrutura](./docs/wiki/14-deploy.md#-estado-de-produção).

---

## 📖 Documentação

**Mapa** — [`/docs`](./docs/README.md): índice de todas as pastas de documentação, com "por onde começar" pra humano e pra agente de IA.

**Wiki** — [`/docs/wiki`](./docs/wiki/00-home.md): duas trilhas, o projetado no TCC e o implementado hoje, mais a página de gap entre elas. É o melhor ponto de partida técnico.

Páginas da wiki mais consultadas: [Deploy e infraestrutura](./docs/wiki/14-deploy.md), [Ambiente e setup](./docs/wiki/13-ambiente-e-setup.md) e [Gap modelo × implementação](./docs/wiki/12-gap-modelo-vs-implementacao.md).

**Decisões de implementação por módulo** em [`/docs/adr`](./docs/adr/README.md).

**Roadmap de módulos** em [`/docs/todo`](./docs/todo/README.md) — o que ainda vai existir, por área (usuário, estabelecimento, admin).

Material histórico (exports originais dos diagramas) em [`/docs/archive`](./docs/archive/README.md).

---

## 👥 Integrantes e responsáveis

Divisão acordada no TCC:

| Integrante | Responsabilidade |
|---|---|
| Arthur | Mobile |
| Gabriel Acciari | Frontend |
| Gabriel Nunes | Nuvem |
| Nicolas | Backend |
| Otávio | Banco de Dados |

---

## 📝 Convenções

- Commits: [Conventional Commits](https://www.conventionalcommits.org/)
- Código em inglês, comentários e docs em pt-BR
- Diagramas em Mermaid como fonte de verdade; exports originais em [`/docs/archive`](./docs/archive/README.md)
- Estrutura de pastas no padrão Dara (Stardust) — ver [Frontend web](./docs/wiki/11-frontend-web.md)
