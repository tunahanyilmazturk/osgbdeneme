"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Bildirim } from "@/types";

interface BildirimState {
  bildirimler: Bildirim[];
  okunmamisSayisi: number;
  
  // Actions
  bildirimEkle: (bildirim: Omit<Bildirim, "id" | "olusturmaTarihi">) => void;
  bildirimOkundu: (id: string) => void;
  tumunuOkunduIsaretle: () => void;
  bildirimSil: (id: string) => void;
  temizle: () => void;
}

// Mock bildirim verileri
const mockBildirimler: Bildirim[] = [
  {
    id: "1",
    baslik: "Yeni Randevu",
    mesaj: "ABC Tekstil için yeni randevu oluşturuldu.",
    okundu: false,
    olusturmaTarihi: "2026-03-30",
  },
  {
    id: "2",
    baslik: "Teklif Güncellemesi",
    mesaj: "XYZ İnşaat teklifi kabul edildi.",
    okundu: true,
    olusturmaTarihi: "2026-03-29",
  },
];

export const useBildirimStore = create<BildirimState>()(
  persist(
    (set, get) => ({
      bildirimler: mockBildirimler,
      get okunmamisSayisi() {
        return get().bildirimler.filter((b) => !b.okundu).length;
      },

      bildirimEkle: (bildirim) => {
        const yeniBildirim: Bildirim = {
          ...bildirim,
          id: uuidv4(),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({
          bildirimler: [yeniBildirim, ...state.bildirimler],
        }));
      },

      bildirimOkundu: (id) => {
        set((state) => ({
          bildirimler: state.bildirimler.map((b) =>
            b.id === id ? { ...b, okundu: true } : b
          ),
        }));
      },

      tumunuOkunduIsaretle: () => {
        set((state) => ({
          bildirimler: state.bildirimler.map((b) => ({ ...b, okundu: true })),
        }));
      },

      bildirimSil: (id) => {
        set((state) => ({
          bildirimler: state.bildirimler.filter((b) => b.id !== id),
        }));
      },

      temizle: () => {
        set({ bildirimler: [] });
      },
    }),
    {
      name: "hantech-bildirimler",
    }
  )
);
