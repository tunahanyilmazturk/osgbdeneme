"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore, useSidebarStore } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Building2,
  Users,
  TestTube2,
  Calendar,
  CalendarDays,
  FileText,
  TrendingUp,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
} from "lucide-react";

const menuGroups = [
  {
    label: "Ana Menü",
    items: [
      {
        title: "Gösterge Paneli",
        href: "/dashboard",
        icon: LayoutDashboard,
        color: "text-blue-600 dark:text-blue-400",
        bg: "bg-blue-50 dark:bg-blue-950/50",
      },
    ],
  },
  {
    label: "Yönetim",
    items: [
      {
        title: "Firmalar",
        href: "/dashboard/firmalar",
        icon: Building2,
        color: "text-indigo-600 dark:text-indigo-400",
        bg: "bg-indigo-50 dark:bg-indigo-950/50",
      },
      {
        title: "Personel",
        href: "/dashboard/personel",
        icon: Users,
        color: "text-emerald-600 dark:text-emerald-400",
        bg: "bg-emerald-50 dark:bg-emerald-950/50",
      },
      {
        title: "Sağlık Testleri",
        href: "/dashboard/saglik-testleri",
        icon: TestTube2,
        color: "text-pink-600 dark:text-pink-400",
        bg: "bg-pink-50 dark:bg-pink-950/50",
      },
    ],
  },
  {
    label: "Planlama",
    items: [
      {
        title: "Taramalar",
        href: "/dashboard/randevular",
        icon: Calendar,
        color: "text-purple-600 dark:text-purple-400",
        bg: "bg-purple-50 dark:bg-purple-950/50",
      },
      {
        title: "Takvim",
        href: "/dashboard/takvim",
        icon: CalendarDays,
        color: "text-cyan-600 dark:text-cyan-400",
        bg: "bg-cyan-50 dark:bg-cyan-950/50",
      },
    ],
  },
  {
    label: "Finans & Raporlar",
    items: [
      {
        title: "Teklifler",
        href: "/dashboard/teklifler",
        icon: FileText,
        color: "text-orange-600 dark:text-orange-400",
        bg: "bg-orange-50 dark:bg-orange-950/50",
      },
      {
        title: "Raporlar",
        href: "/dashboard/raporlar",
        icon: TrendingUp,
        color: "text-teal-600 dark:text-teal-400",
        bg: "bg-teal-50 dark:bg-teal-950/50",
      },
    ],
  },
  {
    label: "Sistem",
    items: [
      {
        title: "Ayarlar",
        href: "/dashboard/ayarlar",
        icon: Settings,
        color: "text-gray-600 dark:text-gray-400",
        bg: "bg-gray-50 dark:bg-gray-900/50",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { cikisYap } = useAuthStore();
  const { sidebarCollapsed, toggleSidebar } = useSidebarStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleCikis = () => {
    cikisYap();
    router.push("/giris");
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50 h-screen border-r bg-sidebar
          transition-all duration-300 ease-in-out
          lg:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-72"}
        `}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-between px-5 py-5 border-b">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
                  <Stethoscope className="h-5 w-5" />
                </div>
              </div>
              <span className={`font-bold text-lg block leading-tight transition-all ${sidebarCollapsed ? "lg:hidden" : ""}`}>
                HanTech
              </span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                className="lg:hidden rounded-lg p-2 hover:bg-accent transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                <X className="h-5 w-5" />
              </button>
              <button
                className="hidden lg:flex rounded-lg p-2 hover:bg-accent transition-colors"
                onClick={toggleSidebar}
              >
                {sidebarCollapsed ? (
                  <ChevronRight className="h-5 w-5" />
                ) : (
                  <ChevronLeft className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {menuGroups.map((group) => (
              <div key={group.label}>
                <p className={`px-3 mb-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider transition-all ${sidebarCollapsed ? "lg:hidden" : ""}`}>
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      (item.href !== "/dashboard" && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        title={sidebarCollapsed ? item.title : undefined}
                        className={`
                          flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium
                          transition-all duration-200 group/item
                          ${
                            isActive
                              ? `${item.bg} ${item.color} shadow-sm`
                              : "text-muted-foreground hover:bg-accent hover:text-foreground"
                          }
                        `}
                      >
                        <div
                          className={`
                            flex h-8 w-8 items-center justify-center rounded-lg transition-all
                            ${
                              isActive
                                ? `${item.color}`
                                : "text-muted-foreground group-hover/item:text-foreground"
                            }
                          `}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </div>
                        <span className={`flex-1 ${sidebarCollapsed ? "lg:hidden" : ""}`}>{item.title}</span>
                        {isActive && !sidebarCollapsed && (
                          <div className={`h-1.5 w-1.5 rounded-full ${item.color.includes("blue") ? "bg-blue-600" : item.color.includes("indigo") ? "bg-indigo-600" : item.color.includes("emerald") ? "bg-emerald-600" : item.color.includes("pink") ? "bg-pink-600" : item.color.includes("purple") ? "bg-purple-600" : item.color.includes("cyan") ? "bg-cyan-600" : item.color.includes("amber") ? "bg-amber-600" : item.color.includes("orange") ? "bg-orange-600" : item.color.includes("teal") ? "bg-teal-600" : "bg-gray-600"}`} />
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Çıkış Butonu (Alt kısma) */}
            <div className={`pt-2 border-t ${sidebarCollapsed ? "lg:hidden" : ""}`}>
              <button
                onClick={handleCikis}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className={sidebarCollapsed ? "lg:hidden" : ""}>Çıkış Yap</span>
              </button>
            </div>
          </nav>

          {/* Kullanıcı Bilgisi (Kaldırıldı) */}
        </div>
      </aside>

      {/* Mobile Toggle */}
      <button
        className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg flex items-center justify-center hover:shadow-xl transition-all active:scale-95"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>
    </>
  );
}
