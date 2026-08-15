# 👤 Perfil

> Área: usuário público · Rota: `/profile` · Status: 💤 não iniciado

## Ideia

A página do próprio usuário: quem ele é na plataforma e o que já fez nela. Avatar, nome, desde quando participa, nível e pontuação, contadores (lugares visitados, avaliações escritas, seguidores) e as conquistas em destaque. Abaixo, a atividade recente — últimas visitas e avaliações.

Hoje `/profile` é uma tela de texto estático. O dado existe em `tbUsuario`, mas nada dele chega à tela.

## Por que vale

- É onde a gamificação vira visível para o dono dela. Conquista sem vitrine não retém ninguém.
- Fecha o ciclo do pilar social: o usuário precisa ver o próprio perfil antes de entender o que os outros veem dele em [Comunidade](./community.md).
- Barato de começar: nome, e-mail e data de cadastro já existem no banco e já viajam na sessão.

## Dependências

| O quê | Situação |
|---|---|
| Dados básicos do usuário (`nome`, `email`, `created_at`) | 🟢 existem em `tbUsuario` e já vão no cookie de sessão |
| Nível / pontuação | ❌ coluna não existe |
| Avatar | ❌ sem upload e sem coluna — ver [Upload de fotos](../../wiki/12-gap-modelo-vs-implementacao.md) |
| `Visita`, `Analise`, `Segue` (contadores) | ❌ |
| `Conquista` + `GanhaConquista` | ❌ |
| Selo de explorador verificado | ❌ critério ainda em aberto — ver [Comunidade](./community.md) |

## Escopo inicial

- Cabeçalho com nome, e-mail, iniciais no avatar e "membro desde"
- Contadores zerados por enquanto, com a estrutura pronta para receber os números
- Link para [Configurações](./settings.md) e para o perfil público

## Fora do escopo inicial

- Edição de dados — é [Configurações](./settings.md)
- Perfil de outro usuário — é [Comunidade](./community.md), com regras de privacidade próprias

## Distinção que precisa ficar clara

Três telas falam de usuário e é fácil confundir: **`/profile`** é a vitrine de quem sou, **`/settings`** é onde altero dados e preferências, e **`/community/[id]`** é como os outros me veem — com menos campo, sem e-mail.
