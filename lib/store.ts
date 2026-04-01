import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Kullanici, Firma, Personel, SaglikTesti, Randevu, FiyatTeklifi, Tarama, Bildirim, DashboardIstatistik } from "@/types";

// Mock veriler
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

const mockPersoneller: Personel[] = [
  {
    id: "1",
    ad: "Zeynep",
    soyad: "Arslan",
    tcKimlik: "12345678901",
    telefon: "0532 111 2233",
    email: "zeynep@example.com",
    dogumTarihi: "1990-05-15",
    isegirisTarihi: "2020-03-01",
    pozisyon: "Muhasebe Uzmanı",
    departman: "Finans",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-15",
  },
  {
    id: "2",
    ad: "Can",
    soyad: "Yıldız",
    tcKimlik: "23456789012",
    telefon: "0533 222 3344",
    email: "can@example.com",
    dogumTarihi: "1988-08-20",
    isegirisTarihi: "2019-06-15",
    pozisyon: "Üretim Şefi",
    departman: "Üretim",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-15",
  },
];

const mockSaglikTestleri: SaglikTesti[] = [
  {
    id: "1",
    ad: "Tam Kan Sayımı",
    kategoriId: "1",
    kategoriAdi: "Biyokimyasal Testler",
    aciklama: "Hemoglobin, lökosit, trombosit sayımları",
    birimFiyat: 150,
    sure: 15,
    periyot: 365,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "2",
    ad: "Akciğer Grafisi",
    kategoriId: "2",
    kategoriAdi: "Radyolojik Testler",
    aciklama: "Göğüs radyografisi çekimi",
    birimFiyat: 200,
    sure: 20,
    periyot: 365,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "3",
    ad: "Fizik Muayene",
    kategoriId: "3",
    kategoriAdi: "Fizik Muayene",
    aciklama: "Genel fiziksel muayene",
    birimFiyat: 100,
    sure: 30,
    periyot: 365,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "4",
    ad: "İşitme Testi",
    kategoriId: "4",
    kategoriAdi: "Odyometri",
    aciklama: "Odyometrik işitme testi",
    birimFiyat: 180,
    sure: 25,
    periyot: 365,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
  {
    id: "5",
    ad: "Akciğer Fonksiyon Testi",
    kategoriId: "5",
    kategoriAdi: "Spirometri",
    aciklama: "Spirometrik akciğer fonksiyon testi",
    birimFiyat: 250,
    sure: 30,
    periyot: 365,
    durum: "AKTIF",
    olusturmaTarihi: "2024-01-01",
  },
];

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

const mockTeklifler: FiyatTeklifi[] = [
  {
    id: "1",
    firmaId: "1",
    firmaAdi: "ABC Tekstil San. ve Tic. A.Ş.",
    kalemler: [
      {
        id: "1",
        testId: "1",
        testAdi: "Tam Kan Sayımı",
        miktar: 250,
        birimFiyat: 150,
        indirimYuzde: 10,
        toplam: 33750,
      },
      {
        id: "2",
        testId: "2",
        testAdi: "Akciğer Grafisi",
        miktar: 250,
        birimFiyat: 200,
        indirimYuzde: 5,
        toplam: 47500,
      },
    ],
    araToplam: 81250,
    kdvYuzde: 20,
    kdvTutar: 16250,
    genelToplam: 97500,
    durum: "GÖNDERİLDİ",
    gecerlilikTarihi: "2026-05-30",
    olusturmaTarihi: "2026-03-20",
  },
];

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

interface AppState {
  // Sidebar
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;

  // Kullanıcı
  kullanici: Kullanici | null;
  setKullanici: (kullanici: Kullanici | null) => void;
  girisYap: (email: string, sifre: string) => boolean;
  cikisYap: () => void;

  // Firmalar
  firmalar: Firma[];
  firmaEkle: (firma: Omit<Firma, "id" | "olusturmaTarihi">) => void;
  firmaGuncelle: (id: string, firma: Partial<Firma>) => void;
  firmaSil: (id: string) => void;
  firmaGetir: (id: string) => Firma | undefined;

  // Personeller
  personeller: Personel[];
  personelEkle: (personel: Omit<Personel, "id" | "olusturmaTarihi" | "firmaAdi">) => void;
  personelGuncelle: (id: string, personel: Partial<Personel>) => void;
  personelSil: (id: string) => void;

  // Sağlık Testleri
  saglikTestleri: SaglikTesti[];
  testEkle: (test: Omit<SaglikTesti, "id" | "olusturmaTarihi" | "kategoriAdi">) => void;
  testGuncelle: (id: string, test: Partial<SaglikTesti>) => void;
  testSil: (id: string) => void;

  // Randevular
  randevular: Randevu[];
  randevuEkle: (randevu: Omit<Randevu, "id" | "olusturmaTarihi" | "firmaAdi" | "testAdi" | "personelAdi">) => void;
  randevuGuncelle: (id: string, randevu: Partial<Randevu>) => void;
  randevuSil: (id: string) => void;

  // Teklifler
  teklifler: FiyatTeklifi[];
  teklifEkle: (teklif: Omit<FiyatTeklifi, "id" | "olusturmaTarihi" | "firmaAdi">) => void;
  teklifGuncelle: (id: string, teklif: Partial<FiyatTeklifi>) => void;
  teklifSil: (id: string) => void;

  // Taramalar
  taramalar: Tarama[];
  taramaEkle: (tarama: Omit<Tarama, "id" | "olusturmaTarihi" | "firmaAdi" | "atananPersonelAdi">) => void;
  taramaGuncelle: (id: string, tarama: Partial<Tarama>) => void;
  taramaSil: (id: string) => void;

  // Bildirimler
  bildirimler: Bildirim[];
  bildirimEkle: (bildirim: Omit<Bildirim, "id" | "olusturmaTarihi">) => void;
  bildirimOkundu: (id: string) => void;

  // İstatistikler
  istatistikler: DashboardIstatistik;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Sidebar
      sidebarCollapsed: false,
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      // Kullanıcı
      kullanici: mockKullanici,
      setKullanici: (kullanici) => set({ kullanici }),
      girisYap: (email, sifre) => {
        if (email === "admin@hantech.com" && sifre === "admin123") {
          set({ kullanici: mockKullanici });
          return true;
        }
        return false;
      },
      cikisYap: () => set({ kullanici: null }),

      // Firmalar
      firmalar: mockFirmalar,
      firmaEkle: (firma) => {
        const yeniFirma: Firma = {
          ...firma,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ firmalar: [...state.firmalar, yeniFirma] }));
      },
      firmaGuncelle: (id, firma) => {
        set((state) => ({
          firmalar: state.firmalar.map((f) => (f.id === id ? { ...f, ...firma } : f)),
        }));
      },
      firmaSil: (id) => {
        set((state) => ({ firmalar: state.firmalar.filter((f) => f.id !== id) }));
      },
      firmaGetir: (id) => {
        return get().firmalar.find((f) => f.id === id);
      },

      // Personeller
      personeller: mockPersoneller,
      personelEkle: (personel) => {
        const firma = get().firmalar.find((f) => f.id === personel.firmaId);
        const yeniPersonel: Personel = {
          ...personel,
          firmaAdi: firma?.ad,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ personeller: [...state.personeller, yeniPersonel] }));
      },
      personelGuncelle: (id, personel) => {
        set((state) => ({
          personeller: state.personeller.map((p) => (p.id === id ? { ...p, ...personel } : p)),
        }));
      },
      personelSil: (id) => {
        set((state) => ({ personeller: state.personeller.filter((p) => p.id !== id) }));
      },

      // Sağlık Testleri
      saglikTestleri: mockSaglikTestleri,
      testEkle: (test) => {
        const kategori = test.kategoriId; // Kategori adını ekleme gereksinimi yok, isterseniz eklenebilir
        const yeniTest: SaglikTesti = {
          ...test,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ saglikTestleri: [...state.saglikTestleri, yeniTest] }));
      },
      testGuncelle: (id, test) => {
        set((state) => ({
          saglikTestleri: state.saglikTestleri.map((t) => (t.id === id ? { ...t, ...test } : t)),
        }));
      },
      testSil: (id) => {
        set((state) => ({ saglikTestleri: state.saglikTestleri.filter((t) => t.id !== id) }));
      },

      // Randevular
      randevular: mockRandevular,
      randevuEkle: (randevu) => {
        const firma = get().firmalar.find((f) => f.id === randevu.firmaId);
        const test = get().saglikTestleri.find((t) => t.id === randevu.testId);
        const personel = randevu.personelId ? get().personeller.find((p) => p.id === randevu.personelId) : undefined;
        const yeniRandevu: Randevu = {
          ...randevu,
          firmaAdi: firma?.ad,
          testAdi: test?.ad,
          personelAdi: personel ? `${personel.ad} ${personel.soyad}` : undefined,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ randevular: [...state.randevular, yeniRandevu] }));
      },
      randevuGuncelle: (id, randevu) => {
        set((state) => ({
          randevular: state.randevular.map((r) => (r.id === id ? { ...r, ...randevu } : r)),
        }));
      },
      randevuSil: (id) => {
        set((state) => ({ randevular: state.randevular.filter((r) => r.id !== id) }));
      },

      // Teklifler
      teklifler: mockTeklifler,
      teklifEkle: (teklif) => {
        const firma = get().firmalar.find((f) => f.id === teklif.firmaId);
        const yeniTeklif: FiyatTeklifi = {
          ...teklif,
          firmaAdi: firma?.ad,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ teklifler: [...state.teklifler, yeniTeklif] }));
      },
      teklifGuncelle: (id, teklif) => {
        set((state) => ({
          teklifler: state.teklifler.map((t) => (t.id === id ? { ...t, ...teklif } : t)),
        }));
      },
      teklifSil: (id) => {
        set((state) => ({ teklifler: state.teklifler.filter((t) => t.id !== id) }));
      },

      // Taramalar
      taramalar: mockTaramalar,
      taramaEkle: (tarama) => {
        const firma = get().firmalar.find((f) => f.id === tarama.firmaId);
        const atananPersonel = tarama.atananPersonelId ? get().personeller.find((p) => p.id === tarama.atananPersonelId) : undefined;
        const yeniTarama: Tarama = {
          ...tarama,
          firmaAdi: firma?.ad,
          atananPersonelAdi: atananPersonel ? `${atananPersonel.ad} ${atananPersonel.soyad}` : undefined,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ taramalar: [...state.taramalar, yeniTarama] }));
      },
      taramaGuncelle: (id, tarama) => {
        set((state) => ({
          taramalar: state.taramalar.map((t) => (t.id === id ? { ...t, ...tarama } : t)),
        }));
      },
      taramaSil: (id) => {
        set((state) => ({ taramalar: state.taramalar.filter((t) => t.id !== id) }));
      },

      // Bildirimler
      bildirimler: mockBildirimler,
      bildirimEkle: (bildirim) => {
        const yeniBildirim: Bildirim = {
          ...bildirim,
          id: Math.random().toString(36).substring(2, 15),
          olusturmaTarihi: new Date().toISOString().split("T")[0],
        };
        set((state) => ({ bildirimler: [...state.bildirimler, yeniBildirim] }));
      },
      bildirimOkundu: (id) => {
        set((state) => ({
          bildirimler: state.bildirimler.map((b) => (b.id === id ? { ...b, okundu: true } : b)),
        }));
      },

      // İstatistikler
      istatistikler: {
        toplamFirma: mockFirmalar.length,
        aktifFirma: mockFirmalar.filter((f) => f.durum === "AKTIF").length,
        toplamPersonel: mockPersoneller.length,
        bugununRandevulari: mockRandevular.filter((r) => r.tarih === new Date().toISOString().split("T")[0]).length,
        bekleyenRandevular: mockRandevular.filter((r) => r.durum === "BEKLEMEDE").length,
        tamamlananTaramalar: mockTaramalar.filter((t) => t.durum === "TAMAMLANDI").length,
        aylikGelir: mockTeklifler.filter((t) => t.durum === "KABUL_EDİLDİ").reduce((sum, t) => sum + t.genelToplam, 0),
        bekleyenTeklifler: mockTeklifler.filter((t) => t.durum === "GÖNDERİLDİ").length,
      },
    }),
    {
      name: "hantech-storage",
    }
  )
);
