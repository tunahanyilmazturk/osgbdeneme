import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { formatPara, formatTarihKisa } from "./utils";

// ========== EXCEL EXPORT ==========

interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export function exportToExcel<T extends Record<string, unknown>>(
  data: T[],
  columns: ExcelColumn[],
  fileName: string,
  sheetName: string = "Sayfa1"
) {
  const headers = columns.map((c) => c.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const value = item[col.key];
      if (value === null || value === undefined) return "";
      if (typeof value === "number") return value;
      return String(value);
    })
  );

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Kolon genişlikleri
  ws["!cols"] = columns.map((col) => ({
    wch: col.width || 20,
  }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}_${formatTarihKisa(new Date())}.xlsx`);
}

// ========== PDF EXPORT ==========

export async function exportToPDF(
  elementId: string,
  fileName: string,
  orientation: "portrait" | "landscape" = "portrait"
) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("PDF export: Element bulunamadı:", elementId);
    return;
  }

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF(orientation, "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const imgWidth = pageWidth - 20;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 10;

  pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
  heightLeft -= pageHeight - 20;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight + 10;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
    heightLeft -= pageHeight - 20;
  }

  pdf.save(`${fileName}_${formatTarihKisa(new Date())}.pdf`);
}

// ========== HIZLI PDF (Tablo İçin) ==========

export function exportTableToPDF(
  headers: string[],
  rows: string[][],
  fileName: string,
  title: string = ""
) {
  const pdf = new jsPDF("landscape", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();

  // Başlık
  if (title) {
    pdf.setFontSize(16);
    pdf.text(title, pageWidth / 2, 15, { align: "center" });
    pdf.setFontSize(10);
    pdf.text(`Tarih: ${formatTarihKisa(new Date())}`, pageWidth / 2, 22, { align: "center" });
  }

  // Tablo
  const startY = title ? 30 : 15;
  const cellPadding = 3;
  const lineHeight = 7;
  const colWidth = (pageWidth - 20) / headers.length;

  // Header row
  pdf.setFillColor(59, 130, 246);
  pdf.rect(10, startY, pageWidth - 20, lineHeight, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);

  headers.forEach((header, i) => {
    pdf.text(header, 10 + i * colWidth + cellPadding, startY + 5);
  });

  // Data rows
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(8);
  let y = startY + lineHeight;

  rows.forEach((row, rowIndex) => {
    if (y > pdf.internal.pageSize.getHeight() - 15) {
      pdf.addPage();
      y = 15;
    }

    if (rowIndex % 2 === 0) {
      pdf.setFillColor(245, 247, 250);
      pdf.rect(10, y, pageWidth - 20, lineHeight, "F");
    }

    row.forEach((cell, i) => {
      const truncated = cell.length > 30 ? cell.substring(0, 28) + "..." : cell;
      pdf.text(truncated, 10 + i * colWidth + cellPadding, y + 5);
    });

    y += lineHeight;
  });

  pdf.save(`${fileName}_${formatTarihKisa(new Date())}.pdf`);
}

// ========== TURKISH TRANSLITERATION ==========

function turkishToAscii(text: string): string {
  const map: Record<string, string> = {
    'ı': 'i', 'İ': 'I', 'ş': 's', 'Ş': 'S', 'ğ': 'g', 'Ğ': 'G',
    'ü': 'u', 'Ü': 'U', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C',
  };
  return text.replace(/[ıİşŞğĞüÜöÖçÇ]/g, (c) => map[c] || c);
}

// ========== GELİŞMİŞ TEKLİF PDF ==========

interface TeklifPDFData {
  teklifNo: string;
  firmaAdi: string;
  firmaVergiNo?: string;
  firmaAdres?: string;
  firmaTelefon?: string;
  firmaEmail?: string;
  firmaIl?: string;
  firmaIlce?: string;
  firmaCalisanSayisi?: number;
  tarih: string;
  gecerlilikTarihi: string;
  durum: string;
  kdvYuzde: number;
  kalemler: { testAdi: string; miktar: number; birimFiyat: number; indirimYuzde: number; toplam: number }[];
  araToplam: number;
  kdvTutar: number;
  genelToplam: number;
  notlar?: string;
  osGBAdi?: string;
  osGBTelefon?: string;
  osGBEmail?: string;
  osGBAdres?: string;
}

export function generateTeklifPDF(data: TeklifPDFData) {
  const pdf = new jsPDF("portrait", "mm", "a4");
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  const primaryR = 37, primaryG = 99, primaryB = 235;
  const primaryLightR = 219, primaryLightG = 234, primaryLightB = 254;
  const darkR = 17, darkG = 24, darkB = 39;
  const grayR = 107, grayG = 114, grayB = 128;
  const lightGrayR = 243, lightGrayG = 244, lightGrayB = 246;
  const whiteR = 255, whiteG = 255, whiteB = 255;
  const greenR = 22, greenG = 163, greenB = 74;
  const redR = 220, redG = 38, redB = 38;

  let y = 0;

  // ===== HEADER =====
  pdf.setFillColor(primaryR, primaryG, primaryB);
  pdf.rect(0, 0, pageWidth, 42, "F");

  // Sol: OSGB bilgileri
  pdf.setTextColor(whiteR, whiteG, whiteB);
  pdf.setFontSize(20);
  pdf.setFont("helvetica", "bold");
  pdf.text(turkishToAscii(data.osGBAdi || "OSGB Saglik Hizmetleri"), margin, 16);

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  let infoY = 23;
  if (data.osGBTelefon) { pdf.text(`Tel: ${turkishToAscii(data.osGBTelefon)}`, margin, infoY); infoY += 5; }
  if (data.osGBEmail) { pdf.text(`E-posta: ${turkishToAscii(data.osGBEmail)}`, margin, infoY); infoY += 5; }
  if (data.osGBAdres) {
    const adresLines = pdf.splitTextToSize(turkishToAscii(data.osGBAdres), contentWidth * 0.45);
    pdf.text(adresLines, margin, infoY);
  }

  // Sag: Teklif bilgileri
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  pdf.text(`TEKLIF #${data.teklifNo}`, pageWidth - margin, 16, { align: "right" });

  pdf.setFontSize(8);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Tarih: ${data.tarih}`, pageWidth - margin, 23, { align: "right" });
  pdf.text(`Gecerlilik: ${data.gecerlilikTarihi}`, pageWidth - margin, 28, { align: "right" });

  // Durum badge
  const durumMap: Record<string, string> = {
    "KABUL_EDİLDİ": "KABUL EDILDI",
    "REDDEDİLDİ": "REDDEDILDI",
    "GÖNDERİLDİ": "GONDERILDI",
    "TASLAK": "TASLAK",
  };
  const durumText = durumMap[data.durum] || "TASLAK";
  const dR = data.durum === "KABUL_EDİLDİ" ? greenR : data.durum === "REDDEDİLDİ" ? redR : whiteR;
  const dG = data.durum === "KABUL_EDİLDİ" ? greenG : data.durum === "REDDEDİLDİ" ? redG : whiteG;
  const dB = data.durum === "KABUL_EDİLDİ" ? greenB : data.durum === "REDDEDİLDİ" ? redB : whiteB;
  pdf.setFillColor(dR, dG, dB);
  const dw = pdf.getTextWidth(durumText) + 8;
  pdf.roundedRect(pageWidth - margin - dw, 34, dw, 6, 1.5, 1.5, "F");
  pdf.setTextColor(primaryR, primaryG, primaryB);
  pdf.setFontSize(6.5);
  pdf.setFont("helvetica", "bold");
  pdf.text(durumText, pageWidth - margin - dw / 2, 38.5, { align: "center" });

  y = 50;

  // ===== FIRMA BILGILERI =====
  pdf.setTextColor(primaryR, primaryG, primaryB);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("FIRMA BILGILERI", margin, y);
  y += 1.5;
  pdf.setDrawColor(primaryR, primaryG, primaryB);
  pdf.setLineWidth(0.6);
  pdf.line(margin, y, margin + 45, y);
  y += 5;

  pdf.setTextColor(darkR, darkG, darkB);
  pdf.setFontSize(13);
  pdf.setFont("helvetica", "bold");
  pdf.text(turkishToAscii(data.firmaAdi), margin, y);
  y += 6;

  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "normal");
  pdf.setTextColor(grayR, grayG, grayB);

  const firmaBilgileri = [
    data.firmaVergiNo ? `Vergi No: ${data.firmaVergiNo}` : null,
    data.firmaTelefon ? `Telefon: ${data.firmaTelefon}` : null,
    data.firmaEmail ? `E-posta: ${data.firmaEmail}` : null,
    data.firmaCalisanSayisi ? `Calisan Sayisi: ${data.firmaCalisanSayisi}` : null,
    (data.firmaIl || data.firmaIlce) ? `Adres: ${turkishToAscii(data.firmaIl || "")}${data.firmaIlce ? ", " + turkishToAscii(data.firmaIlce) : ""}` : null,
  ].filter(Boolean);

  firmaBilgileri.forEach((info) => {
    if (y > pageHeight - 20) { pdf.addPage(); y = margin; }
    pdf.text(info!, margin, y);
    y += 4.5;
  });

  y += 3;

  // ===== ON YAZI =====
  if (data.notlar) {
    if (y > pageHeight - 40) { pdf.addPage(); y = margin; }
    pdf.setTextColor(primaryR, primaryG, primaryB);
    pdf.setFontSize(11);
    pdf.setFont("helvetica", "bold");
    pdf.text("SAYIN YETKILI", margin, y);
    y += 1.5;
    pdf.setDrawColor(primaryR, primaryG, primaryB);
    pdf.line(margin, y, margin + 35, y);
    y += 5;

    pdf.setTextColor(50, 50, 50);
    pdf.setFontSize(8.5);
    pdf.setFont("helvetica", "normal");
    const notLines = pdf.splitTextToSize(turkishToAscii(data.notlar), contentWidth);
    notLines.forEach((line: string) => {
      if (y > pageHeight - 20) { pdf.addPage(); y = margin; }
      pdf.text(line, margin, y);
      y += 4.5;
    });
    y += 4;
  }

  // ===== HIZMET KALEMLERI =====
  if (y > pageHeight - 40) { pdf.addPage(); y = margin; }
  pdf.setTextColor(primaryR, primaryG, primaryB);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("HIZMET KALEMLERI VE FIYATLANDIRMA", margin, y);
  y += 1.5;
  pdf.setDrawColor(primaryR, primaryG, primaryB);
  pdf.line(margin, y, margin + 70, y);
  y += 5;

  const colW = [10, contentWidth * 0.38, 18, 24, 18, 24];
  const hdrs = ["No", "Hizmet Adi", "Miktar", "Birim Fiyat", "Ind.", "Toplam"];

  // Tablo header
  pdf.setFillColor(primaryR, primaryG, primaryB);
  pdf.roundedRect(margin, y - 3.5, contentWidth, 8, 1, 1, "F");

  pdf.setTextColor(whiteR, whiteG, whiteB);
  pdf.setFontSize(7.5);
  pdf.setFont("helvetica", "bold");
  let cx = margin + 2;
  hdrs.forEach((h, i) => {
    const align = i >= 2 ? "right" : i === 0 ? "center" : "left";
    const xp = align === "right" ? margin + colW.slice(0, i + 1).reduce((a, b) => a + b, 0) - 2 : align === "center" ? margin + colW[0] / 2 : cx;
    pdf.text(h, xp, y + 1, { align });
    cx += colW[i];
  });

  y += 6.5;

  // Tablo satirlari
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);

  data.kalemler.forEach((kalem, idx) => {
    if (y > pageHeight - 35) {
      pdf.addPage();
      y = margin;
      pdf.setFillColor(primaryR, primaryG, primaryB);
      pdf.roundedRect(margin, y - 3.5, contentWidth, 8, 1, 1, "F");
      pdf.setTextColor(whiteR, whiteG, whiteB);
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7.5);
      cx = margin + 2;
      hdrs.forEach((h, i) => {
        const align = i >= 2 ? "right" : i === 0 ? "center" : "left";
        const xp = align === "right" ? margin + colW.slice(0, i + 1).reduce((a, b) => a + b, 0) - 2 : align === "center" ? margin + colW[0] / 2 : cx;
        pdf.text(h, xp, y + 1, { align });
        cx += colW[i];
      });
      y += 6.5;
    }

    if (idx % 2 === 0) {
      pdf.setFillColor(lightGrayR, lightGrayG, lightGrayB);
      pdf.rect(margin, y - 3, contentWidth, 7.5, "F");
    }

    pdf.setTextColor(darkR, darkG, darkB);
    pdf.setFont("helvetica", "normal");

    pdf.text(String(idx + 1), margin + colW[0] / 2, y + 1, { align: "center" });
    pdf.text(turkishToAscii(kalem.testAdi), margin + colW[0] + 2, y + 1);
    pdf.text(String(kalem.miktar), margin + colW.slice(0, 2).reduce((a, b) => a + b, 0) + colW[2] - 2, y + 1, { align: "right" });
    pdf.text(formatPara(kalem.birimFiyat), margin + colW.slice(0, 3).reduce((a, b) => a + b, 0) + colW[3] - 2, y + 1, { align: "right" });
    if (kalem.indirimYuzde > 0) {
      pdf.setTextColor(greenR, greenG, greenB);
      pdf.setFont("helvetica", "bold");
    }
    pdf.text(kalem.indirimYuzde > 0 ? `%${kalem.indirimYuzde}` : "-", margin + colW.slice(0, 4).reduce((a, b) => a + b, 0) + colW[4] - 2, y + 1, { align: "right" });
    pdf.setTextColor(darkR, darkG, darkB);
    pdf.setFont("helvetica", "bold");
    pdf.text(formatPara(kalem.toplam), margin + colW.slice(0, 5).reduce((a, b) => a + b, 0) + colW[5] - 2, y + 1, { align: "right" });

    y += 7.5;
  });

  // ===== TOPLAM =====
  y += 3;
  const tBoxH = 26;
  if (y + tBoxH > pageHeight - 20) { pdf.addPage(); y = margin; }

  pdf.setFillColor(primaryLightR, primaryLightG, primaryLightB);
  pdf.roundedRect(margin + contentWidth * 0.38, y, contentWidth * 0.62, tBoxH, 2, 2, "F");

  const tX = margin + contentWidth * 0.38 + 5;
  let tY = y + 5;

  pdf.setFontSize(8.5);
  pdf.setTextColor(grayR, grayG, grayB);
  pdf.setFont("helvetica", "normal");
  pdf.text("Ara Toplam:", tX, tY);
  pdf.text(formatPara(data.araToplam), margin + contentWidth - 5, tY, { align: "right" });
  tY += 5.5;

  pdf.text(`KDV (%${data.kdvYuzde}):`, tX, tY);
  pdf.text(formatPara(data.kdvTutar), margin + contentWidth - 5, tY, { align: "right" });
  tY += 1;

  pdf.setDrawColor(primaryR, primaryG, primaryB);
  pdf.setLineWidth(0.4);
  pdf.line(tX, tY, margin + contentWidth - 5, tY);
  tY += 5;

  pdf.setTextColor(primaryR, primaryG, primaryB);
  pdf.setFontSize(11);
  pdf.setFont("helvetica", "bold");
  pdf.text("GENEL TOPLAM:", tX, tY);
  pdf.text(formatPara(data.genelToplam), margin + contentWidth - 5, tY, { align: "right" });

  // ===== FOOTER =====
  pdf.setDrawColor(200, 200, 200);
  pdf.setLineWidth(0.3);
  pdf.line(margin, pageHeight - 18, pageWidth - margin, pageHeight - 18);

  pdf.setTextColor(grayR, grayG, grayB);
  pdf.setFontSize(7);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Bu teklif ${data.gecerlilikTarihi} tarihine kadar gecerlidir.`, pageWidth / 2, pageHeight - 12, { align: "center" });
  pdf.text(`Olusturulma: ${data.tarih}  |  Teklif No: #${data.teklifNo}  |  ${turkishToAscii(data.osGBAdi || "OSGB")}`, pageWidth / 2, pageHeight - 7, { align: "center" });

  const safeName = turkishToAscii(data.firmaAdi).replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "_");
  pdf.save(`Teklif_${data.teklifNo}_${safeName}.pdf`);
}

