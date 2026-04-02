"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTeklifStore, useFirmaStore, useSaglikTestiStore } from "@/lib/stores";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { TeklifDurumu, TeklifKalemi } from "@/types";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  FileText,
  Calculator,
  Search,
  Building2,
  Phone,
  Mail,
  Users,
  Package,
  X,
  Check,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  TrendingUp,
  Eye,
  MapPin,
  Hash,
  Calendar,
  Clock,
  TestTube2,
} from "lucide-react";

type Adim = 1 | 2 | 3 | 4;

const GECERLILIK_SECENEKLERI = [
  { gun: 15, etiket: "15 Gün" },
  { gun: 30, etiket: "30 Gün" },
  { gun: 45, etiket: "45 Gün" },
  { gun: 60, etiket: "60 Gün" },
  { gun: 90, etiket: "90 Gün" },
];

const TEST_SABLONLARI = [
  { ad: "Temel Sağlık Paketi", aciklama: "Rutin muayene testleri", testler: ["Tam Kan Sayımı", "Fizik Muayene"] },
  { ad: "Kapsamlı Sağlık Paketi", aciklama: "Detaylı sağlık taraması", testler: ["Tam Kan Sayımı", "Fizik Muayene", "Akciğer Grafisi", "İşitme Testi"] },
  { ad: "Solunum Paketi", aciklama: "Solunum fonksiyon testleri", testler: ["Akciğer Grafisi", "Akciğer Fonksiyon Testi"] },
];

const ADIMLAR = [
  { no: 1 as Adim, baslik: "Firma", aciklama: "Firma ve geçerlilik" },
  { no: 2 as Adim, baslik: "Hizmetler", aciklama: "Test seçimi" },
  { no: 3 as Adim, baslik: "Fiyatlandırma", aciklama: "İndirim ve KDV" },
  { no: 4 as Adim, baslik: "Önizleme", aciklama: "Kontrol ve kaydet" },
];

function onYaziOlustur(firma: any, kalemler: TeklifKalemi[], genelToplam: number): string {
  if (!firma) return "";
  const testListesi = kalemler.map((k) => k.testAdi).join(", ");
  const tarih = new Date().toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  return `Sayın ${firma.ad} Yetkilisi,\n\n${tarih} tarihli bu teklifimiz, firmamız ${firma.calisanSayisi} çalışanı için hazırlanmış periyodik sağlık muayenesi hizmetlerini kapsamaktadır.\n\nTeklifimiz kapsamında; ${testListesi} hizmetleri sunulacaktır. Tüm testler, ilgili mevzuat ve standartlar çerçevesinde, uzman sağlık personelimiz tarafından gerçekleştirilecektir.\n\nToplam teklif tutarı ${formatPara(genelToplam)} olup, geçerlilik süresi boyunca sabit kalacaktır.\n\nİş birliğiniz için teşekkür eder, sağlıklı günler dileriz.`;
}

