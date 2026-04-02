import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="h-24 w-24 rounded-full bg-muted flex items-center justify-center">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold tracking-tight text-muted-foreground">
            404
          </h1>
          <h2 className="text-2xl font-semibold tracking-tight">
            Sayfa Bulunamadı
          </h2>
          <p className="text-muted-foreground">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="flex gap-3 justify-center">
          <Link href="/dashboard">
            <Button variant="default" className="gap-2">
              <Home className="h-4 w-4" />
              Dashboard&apos;a Dön
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
