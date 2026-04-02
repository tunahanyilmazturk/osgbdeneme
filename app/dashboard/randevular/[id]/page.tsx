"use client";

import { useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { useRandevuStore, useFirmaStore, usePersonelStore, useSaglikTestiStore } from "@/lib/stores";
import { formatPara } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Edit,
  Trash2,
  FileText,
  Building2,
  Calendar,
  Clock,
  User,
  TestTube2,
  Printer,
  Download,
  Check,
  X,
  Save,
  Mail,
  Phone,
  MapPin,
  FileDown,
  ChevronRight,
  Loader2,
  Send,
  MessageSquare,
  History,
  Upload,
  FileCheck,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const durumBilgileri: Record<string, { etiket: string; renk: string }> = {
  BEKLEMEDE: { etiket: "Beklemede", renk: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200" },
  ONAYLANDI: { etiket: "Onaylandı", renk: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200" },
  DEVAM_EDIYOR: { etiket: "Devam Ediyor", renk: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 border-purple-200" },
  TAMAMLANDI: { etiket: "Tamamlandı", renk: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200" },
  IPTAL: { etiket: "İptal", renk: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200" },
};

export default function TaramaDetayPage() {
  const router = useRouter();
  const params = useParams();
  const { randevular, randevuGuncelle, randevuSil } = useRandevuStore();
  const { firmalar } = useFirmaStore();
  const { personeller } = usePersonelStore();
  const { saglikTestleri } = useSaglikTestiStore();
  const printRef = useRef<HTMLDivElement>(null);

  const tarama = randevular.find((r) => r.id === params.id);
  const firma = firmalar.find((f) => f.id === tarama?.firmaId);
  const personel = personeller.find((p) => p.id === tarama?.personelId);
  const test = saglikTestleri.find((t) => t.id === tarama?.testId);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSonucDuzenle, setShowSonucDuzenle] = useState(false);
  const [taramaSonucu, setTaramaSonucu] = useState(tarama?.sonuc || "");
  const [aktiviteGecmisi, setAktiviteGecmisi] = useState<Array<{tarih: string; islem: string; kullanici: string}>>([]);
  const [expandedSections, setExpandedSections] = useState({
    sonuc: true,
    gecmis: false,
    hizliEylem: true,
  });

  const [editForm, setEditForm] = useState({
    tarih: tarama?.tarih || "",
    baslangicSaati: tarama?.baslangicSaati || "",
    bitisSaati: tarama?.bitisSaati || "",
    durum: tarama?.durum || "BEKLEMEDE",
    notlar: tarama?.notlar || "",
  });

  if (!tarama) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <FileText className="mb-4 h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">Tarama bulunamadı.</p>
        <Button className="mt-4" onClick={() => router.push("/dashboard/randevular")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Taramalara Dön
        </Button>
      </div>
    );
  }

  const durum = durumBilgileri[tarama.durum] || durumBilgileri.BEKLEMEDE;

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    randevuGuncelle(tarama.id, {
      tarih: editForm.tarih,
      baslangicSaati: editForm.baslangicSaati,
      bitisSaati: editForm.bitisSaati,
      durum: editForm.durum as "BEKLEMEDE" | "ONAYLANDI" | "DEVAM_EDIYOR" | "TAMAMLANDI" | "IPTAL",
      notlar: editForm.notlar,
    });
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleDelete = () => {
    randevuSil(tarama.id);
    router.push("/dashboard/randevular");
  };

  const handlePrint = () => {
    window.print();
  };

  const durumSecenekleri: ("BEKLEMEDE" | "ONAYLANDI" | "DEVAM_EDIYOR" | "TAMAMLANDI" | "IPTAL")[] = ["BEKLEMEDE", "ONAYLANDI", "DEVAM_EDIYOR", "TAMAMLANDI", "IPTAL"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Üst Navigasyon ve Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/randevular")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Tarama Detayı</h2>
            <p className="text-sm text-muted-foreground">ID: {tarama.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isEditing ? (
            <>
              <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
                <Printer className="mr-2 h-4 w-4" />
                Yazdır / PDF
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Düzenle
              </Button>
              <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Sil
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                <X className="mr-2 h-4 w-4" />
                İptal
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Kaydet
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content - All Sections */}
      <div className="space-y-6 print:hidden">
        {/* Row 1: Durum ve Tarih Bilgisi */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Tarama Durum Kartı */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Durum Bilgisi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tarama Durumu</label>
                  <div className="grid grid-cols-1 gap-2">
                    {durumSecenekleri.map((d) => (
                      <button
                        key={d}
                        onClick={() => setEditForm({ ...editForm, durum: d })}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-left transition-all ${
                          editForm.durum === d
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <Badge className={durumBilgileri[d].renk}>{durumBilgileri[d].etiket}</Badge>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Mevcut Durum</p>
                      <Badge className={durum.renk}>{durum.etiket}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2 border-t">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Oluşturulma</span>
                      <span className="font-medium">{new Date(tarama.olusturmaTarihi).toLocaleDateString("tr-TR")}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tarama ID</span>
                      <span className="font-medium text-xs">{tarama.id}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tarih ve Saat Bilgisi */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Tarih ve Saat Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Tarih</label>
                    <Input
                      type="date"
                      value={editForm.tarih}
                      onChange={(e) => setEditForm({ ...editForm, tarih: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Başlangıç Saati</label>
                    <Input
                      type="time"
                      value={editForm.baslangicSaati}
                      onChange={(e) => setEditForm({ ...editForm, baslangicSaati: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Bitiş Saati</label>
                    <Input
                      type="time"
                      value={editForm.bitisSaati}
                      onChange={(e) => setEditForm({ ...editForm, bitisSaati: e.target.value })}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Calendar className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tarih</p>
                      <p className="font-semibold">{new Date(tarama.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Başlangıç</p>
                      <p className="font-semibold">{tarama.baslangicSaati}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Bitiş</p>
                      <p className="font-semibold">{tarama.bitisSaati}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Test ve Personel Bilgisi */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <TestTube2 className="h-4 w-4" />
                Test Bilgisi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <TestTube2 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{tarama.testAdi || "Test bilgisi yok"}</p>
                  {test && (
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p>Kategori: {test.kategoriAdi || "Belirtilmemiş"}</p>
                      <p>Fiyat: {formatPara(test.birimFiyat)}</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Atanan Personel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{tarama.personelAdi || "Personel atanmamış"}</p>
                  {personel && (
                    <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                      <p className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {personel.email}
                      </p>
                      <p className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {personel.telefon}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 3: Firma Bilgileri */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Firma Bilgileri
            </CardTitle>
            <CardDescription>Taramanın yapılacağı firma bilgileri</CardDescription>
          </CardHeader>
          <CardContent>
            {firma ? (
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-lg">{firma.ad}</p>
                      <p className="text-sm text-muted-foreground">{firma.sektor}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-2">
                    <p className="text-sm text-muted-foreground">Vergi No: {firma.vergiNo}</p>
                    <p className="text-sm text-muted-foreground">Yetkili: {firma.yetkiliKisi}</p>
                    <p className="text-sm text-muted-foreground">Çalışan Sayısı: {firma.calisanSayisi}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Adres</p>
                      <p className="text-sm text-muted-foreground">{firma.adres}</p>
                      <p className="text-sm text-muted-foreground">{firma.ilce}, {firma.il}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{firma.telefon}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{firma.email}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Firma bilgisi bulunamadı.</p>
            )}
          </CardContent>
        </Card>

        {/* Row 4: Hızlı Eylemler ve Durum Geçişleri */}
        <Card className="border-primary/20">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <ChevronRight className="h-4 w-4" />
                Hızlı Eylemler
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedSections(prev => ({ ...prev, hizliEylem: !prev.hizliEylem }))}
              >
                {expandedSections.hizliEylem ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.hizliEylem && (
            <CardContent className="space-y-4">
              {/* Durum Geçiş Butonları */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Durum Değiştir</p>
                <div className="flex flex-wrap gap-2">
                  {tarama.durum !== "BEKLEMEDE" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => randevuGuncelle(tarama.id, { durum: "BEKLEMEDE" })}
                      className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200"
                    >
                      <Clock className="mr-1 h-3 w-3" />
                      Beklemeye Al
                    </Button>
                  )}
                  {tarama.durum !== "ONAYLANDI" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => randevuGuncelle(tarama.id, { durum: "ONAYLANDI" })}
                      className="bg-blue-50 hover:bg-blue-100 border-blue-200"
                    >
                      <Check className="mr-1 h-3 w-3" />
                      Onayla
                    </Button>
                  )}
                  {tarama.durum !== "DEVAM_EDIYOR" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => randevuGuncelle(tarama.id, { durum: "DEVAM_EDIYOR" })}
                      className="bg-purple-50 hover:bg-purple-100 border-purple-200"
                    >
                      <Loader2 className="mr-1 h-3 w-3" />
                      Başlat
                    </Button>
                  )}
                  {tarama.durum !== "TAMAMLANDI" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => randevuGuncelle(tarama.id, { durum: "TAMAMLANDI" })}
                      className="bg-green-50 hover:bg-green-100 border-green-200"
                    >
                      <FileCheck className="mr-1 h-3 w-3" />
                      Tamamla
                    </Button>
                  )}
                  {tarama.durum !== "IPTAL" && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        if (confirm("Tarama iptal edilecek. Emin misiniz?")) {
                          randevuGuncelle(tarama.id, { durum: "IPTAL" });
                        }
                      }}
                      className="bg-red-50 hover:bg-red-100 border-red-200"
                    >
                      <X className="mr-1 h-3 w-3" />
                      İptal Et
                    </Button>
                  )}
                </div>
              </div>

              {/* İletişim Butonları */}
              <div className="space-y-2 pt-2 border-t">
                <p className="text-sm font-medium text-muted-foreground">İletişim</p>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert(`E-posta gönderiliyor: ${firma?.email}`)}
                    disabled={!firma?.email}
                  >
                    <Mail className="mr-1 h-3 w-3" />
                    E-posta Gönder
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert(`SMS gönderiliyor: ${firma?.telefon}`)}
                    disabled={!firma?.telefon}
                  >
                    <MessageSquare className="mr-1 h-3 w-3" />
                    SMS Gönder
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => alert(`Hatırlatma eklendi: ${tarama.testAdi}`)}
                  >
                    <Send className="mr-1 h-3 w-3" />
                    Hatırlatma Ekle
                  </Button>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Row 5: Tarama Sonuçları */}
        <Card className={tarama.sonuc ? "border-green-200" : ""}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <FileCheck className="h-4 w-4" />
                Tarama Sonuçları
                {tarama.sonuc && <Badge variant="outline" className="bg-green-50 text-green-700">Tamamlandı</Badge>}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedSections(prev => ({ ...prev, sonuc: !prev.sonuc }))}
              >
                {expandedSections.sonuc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.sonuc && (
            <CardContent className="space-y-4">
              {showSonucDuzenle ? (
                <div className="space-y-3">
                  <label className="text-sm font-medium">Tarama Sonucu</label>
                  <textarea
                    className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={taramaSonucu}
                    onChange={(e) => setTaramaSonucu(e.target.value)}
                    placeholder="Tarama sonuçlarını buraya yazabilirsiniz..."
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        randevuGuncelle(tarama.id, { sonuc: taramaSonucu });
                        setShowSonucDuzenle(false);
                      }}
                    >
                      <Save className="mr-1 h-3 w-3" />
                      Kaydet
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setTaramaSonucu(tarama.sonuc || "");
                        setShowSonucDuzenle(false);
                      }}
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-lg bg-muted/50 p-4">
                    {tarama.sonuc ? (
                      <p className="text-sm whitespace-pre-wrap">{tarama.sonuc}</p>
                    ) : (
                      <div className="text-center py-6">
                        <FileCheck className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">Henüz sonuç girilmemiş</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowSonucDuzenle(true)}
                  >
                    <Edit className="mr-1 h-3 w-3" />
                    {tarama.sonuc ? "Sonucu Düzenle" : "Sonuç Ekle"}
                  </Button>
                </div>
              )}
            </CardContent>
          )}
        </Card>

        {/* Row 6: Aktivite Geçmişi */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <History className="h-4 w-4" />
                Aktivite Geçmişi
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setExpandedSections(prev => ({ ...prev, gecmis: !prev.gecmis }))}
              >
                {expandedSections.gecmis ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          {expandedSections.gecmis && (
            <CardContent>
              <div className="space-y-3">
                {/* Oluşturma kaydı */}
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Tarama Oluşturuldu</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tarama.olusturmaTarihi).toLocaleDateString("tr-TR", { 
                        day: "numeric", 
                        month: "long", 
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>

                {/* Durum değişiklikleri - mock data */}
                {tarama.durum !== "BEKLEMEDE" && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Durum Değişikliği: {durumBilgileri[tarama.durum]?.etiket || tarama.durum}</p>
                      <p className="text-xs text-muted-foreground">Son güncelleme</p>
                    </div>
                  </div>
                )}

                {tarama.sonuc && (
                  <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                      <FileCheck className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Tarama Sonuçlandı</p>
                      <p className="text-xs text-muted-foreground">Sonuç raporu eklendi</p>
                    </div>
                  </div>
                )}

                {aktiviteGecmisi.length === 0 && !tarama.sonuc && tarama.durum === "BEKLEMEDE" && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Henüz aktivite kaydı bulunmuyor
                  </p>
                )}
              </div>
            </CardContent>
          )}
        </Card>

        {/* Row 7: Notlar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Tarama Notları
            </CardTitle>
            <CardDescription>Tarama ile ilgili özel notlar ve açıklamalar</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <div className="space-y-3">
                <label className="text-sm font-medium">Notlar</label>
                <textarea
                  className="flex min-h-[200px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={editForm.notlar}
                  onChange={(e) => setEditForm({ ...editForm, notlar: e.target.value })}
                  placeholder="Tarama ile ilgili notlarınızı buraya yazabilirsiniz..."
                />
              </div>
            ) : (
              <div className="rounded-lg bg-muted/50 p-4">
                {tarama.notlar ? (
                  <p className="text-sm whitespace-pre-wrap">{tarama.notlar}</p>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Not bulunmamaktadır.</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Print/PDF View - Hidden normally, shown when printing */}
      <div ref={printRef} className="hidden print:block space-y-6">
        {/* Print Header */}
        <div className="border-b pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">Tarama Raporu</h1>
              <p className="text-sm text-muted-foreground mt-1">ID: {tarama.id}</p>
            </div>
            <Badge className={durum.renk}>{durum.etiket}</Badge>
          </div>
        </div>

        {/* Print Content */}
        <div className="grid gap-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Tarih</p>
              <p className="font-semibold">{new Date(tarama.tarih).toLocaleDateString("tr-TR")}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Başlangıç Saati</p>
              <p className="font-semibold">{tarama.baslangicSaati}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Bitiş Saati</p>
              <p className="font-semibold">{tarama.bitisSaati}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Firma Bilgileri</h3>
            {firma && (
              <div className="space-y-1 text-sm">
                <p><span className="font-medium">Firma:</span> {firma.ad}</p>
                <p><span className="font-medium">Sektör:</span> {firma.sektor}</p>
                <p><span className="font-medium">Adres:</span> {firma.adres}, {firma.ilce}, {firma.il}</p>
                <p><span className="font-medium">Telefon:</span> {firma.telefon}</p>
                <p><span className="font-medium">Yetkili:</span> {firma.yetkiliKisi}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold mb-2">Test ve Personel</h3>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Test:</span> {tarama.testAdi || "-"}</p>
              <p><span className="font-medium">Personel:</span> {tarama.personelAdi || "-"}</p>
            </div>
          </div>

          {tarama.notlar && (
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-2">Notlar</h3>
              <p className="text-sm whitespace-pre-wrap">{tarama.notlar}</p>
            </div>
          )}

          <div className="border-t pt-4 text-xs text-muted-foreground">
            <p>Oluşturulma: {new Date(tarama.olusturmaTarihi).toLocaleString("tr-TR")}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onClose={() => setShowDeleteDialog(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Taramayı Sil</DialogTitle>
            <DialogDescription>
              Bu taramayı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="mr-2 h-4 w-4" />
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Print Preview Dialog */}
      <Dialog open={showPrintDialog} onClose={() => setShowPrintDialog(false)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Yazdır / PDF Önizleme</DialogTitle>
            <DialogDescription>
              Tarama bilgilerini yazdırabilir veya PDF olarak kaydedebilirsiniz.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted/30 rounded-lg p-6 max-h-[60vh] overflow-y-auto">
            <div className="bg-white p-8 rounded-lg shadow-sm">
              <div className="border-b pb-4 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tarama Raporu</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: {tarama.id}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${durum.renk}`}>
                    {durum.etiket}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tarih</p>
                  <p className="font-semibold text-gray-900">{new Date(tarama.tarih).toLocaleDateString("tr-TR")}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Başlangıç Saati</p>
                  <p className="font-semibold text-gray-900">{tarama.baslangicSaati}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Bitiş Saati</p>
                  <p className="font-semibold text-gray-900">{tarama.bitisSaati}</p>
                </div>
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3 text-gray-900">Firma Bilgileri</h3>
                {firma ? (
                  <div className="space-y-1 text-sm text-gray-700">
                    <p><span className="font-medium">Firma:</span> {firma.ad}</p>
                    <p><span className="font-medium">Sektör:</span> {firma.sektor}</p>
                    <p><span className="font-medium">Adres:</span> {firma.adres}, {firma.ilce}, {firma.il}</p>
                    <p><span className="font-medium">Telefon:</span> {firma.telefon}</p>
                    <p><span className="font-medium">Yetkili:</span> {firma.yetkiliKisi}</p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Firma bilgisi bulunamadı.</p>
                )}
              </div>

              <div className="border-t pt-4 mb-4">
                <h3 className="font-semibold mb-3 text-gray-900">Test ve Personel</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  <p><span className="font-medium">Test:</span> {tarama.testAdi || "-"}</p>
                  <p><span className="font-medium">Personel:</span> {tarama.personelAdi || "-"}</p>
                </div>
              </div>

              {tarama.notlar && (
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-3 text-gray-900">Notlar</h3>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{tarama.notlar}</p>
                </div>
              )}

              <div className="border-t pt-4 mt-6 text-xs text-gray-400">
                <p>Oluşturulma: {new Date(tarama.olusturmaTarihi).toLocaleString("tr-TR")}</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrintDialog(false)}>
              Kapat
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Yazdır / PDF Kaydet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
