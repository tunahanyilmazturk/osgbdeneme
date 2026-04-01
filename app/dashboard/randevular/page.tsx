"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, Search, Clock, User, Building2, TestTube2, ArrowRight, Edit, Trash2 } from "lucide-react";

const durumBilgileri: Record<string, { etiket: string; renk: string; icon: string }> = {
  BEKLEMEDE: { etiket: "Beklemede", renk: "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400", icon: "bg-yellow-50 dark:bg-yellow-950/50" },
  ONAYLANDI: { etiket: "Onaylandı", renk: "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400", icon: "bg-blue-50 dark:bg-blue-950/50" },
  DEVAM_EDIYOR: { etiket: "Devam Ediyor", renk: "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400", icon: "bg-purple-50 dark:bg-purple-950/50" },
  TAMAMLANDI: { etiket: "Tamamlandı", renk: "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400", icon: "bg-green-50 dark:bg-green-950/50" },
  IPTAL: { etiket: "İptal", renk: "border-red-200 text-red-700 dark:border-red-800 dark:text-red-400", icon: "bg-red-50 dark:bg-red-950/50" },
};

export default function RandevularPage() {
  const router = useRouter();
  const { randevular, randevuSil } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtreDurum, setFiltreDurum] = useState<string>("TUMU");

  const filteredRandevular = randevular.filter((r) => {
    const aramaUygun =
      r.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.testAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.personelAdi?.toLowerCase().includes(searchTerm.toLowerCase());
    const durumUygun = filtreDurum === "TUMU" || r.durum === filtreDurum;
    return aramaUygun && durumUygun;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Randevular</h2>
            <p className="text-muted-foreground">{randevular.length} randevu</p>
          </div>
          <Button variant="gradient" onClick={() => router.push("/dashboard/randevular/yeni")}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Randevu
          </Button>
        </div>
      </div>

      {/* Arama & Filtre */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Firma, test veya personel ile ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {["TUMU", "BEKLEMEDE", "ONAYLANDI", "DEVAM_EDIYOR", "TAMAMLANDI"].map((d) => (
            <button
              key={d}
              onClick={() => setFiltreDurum(d)}
              className={`shrink-0 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                filtreDurum === d
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted text-muted-foreground hover:bg-accent"
              }`}
            >
              {d === "TUMU" ? "Tümü" : durumBilgileri[d]?.etiket || d}
            </button>
          ))}
        </div>
      </div>

      {/* Randevu Listesi */}
      <div className="space-y-3 stagger-children">
        {filteredRandevular.length === 0 ? (
          <Card>
            <CardContent className="empty-state">
              <div className="empty-state-icon animate-float">
                <Calendar className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">Randevu bulunamadı</p>
              {!searchTerm && filtreDurum === "TUMU" && (
                <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/randevular/yeni")}>
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Randevuyu Oluştur
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredRandevular.map((randevu) => {
            const durum = durumBilgileri[randevu.durum] || durumBilgileri.BEKLEMEDE;
            return (
              <Card key={randevu.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    {/* Sol - Tarih */}
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-xs font-medium">
                        {new Date(randevu.tarih).toLocaleDateString("tr-TR", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold leading-tight">
                        {new Date(randevu.tarih).toLocaleDateString("tr-TR", { day: "numeric" })}
                      </span>
                    </div>

                    {/* Orta - Bilgiler */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{randevu.testAdi}</span>
                        <Badge variant="outline" className={durum.renk}>
                          {durum.etiket}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" />
                          {randevu.firmaAdi}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {randevu.personelAdi}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {new Date(randevu.tarih).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    </div>

                    {/* Sağ - İşlemler */}
                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (confirm("Bu randevuyu silmek istediğinize emin misiniz?")) {
                            randevuSil(randevu.id);
                          }
                        }}
                      >
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
