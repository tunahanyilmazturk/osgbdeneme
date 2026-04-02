import { useMemo } from "react";
import { useStore } from "@/lib/store";
import type { Randevu, Tarama } from "@/types";

interface DashboardStats {
  firmaSayisi: number;
  aktifFirmaSayisi: number;
  personelSayisi: number;
  aktifPersonelSayisi: number;
  randevuSayisi: number;
  bekleyenRandevuSayisi: number;
  bugunRandevuSayisi: number;
  taramaSayisi: number;
  devamEdenTaramaSayisi: number;
  teklifSayisi: number;
  taslakTeklifSayisi: number;
  toplamGelir: number;
  testSayisi: number;
}

export function useDashboardStats(): DashboardStats {
  const { firmalar, personeller, randevular, taramalar, teklifler, saglikTestleri } = useStore();

  return useMemo(() => {
    const bugun = new Date().toISOString().split("T")[0];

    return {
      firmaSayisi: firmalar.length,
      aktifFirmaSayisi: firmalar.filter((f) => f.durum === "AKTIF").length,
      personelSayisi: personeller.length,
      aktifPersonelSayisi: personeller.filter((p) => p.durum === "AKTIF").length,
      randevuSayisi: randevular.length,
      bekleyenRandevuSayisi: randevular.filter((r) => r.durum === "BEKLEMEDE").length,
      bugunRandevuSayisi: randevular.filter((r) => r.tarih === bugun).length,
      taramaSayisi: taramalar.length,
      devamEdenTaramaSayisi: taramalar.filter((t) => t.durum === "DEVAM_EDIYOR").length,
      teklifSayisi: teklifler.length,
      taslakTeklifSayisi: teklifler.filter((t) => t.durum === "TASLAK").length,
      toplamGelir: teklifler
        .filter((t) => t.durum === "KABUL_EDİLDİ")
        .reduce((sum, t) => sum + t.genelToplam, 0),
      testSayisi: saglikTestleri.length,
    };
  }, [firmalar, personeller, randevular, taramalar, teklifler, saglikTestleri]);
}

interface SonAktiviteler {
  sonRandevular: Randevu[];
  sonTaramalar: Tarama[];
}

export function useSonAktiviteler(limit: number = 5): SonAktiviteler {
  const { randevular, taramalar } = useStore();

  return useMemo(() => {
    return {
      sonRandevular: [...randevular].reverse().slice(0, limit),
      sonTaramalar: [...taramalar].reverse().slice(0, limit),
    };
  }, [randevular, taramalar, limit]);
}
