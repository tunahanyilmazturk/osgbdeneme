"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Personel, GenelDurum } from "@/types";

// Mock personel verileri
const mockPersoneller: Personel[] = [
  {
    id: "1",
    ad: "Zeynep",
    soyad: "Arslan",
    telefon: "0532 111 2233",
    email: "zeynep@example.com",
    dogumTarihi: "1990-05-15",
    isegirisTarihi: "2020-03-01",
    pozisyon: "Sağlık Teknikeri",
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-15",
  },
  {
    id: "2",
    ad: "Can",
    soyad: "Yıldız",
    telefon: "0533 222 3344",
    email: "can@example.com",
    dogumTarihi: "1988-08-20",
    isegirisTarihi: "2019-06-15",
    pozisyon: "Radyoloji Teknikeri",
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-15",
  },
];

interface PersonelFilters {
  arama: string;
  pozisyon: string;
  durum: GenelDurum | "TUMU";
}

interface PersonelState {
  personeller: Personel[];
  filters: PersonelFilters;
  pozisyonlar: string[];
  
  // Actions
  personelEkle: (personel: Omit<Personel, "id" | "olusturmaTarihi">) => void;
  personelGuncelle: (id: string, personel: Partial<Personel>) => void;
  personelSil: (id: string) => void;
  
  // Filters
  setFilters: (filters: Partial<PersonelFilters>) => void;
  resetFilters: () => void;
  
  // Tanımlar
  pozisyonEkle: (ad: string) => void;
  pozisyonSil: (index: number) => void;
  
  // Computed
  getFilteredPersoneller: () => Personel[];
  getAktifPersonelSayisi: () => number;
}

const defaultFilters: PersonelFilters = {
  arama: "",
  pozisyon: "TUMU",
  durum: "TUMU",
};

export const usePersonelStore = create<PersonelState>()(
  persist(
    (set, get) => ({
      personeller: mockPersoneller,
      filters: defaultFilters,
      pozisyonlar: [
        "Sağlık Teknikeri",
        "Radyoloji Teknikeri",
        "Laborant",
        "Odyometrist",
        "Hemşire",
        "Diğer Sağlık Personeli",
        "Müdür",
        "İş Yeri Hekimi",
        "İş Güvenliği Uzmanı",
        "Sekreter",
      ],

      personelEkle: (personel) => {
        const yeniPersonel: Personel = {
          ...personel,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ personeller: [...state.personeller, yeniPersonel] }));
      },

      personelGuncelle: (id, personel) => {
        set((state) => ({
          personeller: state.personeller.map((p) =>
            p.id === id ? { ...p, ...personel } : p
          ),
        }));
      },

      personelSil: (id) => {
        set((state) => ({
          personeller: state.personeller.filter((p) => p.id !== id),
        }));
      },

      setFilters: (filters) => {
        set((state) => ({ filters: { ...state.filters, ...filters } }));
      },

      resetFilters: () => {
        set({ filters: defaultFilters });
      },

      pozisyonEkle: (ad) => {
        set((state) => ({
          pozisyonlar: [...state.pozisyonlar, ad],
        }));
      },

      pozisyonSil: (index) => {
        set((state) => ({
          pozisyonlar: state.pozisyonlar.filter((_, i) => i !== index),
        }));
      },

      getFilteredPersoneller: () => {
        const { personeller, filters } = get();
        return personeller.filter((personel) => {
          const aramaMatch =
            filters.arama === "" ||
            `${personel.ad} ${personel.soyad}`
              .toLowerCase()
              .includes(filters.arama.toLowerCase()) ||
            personel.email?.toLowerCase().includes(filters.arama.toLowerCase());

          const pozisyonMatch =
            filters.pozisyon === "TUMU" ||
            personel.pozisyon === filters.pozisyon;

          const durumMatch =
            filters.durum === "TUMU" || personel.durum === filters.durum;

          return aramaMatch && pozisyonMatch && durumMatch;
        });
      },

      getAktifPersonelSayisi: () => {
        return get().personeller.filter((p) => p.durum === "AKTIF").length;
      },
    }),
    {
      name: "hantech-personeller",
      partialize: (state) => ({ personeller: state.personeller, pozisyonlar: state.pozisyonlar }),
    }
  )
);
