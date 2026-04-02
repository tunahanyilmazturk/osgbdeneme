"use client";

import { useRouter, useParams } from "next/navigation";
import { useTeklifStore, useFirmaStore } from "@/lib/stores";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DURUM_ETIKETLERI } from "@/lib/constants";
import {
  ArrowLeft,
  FileText,
  Building2,
  Calendar,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Phone,
  Mail,
  MapPin,
  Hash,
  Users,
  TrendingUp,
  TestTube2,
  Copy,
  Edit,
} from "lucide-react";
import { exportTableToPDF, generateTeklifPDF } from "@/lib/export";

const durumRenkleri: Record<string, string> = {
  TASLAK: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  GÖNDERİLDİ: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  KABUL_EDİLDİ: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REDDEDİLDİ: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const durumIconlari: Record<string, typeof Clock> = {
  TASLAK: Clock,
  GÖNDERİLDİ: Send,
  KABUL_EDİLDİ: CheckCircle2,
  REDDEDİLDİ: XCircle,
};

export default function TeklifDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { teklifler, teklifGuncelle } = useTeklifStore();
  const { firmalar } = useFirmaStore();

  const teklif = teklifler.find((t) => t.id === params.id);
  if (!teklif) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Teklif bulunamadı.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const firma = firmalar.find((f) => f.id === teklif.firmaId);
  const DurumIcon = durumIconlari[teklif.durum] || Clock;

  const handlePDFExport = () => {
    generateTeklifPDF({
      teklifNo: teklif.id,
      firmaAdi: teklif.firmaAdi || "",
      firmaVergiNo: firma?.vergiNo,
      firmaAdres: firma ? `${firma.il}, ${firma.ilce}` : undefined,
      firmaTelefon: firma?.telefon,
      firmaEmail: firma?.email,
      firmaCalisanSayisi: firma?.calisanSayisi,
      tarih: teklif.olusturmaTarihi,
      gecerlilikTarihi: teklif.gecerlilikTarihi,
      durum: teklif.durum,
      kdvYuzde: teklif.kdvYuzde,
      kalemler: teklif.kalemler,
      araToplam: teklif.araToplam,
      kdvTutar: teklif.kdvTutar,
      genelToplam: teklif.genelToplam,
      notlar: teklif.notlar,
      osGBAdi: "OSGB Sağlık Hizmetleri",
      osGBTelefon: "0212 555 55 55",
      osGBEmail: "info@osgb.com",
      osGBAdres: "İstanbul, Türkiye",
    });
  };

  const handleDurumDegistir = (yeniDurum: string) => {
    teklifGuncelle(teklif.id, { durum: yeniDurum as any });
  };

  const gecerlilikKalan = teklif.gecerlilikTarihi ? Math.ceil((new Date(teklif.gecerlilikTarihi).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight">Teklif #{teklif.id}</h2>
              <Badge className={durumRenkleri[teklif.durum] || ""}>
                <DurumIcon className="mr-1 h-3 w-3" />
                {DURUM_ETIKETLERI[teklif.durum] || teklif.durum}
              </Badge>
            </div>
            <p className="text-muted-foreground">{teklif.firmaAdi}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handlePDFExport}>
            <Download className="mr-2 h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
          {teklif.durum === "TASLAK" && (
            <Button size="sm" onClick={() => handleDurumDegistir("GÖNDERİLDİ")}>
              <Send className="mr-2 h-4 w-4" />
              Gönder
            </Button>
          )}
          {teklif.durum === "GÖNDERİLDİ" && (
            <>
              <Button size="sm" onClick={() => handleDurumDegistir("KABUL_EDİLDİ")} className="bg-green-600 hover:bg-green-700">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Kabul Et
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDurumDegistir("REDDEDİLDİ")}>
                <XCircle className="mr-2 h-4 w-4" />
                Reddet
              </Button>
            </>
          )}
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Genel Toplam</p>
                <p className="text-2xl font-bold text-primary">{formatPara(teklif.genelToplam)}</p>
              </div>
              <div className="rounded-xl p-3 bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Kalem Sayısı</p>
                <p className="text-2xl font-bold">{teklif.kalemler.length}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <TestTube2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Geçerlilik</p>
                <p className="text-2xl font-bold">
                  {gecerlilikKalan !== null ? (
                    <span className={gecerlilikKalan > 0 ? "text-green-600" : "text-red-600"}>
                      {gecerlilikKalan > 0 ? `${gecerlilikKalan} gün` : "Süresi doldu"}
                    </span>
                  ) : "-"}
                </p>
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
                <p className="text-xs text-muted-foreground">Toplam Kişi</p>
                <p className="text-2xl font-bold">
                  {teklif.kalemler.length > 0 ? teklif.kalemler[0]?.miktar || "-" : "-"}
                </p>
              </div>
              <div className="rounded-xl p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Teklif Kalemleri */}
        <Card className="lg:col-span-2" id="teklif-content">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Teklif Kalemleri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-lg border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="p-3 text-left font-medium">#</th>
                    <th className="p-3 text-left font-medium">Test Adı</th>
                    <th className="p-3 text-right font-medium">Miktar</th>
                    <th className="p-3 text-right font-medium">Birim Fiyat</th>
                    <th className="p-3 text-right font-medium">İndirim</th>
                    <th className="p-3 text-right font-medium">Toplam</th>
                  </tr>
                </thead>
                <tbody>
                  {teklif.kalemler.map((kalem, i) => (
                    <tr key={kalem.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 text-muted-foreground">{i + 1}</td>
                      <td className="p-3 font-medium">{kalem.testAdi}</td>
                      <td className="p-3 text-right">{kalem.miktar}</td>
                      <td className="p-3 text-right">{formatPara(kalem.birimFiyat)}</td>
                      <td className="p-3 text-right">
                        {kalem.indirimYuzde > 0 ? (
                          <Badge variant="outline" className="text-green-700 border-green-200 dark:text-green-400 dark:border-green-800">
                            %{kalem.indirimYuzde}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-right font-semibold">{formatPara(kalem.toplam)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col items-end gap-2 rounded-lg bg-muted/50 p-4">
              <div className="flex items-center gap-8 text-sm">
                <span className="text-muted-foreground">Ara Toplam:</span>
                <span className="font-medium w-32 text-right">{formatPara(teklif.araToplam)}</span>
              </div>
              <div className="flex items-center gap-8 text-sm">
                <span className="text-muted-foreground">KDV (%{teklif.kdvYuzde}):</span>
                <span className="font-medium w-32 text-right">{formatPara(teklif.kdvTutar)}</span>
              </div>
              <div className="flex items-center gap-8 border-t pt-2">
                <span className="font-semibold">Genel Toplam:</span>
                <span className="text-xl font-bold text-primary w-32 text-right">{formatPara(teklif.genelToplam)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Yan Bilgiler */}
        <div className="space-y-4">
          {/* Firma Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Firma Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Firma Adı</p>
                <p className="font-semibold">{teklif.firmaAdi}</p>
              </div>
              {firma && (
                <>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Vergi No</p>
                      <p className="text-sm font-medium">{firma.vergiNo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Çalışan Sayısı</p>
                      <p className="text-sm font-medium">{firma.calisanSayisi}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Telefon</p>
                      <p className="text-sm font-medium">{firma.telefon}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">E-posta</p>
                      <p className="text-sm font-medium">{firma.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Adres</p>
                      <p className="text-sm font-medium">{firma.il}, {firma.ilce}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Teklif Özeti */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Teklif Özeti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Oluşturulma</span>
                <span className="font-medium">{teklif.olusturmaTarihi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Geçerlilik</span>
                <span className="font-medium">{teklif.gecerlilikTarihi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">KDV Oranı</span>
                <span className="font-medium">%{teklif.kdvYuzde}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Durum</span>
                <Badge className={durumRenkleri[teklif.durum]}>
                  {DURUM_ETIKETLERI[teklif.durum]}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Notlar */}
          {teklif.notlar && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Ön Yazı
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{teklif.notlar}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
