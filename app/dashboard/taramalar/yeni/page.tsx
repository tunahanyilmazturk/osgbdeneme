"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { TaramaDurumu } from "@/types";
import { ArrowLeft, Save, Users, Calendar, TestTube2, Building2 } from "lucide-react";

export default function YeniTaramaPage() {
  const router = useRouter();
  const { taramaEkle, firmalar, saglikTestleri, personeller } = useStore();

  const [form, setForm] = useState({
    ad: "",
    firmaId: "",
    personelIds: [] as string[],
    testIds: [] as string[],
    planlananTarih: "",
    durum: "PLANLANDI" as TaramaDurumu,
    atananPersonelId: "",
    notlar: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.personelIds.length === 0) {
      alert("En az bir personel seçmelisiniz!");
      return;
    }
    if (form.testIds.length === 0) {
      alert("En az bir test seçmelisiniz!");
      return;
    }
    taramaEkle(form);
    router.push("/dashboard/taramalar");
  };

  const handleChange = (field: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const aktifTestler = saglikTestleri.filter((t) => t.durum === "AKTIF");
  const firmaPersonelleri = form.firmaId
    ? personeller.filter((p) => p.firmaId === form.firmaId && p.durum === "AKTIF")
    : [];

  const togglePersonel = (id: string) => {
    setForm((prev) => ({
      ...prev,
      personelIds: prev.personelIds.includes(id)
        ? prev.personelIds.filter((pid) => pid !== id)
        : [...prev.personelIds, id],
    }));
  };

  const toggleTest = (id: string) => {
    setForm((prev) => ({
      ...prev,
      testIds: prev.testIds.includes(id)
        ? prev.testIds.filter((tid) => tid !== id)
        : [...prev.testIds, id],
    }));
  };

  const tumunuSecPersonel = () => {
    setForm((prev) => ({
      ...prev,
      personelIds: firmaPersonelleri.map((p) => p.id),
    }));
  };

  const temizlePersonel = () => {
    setForm((prev) => ({ ...prev, personelIds: [] }));
  };

  const tumunuSecTest = () => {
    setForm((prev) => ({
      ...prev,
      testIds: aktifTestler.map((t) => t.id),
    }));
  };

  const temizleTest = () => {
    setForm((prev) => ({ ...prev, testIds: [] }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Tarama</h2>
          <p className="text-muted-foreground">Periyodik muayene taraması oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Temel Bilgiler */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tarama Adı *</label>
                <Input
                  value={form.ad}
                  onChange={(e) => handleChange("ad", e.target.value)}
                  placeholder="Örn: 2026 Bahar Periyodik Muayenesi"
                  required
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Firma *</label>
                  <Select
                    value={form.firmaId}
                    onChange={(e) => {
                      handleChange("firmaId", e.target.value);
                      handleChange("personelIds", []); // Personeli sıfırla
                    }}
                    options={aktifFirmalar.map((f) => ({ value: f.id, label: f.ad }))}
                    placeholder="Firma seçiniz"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Planlanan Tarih *</label>
                  <Input
                    type="date"
                    value={form.planlananTarih}
                    onChange={(e) => handleChange("planlananTarih", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personel Seçimi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personel Seçimi
                </div>
                {form.personelIds.length > 0 && (
                  <Badge variant="outline">{form.personelIds.length} seçili</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {!form.firmaId ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Önce firma seçiniz
                </p>
              ) : firmaPersonelleri.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Bu firmada kayıtlı personel bulunmuyor
                </p>
              ) : (
                <>
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" onClick={tumunuSecPersonel}>
                      Tümünü Seç
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={temizlePersonel}>
                      Temizle
                    </Button>
                  </div>
                  <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                    {firmaPersonelleri.map((personel) => (
                      <label
                        key={personel.id}
                        className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-accent transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={form.personelIds.includes(personel.id)}
                          onChange={() => togglePersonel(personel.id)}
                          className="h-4 w-4 rounded"
                        />
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {personel.ad} {personel.soyad}
                          </p>
                          <p className="text-xs text-muted-foreground">{personel.pozisyon}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Test Seçimi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube2 className="h-5 w-5" />
                  Test Seçimi
                </div>
                {form.testIds.length > 0 && (
                  <Badge variant="outline">{form.testIds.length} seçili</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <Button type="button" variant="outline" size="sm" onClick={tumunuSecTest}>
                  Tümünü Seç
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={temizleTest}>
                  Temizle
                </Button>
              </div>
              <div className="max-h-60 space-y-2 overflow-y-auto rounded-lg border p-3">
                {aktifTestler.map((test) => (
                  <label
                    key={test.id}
                    className="flex items-center gap-3 cursor-pointer rounded-lg p-2 hover:bg-accent transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={form.testIds.includes(test.id)}
                      onChange={() => toggleTest(test.id)}
                      className="h-4 w-4 rounded"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{test.ad}</p>
                      <p className="text-xs text-muted-foreground">
                        {test.kategoriAdi} - {test.periyot} günde bir
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Diğer Bilgiler */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Diğer Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Durum</label>
                  <Select
                    value={form.durum}
                    onChange={(e) => handleChange("durum", e.target.value)}
                    options={[
                      { value: "PLANLANDI", label: "Planlandı" },
                      { value: "DEVAM_EDIYOR", label: "Devam Ediyor" },
                    ]}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Atanan Personel</label>
                  <Select
                    value={form.atananPersonelId}
                    onChange={(e) => handleChange("atananPersonelId", e.target.value)}
                    options={personeller.map((p) => ({
                      value: p.id,
                      label: `${p.ad} ${p.soyad}`,
                    }))}
                    placeholder="Taramayı yürütecek personel"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Notlar</label>
                <textarea
                  value={form.notlar}
                  onChange={(e) => handleChange("notlar", e.target.value)}
                  placeholder="Tarama hakkında notlarınız..."
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kaydet */}
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            İptal
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Taramayı Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
