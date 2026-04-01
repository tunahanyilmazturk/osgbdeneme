"use client";

import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Users,
  Calendar,
  TrendingUp,
  Clock,
  ArrowRight,
  Activity,
  FileText,
  TestTube2,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { firmalar, personeller, randevular, taramalar, teklifler, saglikTestleri } = useStore();

  const bekleyenRandevular = randevular.filter((r) => r.durum === "BEKLEMEDE").length;
  const bugunRandevular = randevular.filter((r) => {
    const bugun = new Date().toISOString().split("T")[0];
    return r.tarih === bugun;
  }).length;
  const toplamGelir = teklifler
    .filter((t) => t.durum === "KABUL_EDİLDİ")
    .reduce((sum, t) => sum + t.genelToplam, 0);

  const stats = [
    {
      baslik: "Toplam Firma",
      deger: firmalar.length,
      alt: `${firmalar.filter((f) => f.durum === "AKTIF").length} aktif`,
      ikon: Building2,
      gradient: "gradient-primary",
      statClass: "stat-card-blue",
    },
    {
      baslik: "Personel",
      deger: personeller.length,
      alt: `${personeller.filter((p) => p.durum === "AKTIF").length} aktif`,
      ikon: Users,
      gradient: "gradient-success",
      statClass: "stat-card-green",
    },
    {
      baslik: "Randevular",
      deger: randevular.length,
      alt: `${bekleyenRandevular} bekleyen`,
      ikon: Calendar,
      gradient: "gradient-info",
      statClass: "stat-card-cyan",
    },
    {
      baslik: "Taramalar",
      deger: taramalar.length,
      alt: `${taramalar.filter((t) => t.durum === "DEVAM_EDIYOR").length} devam eden`,
      ikon: Activity,
      gradient: "gradient-warning",
      statClass: "stat-card-orange",
    },
    {
      baslik: "Teklifler",
      deger: teklifler.length,
      alt: `${teklifler.filter((t) => t.durum === "TASLAK").length} taslak`,
      ikon: FileText,
      gradient: "gradient-danger",
      statClass: "stat-card-purple",
    },
    {
      baslik: "Toplam Gelir",
      deger: formatPara(toplamGelir),
      alt: "Kabul edilen teklifler",
      ikon: TrendingUp,
      gradient: "gradient-success",
      statClass: "stat-card-green",
    },
  ];

  const sonRandevular = [...randevular].reverse().slice(0, 5);
  const sonTaramalar = [...taramalar].reverse().slice(0, 5);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              Hoş Geldiniz 👋
            </h2>
            <p className="mt-1 text-muted-foreground">
              İş gücü sağlığı ve güvenliği yönetim panelinize genel bakış
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="text-sm py-1">
              <Clock className="mr-1 h-3 w-3" />
              {new Date().toLocaleDateString("tr-TR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Badge>
          </div>
        </div>
      </div>

      {/* İstatistik Kartları */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
        {stats.map((stat) => (
          <Card key={stat.baslik} className={`card-hover stat-card ${stat.statClass}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.baslik}
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {stat.deger}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.alt}</p>
                </div>
                <div className={`rounded-xl p-3 text-white ${stat.gradient}`}>
                  <stat.ikon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* İki Sütunlu İçerik */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Son Randevular */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Son Randevular
              </CardTitle>
              <Link href="/dashboard/randevular">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sonRandevular.length === 0 ? (
              <div className="empty-state py-8">
                <div className="empty-state-icon">
                  <Calendar className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">Henüz randevu yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sonRandevular.map((randevu) => (
                  <div
                    key={randevu.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <TestTube2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {randevu.firmaAdi}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {randevu.testAdi} - {randevu.tarih}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        randevu.durum === "TAMAMLANDI"
                          ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                          : randevu.durum === "BEKLEMEDE"
                          ? "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                          : "border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-400"
                      }
                    >
                      {randevu.durum === "TAMAMLANDI" && "Tamamlandı"}
                      {randevu.durum === "BEKLEMEDE" && "Beklemede"}
                      {randevu.durum === "ONAYLANDI" && "Onaylandı"}
                      {randevu.durum === "DEVAM_EDIYOR" && "Devam Ediyor"}
                      {randevu.durum === "IPTAL" && "İptal"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Son Taramalar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Son Taramalar
              </CardTitle>
              <Link href="/dashboard/taramalar">
                <Button variant="ghost" size="sm">
                  Tümünü Gör
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {sonTaramalar.length === 0 ? (
              <div className="empty-state py-8">
                <div className="empty-state-icon">
                  <Activity className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">Henüz tarama yok</p>
              </div>
            ) : (
              <div className="space-y-3">
                {sonTaramalar.map((tarama) => (
                  <div
                    key={tarama.id}
                    className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-accent/50"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400">
                      <Activity className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{tarama.ad}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {tarama.firmaAdi} - {tarama.planlananTarih}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        tarama.durum === "TAMAMLANDI"
                          ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400"
                          : tarama.durum === "DEVAM_EDIYOR"
                          ? "border-purple-200 text-purple-700 dark:border-purple-800 dark:text-purple-400"
                          : "border-yellow-200 text-yellow-700 dark:border-yellow-800 dark:text-yellow-400"
                      }
                    >
                      {tarama.durum === "PLANLANDI" && "Planlandı"}
                      {tarama.durum === "DEVAM_EDIYOR" && "Devam Ediyor"}
                      {tarama.durum === "TAMAMLANDI" && "Tamamlandı"}
                      {tarama.durum === "IPTAL" && "İptal"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Hızlı İşlemler */}
      <Card>
        <CardHeader>
          <CardTitle>Hızlı İşlemler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/firmalar/yeni">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 card-hover">
                <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm">Yeni Firma</span>
              </Button>
            </Link>
            <Link href="/dashboard/personel/yeni">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 card-hover">
                <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm">Yeni Personel</span>
              </Button>
            </Link>
            <Link href="/dashboard/randevular/yeni">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 card-hover">
                <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm">Yeni Randevu</span>
              </Button>
            </Link>
            <Link href="/dashboard/teklifler/yeni">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 card-hover">
                <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm">Yeni Teklif</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
