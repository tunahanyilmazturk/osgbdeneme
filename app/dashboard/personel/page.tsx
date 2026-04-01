"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import { exportPersoneller } from "@/lib/export";
import {
  Users,
  Phone,
  Mail,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Briefcase,
  FileSpreadsheet,
  Filter,
  ArrowUpDown,
  CheckCircle2,
  Clock,
  Calendar,
} from "lucide-react";

type GorunumModu = "kart" | "liste";
type Siralama = "ad" | "pozisyon" | "tarih" | "durum";

export default function PersonelPage() {
  const router = useRouter();
  const { personeller, personelSil, pozisyonlar } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<GorunumModu>("liste");
  const [durumFilter, setDurumFilter] = useState<string>("");
  const [pozisyonFilter, setPozisyonFilter] = useState<string>("");
  const [siralama, setSiralama] = useState<Siralama>("tarih");

  const filteredPersoneller = useMemo(() => {
    let sonuc = personeller.filter(
      (personel) =>
        personel.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personel.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
        personel.pozisyon.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (personel.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false)
    );

    if (durumFilter) {
      sonuc = sonuc.filter((p) => p.durum === durumFilter);
    }

    if (pozisyonFilter) {
      sonuc = sonuc.filter((p) => p.pozisyon === pozisyonFilter);
    }

    sonuc.sort((a, b) => {
      switch (siralama) {
        case "ad":
          return `${a.ad} ${a.soyad}`.localeCompare(`${b.ad} ${b.soyad}`, "tr");
        case "pozisyon":
          return a.pozisyon.localeCompare(b.pozisyon, "tr");
        case "durum":
          return a.durum.localeCompare(b.durum);
        case "tarih":
        default:
          return new Date(b.olusturmaTarihi).getTime() - new Date(a.olusturmaTarihi).getTime();
      }
    });

    return sonuc;
  }, [personeller, searchTerm, durumFilter, pozisyonFilter, siralama]);

  const istatistikler = useMemo(() => {
    const aktif = personeller.filter((p) => p.durum === "AKTIF").length;
    const pasif = personeller.filter((p) => p.durum === "PASIF").length;
    const beklemede = personeller.filter((p) => p.durum === "BEKLEMEDE").length;
    return { aktif, pasif, beklemede, toplam: personeller.length };
  }, [personeller]);

  const getInitials = (ad: string, soyad: string) => `${ad?.charAt(0) || ""}${soyad?.charAt(0) || ""}`;

  const renkleri = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-violet-600",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
  ];

  const filtrelerAktif = durumFilter || pozisyonFilter;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Çalışanlar</h2>
            <p className="text-muted-foreground">Kayıtlı {personeller.length} çalışan bulunuyor</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPersoneller(personeller)}
              disabled={personeller.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <Button variant="gradient" onClick={() => router.push("/dashboard/personel/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Çalışan
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
                <p className="text-xs text-muted-foreground">Toplam Çalışan</p>
                <p className="text-2xl font-bold">{istatistikler.toplam}</p>
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
                <p className="text-xs text-muted-foreground">Pasif</p>
                <p className="text-2xl font-bold text-red-600">{istatistikler.pasif}</p>
              </div>
              <div className="rounded-xl p-3 bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Beklemede</p>
                <p className="text-2xl font-bold text-amber-600">{istatistikler.beklemede}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Clock className="h-5 w-5" />
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
                  placeholder="Ad, soyad, pozisyon veya e-posta ile ara..."
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
                <option value="BEKLEMEDE">Beklemede</option>
              </select>
              <select
                value={pozisyonFilter}
                onChange={(e) => setPozisyonFilter(e.target.value)}
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Tüm Pozisyonlar</option>
                {pozisyonlar.map((p) => (
                  <option key={p} value={p}>{p}</option>
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
                  <option value="ad">Ada Göre</option>
                  <option value="pozisyon">Pozisyona Göre</option>
                  <option value="durum">Duruma Göre</option>
                </select>
              </div>
              {filtrelerAktif && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setDurumFilter("");
                    setPozisyonFilter("");
                  }}
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
              {filteredPersoneller.length} sonuç bulundu
              {filtrelerAktif && " (filtrelenmiş)"}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Personel Listesi */}
      {filteredPersoneller.length === 0 ? (
        <Card>
          <CardContent className="empty-state">
            <div className="empty-state-icon animate-float">
              <Users className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">
              {searchTerm || filtrelerAktif
                ? "Arama kriterine uygun çalışan bulunamadı."
                : "Henüz kayıtlı çalışan bulunmuyor."}
            </p>
            {!searchTerm && !filtrelerAktif && (
              <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/personel/yeni")}>
                <Plus className="mr-2 h-4 w-4" />
                İlk Çalışanı Ekle
              </Button>
            )}
          </CardContent>
        </Card>
      ) : gorunum === "kart" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filteredPersoneller.map((personel, idx) => (
            <Card key={personel.id} className="card-hover group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${renkleri[idx % renkleri.length]} text-white font-semibold text-sm`}>
                    {getInitials(personel.ad, personel.soyad)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-1">
                      {personel.ad} {personel.soyad}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{personel.pozisyon}</p>
                  </div>
                  <Badge className={DURUM_RENKLERI[personel.durum]}>
                    {DURUM_ETIKETLERI[personel.durum]}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{personel.telefon}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{personel.email || "-"}</span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate">{personel.isegirisTarihi ? `Giriş: ${personel.isegirisTarihi}` : "-"}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 group-hover:border-primary/30"
                    onClick={() => router.push(`/dashboard/personel/${personel.id}`)}
                  >
                    <Eye className="mr-1 h-3 w-3" />
                    Detay
                    <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/personel/${personel.id}/duzenle`)}>
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      if (confirm(`${personel.ad} ${personel.soyad} çalışanını silmek istediğinize emin misiniz?`)) {
                        personelSil(personel.id);
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
        /* Liste Görünümü */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Çalışan</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Pozisyon</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">İletişim</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">İşe Giriş</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersoneller.map((personel, idx) => (
                  <tr key={personel.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${renkleri[idx % renkleri.length]} text-white font-semibold text-xs`}>
                          {getInitials(personel.ad, personel.soyad)}
                        </div>
                        <div>
                          <p className="font-medium">{personel.ad} {personel.soyad}</p>
                          <p className="text-xs text-muted-foreground">{personel.pozisyon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{personel.pozisyon}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-muted-foreground">
                        <p className="text-xs">{personel.telefon}</p>
                        <p className="text-xs">{personel.email || "-"}</p>
                      </div>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-muted-foreground">{personel.isegirisTarihi || "-"}</td>
                    <td className="p-4">
                      <Badge className={DURUM_RENKLERI[personel.durum]} variant="outline">
                        {DURUM_ETIKETLERI[personel.durum]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personel/${personel.id}`)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personel/${personel.id}/duzenle`)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (confirm(`${personel.ad} ${personel.soyad} çalışanını silmek istediğinize emin misiniz?`)) {
                              personelSil(personel.id);
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
