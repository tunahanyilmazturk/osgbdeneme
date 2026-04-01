"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Shield,
  Heart,
  CheckCircle2,
  Building2,
  Users,
  TestTube2,
  Stethoscope,
  ArrowRight,
  UserPlus,
  User,
  Phone,
  KeyRound,
  ChevronLeft,
  Sparkles,
} from "lucide-react";

const ozellikler = [
  { ikon: Building2, metin: "Firma & Personel Yönetimi", aciklama: "Tüm firmalarınızı tek yerden yönetin" },
  { ikon: TestTube2, metin: "Sağlık Testi Planlama", aciklama: "Periyodik testleri otomatik planlayın" },
  { ikon: Shield, metin: "OSGB Uyumlu Raporlama", aciklama: "Resmi raporları anında oluşturun" },
  { ikon: Users, metin: "Toplu Tarama İşlemleri", aciklama: "Yüzlerce personeli tek seferde tarayın" },
];

function sifreGucuHesapla(sifre: string): { skor: number; seviye: string; renk: string; genislik: string } {
  if (!sifre) return { skor: 0, seviye: "", renk: "", genislik: "0%" };
  
  let skor = 0;
  if (sifre.length >= 6) skor++;
  if (sifre.length >= 10) skor++;
  if (/[a-z]/.test(sifre) && /[A-Z]/.test(sifre)) skor++;
  if (/[0-9]/.test(sifre)) skor++;
  if (/[^a-zA-Z0-9]/.test(sifre)) skor++;

  const seviyeler = [
    { seviye: "Çok Zayıf", renk: "bg-red-500", genislik: "20%" },
    { seviye: "Zayıf", renk: "bg-orange-500", genislik: "40%" },
    { seviye: "Orta", renk: "bg-yellow-500", genislik: "60%" },
    { seviye: "Güçlü", renk: "bg-green-500", genislik: "80%" },
    { seviye: "Çok Güçlü", renk: "bg-emerald-500", genislik: "100%" },
  ];

  const idx = Math.min(skor, 5) - 1;
  if (idx < 0) return { skor: 0, seviye: "", renk: "", genislik: "0%" };
  return { skor, ...seviyeler[idx] };
}

