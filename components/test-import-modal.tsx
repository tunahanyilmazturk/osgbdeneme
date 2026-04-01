"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertCircle,
  SkipForward,
  RotateCw,
  Loader2,
} from "lucide-react";
import {
  exportTestSablonu,
  exportMevcutTestler,
  importTestler,
  applyImportedTests,
  type TestImportSonuc,
} from "@/lib/export";

interface TestImportModalProps {
  open: boolean;
  onClose: () => void;
  mevcutTestler: any[];
  kategoriler: { id: string; ad: string }[];
  testEkle: (test: any) => void;
  testGuncelle: (id: string, test: any) => void;
  onBasarili: () => void;
}

type ImportModu = "ekle" | "guncelle" | "ekle-guncelle";

export default function TestImportModal({
  open,
  onClose,
  mevcutTestler,
  kategoriler,
  testEkle,
  testGuncelle,
  onBasarili,
}: TestImportModalProps) {
  const [mod, setMod] = useState<ImportModu>("ekle-guncelle");
  const [dosya, setDosya] = useState<File | null>(null);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [sonuc, setSonuc] = useState<TestImportSonuc | null>(null);
  const [onizleme, setOnizleme] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSablonIndir = () => {
    exportTestSablonu(kategoriler);
  };

  const handleMevcutIndir = () => {
    exportMevcutTestler(mevcutTestler, kategoriler);
  };

  const handleDosyaSec = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setDosya(file);
      setSonuc(null);
      setOnizleme(false);
    }
  };

  const handleOnizleme = async () => {
    if (!dosya) return;
    setYukleniyor(true);
    try {
      const importSonuc = await importTestler(dosya, mevcutTestler, kategoriler, mod);
      setSonuc(importSonuc);
      setOnizleme(true);
    } catch (err) {
      console.error("Önizleme hatası:", err);
    } finally {
      setYukleniyor(false);
    }
  };

  const handleImport = () => {
    if (!sonuc) return;
    applyImportedTests(sonuc, mevcutTestler, testEkle, testGuncelle, kategoriler);
    onBasarili();
    handleClose();
  };

  const handleClose = () => {
    setDosya(null);
    setSonuc(null);
    setOnizleme(false);
    setYukleniyor(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onClose();
  };

  if (!open) return null;

  const toplamIslem = sonuc ? sonuc.basarili.length : 0;
  const toplamHata = sonuc ? sonuc.hatalar.length : 0;
  const toplamAtlanan = sonuc ? sonuc.atlanan.length : 0;
  const toplamGuncellenen = sonuc ? sonuc.guncellenen.length : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
        <CardContent className="p-6">
          {/* Başlık */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Excel ile Test Yönetimi</h3>
                <p className="text-sm text-muted-foreground">Toplu test ekleme ve güncelleme</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Mod Seçimi */}
          <div className="mb-6">
            <label className="text-sm font-medium mb-2 block">İşlem Modu</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "ekle" as ImportModu, baslik: "Ekle", aciklama: "Yeni test ekle, çakışanları atla" },
                { value: "guncelle" as ImportModu, baslik: "Güncelle", aciklama: "Mevcut testleri güncelle" },
                { value: "ekle-guncelle" as ImportModu, baslik: "Ekle + Güncelle", aciklama: "Hem ekle hem güncelle" },
              ].map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setMod(m.value);
                    setSonuc(null);
                    setOnizleme(false);
                  }}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    mod === m.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <p className="text-sm font-medium">{m.baslik}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{m.aciklama}</p>
                </button>
              ))}
            </div>
          </div>

          {/* İndirme Butonları */}
          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={handleSablonIndir} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Şablon İndir
            </Button>
            <Button variant="outline" size="sm" onClick={handleMevcutIndir} className="flex-1">
              <Download className="mr-2 h-4 w-4" />
              Mevcut Testleri İndir
            </Button>
          </div>

          {/* Dosya Yükleme */}
          {!onizleme && (
            <div className="mb-6">
              <div
                className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
                  dosya ? "border-primary/50 bg-primary/5" : "border-border hover:border-primary/30"
                }`}
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleDosyaSec}
                  className="hidden"
                />
                {dosya ? (
                  <div>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <FileSpreadsheet className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium">{dosya.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(dosya.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDosya(null);
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X className="mr-1 h-3 w-3" />
                      Kaldır
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                    <p className="font-medium">Excel dosyasını sürükleyin veya tıklayın</p>
                    <p className="text-xs text-muted-foreground mt-1">.xlsx veya .xls formatında</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Önizleme Butonu */}
          {!onizleme && dosya && (
            <Button
              variant="gradient"
              className="w-full mb-6"
              onClick={handleOnizleme}
              disabled={yukleniyor}
            >
              {yukleniyor ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analiz Ediliyor...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Önizle ve İçe Aktar
                </>
              )}
            </Button>
          )}

          {/* Sonuçlar */}
          {onizleme && sonuc && (
            <div className="space-y-4">
              {/* Özet */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg bg-green-50 dark:bg-green-950/30 p-3 text-center">
                  <p className="text-2xl font-bold text-green-600">{toplamIslem}</p>
                  <p className="text-xs text-green-700 dark:text-green-400">İşlenecek</p>
                </div>
                {toplamGuncellenen > 0 && (
                  <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3 text-center">
                    <p className="text-2xl font-bold text-blue-600">{toplamGuncellenen}</p>
                    <p className="text-xs text-blue-700 dark:text-blue-400">Güncellenecek</p>
                  </div>
                )}
                {toplamHata > 0 && (
                  <div className="rounded-lg bg-red-50 dark:bg-red-950/30 p-3 text-center">
                    <p className="text-2xl font-bold text-red-600">{toplamHata}</p>
                    <p className="text-xs text-red-700 dark:text-red-400">Hata</p>
                  </div>
                )}
                {toplamAtlanan > 0 && (
                  <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">{toplamAtlanan}</p>
                    <p className="text-xs text-amber-700 dark:text-amber-400">Atlanan</p>
                  </div>
                )}
              </div>

              {/* Hatalar */}
              {sonuc.hatalar.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <p className="text-sm font-medium text-red-600">Hatalar ({sonuc.hatalar.length})</p>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {sonuc.hatalar.map((h, i) => (
                        <div key={i} className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded p-2">
                          <span className="font-medium">Satır {h.satir}:</span> {h.ad} — {h.hata}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Atlananlar */}
              {sonuc.atlanan.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <SkipForward className="h-4 w-4 text-amber-500" />
                      <p className="text-sm font-medium text-amber-600">Atlananlar ({sonuc.atlanan.length})</p>
                    </div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {sonuc.atlanan.map((a, i) => (
                        <div key={i} className="text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 rounded p-2">
                          <span className="font-medium">Satır {a.satir}:</span> {a.ad} — {a.sebep}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Başarılılar */}
              {sonuc.basarili.length > 0 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <p className="text-sm font-medium text-green-600">İşlenecek Testler ({sonuc.basarili.length})</p>
                    </div>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto">
                      {sonuc.basarili.map((b, i) => {
                        const guncelleme = sonuc.guncellenen.find((g) => g.ad.toLowerCase() === b.ad.toLowerCase());
                        return (
                          <div key={i} className="text-xs flex items-center justify-between bg-green-50 dark:bg-green-950/30 rounded p-2">
                            <div>
                              <span className="font-medium">{b.ad}</span>
                              <span className="text-muted-foreground ml-2">{b.kategori}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {guncelleme && (
                                <span className="text-amber-600">
                                  {guncelleme.eskiFiyat}₺ → {guncelleme.yeniFiyat}₺
                                </span>
                              )}
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-[10px]">
                                {guncelleme ? "Güncellenecek" : "Yeni"}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Butonlar */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setOnizleme(false)}>
                  <RotateCw className="mr-2 h-4 w-4" />
                  Geri
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={handleImport}
                  disabled={sonuc.basarili.length === 0}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  İçe Aktar ({toplamIslem} test)
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