// ========== ÖZEL EXPORT FONKSİYONLARI ==========

export function exportFirmalar(firmalar: any[]) {
  exportToExcel(
    firmalar.map((f) => ({ ...f })),
    [
      { header: "Firma Adı", key: "ad", width: 30 },
      { header: "Sektör", key: "sektor", width: 15 },
      { header: "Vergi No", key: "vergiNo", width: 15 },
      { header: "İl", key: "il", width: 12 },
      { header: "İlçe", key: "ilce", width: 15 },
      { header: "Telefon", key: "telefon", width: 15 },
      { header: "E-posta", key: "email", width: 25 },
      { header: "Yetkili Kişi", key: "yetkiliKisi", width: 20 },
      { header: "Çalışan Sayısı", key: "calisanSayisi", width: 15 },
      { header: "Durum", key: "durum", width: 10 },
    ],
    "firmalar_raporu",
    "Firmalar"
  );
}

export function exportPersoneller(personeller: any[]) {
  exportToExcel(
    personeller.map((p) => ({ ...p })),
    [
      { header: "Ad", key: "ad", width: 15 },
      { header: "Soyad", key: "soyad", width: 15 },
      { header: "Pozisyon", key: "pozisyon", width: 25 },
      { header: "Telefon", key: "telefon", width: 15 },
      { header: "E-posta", key: "email", width: 25 },
      { header: "Doğum Tarihi", key: "dogumTarihi", width: 12 },
      { header: "İşe Giriş", key: "isegirisTarihi", width: 12 },
      { header: "Durum", key: "durum", width: 10 },
    ],
    "personel_raporu",
    "Personel"
  );
}

