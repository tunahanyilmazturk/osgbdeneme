"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRandevuStore, useFirmaStore } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import {
  Calendar,
  Plus,
  Search,
  Clock,
  User,
  Building2,
  TestTube2,
  ArrowRight,
  Edit,
  Trash2,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Eye,
} from "lucide-react";

type GorunumModu = "kart" | "liste";
type Siralama = "tarih" | "firma" | "test" | "durum";

const durumBilgileri: Record<string, { etiket: string; renk: string }> = {
  BEKLEMEDE: { etiket: "Beklemede", renk: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  ONAYLANDI: { etiket: "Onaylandı", renk: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  DEVAM_EDIYOR: { etiket: "Devam Ediyor", renk: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  TAMAMLANDI: { etiket: "Tamamlandı", renk: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  IPTAL: { etiket: "İptal", renk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const durumIconlari: Record<string, typeof CheckCircle2> = {
  BEKLEMEDE: Clock,
  ONAYLANDI: CheckCircle2,
  DEVAM_EDIYOR: Loader2,
  TAMAMLANDI: CheckCircle2,
  IPTAL: AlertCircle,
};

export default function RandevularPage() {
  const router = useRouter();
  const { randevular, randevuSil } = useRandevuStore();
  const { firmalar } = useFirmaStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("liste");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [firmaFilter, setFirmaFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("tarih");

  const filteredRandevular = useMemo(() => {
    let sonuc = randevular.filter((r) => {
      const aramaUygun =
        r.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.testAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.personelAdi?.toLowerCase().includes(searchTerm.toLowerCase());
      const durumUygun = !durumFilter || r.durum === durumFilter;
      const firmaUygun = !firmaFilter || r.firmaId === firmaFilter;
      return aramaUygun && durumUygun && firmaUygun;
    });

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "firma":
          return (a.firmaAdi || "").localeCompare(b.firmaAdi || "", "tr");
        case "test":
          return (a.testAdi || "").localeCompare(b.testAdi || "", "tr");
        case "durum":
          return a.durum.localeCompare(b.durum);
        case "tarih":
        default:
          return new Date(a.tarih).getTime() - new Date(b.tarih).getTime();
      }
    });

    return sonuc;
  }, [randevular, searchTerm, durumFilter, firmaFilter, siralama]);

  const istatistikler = useMemo(() => {
    const bugun = new Date().toISOString().split("T")[0];
    const bekleyen = randevular.filter((r) => r.durum === "BEKLEMEDE").length;
    const bugunku = randevular.filter((r) => r.tarih === bugun).length;
    const tamamlanan = randevular.filter((r) => r.durum === "TAMAMLANDI").length;
    const onaylanan = randevular.filter((r) => r.durum === "ONAYLANDI").length;
    return { bekleyen, bugunku, tamamlanan, onaylanan, toplam: randevular.length };
  }, [randevular]);

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const filtrelerAktif = durumFilter || firmaFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Taramalar</h2>
            <p className="text-muted-foreground">{randevular.length} tarama</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="gradient" onClick={() => router.push("/dashboard/randevular/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Tarama
            </Button>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bugünkü Tarama</p>
                <p className="text-2xl font-bold">{istatistikler.bugunku}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Bekleyen</p>
                <p className="text-2xl font-bold text-amber-600">{istatistikler.bekleyen}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Clock className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Onaylanan</p>
                <p className="text-2xl font-bold text-blue-600">{istatistikler.onaylanan}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tamamlanan</p>
                <p className="text-2xl font-bold text-green-600">{istatistikler.tamamlanan}</p>
              </div>
              <div className="rounded-xl p-3 bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Arama ve Filtreler */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Firma, test veya personel ile ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    onClick={() => setGorunum("kart")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${gorunum === "kart" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  >
                    Kart
                  </button>
                  <button
                    onClick={() => setGorunum("liste")}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${gorunum === "liste" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  >
                    Liste
                  </button>
                </div>
              </div>
            </div>

            {/* Filtreler */}
            <div className="flex flex-wrap items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={durumFilter}
                onChange={(e) => setDurumFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Durumlar</option>
                <option value="BEKLEMEDE">Beklemede</option>
                <option value="ONAYLANDI">Onaylandı</option>
                <option value="DEVAM_EDIYOR">Devam Ediyor</option>
                <option value="TAMAMLANDI">Tamamlandı</option>
                <option value="IPTAL">İptal</option>
              </select>
              <select
                value={firmaFilter}
                onChange={(e) => setFirmaFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Firmalar</option>
                {aktifFirmalar.map((f) => (
                  <option key={f.id} value={f.id}>{f.ad}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-auto">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={siralama}
                  onChange={(e) => setSiralama(e.target.value as Siralama)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="tarih">Tarihe Göre</option>
                  <option value="firma">Firmaya Göre</option>
                  <option value="test">Teste Göre</option>
                  <option value="durum">Duruma Göre</option>
                </select>
              </div>
              {filtrelerAktif && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDurumFilter("");
                    setFirmaFilter("");
                  }}
                  className="text-xs"
                >
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              {filteredRandevular.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Randevu Listesi */}
      {filteredRandevular.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif ? "Arama kriterine uygun tarama bulunamadı." : "Tarama bulunamadı"}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/randevular/yeni")}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Taramayı Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="space-y-3 stagger-children">
          {filteredRandevular.map((randevu) => {
            const durum = durumBilgileri[randevu.durum] || durumBilgileri.BEKLEMEDE;
            const Icon = durumIconlari[randevu.durum] || Clock;
            return (
              <Card key={randevu.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <span className="text-xs font-medium">
                        {new Date(randevu.tarih).toLocaleDateString("tr-TR", { month: "short" })}
                      </span>
                      <span className="text-lg font-bold leading-tight">
                        {new Date(randevu.tarih).toLocaleDateString("tr-TR", { day: "numeric" })}
                      </span>
                    </div>

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
                          {randevu.personelAdi || "-"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {randevu.baslangicSaati}
                          {randevu.bitisSaati && ` - ${randevu.bitisSaati}`}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => router.push(`/dashboard/randevular/${randevu.id}`)}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => router.push(`/dashboard/randevular/${randevu.id}`)}
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (confirm("Bu taramayı silmek istediğinize emin misiniz?")) {
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
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Tarih</th>
                  <th className="text-left p-4 font-medium">Test</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Firma</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Personel</th>
                  <th className="text-left p-4 font-medium">Saat</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredRandevular.map((randevu) => {
                  const durum = durumBilgileri[randevu.durum] || durumBilgileri.BEKLEMEDE;
                  return (
                    <tr key={randevu.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <span className="text-[10px] font-medium">
                            {new Date(randevu.tarih).toLocaleDateString("tr-TR", { month: "short" })}
                          </span>
                          <span className="text-sm font-bold leading-tight">
                            {new Date(randevu.tarih).toLocaleDateString("tr-TR", { day: "numeric" })}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{randevu.testAdi}</td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{randevu.firmaAdi}</td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground">{randevu.personelAdi || "-"}</td>
                      <td className="p-4 text-muted-foreground">{randevu.baslangicSaati}</td>
                      <td className="p-4">
                        <Badge className={durum.renk} variant="outline">
                          {durum.etiket}
                        </Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => router.push(`/dashboard/randevular/${randevu.id}`)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => router.push(`/dashboard/randevular/${randevu.id}`)}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => {
                              if (confirm("Bu taramayı silmek istediğinize emin misiniz?")) {
                                randevuSil(randevu.id);
                              }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5 text-destructive" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
