"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Download,
  FileText,
  Building2,
  Users,
  Calendar,
  TrendingUp,
  ClipboardList,
  ArrowUpRight,
  Activity,
  PieChart,
  Target,
  Zap,
  CalendarDays,
  Filter,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  PieChart as RechartsPie,
  Pie,
  Cell,
  Legend,
  ComposedChart,
  Line,
} from "recharts";

const aylikVeri = [
  { ay: "Oca", firma: 3, personel: 15, randevu: 12, gelir: 25000, gider: 18000 },
  { ay: "Şub", firma: 5, personel: 22, randevu: 19, gelir: 38000, gider: 22000 },
  { ay: "Mar", firma: 4, personel: 18, randevu: 15, gelir: 31000, gider: 20000 },
  { ay: "Nis", firma: 6, personel: 28, randevu: 22, gelir: 45000, gider: 28000 },
  { ay: "May", firma: 5, personel: 24, randevu: 18, gelir: 40000, gider: 25000 },
  { ay: "Haz", firma: 8, personel: 35, randevu: 25, gelir: 52000, gider: 30000 },
];

const durumRenkleri = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"];

const PIE_COLORS = ["#3b82f6", "#22c55e", "#8b5cf6", "#f59e0b", "#ef4444"];

export default function RaporlarPage() {
  const { firmalar, personeller, randevular, taramalar, teklifler, saglikTestleri } = useStore();
  const [donem, setDonem] = useState<"aylik" | "haftalik" | "yillik">("aylik");

  const toplamGelir = teklifler.filter((t) => t.durum === "KABUL_EDİLDİ").reduce((sum, t) => sum + t.genelToplam, 0);
  const aktifFirma = firmalar.filter((f) => f.durum === "AKTIF").length;
  const tamamlananRandevu = randevular.filter((r) => r.durum === "TAMAMLANDI").length;
  const aktifPersonel = personeller.filter((p) => p.durum === "AKTIF").length;

  // Özet kartlar
  const ozetKartlari = [
    {
      baslik: "Toplam Gelir",
      deger: formatPara(toplamGelir),
      degisim: "+12.5%",
      yuksek: true,
      ikon: TrendingUp,
      gradient: "gradient-success",
      aciklama: "Son aya göre",
    },
    {
      baslik: "Aktif Firma",
      deger: String(aktifFirma),
      degisim: `${firmalar.length} toplam`,
      yuksek: null,
      ikon: Building2,
      gradient: "gradient-primary",
      aciklama: "Kayıtlı firma",
    },
    {
      baslik: "Personel",
      deger: String(aktifPersonel),
      degisim: `${personeller.length} toplam`,
      yuksek: null,
      ikon: Users,
      gradient: "gradient-info",
      aciklama: "Aktif personel",
    },
    {
      baslik: "Tamamlanan",
      deger: String(tamamlananRandevu),
      degisim: `${randevular.length} toplam`,
      yuksek: null,
      ikon: Target,
      gradient: "gradient-warning",
      aciklama: "Randevu & tarama",
    },
  ];

  // Rapor kartları
  const raporKartlari = [
    {
      baslik: "Firma Raporu",
      aciklama: `${firmalar.length} firma, ${aktifFirma} aktif`,
      ikon: Building2,
      gradient: "gradient-primary",
      istatistik: `${Math.round((aktifFirma / Math.max(firmalar.length, 1)) * 100)}% aktif`,
    },
    {
      baslik: "Personel Raporu",
      aciklama: `${personeller.length} kayıtlı personel`,
      ikon: Users,
      gradient: "gradient-success",
      istatistik: `${aktifPersonel} aktif`,
    },
    {
      baslik: "Randevu Raporu",
      aciklama: `${tamamlananRandevu} / ${randevular.length} tamamlandı`,
      ikon: Calendar,
      gradient: "gradient-info",
      istatistik: `${randevular.filter((r) => r.durum === "BEKLEMEDE").length} bekleyen`,
    },
    {
      baslik: "Tarama Raporu",
      aciklama: `${taramalar.length} tarama`,
      ikon: ClipboardList,
      gradient: "gradient-warning",
      istatistik: `${taramalar.filter((t) => t.durum === "DEVAM_EDIYOR").length} devam ediyor`,
    },
    {
      baslik: "Gelir Raporu",
      aciklama: formatPara(toplamGelir),
      ikon: TrendingUp,
      gradient: "gradient-success",
      istatistik: `${teklifler.filter((t) => t.durum === "KABUL_EDİLDİ").length} kabul`,
    },
    {
      baslik: "Test Raporu",
      aciklama: `${saglikTestleri.length} aktif test`,
      ikon: FileText,
      gradient: "gradient-danger",
      istatistik: `${saglikTestleri.filter((t) => t.durum === "AKTIF").length} aktif`,
    },
  ];

  // Pie chart verisi
  const pieVeri = [
    { name: "Firmalar", value: firmalar.length || 1 },
    { name: "Personel", value: personeller.length || 1 },
    { name: "Randevular", value: randevular.length || 1 },
    { name: "Taramalar", value: taramalar.length || 1 },
    { name: "Testler", value: saglikTestleri.length || 1 },
  ];

  // Gelir/Gider tablosu
  const tabloVeri = aylikVeri.map((v) => ({
    ...v,
    kar: v.gelir - v.gider,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Raporlar</h2>
            <p className="text-muted-foreground">Detaylı raporlar ve istatistikler</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg bg-muted p-1">
              {(["haftalik", "aylik", "yillik"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDonem(d)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                    donem === d ? "bg-background shadow-sm" : "text-muted-foreground"
                  }`}
                >
                  {d === "haftalik" ? "Haftalık" : d === "aylik" ? "Aylık" : "Yıllık"}
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-3 w-3" />
              PDF İndir
            </Button>
          </div>
        </div>
      </div>

      {/* Özet Kartlar */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
        {ozetKartlari.map((kart) => (
          <Card key={kart.baslik} className="card-hover relative overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground font-medium">{kart.baslik}</p>
                  <p className="text-2xl font-bold mt-1">{kart.deger}</p>
                  <div className="flex items-center gap-1 mt-2">
                    {kart.yuksek === true && (
                      <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-950/50 dark:text-green-400">
                        ↑ {kart.degisim}
                      </span>
                    )}
                    {kart.yuksek === null && (
                      <span className="text-[10px] text-muted-foreground">{kart.degisim}</span>
                    )}
                  </div>
                </div>
                <div className={`rounded-xl p-3 text-white ${kart.gradient}`}>
                  <kart.ikon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Grafikler - İlk Satır */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Gelir Trendi */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base">
                <TrendingUp className="h-5 w-5 text-primary" />
                Gelir & Gider Trendi
              </CardTitle>
              <Badge variant="outline" className="text-[10px]">Son 6 Ay</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={aylikVeri}>
                <defs>
                  <linearGradient id="gelirGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="ay" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                  formatter={(value, name) => [formatPara(Number(value) || 0), name === "gelir" ? "Gelir" : "Gider"]}
                />
                <Area type="monotone" dataKey="gelir" fill="url(#gelirGrad)" stroke="#3b82f6" strokeWidth={2.5} name="gelir" />
                <Line type="monotone" dataKey="gider" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="gider" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Dağılım Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <PieChart className="h-5 w-5 text-primary" />
              Kayıt Dağılımı
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RechartsPie>
                <Pie
                  data={pieVeri}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieVeri.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value) => <span className="text-xs">{value}</span>}
                />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Grafikler - İkinci Satır */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Aylık İstatistikler */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-5 w-5 text-primary" />
              Aylık Operasyonel İstatistikler
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={aylikVeri} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="ay" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar dataKey="firma" name="Firma" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="personel" name="Personel" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="randevu" name="Randevu" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gelir Tablosu */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Activity className="h-5 w-5 text-primary" />
              Aylık Gelir/Gider Tablosu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-medium text-xs">Ay</th>
                    <th className="text-right p-3 font-medium text-xs">Gelir</th>
                    <th className="text-right p-3 font-medium text-xs">Gider</th>
                    <th className="text-right p-3 font-medium text-xs">Kar</th>
                  </tr>
                </thead>
                <tbody>
                  {tabloVeri.map((satir) => (
                    <tr key={satir.ay} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-medium">{satir.ay}</td>
                      <td className="p-3 text-right text-green-600 dark:text-green-400">{formatPara(satir.gelir)}</td>
                      <td className="p-3 text-right text-red-600 dark:text-red-400">{formatPara(satir.gider)}</td>
                      <td className="p-3 text-right">
                        <Badge variant="outline" className={satir.kar >= 0 ? "border-green-200 text-green-700 dark:border-green-800 dark:text-green-400" : "border-red-200 text-red-700"}>
                          {formatPara(satir.kar)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 font-semibold bg-muted/30">
                    <td className="p-3">Toplam</td>
                    <td className="p-3 text-right text-green-600 dark:text-green-400">
                      {formatPara(tabloVeri.reduce((s, t) => s + t.gelir, 0))}
                    </td>
                    <td className="p-3 text-right text-red-600 dark:text-red-400">
                      {formatPara(tabloVeri.reduce((s, t) => s + t.gider, 0))}
                    </td>
                    <td className="p-3 text-right">
                      {formatPara(tabloVeri.reduce((s, t) => s + t.kar, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rapor Kartları */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detaylı Raporlar</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
          {raporKartlari.map((rapor) => (
            <Card key={rapor.baslik} className="card-hover group cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`rounded-xl p-3 text-white ${rapor.gradient}`}>
                    <rapor.ikon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{rapor.baslik}</CardTitle>
                      <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm font-medium mt-1">{rapor.aciklama}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rapor.istatistik}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4 group-hover:border-primary/30">
                  <Download className="mr-2 h-3 w-3" />
                  Rapor İndir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
