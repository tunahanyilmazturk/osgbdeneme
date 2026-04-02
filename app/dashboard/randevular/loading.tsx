import { Skeleton } from "@/components/ui/skeleton";
import { TableSkeleton, CardSkeleton } from "@/components/skeletons";

export default function RandevularLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[180px]" />
          <Skeleton className="h-4 w-[260px]" />
        </div>
        <Skeleton className="h-10 w-[160px] rounded-lg" />
      </div>

      {/* Stats Cards */}
      <CardSkeleton count={4} columns={4} />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card">
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-[130px]" />
        <Skeleton className="h-10 w-[150px]" />
      </div>

      {/* Table */}
      <TableSkeleton rows={7} columns={6} />
    </div>
  );
}
