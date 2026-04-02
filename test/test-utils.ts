import { render as rtlRender, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { vi } from 'vitest'

// Custom render with providers if needed
function render(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return rtlRender(ui, { ...options })
}

// Re-export everything from testing-library
export * from '@testing-library/react'
export { render }

// Test utilities for stores
export const createMockStore = <T extends Record<string, unknown>>(initialState: T) => {
  const store = {
    getState: () => initialState,
    setState: (fn: (state: T) => Partial<T>) => {
      Object.assign(initialState, fn(initialState))
    },
    subscribe: vi.fn(),
  }
  return store
}

// Common test data
export const mockFirma = {
  id: '1',
  ad: 'Test Firma',
  vergiNo: '1234567890',
  adres: 'Test Adres',
  il: 'İstanbul',
  ilce: 'Kadıköy',
  sektor: 'Teknoloji',
  telefon: '0212 123 4567',
  email: 'test@firma.com',
  yetkiliKisi: 'Test Kişi',
  calisanSayisi: 50,
  durum: 'AKTIF' as const,
  olusturmaTarihi: '2024-01-01',
}

export const mockPersonel = {
  id: '1',
  ad: 'Ahmet',
  soyad: 'Yılmaz',
  telefon: '0532 123 4567',
  email: 'ahmet@firma.com',
  dogumTarihi: '1990-01-01',
  isegirisTarihi: '2020-01-01',
  pozisyon: 'Mühendis',
  durum: 'AKTIF' as const,
  firmaId: '1',
  firmaAdi: 'Test Firma',
  olusturmaTarihi: '2024-01-01',
}

export const mockRandevu = {
  id: '1',
  firmaId: '1',
  firmaAdi: 'Test Firma',
  personelId: '1',
  personelAdi: 'Ahmet Yılmaz',
  testId: '1',
  testAdi: 'Test Adı',
  tarih: '2024-01-15',
  baslangicSaati: '09:00',
  bitisSaati: '10:00',
  durum: 'BEKLEMEDE' as const,
}

export const mockTeklif = {
  id: '1',
  firmaId: '1',
  firmaAdi: 'Test Firma',
  durum: 'TASLAK' as const,
  gecerlilikTarihi: '2024-02-01',
  kdvYuzde: 10,
  araToplam: 1000,
  kdvTutar: 100,
  genelToplam: 1100,
  kalemler: [],
  olusturmaTarihi: '2024-01-01',
}
