"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Settings, User, Moon, Sun, Monitor, Save, Shield, Bell, Palette, 
  Lock, Mail, Phone, Building2, Globe, MapPin, Hash, CheckCircle2,
  AlertCircle, KeyRound, Languages, Clock, History, Trash2, Eye, EyeOff,
  ShieldCheck, Download, UserCog, RotateCcw, Database, HelpCircle, List, Plus, X,
  TestTube2, Users
} from "lucide-react";

type AyarSekme = "profil" | "tercihler" | "sirket" | "guvenlik" | "bildirimler" | "oturumlar" | "veri" | "tanimlar";

const menuler = [
  { id: "profil" as AyarSekme, ikon: User, baslik: "Profil", aciklama: "Kişisel bilgiler" },
  { id: "tercihler" as AyarSekme, ikon: Palette, baslik: "Tercihler", aciklama: "Görünüm & Dil" },
  { id: "sirket" as AyarSekme, ikon: Building2, baslik: "Şirket", aciklama: "Şirket bilgileri" },
  { id: "tanimlar" as AyarSekme, ikon: List, baslik: "Tanımlar", aciklama: "Seçenek yönetimi" },
  { id: "guvenlik" as AyarSekme, ikon: Shield, baslik: "Güvenlik", aciklama: "Şifre & 2FA" },
  { id: "bildirimler" as AyarSekme, ikon: Bell, baslik: "Bildirimler", aciklama: "Bildirim tercihleri" },
  { id: "oturumlar" as AyarSekme, ikon: History, baslik: "Oturumlar", aciklama: "Aktif cihazlar" },
  { id: "veri" as AyarSekme, ikon: Database, baslik: "Veri & Hesap", aciklama: "İşlemler" },
];

