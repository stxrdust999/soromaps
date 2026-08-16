# Explorar lugares: trilhas por critério, sobre marker real + resto mock

> Módulo: user/places · Rota: `/places` · Data: 2026-08-09

## O que foi implementado

Feed de lugares em trilhas horizontais sobre a mesma lista de pontos, cada
uma com um critério diferente — **Perto de você**, **Em alta**, **Nota
máxima da galera**, **Joias escondidas** e **Recém-adicionados** — mais dois
eixos de recorte no topo: chips de **categoria** e chips de **vibe**.

| Peça | Onde |
|---|---|
| Trilhas, chips de categoria e vibe, tiles por tipo | `places/_components/places-explorer.tsx` |
| Card de local reutilizável | `src/components/blocks/place-card.tsx` |
| Trilha horizontal com cabeçalho e "Ver tudo" | `src/components/blocks/place-rail.tsx` |
| Categorias, vibes e cor de tag | `src/constants/places.ts` |

## Decisões

- **Recorte por vibe, além de categoria.** Categoria responde "o que é",
  vibe responde "pra quê" — um bar e um parque podem servir à mesma noite
  com a galera, e é assim que as pessoas decidem, não por taxonomia. É a
  parte que não existe em app de review comum.
- **A lista de pontos vem real** (`getMarkers()`); **todo o resto é
  fictício** e sai de `src/mocks/markers.ts`, escolhido de forma
  determinística pelo id do marker — mesmo padrão usado nas outras telas que
  leem `src/mocks/markers.ts` (feed da home, página de detalhe).

## Pendências conhecidas

- Foto, descrição e categoria no ponto — colunas ausentes em `markers`,
  spec em `docs/propostas/2026-08-03-expansao-modelo-ponto.md`
- `Categoria` como tabela (hoje os chips são constante no front)
- `tags` no modelo do ponto (alimentam vibe e recomendação) — só existem no
  mock
- `Analise` — nota e total de avaliações
- `Visita` — critério real de "Em alta" (hoje é nota, não movimento)
- Geolocalização do usuário para a distância real — `distancia` é número
  fixo no mock
- Paginação / bounding box em `GET /api/markers` — a rota devolve a tabela
  inteira

Detalhe completo do escopo restante em
[docs/todo/user/places.md](../../todo/user/places.md).
