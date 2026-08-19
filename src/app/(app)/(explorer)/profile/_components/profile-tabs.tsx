"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PROFILE_TABS } from "@/constants/navigation";

/**
 * Navegação entre as abas do perfil.
 *
 * Aba é segmento de rota, não estado: a URL é compartilhável, o F5 cai na aba
 * certa e o botão voltar percorre o que foi visitado. Por isso cada gatilho é
 * um `Link` e o `value` do `Tabs` vem do pathname — o Radix só desenha, quem
 * troca de aba é o roteador.
 *
 * Este é o único pedaço client do perfil, e só por causa do `usePathname`.
 */
export function ProfileTabs() {
  const pathname = usePathname();

  // A raiz casaria com todas as abas por prefixo, então é o fallback, não uma
  // opção do `find`.
  const active =
    PROFILE_TABS.find(
      (tab) => tab.url !== "/profile" && pathname.startsWith(tab.url),
    )?.url ?? "/profile";

  return (
    <Tabs value={active} className="max-w-full overflow-x-auto pb-1.5">
      <TabsList variant="line">
        {PROFILE_TABS.map(({ label, url, icon: Icon }) => (
          <TabsTrigger key={url} value={url} asChild>
            <Link href={url}>
              <Icon size={16} />
              {label}
            </Link>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
