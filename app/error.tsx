"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application Error:", error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="flex justify-center">
              <div className="h-24 w-24 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">
                Uygulama Hatası
              </h1>
              <p className="text-muted-foreground">
                Uygulama yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.
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
                onClick={() => window.location.reload()} 
                variant="outline"
              >
                Sayfayı Yenile
              </Button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
