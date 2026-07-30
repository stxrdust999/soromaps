import FeedNewInMapSection from "../../(explorer)/home/_components/feed/feed-new-in-map-section";
import FeedTrendingSection from "../../(explorer)/home/_components/feed/feed-trending-section";

export default function Page() {
  return (
    <div className="p-8">
      <span className="text-2xl font-bold tracking-tight">Avaliações</span>

      <FeedTrendingSection />

      <FeedNewInMapSection />
    </div>
  );
}
