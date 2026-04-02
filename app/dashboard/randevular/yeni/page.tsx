"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRandevuStore, useFirmaStore, useSaglikTestiStore, usePersonelStore } from "@/lib/stores";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { RandevuDurumu } from "@/types";
import {
  ArrowLeft, Save, Clock, Calendar, TestTube2, Building2, Users, Check, ChevronRight, ChevronLeft,
  FileText, Phone, Mail, MapPin, User, Briefcase, Plus, X, Search, Trash2,
} from "lucide-react";

type Adim = 1 | 2 | 3 | 4 | 5;

const ADIMLAR = [
  { no: 1 as Adim, baslik: "Firma", aciklama: "Firma ve personeller" },
  { no: 2 as Adim, baslik: "Test", aciklama: "Sağlık testleri" },
  { no: 3 as Adim, baslik: "Tarih", aciklama: "Tarih ve saat aralığı" },
  { no: 4 as Adim, baslik: "Fiyat", aciklama: "KDV ve indirim" },
  { no: 5 as Adim, baslik: "Açıklama", aciklama: "Tarama metni" },
];

const randevuSuresi: Record<string, number> = { "1": 15, "2": 20, "3": 30, "4": 25, "5": 30 };

const saatAraliklari = ["08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30"];

// Hazır tarama açıklama şablonları
const ACIKLAMA_SABLONLARI = [
  {
    id: "standart",
    baslik: "Standart",
    metin: (firma: any, baslangicTarihi: string, bitisTarihi: string, baslangicSaati: string, bitisSaati: string) => {
      const baslangic = new Date(baslangicTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      const bitis = bitisTarihi !== baslangicTarihi 
        ? new Date(bitisTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
        : null;
      return `Sayın ${firma?.ad || "Firma"} Yetkilisi,\n\n` +
        `${bitis ? baslangic + " - " + bitis : baslangic} tarihinde, ${baslangicSaati} - ${bitisSaati} saatleri arasında ` +
        `periyodik sağlık muayenesi taraması planlanmıştır.\n\n` +
        `Tüm testler, ilgili mevzuat ve standartlar çerçevesinde, uzman sağlık personelimiz tarafından yapılacaktır.\n\n` +
        `Tarama hakkında detaylı bilgi için bizimle iletişime geçebilirsiniz.\n\nSaygılarımızla,`;
    }
  },
  {
    id: "detayli",
    baslik: "Detaylı",
    metin: (firma: any, baslangicTarihi: string, bitisTarihi: string, baslangicSaati: string, bitisSaati: string) => {
      const baslangic = new Date(baslangicTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      const bitis = bitisTarihi !== baslangicTarihi 
        ? new Date(bitisTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
        : null;
      return `Sayın ${firma?.ad || "Firma"} Yetkilisi,\n\n` +
        `Firmamız ${firma?.il || ""} bölge operasyonu kapsamında, ` +
        `${bitis ? baslangic + " - " + bitis + " tarihleri" : baslangic + " tarihi"} ` +
        `için periyodik sağlık muayenesi taramanız onaylanmıştır.\n\n` +
        `Tarama Saatleri: ${baslangicSaati} - ${bitisSaati}\n` +
        `Adres: ${firma?.adres || "Belirtilen adres"}, ${firma?.ilce || ""} ${firma?.il || ""}\n\n` +
        `Çalışanlarınızın sağlık taramaları, 6331 sayılı İş Sağlığı ve Güvenliği Kanunu ` +
        `kapsamında yürütülecektir.\n\n` +
        `Hizmet öncesi hazırlıklarınızı tamamlamanızı rica ederiz.\n\n` +
        `İyi çalışmalar dileriz.\n\nSaygılarımızla,`;
    }
  },
  {
    id: "kisa",
    baslik: "Kısa",
    metin: (firma: any, baslangicTarihi: string, bitisTarihi: string, baslangicSaati: string, bitisSaati: string) => {
      const baslangic = new Date(baslangicTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
      const bitis = bitisTarihi !== baslangicTarihi 
        ? new Date(bitisTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
        : null;
      return `${firma?.ad || "Firma"} - ${bitis ? baslangic + "/" + bitis : baslangic} ` +
        `(${baslangicSaati}-${bitisSaati})\n\n` +
        `Periyodik sağlık muayenesi taraması onaylanmıştır.\n` +
        `Bilgi için teşekkürler.`;
    }
  }
];

export default function YeniRandevuPage() {
  const router = useRouter();
  const { randevuEkle } = useRandevuStore();
  const { firmalar } = useFirmaStore();
  const { saglikTestleri } = useSaglikTestiStore();
  const { personeller: tumPersoneller } = usePersonelStore();

  const [aktifAdim, setAktifAdim] = useState<Adim>(1);
  const [form, setForm] = useState({
    firmaId: "",
    personelIds: [] as string[], // OSGB görevlileri
    testKalemleri: [] as { testId: string; miktar: number; birimFiyat: number }[],
    baslangicTarihi: "",
    bitisTarihi: "",
    baslangicSaati: "",
    bitisSaati: "",
    durum: "BEKLEMEDE" as RandevuDurumu,
    notlar: "",
    kdvOrani: 10, // Varsayılan %10 KDV
    indirimOrani: 0, // Varsayılan %0 indirim
    indirimTutari: 0, // TL cinsinden indirim
  });
  const [personelArama, setPersonelArama] = useState("");
  const [testArama, setTestArama] = useState("");
  const [seciliSablonId, setSeciliSablonId] = useState<string>("standart");

  const aktifFirmalar = firmalar.filter((f) => f.durum === "AKTIF");
  const aktifTestler = saglikTestleri.filter((t) => t.durum === "AKTIF");
  // OSGB personelleri - tüm aktif personeller
  const osgbPersonelleri = tumPersoneller.filter((p) => p.durum === "AKTIF");

  const seciliFirma = aktifFirmalar.find((f) => f.id === form.firmaId);
  const seciliPersoneller = osgbPersonelleri.filter((p) => form.personelIds.includes(p.id));
  const seciliTestler = aktifTestler.filter((t) => form.testKalemleri.some((k) => k.testId === t.id));

  // Fiyat hesaplamaları
  const araToplam = useMemo(() => {
    return form.testKalemleri.reduce((sum, k) => sum + k.miktar * k.birimFiyat, 0);
  }, [form.testKalemleri]);

  const indirimTutariHesapla = useMemo(() => {
    const yuzdeIndirim = araToplam * (form.indirimOrani / 100);
    return yuzdeIndirim + form.indirimTutari;
  }, [araToplam, form.indirimOrani, form.indirimTutari]);

  const kdvTutari = useMemo(() => {
    return (araToplam - indirimTutariHesapla) * (form.kdvOrani / 100);
  }, [araToplam, indirimTutariHesapla, form.kdvOrani]);

  const genelToplam = useMemo(() => {
    return araToplam - indirimTutariHesapla + kdvTutari;
  }, [araToplam, indirimTutariHesapla, kdvTutari]);

  const toplamTutar = araToplam; // Geriye uyumluluk için

  const handleChange = (field: string, value: any) => setForm((prev) => ({ ...prev, [field]: value }));

  // Personel ekle/çıkar
  const togglePersonel = (personelId: string) => {
    setForm((prev) => ({
      ...prev,
      personelIds: prev.personelIds.includes(personelId)
        ? prev.personelIds.filter((id) => id !== personelId)
        : [...prev.personelIds, personelId],
    }));
  };

  // Test ekle (yeni kalem olarak) - firma çalışan sayısı kadar varsayılan miktar
  const testEkle = (test: any) => {
    const varsayilanMiktar = seciliFirma?.calisanSayisi || 1;
    setForm((prev) => ({
      ...prev,
      testKalemleri: [...prev.testKalemleri, { testId: test.id, miktar: varsayilanMiktar, birimFiyat: test.birimFiyat }],
    }));
  };

  // Tüm testlerin miktarını firma çalışan sayısına ayarla
  const tumMiktarlariFirmaCalisanSayisinaAyarla = () => {
    const calisanSayisi = seciliFirma?.calisanSayisi || 1;
    setForm((prev) => ({
      ...prev,
      testKalemleri: prev.testKalemleri.map((k) => ({ ...k, miktar: calisanSayisi })),
    }));
  };

  // Test kaldır
  const testKaldir = (testId: string) => {
    setForm((prev) => ({
      ...prev,
      testKalemleri: prev.testKalemleri.filter((k) => k.testId !== testId),
    }));
  };

  // Kalem güncelle (miktar veya fiyat)
  const kalemGuncelle = (testId: string, field: "miktar" | "birimFiyat", value: number) => {
    setForm((prev) => ({
      ...prev,
      testKalemleri: prev.testKalemleri.map((k) =>
        k.testId === testId ? { ...k, [field]: value } : k
      ),
    }));
  };

  // Tüm OSGB personellerini seç/temizle
  const toggleTumPersoneller = () => {
    const tumIds = osgbPersonelleri.map((p) => p.id);
    const hepsiSecili = tumIds.every((id) => form.personelIds.includes(id));
    setForm((prev) => ({
      ...prev,
      personelIds: hepsiSecili ? [] : tumIds,
    }));
  };

  // Adım validasyonu
  const adimGecerli = (adim: Adim): boolean => {
    switch (adim) {
      case 1: return !!form.firmaId;
      case 2: return form.testKalemleri.length > 0;
      case 3: return !!form.baslangicTarihi && !!form.baslangicSaati && !!form.bitisSaati;
      case 4: return true; // Fiyat adımı her zaman geçerli
      case 5: return true; // Açıklama adımı her zaman geçerli
      default: return true;
    }
  };

  const sonrakiAdim = () => { if (aktifAdim < 5 && adimGecerli(aktifAdim)) setAktifAdim((p) => (p + 1) as Adim); };
  const oncekiAdim = () => { if (aktifAdim > 1) setAktifAdim((p) => (p - 1) as Adim); };

  const handleSubmit = () => {
    const seciliTest = aktifTestler.find((t) => t.id === form.testKalemleri[0]?.testId);
    const seciliPersonel = tumPersoneller.find((p) => p.id === form.personelIds[0]);
    
    randevuEkle(
      {
        firmaId: form.firmaId,
        personelId: form.personelIds[0] || undefined,
        testId: form.testKalemleri[0]?.testId || "",
        tarih: form.baslangicTarihi,
        baslangicSaati: form.baslangicSaati,
        bitisSaati: form.bitisSaati,
        durum: form.durum,
        notlar: form.notlar || otomatikAciklama,
      },
      seciliFirma?.ad,
      seciliTest?.ad,
      seciliPersonel ? `${seciliPersonel.ad} ${seciliPersonel.soyad}` : undefined
    );
    router.push("/dashboard/randevular");
  };

  const durumBadge = (durum: RandevuDurumu) => {
    const styles = {
      BEKLEMEDE: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-300",
      ONAYLANDI: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
      DEVAM_EDIYOR: "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
      TAMAMLANDI: "bg-green-100 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-300",
      IPTAL: "bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300",
    };
    return styles[durum] || styles.BEKLEMEDE;
  };

  // Otomatik açıklama (seçili şablona göre)
  const otomatikAciklama = useMemo(() => {
    const sablon = ACIKLAMA_SABLONLARI.find((s) => s.id === seciliSablonId);
    if (!sablon || !seciliFirma || !form.baslangicTarihi) return "";
    return sablon.metin(
      seciliFirma,
      form.baslangicTarihi,
      form.bitisTarihi || form.baslangicTarihi,
      form.baslangicSaati,
      form.bitisSaati || form.baslangicSaati
    );
  }, [seciliSablonId, seciliFirma, form.baslangicTarihi, form.bitisTarihi, form.baslangicSaati, form.bitisSaati]);

  // Filtrelenmiş personeller (OSGB personelleri)
  const filtrelenmisPersoneller = useMemo(() => {
    if (!personelArama) return osgbPersonelleri;
    const arama = personelArama.toLowerCase();
    return osgbPersonelleri.filter((p: any) =>
      `${p.ad} ${p.soyad}`.toLowerCase().includes(arama) ||
      p.pozisyon.toLowerCase().includes(arama)
    );
  }, [osgbPersonelleri, personelArama]);

  // Filtrelenmiş testler
  const filtrelenmisTestler = useMemo(() => {
    if (!testArama) return aktifTestler;
    const arama = testArama.toLowerCase();
    return aktifTestler.filter((t: any) =>
      t.ad.toLowerCase().includes(arama) ||
      (t.kategoriAdi?.toLowerCase() || "").includes(arama)
    );
  }, [aktifTestler, testArama]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık ve Adım Göstergesi */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6">
        <div className="flex items-center gap-4 shrink-0">
          <Button variant="ghost" size="icon" onClick={() => router.back()}><ArrowLeft className="h-5 w-5" /></Button>
          <div><h2 className="text-2xl font-bold tracking-tight">Yeni Tarama</h2><p className="text-muted-foreground">Adım adım tarama oluşturun</p></div>
        </div>
        <Card className="flex-1">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              {ADIMLAR.map((adim, idx) => (
                <div key={adim.no} className="flex items-center flex-1">
                  <button onClick={() => { if (adim.no < aktifAdim || adimGecerli(aktifAdim)) setAktifAdim(adim.no); }} className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-all ${aktifAdim === adim.no ? "bg-primary text-primary-foreground shadow-lg" : aktifAdim > adim.no ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" : "bg-muted text-muted-foreground"}`}>{aktifAdim > adim.no ? <Check className="h-3.5 w-3.5" /> : adim.no}</button>
                  <div className="ml-2 min-w-0 hidden lg:block"><p className={`text-xs font-medium truncate ${aktifAdim === adim.no ? "text-primary" : "text-muted-foreground"}`}>{adim.baslik}</p></div>
                  {idx < ADIMLAR.length - 1 && <div className={`flex-1 h-0.5 mx-2 rounded ${aktifAdim > adim.no ? "bg-green-300 dark:bg-green-700" : "bg-muted"}`} />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Adım 1: Firma ve Personel Seçimi */}
      {aktifAdim === 1 && (
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] animate-fade-in h-[calc(100vh-280px)]">
          <Card className="card-luxury h-full flex flex-col">
            <CardHeader className="pb-3"><CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Personel Seçimi ({form.personelIds.length} seçili)</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-hidden flex flex-col">
              {form.firmaId ? (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Personel ara..." value={personelArama} onChange={(e) => setPersonelArama(e.target.value)} className="pl-10" /></div>
                    <Button variant="outline" size="sm" onClick={toggleTumPersoneller}>{form.personelIds.length === osgbPersonelleri.length ? "Tümünü Kaldır" : "Tümünü Seç"}</Button>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                    {filtrelenmisPersoneller.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">Personel bulunamadı</p>
                    ) : (
                      filtrelenmisPersoneller.map((personel: any) => {
                        const secili = form.personelIds.includes(personel.id);
                        return (
                          <button key={personel.id} type="button" onClick={() => togglePersonel(personel.id)} className={`w-full rounded-xl border p-3 text-left transition-all ${secili ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                            <div className="flex items-center gap-3">
                              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${secili ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"} font-semibold text-sm`}>{personel.ad.charAt(0)}{personel.soyad.charAt(0)}</div>
                              <div className="flex-1 min-w-0"><p className="font-medium text-sm">{personel.ad} {personel.soyad}</p><p className="text-xs text-muted-foreground">{personel.pozisyon}</p></div>
                              {secili && <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-3 w-3" /></div>}
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center"><Users className="h-12 w-12 text-muted-foreground mb-3" /><p className="text-sm text-muted-foreground">Önce firma seçimi yapmalısınız</p></div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="card-luxury">
              <CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Firma Seçimi</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div><label className="text-sm font-medium">Firma *</label><select value={form.firmaId} onChange={(e) => { handleChange("firmaId", e.target.value); handleChange("personelIds", []); }} className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring" required><option value="">Firma seçiniz</option>{aktifFirmalar.map((f) => (<option key={f.id} value={f.id}>{f.ad}</option>))}</select></div>
                {seciliFirma && (
                  <div className="rounded-xl border bg-muted/30 p-4 space-y-3 animate-fade-in">
                    <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div><div><p className="font-semibold">{seciliFirma.ad}</p><p className="text-xs text-muted-foreground">{seciliFirma.sektor}</p></div></div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground"><div className="flex items-center gap-1.5"><Phone className="h-3 w-3" /><span>{seciliFirma.telefon}</span></div><div className="flex items-center gap-1.5"><Users className="h-3 w-3" /><span>{seciliFirma.calisanSayisi} çalışan</span></div><div className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3 w-3" /><span>{seciliFirma.il}, {seciliFirma.ilce}</span></div></div>
                  </div>
                )}
              </CardContent>
            </Card>

            {seciliPersoneller.length > 0 && (
              <Card className="card-luxury animate-fade-in">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>Seçili Personeller ({seciliPersoneller.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {seciliPersoneller.map((p: any) => (
                      <Badge key={p.id} variant="secondary" className="flex items-center gap-1 pr-1">
                        <span>{p.ad} {p.soyad}</span>
                        <button onClick={() => togglePersonel(p.id)} className="ml-1 rounded-full p-0.5 hover:bg-muted">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Adım 2: Sağlık Testi Seçimi - Teklif stili */}
      {aktifAdim === 2 && (
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] animate-fade-in h-[calc(100vh-280px)]">
          <Card className="card-luxury h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-3 shrink-0"><CardTitle className="text-base flex items-center gap-2"><TestTube2 className="h-4 w-4" />Mevcut Testler</CardTitle></CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="relative"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Test ara..." value={testArama} onChange={(e) => setTestArama(e.target.value)} className="pl-10 h-9" /></div>
              <div className="space-y-1.5">
                {filtrelenmisTestler.length === 0 ? <p className="text-xs text-muted-foreground text-center py-4">Test bulunamadı</p> : filtrelenmisTestler.map((test: any) => {
                  const ekli = form.testKalemleri.some((k) => k.testId === test.id);
                  return (<button key={test.id} type="button" onClick={() => testEkle(test)} disabled={ekli} className={`w-full rounded-lg border p-2.5 text-left hover:border-primary/30 transition-all ${ekli ? "border-primary bg-primary/5 opacity-60" : "border-border"}`}><div className="flex items-center justify-between"><div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{test.ad}</p>{test.kategoriAdi && <p className="text-[10px] text-muted-foreground">{test.kategoriAdi}</p>}</div><div className="flex items-center gap-1.5 ml-2 shrink-0"><span className="text-xs font-semibold">{formatPara(test.birimFiyat)}</span>{ekli && <Check className="h-3.5 w-3.5 text-primary" />}</div></div></button>);
                })}
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury h-full flex flex-col overflow-hidden">
            <CardHeader className="pb-3 shrink-0">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <TestTube2 className="h-4 w-4" />Seçili Testler ({form.testKalemleri.length})
                </CardTitle>
                {form.testKalemleri.length > 0 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => handleChange("testKalemleri", [])}>
                    <Trash2 className="mr-1 h-4 w-4" />Temizle
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-3">
              {form.testKalemleri.length > 0 ? (
                <div className="space-y-3">
                  {form.testKalemleri.map((kalem, idx) => {
                    const test = aktifTestler.find((t) => t.id === kalem.testId);
                    if (!test) return null;
                    return (
                      <div key={kalem.testId} className="rounded-lg border p-3 hover:bg-muted/20 transition-colors animate-fade-in">
                        <div className="flex items-start gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">{idx + 1}</div>
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="font-medium text-sm">{test.ad}</p>
                              <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => testKaldir(kalem.testId)}>
                                <X className="h-3.5 w-3.5 text-destructive" />
                              </Button>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs text-muted-foreground">Miktar (Kişi)</label>
                                <Input 
                                  type="number" 
                                  min={1} 
                                  value={kalem.miktar} 
                                  onChange={(e) => kalemGuncelle(kalem.testId, "miktar", parseInt(e.target.value) || 1)}
                                  className="h-8 text-sm"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Birim Fiyat (₺)</label>
                                <Input 
                                  type="number" 
                                  min={0} 
                                  value={kalem.birimFiyat} 
                                  onChange={(e) => kalemGuncelle(kalem.testId, "birimFiyat", parseFloat(e.target.value) || 0)}
                                  className="h-8 text-sm"
                                />
                              </div>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span className="text-xs text-muted-foreground">Toplam: {formatPara(kalem.miktar * kalem.birimFiyat)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-8 text-center">
                  <TestTube2 className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground">Henüz test seçilmedi</p>
                </div>
              )}
              {form.testKalemleri.length > 0 && (
                <div className="mt-4 rounded-lg bg-muted/50 p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Toplam Test</span>
                    <Badge>{form.testKalemleri.reduce((sum, k) => sum + k.miktar, 0)} kişi</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="font-semibold">{formatPara(araToplam)}</span>
                  </div>
                  {seciliFirma && (
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full mt-2"
                      onClick={tumMiktarlariFirmaCalisanSayisinaAyarla}
                    >
                      Tüm Miktarları Firma Çalışan Sayısına Ayarla ({seciliFirma.calisanSayisi} kişi)
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Adım 3: Tarih ve Saat */}
      {aktifAdim === 3 && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
          <Card className="card-luxury">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />Tarih Aralığı</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><label className="text-sm font-medium">Başlangıç Tarihi *</label><Input type="date" value={form.baslangicTarihi} onChange={(e) => handleChange("baslangicTarihi", e.target.value)} min={new Date().toISOString().split("T")[0]} required /></div>
              <div><label className="text-sm font-medium">Bitiş Tarihi</label><Input type="date" value={form.bitisTarihi} onChange={(e) => handleChange("bitisTarihi", e.target.value)} min={form.baslangicTarihi || new Date().toISOString().split("T")[0]} /></div>
              {form.baslangicTarihi && form.bitisTarihi && form.bitisTarihi !== form.baslangicTarihi && <div className="flex items-center gap-2 text-sm text-muted-foreground"><Calendar className="h-4 w-4" /><span>{Math.ceil((new Date(form.bitisTarihi).getTime() - new Date(form.baslangicTarihi).getTime()) / (1000 * 60 * 60 * 24))} gün sürecek</span></div>}
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5" />Saat Aralığı</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Başlangıç Saati *</label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    type="time" 
                    value={form.baslangicSaati} 
                    onChange={(e) => handleChange("baslangicSaati", e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">{saatAraliklari.map((saat) => (<button key={saat} type="button" onClick={() => handleChange("baslangicSaati", saat)} className={`rounded-lg border p-2 text-center text-sm transition-all ${form.baslangicSaati === saat ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}>{saat}</button>))}</div>
              </div>
              <div>
                <label className="text-sm font-medium">Bitiş Saati *</label>
                <div className="flex gap-2 mb-2">
                  <Input 
                    type="time" 
                    value={form.bitisSaati} 
                    onChange={(e) => handleChange("bitisSaati", e.target.value)}
                    className="flex-1"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">{saatAraliklari.filter(s => s > (form.baslangicSaati || "00:00")).map((saat) => (<button key={saat} type="button" onClick={() => handleChange("bitisSaati", saat)} className={`rounded-lg border p-2 text-center text-sm transition-all ${form.bitisSaati === saat ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}>{saat}</button>))}</div>
              </div>
              <div><label className="text-sm font-medium">Durum</label><div className="grid grid-cols-3 gap-2 mt-2">{["BEKLEMEDE", "ONAYLANDI", "DEVAM_EDIYOR"].map((durum) => (<button key={durum} type="button" onClick={() => handleChange("durum", durum as RandevuDurumu)} className={`rounded-lg border p-2 text-center text-xs font-medium transition-all ${form.durum === durum ? durumBadge(durum as RandevuDurumu) : "border-border hover:border-primary/50"}`}>{durum === "BEKLEMEDE" && "Beklemede"}{durum === "ONAYLANDI" && "Onaylandı"}{durum === "DEVAM_EDIYOR" && "Devam Ediyor"}</button>))}</div></div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Adım 4: Fiyatlandırma (KDV ve İndirim) */}
      {aktifAdim === 4 && (
        <div className="grid gap-6 lg:grid-cols-2 animate-fade-in">
          <Card className="card-luxury">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />İskonto ve KDV Ayarları</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">İskonto Oranı (%)</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={form.indirimOrani} 
                    onChange={(e) => handleChange("indirimOrani", parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Ek İskonto Tutarı (₺)</label>
                <Input 
                  type="number" 
                  min={0}
                  value={form.indirimTutari} 
                  onChange={(e) => handleChange("indirimTutari", parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">KDV Oranı (%)</label>
                <div className="flex items-center gap-2 mt-1">
                  <Input 
                    type="number" 
                    min={0} 
                    max={100}
                    value={form.kdvOrani} 
                    onChange={(e) => handleChange("kdvOrani", parseFloat(e.target.value) || 0)}
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Varsayılan: %10 KDV</p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-luxury">
            <CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Fiyat Özeti</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Ara Toplam</span>
                <span className="font-medium">{formatPara(araToplam)}</span>
              </div>
              {indirimTutariHesapla > 0 && (
                <div className="flex justify-between text-sm text-destructive">
                  <span>İskonto ({form.indirimOrani > 0 ? `%${form.indirimOrani}` : ""}{form.indirimOrani > 0 && form.indirimTutari > 0 ? " + " : ""}${form.indirimTutari > 0 ? formatPara(form.indirimTutari) : ""})</span>
                  <span>-{formatPara(indirimTutariHesapla)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">KDV (%{form.kdvOrani})</span>
                <span className="font-medium">{formatPara(kdvTutari)}</span>
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Genel Toplam</span>
                  <span className="text-2xl font-bold text-primary">{formatPara(genelToplam)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Adım 5: Açıklama ve Özet */}
      {aktifAdim === 5 && seciliFirma && form.testKalemleri.length > 0 && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="card-luxury"><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Firma Bilgileri</CardTitle></CardHeader><CardContent><div className="space-y-3"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div><div><p className="font-semibold">{seciliFirma.ad}</p><p className="text-xs text-muted-foreground">{seciliFirma.sektor}</p></div></div><div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground"><div className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /><span>{seciliFirma.telefon}</span></div><div className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5" /><span>{seciliFirma.calisanSayisi} çalışan</span></div><div className="flex items-center gap-1.5 col-span-2"><MapPin className="h-3.5 w-3.5" /><span>{seciliFirma.il}, {seciliFirma.ilce}</span></div></div></div></CardContent></Card>

            <Card className="card-luxury"><CardHeader><CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Tarama ve Fiyat Detayları</CardTitle></CardHeader><CardContent><div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Tarih</span><span className="font-medium">{form.baslangicTarihi ? new Date(form.baslangicTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" }) : "-"}{form.bitisTarihi && form.bitisTarihi !== form.baslangicTarihi && ` - ${new Date(form.bitisTarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}`}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Saat</span><span className="font-medium">{form.baslangicSaati} - {form.bitisSaati || form.baslangicSaati}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Durum</span><Badge className={durumBadge(form.durum)}>{form.durum === "BEKLEMEDE" && "Beklemede"}{form.durum === "ONAYLANDI" && "Onaylandı"}{form.durum === "DEVAM_EDIYOR" && "Devam Ediyor"}</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">OSGB Personel</span><span className="font-medium">{seciliPersoneller.length > 0 ? `${seciliPersoneller.length} kişi` : "Belirtilmedi"}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Test Sayısı</span><span className="font-medium">{form.testKalemleri.length} adet</span></div>
              <div className="pt-2 border-t">
                <div className="flex justify-between"><span className="text-muted-foreground">Ara Toplam</span><span className="font-medium">{formatPara(araToplam)}</span></div>
                {indirimTutariHesapla > 0 && <div className="flex justify-between text-destructive"><span>İskonto</span><span>-{formatPara(indirimTutariHesapla)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">KDV (%{form.kdvOrani})</span><span className="font-medium">{formatPara(kdvTutari)}</span></div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t"><span className="font-semibold">Genel Toplam</span><span className="text-xl font-bold text-primary">{formatPara(genelToplam)}</span></div>
              </div>
            </div></CardContent></Card>
          </div>

          <Card className="card-luxury"><CardHeader><CardTitle className="flex items-center gap-2"><TestTube2 className="h-5 w-5" />Seçili Testler</CardTitle></CardHeader><CardContent><div className="space-y-2">{form.testKalemleri.map((kalem) => { const test = aktifTestler.find((t) => t.id === kalem.testId); if (!test) return null; return (<div key={kalem.testId} className="flex items-center justify-between py-2 border-b last:border-0"><div className="flex items-center gap-2"><Badge variant="secondary">{kalem.miktar} kişi</Badge><span className="text-sm">{test.ad}</span></div><div className="text-sm text-right"><div>{formatPara(kalem.birimFiyat)} / kişi</div><div className="font-semibold">{formatPara(kalem.miktar * kalem.birimFiyat)}</div></div></div>); })}</div></CardContent></Card>

          <Card className="card-luxury">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />Tarama Açıklaması</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Hazır Şablonlar</label>
                <div className="flex flex-wrap gap-2">
                  {ACIKLAMA_SABLONLARI.map((sablon) => (
                    <button
                      key={sablon.id}
                      type="button"
                      onClick={() => { setSeciliSablonId(sablon.id); handleChange("notlar", ""); }}
                      className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${seciliSablonId === sablon.id ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary/50"}`}
                    >
                      {sablon.baslik}
                    </button>
                  ))}
                </div>
              </div>
              <textarea 
                value={form.notlar || otomatikAciklama} 
                onChange={(e) => handleChange("notlar", e.target.value)} 
                className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring whitespace-pre-line" 
              />
              <p className="text-xs text-muted-foreground">Şablonu seçip metni düzenleyebilir veya kendi metninizi yazabilirsiniz.</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigasyon */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={oncekiAdim} disabled={aktifAdim === 1}><ChevronLeft className="mr-1 h-4 w-4" />Önceki</Button>
        <div className="flex items-center gap-2">{aktifAdim < 5 ? (<Button type="button" onClick={sonrakiAdim} disabled={!adimGecerli(aktifAdim)}>Sonraki<ChevronRight className="ml-1 h-4 w-4" /></Button>) : (<Button type="button" onClick={handleSubmit} className="btn-shine"><Save className="mr-2 h-4 w-4" />Taramayı Kaydet</Button>)}</div>
      </div>
    </div>
  );
}
