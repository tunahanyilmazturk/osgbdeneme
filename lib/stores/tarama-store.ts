"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Tarama, TaramaDurumu } from "@/types";

// Mock tarama verileri
const mockTaramalar: Tarama[] = [
  {
    id: "1",
    ad: "Periyodik Muayene - 2026 Bahar",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    personelIds: ["1", "2"],
    testIds: ["1", "2", "3"],
    planlananTarih: "2026-04-15",
    durum: "PLANLANDI",
    atananPersonelId: "1",
    atananPersonelAdi: "Dr. Ayşe Demir",
    olusturmaTarihi: "2026-03-15",
  },
];

interface TaramaFilters {
  firmaId: string;
  durum: TaramaDurumu | "TUMU";
  tarihBaslangic: string;
  tarihBitis: string;
}

interface TaramaState {
  taramalar: Tarama[];
  filters: TaramaFilters;
  
  // Actions
  taramaEkle: (tarama: Omit<Tarama, "id" | "olusturmaTarihi" | "firmaAdi" | "atananPersonelAdi">, firmaAdi?: string, atananPersonelAdi?: string) => void;
  taramaGuncelle: (id: string, tarama: Partial<Tarama>) => void;
  taramaSil: (id: string) => void;
  durumDegistir: (id: string, yeniDurum: TaramaDurumu) => void;
  
  // Filters
  setFilters: (filters: Partial<TaramaFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getFilteredTaramalar: () => Tarama[];
  getAktifTaramalar: () => Tarama[];
  getTamamlananTaramaSayisi: () => number;
  getTaramaByFirma: (firmaId: string) => Tarama[];
}

const defaultFilters: TaramaFilters = {
  firmaId: "",
  durum: "TUMU",
  tarihBaslangic: "",
  tarihBitis: "",
};

export const useTaramaStore = create<TaramaState>()(
  persist(
    (set, get) => ({
      taramalar: mockTaramalar,
      filters: defaultFilters,

      taramaEkle: (tarama, firmaAdi, atananPersonelAdi) => {
        const yeniTarama: Tarama = {
          ...tarama,
          firmaAdi,
          atananPersonelAdi,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ taramalar: [...state.taramalar, yeniTarama] }));
      },

      taramaGuncelle: (id, tarama) => {
        set((state) => ({
          taramalar: state.taramalar.map((t) =>
            t.id === id ? { ...t, ...tarama } : t
          ),
        }));
      },

      taramaSil: (id) => {
        set((state) => ({
          taramalar: state.taramalar.filter((t) => t.id !== id),
        }));
      },

      durumDegistir: (id, yeniDurum) => {
        set((state) => ({
          taramalar: state.taramalar.map((t) =>
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

      getFilteredTaramalar: () => {
        const { taramalar, filters } = get();
        return taramalar.filter((tarama) => {
          const firmaMatch =
            filters.firmaId === "" || tarama.firmaId === filters.firmaId;
          const durumMatch =
            filters.durum === "TUMU" || tarama.durum === filters.durum;
          const tarihMatch =
            (filters.tarihBaslangic === "" ||
              tarama.planlananTarih >= filters.tarihBaslangic) &&
            (filters.tarihBitis === "" ||
              tarama.planlananTarih <= filters.tarihBitis);

          return firmaMatch && durumMatch && tarihMatch;
        });
      },

      getAktifTaramalar: () => {
        return get().taramalar.filter(
          (t) => t.durum === "PLANLANDI" || t.durum === "DEVAM_EDIYOR"
        );
      },

      getTamamlananTaramaSayisi: () => {
        return get().taramalar.filter((t) => t.durum === "TAMAMLANDI").length;
      },

      getTaramaByFirma: (firmaId) => {
        return get().taramalar.filter((t) => t.firmaId === firmaId);
      },
    }),
    {
      name: "hantech-taramalar",
    }
  )
);
