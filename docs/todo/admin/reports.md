# 🚩 Denúncias e feedback

> Área: admin · Rota: `/admin/reports` · Status: 🟡 parcial — tela pronta, dados em mock

## Ideia

A caixa de entrada do admin, em duas abas que dividem a rota mas não o assunto:

**Denúncias** — o canal de report da comunidade: qualquer usuário denuncia avaliação, comentário, ponto ou perfil (botão "denunciar" discreto + motivo). Do lado admin, a fila agrupa denúncias **por alvo** — o item denunciado 5 vezes é um caso, não cinco — com o conteúdo, o histórico do autor e as ações: descartar, remover conteúdo, advertir.

**Feedback** — o que o usuário tem a dizer sobre o *produto*, não sobre conteúdo de outro usuário: bug, sugestão, elogio. Não tem alvo, não tem o que remover, e o desfecho é triagem (`novo` / `lido` / `respondido`), não punição.

As duas convivem na mesma tela porque compartilham a forma — fila que chega sozinha e precisa ser despachada — e porque separá-las em duas rotas criaria um item de menu que fica vazio na maior parte do tempo. **O que não pode é tratá-las com o mesmo modelo:** o alvo, as ações e o significado de "resolvido" são diferentes.

Complementa a [Moderação](./moderation.md): lá é o filtro **preventivo** (conteúdo novo aguardando aprovação); aqui é o **reativo** (conteúdo já público que a comunidade sinalizou). Juntos cobrem os casos de uso de remoção do ator Administrador do TCC.

## Por que vale

- Moderação preventiva não escala pra comentários e avaliações (volume alto, dano baixo) — pra esses, publicar e reagir a report é o custo certo.
- Plataforma com conteúdo público de usuário **precisa** de canal de denúncia — é higiene básica, inclusive legal.
- Denúncias por usuário/alvo geram o sinal de reputação que outros módulos podem consumir depois.
- Feedback é o canal mais barato de descobrir o que está quebrado: num TCC sem analytics, é a única fonte de problema relatado por quem usa.

## Dependências

| O quê | Situação |
|---|---|
| Entidade nova `Denuncia` (`id`, `autorID`, `alvoTipo`, `alvoID`, `motivo`, `status`, `created_at`) | ❌ — **não estava no modelo do TCC**, é adição nossa. Alvo polimórfico (`alvoTipo` + `alvoID`) |
| Entidade nova `Feedback` (`id`, `autorID`, `tipo`, `mensagem`, `status`, `created_at`) | ❌ — sem alvo, e o `autorID` pode ser nulo se aceitar envio anônimo |
| Conteúdo denunciável (`Analise`, `Comentario`) | ❌ — pontos e perfis já existem |
| Papel de admin | 🔴 pré-requisito |

**Decisão tomada (2026-08-09):** feedback **aceita envio anônimo**. A tela trata os dois casos na mesma lista, e a linha anônima mostra "sem como responder" com a ação de responder desabilitada — o custo do anônimo fica visível em vez de virar surpresa. O chip de autoria existe para medir a proporção depois.

## Escopo inicial

- Botão denunciar com motivos fixos (spam, ofensa, informação falsa, outro)
- Fila de denúncias agrupada por alvo, no padrão de tabela
- Ações: descartar / remover conteúdo (soft delete), ambas encerrando o caso
- Anti-abuso mínimo: uma denúncia por usuário por alvo
- Aba de feedback: formulário de envio (bug / sugestão / elogio) e triagem por status

## Fora do escopo inicial

- Advertência/suspensão de conta (precisa de sistema de punição)
- Automação (auto-ocultar após N denúncias)
- Notificar o denunciante do desfecho
- Responder feedback dentro do app (por ora, o contato sai por fora)

## O que já existe (2026-08-09)

