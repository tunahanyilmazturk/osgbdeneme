"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import { exportFirmalar } from "@/lib/export";
import Pagination from "@/components/ui/pagination";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowRight,
  Download,
  FileSpreadsheet,
} from "lucide-react";

export default function FirmalarPage() {
  const router = useRouter();
  const { firmalar, firmaSil, personeller } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFirmalar = firmalar.filter(
    (firma) =>
      firma.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firma.sektor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      firma.il.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Firmalar</h2>
            <p className="text-muted-foreground">
              Kayıtlı {firmalar.length} firma bulunuyor
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportFirmalar(firmalar)}
              disabled={firmalar.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel İndir
            </Button>
            <Button variant="gradient" onClick={() => router.push("/dashboard/firmalar/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Firma
            </Button>
          </div>
        </div>
      </div>

      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Firma adı, sektör veya şehir ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Firma Listesi */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
        {filteredFirmalar.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="empty-state">
              <div className="empty-state-icon animate-float">
                <Building2 className="h-6 w-6" />
              </div>
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "Arama kriterine uygun firma bulunamadı." : "Henüz kayıtlı firma bulunmuyor."}
              </p>
              {!searchTerm && (
                <Button
                  variant="gradient"
                  className="mt-4"
                  onClick={() => router.push("/dashboard/firmalar/yeni")}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  İlk Firmayı Oluştur
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredFirmalar.map((firma) => {
            const firmaPersonel = personeller.filter((p) => p.firmaId === firma.id);
            return (
              <Card key={firma.id} className="card-hover group relative overflow-hidden">
                {/* Dekoratif gradient */}
                <div className="absolute top-0 right-0 w-20 h-20 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg line-clamp-1">{firma.ad}</CardTitle>
                      <p className="text-sm text-muted-foreground">{firma.sektor}</p>
                    </div>
                    <Badge className={DURUM_RENKLERI[firma.durum]}>
                      {DURUM_ETIKETLERI[firma.durum]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>{firma.calisanSayisi} çalışan</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.il}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.telefon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{firma.email}</span>
                    </div>
                  </div>

                  {/* Personel Badge */}
                  {firmaPersonel.length > 0 && (
                    <div className="flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
                      <Users className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs text-muted-foreground">
                        {firmaPersonel.length} personel kayıtlı
                      </span>
                    </div>
                  )}

                  {/* İşlemler */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:border-primary/30"
                      onClick={() => router.push(`/dashboard/firmalar/${firma.id}`)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detay
                      <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => router.push(`/dashboard/firmalar/${firma.id}/duzenle`)}
                    >
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`${firma.ad} firmasını silmek istediğinize emin misiniz?`)) {
                          firmaSil(firma.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
