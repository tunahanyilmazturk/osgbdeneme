"use client";

import { useRouter, useParams } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import {
  ArrowLeft,
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Edit,
  FileText,
  Calendar,
  Eye,
  Briefcase,
  Hash,
  Clock,
} from "lucide-react";

export default function FirmaDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { firmalar, randevular, teklifler, taramalar } = useStore();

  const firma = firmalar.find((f) => f.id === params.id);
  if (!firma) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Building2 className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Firma bulunamadı.</p>
        <Button className="mt-4" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Geri Dön
        </Button>
      </div>
    );
  }

  const firmaRandevulari = randevular.filter((r) => r.firmaId === firma.id);
  const firmaTeklifleri = teklifler.filter((t) => t.firmaId === firma.id);
  const firmaTaramalari = taramalar.filter((t) => t.firmaId === firma.id);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">{firma.ad}</h2>
            <Badge className={DURUM_RENKLERI[firma.durum]}>
              {DURUM_ETIKETLERI[firma.durum]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{firma.sektor}</p>
        </div>
        <Button onClick={() => router.push(`/dashboard/firmalar/${firma.id}/duzenle`)}>
          <Edit className="mr-2 h-4 w-4" />
          Düzenle
        </Button>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        <Card className="card-hover cursor-pointer" onClick={() => router.push("/dashboard/personel")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Çalışan Sayısı</p>
                <p className="text-2xl font-bold">{firma.calisanSayisi}</p>
              </div>
              <div className="rounded-xl p-3 bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => router.push("/dashboard/randevular")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Randevu</p>
                <p className="text-2xl font-bold">{firmaRandevulari.length}</p>
              </div>
              <div className="rounded-xl p-3 bg-purple-100 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Calendar className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => router.push("/dashboard/teklifler")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Teklif</p>
                <p className="text-2xl font-bold">{firmaTeklifleri.length}</p>
              </div>
              <div className="rounded-xl p-3 bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                <FileText className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="card-hover cursor-pointer" onClick={() => router.push("/dashboard/taramalar")}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Tarama</p>
                <p className="text-2xl font-bold">{firmaTaramalari.length}</p>
              </div>
              <div className="rounded-xl p-3 bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                <Building2 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Firma Bilgileri */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Firma Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Hash className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Vergi No</p>
                  <p className="font-medium">{firma.vergiNo}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Users className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Yetkili Kişi</p>
                  <p className="font-medium">{firma.yetkiliKisi}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Çalışan Sayısı</p>
                  <p className="font-medium">{firma.calisanSayisi}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Sektör</p>
                  <p className="font-medium">{firma.sektor}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium">{firma.telefon}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">E-posta</p>
                  <p className="font-medium">{firma.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 sm:col-span-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Adres</p>
                  <p className="font-medium">{firma.adres}, {firma.il}, {firma.ilce}</p>
                </div>
              </div>
              {firma.notlar && (
                <div className="sm:col-span-2 rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Notlar</p>
                  <p className="text-sm">{firma.notlar}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kayıt Tarihi */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600 dark:bg-green-950/50 dark:text-green-400">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Kayıt Tarihi</p>
                  <p className="font-semibold">{firma.olusturmaTarihi}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hızlı İşlemler */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => router.push("/dashboard/randevular/yeni")}>
                <Calendar className="mr-2 h-4 w-4" />
                Yeni Randevu Oluştur
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => router.push("/dashboard/teklifler/yeni")}>
                <FileText className="mr-2 h-4 w-4" />
                Yeni Teklif Hazırla
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm" onClick={() => router.push("/dashboard/personel/yeni")}>
                <Users className="mr-2 h-4 w-4" />
                Yeni Personel Ekle
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Son Randevular */}
      {firmaRandevulari.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Son Randevular
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/randevular")}>
                Tümünü Gör
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {firmaRandevulari.slice(0, 5).map((randevu) => (
                <div
                  key={randevu.id}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                      {new Date(randevu.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{randevu.testAdi}</p>
                      <p className="text-xs text-muted-foreground">{randevu.personelAdi || "Personel yok"}</p>
                    </div>
                  </div>
                  <Badge className={DURUM_RENKLERI[randevu.durum]} variant="outline">
                    {DURUM_ETIKETLERI[randevu.durum]}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
