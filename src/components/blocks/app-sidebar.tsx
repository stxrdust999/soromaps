import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  MapIcon,
  Search,
  Store,
  Users,
  MessageSquare,
  UserCircle,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { SidebarUserSection } from "./sidebar-user-section";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export async function AppSidebar() {
  const session = await getSession();

  const name = session?.userName;
  const email = session?.userEmail;
  const initials = name?.charAt(0).toUpperCase() ?? "U";

  return (
    <Sidebar className="overflow-hidden">
      <div className="flex flex-col h-full justify-between">
        <div>
          <SidebarHeader className="px-5 py-4">
            <div className="flex flex-row gap-3 items-center">
              <div className="bg-black p-1.5 rounded-lg shadow-sm">
                <MapIcon color="#fff" size={20} />
              </div>

              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-tight">
                  Soromaps
                </span>
                <span className="font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
                  Guia de Sorocaba
                </span>
              </div>
            </div>
          </SidebarHeader>

          <SidebarSeparator className="mx-0 w-full bg-black/30" />

          <SidebarContent className="flex flex-col gap-0">
            {/* Grupo: Navegação */}
            <SidebarGroup className="flex flex-col gap-0">
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-0">
                <RouteButton
                  url="/home"
                  name="Mapa Interativo"
                  icon={<MapIcon size={16} />}
                />
                <RouteButton
                  url="/places"
                  name="Explorar Lugares"
                  icon={<Search size={16} />}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo: Gestão */}
            <SidebarGroup className="flex flex-col gap-0">
              <SidebarGroupLabel>Gestão</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-0">
                <RouteButton
                  url="/admin/businesses"
                  name="Gerenciar Comércios"
                  icon={<Store size={16} />}
                />
                <RouteButton
                  url="/admin/users"
                  name="Usuários"
                  icon={<Users size={16} />}
                />
                <RouteButton
                  url="/admin/reviews"
                  name="Avaliações"
                  icon={<MessageSquare size={16} />}
                />
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo: Sistema */}
            <SidebarGroup className="flex flex-col gap-0">
              <SidebarGroupLabel>Sistema</SidebarGroupLabel>
              <SidebarGroupContent className="flex flex-col gap-0">
                <RouteButton
                  url="/profile"
                  name="Meu Perfil"
                  icon={<UserCircle size={16} />}
                />
                <RouteButton
                  url="/login"
                  name="Sair"
                  icon={<LogOut size={16} />}
                />
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </div>

        <SidebarFooter>
          <SidebarUserSection
            userName={name}
            email={email}
            initials={initials}
          />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}

interface RouteButtonProps {
  name: string;
  url: string;
  icon?: React.ReactNode;
}

function RouteButton({ name, url, icon }: RouteButtonProps) {
  const hoverStyles =
    "hover:bg-foreground hover:text-background transition-all duration-200";

  return (
    <Link href={url} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-2 text-sm h-9 px-2 rounded-sm",
          hoverStyles,
        )}
      >
        {icon}
        <span className="font-medium">{name}</span>
      </Button>
    </Link>
  );
}
