import type { ReactNode } from "react";

import { AppSidebar } from "@/components/blocks/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface AppLayoutProps {
  children: ReactNode;

  /**
   * `@modals` parallel slot, rendered alongside `children` rather than in
   * its place — keeps the listing mounted behind the modal, with table
   * state and scroll position intact.
   */
  modals: ReactNode;
}

export default function AppLayout({ children, modals }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="relative flex min-h-screen w-full flex-col overflow-hidden transform-[translateZ(0)]">
        <div className="flex flex-1 flex-col">{children}</div>
      </main>

      {modals}
    </SidebarProvider>
  );
}
