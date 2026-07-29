# 🌆 01. Visão Geral — Soromaps

> Contexto do projeto, dores que ele ataca, modelo de negócio e personas. Ponto de partida pra quem chega no repo.

---

## 📋 Visão geral

O Soromaps é uma plataforma digital interativa que permite descobrir, avaliar e compartilhar experiências em estabelecimentos locais de Sorocaba. A proposta combina três pilares — **geolocalização**, **gamificação** e **rede social** — para incentivar a exploração da cidade de forma divertida e colaborativa, com avaliações feitas por quem realmente conhece a região.

---

## 🚩 Dores identificadas

| # | Dor | Pilar que ataca |
|---|---|---|
| 1 | Dificuldade em descobrir lugares novos e autênticos | Geolocalização |
| 2 | Falta de confiança em avaliações impessoais ou não locais | Rede social |
| 3 | Falta de engajamento social em torno da cultura local | Rede social |
| 4 | Baixa visibilidade de estabelecimentos menores | Geolocalização |
| 5 | Experiência turística pouco imersiva e personalizada | Gamificação |
| 6 | Falta de reconhecimento para quem contribui com indicações | Gamificação |

---

## 💰 Modelo de negócio

O Canvas completo está no material de apresentação do TCC (não versionado neste repo). Em resumo, o modelo se apoia em dois lados:

- **Usuários finais** — uso gratuito; geram o conteúdo (avaliações, fotos, pontos) e o engajamento.
- **Estabelecimentos** — perfil verificado (CNPJ) com acesso a estatísticas e interação direta com clientes; principal fonte de monetização futura.

---

## 👤 Personas

### 🍔 Augusto Silva — o dono de estabelecimento

| Atributo | Valor |
|---|---|
| Idade | 32 |
| Profissão | Dono de lanchonete (ArtBurguer) |
| Cidade | Sorocaba |

Empreendedor formado em Administração, hands-on, apaixonado por gastronomia. Valoriza feedback genuíno dos clientes, mas **sente falta de uma plataforma centralizada** que facilite essa comunicação.

**Objetivo:** expandir o negócio (segunda unidade em 2 anos). Precisa de uma ferramenta que centralize avaliações e feedbacks, permitindo identificar pontos de melhoria e interagir diretamente com clientes.

**Como o Soromaps atende:** perfil de estabelecimento com estatísticas de avaliações (RF-10), respostas a comentários (RF-09) e visibilidade no mapa (RF-05).

### 📱 Sara Almeida — a exploradora local

| Atributo | Valor |
|---|---|
| Idade | 25 |
| Profissão | Auxiliar de RH / estudante de Marketing Digital |
| Cidade | Sorocaba |

Extremamente ativa em redes sociais, escreve resenhas no Letterboxd, sai nos fins de semana pra explorar cafeterias, restaurantes e bares. Sente falta de descobrir locais com base em **avaliações reais e detalhadas** — não só estrelas, mas atendimento, ambiente, cardápio e diferenciais.

**Objetivo:** uma plataforma confiável que centralize avaliações detalhadas e onde as próprias resenhas dela ajudem outras pessoas.

**Como o Soromaps atende:** análises com conteúdo + estrelas (RF-07), comentários com resposta (RF-09), gamificação que reconhece quem contribui (conquistas/badges) e busca com filtros (RF-11/12).

> 📄 Fichas completas: `Persona_1.pdf` e `Persona_2.pdf` no material do TCC.

---

## 🧭 Decisões deste domínio

### Foco geográfico em Sorocaba
**Decisão:** lançar restrito a Sorocaba em vez de plataforma genérica.
**Motivo:** a dor central é a confiança em avaliações *locais*; escopo restrito viabiliza densidade de conteúdo com base pequena de usuários. Alternativa descartada: multi-cidade desde o início (esforço de aquisição inviável pro TCC).
