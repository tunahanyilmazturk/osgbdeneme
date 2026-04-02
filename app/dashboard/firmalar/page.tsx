"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { useRouter } from "next/navigation";
import { useFirmaStore, useRandevuStore, useTeklifStore } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import { exportFirmalar } from "@/lib/export";
import { FirmaCard, FirmaListItem, useFirmaStats } from "@/components/firma-components";
import {
  Building2,
  Plus,
  Search,
  FileSpreadsheet,
  Filter,
  ArrowUpDown,
  Calendar,
  TrendingUp,
  CheckCircle2,
  Users,
  MapPin,
  Phone,
  Mail,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";

type GorunumModu = "kart" | "liste";
type Siralama = "ad" | "sektor" | "il" | "tarih" | "calisan";

export default function FirmalarPage() {
  const router = useRouter();
  const { firmalar, firmaSil } = useFirmaStore();
  const { randevular } = useRandevuStore();
  const { teklifler } = useTeklifStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("liste");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [sektorFilter, setSektorFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("tarih");

  // Memoized callbacks for event handlers
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleDurumFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setDurumFilter(e.target.value);
  }, []);

  const handleSektorFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSektorFilter(e.target.value);
  }, []);

  const handleSiralamaChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiralama(e.target.value as Siralama);
  }, []);

  const handleGorunumKart = useCallback(() => setGorunum("kart"), []);
  const handleGorunumListe = useCallback(() => setGorunum("liste"), []);

  const handleClearFilters = useCallback(() => {
    setDurumFilter("");
    setSektorFilter("");
  }, []);

  const handleExport = useCallback(() => {
    exportFirmalar(firmalar);
  }, [firmalar]);

  const handleNewFirma = useCallback(() => {
    router.push("/dashboard/firmalar/yeni");
  }, [router]);

  const handleDeleteFirma = useCallback((id: string) => {
    firmaSil(id);
  }, [firmaSil]);

  const sektorler = useMemo(() => {
    const unique = [...new Set(firmalar.map((f) => f.sektor))];
    return unique.sort();
  }, [firmalar]);

  const filteredFirmalar = useMemo(() => {
    let sonuc = firmalar.filter(
      (firma) =>
        firma.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firma.sektor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firma.il.toLowerCase().includes(searchTerm.toLowerCase()) ||
        firma.yetkiliKisi.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (durumFilter) {
      sonuc = sonuc.filter((f) => f.durum === durumFilter);
    }

    if (sektorFilter) {
      sonuc = sonuc.filter((f) => f.sektor === sektorFilter);
    }

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "ad":
          return a.ad.localeCompare(b.ad, "tr");
        case "sektor":
          return a.sektor.localeCompare(b.sektor, "tr");
        case "il":
          return a.il.localeCompare(b.il, "tr");
        case "calisan":
          return b.calisanSayisi - a.calisanSayisi;
        case "tarih":
        default:
          return new Date(b.olusturmaTarihi).getTime() - new Date(a.olusturmaTarihi).getTime();
      }
    });

    return sonuc;
  }, [firmalar, searchTerm, durumFilter, sektorFilter, siralama]);

  const istatistikler = useMemo(() => {
    const aktif = firmalar.filter((f) => f.durum === "AKTIF").length;
    const toplamCalisan = firmalar.reduce((sum, f) => sum + f.calisanSayisi, 0);
    const toplamRandevu = randevular.length;
    const kabulTeklif = teklifler.filter((t) => t.durum === "KABUL_EDİLDİ").length;
    return { aktif, toplamCalisan, toplamRandevu, kabulTeklif };
  }, [firmalar, randevular, teklifler]);

  const filtrelerAktif = durumFilter || sektorFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Firmalar</h2>
            <p className="text-muted-foreground">
              Kayıtlı {firmalar.length} firma bulunuyor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={firmalar.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="gradient" onClick={() => router.push("/dashboard/firmalar/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Firma
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
                <p className="text-xs text-muted-foreground">Aktif Firma</p>
                <p className="text-2xl font-bold">{istatistikler.aktif}</p>
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
                <p className="text-xs text-muted-foreground">Toplam Çalışan</p>
                <p className="text-2xl font-bold">{istatistikler.toplamCalisan.toLocaleString("tr-TR")}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Taramalar</p>
                <p className="text-2xl font-bold">{istatistikler.toplamRandevu}</p>
              </div>
              <div className="rounded-xl p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kabul Edilen Teklif</p>
                <p className="text-2xl font-bold">{istatistikler.kabulTeklif}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
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
            {/* Arama + Görünüm */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Firma adı, sektör, şehir veya yetkili ile ara..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="pl-10"
                />
              </div>
              <div className="flex items-center gap-2">
                <div className="flex rounded-lg bg-muted p-1">
                  <button
                    onClick={handleGorunumKart}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${gorunum === "kart" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
                  >
                    Kart
                  </button>
                  <button
                    onClick={handleGorunumListe}
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
                onChange={handleDurumFilterChange}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Durumlar</option>
                <option value="AKTIF">Aktif</option>
                <option value="PASIF">Pasif</option>
                <option value="BEKLEMEDE">Beklemede</option>
              </select>
              <select
                value={sektorFilter}
                onChange={handleSektorFilterChange}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Sektörler</option>
                {sektorler.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 ml-auto">
                <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
                <select
                  value={siralama}
                  onChange={handleSiralamaChange}
                  className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="tarih">En Yeni</option>
                  <option value="ad">Ada Göre</option>
                  <option value="sektor">Sektöre Göre</option>
                  <option value="il">Şehre Göre</option>
                  <option value="calisan">Çalışan Sayısı</option>
                </select>
              </div>
              {filtrelerAktif && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-xs"
                >
                  Filtreleri Temizle
                </Button>
              )}
            </div>
          </div>

          {/* Sonuç sayısı */}
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              {filteredFirmalar.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Firma Listesi */}
      {filteredFirmalar.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <Building2 className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif
                ? "Arama kriterine uygun firma bulunamadı."
                : "Henüz kayıtlı firma bulunmuyor."}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <Button
                variant="gradient"
                className="mt-4"
                onClick={handleNewFirma}
              >
                <Plus className="mr-2 h-4 w-4" />
                İlk Firmayı Oluştur
              </Button>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filteredFirmalar.map((firma) => {
            const firmaRandevulari = randevular.filter((r) => r.firmaId === firma.id);
            const firmaTeklifleri = teklifler.filter((t) => t.firmaId === firma.id);
            return (
              <Card key={firma.id} className="card-hover group relative overflow-hidden">
                {/* Dekoratif gradient */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{firma.ad}</CardTitle>
                      <p className="text-sm text-muted-foreground">{firma.sektor}</p>
                    </div>
                    <Badge className={DURUM_RENKLERI[firma.durum]}>
                      {DURUM_ETIKETLERI[firma.durum]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{firma.calisanSayisi} çalışan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.il}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.telefon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.email}</span>
                    </div>
                  </div>

                  {/* Mini istatistikler */}
                  <div className="flex gap-2 pt-1">
                    <div className="flex-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
                      <Calendar className="h-3.5 w-3.5 text-purple-500" />
                      <span className="text-xs text-muted-foreground">{firmaRandevulari.length} tarama</span>
                    </div>
                    <div className="flex-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
                      <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
                      <span className="text-xs text-muted-foreground">{firmaTeklifleri.length} teklif</span>
                    </div>
                  </div>

                  {/* İşlemler */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:border-primary/30"
                      onClick={() => router.push(`/dashboard/firmalar/${firma.id}`)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detay
                      <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/firmalar/${firma.id}/duzenle`)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFirma(firma.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Liste Görünümü */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Firma</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Sektör</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Şehir</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">Çalışan</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">İletişim</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredFirmalar.map((firma) => (
                  <tr key={firma.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                          <Building2 className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="font-medium">{firma.ad}</p>
                          <p className="text-xs text-muted-foreground">{firma.yetkiliKisi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{firma.sektor}</td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">{firma.il}</td>
                    <td className="p-4 hidden lg:table-cell">{firma.calisanSayisi}</td>
                    <td className="p-4 hidden md:table-cell">
                      <div className="text-muted-foreground">
                        <p className="text-xs">{firma.telefon}</p>
                        <p className="text-xs">{firma.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={DURUM_RENKLERI[firma.durum]} variant="outline">
                        {DURUM_ETIKETLERI[firma.durum]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/firmalar/${firma.id}`)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/firmalar/${firma.id}/duzenle`)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (confirm(`${firma.ad} firmasını silmek istediğinize emin misiniz?`)) {
                              firmaSil(firma.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
