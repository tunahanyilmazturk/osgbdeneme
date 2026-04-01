"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Search,
  Building2,
  Edit,
  Trash2,
  Eye,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  XCircle,
  Send,
  FileSpreadsheet,
  TrendingUp,
} from "lucide-react";

type GorunumModu = "kart" | "liste";
type Siralama = "tarih" | "firma" | "tutar" | "durum";

const durumBilgileri: Record<string, { etiket: string; renk: string }> = {
  TASLAK: { etiket: "Taslak", renk: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
  GÖNDERİLDİ: { etiket: "Gönderildi", renk: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  KABUL_EDİLDİ: { etiket: "Kabul Edildi", renk: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  REDDEDİLDİ: { etiket: "Reddedildi", renk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
};

const durumIconlari: Record<string, typeof FileText> = {
  TASLAK: FileText,
  GÖNDERİLDİ: Send,
  KABUL_EDİLDİ: CheckCircle2,
  REDDEDİLDİ: XCircle,
};

export default function TekliflerPage() {
  const router = useRouter();
  const { teklifler, teklifSil, firmalar } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("kart");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [firmaFilter, setFirmaFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("tarih");

  const filteredTeklifler = useMemo(() => {
    let sonuc = teklifler.filter((t) => {
      const aramaUygun =
        t.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(t.id).includes(searchTerm);
      const durumUygun = !durumFilter || t.durum === durumFilter;
      const firmaUygun = !firmaFilter || t.firmaId === firmaFilter;
      return aramaUygun && durumUygun && firmaUygun;
    });

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "firma":
          return (a.firmaAdi || "").localeCompare(b.firmaAdi || "", "tr");
        case "tutar":
          return b.genelToplam - a.genelToplam;
        case "durum":
          return a.durum.localeCompare(b.durum);
        case "tarih":
        default:
          return new Date(b.olusturmaTarihi).getTime() - new Date(a.olusturmaTarihi).getTime();
      }
    });

    return sonuc;
  }, [teklifler, searchTerm, durumFilter, firmaFilter, siralama]);

  const istatistikler = useMemo(() => {
    const toplam = teklifler.reduce((s, t) => s + t.genelToplam, 0);
    const kabulEdilen = teklifler.filter((t) => t.durum === "KABUL_EDİLDİ");
    const kabulToplam = kabulEdilen.reduce((s, t) => s + t.genelToplam, 0);
    const bekleyen = teklifler.filter((t) => t.durum === "TASLAK" || t.durum === "GÖNDERİLDİ").length;
    return { toplam, kabulToplam, bekleyen, kabulSayi: kabulEdilen.length, toplamSayi: teklifler.length };
  }, [teklifler]);

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const filtrelerAktif = durumFilter || firmaFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Teklifler</h2>
            <p className="text-muted-foreground">{teklifler.length} teklif</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="gradient" onClick={() => router.push("/dashboard/teklifler/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Teklif
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
                <p className="text-xs text-muted-foreground">Toplam Teklif</p>
                <p className="text-2xl font-bold">{istatistikler.toplamSayi}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kabul Edilen</p>
                <p className="text-2xl font-bold text-green-600">{formatPara(istatistikler.kabulToplam)}</p>
              </div>
              <div className="rounded-xl p-3 bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <CheckCircle2 className="h-5 w-5" />
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
                <p className="text-xs text-muted-foreground">Kabul Oranı</p>
                <p className="text-2xl font-bold">
                  {istatistikler.toplamSayi > 0 ? Math.round((istatistikler.kabulSayi / istatistikler.toplamSayi) * 100) : 0}%
                </p>
              </div>
              <div className="rounded-xl p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <TrendingUp className="h-5 w-5" />
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
                  placeholder="Firma veya teklif no ile ara..."
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
                <option value="TASLAK">Taslak</option>
                <option value="GÖNDERİLDİ">Gönderildi</option>
                <option value="KABUL_EDİLDİ">Kabul Edildi</option>
                <option value="REDDEDİLDİ">Reddedildi</option>
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
                  <option value="tarih">En Yeni</option>
                  <option value="firma">Firmaya Göre</option>
                  <option value="tutar">Tutara Göre</option>
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
              {filteredTeklifler.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Teklif Listesi */}
      {filteredTeklifler.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif ? "Arama kriterine uygun teklif bulunamadı." : "Teklif bulunamadı"}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/teklifler/yeni")}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Teklifi Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="space-y-3 stagger-children">
          {filteredTeklifler.map((teklif) => {
            const durum = durumBilgileri[teklif.durum] || durumBilgileri.TASLAK;
            const Icon = durumIconlari[teklif.durum] || FileText;
            return (
              <Card key={teklif.id} className="card-hover group">
                <CardContent className="p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold">Teklif #{teklif.id}</span>
                        <Badge className={durum.renk}>{durum.etiket}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5" /> {teklif.firmaAdi}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="h-3.5 w-3.5" /> {teklif.kalemler?.length || 0} kalem
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-lg font-bold">{formatPara(teklif.genelToplam)}</p>
                      <p className="text-xs text-muted-foreground">{teklif.gecerlilikTarihi}</p>
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
          })}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Teklif</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Firma</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Kalem</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Geçerlilik</th>
                  <th className="text-left p-4 font-medium">Tutar</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeklifler.map((teklif) => {
                  const durum = durumBilgileri[teklif.durum] || durumBilgileri.TASLAK;
                  return (
                    <tr key={teklif.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                            <FileText className="h-4 w-4" />
                          </div>
                          <p className="font-medium">#{teklif.id}</p>
                        </div>
                      </td>
                      <td className="p-4 hidden md:table-cell text-muted-foreground">{teklif.firmaAdi}</td>
                      <td className="p-4 hidden lg:table-cell">{teklif.kalemler?.length || 0}</td>
                      <td className="p-4 hidden lg:table-cell text-muted-foreground">{teklif.gecerlilikTarihi}</td>
                      <td className="p-4 font-bold">{formatPara(teklif.genelToplam)}</td>
                      <td className="p-4">
                        <Badge className={durum.renk}>{durum.etiket}</Badge>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/teklifler/${teklif.id}`)}>
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => { if (confirm("Bu teklifi silmek istediğinize emin misiniz?")) teklifSil(teklif.id); }}>
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