export default function YeniTeklifPage() {
  const router = useRouter();
  const { teklifEkle } = useTeklifStore();
  const { firmalar } = useFirmaStore();
  const { saglikTestleri } = useSaglikTestiStore();

  const [aktifAdim, setAktifAdim] = useState<Adim>(1);
  const [form, setForm] = useState({ firmaId: "", durum: "TASLAK" as TeklifDurumu, gecerlilikTarihi: "", notlar: "", kdvYuzde: 10 });
  const [kalemler, setKalemler] = useState<TeklifKalemi[]>([]);
  const [testArama, setTestArama] = useState("");
  const [topluIndirim, setTopluIndirim] = useState(0);
  const [showSablonlar, setShowSablonlar] = useState(false);
  const [secilenKategori, setSecilenKategori] = useState("");

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const aktifTestler = saglikTestleri.filter((t) => t.durum === "AKTIF");
  const seciliFirma = aktifFirmalar.find((f) => f.id === form.firmaId);

  const mevcutTestIds = kalemler.map((k) => k.testId);
  const uygunTestler = aktifTestler.filter((t) =>
    !mevcutTestIds.includes(t.id) &&
    (t.ad.toLowerCase().includes(testArama.toLowerCase()) || t.kategoriAdi?.toLowerCase().includes(testArama.toLowerCase())) &&
    (!secilenKategori || t.kategoriId === secilenKategori)
  );

  const kategoriler = useMemo(() => {
    const unique = [...new Set(aktifTestler.map((t) => t.kategoriId))];
    return unique.map((id) => { const test = aktifTestler.find((t) => t.kategoriId === id); return { id, ad: test?.kategoriAdi || id }; });
  }, [aktifTestler]);

  const hesaplamalar = useMemo(() => {
    const araToplam = kalemler.reduce((sum, k) => sum + k.toplam, 0);
    const toplamIndirim = araToplam * (topluIndirim / 100);
    const indirimSonrasi = araToplam - toplamIndirim;
    const kdvTutar = indirimSonrasi * (form.kdvYuzde / 100);
    return { araToplam, toplamIndirim, indirimSonrasi, kdvTutar, genelToplam: indirimSonrasi + kdvTutar };
  }, [kalemler, topluIndirim, form.kdvYuzde]);

  useEffect(() => {
    if (seciliFirma && !form.gecerlilikTarihi) {
      const tarih = new Date();
      tarih.setDate(tarih.getDate() + 30);
      setForm((prev) => ({ ...prev, gecerlilikTarihi: tarih.toISOString().split("T")[0] }));
    }
  }, [seciliFirma]);

  const adimGecerli = (adim: Adim) => adim === 1 ? !!form.firmaId && !!form.gecerlilikTarihi : adim === 2 ? kalemler.length > 0 : true;
  const sonrakiAdim = () => { if (aktifAdim < 4 && adimGecerli(aktifAdim)) setAktifAdim((p) => (p + 1) as Adim); };
  const oncekiAdim = () => { if (aktifAdim > 1) setAktifAdim((p) => (p - 1) as Adim); };

  const gecerlilikAyarla = (gun: number) => {
    const tarih = new Date();
    tarih.setDate(tarih.getDate() + gun);
    setForm((prev) => ({ ...prev, gecerlilikTarihi: tarih.toISOString().split("T")[0] }));
  };

  const testEkle = (test: any) => {
    if (!seciliFirma) return;
    const miktar = seciliFirma.calisanSayisi || 1;
    setKalemler((prev) => [...prev, { id: Math.random().toString(36).substring(2, 15), testId: test.id, testAdi: test.ad, miktar, birimFiyat: test.birimFiyat, indirimYuzde: 0, toplam: Math.round(miktar * test.birimFiyat * 100) / 100 }]);
  };

  const kalemSil = (id: string) => setKalemler((prev) => prev.filter((k) => k.id !== id));

  const kalemGuncelle = (id: string, alan: string, deger: number) => {
    setKalemler((prev) => prev.map((k) => {
      if (k.id !== id) return k;
      const g = { ...k, [alan]: deger };
      g.toplam = Math.round(g.miktar * g.birimFiyat * (1 - g.indirimYuzde / 100) * 100) / 100;
      return g;
    }));
  };

  const sablonUygula = (sablonAd: string) => {
    const sablon = TEST_SABLONLARI.find((s) => s.ad === sablonAd);
    if (!sablon) return;
    sablon.testler.forEach((testAd) => { const test = aktifTestler.find((t) => t.ad === testAd); if (test && !mevcutTestIds.includes(test.id)) testEkle(test); });
    setShowSablonlar(false);
  };

  const handleSubmit = () => {
    teklifEkle({ ...form, kalemler, araToplam: hesaplamalar.araToplam, kdvYuzde: form.kdvYuzde, kdvTutar: hesaplamalar.kdvTutar, genelToplam: hesaplamalar.genelToplam, notlar: form.notlar || onYaziOlustur(seciliFirma, kalemler, hesaplamalar.genelToplam) });
    router.push("/dashboard/teklifler");
  };

  const otomatikOnYazi = useMemo(() => onYaziOlustur(seciliFirma, kalemler, hesaplamalar.genelToplam), [seciliFirma, kalemler, hesaplamalar.genelToplam]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div><h2 className="text-2xl font-bold tracking-tight">Yeni Fiyat Teklifi</h2><p className="text-muted-foreground">Adım adım teklif oluşturun</p></div>
        </div>
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              {ADIMLAR.map((adim, idx) => (
                <div key={adim.no} className="flex items-center flex-1">
                  <button onClick={() => { if (adim.no < aktifAdim || adimGecerli(aktifAdim)) setAktifAdim(adim.no); }} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${aktifAdim === adim.no ? "bg-primary text-primary-foreground shadow-lg" : aktifAdim > adim.no ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>
                    {aktifAdim > adim.no ? <Check className="h-3.5 w-3.5" /> : adim.no}
                  </button>
                  <div className="ml-2 min-w-0 hidden lg:block"><p className={`text-xs font-medium truncate ${aktifAdim === adim.no ? "text-primary" : "text-muted-foreground"}`}>{adim.baslik}</p></div>
                  {idx < ADIMLAR.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${aktifAdim > adim.no ? "bg-green-300 dark:bg-green-700" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {aktifAdim === 1 && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Firma Bilgileri</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Firma *</label><Select value={form.firmaId} onChange={(e) => setForm((p) => ({ ...p, firmaId: e.target.value }))} options={aktifFirmalar.map((f) => ({ value: f.id, label: f.ad }))} placeholder="Firma seçiniz" required /></div>
              {seciliFirma && <div className="rounded-lg border bg-muted/30 p-4 space-y-3 animate-fade-in"><div className="flex items-center gap-2"><div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary"><Building2 className="h-4 w-4" /></div><div><p className="font-medium">{seciliFirma.ad}</p><p className="text-xs text-muted-foreground">{seciliFirma.sektor}</p></div></div><div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground"><div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><span>{seciliFirma.telefon}</span></div><div className="flex items-center gap-1.5"><Users className="h-3 w-3" /><span>{seciliFirma.calisanSayisi} çalışan</span></div><div className="flex items-center gap-1.5 col-span-2"><Mail className="h-3 w-3" /><span>{seciliFirma.email}</span></div><div className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3 w-3" /><span>{seciliFirma.il}, {seciliFirma.ilce}</span></div><div className="flex items-center gap-1.5"><Hash className="h-3 w-3" /><span>Vergi No: {seciliFirma.vergiNo}</span></div></div></div>}
            </CardContent>
          </Card>
          <div className="space-y-6">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Geçerlilik Tarihi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-2">{GECERLILIK_SECENEKLERI.map((s) => (<button key={s.gun} type="button" onClick={() => gecerlilikAyarla(s.gun)} className={`rounded-lg border p-3 text-center transition-all hover:border-primary/50 ${(() => { const t = new Date(); t.setDate(t.getDate() + s.gun); return form.gecerlilikTarihi === t.toISOString().split("T")[0]; })() ? "border-primary bg-primary/5" : "border-border"}`}><p className="text-sm font-medium">{s.etiket}</p></button>))}</div>
                <div><label className="text-sm font-medium">Özel Tarih</label><Input type="date" value={form.gecerlilikTarihi} onChange={(e) => setForm((p) => ({ ...p, gecerlilikTarihi: e.target.value }))} min={new Date().toISOString().split("T")[0]} /></div>
                {form.gecerlilikTarihi && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" /><span>{new Date(form.gecerlilikTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })} tarihine kadar geçerli</span></div>}
              </CardContent>
            </Card>
            <Card><CardHeader><CardTitle>Teklif Ayarları</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium">KDV Oranı (%)</label><Input type="number" value={form.kdvYuzde} onChange={(e) => setForm((p) => ({ ...p, kdvYuzde: parseFloat(e.target.value) || 0 }))} min={0} max={100} step={1} /></div>
                <div><label className="text-sm font-medium">Durum</label><Select value={form.durum} onChange={(e) => setForm((p) => ({ ...p, durum: e.target.value as TeklifDurumu }))} options={[{ value: "TASLAK", label: "Taslak" }, { value: "GÖNDERİLDİ", label: "Gönderildi" }]} /></div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {aktifAdim === 2 && (
        <div className="animate-fade-in" style={{ height: "calc(100vh - 280px)" }}>
          <div className="grid gap-6 lg:grid-cols-[320px_1fr] h-full">
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-3 shrink-0"><CardTitle className="text-base flex items-center gap-2"><TestTube2 className="h-4 w-4" />Mevcut Testler</CardTitle></CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3 pr-1">
                <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Test ara..." value={testArama} onChange={(e) => setTestArama(e.target.value)} className="pl-10 h-9" /></div>
                <select value={secilenKategori} onChange={(e) => setSecilenKategori(e.target.value)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"><option value="">Tüm Kategoriler</option>{kategoriler.map((k) => (<option key={k.id} value={k.id}>{k.ad}</option>))}</select>
                <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => setShowSablonlar(!showSablonlar)} disabled={aktifTestler.length === 0}><Package className="mr-1 h-4 w-4" />Paket Şablonları</Button>
                {showSablonlar && <div className="space-y-2 animate-fade-in">{TEST_SABLONLARI.map((sablon) => { const uygun = sablon.testler.filter((t) => aktifTestler.some((at) => at.ad === t && !mevcutTestIds.includes(at.id))).length; return (<button key={sablon.ad} type="button" onClick={() => sablonUygula(sablon.ad)} disabled={uygun === 0} className="w-full rounded-lg border p-2.5 text-left hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"><div className="flex items-center gap-1.5 mb-0.5"><Sparkles className="h-3 w-3 text-amber-500" /><p className="text-xs font-medium">{sablon.ad}</p></div><p className="text-[10px] text-muted-foreground">{uygun} test eklenecek</p></button>); })}</div>}
                <div className="space-y-1.5">
                  {uygunTestler.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">{mevcutTestIds.length === aktifTestler.length ? "Tüm testler eklendi" : "Test bulunamadı"}</p> : uygunTestler.map((test) => (<button key={test.id} type="button" onClick={() => testEkle(test)} className="w-full rounded-lg border p-2.5 text-left hover:bg-accent hover:border-primary/30 transition-all group"><div className="flex items-center justify-between"><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{test.ad}</p><p className="text-[10px] text-muted-foreground">{test.kategoriAdi}</p></div><div className="flex items-center gap-1.5 ml-2 shrink-0"><span className="text-xs font-semibold">{formatPara(test.birimFiyat)}</span><Plus className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" /></div></div></button>))}
                </div>
              </CardContent>
            </Card>
            <Card className="h-full flex flex-col overflow-hidden">
              <CardHeader className="pb-3 shrink-0"><div className="flex items-center justify-between"><CardTitle className="text-base flex items-center gap-2"><Calculator className="h-4 w-4" />Teklif İçeriği ({kalemler.length})</CardTitle>{kalemler.length > 0 && <Button type="button" variant="ghost" size="sm" onClick={() => { if (confirm("Tüm kalemleri silmek istediğinize emin misiniz?")) { setKalemler([]); setTopluIndirim(0); } }}><Trash2 className="mr-1 h-4 w-4" />Temizle</Button>}</div></CardHeader>
              <CardContent className="flex-1 overflow-y-auto space-y-3">
                {kalemler.length > 0 ? (<div className="space-y-2">{kalemler.map((kalem, idx) => (<div key={kalem.id} className="rounded-lg border p-3 hover:bg-muted/20 transition-colors animate-fade-in"><div className="flex items-start gap-3"><div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{idx + 1}</div><div className="flex-1 min-w-0 space-y-2"><div className="flex items-center justify-between"><p className="font-medium text-sm">{kalem.testAdi}</p><Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => kalemSil(kalem.id)}><X className="h-3.5 w-3.5 text-destructive" /></Button></div><div className="grid grid-cols-3 gap-2"><div><label className="text-[10px] text-muted-foreground">Miktar</label><Input type="number" value={kalem.miktar} onChange={(e) => kalemGuncelle(kalem.id, "miktar", parseInt(e.target.value) || 1)} className="h-7 text-sm" min={1} /></div><div><label className="text-[10px] text-muted-foreground">Birim Fiyat</label><Input type="number" value={kalem.birimFiyat} onChange={(e) => kalemGuncelle(kalem.id, "birimFiyat", parseFloat(e.target.value) || 0)} className="h-7 text-sm" min={0} step={0.01} /></div><div><label className="text-[10px] text-muted-foreground">İndirim %</label><Input type="number" value={kalem.indirimYuzde} onChange={(e) => kalemGuncelle(kalem.id, "indirimYuzde", Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} className="h-7 text-sm" min={0} max={100} /></div></div><div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{kalem.miktar} × {formatPara(kalem.birimFiyat)}{kalem.indirimYuzde > 0 && ` - %${kalem.indirimYuzde} indirim`}</span><span className="font-bold text-sm">{formatPara(kalem.toplam)}</span></div></div></div></div>))}</div>) : (<div className="rounded-lg border border-dashed p-8 text-center"><Calculator className="mx-auto h-10 w-10 text-muted-foreground mb-3" /><p className="text-muted-foreground">Henüz test eklenmedi.</p><p className="text-xs text-muted-foreground mt-1">Soldaki listeden testlere tıklayarak ekleyin</p></div>)}
                {kalemler.length > 0 && <div className="space-y-2 rounded-lg bg-muted/50 p-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Ara Toplam</span><span>{formatPara(hesaplamalar.araToplam)}</span></div>{topluIndirim > 0 && <div className="flex justify-between text-sm text-green-600"><span>Genel İndirim (%{topluIndirim})</span><span>-{formatPara(hesaplamalar.toplamIndirim)}</span></div>}<div className="flex justify-between text-sm"><span className="text-muted-foreground">KDV (%{form.kdvYuzde})</span><span>{formatPara(hesaplamalar.kdvTutar)}</span></div><div className="border-t pt-2 flex justify-between items-center"><span className="font-bold">Genel Toplam</span><span className="text-2xl font-bold text-primary">{formatPara(hesaplamalar.genelToplam)}</span></div></div>}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {aktifAdim === 3 && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Fiyatlandırma Ayarları</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Genel İndirim (%)</label><Input type="number" value={topluIndirim} onChange={(e) => setTopluIndirim(Math.min(100, Math.max(0, parseInt(e.target.value) || 0)))} min={0} max={100} /><p className="text-xs text-muted-foreground mt-1">Tüm kalemlerin toplamına uygulanacak indirim</p></div>
              <div><label className="text-sm font-medium">KDV Oranı (%)</label><Input type="number" value={form.kdvYuzde} onChange={(e) => setForm((p) => ({ ...p, kdvYuzde: parseFloat(e.target.value) || 0 }))} min={0} max={100} step={1} /></div>
              <div className="rounded-lg border p-3 space-y-2"><p className="text-sm font-medium">Kalem Özeti ({kalemler.length})</p>{kalemler.map((k, idx) => (<div key={k.id} className="flex items-center justify-between text-sm"><span className="truncate">{idx + 1}. {k.testAdi}</span><span className="font-medium ml-2">{formatPara(k.toplam)}</span></div>))}</div>
            </CardContent>
          </Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" />Hesaplama Özeti</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">Ara Toplam</span><span className="font-medium">{formatPara(hesaplamalar.araToplam)}</span></div>
              {topluIndirim > 0 && <div className="flex justify-between text-sm text-green-600"><span>Genel İndirim (%{topluIndirim})</span><span>-{formatPara(hesaplamalar.toplamIndirim)}</span></div>}
              {topluIndirim > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">İndirim Sonrası</span><span>{formatPara(hesaplamalar.indirimSonrasi)}</span></div>}
              <div className="flex justify-between text-sm"><span className="text-muted-foreground">KDV (%{form.kdvYuzde})</span><span>{formatPara(hesaplamalar.kdvTutar)}</span></div>
              <div className="border-t pt-3 flex justify-between items-center"><span className="font-bold text-lg">Genel Toplam</span><span className="text-3xl font-bold text-primary">{formatPara(hesaplamalar.genelToplam)}</span></div>
            </CardContent>
          </Card>
        </div>
      )}

      {aktifAdim === 4 && seciliFirma && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Firma Bilgileri</CardTitle></CardHeader><CardContent><div className="space-y-2"><p className="font-semibold text-lg">{seciliFirma.ad}</p><p className="text-sm text-muted-foreground">{seciliFirma.sektor}</p><div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground"><div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /><span>{seciliFirma.telefon}</span></div><div className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /><span>{seciliFirma.email}</span></div><div className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /><span>{seciliFirma.il}, {seciliFirma.ilce}</span></div><div className="flex items-center gap-1.5"><Hash className="h-3.5 w-3.5" /><span>Vergi No: {seciliFirma.vergiNo}</span></div></div></div></CardContent></Card>
            <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Teklif Bilgileri</CardTitle></CardHeader><CardContent><div className="space-y-2 text-sm"><div className="flex justify-between"><span className="text-muted-foreground">Durum</span><Badge>{form.durum === "TASLAK" ? "Taslak" : "Gönderildi"}</Badge></div><div className="flex justify-between"><span className="text-muted-foreground">Geçerlilik</span><span className="font-medium">{form.gecerlilikTarihi}</span></div><div className="flex justify-between"><span className="text-muted-foreground">KDV Oranı</span><span className="font-medium">%{form.kdvYuzde}</span></div><div className="flex justify-between"><span className="text-muted-foreground">Kalem Sayısı</span><span className="font-medium">{kalemler.length}</span></div></div></CardContent></Card>
          </div>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Teklif Ön Yazısı</CardTitle></CardHeader><CardContent><textarea value={form.notlar || otomatikOnYazi} onChange={(e) => setForm((p) => ({ ...p, notlar: e.target.value }))} className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-pre-line" /><p className="text-xs text-muted-foreground mt-2">Otomatik oluşturulan metni düzenleyebilirsiniz.</p></CardContent></Card>
          <Card><CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-5 w-5" />Teklif Kalemleri</CardTitle></CardHeader><CardContent><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b bg-muted/50"><th className="p-3 text-left font-medium">#</th><th className="p-3 text-left font-medium">Test</th><th className="p-3 text-right font-medium">Miktar</th><th className="p-3 text-right font-medium">Birim Fiyat</th><th className="p-3 text-right font-medium">İndirim</th><th className="p-3 text-right font-medium">Toplam</th></tr></thead><tbody>{kalemler.map((k, idx) => (<tr key={k.id} className="border-b last:border-0"><td className="p-3 text-muted-foreground">{idx + 1}</td><td className="p-3 font-medium">{k.testAdi}</td><td className="p-3 text-right">{k.miktar}</td><td className="p-3 text-right">{formatPara(k.birimFiyat)}</td><td className="p-3 text-right">%{k.indirimYuzde}</td><td className="p-3 text-right font-semibold">{formatPara(k.toplam)}</td></tr>))}</tbody></table></div><div className="mt-4 space-y-2 rounded-lg bg-muted/50 p-4"><div className="flex justify-between text-sm"><span className="text-muted-foreground">Ara Toplam</span><span>{formatPara(hesaplamalar.araToplam)}</span></div>{topluIndirim > 0 && <div className="flex justify-between text-sm text-green-600"><span>Genel İndirim (%{topluIndirim})</span><span>-{formatPara(hesaplamalar.toplamIndirim)}</span></div>}<div className="flex justify-between text-sm"><span className="text-muted-foreground">KDV (%{form.kdvYuzde})</span><span>{formatPara(hesaplamalar.kdvTutar)}</span></div><div className="border-t pt-2 flex justify-between items-center"><span className="font-bold text-lg">Genel Toplam</span><span className="text-3xl font-bold text-primary">{formatPara(hesaplamalar.genelToplam)}</span></div></div></CardContent></Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={oncekiAdim} disabled={aktifAdim === 1}><ChevronLeft className="mr-1 h-4 w-4" />Önceki</Button>
        <div className="flex items-center gap-2">
          {aktifAdim < 4 ? <Button type="button" onClick={sonrakiAdim} disabled={!adimGecerli(aktifAdim)}>Sonraki<ChevronRight className="ml-1 h-4 w-4" /></Button> : <Button type="button" onClick={handleSubmit}><Save className="mr-2 h-4 w-4" />Teklifi Kaydet</Button>}
        </div>
      </div>
    </div>
  );
}
