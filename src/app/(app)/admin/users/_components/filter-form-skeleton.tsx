import { Skeleton } from "@/components/ui/skeleton";

/** Stable keys for the placeholder fields. */
const FIELD_KEYS = ["userName", "email", "createdAt", "updatedAt"];

/**
 * `<Suspense>` fallback for the filter form. Mirrors its structure so the
 * sheet keeps its height once the real content arrives.
 */
export function UserFilterFormSkeleton() {
  return (
    <div className="w-full space-y-4 py-4">
      <Skeleton className="h-3 w-32" />

      {FIELD_KEYS.map((key) => (
        <div key={key} className="grid gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
    </div>
  );
}
