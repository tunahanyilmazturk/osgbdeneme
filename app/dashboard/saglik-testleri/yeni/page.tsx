"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { TEST_KATEGORILERI } from "@/lib/constants";
import type { GenelDurum } from "@/types";
import { ArrowLeft, Save, DollarSign, Clock, Calendar } from "lucide-react";

export default function YeniTestPage() {
  const router = useRouter();
  const { testEkle } = useStore();

  const [form, setForm] = useState({
    ad: "",
    kategoriId: "",
    aciklama: "",
    birimFiyat: 0,
    sure: 15,
    periyot: 365,
    durum: "AKTIF" as GenelDurum,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    testEkle({
      ...form,
    });
    router.push("/dashboard/saglik-testleri");
  };

  const handleChange = (field: string, value: string | number) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Sağlık Testi</h2>
          <p className="text-muted-foreground">Sisteme yeni sağlık testi tanımlayın</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Test Adı *</label>
                <Input
                  value={form.ad}
                  onChange={(e) => handleChange("ad", e.target.value)}
                  placeholder="Örn: Tam Kan Sayımı"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Kategori *</label>
                <Select
                  value={form.kategoriId}
                  onChange={(e) => handleChange("kategoriId", e.target.value)}
                  options={TEST_KATEGORILERI.map((k) => ({ value: k.id, label: k.ad }))}
                  placeholder="Kategori seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Açıklama *</label>
                <textarea
                  value={form.aciklama}
                  onChange={(e) => handleChange("aciklama", e.target.value)}
                  placeholder="Test hakkında kısa açıklama..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Durum</label>
                <Select
                  value={form.durum}
                  onChange={(e) => handleChange("durum", e.target.value)}
                  options={[
                    { value: "AKTIF", label: "Aktif" },
                    { value: "PASIF", label: "Pasif" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Fiyat ve Süre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />
                  Birim Fiyat (₺) *
                </label>
                <Input
                  type="number"
                  value={form.birimFiyat || ""}
                  onChange={(e) => handleChange("birimFiyat", parseFloat(e.target.value) || 0)}
                  placeholder="150.00"
                  min={0}
                  step={0.01}
                  required
                />
                {form.birimFiyat > 0 && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    = {formatPara(form.birimFiyat)}
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Tahmini Süre (dakika) *
                </label>
                <Input
                  type="number"
                  value={form.sure}
                  onChange={(e) => handleChange("sure", parseInt(e.target.value) || 0)}
                  min={1}
                  required
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  Yaklaşık {Math.floor(form.sure / 60)} saat {form.sure % 60} dakika
                </p>
              </div>
              <div>
                <label className="text-sm font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Periyot (gün) *
                </label>
                <Input
                  type="number"
                  value={form.periyot}
                  onChange={(e) => handleChange("periyot", parseInt(e.target.value) || 1)}
                  min={1}
                  required
                />
                <p className="mt-1 text-sm text-muted-foreground">
                  {form.periyot} günde bir tekrarlanacak ({(form.periyot / 30).toFixed(1)} ay)
                </p>
              </div>

              {/* Önizleme */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <h4 className="font-medium mb-2">Test Önizleme</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Ad:</span> {form.ad || "-"}</p>
                  <p><span className="text-muted-foreground">Fiyat:</span> {form.birimFiyat > 0 ? formatPara(form.birimFiyat) : "-"}</p>
                  <p><span className="text-muted-foreground">Süre:</span> {form.sure} dk</p>
                  <p><span className="text-muted-foreground">Periyot:</span> {form.periyot} gün</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Testi Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
