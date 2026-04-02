import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useDashboardStats, useSonAktiviteler } from '@/lib/hooks/use-dashboard'
import { useStore } from '@/lib/store'

describe('useDashboardStats', () => {
  beforeEach(() => {
    // Reset store before each test
    useStore.setState({
      firmalar: [],
      personeller: [],
      randevular: [],
      teklifler: [],
      taramalar: [],
      saglikTestleri: [],
    })
  })

  it('should return zero stats when no data', () => {
    const { result } = renderHook(() => useDashboardStats())

    expect(result.current.firmaSayisi).toBe(0)
    expect(result.current.personelSayisi).toBe(0)
    expect(result.current.randevuSayisi).toBe(0)
    expect(result.current.bekleyenRandevuSayisi).toBe(0)
    expect(result.current.bugunRandevuSayisi).toBe(0)
    expect(result.current.taramaSayisi).toBe(0)
    expect(result.current.devamEdenTaramaSayisi).toBe(0)
    expect(result.current.teklifSayisi).toBe(0)
    expect(result.current.taslakTeklifSayisi).toBe(0)
    expect(result.current.toplamGelir).toBe(0)
    expect(result.current.testSayisi).toBe(0)
  })

  it('should calculate correct stats with data', () => {
    const today = new Date().toISOString().split('T')[0]
    
    // Set up mock data
    useStore.setState({
      firmalar: [
        { id: '1', ad: 'Firma 1', durum: 'AKTIF', calisanSayisi: 10, sektor: 'Teknoloji', il: 'İstanbul', ilce: 'Kadıköy', vergiNo: '123', adres: 'Adres', telefon: '123', email: 'test@test.com', yetkiliKisi: 'Test', notlar: '', olusturmaTarihi: '2024-01-01' },
        { id: '2', ad: 'Firma 2', durum: 'PASIF', calisanSayisi: 20, sektor: 'Teknoloji', il: 'İstanbul', ilce: 'Kadıköy', vergiNo: '456', adres: 'Adres', telefon: '123', email: 'test@test.com', yetkiliKisi: 'Test', notlar: '', olusturmaTarihi: '2024-01-01' },
      ],
      personeller: [
        { id: '1', ad: 'Ahmet', soyad: 'Yılmaz', durum: 'AKTIF', telefon: '123', dogumTarihi: '1990-01-01', isegirisTarihi: '2020-01-01', pozisyon: 'Mühendis', olusturmaTarihi: '2024-01-01' },
        { id: '2', ad: 'Mehmet', soyad: 'Kaya', durum: 'AKTIF', telefon: '123', dogumTarihi: '1990-01-01', isegirisTarihi: '2020-01-01', pozisyon: 'Mühendis', olusturmaTarihi: '2024-01-01' },
      ],
      teklifler: [
        { id: '1', durum: 'KABUL_EDİLDİ', genelToplam: 5000, firmaId: '1', firmaAdi: 'Firma 1', gecerlilikTarihi: '2024-12-31', kdvYuzde: 10, araToplam: 4500, kdvTutar: 500, kalemler: [], olusturmaTarihi: '2024-01-01' },
        { id: '2', durum: 'TASLAK', genelToplam: 3000, firmaId: '1', firmaAdi: 'Firma 1', gecerlilikTarihi: '2024-12-31', kdvYuzde: 10, araToplam: 2700, kdvTutar: 300, kalemler: [], olusturmaTarihi: '2024-01-01' },
      ],
      randevular: [
        { id: '1', firmaId: '1', firmaAdi: 'Firma 1', personelId: '1', personelAdi: 'Ahmet Yılmaz', testId: '1', testAdi: 'Test 1', tarih: today, baslangicSaati: '09:00', bitisSaati: '10:00', durum: 'BEKLEMEDE', olusturmaTarihi: '2024-01-01' },
      ],
      taramalar: [
        { id: '1', ad: 'Tarama 1', firmaId: '1', firmaAdi: 'Firma 1', personelIds: ['1'], testIds: ['1'], planlananTarih: today, durum: 'DEVAM_EDIYOR', olusturmaTarihi: '2024-01-01' },
      ],
      saglikTestleri: [
        { id: '1', ad: 'Test 1', kategoriId: '1', kategoriAdi: 'Kategori 1', birimFiyat: 100, durum: 'AKTIF', olusturmaTarihi: '2024-01-01' },
      ],
    })

    const { result } = renderHook(() => useDashboardStats())

    expect(result.current.firmaSayisi).toBe(2)
    expect(result.current.aktifFirmaSayisi).toBe(1)
    expect(result.current.personelSayisi).toBe(2)
    expect(result.current.aktifPersonelSayisi).toBe(2)
    expect(result.current.randevuSayisi).toBe(1)
    expect(result.current.bekleyenRandevuSayisi).toBe(1)
    expect(result.current.bugunRandevuSayisi).toBe(1)
    expect(result.current.teklifSayisi).toBe(2)
    expect(result.current.taslakTeklifSayisi).toBe(1)
    expect(result.current.toplamGelir).toBe(5000)
    expect(result.current.taramaSayisi).toBe(1)
    expect(result.current.devamEdenTaramaSayisi).toBe(1)
    expect(result.current.testSayisi).toBe(1)
  })
})

describe('useSonAktiviteler', () => {
  beforeEach(() => {
    useStore.setState({
      randevular: [],
      taramalar: [],
    })
  })

  it('should return empty arrays when no data', () => {
    const { result } = renderHook(() => useSonAktiviteler(5))

    expect(result.current.sonRandevular).toEqual([])
    expect(result.current.sonTaramalar).toEqual([])
  })

  it('should return limited activities based on count parameter', () => {
    const today = new Date().toISOString().split('T')[0]
    
    useStore.setState({
      randevular: [
        { id: '1', firmaAdi: 'Firma 1', personelAdi: 'Ahmet Yılmaz', testAdi: 'Test 1', tarih: today, baslangicSaati: '09:00', bitisSaati: '10:00', durum: 'BEKLEMEDE', firmaId: '1', personelId: '1', testId: '1', olusturmaTarihi: '2024-01-01' },
        { id: '2', firmaAdi: 'Firma 2', personelAdi: 'Mehmet Kaya', testAdi: 'Test 2', tarih: today, baslangicSaati: '10:00', bitisSaati: '11:00', durum: 'BEKLEMEDE', firmaId: '2', personelId: '2', testId: '2', olusturmaTarihi: '2024-01-01' },
        { id: '3', firmaAdi: 'Firma 3', personelAdi: 'Ali Demir', testAdi: 'Test 3', tarih: today, baslangicSaati: '11:00', bitisSaati: '12:00', durum: 'BEKLEMEDE', firmaId: '3', personelId: '3', testId: '3', olusturmaTarihi: '2024-01-01' },
      ],
    })

    const { result } = renderHook(() => useSonAktiviteler(2))

    expect(result.current.sonRandevular).toHaveLength(2)
  })
})