export function exportRandevular(randevular: any[]) {
  exportToExcel(
    randevular.map((r) => ({ ...r })),
    [
      { header: "Firma", key: "firmaAdi", width: 30 },
      { header: "Personel", key: "personelAdi", width: 20 },
      { header: "Test", key: "testAdi", width: 20 },
      { header: "Tarih", key: "tarih", width: 12 },
      { header: "Başlangıç", key: "baslangicSaati", width: 10 },
      { header: "Bitiş", key: "bitisSaati", width: 10 },
      { header: "Durum", key: "durum", width: 15 },
    ],
    "randevular_raporu",
    "Randevular"
  );
}

export function exportTeklifler(teklifler: any[]) {
  exportToExcel(
    teklifler.map((t) => ({
      ...t,
      firmaAdi: t.firmaAdi,
      toplam: formatPara(t.genelToplam),
    })),
    [
      { header: "Firma", key: "firmaAdi", width: 30 },
      { header: "Ara Toplam", key: "araToplam", width: 15 },
      { header: "KDV", key: "kdvTutar", width: 15 },
      { header: "Genel Toplam", key: "toplam", width: 15 },
      { header: "Durum", key: "durum", width: 15 },
      { header: "Geçerlilik", key: "gecerlilikTarihi", width: 12 },
    ],
    "teklifler_raporu",
    "Teklifler"
  );
}

