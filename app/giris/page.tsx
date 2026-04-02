"use client";

import { useState } from "react";
import { LoginForm, RegisterForm } from "@/components/forms";
import { Shield, UserPlus, Stethoscope, Building2, Users, TestTube2, Sparkles, Heart, CheckCircle2 } from "lucide-react";

const ozellikler = [
  { ikon: Building2, metin: "Firma & Personel Yönetimi", aciklama: "Tüm firmalarınızı tek yerden yönetin" },
  { ikon: TestTube2, metin: "Sağlık Testi Planlama", aciklama: "Periyodik testleri otomatik planlayın" },
  { ikon: Shield, metin: "OSGB Uyumlu Raporlama", aciklama: "Resmi raporları anında oluşturun" },
  { ikon: Users, metin: "Toplu Tarama İşlemleri", aciklama: "Yüzlerce personeli tek seferde tarayın" },
];

export default function GirisPage() {
  const [aktifTab, setAktifTab] = useState<"giris" | "kayit">("giris");
  const [hata, setHata] = useState("");
  const [basarili, setBasarili] = useState("");

  const handleSuccess = () => {
    setBasarili("Hesabınız oluşturuldu! Giriş yapabilirsiniz.");
    setHata("");
  };

  const handleError = (error: string) => {
    setHata(error);
    setBasarili("");
  };

  const handleTabChange = (tab: "giris" | "kayit") => {
    setAktifTab(tab);
    setHata("");
    setBasarili("");
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
              onClick={() => handleTabChange("giris")}
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
              onClick={() => handleTabChange("kayit")}
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

          {/* Form */}
          {aktifTab === "giris" ? (
            <LoginForm onError={handleError} />
          ) : (
            <RegisterForm 
              onSuccess={() => {
                handleSuccess();
                setAktifTab("giris");
              }} 
              onError={handleError}
            />
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
