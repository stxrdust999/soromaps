import type { MarkerResource } from "@/types/marker";

/**
 * HTTP client of the markers resource, mirroring `src/http/users/users.ts`:
 * reads take `options?: RequestInit` so the caller declares cache tags, and
 * return a union discriminated by `status` instead of throwing; writes hand
 * back the raw `Response` for the action to check.
 *
 * Reads `API_URL`, not `NEXT_PUBLIC_API_URL` — this module only runs on the
 * server. `src/hooks/use-markers.ts` still fetches from the client because
 * it reacts to map gestures; migrating it depends on the `/api/proxy` route
 * in the backlog.
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

export type getMarkersResponse =
  | ({ data: MarkerResource[]; status: 200 } & { headers: Headers })
  | ({ data: ApiErrorBody; status: ApiErrorStatus } & { headers: Headers });

export type getMarkerResponse =
  | ({ data: MarkerResource; status: 200 } & { headers: Headers })
  | ({ data: ApiErrorBody; status: ApiErrorStatus } & { headers: Headers });

/**
 * Lists every marker. The API has no pagination or bounding box filter yet,
 * so this returns the whole table.
 *
 * @param options Fetch options — where the caller declares cache tags.
 * @returns `status 200` with the markers, or an error status with a message.
 */
export async function getMarkers(
  options?: RequestInit,
): Promise<getMarkersResponse> {
  const response = await fetch(`${API_URL}/api/markers`, options);

  if (!response.ok) {
    return {
      data: { message: "Falha ao buscar locais." },
      status: response.status as ApiErrorStatus,
      headers: response.headers,
    };
  }

  return {
    data: (await response.json()) as MarkerResource[],
    status: 200,
    headers: response.headers,
  };
}

/**
 * Fetches one marker by id.
 *
 * @param id Marker id.
 * @param options Fetch options — where the caller declares cache tags.
 * @returns `status 200` with the marker, or an error status with a message.
 */
export async function getMarker(
  id: number,
  options?: RequestInit,
): Promise<getMarkerResponse> {
  const response = await fetch(`${API_URL}/api/markers/${id}`, options);

  if (!response.ok) {
    return {
      data: {
        message:
          response.status === 404
            ? "Local não encontrado."
            : "Falha ao buscar local.",
      },
      status: response.status as ApiErrorStatus,
      headers: response.headers,
    };
  }

  return {
    data: (await response.json()) as MarkerResource,
    status: 200,
    headers: response.headers,
  };
}

interface MarkerPayload {
  nome: string;
  lat: number;
  lng: number;
}

/**
 * Creates a marker.
 *
 * @param payload Name and coordinate.
 * @returns Raw response — the caller checks the status.
 */
export async function postMarker(payload: MarkerPayload): Promise<Response> {
  return fetch(`${API_URL}/api/markers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Updates a marker.
 *
 * ⚠️ `MarkersController.Put` overwrites all three columns — there is no
 * partial update, so the coordinate travels along even on a rename.
 *
 * @param id Marker id.
 * @param payload Full marker payload.
 * @returns Raw response — the caller checks the status.
 */
export async function putMarker(
  id: number,
  payload: MarkerPayload,
): Promise<Response> {
  return fetch(`${API_URL}/api/markers/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/**
 * Deletes a marker.
 *
 * @param id Marker id.
 * @returns Raw response — the caller checks the status.
 */
export async function deleteMarker(id: number): Promise<Response> {
  return fetch(`${API_URL}/api/markers/${id}`, { method: "DELETE" });
}
