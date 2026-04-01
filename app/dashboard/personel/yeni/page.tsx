"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { GenelDurum } from "@/types";
import { ArrowLeft, Save } from "lucide-react";

export default function YeniPersonelPage() {
  const router = useRouter();
  const { personelEkle, firmalar } = useStore();

  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    tcKimlik: "",
    telefon: "",
    email: "",
    dogumTarihi: "",
    isegirisTarihi: "",
    pozisyon: "",
    departman: "",
    firmaId: "",
    durum: "AKTIF" as GenelDurum,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    personelEkle(form);
    router.push("/dashboard/personel");
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Yeni Personel</h2>
          <p className="text-muted-foreground">Sisteme yeni personel kaydı oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Kişisel Bilgiler */}
          <Card>
            <CardHeader>
              <CardTitle>Kişisel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Ad *</label>
                  <Input
                    value={form.ad}
                    onChange={(e) => handleChange("ad", e.target.value)}
                    placeholder="Adı giriniz"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Soyad *</label>
                  <Input
                    value={form.soyad}
                    onChange={(e) => handleChange("soyad", e.target.value)}
                    placeholder="Soyadı giriniz"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">TC Kimlik No *</label>
                <Input
                  value={form.tcKimlik}
                  onChange={(e) => handleChange("tcKimlik", e.target.value)}
                  placeholder="11 haneli TC kimlik numarası"
                  maxLength={11}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Doğum Tarihi *</label>
                <Input
                  type="date"
                  value={form.dogumTarihi}
                  onChange={(e) => handleChange("dogumTarihi", e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Telefon *</label>
                <Input
                  value={form.telefon}
                  onChange={(e) => handleChange("telefon", e.target.value)}
                  placeholder="0555 123 4567"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">E-posta *</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="ornek@email.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* İş Bilgileri */}
          <Card>
            <CardHeader>
              <CardTitle>İş Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Firma *</label>
                <Select
                  value={form.firmaId}
                  onChange={(e) => handleChange("firmaId", e.target.value)}
                  options={aktifFirmalar.map((f) => ({ value: f.id, label: f.ad }))}
                  placeholder="Firma seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Pozisyon *</label>
                <Input
                  value={form.pozisyon}
                  onChange={(e) => handleChange("pozisyon", e.target.value)}
                  placeholder="Örn: Muhasebe Uzmanı"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Departman *</label>
                <Input
                  value={form.departman}
                  onChange={(e) => handleChange("departman", e.target.value)}
                  placeholder="Örn: Finans"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">İşe Giriş Tarihi *</label>
                <Input
                  type="date"
                  value={form.isegirisTarihi}
                  onChange={(e) => handleChange("isegirisTarihi", e.target.value)}
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
                    { value: "BEKLEMEDE", label: "Beklemede" },
                  ]}
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
            Personeli Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
