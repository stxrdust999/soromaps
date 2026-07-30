/**
 * User as `GET /api/users` returns it — the .NET API serializes the entity
 * in camelCase, so `user_name` / `user_email` arrive as `userName` / `email`.
 *
 * `user_password` (BCrypt hash) also comes in the response and is left out
 * on purpose: `src/http/users` strips it. Root fix is an output DTO in the
 * API, tracked in the wiki backlog.
 */
export interface UserResource {
  id: number;
  userName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}
