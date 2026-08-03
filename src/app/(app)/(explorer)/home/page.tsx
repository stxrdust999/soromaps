import {
  MapDrawerExpanded,
  MapDrawerLayout,
} from "@/components/blocks/map-drawer-layout";
import { SiteFooter } from "@/components/blocks/site-footer";

import FeedNewInMapSection from "./_components/feed/feed-new-in-map-section";
import FeedTrendingSection from "./_components/feed/feed-trending-section";
import { HomeMapLayers } from "./_components/home-map-layers";
import { HomePanelHeader } from "./_components/home-panel-header";

export default function HomePage() {
  return (
    <MapDrawerLayout map={<HomeMapLayers />}>
      <HomePanelHeader />

      <div className="flex flex-col gap-4 px-8 pb-4">
        <FeedTrendingSection />
        <FeedNewInMapSection />
      </div>

      <MapDrawerExpanded>
        <SiteFooter />
      </MapDrawerExpanded>
    </MapDrawerLayout>
  );
}
