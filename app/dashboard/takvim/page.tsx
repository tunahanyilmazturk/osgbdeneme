"use client";

import { useState, useMemo } from "react";
import { useRandevuStore, useTaramaStore } from "@/lib/stores";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";

const GUN_ISIMLERI = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
const AY_ISIMLERI = [
  "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
  "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık",
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Pazartesi = 0
}

export default function TakvimPage() {
  const { randevular } = useRandevuStore();
  const { taramalar } = useTaramaStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const events = useMemo(() => {
    const map: Record<string, { type: string; count: number; items: string[] }[]> = {};
    
    randevular.forEach((r) => {
      const dateKey = r.tarih;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({
        type: "randevu",
        count: 1,
        items: [`${r.firmaAdi} - ${r.testAdi}`],
      });
    });

    taramalar.forEach((t) => {
      const dateKey = t.planlananTarih;
      if (!map[dateKey]) map[dateKey] = [];
      map[dateKey].push({
        type: "tarama",
        count: 1,
        items: [t.ad],
      });
    });

    return map;
  }, [randevular, taramalar]);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const days = [];
  // Önceki ayın günleri
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: 0, isCurrentMonth: false });
  }
  // Bu ayın günleri
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, isCurrentMonth: true });
  }
  // Sonraki ayın günleri (grid'i tamamlamak için)
  const remaining = 42 - days.length;
  for (let i = 0; i < remaining; i++) {
    days.push({ day: 0, isCurrentMonth: false });
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Takvim</h2>
        <p className="text-muted-foreground">Randevu ve tarama takviminiz</p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-lg">
              {AY_ISIMLERI[month]} {year}
            </CardTitle>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Gün başlıkları */}
          <div className="grid grid-cols-7 mb-2">
            {GUN_ISIMLERI.map((gun) => (
              <div
                key={gun}
                className="text-center text-sm font-medium text-muted-foreground py-2"
              >
                {gun}
              </div>
            ))}
          </div>

          {/* Günler */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((item, index) => {
              if (!item.isCurrentMonth) {
                return (
                  <div
                    key={`empty-${index}`}
                    className="min-h-[80px] rounded-lg bg-muted/30 p-1"
                  />
                );
              }

              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(item.day).padStart(2, "0")}`;
              const dayEvents = events[dateStr] || [];
              const isToday = dateStr === todayStr;

              return (
                <div
                  key={`day-${item.day}`}
                  className={`min-h-[80px] rounded-lg border p-1 transition-colors hover:bg-accent/50 ${
                    isToday ? "border-primary bg-primary/5" : ""
                  }`}
                >
                  <div
                    className={`text-right text-sm ${
                      isToday
                        ? "font-bold text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.day}
                  </div>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.map((event, idx) =>
                      event.items.map((name, jdx) => (
                        <div
                          key={`${idx}-${jdx}`}
                          className={`truncate rounded px-1 py-0.5 text-xs ${
                            event.type === "randevu"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {name}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Açıklama */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-blue-500" />
              <span>Randevu</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-green-500" />
              <span>Tarama</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
