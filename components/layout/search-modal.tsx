"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useFirmaStore, usePersonelStore, useRandevuStore, useTeklifStore, useSaglikTestiStore, useTaramaStore } from "@/lib/stores";
import {
  Search,
  Building2,
  Users,
  Calendar,
  FileText,
  TestTube2,
  ClipboardList,
  ArrowRight,
  Command,
  Hash,
} from "lucide-react";

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  baslik: string;
  altBaslik: string;
  icon: typeof Building2;
  href: string;
  kategori: string;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const { firmalar } = useFirmaStore();
  const { personeller } = usePersonelStore();
  const { randevular } = useRandevuStore();
  const { teklifler } = useTeklifStore();
  const { saglikTestleri } = useSaglikTestiStore();
  const { taramalar } = useTaramaStore();
  const [query, setQuery] = useState("");
  const [seciliIndex, setSeciliIndex] = useState(0);

  const tumSonuclar = useMemo<SearchResult[]>(() => {
    const sonuclar: SearchResult[] = [];

    // Hızlı İşlemler
    sonuclar.push(
      { id: "h-1", baslik: "Yeni Firma Ekle", altBaslik: "Firma oluşturma formu", icon: Building2, href: "/dashboard/firmalar/yeni", kategori: "Hızlı İşlem" },
      { id: "h-2", baslik: "Yeni Personel Ekle", altBaslik: "Personel oluşturma formu", icon: Users, href: "/dashboard/personel/yeni", kategori: "Hızlı İşlem" },
      { id: "h-3", baslik: "Yeni Randevu Oluştur", altBaslik: "Randevu planlama", icon: Calendar, href: "/dashboard/randevular/yeni", kategori: "Hızlı İşlem" },
      { id: "h-4", baslik: "Yeni Teklif Oluştur", altBaslik: "Fiyat teklifi hazırla", icon: FileText, href: "/dashboard/teklifler/yeni", kategori: "Hızlı İşlem" },
      { id: "h-5", baslik: "Yeni Tarama Planla", altBaslik: "Sağlık taraması", icon: ClipboardList, href: "/dashboard/taramalar/yeni", kategori: "Hızlı İşlem" },
      { id: "h-6", baslik: "Yeni Test Tanımla", altBaslik: "Sağlık testi ekle", icon: TestTube2, href: "/dashboard/saglik-testleri/yeni", kategori: "Hızlı İşlem" }
    );

    // Sayfalar
    sonuclar.push(
      { id: "s-1", baslik: "Gösterge Paneli", altBaslik: "Dashboard", icon: Hash, href: "/dashboard", kategori: "Sayfalar" },
      { id: "s-2", baslik: "Firmalar", altBaslik: "Firma yönetimi", icon: Building2, href: "/dashboard/firmalar", kategori: "Sayfalar" },
      { id: "s-3", baslik: "Personel", altBaslik: "Personel yönetimi", icon: Users, href: "/dashboard/personel", kategori: "Sayfalar" },
      { id: "s-4", baslik: "Randevular", altBaslik: "Randevu planlama", icon: Calendar, href: "/dashboard/randevular", kategori: "Sayfalar" },
      { id: "s-5", baslik: "Takvim", altBaslik: "Etkinlik takvimi", icon: Calendar, href: "/dashboard/takvim", kategori: "Sayfalar" },
      { id: "s-6", baslik: "Teklifler", altBaslik: "Fiyat teklifleri", icon: FileText, href: "/dashboard/teklifler", kategori: "Sayfalar" },
      { id: "s-7", baslik: "Taramalar", altBaslik: "Sağlık taramaları", icon: ClipboardList, href: "/dashboard/taramalar", kategori: "Sayfalar" },
      { id: "s-8", baslik: "Raporlar", altBaslik: "İstatistikler", icon: Hash, href: "/dashboard/raporlar", kategori: "Sayfalar" },
      { id: "s-9", baslik: "Ayarlar", altBaslik: "Sistem ayarları", icon: Hash, href: "/dashboard/ayarlar", kategori: "Sayfalar" }
    );

    // Firmalar
    firmalar.forEach((f) => {
      sonuclar.push({
        id: `f-${f.id}`,
        baslik: f.ad,
        altBaslik: `${f.sektor} - ${f.il}`,
        icon: Building2,
        href: `/dashboard/firmalar/${f.id}`,
        kategori: "Firmalar",
      });
    });

    // Personel
    personeller.forEach((p) => {
      sonuclar.push({
        id: `p-${p.id}`,
        baslik: `${p.ad} ${p.soyad}`,
        altBaslik: `${p.pozisyon}`,
        icon: Users,
        href: `/dashboard/personel/${p.id}`,
        kategori: "Personel",
      });
    });

    // Randevular
    randevular.forEach((r) => {
      sonuclar.push({
        id: `r-${r.id}`,
        baslik: `${r.testAdi || "Randevu"}`,
        altBaslik: `${r.firmaAdi} - ${r.tarih}`,
        icon: Calendar,
        href: "/dashboard/randevular",
        kategori: "Randevular",
      });
    });

    // Sağlık Testleri
    saglikTestleri.forEach((t) => {
      sonuclar.push({
        id: `t-${t.id}`,
        baslik: t.ad,
        altBaslik: `${t.kategoriAdi || "Test"} - ₺${t.birimFiyat}`,
        icon: TestTube2,
        href: "/dashboard/saglik-testleri",
        kategori: "Testler",
      });
    });

    return sonuclar;
  }, [firmalar, personeller, randevular, teklifler, saglikTestleri, taramalar]);

  const filteredSonuclar = useMemo(() => {
    if (!query.trim()) return tumSonuclar.slice(0, 12);
    const q = query.toLowerCase();
    return tumSonuclar.filter(
      (s) =>
        s.baslik.toLowerCase().includes(q) ||
        s.altBaslik.toLowerCase().includes(q) ||
        s.kategori.toLowerCase().includes(q)
    );
  }, [query, tumSonuclar]);

  // Gruplara ayır
  const gruplar = useMemo(() => {
    const map: Record<string, SearchResult[]> = {};
    filteredSonuclar.forEach((s) => {
      if (!map[s.kategori]) map[s.kategori] = [];
      map[s.kategori].push(s);
    });
    return map;
  }, [filteredSonuclar]);

  const flatResults = filteredSonuclar;

  const handleSelect = useCallback(
    (result: SearchResult) => {
      router.push(result.href);
      onClose();
      setQuery("");
    },
    [router, onClose]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSeciliIndex((prev) => Math.min(prev + 1, flatResults.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSeciliIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatResults[seciliIndex]) {
          handleSelect(flatResults[seciliIndex]);
        }
      } else if (e.key === "Escape") {
        onClose();
      }
    },
    [flatResults, seciliIndex, handleSelect, onClose]
  );

  useEffect(() => {
    setSeciliIndex(0);
  }, [query]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSeciliIndex(0);
    }
  }, [open]);

  if (!open) return null;

  let globalIndex = -1;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-[101] w-full max-w-xl mx-4 animate-fade-in-scale">
        <div className="overflow-hidden rounded-2xl border shadow-2xl bg-popover">
          {/* Arama Input */}
          <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sayfa, firma, personel veya işlem ara..."
              className="flex-1 border-0 bg-transparent px-3 py-4 text-sm placeholder:text-muted-foreground focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Sonuçlar */}
          <div className="max-h-[400px] overflow-y-auto p-2">
            {filteredSonuclar.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  &ldquo;{query}&rdquo; için sonuç bulunamadı
                </p>
              </div>
            ) : (
              Object.entries(gruplar).map(([kategori, sonuclar]) => (
                <div key={kategori}>
                  <p className="px-3 py-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {kategori}
                  </p>
                  {sonuclar.map((sonuc) => {
                    globalIndex++;
                    const currentIndex = globalIndex;
                    const Icon = sonuc.icon;
                    const isSelected = currentIndex === seciliIndex;

                    return (
                      <button
                        key={sonuc.id}
                        onClick={() => handleSelect(sonuc)}
                        onMouseEnter={() => setSeciliIndex(currentIndex)}
                        className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                          isSelected ? "bg-accent" : "hover:bg-accent/50"
                        }`}
                      >
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-lg shrink-0 ${
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{sonuc.baslik}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {sonuc.altBaslik}
                          </p>
                        </div>
                        {isSelected && (
                          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Alt Bilgi */}
          <div className="flex items-center justify-between border-t px-4 py-2.5 text-[10px] text-muted-foreground">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 font-mono">↑↓</kbd> Gezin
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 font-mono">↵</kbd> Seç
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 font-mono">esc</kbd> Kapat
              </span>
            </div>
            <span>{filteredSonuclar.length} sonuç</span>
          </div>
        </div>
      </div>
    </div>
  );
}
