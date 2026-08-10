# 📊 Dashboard admin

> Área: admin · Rota: `/admin/dashboard` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

Este módulo dá ao admin a visão de cima: usuários totais e novos na semana, pontos criados, avaliações, e os atalhos com contadores de pendência ("3 pontos aguardando moderação", "2 denúncias abertas").

É deliberadamente um **hub**, não um BI: números que orientam ação, cada card linkando pra tela onde a ação acontece.

## Por que vale

- Atalhos com contador transformam o admin de "lugar que se visita" em "fila de trabalho que se despacha".
- Métricas de crescimento são a primeira coisa que a banca (e um investidor) pergunta.
- Barato: são `COUNT`s sobre tabelas que já existem ou vão existir.

## Dependências

| O quê | Situação |
|---|---|
| Contadores de `tbUsuario` e `markers` | 🟢 dá pra fazer hoje |
| Endpoint agregado (`GET /api/admin/stats`) | ❌ — evitar N chamadas de lista só pra contar |
| Papel/role de admin checado na API | 🔴 pré-requisito — hoje qualquer sessão acessa `/admin` |
| Contadores de moderação/denúncias | ❌ dependem dos módulos irmãos |

## Escopo inicial

- Cards: usuários, pontos, novos na semana (com variação)
- Atalhos com contador para os outros módulos admin
- Gráfico simples de cadastros por semana

## Fora do escopo inicial

- Filtros de período customizados
- Exportar relatórios

## O que já existe (2026-08-09)

Tela inteira implementada em `src/app/(app)/admin/dashboard/`, seguindo o
Figma. Quatro blocos:

| Bloco | Componente | Fonte do dado |
|---|---|---|
| Necessita de atenção | `_components/attention-queues.tsx` | mock |
| Números (4 cards) | `place-segmentation-card`, `new-places-card`, `metric-card` | mock |
| Gráfico (cadastros/semana) | `_components/signups-chart.tsx` | mock |
| Qualidade de dados | `_components/data-quality-chart.tsx` | mock |

**Todos os números vêm de `src/mocks/admin-dashboard.ts`** — nenhuma chamada à
API. Sai de 🟡 quando `GET /api/admin/stats` existir e os módulos irmãos
(`moderation`, `reports`, `businesses`) tiverem tabela para contar.

Decisões de implementação:

- **Gráficos com Recharts** via `src/components/ui/chart.tsx` do shadcn — foi
  o que entrou junto com `breadcrumb`; paleta `--chart-1..5` já existia no
  `globals.css`.
- **Nada de `Math.random`/`Date.now()` no mock.** A série de 90 dias de
  qualidade é gerada por ruído determinístico (`Math.sin`) a partir de uma
  data-âncora fixa — com valor aleatório, servidor e cliente renderizariam
  números diferentes e a hidratação quebraria. Pelo mesmo motivo a espera das
  filas é `aguardandoHaDias: number`, formatado por `formatWaitingDays`, e não
  uma data relativa a `now`.
- **Barra de "lugares novos" é `div`, não `Progress`.** Ela mostra quatro
  estágios de moderação lado a lado; `Progress` é de valor único, então foi
  removido depois de instalado.
- **Trilha de navegação virou `src/components/blocks/page-breadcrumb.tsx`**
  — é a primeira tela a ter, e as outras de admin devem adotar.
- Dois cards do Figma repetiam "Avaliações 254" (copy-paste do protótipo); o
  segundo virou "Novos usuários", que é o que o escopo pedia.
