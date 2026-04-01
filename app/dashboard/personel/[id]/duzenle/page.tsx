"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { GenelDurum } from "@/types";
import { ArrowLeft, Save, Users } from "lucide-react";

export default function PersonelDuzenlePage() {
  const router = useRouter();
  const params = useParams();
  const { personeller, personelGuncelle, pozisyonlar } = useStore();

  const personel = personeller.find((p) => p.id === params.id);

  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    telefon: "",
    email: "",
    dogumTarihi: "",
    isegirisTarihi: "",
    pozisyon: "",
    durum: "AKTIF" as GenelDurum,
  });

  useEffect(() => {
    if (personel) {
      setForm({
        ad: personel.ad,
        soyad: personel.soyad,
        telefon: personel.telefon,
        email: personel.email || "",
        dogumTarihi: personel.dogumTarihi,
        isegirisTarihi: personel.isegirisTarihi || "",
        pozisyon: personel.pozisyon,
        durum: personel.durum,
      });
    }
  }, [personel]);

  if (!personel) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Users className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Çalışan bulunamadı.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    personelGuncelle(personel.id, {
      ad: form.ad,
      soyad: form.soyad,
      telefon: form.telefon,
      email: form.email || undefined,
      dogumTarihi: form.dogumTarihi,
      isegirisTarihi: form.isegirisTarihi || undefined,
      pozisyon: form.pozisyon,
      durum: form.durum,
    });
    router.push(`/dashboard/personel/${personel.id}`);
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Çalışan Düzenle</h2>
          <p className="text-muted-foreground">{personel.ad} {personel.soyad} bilgilerini güncelleyin</p>
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
                <label className="text-sm font-medium">E-posta</label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="ornek@email.com"
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
                <label className="text-sm font-medium">Pozisyon *</label>
                <Select
                  value={form.pozisyon}
                  onChange={(e) => handleChange("pozisyon", e.target.value)}
                  options={pozisyonlar.map((p) => ({ value: p, label: p }))}
                  placeholder="Pozisyon seçiniz"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">İşe Giriş Tarihi</label>
                <Input
                  type="date"
                  value={form.isegirisTarihi}
                  onChange={(e) => handleChange("isegirisTarihi", e.target.value)}
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
            Değişiklikleri Kaydet
          </Button>
        </div>
      </form>
    </div>
  );
}
