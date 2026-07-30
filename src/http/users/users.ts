import type { UserResource } from "@/types/user";

/**
 * HTTP client of the users resource. Hand-written, but reproducing the
 * contract a generator (Orval, from Swagger) would emit:
 *
 * - every read takes `options?: RequestInit`, so callers declare cache with
 *   `next: { tags: [...] }` while this layer knows nothing about cache;
 * - responses are unions discriminated by `status`, hence consumers write
 *   `status === 200 ? data : []` instead of `try/catch` — on reads an error
 *   is a status, not an exception;
 * - response types are exported and type the prop crossing from Server to
 *   Client Component; `Promise<UserResource[]>` would lose the discriminant.
 */

const API_URL = process.env.API_URL;

interface ApiErrorBody {
  message: string;
}

/**
 * Error statuses this API can return. Literals instead of `number` on
 * purpose: `number` would include `200`, killing the discriminant and
 * forcing a cast on every consumer.
 */
type ApiErrorStatus = 400 | 401 | 403 | 404 | 409 | 500 | 502 | 503;

export type getUsersResponse =
  | ({ data: UserResource[]; status: 200 } & { headers: Headers })
  | ({ data: ApiErrorBody; status: ApiErrorStatus } & { headers: Headers });

export type getUserResponse =
  | ({ data: UserResource; status: 200 } & { headers: Headers })
  | ({ data: ApiErrorBody; status: ApiErrorStatus } & { headers: Headers });

/**
 * Strips the password hash the API serializes along with the user, keeping
 * it out of components and RSC payloads. Root fix is an output DTO in the
 * API, tracked in the backlog.
 *
 * @param raw User as the API returned it.
 * @returns User with known fields only.
 */
function sanitizeUser(raw: UserResource & { password?: string }): UserResource {
  return {
    id: raw.id,
    userName: raw.userName,
    email: raw.email,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

/**
 * Lists every user.
 *
 * @param options Fetch options — where the caller declares cache tags.
 * @returns `status 200` with the users, or an error status with a message.
 */
export async function getUsers(
  options?: RequestInit,
): Promise<getUsersResponse> {
  const response = await fetch(`${API_URL}/api/users`, options);

  if (!response.ok) {
    return {
      data: { message: "Falha ao buscar usuários." },
      status: response.status as ApiErrorStatus,
      headers: response.headers,
    };
  }

  const data = (await response.json()) as (UserResource & {
    password?: string;
  })[];

  return {
    data: data.map(sanitizeUser),
    status: 200,
    headers: response.headers,
  };
}

/**
 * Fetches one user by id.
 *
 * @param id User id.
 * @param options Fetch options — where the caller declares cache tags.
 * @returns `status 200` with the user, or an error status with a message.
 */
export async function getUser(
  id: number,
  options?: RequestInit,
): Promise<getUserResponse> {
  const response = await fetch(`${API_URL}/api/users/${id}`, options);

  if (!response.ok) {
    return {
      data: {
        message:
          response.status === 404
            ? "Usuário não encontrado."
            : "Falha ao buscar usuário.",
      },
      status: response.status as ApiErrorStatus,
      headers: response.headers,
    };
  }

  const data = (await response.json()) as UserResource & { password?: string };

  return {
    data: sanitizeUser(data),
    status: 200,
    headers: response.headers,
  };
}

interface UserPayload {
  userName: string;
  email: string;
  password: string;
}

/**
 * Creates a user; the API hashes the password.
 *
 * @param payload User name, email and plain password.
 * @returns Raw response — the caller checks the status.
 */
export async function postUser(payload: UserPayload): Promise<Response> {
  return fetch(`${API_URL}/api/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Updates a user.
 *
 * ⚠️ The API's `UsersController.Put` re-hashes the password on every call —
 * there is no partial update, which is why the edit form requires it.
 *
 * @param id User id.
 * @param payload Full user payload, password included.
 * @returns Raw response — the caller checks the status.
 */
export async function putUser(
  id: number,
  payload: UserPayload,
): Promise<Response> {
  return fetch(`${API_URL}/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Deletes a user.
 *
 * @param id User id.
 * @returns Raw response — the caller checks the status.
 */
export async function deleteUser(id: number): Promise<Response> {
  return fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
}
