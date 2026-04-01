"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Moon, Sun, Bell, LogOut, Search, Maximize2, RefreshCw, X, Check } from "lucide-react";
import { useTheme } from "next-themes";
import { useStore } from "@/lib/store";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import SearchModal from "./search-modal";

const sayfaBasliklari: Record<string, { baslik: string; aciklama: string }> = {
  "/dashboard": { baslik: "Gösterge Paneli", aciklama: "Genel bakış" },
  "/dashboard/firmalar": { baslik: "Firmalar", aciklama: "Firma yönetimi" },
  "/dashboard/personel": { baslik: "Personel", aciklama: "Personel yönetimi" },
  "/dashboard/saglik-testleri": { baslik: "Sağlık Testleri", aciklama: "Test yönetimi" },
  "/dashboard/randevular": { baslik: "Randevular", aciklama: "Randevu planlama" },
  "/dashboard/takvim": { baslik: "Takvim", aciklama: "Etkinlik takvimi" },
  "/dashboard/teklifler": { baslik: "Teklifler", aciklama: "Fiyat teklifleri" },
  "/dashboard/taramalar": { baslik: "Taramalar", aciklama: "Sağlık taramaları" },
  "/dashboard/raporlar": { baslik: "Raporlar", aciklama: "İstatistikler" },
  "/dashboard/ayarlar": { baslik: "Ayarlar", aciklama: "Sistem ayarları" },
};

export default function Header() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const { kullanici, bildirimler, bildirimOkundu, cikisYap } = useStore();
  const okunmamisBildirim = bildirimler.filter((b) => !b.okundu).length;

  const [searchOpen, setSearchOpen] = useState(false);
  const [bildirimOpen, setBildirimOpen] = useState(false);
  const bildirimRef = useRef<HTMLDivElement>(null);

  const mevcutSayfa = sayfaBasliklari[pathname] || { baslik: "Sayfa", aciklama: "" };

  // Ctrl+K kısayolu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Bildirim dropdown dışı tıklama
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (bildirimRef.current && !bildirimRef.current.contains(e.target as Node)) {
        setBildirimOpen(false);
      }
    };
    if (bildirimOpen) {
      document.addEventListener("mousedown", handleClick);
    }
    return () => document.removeEventListener("mousedown", handleClick);
  }, [bildirimOpen]);

  const handleCikis = () => {
    cikisYap();
    router.push("/giris");
  };

  const tumunuOkunduIsaretle = () => {
    bildirimler.forEach((b) => {
      if (!b.okundu) bildirimOkundu(b.id);
    });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Sol - Sayfa Başlığı */}
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-lg font-semibold leading-tight">{mevcutSayfa.baslik}</h1>
              <p className="text-xs text-muted-foreground">{mevcutSayfa.aciklama}</p>
            </div>
          </div>

          {/* Orta - Arama (desktop) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center relative max-w-sm w-full mx-8 h-10 rounded-xl border bg-muted/50 pl-10 pr-4 text-sm text-muted-foreground hover:bg-muted/70 focus:outline-none transition-all cursor-pointer"
          >
            <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
            <span>Hızlı arama... (Ctrl+K)</span>
            <kbd className="absolute right-3 hidden lg:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ⌘K
            </kbd>
          </button>

          {/* Sağ - Aksiyonlar */}
          <div className="flex items-center gap-1">
            {/* Mobil Arama */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl md:hidden"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4" />
            </Button>

            {/* Yenile */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hidden sm:flex"
              onClick={() => router.refresh()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>

            {/* Tam Ekran */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hidden sm:flex"
              onClick={() => {
                if (document.fullscreenElement) {
                  document.exitFullscreen();
                } else {
                  document.documentElement.requestFullscreen();
                }
              }}
            >
              <Maximize2 className="h-4 w-4" />
            </Button>

            {/* Bildirimler */}
            <div className="relative" ref={bildirimRef}>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl relative"
                onClick={() => setBildirimOpen(!bildirimOpen)}
              >
                <Bell className="h-4 w-4" />
                {okunmamisBildirim > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse-glow">
                    {okunmamisBildirim}
                  </span>
                )}
              </Button>

              {/* Bildirim Dropdown */}
              {bildirimOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border shadow-xl animate-fade-in-scale z-50 bg-popover">
                  <div className="flex items-center justify-between border-b px-4 py-3">
                    <div>
                      <h3 className="text-sm font-semibold">Bildirimler</h3>
                      {okunmamisBildirim > 0 && (
                        <p className="text-xs text-muted-foreground">{okunmamisBildirim} okunmamış</p>
                      )}
                    </div>
                    {okunmamisBildirim > 0 && (
                      <Button variant="ghost" size="xs" onClick={tumunuOkunduIsaretle}>
                        <Check className="mr-1 h-3 w-3" />
                        Tümünü oku
                      </Button>
                    )}
                  </div>
                  <div className="max-h-[320px] overflow-y-auto">
                    {bildirimler.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8">
                        <Bell className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Bildirim yok</p>
                      </div>
                    ) : (
                      bildirimler.map((bildirim) => (
                        <div
                          key={bildirim.id}
                          className={`flex items-start gap-3 px-4 py-3 border-b last:border-0 hover:bg-accent/50 transition-colors cursor-pointer ${
                            !bildirim.okundu ? "bg-primary/5" : ""
                          }`}
                          onClick={() => bildirimOkundu(bildirim.id)}
                        >
                          <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                            bildirim.okundu ? "bg-transparent" : "bg-primary"
                          }`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm truncate ${!bildirim.okundu ? "font-semibold" : ""}`}>
                              {bildirim.baslik}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{bildirim.mesaj}</p>
                            <p className="text-[10px] text-muted-foreground mt-1">{bildirim.olusturmaTarihi}</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {bildirimler.length > 0 && (
                    <div className="border-t px-4 py-2.5 text-center">
                      <button className="text-xs text-primary font-medium hover:underline">
                        Tüm bildirimleri görüntüle
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Tema */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {/* Ayırıcı */}
            <div className="mx-2 h-8 w-px bg-border" />

            {/* Kullanıcı */}
            <div className="flex items-center gap-2.5 cursor-pointer rounded-xl px-2 py-1.5 hover:bg-accent transition-colors">
              <div className="relative">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-xs font-semibold shadow-sm">
                  {kullanici?.ad?.charAt(0)}{kullanici?.soyad?.charAt(0)}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-card" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-medium leading-tight">
                  {kullanici?.ad} {kullanici?.soyad}
                </p>
                <p className="text-[11px] text-muted-foreground leading-tight">
                  {kullanici?.rol || "Yönetici"}
                </p>
              </div>
            </div>

            {/* Çıkış */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/50 dark:hover:text-red-400 transition-colors"
              onClick={handleCikis}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Arama Modalı */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
