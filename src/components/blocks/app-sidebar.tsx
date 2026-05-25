import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
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
  const initials = name?.charAt(0).toUpperCase() ?? "U";

  const hoverStyles =
    "hover:bg-foreground hover:text-background transition-all duration-200";

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

          <SidebarContent>
            {/* Grupo: Navegação */}
            <SidebarGroup>
              <SidebarGroupLabel>Navegação</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/home">
                        <MapIcon />
                        <span>Mapa Interativo</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/places">
                        <Search />
                        <span>Explorar Lugares</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo: Gestão */}
            <SidebarGroup>
              <SidebarGroupLabel>Gestão</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/admin/businesses">
                        <Store />
                        <span>Gerenciar Comércios</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/admin/users">
                        <Users />
                        <span>Usuários</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/admin/reviews">
                        <MessageSquare />
                        <span>Avaliações</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* Grupo: Sistema */}
            <SidebarGroup>
              <SidebarGroupLabel>Sistema</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/profile">
                        <UserCircle />
                        <span>Meu Perfil</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={cn("rounded-sm", hoverStyles)}
                    >
                      <Link href="/login">
                        <LogOut />
                        <span>Sair</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </div>

        <SidebarFooter>
          <SidebarUserSection userName={name} initials={initials} />
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
