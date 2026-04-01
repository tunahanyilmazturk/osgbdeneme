import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTarih(tarih: Date | string): string {
  const d = new Date(tarih);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTarihKisa(tarih: Date | string): string {
  const d = new Date(tarih);
  return d.toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export function formatPara(miktar: number): string {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(miktar);
}

export function kisalt(metin: string, uzunluk: number = 50): string {
  if (metin.length <= uzunluk) return metin;
  return metin.slice(0, uzunluk) + "...";
}

export function baslHarfBuyuk(metin: string): string {
  return metin.charAt(0).toUpperCase() + metin.slice(1).toLowerCase();
}

export function rastgeleId(): string {
  return Math.random().toString(36).substring(2, 15);
}
