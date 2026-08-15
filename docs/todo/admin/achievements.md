# 🎖️ Conquistas — catálogo

> Área: admin · Rota: `/admin/achievements` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

CRUD do catálogo de conquistas: nome, descrição, ícone e — a parte que importa — o **critério declarativo**: tipo de evento (`visita`, `avaliacao`, `seguidores`…), alvo opcional (categoria X, bairro Y) e quantidade. Criar "Visite 5 cafeterias" é preencher três campos, não escrever código.

É o irmão admin do módulo [Conquistas do usuário](../user/achievements.md): a decisão de modelagem do TCC (catálogo `Conquista` + N:N `GanhaConquista`) existe exatamente pra permitir conquista nova **sem migration** — este módulo é o que cobra essa promessa: sem deploy também.

## Por que vale

- Gamificação viva: conquista sazonal ("Inverno em Sorocaba") criada na hora, sem release.
- Critério declarativo força um motor de concessão genérico — arquitetura melhor do que N `if`s espalhados por actions.
- Contador de "quantos usuários têm" por conquista dá feedback imediato de calibragem (conquista que ninguém tira está mal calibrada).

## Dependências

| O quê | Situação |
|---|---|
| Tabela `Conquista` (+ colunas de critério além do modelado no TCC) | ❌ |
| Motor de concessão lendo o catálogo | ❌ — nasce junto com o [módulo do usuário](../user/achievements.md) |
| Eventos-fonte (`Visita`, `Analise`, `Segue`) | ❌ |
| Papel de admin | 🔴 pré-requisito |

## Escopo inicial

- Tela no padrão de tabela + modais
- Form com builder de critério (selects de tipo/alvo/quantidade)
- Ativar/desativar conquista (sem excluir — quem já ganhou mantém)
- Contador de obtenções por conquista

## Fora do escopo inicial

- Critérios compostos ("X e Y")
- Conquistas com janela de tempo
- Upload de ícone próprio (usar lucide por ora)
- **Pontuação/XP por conquista** — descartado na decisão de 2026-08-12 do
  `CLAUDE.md`. Conquista não vale pontos, e o antigo "nível" virou título
  derivado da contagem de conquistas

## O que já existe (2026-08-09)

Tela em `src/app/(app)/admin/achievements/`, portada de um mockup do Claude
Design. Duas abas: **Catálogo** (faixa de badges + tabela) e **Calibragem**
(as cinco mais e as cinco menos obtidas).

| Peça | Arquivo |
|---|---|
| Catálogo em memória, gatilho e frase derivados | `_components/use-achievements.ts` |
| Frase do critério e estimativa de alcance | `src/helpers/achievement-criteria.ts` |
| Colunas | `_components/columns.tsx` |
| Toolbar (5 chips de coluna) | `_components/toolbar.tsx` |
| Tabela | `_components/achievements-table.tsx` |
| Faixa "Conjunto de badges" | `_components/badge-strip.tsx` |
| Formulário com construtor de critério e prévia | `_components/achievement-form-dialog.tsx` |
| Celebração de desbloqueio | `_components/unlock-preview-dialog.tsx` |
| Confirmação de desativação | `_components/deactivate-dialog.tsx` |
| Duas pontas da distribuição | `_components/calibration-panel.tsx` |
| Eventos, gatilhos, ícones e paleta | `src/constants/achievements.ts` |

**Tudo sobre `src/mocks/admin-achievements.ts`** — 18 conquistas, três delas
zeradas de propósito. Sai de 🟡 quando existirem `Conquista`,
`GanhaConquista` e o motor de concessão.

### O UI kit do Trophy

`AchievementBadge` veio do [Trophy UI Kit](https://ui.trophy.so) via registry
(`npx shadcn@latest add https://ui.trophy.so/achievement-badge`), e foi
**adaptado** — o registry entrega o código, então ele é nosso a partir dali.
Três mudanças sobre o original:

1. Os estados travado/desbloqueado estavam **invertidos**: desbloqueado
   recebia `bg-muted` e travado recebia `bg-primary`.
2. O badge só sabia renderizar `Trophy` ou uma imagem (`badgeUrl`); o nosso
   catálogo escolhe ícone lucide + cor hex, que não tinha como entrar.
3. As strings eram em inglês, e o anel de progresso só aparecia com a
   conquista já obtida — justamente quando progresso não importa mais.

Ganhou também um `layout="icon"`, que devolve só o disco, para a célula de
tabela e as linhas de calibragem.

**`achievement-unlocked` não foi instalado:** ele declara `achievement-badge`
como dependência de registry e o shadcn tenta resolver contra o style
`radix-vega`, que não tem. Como o diálogo de celebração ia ser reescrito de
qualquer forma, foi composto a partir do nosso badge.

**Fora do escopo desta tela:** `AchievementCard`, `AchievementGrid` e
`AchievementList` do kit pertencem a `/achievements` (tela do usuário).

### Decisões que o escopo original não previa

- **Estimativa de alcance no formulário** — "com os dados de hoje, 34 usuários
  já cumpririam este critério". Fecha o ciclo que o próprio doc abria
  ("conquista que ninguém tira está mal calibrada"): o admin descobre antes de
  salvar, não seis meses depois. Hoje é heurística sobre público por evento;
  vira `COUNT` quando `Visita`/`Analise` existirem.
- **Gatilho derivado do evento**, não escolhido pelo admin. Critério de
  sequência é sempre `streak`, criar ponto é sempre `api` — deixar isso como
  campo abriria espaço para combinação impossível.
- **Aba de calibragem** com as duas pontas da distribuição, em vez de só o
  contador de obtenções por linha.
- **Frase do critério como saída de primeira classe.** `formatCriterion`
  devolve `null` quando o critério não fecha, e o formulário troca a frase por
  aviso — é o que impede salvar "Visitar 5 lugares da categoria …".

### Decisões de implementação

- **Sem excluir, só desativar.** O menu de linha não tem exclusão, e o diálogo
  de desativação explica o que acontece com cada lado em vez de perguntar "tem
  certeza?".
- **`columns` é fábrica** e o objeto de ações precisa chegar memoizado — mesma
  restrição de `/admin/categories`.
- **Cópia nasce inativa.** Duas conquistas idênticas publicadas dividem a base
  entre as duas e estragam a leitura de calibragem.

### Pendências visíveis na tela

- Seleção múltipla existe mas não tem ação em lote
- A estimativa de alcance é heurística, não consulta
- O "Compartilhar" da celebração é decorativo
