import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  /** Ausente = migalha não navegável (seção agrupadora ou página atual). */
  href?: string;
}

interface PageBreadcrumbProps {
  items: Crumb[];
}

/**
 * Barra de trilha no topo da página. A última migalha é sempre a página
 * atual, independente de ter `href`.
 *
 * @param props Migalhas em ordem, da raiz até a página atual.
 */
export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <div className="flex h-14 shrink-0 items-center border-b px-8">
      <Breadcrumb>
        <BreadcrumbList>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <Fragment key={item.label}>
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  ) : item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </BreadcrumbItem>

                {!isLast && <BreadcrumbSeparator />}
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
