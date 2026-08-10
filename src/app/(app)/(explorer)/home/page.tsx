import {
  MapDrawerExpanded,
  MapDrawerLayout,
} from "@/components/blocks/map-drawer-layout";
import { SiteFooter } from "@/components/blocks/site-footer";
import { MARKERS_LIST_TAG } from "@/constants/markers";
import { getMarkers } from "@/http/markers/markers";

import { FeedNearbySection } from "./_components/feed/feed-nearby-section";
import { FeedTrendingSection } from "./_components/feed/feed-trending-section";
import { HomeMapLayers } from "./_components/home-map-layers";
import { HomePanelHeader } from "./_components/home-panel-header";

export default async function HomePage() {
  const response = await getMarkers({ next: { tags: [MARKERS_LIST_TAG] } });
  const markers = response.status === 200 ? response.data : [];

  return (
    <MapDrawerLayout map={<HomeMapLayers />}>
      <HomePanelHeader />

      <div className="flex flex-col gap-6 px-8 pb-4">
        <FeedNearbySection markers={markers} />
        <FeedTrendingSection markers={markers} />
      </div>

      <MapDrawerExpanded>
        <SiteFooter />
      </MapDrawerExpanded>
    </MapDrawerLayout>
  );
}
