"use client";

import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { KDV_ORANI, DURUM_ETIKETLERI } from "@/lib/constants";
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
} from "lucide-react";
import { exportTableToPDF } from "@/lib/export";

const durumRenkleri: Record<string, string> = {
  TASLAK: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  GÖNDERİLDİ: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  KABUL_EDİLDİ: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REDDEDİLDİ: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const durumIconlari: Record<string, typeof Clock> = {
  TASLAK: Clock,
  GÖNDERİLDİ: Clock,
  KABUL_EDİLDİ: CheckCircle2,
  REDDEDİLDİ: XCircle,
};

export default function TeklifDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { teklifler, teklifGuncelle, firmalar } = useStore();

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
    const headers = ["Test", "Miktar", "Birim Fiyat", "İndirim", "Toplam"];
    const rows = teklif.kalemler.map((k) => [
      k.testAdi,
      String(k.miktar),
      formatPara(k.birimFiyat),
      `%${k.indirimYuzde}`,
      formatPara(k.toplam),
    ]);
    rows.push(["", "", "", "Ara Toplam:", formatPara(teklif.araToplam)]);
    rows.push(["", "", "", `KDV (%${teklif.kdvYuzde}):`, formatPara(teklif.kdvTutar)]);
    rows.push(["", "", "", "Genel Toplam:", formatPara(teklif.genelToplam)]);
    exportTableToPDF(headers, rows, `teklif_${teklif.id}`, `Fiyat Teklifi - ${teklif.firmaAdi || "Firma"}`);
  };

  const handleDurumDegistir = (yeniDurum: string) => {
    teklifGuncelle(teklif.id, { durum: yeniDurum as any });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">Teklif #{teklif.id}</h2>
            <Badge className={durumRenkleri[teklif.durum] || ""}>
              <DurumIcon className="mr-1 h-3 w-3" />
              {DURUM_ETIKETLERI[teklif.durum] || teklif.durum}
            </Badge>
          </div>
          <p className="text-muted-foreground">{teklif.firmaAdi}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePDFExport}>
            <Download className="mr-2 h-4 w-4" />
            PDF İndir
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Yazdır
          </Button>
          {teklif.durum === "TASLAK" && (
            <Button size="sm" onClick={() => handleDurumDegistir("GÖNDERİLDİ")}>
              <Clock className="mr-2 h-4 w-4" />
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

            {/* Toplam */}
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
                <p className="text-xs text-muted-foreground">Firma</p>
                <p className="font-semibold">{teklif.firmaAdi}</p>
              </div>
              {firma && (
                <>
                  <div>
                    <p className="text-xs text-muted-foreground">Yetkili</p>
                    <p className="font-medium">{firma.yetkiliKisi}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Telefon</p>
                    <p className="font-medium">{firma.telefon}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">E-posta</p>
                    <p className="font-medium">{firma.email}</p>
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
                <span className="text-muted-foreground">Kalem Sayısı</span>
                <span className="font-medium">{teklif.kalemler.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Oluşturulma</span>
                <span className="font-medium">{teklif.olusturmaTarihi}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Geçerlilik</span>
                <span className="font-medium">{teklif.gecerlilikTarihi}</span>
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
                <CardTitle className="text-base">Notlar</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{teklif.notlar}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
