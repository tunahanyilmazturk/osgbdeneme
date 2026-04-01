"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SEKTOR_LISTESI, ILLER } from "@/lib/constants";
import type { GenelDurum } from "@/types";
import { ArrowLeft, Save } from "lucide-react";

export default function YeniFirmaPage() {
  const router = useRouter();
  const { firmaEkle } = useStore();

  const [form, setForm] = useState({
    ad: "",
    vergiNo: "",
    adres: "",
    il: "",
    ilce: "",
    sektor: "",
    telefon: "",
    email: "",
    yetkiliKisi: "",
    calisanSayisi: 0,
    durum: "AKTIF" as GenelDurum,
    notlar: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    firmaEkle(form);
    router.push("/dashboard/firmalar");
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
          <h2 className="text-2xl font-bold tracking-tight">Yeni Firma</h2>
          <p className="text-muted-foreground">Sisteme yeni firma kaydı oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Temel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Firma Adı *</label>
                <Input
                  value={form.ad}
                  onChange={(e) => handleChange("ad", e.target.value)}
                  placeholder="Firma adını giriniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Vergi No *</label>
                <Input
                  value={form.vergiNo}
                  onChange={(e) => handleChange("vergiNo", e.target.value)}
                  placeholder="Vergi numarasını giriniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sektör *</label>
                <Select
                  value={form.sektor}
                  onChange={(e) => handleChange("sektor", e.target.value)}
                  options={SEKTOR_LISTESI.map((s) => ({ value: s, label: s }))}
                  placeholder="Sektör seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Çalışan Sayısı *</label>
                <Input
                  type="number"
                  value={form.calisanSayisi}
                  onChange={(e) => handleChange("calisanSayisi", parseInt(e.target.value) || 0)}
                  placeholder="Çalışan sayısını giriniz"
                  required
                  min={0}
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
                    { value: "BEKLEMEDE", label: "Beklemede" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>

          {/* İletişim Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>İletişim Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Yetkili Kişi *</label>
                <Input
                  value={form.yetkiliKisi}
                  onChange={(e) => handleChange("yetkiliKisi", e.target.value)}
                  placeholder="Yetkili kişi adını giriniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon *</label>
                <Input
                  value={form.telefon}
                  onChange={(e) => handleChange("telefon", e.target.value)}
                  placeholder="Telefon numarası"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-posta *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="E-posta adresi"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">İl *</label>
                <Select
                  value={form.il}
                  onChange={(e) => handleChange("il", e.target.value)}
                  options={ILLER.map((il) => ({ value: il, label: il }))}
                  placeholder="İl seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">İlçe *</label>
                <Input
                  value={form.ilce}
                  onChange={(e) => handleChange("ilce", e.target.value)}
                  placeholder="İlçe giriniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Adres *</label>
                <Input
                  value={form.adres}
                  onChange={(e) => handleChange("adres", e.target.value)}
                  placeholder="Açık adres"
                  required
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
                  placeholder="Firma hakkında notlarınız..."
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
            Firmayı Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
