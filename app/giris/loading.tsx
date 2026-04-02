import { Skeleton } from "@/components/ui/skeleton";

export default function GirisLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Info */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-16 w-16 rounded-xl" />
            <Skeleton className="h-10 w-[300px]" />
            <Skeleton className="h-4 w-[400px]" />
          </div>
          
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="bg-white dark:bg-card rounded-2xl shadow-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <Skeleton className="h-12 w-12 rounded-xl mx-auto" />
            <Skeleton className="h-8 w-[200px] mx-auto" />
            <Skeleton className="h-4 w-[250px] mx-auto" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <Skeleton className="h-12 w-full rounded-xl mt-6" />
          </div>

          <Skeleton className="h-4 w-[200px] mx-auto" />
        </div>
      </div>
    </div>
  );
}
