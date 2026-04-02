import { Skeleton } from "@/components/ui/skeleton";
import { FormSkeleton } from "@/components/skeletons";

export default function AyarlarLoading() {
  return (
    <div className="space-y-6 p-6 max-w-4xl">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[180px]" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-[100px] rounded-lg" />
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        <Skeleton className="h-6 w-[200px]" />
        <FormSkeleton fields={6} />
      </div>
    </div>
  );
}
