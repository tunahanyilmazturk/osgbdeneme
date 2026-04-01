export const SEKTOR_LISTESI = [
  "İmalat",
  "İnşaat",
  "Ticaret",
  "Hizmet",
  "Eğitim",
  "Sağlık",
  "Ulaştırma",
  "Bilişim",
  "Turizm",
  "Diğer",
] as const;

export const ILLER = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Aksaray", "Amasya", "Ankara", "Antalya",
  "Ardahan", "Artvin", "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bilecik",
  "Bingöl", "Bitlis", "Bolu", "Burdur", "Bursa", "Çanakkale", "Çankırı", "Çorum",
  "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ", "Erzincan", "Erzurum", "Eskişehir",
  "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay", "Iğdır", "Isparta", "İstanbul",
  "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Kars", "Kastamonu", "Kayseri", "Kırıkkale",
  "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya", "Kütahya", "Malatya", "Manisa",
  "Mardin", "Mersin", "Muğla", "Muş", "Nevşehir", "Niğde", "Ordu", "Osmaniye",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şanlıurfa", "Şırnak",
  "Tekirdağ", "Tokat", "Trabzon", "Tunceli", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak",
] as const;

export const TEST_KATEGORILERI = [
  { id: "1", ad: "Biyokimyasal Testler" },
  { id: "2", ad: "Radyolojik Testler" },
  { id: "3", ad: "Fizik Muayene" },
  { id: "4", ad: "Odyometri" },
  { id: "5", ad: "Spirometri" },
  { id: "6", ad: "EKG" },
] as const;

export const DURUM_RENKLERI = {
  AKTIF: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  PASIF: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  BEKLEMEDE: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  ONAYLANDI: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  DEVAM_EDIYOR: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  TAMAMLANDI: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  IPTAL: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  TASLAK: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
  GÖNDERİLDİ: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  KABUL_EDİLDİ: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  REDDEDİLDİ: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  PLANLANDI: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
} as const;

export const DURUM_ETIKETLERI = {
  AKTIF: "Aktif",
  PASIF: "Pasif",
  BEKLEMEDE: "Beklemede",
  ONAYLANDI: "Onaylandı",
  DEVAM_EDIYOR: "Devam Ediyor",
  TAMAMLANDI: "Tamamlandı",
  IPTAL: "İptal",
  TASLAK: "Taslak",
  GÖNDERİLDİ: "Gönderildi",
  KABUL_EDİLDİ: "Kabul Edildi",
  REDDEDİLDİ: "Reddedildi",
  PLANLANDI: "Planlandı",
} as const;

export const ROL_ETIKETLERI = {
  ADMIN: "Yönetici",
  DOKTOR: "Doktor",
  HEMŞİRE: "Hemşire",
  SEKRETER: "Sekreter",
  GÖRÜNTÜLEYİCİ: "Görüntüleyici",
} as const;

export const SAYFA_BASINA_KAYIT = 10;
export const KDV_ORANI = 20; // %20