Tela em `src/app/(app)/admin/reports/`, portada de um mockup do Claude Design.
**As duas abas têm forma de tela diferente**, o que é a tradução direta do
aviso acima: mesma forma de trabalho, modelos distintos.

| Aba | Forma | Por quê |
|---|---|---|
| Denúncias | Mestre-detalhe | Decidir exige ler o conteúdo inteiro, os denunciantes e o histórico do autor — não cabe em linha de tabela |
| Feedback | Listagem com chips | Triagem rápida: ler, classificar, seguir. A mensagem expande na própria linha |

| Peça | Arquivo |
|---|---|
| Estado, sinais de risco, agregação de motivos | `_components/use-reports.ts` |
| Fila agrupada por alvo | `_components/report-queue.tsx` |
| Painel de decisão | `_components/report-detail.tsx` |
| Conteúdo denunciado, por tipo de alvo | `_components/reported-content.tsx` |
| Nota em estrelas | `_components/star-rating.tsx` |
| Remoção com motivo | `_components/removal-dialog.tsx` |
| Triagem de feedback | `_components/feedback-table.tsx`, `columns-feedback.tsx` |

**Tudo sobre `src/mocks/admin-reports.ts`** — 9 casos e 18 envios de feedback.

### A regra que define a aba de denúncias

**A fila lista alvos, não denúncias.** O item reportado seis vezes é um caso;
seis linhas iguais fariam o admin decidir a mesma coisa seis vezes e inflariam
o tamanho aparente da fila. A contagem vai na linha, os denunciantes
individuais abrem no painel.

### Decisões que o escopo original não previa

- **Selo de denúncia coordenada.** Quando três ou mais denunciantes são contas
  de até 3 dias e *todos* os denunciantes são novos, o caso é marcado em
  vermelho. Sem isso a fila vira arma: cinco contas criadas ontem derrubam
  qualquer conteúdo legítimo. É o análogo do sinal de conflito de
  [Comércios](./businesses.md).
- **Selo de motivos divergentes.** Denunciantes que não concordam entre si
  (um diz spam, outro diz ofensa) costumam indicar desavença pessoal, não
  problema no conteúdo. Sinal fraco, marcado como neutro de propósito.
- **Contexto técnico do bug** — rota e dispositivo, coletados no envio. É o que
  separa "não funciona" de relato acionável, e sai de graça.
- **Renderização por tipo de alvo.** Avaliação mostra estrelas, comentário
  mostra a avaliação-mãe recuada, ponto mostra foto e coordenada, perfil mostra
  bio e contadores. Reduzir tudo a um bloco de texto tiraria o que sustenta a
  decisão.

### Decisões de implementação

- **Sem "advertir" nem "suspender".** Punição de conta está fora do escopo, e
  prometer o botão seria mentira. O rodapé do painel diz isso explicitamente.
- **A fila da esquerda usa `Select` simples, não os chips de filtro.** Numa
  coluna de 380px o chip expansível não tem para onde crescer; os chips ficam
  na aba de feedback, que tem a largura da página.
- **`h-dvh` na página**, mesma razão de `/admin/moderation`: mestre-detalhe com
  rolagem por coluna precisa de altura fechada.

### Pendências visíveis na tela

- O tempo médio de resolução e "resolvidos esta semana" são fixos no mock
- A observação do diálogo de remoção não é persistida
- Marcar feedback como respondido não abre canal nenhum — o contato sai por fora

## Fronteira com as telas vizinhas

- **[Moderação](./moderation.md)**: julga ponto novo antes de publicar; aqui só entra o que já está público.
- **[Avaliações](./reviews.md)**: mesma ação de remover avaliação, entrada diferente — lá o admin varre por conta própria, aqui ele reage a report. **A remoção precisa ser uma server action só**, consumida pelas duas telas, senão as regras divergem.
- **[Moderação do estabelecimento](../business/moderation.md)**: o dono modera comentário nas próprias respostas; nada do que ele faz passa por esta fila.
