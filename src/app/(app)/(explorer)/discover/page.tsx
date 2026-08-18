import { MARKERS_LIST_TAG } from "@/constants/markers";
import { getMarkers } from "@/http/markers/markers";

import { DiscoverExplorer } from "./_components/discover-explorer";

export default async function DiscoverPage() {
  const response = await getMarkers({ next: { tags: [MARKERS_LIST_TAG] } });
  const markers = response.status === 200 ? response.data : [];

  return <DiscoverExplorer markers={markers} />;
}
