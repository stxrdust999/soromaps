import { Skeleton } from "@/components/ui/skeleton";

/** Stable keys for the placeholder fields. */
const FIELD_KEYS = ["userName", "email", "password"];

/**
 * `<Suspense>` fallback for the modal form. Mirrors the three fields and
 * the button row so the modal keeps its height once the real form arrives.
 */
export function UserFormSkeleton() {
  return (
    <div className="space-y-4">
      {FIELD_KEYS.map((key) => (
        <div key={key} className="grid gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}

      <div className="flex flex-row justify-end gap-3 pt-2">
        <Skeleton className="h-9 w-24" />
        <Skeleton className="h-9 w-24" />
      </div>
    </div>
  );
}
