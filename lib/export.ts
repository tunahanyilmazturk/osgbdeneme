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
      { header: "TC Kimlik", key: "tcKimlik", width: 15 },
      { header: "Firma", key: "firmaAdi", width: 30 },
      { header: "Pozisyon", key: "pozisyon", width: 20 },
      { header: "Departman", key: "departman", width: 15 },
      { header: "Telefon", key: "telefon", width: 15 },
      { header: "E-posta", key: "email", width: 25 },
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
