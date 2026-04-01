"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import { TestTube2, Clock, Plus, Search, Edit, Trash2, DollarSign, ArrowRight, Activity } from "lucide-react";

const kategoriRenkleri: Record<string, string> = {
  "Kan Testi": "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
  "Görüntüleme": "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400",
  "Fonksiyonel": "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400",
  "İşitme Testi": "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400",
  "Göz Testi": "bg-cyan-50 text-cyan-700 dark:bg-cyan-950/50 dark:text-cyan-400",
  "Solunum": "bg-teal-50 text-teal-700 dark:bg-teal-950/50 dark:text-teal-400",
};

export default function SaglikTestleriPage() {
  const router = useRouter();
  const { saglikTestleri, testSil } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTestler = saglikTestleri.filter(
    (test) =>
      test.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.kategoriAdi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sağlık Testleri</h2>
            <p className="text-muted-foreground">{saglikTestleri.length} test tanımlı</p>
          </div>
          <Button variant="gradient" onClick={() => router.push("/dashboard/saglik-testleri/yeni")}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Test
          </Button>
        </div>
      </div>

      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Test adı veya kategori ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Test Kartları */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
        {filteredTestler.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="empty-state">
              <div className="empty-state-icon animate-float">
                <TestTube2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">Test bulunamadı</p>
              {!searchTerm && (
                <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/saglik-testleri/yeni")}>
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Testi Ekle
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTestler.map((test) => (
            <Card key={test.id} className="card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-500/5 -translate-y-1/2 translate-x-1/2" />
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400">
                    <TestTube2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-1">{test.ad}</CardTitle>
                    <Badge
                      variant="outline"
                      className={`mt-1 text-[10px] ${test.kategoriAdi ? kategoriRenkleri[test.kategoriAdi] || "bg-muted" : "bg-muted"}`}
                    >
                      {test.kategoriAdi}
                    </Badge>
                  </div>
                  <Badge className={DURUM_RENKLERI[test.durum]}>
                    {DURUM_ETIKETLERI[test.durum]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground line-clamp-2">{test.aciklama}</p>
                
                <div className="grid grid-cols-2 gap-3 rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <span className="font-semibold">{formatPara(test.birimFiyat)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{test.sure} dk</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button variant="outline" size="sm" className="flex-1 group-hover:border-primary/30">
                    <Edit className="mr-1 h-3 w-3" />
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`"${test.ad}" testini silmek istediğinize emin misiniz?`)) {
                        testSil(test.id);
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