// ========== SAĞLIK TESTLERİ EXCEL SİSTEMİ ==========

const TEST_EXPORT_COLUMNS: ExcelColumn[] = [
  { header: "Test Adı *", key: "ad", width: 30 },
  { header: "Kategori *", key: "kategori", width: 25 },
  { header: "Birim Fiyat (₺) *", key: "birimFiyat", width: 15 },
  { header: "Durum", key: "durum", width: 12 },
];

const TEST_DURUM_ETIKETLERI: Record<string, string> = {
  AKTIF: "Aktif",
  PASIF: "Pasif",
};

export function exportTestSablonu(kategoriler: { id: string; ad: string }[]) {
  const columns = [
    ...TEST_EXPORT_COLUMNS,
    { header: "", key: "_aciklama", width: 50 },
  ];

  const aciklamaSatirlari = [
    { ad: "", kategori: "", birimFiyat: "", durum: "", _aciklama: "NOT: * işaretli alanlar zorunludur" },
    { ad: "", kategori: "", birimFiyat: "", durum: "", _aciklama: "Durum: AKTIF veya PASIF (varsayılan: AKTIF)" },
    { ad: "", kategori: "", birimFiyat: "", durum: "", _aciklama: "Geçerli Kategoriler:" },
    ...kategoriler.map((k) => ({ ad: "", kategori: "", birimFiyat: "", durum: "", _aciklama: `  - ${k.ad}` })),
    { ad: "", kategori: "", birimFiyat: "", durum: "", _aciklama: "Örnek: Tam Kan Sayımı | Biyokimyasal Testler | 150 | AKTIF" },
  ];

  const headers = columns.map((c) => c.header);
  const rows = aciklamaSatirlari.map((item) =>
    columns.map((col) => {
      const value = (item as any)[col.key];
      return value === null || value === undefined ? "" : String(value);
    })
  );

  const wsData = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  ws["!cols"] = columns.map((col) => ({ wch: col.width || 20 }));

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Şablon");
  XLSX.writeFile(wb, `saglik_testi_sablonu_${formatTarihKisa(new Date())}.xlsx`);
}

