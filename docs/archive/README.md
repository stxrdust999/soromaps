# 🗃️ Archive — material histórico

> Nada aqui é fonte de verdade. É registro do que o projeto **já foi**, mantido porque o Soromaps é um TCC e a evolução das decisões faz parte da entrega.

Regra da pasta: quando um artefato deixa de descrever o estado atual do projeto mas ainda tem valor de histórico, ele vem pra cá — em uma subpasta por contexto — em vez de ser apagado. A documentação viva (`/docs` e `/docs/wiki`) sempre linka de volta pro original arquivado.

---

## 📁 Conteúdo

### `diagramas-originais/`

Exports das ferramentas de modelagem usados na entrega do TCC. Foram convertidos para Mermaid nativo dentro das páginas da wiki e dos docs numerados — as imagens ficam como referência do traçado original.

| Arquivo | O que é | Onde vive hoje em Mermaid |
|---|---|---|
| `diagrama-conceitual.png` | Diagrama de classes (modelo conceitual OO), com `UsuarioNormal`/`Estabelecimento`, `Feed`, `Badge` e `Endereco` | [`wiki/05-modelagem-projetada.md`](../wiki/05-modelagem-projetada.md) |
| `Diagrama_Entidade-Relacionamento.png` | DER com entidades, atributos e cardinalidades `(min, max)` | [`wiki/05-modelagem-projetada.md`](../wiki/05-modelagem-projetada.md) |
| `Modelo-Logico.png` | Modelo lógico: 10 tabelas com tipos, PK e FK | [`04-database.md`](../04-database.md) e [`wiki/05-modelagem-projetada.md`](../wiki/05-modelagem-projetada.md) |
| `Diagrama-de-Sequencia.png` | Sequência MVC da criação de ponto (View → Controller → Model → BD) | [`wiki/04-arquitetura-projetada.md`](../wiki/04-arquitetura-projetada.md) |

---

## 🧭 Decisão

### Mermaid como fonte de verdade, PNG como histórico
**Decisão:** todo diagrama passa a viver em Mermaid dentro do Markdown; o export original vai para `archive/`.
**Motivo:** PNG não é versionável de forma útil — um ajuste de cardinalidade vira um blob novo, sem diff legível. Mermaid entra no code review como texto. Alternativa descartada: manter só o PNG embutido nas páginas, que congelaria os diagramas na primeira versão exportada.
