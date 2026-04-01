"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import { exportPersoneller } from "@/lib/export";
import { Users, Phone, Mail, Building2, Plus, Search, Edit, Trash2, Eye, ArrowRight, Briefcase, UserCircle, FileSpreadsheet } from "lucide-react";

export default function PersonelPage() {
  const router = useRouter();
  const { personeller, personelSil, firmalar } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [gorunum, setGorunum] = useState<"kart" | "liste">("kart");

  const filteredPersoneller = personeller.filter(
    (personel) =>
      personel.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      personel.soyad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      personel.pozisyon.toLowerCase().includes(searchTerm.toLowerCase()) ||
      personel.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (ad: string, soyad: string) => `${ad?.charAt(0) || ""}${soyad?.charAt(0) || ""}`;

  const renkleri = [
    "from-blue-500 to-indigo-600",
    "from-emerald-500 to-teal-600",
    "from-purple-500 to-violet-600",
    "from-orange-500 to-red-500",
    "from-pink-500 to-rose-600",
    "from-cyan-500 to-blue-600",
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Başlık */}
      <div className="page-header-gradient">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Personel</h2>
            <p className="text-muted-foreground">Kayıtlı {personeller.length} personel bulunuyor</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportPersoneller(personeller)}
              disabled={personeller.length === 0}
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Excel
            </Button>
            <div className="hidden sm:flex rounded-lg bg-muted p-1">
              <button
                onClick={() => setGorunum("kart")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${gorunum === "kart" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                Kart
              </button>
              <button
                onClick={() => setGorunum("liste")}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-all ${gorunum === "liste" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
              >
                Liste
              </button>
            </div>
            <Button variant="gradient" onClick={() => router.push("/dashboard/personel/yeni")}>
              <Plus className="mr-2 h-4 w-4" />
              Yeni Personel
            </Button>
          </div>
        </div>
      </div>

      {/* Arama */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Ad, soyad, pozisyon veya firma ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Personel Listesi */}
      {gorunum === "kart" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
          {filteredPersoneller.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="empty-state">
                <div className="empty-state-icon animate-float">
                  <Users className="h-6 w-6" />
                </div>
                <p className="text-sm text-muted-foreground">
                  {searchTerm ? "Arama kriterine uygun personel bulunamadı." : "Henüz kayıtlı personel bulunmuyor."}
                </p>
                {!searchTerm && (
                  <Button variant="gradient" className="mt-4" onClick={() => router.push("/dashboard/personel/yeni")}>
                    <Plus className="mr-2 h-4 w-4" />
                    İlk Personeli Ekle
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredPersoneller.map((personel, idx) => (
              <Card key={personel.id} className="card-hover group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-primary/5 -translate-y-1/2 translate-x-1/2" />
                
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${renkleri[idx % renkleri.length]} text-white font-semibold text-sm`}>
                      {getInitials(personel.ad, personel.soyad)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base line-clamp-1">
                        {personel.ad} {personel.soyad}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">{personel.pozisyon}</p>
                    </div>
                    <Badge className={DURUM_RENKLERI[personel.durum]}>
                      {DURUM_ETIKETLERI[personel.durum]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{personel.firmaAdi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{personel.departman}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{personel.telefon}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="truncate">{personel.email}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 group-hover:border-primary/30"
                      onClick={() => router.push(`/dashboard/personel/${personel.id}`)}
                    >
                      <Eye className="mr-1 h-3 w-3" />
                      Detay
                      <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push(`/dashboard/personel/${personel.id}/duzenle`)}>
                      <Edit className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm(`${personel.ad} ${personel.soyad} personelini silmek istediğinize emin misiniz?`)) {
                          personelSil(personel.id);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        /* Liste Görünümü */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left p-4 font-medium">Personel</th>
                  <th className="text-left p-4 font-medium hidden md:table-cell">Firma</th>
                  <th className="text-left p-4 font-medium hidden lg:table-cell">İletişim</th>
                  <th className="text-left p-4 font-medium">Durum</th>
                  <th className="text-right p-4 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredPersoneller.map((personel, idx) => (
                  <tr key={personel.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${renkleri[idx % renkleri.length]} text-white font-semibold text-xs`}>
                          {getInitials(personel.ad, personel.soyad)}
                        </div>
                        <div>
                          <p className="font-medium">{personel.ad} {personel.soyad}</p>
                          <p className="text-xs text-muted-foreground">{personel.pozisyon}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-muted-foreground">{personel.firmaAdi}</td>
                    <td className="p-4 hidden lg:table-cell">
                      <div className="text-muted-foreground">
                        <p className="text-xs">{personel.telefon}</p>
                        <p className="text-xs">{personel.email}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={DURUM_RENKLERI[personel.durum]} variant="outline">
                        {DURUM_ETIKETLERI[personel.durum]}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personel/${personel.id}`)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => router.push(`/dashboard/personel/${personel.id}/duzenle`)}>
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            if (confirm(`${personel.ad} ${personel.soyad} personelini silmek istediğinize emin misiniz?`)) {
                              personelSil(personel.id);
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
