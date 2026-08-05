/**
 * Cache tags of this resource's reads — the same strings passed to
 * `next: { tags: [...] }` and to `updateTag()`. Centralized so a typo cannot
 * make the two sides diverge and silently leave the map stale.
 */
export const MARKERS_LIST_TAG = "list-markers";

/**
 * Cache tag of a single marker's read.
 *
 * @param id Marker id.
 * @returns Tag string for that marker.
 */
export const markerShowTag = (id: number) => `show-marker-${id}`;
