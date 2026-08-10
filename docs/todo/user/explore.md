# 🧭 Descobrir

> Área: usuário público · Rota: `/discover` · Status: 💤 não iniciado

## Ideia

A descoberta **pessoal**: parte do que o usuário já visitou e sugere o que combina com isso. Abre com as visitas recentes ("você esteve aqui") e, a partir delas, monta recomendações usando categoria, tags e vibe dos lugares — "você curte cafeteria calma, tem uma no bairro vizinho que você não conhece".

É o contraponto do [Explorar lugares](./places.md): lá o critério é público e igual para todos (nota, distância, movimento); aqui é derivado do histórico de quem está olhando. Duas pessoas abrindo `/discover` no mesmo minuto veem telas diferentes.

Entram aqui também os dois campos que hoje não aparecem em tela nenhuma — **segredo local** e **melhor horário** — que são exatamente o tipo de informação que não cabe em ranking, mas faz sentido como sugestão ("vá antes das 9h, antes de encher").

## Por que vale

- Recomendação é o que separa catálogo de produto: sem ela, o usuário só encontra o que já sabia procurar.
- Reaproveita dado que o produto já vai coletar de qualquer forma (visita, categoria, tag) — não exige nova coleta.
- Fecha o ciclo da gamificação por outro lado: quanto mais o usuário visita, melhor a tela fica, o que dá motivo para voltar a registrar visita.

## Dependências

| O quê | Situação |
|---|---|
| `Visita` — a base inteira da tela | ❌ não existe — já modelada no TCC |
| `tags` / `Categoria` no modelo do ponto | ❌ só existem em `src/mocks/markers.ts` |
| `segredoLocal` e `melhorHorario` persistidos | ❌ previstos em `docs/propostas/2026-08-03-expansao-modelo-ponto.md` |
| `Analise` (para não recomendar lugar mal avaliado) | ❌ |
| `Segue` (camada social da recomendação) | ❌ |
| Autenticação na API | 🔴 pré-requisito — a tela é por usuário |

**É o módulo mais bloqueado do produto:** sem `Visita` não existe entrada, e sem `tags` não existe critério. Não faz sentido começar antes dos dois.

## Escopo inicial

- Trilha "Você esteve aqui" com as visitas recentes
- Recomendação por proximidade de atributo: mesma categoria ou tag em comum com o que foi visitado, excluindo o que já foi
- Trilha de "segredos locais" dos lugares recomendados
- Estado vazio honesto para quem ainda não visitou nada — cair no [Explorar lugares](./places.md)

## Fora do escopo inicial

- Recomendação por comportamento coletivo ("quem foi aqui também foi ali") — precisa de massa de dados
- Peso configurável entre os critérios
- Recomendação baseada em quem o usuário segue — depende de `Segue`, entra depois
