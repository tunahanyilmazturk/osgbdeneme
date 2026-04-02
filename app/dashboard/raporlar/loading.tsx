import { Skeleton } from "@/components/ui/skeleton";
import { CardSkeleton, TableSkeleton } from "@/components/skeletons";

export default function RaporlarLoading() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-[160px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      {/* Stats Cards */}
      <CardSkeleton count={4} columns={4} />

      {/* Report Filters */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-xl border bg-card">
        <Skeleton className="h-10 w-full sm:w-[200px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[150px]" />
        <Skeleton className="h-10 w-[120px] ml-auto" />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
        <div className="rounded-xl border bg-card p-6 space-y-4">
          <Skeleton className="h-6 w-[200px]" />
          <Skeleton className="h-[250px] w-full rounded-lg" />
        </div>
      </div>

      {/* Data Table */}
      <TableSkeleton rows={8} columns={5} />
    </div>
  );
}
