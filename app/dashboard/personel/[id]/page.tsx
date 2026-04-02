"use client";

import { useRouter, useParams } from "next/navigation";
import { usePersonelStore } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import {
  ArrowLeft,
  Users,
  Phone,
  Mail,
  Calendar,
  Briefcase,
} from "lucide-react";

export default function PersonelDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { personeller } = usePersonelStore();

  const personel = personeller.find((p) => p.id === params.id);
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

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight">
              {personel.ad} {personel.soyad}
            </h2>
            <Badge className={DURUM_RENKLERI[personel.durum]}>
              {DURUM_ETIKETLERI[personel.durum]}
            </Badge>
          </div>
          <p className="text-muted-foreground">{personel.pozisyon}</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Kişisel Bilgiler */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Kişisel Bilgiler</CardTitle>
              <Button variant="outline" size="sm" onClick={() => router.push(`/dashboard/personel/${personel.id}/duzenle`)}>
                Düzenle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Doğum Tarihi</p>
                  <p className="font-medium">{personel.dogumTarihi}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Telefon</p>
                  <p className="font-medium">{personel.telefon}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">E-posta</p>
                  <p className="font-medium">{personel.email || "-"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* İş Bilgileri */}
        <div className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Briefcase className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="text-sm text-muted-foreground">Pozisyon</p>
                  <p className="font-semibold">{personel.pozisyon}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Calendar className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                <div>
                  <p className="text-sm text-muted-foreground">İşe Giriş</p>
                  <p className="font-semibold">{personel.isegirisTarihi || "-"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
