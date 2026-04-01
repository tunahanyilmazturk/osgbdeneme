"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { KDV_ORANI } from "@/lib/constants";
import type { TeklifDurumu, TeklifKalemi } from "@/types";
import { ArrowLeft, Save, Plus, Trash2, FileText, Calculator } from "lucide-react";

export default function YeniTeklifPage() {
  const router = useRouter();
  const { teklifEkle, firmalar, saglikTestleri } = useStore();

  const [form, setForm] = useState({
    firmaId: "",
    durum: "TASLAK" as TeklifDurumu,
    gecerlilikTarihi: "",
    notlar: "",
  });

  const [kalemler, setKalemler] = useState<TeklifKalemi[]>([]);
  const [secilenTestId, setSecilenTestId] = useState("");
  const [miktar, setMiktar] = useState(1);
  const [indirimYuzde, setIndirimYuzde] = useState(0);

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const aktifTestler = saglikTestleri.filter((t) => t.durum === "AKTIF");

  // Eklenmiş testleri listeden çıkar
  const mevcutTestIds = kalemler.map((k) => k.testId);
  const uygunTestler = aktifTestler.filter((t) => !mevcutTestIds.includes(t.id));

  // Hesaplamalar
  const hesaplamalar = useMemo(() => {
    const araToplam = kalemler.reduce((sum, k) => sum + k.toplam, 0);
    const kdvTutar = araToplam * (KDV_ORANI / 100);
    const genelToplam = araToplam + kdvTutar;
    return { araToplam, kdvTutar, genelToplam };
  }, [kalemler]);

  const kalemEkle = () => {
    if (!secilenTestId) return;
    const test = saglikTestleri.find((t) => t.id === secilenTestId);
    if (!test) return;

    const birimFiyat = test.birimFiyat;
    const toplam = miktar * birimFiyat * (1 - indirimYuzde / 100);

    const yeniKalem: TeklifKalemi = {
      id: Math.random().toString(36).substring(2, 15),
      testId: test.id,
      testAdi: test.ad,
      miktar,
      birimFiyat,
      indirimYuzde,
      toplam: Math.round(toplam * 100) / 100,
    };

    setKalemler((prev) => [...prev, yeniKalem]);
    setSecilenTestId("");
    setMiktar(1);
    setIndirimYuzde(0);
  };

  const kalemSil = (id: string) => {
    setKalemler((prev) => prev.filter((k) => k.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kalemler.length === 0) {
      alert("En az bir kalem eklemelisiniz!");
      return;
    }
    teklifEkle({
      ...form,
      kalemler,
      araToplam: hesaplamalar.araToplam,
      kdvYuzde: KDV_ORANI,
      kdvTutar: hesaplamalar.kdvTutar,
      genelToplam: hesaplamalar.genelToplam,
    });
    router.push("/dashboard/teklifler");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Fiyat Teklifi</h2>
          <p className="text-muted-foreground">Firmaya özel fiyat teklifi oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Teklif Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Teklif Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Firma *</label>
                <Select
                  value={form.firmaId}
                  onChange={(e) => setForm((prev) => ({ ...prev, firmaId: e.target.value }))}
                  options={aktifFirmalar.map((f) => ({ value: f.id, label: f.ad }))}
                  placeholder="Firma seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Geçerlilik Tarihi *</label>
                <Input
                  type="date"
                  value={form.gecerlilikTarihi}
                  onChange={(e) => setForm((prev) => ({ ...prev, gecerlilikTarihi: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <Select
                  value={form.durum}
                  onChange={(e) => setForm((prev) => ({ ...prev, durum: e.target.value as TeklifDurumu }))}
                  options={[
                    { value: "TASLAK", label: "Taslak" },
                    { value: "GÖNDERİLDİ", label: "Gönderildi" },
                  ]}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Notlar</label>
                <textarea
                  value={form.notlar}
                  onChange={(e) => setForm((prev) => ({ ...prev, notlar: e.target.value }))}
                  placeholder="Teklif hakkında notlar..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>

          {/* Kalem Ekleme ve Listesi */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Teklif Kalemleri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Kalem Ekleme Formu */}
              <div className="grid gap-3 sm:grid-cols-5 items-end">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">Test</label>
                  <Select
                    value={secilenTestId}
                    onChange={(e) => setSecilenTestId(e.target.value)}
                    options={uygunTestler.map((t) => ({
                      value: t.id,
                      label: `${t.ad} (${formatPara(t.birimFiyat)})`,
                    }))}
                    placeholder="Test seçiniz"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Miktar</label>
                  <Input
                    type="number"
                    value={miktar}
                    onChange={(e) => setMiktar(parseInt(e.target.value) || 1)}
                    min={1}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">İndirim %</label>
                  <Input
                    type="number"
                    value={indirimYuzde}
                    onChange={(e) => setIndirimYuzde(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))}
                    min={0}
                    max={100}
                  />
                </div>
                <Button type="button" onClick={kalemEkle} disabled={!secilenTestId}>
                  <Plus className="mr-1 h-4 w-4" />
                  Ekle
                </Button>
              </div>

              {/* Kalem Tablosu */}
              {kalemler.length > 0 ? (
                <div className="overflow-x-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-medium">Test</th>
                        <th className="p-3 text-right font-medium">Miktar</th>
                        <th className="p-3 text-right font-medium">Birim Fiyat</th>
                        <th className="p-3 text-right font-medium">İndirim</th>
                        <th className="p-3 text-right font-medium">Toplam</th>
                        <th className="p-3 text-center font-medium">İşlem</th>
                      </tr>
                    </thead>
                    <tbody>
                      {kalemler.map((kalem) => (
                        <tr key={kalem.id} className="border-b last:border-0">
                          <td className="p-3">{kalem.testAdi}</td>
                          <td className="p-3 text-right">{kalem.miktar}</td>
                          <td className="p-3 text-right">{formatPara(kalem.birimFiyat)}</td>
                          <td className="p-3 text-right">%{kalem.indirimYuzde}</td>
                          <td className="p-3 text-right font-medium">{formatPara(kalem.toplam)}</td>
                          <td className="p-3 text-center">
                            <Button type="button" variant="ghost" size="icon" onClick={() => kalemSil(kalem.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <p className="text-muted-foreground">Henüz kalem eklenmedi. Yukarıdan test seçerek ekleyin.</p>
                </div>
              )}

              {/* Toplam */}
              {kalemler.length > 0 && (
                <div className="flex flex-col items-end gap-1 rounded-lg bg-muted/50 p-4">
                  <div className="text-sm">
                    Ara Toplam: <span className="font-medium">{formatPara(hesaplamalar.araToplam)}</span>
                  </div>
                  <div className="text-sm">
                    KDV (%{KDV_ORANI}): <span className="font-medium">{formatPara(hesaplamalar.kdvTutar)}</span>
                  </div>
                  <div className="text-xl font-bold text-primary">
                    Genel Toplam: {formatPara(hesaplamalar.genelToplam)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kaydet */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit" disabled={kalemler.length === 0}>
            <Save className="mr-2 h-4 w-4" />
            Teklifi Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
