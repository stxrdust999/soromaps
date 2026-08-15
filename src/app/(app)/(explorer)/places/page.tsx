import { MARKERS_LIST_TAG } from "@/constants/markers";
import { getMarkers } from "@/http/markers/markers";

import { PlacesExplorer } from "./_components/places-explorer";

export default async function PlacesPage() {
  const response = await getMarkers({ next: { tags: [MARKERS_LIST_TAG] } });
  const markers = response.status === 200 ? response.data : [];

  return <PlacesExplorer markers={markers} />;
}
