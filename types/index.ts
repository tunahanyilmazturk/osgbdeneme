// Kullanıcı Rolleri
export type KullaniciRolü = "ADMIN" | "DOKTOR" | "HEMŞİRE" | "SEKRETER" | "GÖRÜNTÜLEYİCİ";

// Durumlar
export type GenelDurum = "AKTIF" | "PASIF" | "BEKLEMEDE";
export type RandevuDurumu = "BEKLEMEDE" | "ONAYLANDI" | "DEVAM_EDIYOR" | "TAMAMLANDI" | "IPTAL";
export type TeklifDurumu = "TASLAK" | "GÖNDERİLDİ" | "KABUL_EDİLDİ" | "REDDEDİLDİ";
export type TaramaDurumu = "PLANLANDI" | "DEVAM_EDIYOR" | "TAMAMLANDI" | "IPTAL";

// Kullanıcı
export interface Kullanici {
  id: string;
  ad: string;
  soyad: string;
  email: string;
  telefon: string;
  rol: KullaniciRolü;
  durum: GenelDurum;
  avatar?: string;
  olusturmaTarihi: string;
}

// Firma
export interface Firma {
  id: string;
  ad: string;
  vergiNo: string;
  adres: string;
  il: string;
  ilce: string;
  sektor: string;
  telefon: string;
  email: string;
  yetkiliKisi: string;
  calisanSayisi: number;
  durum: GenelDurum;
  notlar?: string;
  olusturmaTarihi: string;
}

// Personel
export interface Personel {
  id: string;
  ad: string;
  soyad: string;
  tcKimlik: string;
  telefon: string;
  email: string;
  dogumTarihi: string;
  isegirisTarihi: string;
  pozisyon: string;
  departman: string;
  firmaId: string;
  firmaAdi?: string;
  durum: GenelDurum;
  olusturmaTarihi: string;
}

// Test Kategorisi
export interface TestKategorisi {
  id: string;
  ad: string;
  aciklama?: string;
}

// Sağlık Testi
export interface SaglikTesti {
  id: string;
  ad: string;
  kategoriId: string;
  kategoriAdi?: string;
  aciklama: string;
  birimFiyat: number;
  sure: number; // dakika cinsinden
  periyot: number; // gün cinsinden (kaç günde bir tekrarlanacak)
  durum: GenelDurum;
  olusturmaTarihi: string;
}

// Randevu
export interface Randevu {
  id: string;
  firmaId: string;
  firmaAdi?: string;
  personelId?: string;
  personelAdi?: string;
  testId: string;
  testAdi?: string;
  tarih: string;
  baslangicSaati: string;
  bitisSaati: string;
  durum: RandevuDurumu;
  notlar?: string;
  olusturmaTarihi: string;
}

// Teklif Kalemi
export interface TeklifKalemi {
  id: string;
  testId: string;
  testAdi: string;
  miktar: number;
  birimFiyat: number;
  indirimYuzde: number;
  toplam: number;
}

// Fiyat Teklifi
export interface FiyatTeklifi {
  id: string;
  firmaId: string;
  firmaAdi?: string;
  kalemler: TeklifKalemi[];
  araToplam: number;
  kdvYuzde: number;
  kdvTutar: number;
  genelToplam: number;
  durum: TeklifDurumu;
  notlar?: string;
  gecerlilikTarihi: string;
  olusturmaTarihi: string;
}

// Tarama
export interface Tarama {
  id: string;
  ad: string;
  firmaId: string;
  firmaAdi?: string;
  personelIds: string[];
  testIds: string[];
  planlananTarih: string;
  durum: TaramaDurumu;
  atananPersonelId?: string;
  atananPersonelAdi?: string;
  sonuc?: string;
  notlar?: string;
  olusturmaTarihi: string;
}

// Takvim Etkinliği
export interface TakvimEtkinligi {
  id: string;
  baslik: string;
  baslangic: Date;
  bitis: Date;
  tur: "randevu" | "tarama" | "muayene" | "diger";
  renk: string;
  aciklama?: string;
}

// Bildirim
export interface Bildirim {
  id: string;
  baslik: string;
  mesaj: string;
  okundu: boolean;
  olusturmaTarihi: string;
}

// Dashboard İstatistik
export interface DashboardIstatistik {
  toplamFirma: number;
  aktifFirma: number;
  toplamPersonel: number;
  bugununRandevulari: number;
  bekleyenRandevular: number;
  tamamlananTaramalar: number;
  aylikGelir: number;
  bekleyenTeklifler: number;
}
