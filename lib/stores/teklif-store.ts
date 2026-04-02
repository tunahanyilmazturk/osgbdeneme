"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { FiyatTeklifi, TeklifDurumu } from "@/types";

// Mock teklif verileri
const mockTeklifler: FiyatTeklifi[] = [
  {
    id: "TKL-001",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    kalemler: [
      {
        id: "1",
        testId: "1",
        testAdi: "Tam Kan Sayımı",
        miktar: 250,
        birimFiyat: 150,
        indirimYuzde: 10,
        toplam: 33750,
      },
      {
        id: "2",
        testId: "2",
        testAdi: "Akciğer Grafisi",
        miktar: 250,
        birimFiyat: 200,
        indirimYuzde: 5,
        toplam: 47500,
      },
    ],
    araToplam: 81250,
    kdvYuzde: 20,
    kdvTutar: 16250,
    genelToplam: 97500,
    durum: "GÖNDERİLDİ",
    gecerlilikTarihi: "2026-05-30",
    olusturmaTarihi: "2026-03-20",
  },
];

interface TeklifFilters {
  firmaId: string;
  durum: TeklifDurumu | "TUMU";
  tarihBaslangic: string;
  tarihBitis: string;
}

interface TeklifState {
  teklifler: FiyatTeklifi[];
  filters: TeklifFilters;
  
  // Actions
  teklifEkle: (teklif: Omit<FiyatTeklifi, "id" | "olusturmaTarihi" | "firmaAdi">, firmaAdi?: string) => void;
  teklifGuncelle: (id: string, teklif: Partial<FiyatTeklifi>) => void;
  teklifSil: (id: string) => void;
  durumDegistir: (id: string, yeniDurum: TeklifDurumu) => void;
  
  // Filters
  setFilters: (filters: Partial<TeklifFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getFilteredTeklifler: () => FiyatTeklifi[];
  getToplamGelir: () => number;
  getBekleyenTeklifSayisi: () => number;
  getKabulEdilenTeklifler: () => FiyatTeklifi[];
}

const defaultFilters: TeklifFilters = {
  firmaId: "",
  durum: "TUMU",
  tarihBaslangic: "",
  tarihBitis: "",
};

export const useTeklifStore = create<TeklifState>()(
  persist(
    (set, get) => ({
      teklifler: mockTeklifler,
      filters: defaultFilters,

      teklifEkle: (teklif, firmaAdi) => {
        const yeniTeklif: FiyatTeklifi = {
          ...teklif,
          firmaAdi,
          id: `TKL-${uuidv4().slice(0, 8).toUpperCase()}`,
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ teklifler: [...state.teklifler, yeniTeklif] }));
      },

      teklifGuncelle: (id, teklif) => {
        set((state) => ({
          teklifler: state.teklifler.map((t) =>
            t.id === id ? { ...t, ...teklif } : t
          ),
        }));
      },

      teklifSil: (id) => {
        set((state) => ({
          teklifler: state.teklifler.filter((t) => t.id !== id),
        }));
      },

      durumDegistir: (id, yeniDurum) => {
        set((state) => ({
          teklifler: state.teklifler.map((t) =>
            t.id === id ? { ...t, durum: yeniDurum } : t
          ),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getFilteredTeklifler: () => {
        const { teklifler, filters } = get();
        return teklifler.filter((teklif) => {
          const firmaMatch =
            filters.firmaId === "" || teklif.firmaId === filters.firmaId;
          const durumMatch =
            filters.durum === "TUMU" || teklif.durum === filters.durum;
          const tarihMatch =
            (filters.tarihBaslangic === "" ||
              teklif.olusturmaTarihi >= filters.tarihBaslangic) &&
            (filters.tarihBitis === "" ||
              teklif.olusturmaTarihi <= filters.tarihBitis);

          return firmaMatch && durumMatch && tarihMatch;
        });
      },

      getToplamGelir: () => {
        return get()
          .teklifler.filter((t) => t.durum === "KABUL_EDİLDİ")
          .reduce((sum, t) => sum + t.genelToplam, 0);
      },

      getBekleyenTeklifSayisi: () => {
        return get().teklifler.filter((t) => t.durum === "GÖNDERİLDİ").length;
      },

      getKabulEdilenTeklifler: () => {
        return get().teklifler.filter((t) => t.durum === "KABUL_EDİLDİ");
      },
    }),
    {
      name: "hantech-teklifler",
    }
  )
);
