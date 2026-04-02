"use client";

import { memo, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DURUM_RENKLERI, DURUM_ETIKETLERI } from "@/lib/constants";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  ArrowRight,
} from "lucide-react";
import type { Firma } from "@/types";

interface FirmaCardProps {
  firma: Firma;
  randevuSayisi: number;
  teklifSayisi: number;
  onDelete: (id: string) => void;
}

// Memoized Firma Card Component to prevent unnecessary re-renders
export const FirmaCard = memo(function FirmaCard({
  firma,
  randevuSayisi,
  teklifSayisi,
  onDelete,
}: FirmaCardProps) {
  const router = useRouter();

  const handleDelete = useCallback(() => {
    if (confirm(`${firma.ad} firmasını silmek istediğinize emin misiniz?`)) {
      onDelete(firma.id);
    }
  }, [firma.ad, firma.id, onDelete]);

  const handleView = useCallback(() => {
    router.push(`/dashboard/firmalar/${firma.id}`);
  }, [router, firma.id]);

  const handleEdit = useCallback(() => {
    router.push(`/dashboard/firmalar/${firma.id}/duzenle`);
  }, [router, firma.id]);

  return (
    <Card className="card-hover group relative overflow-hidden">
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

        {/* Mini istatistikler */}
        <div className="flex gap-2 pt-1">
          <div className="flex-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
            <Calendar className="h-3.5 w-3.5 text-purple-500" />
            <span className="text-xs text-muted-foreground">{randevuSayisi} randevu</span>
          </div>
          <div className="flex-1 flex items-center gap-1.5 rounded-md bg-muted/50 px-2 py-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-xs text-muted-foreground">{teklifSayisi} teklif</span>
          </div>
        </div>

        {/* İşlemler */}
        <div className="flex gap-2 pt-1">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 group-hover:border-primary/30"
            onClick={handleView}
          >
            <Eye className="mr-1 h-3 w-3" />
            Detay
            <ArrowRight className="ml-auto h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleEdit}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

interface FirmaListItemProps {
  firma: Firma;
  onDelete: (id: string) => void;
}

// Memoized Firma List Item Component
export const FirmaListItem = memo(function FirmaListItem({
  firma,
  onDelete,
}: FirmaListItemProps) {
  const router = useRouter();

  const handleDelete = useCallback(() => {
    if (confirm(`${firma.ad} firmasını silmek istediğinize emin misiniz?`)) {
      onDelete(firma.id);
    }
  }, [firma.ad, firma.id, onDelete]);

  const handleView = useCallback(() => {
    router.push(`/dashboard/firmalar/${firma.id}`);
  }, [router, firma.id]);

  const handleEdit = useCallback(() => {
    router.push(`/dashboard/firmalar/${firma.id}/duzenle`);
  }, [router, firma.id]);

  return (
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{firma.ad}</p>
            <p className="text-xs text-muted-foreground">{firma.yetkiliKisi}</p>
          </div>
        </div>
      </td>
      <td className="p-4 hidden md:table-cell text-muted-foreground">{firma.sektor}</td>
      <td className="p-4 hidden lg:table-cell text-muted-foreground">{firma.il}</td>
      <td className="p-4 hidden lg:table-cell">{firma.calisanSayisi}</td>
      <td className="p-4 hidden md:table-cell">
        <div className="text-muted-foreground">
          <p className="text-xs">{firma.telefon}</p>
          <p className="text-xs">{firma.email}</p>
        </div>
      </td>
      <td className="p-4">
        <Badge className={DURUM_RENKLERI[firma.durum]} variant="outline">
          {DURUM_ETIKETLERI[firma.durum]}
        </Badge>
      </td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleView}>
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleEdit}>
            <Edit className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleDelete}>
            <Trash2 className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      </td>
    </tr>
  );
});

// Pre-computed stats for each firma to avoid filtering on every render
export function useFirmaStats(
  firmaIds: string[],
  randevular: { firmaId: string }[],
  teklifler: { firmaId: string }[]
) {
  return useMemo(() => {
    const stats = new Map<string, { randevu: number; teklif: number }>();
    
    // Initialize all firms with 0
    firmaIds.forEach(id => {
      stats.set(id, { randevu: 0, teklif: 0 });
    });
    
    // Count randevular
    randevular.forEach(r => {
      const current = stats.get(r.firmaId);
      if (current) {
        current.randevu++;
      }
    });
    
    // Count teklifler
    teklifler.forEach(t => {
      const current = stats.get(t.firmaId);
      if (current) {
        current.teklif++;
      }
    });
    
    return stats;
  }, [firmaIds, randevular, teklifler]);
}
