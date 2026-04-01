"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, Plus, Search } from "lucide-react";

const taramaDurumRenkleri = {
  PLANLANDI: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  DEVAM_EDIYOR: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  TAMAMLANDI: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  IPTAL: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export default function TaramalarPage() {
  const router = useRouter();
  const { taramalar } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTaramalar = taramalar.filter(
    (tarama) =>
      tarama.ad.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tarama.firmaAdi?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Taramalar</h2>
          <p className="text-muted-foreground">{taramalar.length} tarama</p>
        </div>
        <Button onClick={() => router.push("/dashboard/taramalar/yeni")}>
          <Plus className="mr-2 h-4 w-4" />
          Yeni Tarama
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tarama adı veya firma ile ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-4">
        {filteredTaramalar.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ClipboardList className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-center text-muted-foreground">Tarama bulunamadı.</p>
            </CardContent>
          </Card>
        ) : (
          filteredTaramalar.map((tarama) => (
            <Card key={tarama.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold">{tarama.ad}</h3>
                    <p className="text-sm text-muted-foreground">Firma: {tarama.firmaAdi}</p>
                    <p className="text-sm text-muted-foreground">
                      Planlanan Tarih: {tarama.planlananTarih}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Personel Sayısı: {tarama.personelIds.length} | Test Sayısı: {tarama.testIds.length}
                    </p>
                    {tarama.atananPersonelAdi && (
                      <p className="text-sm">Atanan: {tarama.atananPersonelAdi}</p>
                    )}
                  </div>
                  <Badge className={taramaDurumRenkleri[tarama.durum]}>
                    {tarama.durum === "PLANLANDI" && "Planlandı"}
                    {tarama.durum === "DEVAM_EDIYOR" && "Devam Ediyor"}
                    {tarama.durum === "TAMAMLANDI" && "Tamamlandı"}
                    {tarama.durum === "IPTAL" && "İptal"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
