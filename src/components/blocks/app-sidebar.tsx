import { MapIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { SIDEBAR_NAV } from "@/constants/navigation";
import { getSession } from "@/lib/session";
import { cn } from "@/lib/utils";
import { SidebarUserSection } from "./sidebar-user-section";

export async function AppSidebar() {
  const session = await getSession();

  const name = session?.userName;
  const email = session?.userEmail;
  const initials = name?.charAt(0).toUpperCase() ?? "U";

  return (
    <Sidebar className="overflow-hidden">
      <SidebarHeader className="shrink-0 px-5 py-4">
        <div className="flex flex-row gap-3 items-center">
          <div className="bg-black p-1.5 rounded-lg shadow-sm">
            <MapIcon color="#fff" size={20} />
          </div>

          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-tight">Soromaps</span>
            <span className="font-medium text-muted-foreground text-[10px] uppercase tracking-wider">
              Guia de Sorocaba
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-0 w-full shrink-0 bg-black/30" />

      <SidebarContent className="gap-0">
        {SIDEBAR_NAV.map((group) => (
          <SidebarGroup key={group.label} className="flex flex-col gap-0">
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent className="flex flex-col gap-0">
              {group.items.map(({ label, url, icon: Icon }) => (
                <RouteButton
                  key={url}
                  url={url}
                  name={label}
                  icon={<Icon size={16} />}
                />
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarSeparator className="mx-0 w-full shrink-0 bg-black/30" />

      <SidebarFooter className="shrink-0">
        <SidebarUserSection userName={name} email={email} initials={initials} />
      </SidebarFooter>
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