export default function AyarlarPage() {
  const { theme, setTheme } = useTheme();
  const { kullanici, testKategorileri, pozisyonlar, sektorler, kategoriEkle, kategoriSil, pozisyonEkle, pozisyonSil, sektorEkle, sektorSil } = useStore();
  const [mounted, setMounted] = useState(false);
  const [kaydedildi, setKaydedildi] = useState(false);
  const [aktifSekme, setAktifSekme] = useState<AyarSekme>("profil");

  const [yeniKategori, setYeniKategori] = useState("");
  const [yeniPozisyon, setYeniPozisyon] = useState("");
  const [yeniSektor, setYeniSektor] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const [profilForm, setProfilForm] = useState({
    ad: kullanici?.ad || "",
    soyad: kullanici?.soyad || "",
    email: kullanici?.email || "",
    telefon: kullanici?.telefon || "",
  });

  const [sirketForm, setSirketForm] = useState({
    sirketAdi: "HanTech OSGB",
    vergiNo: "1234567890",
    adres: "Örnek Mah. Sağlık Cad. No:1 İstanbul",
    telefon: "0212 555 0000",
    email: "info@hantech.com.tr",
    web: "www.hantech.com.tr",
  });

  const [bildirimler, setBildirimler] = useState([
    { id: 1, ad: "Yeni randevu bildirimleri", aciklama: "Yeni randevu oluşturulduğunda bildirim alın", aktif: true },
    { id: 2, ad: "Teklif güncellemeleri", aciklama: "Teklifler kabul/red edildiğinde bildirim alın", aktif: true },
    { id: 3, ad: "Tarama hatırlatıcıları", aciklama: "Yaklaşan taramalar için hatırlatma alın", aktif: true },
    { id: 4, ad: "E-posta bildirimleri", aciklama: "Önemli güncellemeler için e-posta alın", aktif: false },
    { id: 5, ad: "SMS bildirimleri", aciklama: "Acil durumlar için SMS alın", aktif: false },
  ]);

  const [oturumlar, setOturumlar] = useState([
    { id: 1, tarayici: "Chrome / Windows", tarih: "Şimdi", mevcut: true, ip: "192.168.1.9" },
    { id: 2, tarayici: "Safari / macOS", tarih: "2 saat önce", mevcut: false, ip: "192.168.1.12" },
    { id: 3, tarayici: "Firefox / Windows", tarih: "1 gün önce", mevcut: false, ip: "192.168.1.15" },
  ]);

  const handleKaydet = () => {
    setKaydedildi(true);
    setTimeout(() => setKaydedildi(false), 3000);
  };

  const toggleBildirim = (id: number) => {
    setBildirimler(prev => prev.map(b => b.id === id ? { ...b, aktif: !b.aktif } : b));
  };

  const oturumuBitir = (id: number) => {
    setOturumlar(prev => prev.filter(o => o.id !== id));
  };

  const tumOturumlariBitir = () => {
    setOturumlar(prev => prev.filter(o => o.mevcut));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ayarlar</h2>
          <p className="text-muted-foreground">Sistem ve profil ayarlarınızı yönetin</p>
        </div>
      </div>

      {/* Başarı Mesajı */}
      {kaydedildi && (
        <div className="rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-4 flex items-center gap-2 text-green-700 dark:text-green-400 animate-slide-up">
          <CheckCircle2 className="h-5 w-5" />
          <span className="font-medium">Ayarlar başarıyla kaydedildi!</span>
        </div>
      )}

      {/* Layout: Sidebar + İçerik */}
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sol Sidebar Menü */}
        <Card className="card-hover h-fit lg:sticky lg:top-6">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Ayar Kategorileri
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            <nav className="space-y-1">
              {menuler.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setAktifSekme(menu.id)}
                  className={`w-full flex items-center gap-3 rounded-lg p-3 text-left transition-all ${
                    aktifSekme === menu.id
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "hover:bg-accent"
                  }`}
                >
                  <menu.ikon className="h-4 w-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{menu.baslik}</p>
                    <p className={`text-xs truncate ${aktifSekme === menu.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {menu.aciklama}
                    </p>
                  </div>
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Sağ İçerik Alanı */}
        <div className="space-y-6">
          {/* Profil */}
          {aktifSekme === "profil" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Profil Bilgileri</CardTitle>
                    <CardDescription>Kişisel bilgilerinizi güncelleyin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Ad</label>
                    <Input
                      value={profilForm.ad}
                      onChange={(e) => setProfilForm((prev) => ({ ...prev, ad: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Soyad</label>
                    <Input
                      value={profilForm.soyad}
                      onChange={(e) => setProfilForm((prev) => ({ ...prev, soyad: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      value={profilForm.email}
                      onChange={(e) => setProfilForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={profilForm.telefon}
                      onChange={(e) => setProfilForm((prev) => ({ ...prev, telefon: e.target.value }))}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Rol</p>
                  <Badge className="bg-primary text-primary-foreground">
                    <Shield className="mr-1 h-3 w-3" />
                    {kullanici?.rol === "ADMIN" ? "Yönetici" : kullanici?.rol}
                  </Badge>
                </div>
                <Button variant="gradient" className="w-full" onClick={handleKaydet}>
                  <Save className="mr-2 h-4 w-4" />
                  Profili Güncelle
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tercihler */}
          {aktifSekme === "tercihler" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-info text-white">
                    <Palette className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Tercihler</CardTitle>
                    <CardDescription>Görünüm ve dil ayarları</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                {/* Dil */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Languages className="h-4 w-4 text-muted-foreground" />
                    Dil
                  </label>
                  <select className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="tr">Türkçe</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>

                {/* Timezone */}
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Saat Dilimi
                  </label>
                  <select className="w-full rounded-lg border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                    <option value="+3">UTC+3 (İstanbul)</option>
                    <option value="+0">UTC+0 (Londra)</option>
                    <option value="+1">UTC+1 (Berlin)</option>
                  </select>
                </div>

                {/* Tema */}
                {mounted && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tema</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setTheme("light")}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${
                          theme === "light" ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          theme === "light" ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-accent"
                        }`}>
                          <Sun className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">Aydınlık</span>
                      </button>
                      <button
                        onClick={() => setTheme("dark")}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${
                          theme === "dark" ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          theme === "dark" ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-accent"
                        }`}>
                          <Moon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">Karanlık</span>
                      </button>
                      <button
                        onClick={() => setTheme("system")}
                        className={`group flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:border-primary/50 ${
                          theme === "system" ? "border-primary bg-primary/5 shadow-sm" : "border-border"
                        }`}
                      >
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                          theme === "system" ? "bg-primary text-primary-foreground" : "bg-muted group-hover:bg-accent"
                        }`}>
                          <Monitor className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-medium">Sistem</span>
                      </button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Şirket */}
          {aktifSekme === "sirket" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-warning text-white">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Şirket Bilgileri</CardTitle>
                    <CardDescription>OSGB şirket bilgilerinizi yönetin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Şirket Adı</label>
                  <Input
                    value={sirketForm.sirketAdi}
                    onChange={(e) => setSirketForm((prev) => ({ ...prev, sirketAdi: e.target.value }))}
                    className="h-10"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Vergi No</label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      value={sirketForm.vergiNo}
                      onChange={(e) => setSirketForm((prev) => ({ ...prev, vergiNo: e.target.value }))}
                      className="pl-10 h-10"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Adres</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      value={sirketForm.adres}
                      onChange={(e) => setSirketForm((prev) => ({ ...prev, adres: e.target.value }))}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Telefon</label>
                    <Input
                      value={sirketForm.telefon}
                      onChange={(e) => setSirketForm((prev) => ({ ...prev, telefon: e.target.value }))}
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Web</label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={sirketForm.web}
                        onChange={(e) => setSirketForm((prev) => ({ ...prev, web: e.target.value }))}
                        className="pl-10 h-10"
                      />
                    </div>
                  </div>
                </div>
                <Button variant="gradient" className="w-full" onClick={handleKaydet}>
                  <Save className="mr-2 h-4 w-4" />
                  Bilgileri Kaydet
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Tanımlar */}
          {aktifSekme === "tanimlar" && (
            <div className="space-y-6">
              {/* Test Kategorileri */}
              <Card className="card-hover animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-100 text-pink-700 dark:bg-pink-950/50 dark:text-pink-400">
                      <TestTube2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Test Kategorileri</CardTitle>
                      <CardDescription>Sağlık testi kategorilerini yönetin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={yeniKategori}
                      onChange={(e) => setYeniKategori(e.target.value)}
                      placeholder="Yeni kategori adı..."
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && yeniKategori.trim()) {
                          kategoriEkle(yeniKategori.trim());
                          setYeniKategori("");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (yeniKategori.trim()) {
                          kategoriEkle(yeniKategori.trim());
                          setYeniKategori("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {testKategorileri.map((kategori) => (
                      <div
                        key={kategori.id}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm font-medium">{kategori.ad}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => kategoriSil(kategori.id)}
                        >
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pozisyonlar */}
              <Card className="card-hover animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Pozisyonlar</CardTitle>
                      <CardDescription>Çalışan pozisyonlarını yönetin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={yeniPozisyon}
                      onChange={(e) => setYeniPozisyon(e.target.value)}
                      placeholder="Yeni pozisyon adı..."
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && yeniPozisyon.trim()) {
                          pozisyonEkle(yeniPozisyon.trim());
                          setYeniPozisyon("");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (yeniPozisyon.trim()) {
                          pozisyonEkle(yeniPozisyon.trim());
                          setYeniPozisyon("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {pozisyonlar.map((pozisyon, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm font-medium">{pozisyon}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => pozisyonSil(index)}
                        >
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Sektörler */}
              <Card className="card-hover animate-fade-in">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Sektörler</CardTitle>
                      <CardDescription>Firma sektörlerini yönetin</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={yeniSektor}
                      onChange={(e) => setYeniSektor(e.target.value)}
                      placeholder="Yeni sektör adı..."
                      className="h-10"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && yeniSektor.trim()) {
                          sektorEkle(yeniSektor.trim());
                          setYeniSektor("");
                        }
                      }}
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (yeniSektor.trim()) {
                          sektorEkle(yeniSektor.trim());
                          setYeniSektor("");
                        }
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1.5">
                    {sektorler.map((sektor, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm font-medium">{sektor}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => sektorSil(index)}
                        >
                          <X className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Güvenlik */}
          {aktifSekme === "guvenlik" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-danger text-white">
                    <Shield className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Güvenlik</CardTitle>
                    <CardDescription>Şifre ve güvenlik ayarları</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* 2FA */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium">İki Faktörlü Doğrulama</p>
                      <p className="text-sm text-muted-foreground">Hesabınızı ekstra koruma ile güvence altına alın</p>
                    </div>
                  </div>
                  <button className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                    false ? "bg-primary" : "bg-input"
                  }`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                      false ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                <div className="space-y-4 rounded-lg border p-4">
                  <p className="font-medium">Şifre Değiştir</p>
                  <div className="space-y-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="password" placeholder="Mevcut şifre" className="pl-10 h-10" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="password" placeholder="Yeni şifre" className="pl-10 h-10" />
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input type="password" placeholder="Yeni şifre (tekrar)" className="pl-10 h-10" />
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Şifreyi Güncelle
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bildirimler */}
          {aktifSekme === "bildirimler" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-success text-white">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Bildirim Tercihleri</CardTitle>
                    <CardDescription>Hangi durumlarda bildirim almak istediğinizi belirleyin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {bildirimler.map((bildirim) => (
                    <div
                      key={bildirim.id}
                      className="flex items-center justify-between rounded-xl border p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{bildirim.ad}</p>
                        <p className="text-sm text-muted-foreground">{bildirim.aciklama}</p>
                      </div>
                      <button
                        onClick={() => toggleBildirim(bildirim.id)}
                        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                          bildirim.aktif ? "bg-primary" : "bg-input"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            bildirim.aktif ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Oturumlar */}
          {aktifSekme === "oturumlar" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400">
                      <History className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle>Aktif Oturumlar</CardTitle>
                      <CardDescription>Giriş yapmış cihazlarınızı görün</CardDescription>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={tumOturumlariBitir}>
                    <RotateCcw className="mr-2 h-3 w-3" />
                    Tümünü Bitir
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {oturumlar.map((oturum) => (
                    <div
                      key={oturum.id}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          oturum.mevcut ? "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400" : "bg-muted"
                        }`}>
                          <Globe className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{oturum.tarayici}</p>
                          <p className="text-sm text-muted-foreground">{oturum.ip} • {oturum.tarih}</p>
                        </div>
                      </div>
                      {oturum.mevcut ? (
                        <Badge variant="outline">Mevcut</Badge>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => oturumuBitir(oturum.id)}>
                          <EyeOff className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Veri & Hesap */}
          {aktifSekme === "veri" && (
            <Card className="card-hover animate-fade-in">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    <Database className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle>Veri ve Hesap</CardTitle>
                    <CardDescription>Verilerinizi dışa aktarın veya hesabınızı yönetin</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <Download className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Verileri Dışa Aktar</p>
                      <p className="text-xs text-muted-foreground">Tüm verilerinizi JSON formatında indirin</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-4">
                    <UserCog className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Hesabı Dondur</p>
                      <p className="text-xs text-muted-foreground">Hesabınızı geçici olarak dondurun</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-4 border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/50">
                    <Trash2 className="mr-3 h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Hesabı Sil</p>
                      <p className="text-xs text-muted-foreground">Hesabınızı kalıcı olarak silin</p>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
