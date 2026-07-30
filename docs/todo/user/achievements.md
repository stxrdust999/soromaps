# 🏆 Conquistas

> Área: usuário público · Rota: `/achievements` · Status: 💤 não iniciado

## Ideia

Galeria de badges do usuário: as obtidas em cores com a data de obtenção, as bloqueadas em cinza **com o critério visível** ("Visite 5 cafeterias — 3/5"). Mostrar o progresso da conquista bloqueada é o que transforma a galeria em motor de comportamento: o usuário sabe exatamente o que falta.

Modelagem já definida no TCC: `Conquista` é catálogo, `GanhaConquista` é a N:N com `data` — criar conquista nova não mexe em `Usuario`.

## Por que vale

- É o pilar da gamificação inteiro — hoje zero implementado dos três pilares, este é o mais visível.
- Ataca a dor nº 6 (falta de reconhecimento pra quem contribui).
- Conquista compartilhável ("Explorador da Zona Norte 🏅") é marketing orgânico.

## Dependências

| O quê | Situação |
|---|---|
| Tabelas `Conquista` + `GanhaConquista` | ❌ não existem — já modeladas |
| Motor de concessão (avaliar critérios após check-in/avaliação) | ❌ — pode começar síncrono na própria action |
| `Visita` e `Analise` (fontes dos critérios) | ❌ |
| [Admin: catálogo de conquistas](../admin/achievements.md) | ❌ — irmão deste módulo |

## Escopo inicial

- 6–10 conquistas de lançamento (primeira avaliação, primeiro check-in, 5 lugares, 3 categorias, 1 por bairro…)
- Critérios **declarativos** no catálogo (`tipo` + `alvo` + `quantidade`), não hard-coded — é o que permite o admin criar conquista sem deploy
- Toast de celebração no momento da obtenção
- Galeria em `/achievements` + badges em destaque no perfil público

## Fora do escopo inicial

- Pontuação/nível (colunas `pontuacao`/`nivel` do modelo conceitual — fase 2)
- Conquistas sazonais/por tempo limitado
