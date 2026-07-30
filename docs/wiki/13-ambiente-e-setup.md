> ⚙️ **Trilha: implementado.** Do zero até os dois serviços rodando **local**. Para os ambientes publicados (Vercel, Azure, Supabase), ver [14 — Deploy](./14-deploy.md).

# 🛠️ 13. Ambiente e setup local

Três peças precisam estar de pé: **PostgreSQL**, **API .NET** e **web Next.js**.

```mermaid
flowchart LR
    PG[("🐘 PostgreSQL")] --> API["⚙️ soromaps_api<br/>localhost:5068"]
    API --> WEB["💻 soromaps_web<br/>localhost:3000"]
```

---

## 📋 Pré-requisitos

| Ferramenta | Versão |
|---|---|
| Node.js | 20+ (`@types/node` fixado em `^20`) |
| .NET SDK | 10.0 (`net10.0`) |
| PostgreSQL | qualquer versão suportada pelo Npgsql 10 |

Os dois repositórios ficam lado a lado:

```
c:\www\
├── soromaps_web\
└── soromaps_api\
```

---

## 🐘 1. Banco

Crie um banco PostgreSQL e as duas tabelas.

> ⚠️ **Não existem migrations no projeto** — não há `Migrations/` nem o pacote `Microsoft.EntityFrameworkCore.Design`. O schema precisa ser criado manualmente. O DDL abaixo reproduz exatamente o que os models mapeiam hoje:

```sql
CREATE TABLE "tbUsuario" (
    id            SERIAL PRIMARY KEY,
    user_name     VARCHAR(255) NOT NULL,
    user_email    VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP    NOT NULL,
    updated_at    TIMESTAMP    NOT NULL
);

CREATE TABLE markers (
    id   SERIAL PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    lat  DOUBLE PRECISION NOT NULL,
    lng  DOUBLE PRECISION NOT NULL
);
```

`"tbUsuario"` precisa das aspas: PostgreSQL rebaixa identificadores não-citados para minúsculo, e o mapeamento em `Models/User.cs` usa maiúscula no meio do nome.

Adotar Migrations é o item 6 do [backlog](./12-gap-modelo-vs-implementacao.md).

---

## ⚙️ 2. API

```bash
cd ../soromaps_api
dotnet restore
dotnet run
```

Sobe em `http://localhost:5068` (e `https://localhost:7240` no perfil `https`), conforme `Properties/launchSettings.json`. Em `Development`, o documento OpenAPI fica em `/openapi/v1.json`.

### Configuração

A connection string vem de `ConnectionStrings:DefaultConnection`. O `appsettings.json` versionado tem o valor **vazio de propósito** — preencha por `appsettings.Development.json` (ignorado pelo git) ou por variável de ambiente:

```jsonc
// appsettings.Development.json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=soromaps;Username=postgres;Password=SUA_SENHA"
  }
}
```

Equivalente por variável de ambiente:

```powershell
$env:ConnectionStrings__DefaultConnection = "Host=localhost;Database=soromaps;Username=postgres;Password=SUA_SENHA"
```

### CORS

`Program.cs` libera apenas `http://localhost:3000`. Rodar o front em outra porta quebra as chamadas client-side de markers — ajuste a origem no `Program.cs` (ou torne-a configurável, item 9 do backlog).

---

## 💻 3. Web

```bash
cd soromaps_web
npm install
npm run dev
```

Sobe em `http://localhost:3000`.

### Variáveis de ambiente

Crie um `.env.local` na raiz do repo web:

```bash
# URL da API usada pelo servidor Next.js (Server Actions, route handlers).
# Privada — nunca chega ao browser.
API_URL=http://localhost:5068

# URL da API usada pelos Client Components (/home, /places/new).
# Vai para o bundle do navegador — é pública por natureza.
NEXT_PUBLIC_API_URL=http://localhost:5068

# Segredo do HMAC que assina o cookie de sessão.
# Sem ele, qualquer rota que toque sessão lança erro na hora.
SESSION_SECRET=troque-por-uma-string-longa-e-aleatoria
```

| Variável | Onde é lida | Se faltar |
|---|---|---|
| `API_URL` | `src/http/*`, `src/actions/*` | `fetch` monta `undefined/api/...` e falha |
| `NEXT_PUBLIC_API_URL` | `/home`, `/places/new`, popup do marcador | Cai no fallback `""` — as chamadas viram caminho relativo e batem no próprio Next.js, retornando 404 |
| `SESSION_SECRET` | `src/lib/session.ts` | Erro explícito: `SESSION_SECRET must be defined in your environment variables` |

As duas primeiras apontam para o mesmo lugar em desenvolvimento.

> 🔴 **Em produção a segunda não existe.** `NEXT_PUBLIC_API_URL` foi deliberadamente deixada de fora da Vercel, porque tudo com esse prefixo é gravado em texto puro no bundle e a URL da API é tratada como segredo. É exatamente o cenário da terceira linha da tabela — e é por isso que o mapa não carrega marcadores em produção hoje. Ver [14 — Deploy](./14-deploy.md#-estado-de-produção).

> 📄 Existe um `.env.example` na raiz do repo web, mas ele **não é versionado**: a regra `.env*` do `.gitignore` também o captura. Quem clona o repositório não o recebe — corrigir exige uma exceção `!.env.example`.

---

## ✅ Verificação rápida

```bash
# 1. API respondendo
curl http://localhost:5068/api/markers

# 2. Criar um marcador
curl -X POST http://localhost:5068/api/markers \
  -H "Content-Type: application/json" \
  -d '{"nome":"Teste","lat":-23.472,"lng":-47.446}'

# 3. Criar um usuário
curl -X POST http://localhost:5068/api/users \
  -H "Content-Type: application/json" \
  -d '{"userName":"teste","email":"teste@exemplo.com","password":"Senha123"}'
```

Depois: abrir `http://localhost:3000/login`, entrar com `teste` / `Senha123` e conferir se `/home` mostra o marcador criado. Zoom abaixo de 14 esconde os marcadores — é comportamento esperado.

---

## 🧯 Problemas comuns

| Sintoma | Causa provável |
|---|---|
| Mapa carrega, marcadores não aparecem | `NEXT_PUBLIC_API_URL` ausente, ou zoom abaixo de 14 |
| Erro de CORS no console | Front fora de `http://localhost:3000` — origem fixa em `Program.cs` |
| `SESSION_SECRET must be defined` | Falta a variável no `.env.local` |
| Login sempre "Usuário não encontrado" | Usuário criado direto no banco com senha em texto puro — o hash precisa vir do `POST /api/users` |
| `relation "tbUsuario" does not exist` | Tabela criada sem aspas e rebaixada para minúsculo |
| Funciona local mas não em produção | Quase sempre variável de ambiente ausente na Vercel, ou o defeito conhecido do mapa — ver [14](./14-deploy.md#-estado-de-produção) |
| Erro de *prepared statement* ao apontar para o Supabase | Connection string usando o pooler (porta 6543, PgBouncer em modo transaction). Usar a conexão direta (5432) |

---

## ➡️ Próxima página

[14 — Deploy e infraestrutura](./14-deploy.md) — os ambientes publicados.
