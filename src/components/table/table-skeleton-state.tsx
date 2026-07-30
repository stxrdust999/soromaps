import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface TableSkeletonStateProps {
  rows?: number;
  columns?: number;
}

/**
 * Builds stable keys for skeleton cells. The list is placeholder content and
 * never reorders, but an inline index `key` trips the linter.
 *
 * @param prefix Key prefix.
 * @param length How many keys to build.
 * @returns Keys shaped `prefix-index`.
 */
function skeletonKeys(prefix: string, length: number): string[] {
  return Array.from({ length }, (_, index) => `${prefix}-${index}`);
}

/**
 * `<Suspense>` fallback for the table. Generic on purpose: reproduces the
 * frame (toolbar, grid, footer) without knowing the screen's columns, so no
 * per-resource skeleton is needed.
 *
 * @param props How many placeholder rows and columns to render.
 */
export function TableSkeletonState({
  rows = 5,
  columns = 5,
}: TableSkeletonStateProps) {
  return (
    <section className="space-y-4">
      {/* toolbar - skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* conteúdo - skeleton */}
      <div className="rounded-md border bg-background">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {skeletonKeys("head", columns).map((key) => (
                <TableHead key={key}>
                  <Skeleton className="h-4 w-24" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {skeletonKeys("row", rows).map((rowKey) => (
              <TableRow key={rowKey} className="hover:bg-transparent">
                {skeletonKeys(`${rowKey}-cell`, columns).map((cellKey) => (
                  <TableCell key={cellKey}>
                    <Skeleton className="h-4 w-full max-w-40" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* rodapé - skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-9 w-64" />
      </div>
    </section>
  );
}
