import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/blocks/app-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full relative flex flex-col min-h-screen overflow-hidden [transform:translateZ(0)]">
        {/* Botão flutuante para a sidebar */}
        <div className="absolute top-4 left-4 z-50">
          {/* <SidebarTrigger className="bg-black text-white rounded-md shadow-lg hover:bg-zinc-800" /> */}
        </div>

        {/* Conteúdo da página */}
        <div className="flex-1">{children}</div>
      </main>
    </SidebarProvider>
  );
}
