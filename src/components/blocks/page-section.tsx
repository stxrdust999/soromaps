import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PageSectionProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;

  className?: string;
}

/**
 * Standard listing page frame: header with title, description and primary
 * action, followed by the content. It wraps the content instead of being a
 * loose header so header-to-table spacing is decided in one place.
 *
 * @param props Title, description, primary action and page content.
 */
export function PageSection({
  title,
  description,
  actions,
  children,
  className,
}: PageSectionProps) {
  return (
    <section
      className={cn("flex flex-1 flex-col gap-10 py-10 px-8", className)}
    >
      <header className="flex flex-row items-end justify-between gap-4">
        <div className="space-y-0">
          <h1 className="text-2xl font-medium tracking-tight">{title}</h1>
          {description && (
            <p className="text-muted-foreground text-sm font-regular">
              {description}
            </p>
          )}
        </div>

        {actions && <div className="shrink-0">{actions}</div>}
      </header>

      {children}
    </section>
  );
}

export default PageSection;
