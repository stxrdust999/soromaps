/**
 * Resolved promise shaped like an empty successful response.
 *
 * Lets a component serving both create and update modes keep one prop
 * shape: create mode has no resource to fetch, and an optional prop would
 * change the `use()` call order between modes.
 *
 * @param data Payload to resolve with, if any.
 * @returns Promise resolving to `{ data, status: 200, headers }`.
 */
export function createFallbackPromise<TResponse>(data?: unknown) {
  return Promise.resolve({
    data,
    status: 200,
    headers: new Headers(),
  } as TResponse);
}
