"use client";

import { useDashboardStats, useSonAktiviteler } from "@/lib/hooks";
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
  const stats = useDashboardStats();
  const { sonRandevular, sonTaramalar } = useSonAktiviteler(5);

  const statCards = [
    {
      baslik: "Toplam Firma",
      deger: stats.firmaSayisi,
      alt: `${stats.aktifFirmaSayisi} aktif`,
      ikon: Building2,
      gradient: "gradient-primary",
      statClass: "stat-card-blue",
    },
    {
      baslik: "Personel",
      deger: stats.personelSayisi,
      alt: `${stats.aktifPersonelSayisi} aktif`,
      ikon: Users,
      gradient: "gradient-success",
      statClass: "stat-card-green",
    },
    {
      baslik: "Taramalar",
      deger: stats.randevuSayisi,
      alt: `${stats.bekleyenRandevuSayisi} bekleyen`,
      ikon: Calendar,
      gradient: "gradient-info",
      statClass: "stat-card-cyan",
    },
    {
      baslik: "Taramalar",
      deger: stats.taramaSayisi,
      alt: `${stats.devamEdenTaramaSayisi} devam eden`,
      ikon: Activity,
      gradient: "gradient-warning",
      statClass: "stat-card-orange",
    },
    {
      baslik: "Teklifler",
      deger: stats.teklifSayisi,
      alt: `${stats.taslakTeklifSayisi} taslak`,
      ikon: FileText,
      gradient: "gradient-danger",
      statClass: "stat-card-purple",
    },
    {
      baslik: "Toplam Gelir",
      deger: formatPara(stats.toplamGelir),
      alt: "Kabul edilen teklifler",
      ikon: TrendingUp,
      gradient: "gradient-success",
      statClass: "stat-card-green",
    },
  ];

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
        {statCards.map((stat, idx) => (
          <Card key={stat.baslik} className={`card-luxury stat-card ${stat.statClass} group overflow-hidden`}>
            <CardContent className="p-6 relative">
              {/* Decorative gradient circle */}
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="flex items-center justify-between relative">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.baslik}
                  </p>
                  <p className="text-2xl font-bold tracking-tight count-animation">
                    {stat.deger}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.alt}</p>
                </div>
                <div className={`rounded-xl p-3 text-white ${stat.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.ikon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* İki Sütunlu İçerik */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Son Taramalar */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Son Taramalar
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
      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Hızlı İşlemler
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href="/dashboard/firmalar/yeni" className="group">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 btn-shine hover-lift border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600">
                <div className="rounded-lg p-2 bg-blue-100 dark:bg-blue-950 group-hover:bg-blue-200 dark:group-hover:bg-blue-900 transition-colors">
                  <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-medium">Yeni Firma</span>
              </Button>
            </Link>
            <Link href="/dashboard/personel/yeni" className="group">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 btn-shine hover-lift border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600">
                <div className="rounded-lg p-2 bg-green-100 dark:bg-green-950 group-hover:bg-green-200 dark:group-hover:bg-green-900 transition-colors">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-medium">Yeni Personel</span>
              </Button>
            </Link>
            <Link href="/dashboard/randevular/yeni" className="group">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 btn-shine hover-lift border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600">
                <div className="rounded-lg p-2 bg-purple-100 dark:bg-purple-950 group-hover:bg-purple-200 dark:group-hover:bg-purple-900 transition-colors">
                  <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-medium">Yeni Tarama</span>
              </Button>
            </Link>
            <Link href="/dashboard/teklifler/yeni" className="group">
              <Button variant="outline" className="w-full h-auto py-4 flex-col gap-2 btn-shine hover-lift border-orange-200 dark:border-orange-800 hover:border-orange-400 dark:hover:border-orange-600">
                <div className="rounded-lg p-2 bg-orange-100 dark:bg-orange-950 group-hover:bg-orange-200 dark:group-hover:bg-orange-900 transition-colors">
                  <FileText className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-medium">Yeni Teklif</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
