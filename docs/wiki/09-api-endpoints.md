> ⚙️ **Trilha: implementado.** Catálogo extraído de `soromaps_api/Controllers`. Rota base de todo controller: `api/[controller]`.

# 🔌 09. Endpoints da API

Base: `api/[controller]` — o roteamento do ASP.NET Core é **case-insensitive**, então `/api/Auth/Login` e `/api/auth/login` chegam no mesmo lugar (os dois aparecem no código do front).

| Método | Rota | Controller | O que faz |
|---|---|---|---|
| `POST` | `/api/auth/login` | `AuthController.Login` | Valida credenciais e devolve dados do usuário |
| `GET` | `/api/users` | `UsersController.GetAll` | Lista todos os usuários |
| `GET` | `/api/users/{id}` | `UsersController.GetById` | Busca usuário por id |
| `POST` | `/api/users` | `UsersController.Create` | Cria usuário (faz o hash da senha) |
| `PUT` | `/api/users/{id}` | `UsersController.Put` | Atualiza nome, e-mail e senha |
| `DELETE` | `/api/users/{id}` | `UsersController.Delete` | Remove usuário |
| `GET` | `/api/markers` | `MarkersController.GetAll` | Lista todos os marcadores |
| `GET` | `/api/markers/{id}` | `MarkersController.GetById` | Busca marcador por id |
| `POST` | `/api/markers` | `MarkersController.Create` | Cria marcador |
| `PUT` | `/api/markers/{id}` | `MarkersController.Put` | Atualiza nome e coordenadas |
| `DELETE` | `/api/markers/{id}` | `MarkersController.Delete` | Remove marcador |
| `GET` | `/api/weatherforecast` | `WeatherForecastController` | 🧹 Resto do template `dotnet new webapi` — pode sair |

> ⚠️ **Nenhum endpoint exige autenticação.** Detalhe e impacto em [10 — Autenticação e sessão](./10-autenticacao-e-sessao.md).

---

## 🔐 `POST /api/auth/login`

**Request** (`LoginDTO`):

```json
{ "userName": "arthur", "password": "senha123" }
```

**200 OK:**

```json
{ "id": 1, "userName": "arthur", "userEmail": "arthur@exemplo.com" }
```

**401 Unauthorized:** corpo em texto puro — `"Usuário não encontrado"` ou `"Senha incorreta"`.

Fluxo interno: busca por `UserName` → `BCrypt.Verify(dto.Password, user.Password)` → devolve os três campos. **Não emite token**; quem cria a sessão é o Next.js.

> 🐛 As duas mensagens de erro diferentes permitem enumerar quais usuários existem. Login costuma responder de forma genérica ("credenciais inválidas") justamente para evitar isso.

---

## 👥 `/api/users`

**`POST`** (`UserDTO`):

```json
{ "userName": "arthur", "email": "arthur@exemplo.com", "password": "senha123" }
```

Cria com `BCrypt.HashPassword(dto.Password)` e `CreatedAt`/`UpdatedAt` em `DateTime.UtcNow`. Devolve **a entidade `User` inteira** — incluindo `user_password` com o hash.

**`GET /api/users`** devolve a lista de entidades completas, também com os hashes. O ideal é projetar num DTO de resposta sem o campo de senha.

**`PUT /api/users/{id}`** atualiza nome, e-mail e senha de uma vez. Como o `UserDTO` não tem campos opcionais, atualização parcial não é possível — mandar o objeto sem `password` regrava o hash de uma string vazia.

**Consumido por:** [`src/http/users/users.ts`](../../src/http/users/users.ts) na leitura, [`src/actions/users.ts`](../../src/actions/users.ts) na escrita, e o cadastro público via [`registerAction`](../../src/actions/auth.ts).

---

## 📍 `/api/markers`

**`POST` / `PUT`** (`MarkerDTO`):

```json
{ "nome": "Novo Ponto", "lat": -23.47205863818757, "lng": -47.44623758514884 }
```

`POST` devolve `200 OK` com o marcador criado (o mais correto seria `201 Created`), `DELETE` devolve `204 No Content`, e ambos os `GetById`/`Put`/`Delete` devolvem `404` quando o id não existe.

**Consumido por:**

| Origem | Chamada |
|---|---|
| [`/home`](../../src/app/(app)/(explorer)/home/page.tsx) | `GET /api/markers` sempre que `viewport.zoom >= 14` |
| [`/places/new`](../../src/app/(app)/(explorer)/places/new/page.tsx) | `POST /api/markers` ao confirmar o local |
| [popup do marcador](../../src/app/(app)/(explorer)/home/_components/marker.tsx) | `PUT` e `DELETE /api/markers/{id}` |

> A listagem devolve **todos** os marcadores do banco a cada mudança de zoom; o filtro por proximidade é feito no cliente. Com volume real, isso vira o primeiro gargalo — o caminho natural é receber os limites do viewport (bounding box) por query string.

---

## 🧭 Decisões deste domínio

### DTO de entrada, entidade na saída
**Decisão:** requests usam DTOs; responses devolvem a entidade do EF direto.
**Motivo:** menos código no CRUD inicial. **Custo já materializado:** o hash de senha vaza em toda resposta de `/api/users`. Criar um `UserResponseDTO` é a correção mínima.

### Sem paginação
**Decisão:** `GetAll` devolve a coleção inteira em usuários e marcadores.
**Motivo:** volume de TCC. Vira problema assim que o mapa passar de algumas centenas de pontos.

---

## ➡️ Próxima página

[10 — Autenticação e sessão](./10-autenticacao-e-sessao.md)
