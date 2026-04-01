"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Search, Building2, Edit, Trash2, Eye } from "lucide-react";

const durumBilgileri: Record<string, { etiket: string; renk: string }> = {
  TASLAK: { etiket: "Taslak", renk: "border-gray-200 text-gray-600 dark:border-gray-700 dark:text-gray-400" },
  GONDERILDI: { etiket: "Gönderildi", renk: "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400" },
  KABUL_EDİLDİ: { etiket: "Kabul Edildi", renk: "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400" },
  REDDEDİLDİ: { etiket: "Reddedildi", renk: "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400" },
};

export default function TekliflerPage() {
  const router = useRouter();
  const { teklifler, teklifSil } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTeklifler = teklifler.filter(
    (t) =>
      t.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(t.id).includes(searchTerm)
  );

  const toplam = teklifler.reduce((s, t) => s + t.genelToplam, 0);
  const kabulEdilen = teklifler.filter((t) => t.durum === "KABUL_EDİLDİ").reduce((s, t) => s + t.genelToplam, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Teklifler</h2>
            <p className="text-muted-foreground">{teklifler.length} teklif</p>
          </div>
          <Button variant="gradient" onClick={() => router.push("/dashboard/teklifler/yeni")}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Teklif
          </Button>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid gap-4 sm:grid-cols-3 stagger-children">
        <Card className="stat-card stat-card-blue">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Toplam Teklif</p>
                <p className="text-2xl font-bold">{formatPara(toplam)}</p>
              </div>
              <div className="rounded-xl p-3 gradient-primary text-white">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card stat-card-green">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kabul Edilen</p>
                <p className="text-2xl font-bold">{formatPara(kabulEdilen)}</p>
              </div>
              <div className="rounded-xl p-3 gradient-success text-white">
                <span className="text-lg">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="stat-card stat-card-orange">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold">{teklifler.filter((t) => t.durum === "TASLAK").length}</p>
              </div>
              <div className="rounded-xl p-3 gradient-warning text-white">
                <span className="text-lg">⏱</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Firma veya teklif no ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teklif Listesi */}
      <div className="space-y-3 stagger-children">
        {filteredTeklifler.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              <div className="empty-state-icon animate-float">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">Teklif bulunamadı</p>
              {!searchTerm && (
                <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/teklifler/yeni")}>
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Teklifi Oluştur
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredTeklifler.map((teklif) => {
            const durum = durumBilgileri[teklif.durum] || durumBilgileri.TASLAK;
            return (
              <Card key={teklif.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <span className="text-lg font-bold">#{teklif.id}</span>
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">Teklif #{teklif.id}</span>
                        <Badge variant="outline" className={durum.renk}>{durum.etiket}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {teklif.firmaAdi}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold">{formatPara(teklif.genelToplam)}</p>
                      <p className="text-xs text-muted-foreground">{teklif.kalemler?.length || 0} kalem</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0 sm:ml-2">
                      <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/teklifler/${teklif.id}`)}>
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (confirm("Bu teklifi silmek istediğinize emin misiniz?")) teklifSil(teklif.id); }}>
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