export default function GirisPage() {
  const router = useRouter();
  const { girisYap } = useStore();
  const [aktifTab, setAktifTab] = useState<"giris" | "kayit">("giris");
  const [form, setForm] = useState({ email: "", sifre: "" });
  const [kayitForm, setKayitForm] = useState({ ad: "", soyad: "", email: "", telefon: "", sifre: "", sifreTekrar: "" });
  const [sifreGoster, setSifreGoster] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState("");

  const sifreGucu = useMemo(() => sifreGucuHesapla(aktifTab === "kayit" ? kayitForm.sifre : form.sifre), [aktifTab === "kayit" ? kayitForm.sifre : form.sifre]);

  const handleGiris = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");
    setYukleniyor(true);

    try {
      const basarili = await girisYap(form.email, form.sifre);
      if (basarili) {
        router.push("/dashboard");
      } else {
        setHata("E-posta veya şifre hatalı");
      }
    } catch {
      setHata("Giriş yapılırken bir hata oluştu");
    } finally {
      setYukleniyor(false);
    }
  };

  const handleKayit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHata("");

    if (kayitForm.sifre !== kayitForm.sifreTekrar) {
      setHata("Şifreler eşleşmiyor");
      return;
    }
    if (kayitForm.sifre.length < 6) {
      setHata("Şifre en az 6 karakter olmalıdır");
      return;
    }

    setYukleniyor(true);
    await new Promise((r) => setTimeout(r, 1500));
    setYukleniyor(false);
    setBasarili("Hesabınız oluşturuldu! Giriş yapabilirsiniz.");
    setAktifTab("giris");
    setForm({ email: kayitForm.email, sifre: "" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Sol Panel - Dekoratif */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700">
        {/* Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-[10%] left-[10%] w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-[15%] right-[10%] w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-300/10 rounded-full blur-2xl animate-float" style={{ animationDelay: "2s" }} />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "32px 32px"
          }} />
        </div>

        {/* İçerik */}
        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm border border-white/10">
              <Stethoscope className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-bold block">HanTech</span>
              <span className="text-xs text-white/60 font-medium tracking-wider uppercase">OSGB Yönetim</span>
            </div>
          </div>

          {/* Orta içerik */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-1.5 text-sm">
                <Sparkles className="h-4 w-4 text-yellow-300" />
                <span className="text-white/90">v2.0 - Yeni Özellikler</span>
              </div>
              <h1 className="text-4xl xl:text-5xl font-bold leading-tight">
                İş Gücü Sağlığı
                <br />
                ve Güvenliği
                <br />
                <span className="bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent">
                  Tek Platformda
                </span>
              </h1>
              <p className="text-lg text-white/70 max-w-md leading-relaxed">
                Firmalarınızı, personelinizi ve sağlık süreçlerinizi 
                kolayca yönetin. Hızlı, güvenli ve modern.
              </p>
            </div>

            {/* Özellikler */}
            <div className="space-y-3">
              {ozellikler.map((ozellik, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] p-4 hover:bg-white/[0.12] transition-colors animate-slide-in-left"
                  style={{ animationDelay: `${i * 120}ms`, animationFillMode: "both" }}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15">
                    <ozellik.ikon className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-white font-semibold text-sm">{ozellik.metin}</span>
                    <p className="text-white/50 text-xs mt-0.5">{ozellik.aciklama}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Alt bilgi */}
          <div className="flex items-center justify-between text-white/40 text-sm">
            <div className="flex items-center gap-2">
              <span>© 2026 HanTech</span>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-white/70 transition-colors">Gizlilik</a>
              <a href="#" className="hover:text-white/70 transition-colors">Kullanım</a>
              <a href="#" className="hover:text-white/70 transition-colors">İletişim</a>
            </div>
          </div>
        </div>
      </div>

      {/* Sağ Panel - Giriş/Kayıt Formu */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Mobil Logo */}
          <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg mb-3 animate-float">
              <Stethoscope className="h-8 w-8" />
            </div>
            <h1 className="text-2xl font-bold">HanTech OSGB</h1>
            <p className="text-muted-foreground text-sm">Yönetim Paneli</p>
          </div>

          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-muted p-1 mb-8">
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                aktifTab === "giris" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => { setAktifTab("giris"); setHata(""); setBasarili(""); }}
            >
              <Shield className="inline-block mr-2 h-4 w-4" />
              Giriş Yap
            </button>
            <button
              className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                aktifTab === "kayit" 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => { setAktifTab("kayit"); setHata(""); setBasarili(""); }}
            >
              <UserPlus className="inline-block mr-2 h-4 w-4" />
              Kayıt Ol
            </button>
          </div>

          {/* Mesajlar */}
          {hata && (
            <div className="mb-4 rounded-xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive flex items-center gap-2 animate-slide-up">
              <div className="h-2 w-2 rounded-full bg-destructive shrink-0" />
              {hata}
            </div>
          )}
          {basarili && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30 p-4 text-sm text-green-700 dark:text-green-400 flex items-center gap-2 animate-slide-up">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              {basarili}
            </div>
          )}

          {/* Giriş Formu */}
          {aktifTab === "giris" && (
            <div className="animate-fade-in" key="giris">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Hoş Geldiniz</h2>
                <p className="text-muted-foreground mt-1">Hesabınıza giriş yapın</p>
              </div>

              <form onSubmit={handleGiris} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-posta Adresi</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="ornek@sirket.com"
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-11 h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Şifre</label>
                    <button type="button" className="text-xs text-primary hover:underline">Şifremi Unuttum</button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={sifreGoster ? "text" : "password"}
                      placeholder="•••••••••"
                      value={form.sifre}
                      onChange={(e) => setForm((prev) => ({ ...prev, sifre: e.target.value }))}
                      className="pl-11 pr-11 h-12 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSifreGoster(!sifreGoster)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Parola gücü */}
                  {form.sifre && (
                    <div className="space-y-1.5 animate-slide-up">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${sifreGucu.renk}`}
                          style={{ width: sifreGucu.genislik }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Parola gücü: <span className="font-medium">{sifreGucu.seviye}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="h-4 w-4 rounded accent-primary" />
                  <label htmlFor="remember" className="text-sm text-muted-foreground">Beni hatırla</label>
                </div>

                <Button type="submit" variant="gradient" className="w-full h-12 rounded-xl text-base font-semibold" disabled={yukleniyor}>
                  {yukleniyor ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Giriş yapılıyor...
                    </>
                  ) : (
                    <>
                      Giriş Yap
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                {/* Sosyal Giriş */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground">veya</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="h-11 rounded-xl">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="h-11 rounded-xl">
                    <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.913 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
                    </svg>
                    Apple
                  </Button>
                </div>
              </form>

              {/* Demo */}
              <Card className="mt-6 border-dashed bg-muted/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">Demo Giriş</span>
                  </div>
                  <button
                    className="w-full rounded-lg bg-background p-3 text-left hover:bg-accent transition-colors cursor-pointer flex items-center justify-between"
                    onClick={() => setForm({ email: "admin@hantech.com", sifre: "admin123" })}
                  >
                    <div>
                      <p className="text-xs font-mono text-primary">admin@hantech.com</p>
                      <p className="text-xs font-mono text-muted-foreground">admin123</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </button>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Kayıt Formu */}
          {aktifTab === "kayit" && (
            <div className="animate-fade-in" key="kayit">
              <div className="mb-6">
                <h2 className="text-2xl font-bold">Hesap Oluşturun</h2>
                <p className="text-muted-foreground mt-1">Ücretsiz hesabınızı oluşturun</p>
              </div>

              <form onSubmit={handleKayit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Ad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Adınız"
                        value={kayitForm.ad}
                        onChange={(e) => setKayitForm((prev) => ({ ...prev, ad: e.target.value }))}
                        className="pl-10 h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Soyad</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Soyadınız"
                        value={kayitForm.soyad}
                        onChange={(e) => setKayitForm((prev) => ({ ...prev, soyad: e.target.value }))}
                        className="pl-10 h-11 rounded-xl"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">E-posta</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="ornek@sirket.com"
                      value={kayitForm.email}
                      onChange={(e) => setKayitForm((prev) => ({ ...prev, email: e.target.value }))}
                      className="pl-11 h-11 rounded-xl"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Telefon</label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="0 (5XX) XXX XX XX"
                      value={kayitForm.telefon}
                      onChange={(e) => setKayitForm((prev) => ({ ...prev, telefon: e.target.value }))}
                      className="pl-11 h-11 rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Şifre</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type={sifreGoster ? "text" : "password"}
                      placeholder="En az 6 karakter"
                      value={kayitForm.sifre}
                      onChange={(e) => setKayitForm((prev) => ({ ...prev, sifre: e.target.value }))}
                      className="pl-11 pr-11 h-11 rounded-xl"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setSifreGoster(!sifreGoster)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {sifreGoster ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {/* Parola gücü */}
                  {kayitForm.sifre && (
                    <div className="space-y-1.5 animate-slide-up">
                      <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${sifreGucu.renk}`}
                          style={{ width: sifreGucu.genislik }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Parola gücü: <span className="font-medium">{sifreGucu.seviye}</span>
                      </p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Şifre Tekrar</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Şifrenizi tekrar girin"
                      value={kayitForm.sifreTekrar}
                      onChange={(e) => setKayitForm((prev) => ({ ...prev, sifreTekrar: e.target.value }))}
                      className="pl-11 h-11 rounded-xl"
                      required
                    />
                  </div>
                  {kayitForm.sifreTekrar && kayitForm.sifre !== kayitForm.sifreTekrar && (
                    <p className="text-xs text-destructive animate-slide-up">Şifreler eşleşmiyor</p>
                  )}
                  {kayitForm.sifreTekrar && kayitForm.sifre === kayitForm.sifreTekrar && (
                    <p className="text-xs text-green-600 flex items-center gap-1 animate-slide-up">
                      <CheckCircle2 className="h-3 w-3" /> Şifreler eşleşiyor
                    </p>
                  )}
                </div>

                <div className="flex items-start gap-2 pt-1">
                  <input type="checkbox" id="terms" className="h-4 w-4 rounded accent-primary mt-0.5" required />
                  <label htmlFor="terms" className="text-xs text-muted-foreground leading-relaxed">
                    <a href="#" className="text-primary hover:underline">Kullanım Koşulları</a> ve{" "}
                    <a href="#" className="text-primary hover:underline">Gizlilik Politikası</a>
                    {"'nı kabul ediyorum."}
                  </label>
                </div>

                <Button type="submit" variant="gradient" className="w-full h-12 rounded-xl text-base font-semibold" disabled={yukleniyor}>
                  {yukleniyor ? (
                    <>
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Hesap oluşturuluyor...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Hesap Oluştur
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center gap-1">
              <span>Made with</span>
              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
              <span>by HanTech Team</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
