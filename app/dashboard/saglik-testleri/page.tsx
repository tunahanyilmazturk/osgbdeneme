"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import {
  TestTube2,
  Plus,
  Search,
  Trash2,
  DollarSign,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  Clock,
  Activity,
  FileSpreadsheet,
  Upload,
} from "lucide-react";
import TestImportModal from "@/components/test-import-modal";

type GorunumModu = "kart" | "liste";
type Siralama = "ad" | "kategori" | "fiyat" | "durum";

export default function SaglikTestleriPage() {
  const router = useRouter();
  const { saglikTestleri, testSil, testKategorileri, testEkle, testGuncelle } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("liste");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [kategoriFilter, setKategoriFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("ad");
  const [importModalOpen, setImportModalOpen] = useState(false);

  const filteredTestler = useMemo(() => {
    let sonuc = saglikTestleri.filter(
      (test) =>
        test.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.kategoriAdi?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (durumFilter) {
      sonuc = sonuc.filter((t) => t.durum === durumFilter);
    }

    if (kategoriFilter) {
      sonuc = sonuc.filter((t) => t.kategoriId === kategoriFilter);
    }

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "kategori":
          return (a.kategoriAdi || "").localeCompare(b.kategoriAdi || "", "tr");
        case "fiyat":
          return b.birimFiyat - a.birimFiyat;
        case "durum":
          return a.durum.localeCompare(b.durum);
        case "ad":
        default:
          return a.ad.localeCompare(b.ad, "tr");
      }
    });

    return sonuc;
  }, [saglikTestleri, searchTerm, durumFilter, kategoriFilter, siralama]);

  const istatistikler = useMemo(() => {
    const aktif = saglikTestleri.filter((t) => t.durum === "AKTIF").length;
    const pasif = saglikTestleri.filter((t) => t.durum === "PASIF").length;
    const ortalamaFiyat = saglikTestleri.length > 0
      ? saglikTestleri.reduce((sum, t) => sum + t.birimFiyat, 0) / saglikTestleri.length
      : 0;
    const kategoriler = new Set(saglikTestleri.map((t) => t.kategoriId)).size;
    return { aktif, pasif, ortalamaFiyat, kategoriler, toplam: saglikTestleri.length };
  }, [saglikTestleri]);

  const filtrelerAktif = durumFilter || kategoriFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Sağlık Testleri</h2>
            <p className="text-muted-foreground">{saglikTestleri.length} test tanımlı</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setImportModalOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              Excel İçe Aktar
            </Button>
            <Button variant="gradient" onClick={() => router.push("/dashboard/saglik-testleri/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Test
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
                <p className="text-xs text-muted-foreground">Toplam Test</p>
                <p className="text-2xl font-bold">{istatistikler.toplam}</p>
              </div>
              <div className="rounded-xl p-3 bg-pink-100 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400">
                <TestTube2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Aktif</p>
                <p className="text-2xl font-bold text-green-600">{istatistikler.aktif}</p>
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
                <p className="text-xs text-muted-foreground">Kategori</p>
                <p className="text-2xl font-bold">{istatistikler.kategoriler}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Activity className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Ort. Fiyat</p>
                <p className="text-2xl font-bold">{formatPara(istatistikler.ortalamaFiyat)}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <DollarSign className="h-5 w-5" />
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
                  placeholder="Test adı veya kategori ile ara..."
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
                <option value="AKTIF">Aktif</option>
                <option value="PASIF">Pasif</option>
              </select>
              <select
                value={kategoriFilter}
                onChange={(e) => setKategoriFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Kategoriler</option>
                {testKategorileri.map((k) => (
                  <option key={k.id} value={k.id}>{k.ad}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-auto">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={siralama}
                  onChange={(e) => setSiralama(e.target.value as Siralama)}
                  className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ad">Ada Göre</option>
                  <option value="kategori">Kategoriye Göre</option>
                  <option value="fiyat">Fiyata Göre</option>
                  <option value="durum">Duruma Göre</option>
                </select>
              </div>
              {filtrelerAktif && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDurumFilter("");
                    setKategoriFilter("");
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
              {filteredTestler.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Test Listesi */}
      {filteredTestler.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <TestTube2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif ? "Arama kriterine uygun test bulunamadı." : "Test bulunamadı"}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <div className="flex gap-2 mt-4">
                <Button variant="gradient" onClick={() => router.push("/dashboard/saglik-testleri/yeni")}>
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Testi Ekle
                </Button>
                <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                  <Upload className="mr-2 h-4 w-4" />
                  Excel ile Yükle
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filteredTestler.map((test) => (
            <Card key={test.id} className="card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-pink-500/5 -translate-y-1/2 translate-x-1/2" />
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400">
                    <TestTube2 className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-1">{test.ad}</CardTitle>
                    <Badge variant="outline" className="mt-1 text-[10px] bg-muted">
                      {test.kategoriAdi}
                    </Badge>
                  </div>
                  <Badge className={DURUM_RENKLERI[test.durum]}>
                    {DURUM_ETIKETLERI[test.durum]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="rounded-lg bg-muted/50 p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <span className="font-semibold">{formatPara(test.birimFiyat)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
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
          ))}
        </div>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Test</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Kategori</th>
                  <th className="text-left p-4 font-medium">Fiyat</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredTestler.map((test) => (
                  <tr key={test.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400">
                          <TestTube2 className="h-4 w-4" />
                        </div>
                        <p className="font-medium">{test.ad}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{test.kategoriAdi}</td>
                    <td className="p-4 font-semibold">{formatPara(test.birimFiyat)}</td>
                    <td className="p-4 hidden md:table-cell">
                      <Badge className={DURUM_RENKLERI[test.durum]} variant="outline">
                        {DURUM_ETIKETLERI[test.durum]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          if (confirm(`"${test.ad}" testini silmek istediğinize emin misiniz?`)) {
                            testSil(test.id);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Import Modal */}
      <TestImportModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        mevcutTestler={saglikTestleri}
        kategoriler={testKategorileri}
        testEkle={testEkle}
        testGuncelle={testGuncelle}
        onBasarili={() => {}}
      />
    </div>
  );
}
