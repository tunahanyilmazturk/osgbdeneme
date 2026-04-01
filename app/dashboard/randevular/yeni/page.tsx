"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { RandevuDurumu } from "@/types";
import { ArrowLeft, Save, Clock, Calendar, TestTube2, Building2 } from "lucide-react";

const randevuSuresi: Record<string, number> = {
  "1": 15,
  "2": 20,
  "3": 30,
  "4": 25,
  "5": 30,
};

export default function YeniRandevuPage() {
  const router = useRouter();
  const { randevuEkle, firmalar, saglikTestleri, personeller } = useStore();

  const [form, setForm] = useState({
    firmaId: "",
    personelId: "",
    testId: "",
    tarih: "",
    baslangicSaati: "",
    durum: "BEKLEMEDE" as RandevuDurumu,
    notlar: "",
  });

  const [bitisSaati, setBitisSaati] = useState("");

  // Seçilen teste göre süreyi hesapla
  const secilenTestSuresi = form.testId ? randevuSuresi[form.testId] || 30 : 30;

  // Başlangıç saati değiştiğinde bitiş saatini hesapla
  const handleBaslangicSaatiChange = (saat: string) => {
    setForm((prev) => ({ ...prev, baslangicSaati: saat }));
    if (saat) {
      const [saatStr, dakikaStr] = saat.split(":");
      const saatNum = parseInt(saatStr);
      const dakikaNum = parseInt(dakikaStr);
      const yeniDakika = dakikaNum + secilenTestSuresi;
      const yeniSaat = saatNum + Math.floor(yeniDakika / 60);
      const sonDakika = yeniDakika % 60;
      setBitisSaati(`${String(yeniSaat).padStart(2, "0")}:${String(sonDakika).padStart(2, "0")}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    randevuEkle({
      ...form,
      bitisSaati: bitisSaati || form.baslangicSaati,
    });
    router.push("/dashboard/randevular");
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const aktifTestler = saglikTestleri.filter((t) => t.durum === "AKTIF");
  const aktifPersoneller = personeller.filter((p) => p.durum === "AKTIF");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Randevu</h2>
          <p className="text-muted-foreground">Sisteme yeni randevu kaydı oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Temel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Firma *</label>
                <Select
                  value={form.firmaId}
                  onChange={(e) => {
                    handleChange("firmaId", e.target.value);
                    handleChange("personelId", ""); // Personeli sıfırla
                  }}
                  options={aktifFirmalar.map((f) => ({ value: f.id, label: f.ad }))}
                  placeholder="Firma seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Personel (Opsiyonel)</label>
                <Select
                  value={form.personelId}
                  onChange={(e) => handleChange("personelId", e.target.value)}
                  options={aktifPersoneller.map((p) => ({
                    value: p.id,
                    label: `${p.ad} ${p.soyad} - ${p.pozisyon}`,
                  }))}
                  placeholder="Personel seçiniz (opsiyonel)"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sağlık Testi *</label>
                <Select
                  value={form.testId}
                  onChange={(e) => handleChange("testId", e.target.value)}
                  options={aktifTestler.map((t) => ({
                    value: t.id,
                    label: `${t.ad} - ${formatPara(t.birimFiyat)}`,
                  }))}
                  placeholder="Test seçiniz"
                  required
                />
              </div>
              {form.testId && (
                <div className="rounded-lg border bg-muted/50 p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Tahmini Süre:</span>
                    <Badge variant="outline">
                      <Clock className="mr-1 h-3 w-3" />
                      {secilenTestSuresi} dakika
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarih ve Saat */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Tarih ve Saat
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tarih *</label>
                <Input
                  type="date"
                  value={form.tarih}
                  onChange={(e) => handleChange("tarih", e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Başlangıç Saati *</label>
                <Input
                  type="time"
                  value={form.baslangicSaati}
                  onChange={(e) => handleBaslangicSaatiChange(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Bitiş Saati</label>
                <Input
                  type="time"
                  value={bitisSaati}
                  readOnly
                  className="bg-muted"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Otomatik olarak hesaplanır
                </p>
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <Select
                  value={form.durum}
                  onChange={(e) => handleChange("durum", e.target.value)}
                  options={[
                    { value: "BEKLEMEDE", label: "Beklemede" },
                    { value: "ONAYLANDI", label: "Onaylandı" },
                    { value: "DEVAM_EDIYOR", label: "Devam Ediyor" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notlar */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Ek Bilgiler</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <label className="text-sm font-medium">Notlar</label>
                <textarea
                  value={form.notlar}
                  onChange={(e) => handleChange("notlar", e.target.value)}
                  placeholder="Randevu hakkında notlarınız..."
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kaydet Butonu */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Randevuyu Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