export function exportMevcutTestler(testler: any[], kategoriler: { id: string; ad: string }[]) {
  const columns = [
    ...TEST_EXPORT_COLUMNS,
    { header: "Mevcut ID", key: "id", width: 15 },
  ];

  const data = testler.map((t) => ({
    ad: t.ad,
    kategori: t.kategoriAdi || "",
    birimFiyat: t.birimFiyat,
    durum: TEST_DURUM_ETIKETLERI[t.durum] || t.durum,
    id: t.id,
  }));

  exportToExcel(data, columns, "mevcut_testler", "Mevcut Testler");
}

export interface TestImportSonuc {
  basarili: { ad: string; kategori: string; birimFiyat: number; durum: string }[];
  hatalar: { satir: number; ad: string; hata: string }[];
  guncellenen: { ad: string; eskiFiyat: number; yeniFiyat: number }[];
  atlanan: { satir: number; ad: string; sebep: string }[];
}

export function importTestler(
  file: File,
  mevcutTestler: any[],
  kategoriler: { id: string; ad: string }[],
  mod: "ekle" | "guncelle" | "ekle-guncelle" = "ekle-guncelle"
): Promise<TestImportSonuc> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        const sonuc: TestImportSonuc = {
          basarili: [],
          hatalar: [],
          guncellenen: [],
          atlanan: [],
        };

        const kategoriMap = new Map(kategoriler.map((k) => [k.ad.toLowerCase(), k]));
        const mevcutTestMap = new Map(mevcutTestler.map((t) => [t.ad.toLowerCase(), t]));

        jsonData.forEach((row, index) => {
          const satirNo = index + 2; // Excel'de başlık + 1

          // Boş satırları atla
          const ad = String(row["Test Adı *"] || row["Test Adı"] || "").trim();
          if (!ad) {
            if (row["Kategori"] || row["Birim Fiyat"]) {
              sonuc.hatalar.push({ satir: satirNo, ad: ad || "(boş)", hata: "Test adı zorunludur" });
            }
            return;
          }

          const kategoriAd = String(row["Kategori *"] || row["Kategori"] || "").trim();
          const birimFiyatStr = String(row["Birim Fiyat (₺) *"] || row["Birim Fiyat"] || "").trim();
          const durumStr = String(row["Durum"] || "AKTIF").trim().toUpperCase();

          // Validasyonlar
          if (!kategoriAd) {
            sonuc.hatalar.push({ satir: satirNo, ad, hata: "Kategori zorunludur" });
            return;
          }

          const kategori = kategoriMap.get(kategoriAd.toLowerCase());
          if (!kategori) {
            sonuc.hatalar.push({ satir: satirNo, ad, hata: `"${kategoriAd}" kategorisi bulunamadı. Geçerli kategoriler: ${kategoriler.map((k) => k.ad).join(", ")}` });
            return;
          }

          const birimFiyat = parseFloat(birimFiyatStr);
          if (isNaN(birimFiyat) || birimFiyat < 0) {
            sonuc.hatalar.push({ satir: satirNo, ad, hata: "Geçerli bir fiyat giriniz (0 veya daha büyük)" });
            return;
          }

          const durum = durumStr === "PASIF" ? "PASIF" : "AKTIF";

          // Çakışma kontrolü
          const mevcutTest = mevcutTestMap.get(ad.toLowerCase());

          if (mevcutTest) {
            if (mod === "ekle") {
              sonuc.atlanan.push({ satir: satirNo, ad, sebep: "Aynı ada sahip test zaten mevcut (ekle modu)" });
              return;
            }

            if (mod === "guncelle" || mod === "ekle-guncelle") {
              sonuc.guncellenen.push({
                ad,
                eskiFiyat: mevcutTest.birimFiyat,
                yeniFiyat: birimFiyat,
              });
              sonuc.basarili.push({ ad, kategori: kategori.ad, birimFiyat, durum });
              return;
            }
          }

          // Yeni test ekleme
          if (mod === "guncelle") {
            sonuc.atlanan.push({ satir: satirNo, ad, sebep: "Test mevcut değil (güncelle modu)" });
            return;
          }

          sonuc.basarili.push({ ad, kategori: kategori.ad, birimFiyat, durum });
        });

        resolve(sonuc);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("Dosya okunamadı"));
    reader.readAsArrayBuffer(file);
  });
}

