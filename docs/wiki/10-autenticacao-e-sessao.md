> ⚙️ **Trilha: implementado.** Inclui uma seção de riscos conhecidos — leia antes de expor a API fora da máquina local.

# 🔐 10. Autenticação e sessão

O desenho é incomum e vale entender antes de mexer: **a API valida a senha, mas quem emite a sessão é o Next.js**.

```mermaid
sequenceDiagram
    actor U as Usuário
    participant F as Form /login
    participant SA as loginAction (Server Action)
    participant API as AuthController
    participant DB as PostgreSQL
    participant CK as Cookie httpOnly

    U->>F: userName + password
    F->>SA: loginAction(data)
    SA->>SA: loginSchema.safeParse(data)
    SA->>API: POST /api/auth/login
    API->>DB: SELECT ... WHERE user_name = @userName
    DB-->>API: usuário (ou null)
    API->>API: BCrypt.Verify(senha, hash)
    API-->>SA: 200 { id, userName, userEmail }
    SA->>SA: createSession() assina JWT HS256
    SA->>CK: set "session" (httpOnly, 7 dias)
    SA-->>F: { success: true }
    F-->>U: redireciona para /home
```

---

## 🧩 As três peças

| Peça | Arquivo | Responsabilidade |
|---|---|---|
| Server Actions | [`src/actions/auth.ts`](../../src/actions/auth.ts) | `loginAction`, `registerAction`, `logoutAction` |
| Sessão | [`src/lib/session.ts`](../../src/lib/session.ts) | Assina, valida e lê o JWT |
| Guarda de rota | [`src/middleware.ts`](../../src/middleware.ts) | Redireciona conforme presença de sessão |

### Sessão

`createSession` monta um JWT HS256 **na mão**, com Web Crypto (`crypto.subtle`) — sem biblioteca de JWT:

- Header `{ alg: "HS256", typ: "JWT" }` e payload `{ id, userName, userEmail, exp }`
- Ambos em Base64 URL-safe, assinados por HMAC-SHA256 com `process.env.SESSION_SECRET`
- Validade padrão: 7 dias
- `decryptSession` verifica a assinatura e o `exp`, devolvendo `null` em qualquer falha

O motivo de não usar `jose` ou `jsonwebtoken`: `crypto.subtle` roda no runtime Edge, então o mesmo código serve ao `middleware.ts` sem polyfill nem dependência extra.

O cookie é gravado com `httpOnly: true`, `sameSite: "lax"`, `path: "/"`, `maxAge` de 7 dias e `secure` apenas em produção.

### Guarda de rota

```ts
const PROTECTED_ROUTES = ["/home", "/admin", "/places", "/profile"];
const AUTH_ROUTES = ["/login", "/register"];
```

Rota protegida sem sessão → `/login`. Rota de auth com sessão → `/home`. O `matcher` limita a execução do middleware a essas rotas.

### Cadastro

`registerAction` chama `POST /api/users` e, se der certo, **já cria a sessão e loga o usuário** — sem etapa de confirmação de e-mail.

---

## ⚠️ Riscos conhecidos

Esta seção existe para não deixar nada implícito. Nenhum item abaixo é hipotético — todos são verificáveis no código atual.

### 1. A API não tem autenticação nenhuma

`Program.cs` chama `app.UseAuthorization()`, mas **nenhum esquema de autenticação é registrado** (não há `AddAuthentication`, nem `UseAuthentication`, nem `[Authorize]` em controller algum). Na prática, todos os endpoints de `UsersController` e `MarkersController` estão abertos: qualquer pessoa que alcance a URL da API pode listar, criar, editar e excluir usuários e marcadores, sem credencial.

O cookie de sessão do Next.js **não protege a API** — ele só protege a navegação no front. E como `/home` e `/places/new` chamam a API direto do navegador, a URL da API está exposta em `NEXT_PUBLIC_API_URL`, visível no bundle.

**Correção mínima:** a API passa a emitir o JWT (ou valida o mesmo `SESSION_SECRET` que o Next.js usa), registra `AddAuthentication().AddJwtBearer(...)`, e os controllers ganham `[Authorize]`.

### 2. Hash de senha exposto na resposta

`GET /api/users`, `GET /api/users/{id}`, `POST /api/users` e `PUT /api/users/{id}` devolvem a entidade `User` completa, incluindo `user_password` com o hash BCrypt. Combinado com o item 1, isso significa que os hashes de todos os usuários são obteníveis por uma requisição sem autenticação — material pronto para ataque offline de dicionário.

**Correção:** projetar a resposta num DTO sem o campo de senha.

### 3. Login por `userName`, cadastro por e-mail

O cadastro exige e-mail (`createUserSchema` valida `email`), mas a autenticação busca por `user_name`. Nada no banco garante que `user_name` seja único, e `FirstOrDefault` devolve silenciosamente a primeira linha que casar — com nomes duplicados, o login fica não-determinístico.

**Correção:** constraint `UNIQUE` em `user_name` (e em `user_email`), e decidir qual dos dois é o identificador oficial de login.

### 4. Enumeração de usuários

`AuthController.Login` responde `"Usuário não encontrado"` ou `"Senha incorreta"` — mensagens distintas que revelam quais contas existem. O padrão é uma resposta genérica para os dois casos.

### 5. Sem controle de papel (role)

Existe uma área `/admin` com CRUD de usuários, mas não há coluna de papel no banco nem verificação no middleware ou na API. **Qualquer sessão válida acessa `/admin`** e, por consequência, exclui usuários.

### 6. `SESSION_SECRET` sem fallback é bom; sem rotação, não

`getSecretKey` lança erro explícito se `SESSION_SECRET` não existir — comportamento correto. Mas não há versionamento de chave: trocar o segredo invalida todas as sessões de uma vez. Aceitável agora; vale registrar.

---

## 🧹 Código morto relacionado

[`src/app/api/auth/login/route.ts`](../../src/app/api/auth/login/route.ts) e `src/app/api/auth/logout/route.ts` implementam o mesmo fluxo de login/logout via Route Handler. **Nenhum dos dois tem chamador** — o front usa exclusivamente as Server Actions. São de uma iteração anterior e podem ser removidos.

---

## 🧭 Decisões deste domínio

### JWT assinado no Next.js, não na API
**Decisão:** a API só valida credenciais; o token de sessão é assinado pelo servidor web.
**Motivo:** permite ao `middleware.ts` decidir acesso no Edge sem round-trip à API a cada navegação. **Custo:** a API fica sem noção de identidade — origem direta do risco nº 1.

### JWT na mão com Web Crypto
**Decisão:** implementar assinatura/verificação com `crypto.subtle` em vez de usar uma lib.
**Motivo:** compatibilidade com o runtime Edge sem dependência extra. Custo: código criptográfico próprio para manter — pequeno e revisável, mas próprio.

### Server Actions em vez de Route Handlers
**Decisão:** auth via `"use server"` chamado direto do componente.
**Motivo:** menos superfície pública (não cria endpoint acessível) e validação Zod no mesmo lugar da mutação. Os Route Handlers antigos ficaram órfãos por conta dessa migração.

---

## ➡️ Próxima página

[11 — Frontend web](./11-frontend-web.md)
