"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { SaglikTesti, GenelDurum } from "@/types";

// Mock sağlık testi verileri
const mockSaglikTestleri: SaglikTesti[] = [
  {
    id: "1",
    ad: "Tam Kan Sayımı",
    kategoriId: "1",
    kategoriAdi: "Biyokimyasal Testler",
    birimFiyat: 150,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "2",
    ad: "Akciğer Grafisi",
    kategoriId: "2",
    kategoriAdi: "Radyolojik Testler",
    birimFiyat: 200,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "3",
    ad: "Fizik Muayene",
    kategoriId: "3",
    kategoriAdi: "Fizik Muayene",
    birimFiyat: 100,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "4",
    ad: "İşitme Testi",
    kategoriId: "4",
    kategoriAdi: "Odyometri",
    birimFiyat: 180,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "5",
    ad: "Akciğer Fonksiyon Testi",
    kategoriId: "5",
    kategoriAdi: "Spirometri",
    birimFiyat: 250,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
];

interface TestFilters {
  arama: string;
  kategoriId: string;
  durum: GenelDurum | "TUMU";
}

interface SaglikTestiState {
  saglikTestleri: SaglikTesti[];
  filters: TestFilters;
  testKategorileri: { id: string; ad: string }[];
  
  // Actions
  testEkle: (test: Omit<SaglikTesti, "id" | "olusturmaTarihi" | "kategoriAdi">, kategoriAdi?: string) => void;
  testGuncelle: (id: string, test: Partial<SaglikTesti>) => void;
  testSil: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<TestFilters>) => void;
  resetFilters: () => void;
  
  // Kategoriler
  kategoriEkle: (ad: string) => void;
  kategoriSil: (id: string) => void;
  
  // Computed
  getFilteredTestler: () => SaglikTesti[];
  getAktifTestler: () => SaglikTesti[];
  getKategoriList: () => { id: string; ad: string }[];
}

const defaultFilters: TestFilters = {
  arama: "",
  kategoriId: "",
  durum: "TUMU",
};

export const useSaglikTestiStore = create<SaglikTestiState>()(
  persist(
    (set, get) => ({
      saglikTestleri: mockSaglikTestleri,
      filters: defaultFilters,
      testKategorileri: [
        { id: "1", ad: "Biyokimyasal Testler" },
        { id: "2", ad: "Radyolojik Testler" },
        { id: "3", ad: "Fizik Muayene" },
        { id: "4", ad: "Odyometri" },
        { id: "5", ad: "Spirometri" },
        { id: "6", ad: "EKG" },
      ],

      testEkle: (test, kategoriAdi) => {
        const yeniTest: SaglikTesti = {
          ...test,
          kategoriAdi,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ saglikTestleri: [...state.saglikTestleri, yeniTest] }));
      },

      testGuncelle: (id, test) => {
        set((state) => ({
          saglikTestleri: state.saglikTestleri.map((t) =>
            t.id === id ? { ...t, ...test } : t
          ),
        }));
      },

      testSil: (id) => {
        set((state) => ({
          saglikTestleri: state.saglikTestleri.filter((t) => t.id !== id),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      kategoriEkle: (ad) => {
        set((state) => ({
          testKategorileri: [
            ...state.testKategorileri,
            { id: uuidv4(), ad },
          ],
        }));
      },

      kategoriSil: (id) => {
        set((state) => ({
          testKategorileri: state.testKategorileri.filter((k) => k.id !== id),
        }));
      },

      getFilteredTestler: () => {
        const { saglikTestleri, filters } = get();
        return saglikTestleri.filter((test) => {
          const aramaMatch =
            filters.arama === "" ||
            test.ad.toLowerCase().includes(filters.arama.toLowerCase()) ||
            test.kategoriAdi?.toLowerCase().includes(filters.arama.toLowerCase());

          const kategoriMatch =
            filters.kategoriId === "" || test.kategoriId === filters.kategoriId;

          const durumMatch =
            filters.durum === "TUMU" || test.durum === filters.durum;

          return aramaMatch && kategoriMatch && durumMatch;
        });
      },

      getAktifTestler: () => {
        return get().saglikTestleri.filter((t) => t.durum === "AKTIF");
      },

      getKategoriList: () => {
        return get().testKategorileri;
      },
    }),
    {
      name: "hantech-saglik-testleri",
      partialize: (state) => ({ 
        saglikTestleri: state.saglikTestleri, 
        testKategorileri: state.testKategorileri 
      }),
    }
  )
);