export function applyImportedTests(
  sonuc: TestImportSonuc,
  mevcutTestler: any[],
  testEkle: (test: any) => void,
  testGuncelle: (id: string, test: any) => void,
  kategoriler: { id: string; ad: string }[]
) {
  const kategoriMap = new Map(kategoriler.map((k) => [k.ad.toLowerCase(), k]));
  const mevcutTestMap = new Map(mevcutTestler.map((t) => [t.ad.toLowerCase(), t]));

  sonuc.basarili.forEach((item) => {
    const kategori = kategoriMap.get(item.kategori.toLowerCase());
    if (!kategori) return;

    const mevcutTest = mevcutTestMap.get(item.ad.toLowerCase());

    if (mevcutTest && sonuc.guncellenen.some((g) => g.ad.toLowerCase() === item.ad.toLowerCase())) {
      testGuncelle(mevcutTest.id, {
        birimFiyat: item.birimFiyat,
        durum: item.durum,
        kategoriId: kategori.id,
        kategoriAdi: kategori.ad,
      });
    } else if (!mevcutTest) {
      testEkle({
        ad: item.ad,
        kategoriId: kategori.id,
        kategoriAdi: kategori.ad,
        birimFiyat: item.birimFiyat,
        durum: item.durum,
      });
    }
  });
}
