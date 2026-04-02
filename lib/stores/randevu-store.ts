"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Randevu, RandevuDurumu } from "@/types";

// Mock randevu verileri
const mockRandevular: Randevu[] = [
  {
    id: "1",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    personelId: "1",
    personelAdi: "Zeynep Arslan",
    testId: "1",
    testAdi: "Tam Kan Sayımı",
    tarih: "2026-04-05",
    baslangicSaati: "09:00",
    bitisSaati: "09:15",
    durum: "BEKLEMEDE",
    olusturmaTarihi: "2026-03-25",
  },
  {
    id: "2",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    personelId: "2",
    personelAdi: "Can Yıldız",
    testId: "3",
    testAdi: "Fizik Muayene",
    tarih: "2026-04-05",
    baslangicSaati: "09:30",
    bitisSaati: "10:00",
    durum: "ONAYLANDI",
    olusturmaTarihi: "2026-03-26",
  },
];

interface RandevuFilters {
  firmaId: string;
  durum: RandevuDurumu | "TUMU";
  tarihBaslangic: string;
  tarihBitis: string;
}

interface RandevuState {
  randevular: Randevu[];
  filters: RandevuFilters;
  
  // Actions
  randevuEkle: (randevu: Omit<Randevu, "id" | "olusturmaTarihi" | "firmaAdi" | "testAdi" | "personelAdi">, firmaAdi?: string, testAdi?: string, personelAdi?: string) => void;
  randevuGuncelle: (id: string, randevu: Partial<Randevu>) => void;
  randevuSil: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<RandevuFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getFilteredRandevular: () => Randevu[];
  getBugunRandevular: () => Randevu[];
  getBekleyenRandevular: () => Randevu[];
  getRandevuByFirma: (firmaId: string) => Randevu[];
}

const defaultFilters: RandevuFilters = {
  firmaId: "",
  durum: "TUMU",
  tarihBaslangic: "",
  tarihBitis: "",
};

export const useRandevuStore = create<RandevuState>()(
  persist(
    (set, get) => ({
      randevular: mockRandevular,
      filters: defaultFilters,

      randevuEkle: (randevu, firmaAdi, testAdi, personelAdi) => {
        const yeniRandevu: Randevu = {
          ...randevu,
          firmaAdi,
          testAdi,
          personelAdi,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ randevular: [...state.randevular, yeniRandevu] }));
      },

      randevuGuncelle: (id, randevu) => {
        set((state) => ({
          randevular: state.randevular.map((r) =>
            r.id === id ? { ...r, ...randevu } : r
          ),
        }));
      },

      randevuSil: (id) => {
        set((state) => ({
          randevular: state.randevular.filter((r) => r.id !== id),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getFilteredRandevular: () => {
        const { randevular, filters } = get();
        return randevular.filter((randevu) => {
          const firmaMatch =
            filters.firmaId === "" || randevu.firmaId === filters.firmaId;
          const durumMatch =
            filters.durum === "TUMU" || randevu.durum === filters.durum;
          const tarihMatch =
            (filters.tarihBaslangic === "" ||
              randevu.tarih >= filters.tarihBaslangic) &&
            (filters.tarihBitis === "" ||
              randevu.tarih <= filters.tarihBitis);

          return firmaMatch && durumMatch && tarihMatch;
        });
      },

      getBugunRandevular: () => {
        const bugun = new Date().toISOString().split("T")[0];
        return get().randevular.filter((r) => r.tarih === bugun);
      },

      getBekleyenRandevular: () => {
        return get().randevular.filter((r) => r.durum === "BEKLEMEDE");
      },

      getRandevuByFirma: (firmaId) => {
        return get().randevular.filter((r) => r.firmaId === firmaId);
      },
    }),
    {
      name: "hantech-randevular",
    }
  )
);
