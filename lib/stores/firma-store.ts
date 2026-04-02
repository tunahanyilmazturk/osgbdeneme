"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Firma, GenelDurum } from "@/types";

// Mock firma verileri
const mockFirmalar: Firma[] = [
  {
    id: "1",
    ad: "ABC Tekstil San. ve Tic. A.Ş.",
    vergiNo: "1234567890",
    adres: "Organize Sanayi Bölgesi, 1. Cadde No:5",
    il: "İstanbul",
    ilce: "Esenyurt",
    sektor: "İmalat",
    telefon: "0212 123 4567",
    email: "info@abctekstil.com",
    yetkiliKisi: "Mehmet Demir",
    calisanSayisi: 250,
    durum: "AKTIF",
    notlar: "Özel müşteri, öncelikli hizmet.",
    olusturmaTarihi: "2024-01-15",
  },
  {
    id: "2",
    ad: "XYZ İnşaat Ltd. Şti.",
    vergiNo: "0987654321",
    adres: "İnşaatçılar Sitesi, Blok A",
    il: "Ankara",
    ilce: "Yenimahalle",
    sektor: "İnşaat",
    telefon: "0312 234 5678",
    email: "bilgi@xyzinsaat.com",
    yetkiliKisi: "Ali Veli",
    calisanSayisi: 85,
    durum: "AKTIF",
    olusturmaTarihi: "2024-02-01",
  },
  {
    id: "3",
    ad: "TechSoft Bilişim Hizmetleri",
    vergiNo: "1122334455",
    adres: "Teknopark, Bina 2, Kat 3",
    il: "İzmir",
    ilce: "Bornova",
    sektor: "Bilişim",
    telefon: "0232 345 6789",
    email: "info@techsoft.com.tr",
    yetkiliKisi: "Ayşe Kaya",
    calisanSayisi: 45,
    durum: "AKTIF",
    olusturmaTarihi: "2024-02-15",
  },
];

// Mock sektör listesi
const mockSektorler: string[] = [
  "İmalat",
  "İnşaat",
  "Bilişim",
  "Sağlık",
  "Eğitim",
  "Perakende",
  "Lojistik",
  "Gıda",
  "Tekstil",
  "Otomotiv",
];

interface FirmaFilters {
  arama: string;
  sektor: string;
  durum: GenelDurum | "TUMU";
  il: string;
}

interface FirmaState {
  firmalar: Firma[];
  sektorler: string[];
  filters: FirmaFilters;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  firmaEkle: (firma: Omit<Firma, "id" | "olusturmaTarihi">) => void;
  firmaGuncelle: (id: string, firma: Partial<Firma>) => void;
  firmaSil: (id: string) => void;
  firmaGetir: (id: string) => Firma | undefined;
  
  // Sektor actions
  sektorEkle: (ad: string) => void;
  sektorSil: (index: number) => void;
  
  // Filters
  setFilters: (filters: Partial<FirmaFilters>) => void;
  resetFilters: () => void;
  
  // Computed
  getFilteredFirmalar: () => Firma[];
  getAktifFirmaSayisi: () => number;
  getSektorList: () => string[];
}

const defaultFilters: FirmaFilters = {
  arama: "",
  sektor: "TUMU",
  durum: "TUMU",
  il: "TUMU",
};

export const useFirmaStore = create<FirmaState>()(
  persist(
    (set, get) => ({
      firmalar: mockFirmalar,
      sektorler: mockSektorler,
      filters: defaultFilters,
      isLoading: false,
      error: null,

      firmaEkle: (firma) => {
        const yeniFirma: Firma = {
          ...firma,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ firmalar: [...state.firmalar, yeniFirma] }));
      },

      firmaGuncelle: (id, firma) => {
        set((state) => ({
          firmalar: state.firmalar.map((f) =>
            f.id === id ? { ...f, ...firma } : f
          ),
        }));
      },

      firmaSil: (id) => {
        set((state) => ({
          firmalar: state.firmalar.filter((f) => f.id !== id),
        }));
      },

      firmaGetir: (id) => {
        return get().firmalar.find((f) => f.id === id);
      },

      sektorEkle: (ad) => {
        set((state) => ({
          sektorler: [...state.sektorler, ad],
        }));
      },

      sektorSil: (index) => {
        set((state) => ({
          sektorler: state.sektorler.filter((_, i) => i !== index),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      getFilteredFirmalar: () => {
        const { firmalar, filters } = get();
        return firmalar.filter((firma) => {
          const aramaMatch =
            filters.arama === "" ||
            firma.ad.toLowerCase().includes(filters.arama.toLowerCase()) ||
            firma.vergiNo.includes(filters.arama) ||
            firma.yetkiliKisi.toLowerCase().includes(filters.arama.toLowerCase());

          const sektorMatch =
            filters.sektor === "TUMU" || firma.sektor === filters.sektor;

          const durumMatch =
            filters.durum === "TUMU" || firma.durum === filters.durum;

          const ilMatch = filters.il === "TUMU" || firma.il === filters.il;

          return aramaMatch && sektorMatch && durumMatch && ilMatch;
        });
      },

      getAktifFirmaSayisi: () => {
        return get().firmalar.filter((f) => f.durum === "AKTIF").length;
      },

      getSektorList: () => {
        return [...new Set(get().firmalar.map((f) => f.sektor))];
      },
    }),
    {
      name: "hantech-firmalar",
      partialize: (state) => ({ firmalar: state.firmalar }),
    }
  )
);
