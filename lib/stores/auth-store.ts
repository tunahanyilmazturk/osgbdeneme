"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid";
import type { Kullanici } from "@/types";

// Mock kullanıcı verisi
const mockKullanici: Kullanici = {
  id: "1",
  ad: "Ahmet",
  soyad: "Yılmaz",
  email: "admin@hantech.com",
  telefon: "0555 123 4567",
  rol: "ADMIN",
  durum: "AKTIF",
  avatar: "",
  olusturmaTarihi: "2024-01-01",
};

interface AuthState {
  kullanici: Kullanici | null;
  isLoading: boolean;
  error: string | null;
  girisYap: (email: string, sifre: string) => Promise<boolean>;
  cikisYap: () => void;
  setKullanici: (kullanici: Kullanici | null) => void;
  sifreDegistir: (mevcutSifre: string, yeniSifre: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      kullanici: mockKullanici,
      isLoading: false,
      error: null,

      girisYap: async (email: string, sifre: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Hash-based authentication (without backend)
          const hashedEmail = btoa(email.toLowerCase().trim());
          const hashedPass = btoa(sifre);
          const validEmailHash = btoa("admin@hantech.com");
          const validPassHash = btoa("admin123");

          // Simulate API delay
          await new Promise((resolve) => setTimeout(resolve, 500));

          if (hashedEmail === validEmailHash && hashedPass === validPassHash) {
            set({ kullanici: mockKullanici, isLoading: false });
            return true;
          } else {
            set({ error: "E-posta veya şifre hatalı", isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: "Giriş yapılırken bir hata oluştu", isLoading: false });
          return false;
        }
      },

      cikisYap: () => {
        set({ kullanici: null, error: null });
      },

      setKullanici: (kullanici) => {
        set({ kullanici });
      },

      sifreDegistir: async (mevcutSifre: string, yeniSifre: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const hashedPass = btoa(mevcutSifre);
          const validPassHash = btoa("admin123");

          await new Promise((resolve) => setTimeout(resolve, 500));

          if (hashedPass === validPassHash) {
            // In real app, this would update the password
            set({ isLoading: false });
            return true;
          } else {
            set({ error: "Mevcut şifre hatalı", isLoading: false });
            return false;
          }
        } catch (error) {
          set({ error: "Şifre değiştirilirken bir hata oluştu", isLoading: false });
          return false;
        }
      },
    }),
    {
      name: "hantech-auth",
      partialize: (state) => ({ kullanici: state.kullanici }),
    }
  )
);
