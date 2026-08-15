import type { ReactNode } from "react";

import { PageBreadcrumb } from "@/components/blocks/page-breadcrumb";
import { PageSection } from "@/components/blocks/page-section";
import { SiteFooter } from "@/components/blocks/site-footer";
import { metricCardsMock } from "@/mocks/admin-dashboard";

import { AttentionQueues } from "./_components/attention-queues";
import { DataQualityChart } from "./_components/data-quality-chart";
import { MetricCard } from "./_components/metric-card";
import { NewPlacesCard } from "./_components/new-places-card";
import { PlaceSegmentationCard } from "./_components/place-segmentation-card";
import { SignupsChart } from "./_components/signups-chart";

interface DashboardBlockProps {
  title: string;
  children: ReactNode;
}

function DashboardBlock({ title, children }: DashboardBlockProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-2xl font-medium tracking-tight">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Hub do admin, não BI: as filas vêm primeiro porque são o que exige ação, e
 * os números só depois. Tudo sobre `src/mocks/admin-dashboard.ts` até existir
 * `GET /api/admin/stats` — ver `docs/todo/admin/dashboard.md`.
 */
export default function AdminDashboardPage() {
  return (
    <main className="flex flex-1 flex-col">
      <PageBreadcrumb items={[{ label: "Admin" }, { label: "Dashboard" }]} />

      <PageSection
        title="Dashboard"
        description="Visão geral da gestão da plataforma"
      >
        <div className="flex flex-col gap-10">
          <DashboardBlock title="Necessita de atenção">
            <AttentionQueues />
          </DashboardBlock>

          <DashboardBlock title="Números">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <PlaceSegmentationCard />
              <NewPlacesCard />

              {metricCardsMock.map((metric) => (
                <MetricCard key={metric.label} metric={metric} />
              ))}
            </div>
          </DashboardBlock>

          <DashboardBlock title="Gráfico">
            <SignupsChart />
          </DashboardBlock>

          <DashboardBlock title="Qualidade de dados">
            <DataQualityChart />
          </DashboardBlock>
        </div>
      </PageSection>

      <SiteFooter />
    </main>
  );
}
