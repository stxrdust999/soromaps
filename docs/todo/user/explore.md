# 🧭 Descobrir

> Área: usuário público · Rota: `/explore` · Status: 💤 não iniciado

## Ideia

O "modo lista" do produto: uma página de descoberta **fora do mapa**, com os lugares em cards — foto, nome, categoria, média de estrelas, distância. Três abas/ordenações: **Novos** (últimos cadastrados), **Melhor avaliados** e **Em alta** (mais visitados/avaliados na semana).

O mapa é ótimo pra quem já sabe a região; a lista é pra quem quer inspiração ("me dá opção de café"). São modos de consumo diferentes do mesmo dado, e hoje só existe o primeiro.

## Por que vale

- Ataca a dor nº 1 (descobrir lugares novos) por um segundo caminho, mais escaneável que o mapa.
- É a página com melhor SEO em potencial — o mapa é um canvas opaco pra crawler; cards com nome e descrição indexam.
- Cada card linka pro mapa centrado no ponto (`/home?focus=<id>`), costurando os dois modos.

## Dependências

| O quê | Situação |
|---|---|
| `markers` com nome/coords | ✅ existe |
| Descrição, foto e categoria no ponto | ❌ colunas ausentes em `markers` |
| `Analise` (média de estrelas) | ❌ não existe |
| `Visita` (aba "Em alta") | ❌ não existe |

**Dá pra começar hoje** com a aba "Novos" usando só `id`/`nome` — as outras abas entram conforme as tabelas nascem.

## Escopo inicial

- Grid de cards responsivo com skeleton (padrão `Suspense` + promise sem await)
- Ordenação client-side (mesma filosofia da tabela de usuários)
- Filtro por categoria quando `Categoria` existir
- Busca por nome (input no topo, mesmo `SearchInputFilter` adaptado)

## Fora do escopo inicial

- Paginação server-side (esperar bounding box/paginação em `/api/markers`)
- Recomendação personalizada ("porque você visitou X")
