"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  ClipboardList,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Users,
  TestTube2,
  Calendar,
  Eye,
} from "lucide-react";

type GorunumModu = "kart" | "liste";
type Siralama = "tarih" | "ad" | "firma" | "durum";

const taramaDurumBilgileri: Record<string, { etiket: string; renk: string }> = {
  PLANLANDI: { etiket: "Planlandı", renk: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  DEVAM_EDIYOR: { etiket: "Devam Ediyor", renk: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  TAMAMLANDI: { etiket: "Tamamlandı", renk: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  IPTAL: { etiket: "İptal", renk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const durumIconlari: Record<string, typeof Clock> = {
  PLANLANDI: Calendar,
  DEVAM_EDIYOR: Loader2,
  TAMAMLANDI: CheckCircle2,
  IPTAL: XCircle,
};

export default function TaramalarPage() {
  const router = useRouter();
  const { taramalar, firmalar } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("liste");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [firmaFilter, setFirmaFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("tarih");

  const filteredTaramalar = useMemo(() => {
    let sonuc = taramalar.filter((t) => {
      const aramaUygun =
        t.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.atananPersonelAdi?.toLowerCase().includes(searchTerm.toLowerCase());
      const durumUygun = !durumFilter || t.durum === durumFilter;
      const firmaUygun = !firmaFilter || t.firmaId === firmaFilter;
      return aramaUygun && durumUygun && firmaUygun;
    });

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "ad":
          return a.ad.localeCompare(b.ad, "tr");
        case "firma":
          return (a.firmaAdi || "").localeCompare(b.firmaAdi || "", "tr");
        case "durum":
          return a.durum.localeCompare(b.durum);
        case "tarih":
        default:
          return new Date(a.planlananTarih).getTime() - new Date(b.planlananTarih).getTime();
      }
    });

    return sonuc;
  }, [taramalar, searchTerm, durumFilter, firmaFilter, siralama]);

  const istatistikler = useMemo(() => {
    const planlanan = taramalar.filter((t) => t.durum === "PLANLANDI").length;
    const devamEden = taramalar.filter((t) => t.durum === "DEVAM_EDIYOR").length;
    const tamamlanan = taramalar.filter((t) => t.durum === "TAMAMLANDI").length;
    const toplamPersonel = taramalar.reduce((sum, t) => sum + t.personelIds.length, 0);
    return { planlanan, devamEden, tamamlanan, toplamPersonel, toplam: taramalar.length };
  }, [taramalar]);

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const filtrelerAktif = durumFilter || firmaFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Taramalar</h2>
            <p className="text-muted-foreground">{taramalar.length} tarama</p>
          </div>
          <Button variant="gradient" onClick={() => router.push("/dashboard/taramalar/yeni")}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Tarama
          </Button>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Toplam Tarama</p>
                <p className="text-2xl font-bold">{istatistikler.toplam}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Planlanan</p>
                <p className="text-2xl font-bold text-amber-600">{istatistikler.planlanan}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Devam Eden</p>
                <p className="text-2xl font-bold text-purple-600">{istatistikler.devamEden}</p>
              </div>
              <div className="rounded-xl p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Loader2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Toplam Personel</p>
                <p className="text-2xl font-bold">{istatistikler.toplamPersonel}</p>
              </div>
              <div className="rounded-xl p-3 bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <Users className="h-5 w-5" />
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
                  placeholder="Tarama adı, firma veya atanan personel ile ara..."
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
                <option value="PLANLANDI">Planlandı</option>
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
                  <option value="ad">Ada Göre</option>
                  <option value="firma">Firmaya Göre</option>
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
              {filteredTaramalar.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tarama Listesi */}
      {filteredTaramalar.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <ClipboardList className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif ? "Arama kriterine uygun tarama bulunamadı." : "Tarama bulunamadı."}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/taramalar/yeni")}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Taramayı Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="space-y-3 stagger-children">
          {filteredTaramalar.map((tarama) => {
            const durum = taramaDurumBilgileri[tarama.durum] || taramaDurumBilgileri.PLANLANDI;
            const Icon = durumIconlari[tarama.durum] || Calendar;
            return (
              <Card key={tarama.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">{tarama.ad}</span>
                        <Badge className={durum.renk}>{durum.etiket}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <ClipboardList className="h-3.5 w-3.5" />
                          {tarama.firmaAdi}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {tarama.planlananTarih}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5" />
                          {tarama.personelIds.length} personel
                        </span>
                        <span className="flex items-center gap-1">
                          <TestTube2 className="h-3.5 w-3.5" />
                          {tarama.testIds.length} test
                        </span>
                      </div>
                      {tarama.atananPersonelAdi && (
                        <p className="text-xs text-muted-foreground">Atanan: {tarama.atananPersonelAdi}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-3.5 w-3.5" />
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
                  <th className="text-left p-4 font-medium">Tarama</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Firma</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Tarih</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Personel</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Test</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredTaramalar.map((tarama) => {
                  const durum = taramaDurumBilgileri[tarama.durum] || taramaDurumBilgileri.PLANLANDI;
                  return (
                    <tr key={tarama.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <ClipboardList className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium">{tarama.ad}</p>
                            {tarama.atananPersonelAdi && (
                              <p className="text-xs text-muted-foreground">{tarama.atananPersonelAdi}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{tarama.firmaAdi}</td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground">{tarama.planlananTarih}</td>
                      <td className="p-4 hidden lg:table-cell">{tarama.personelIds.length}</td>
                      <td className="p-4 hidden lg:table-cell">{tarama.testIds.length}</td>
                      <td className="p-4">
                        <Badge className={durum.renk}>{durum.etiket}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
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
