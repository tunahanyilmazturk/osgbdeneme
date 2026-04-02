"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error("Dashboard Error:", error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight">
            Bir Hata Oluştu
          </h2>
          <p className="text-muted-foreground">
            Sayfa yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
          </p>
        </div>

        {error.message && (
          <div className="rounded-lg bg-red-50 dark:bg-red-950/50 p-4 text-left">
            <p className="text-sm text-red-800 dark:text-red-200 font-medium">
              Hata Detayı:
            </p>
            <p className="text-xs text-red-600 dark:text-red-400 mt-1 font-mono">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={reset} variant="default" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </Button>
          <Button 
            onClick={() => window.location.href = "/dashboard"} 
            variant="outline"
          >
            Dashboard&apos;a Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
