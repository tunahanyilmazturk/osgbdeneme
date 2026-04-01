"use client";

import Sidebar from "@/components/layout/sidebar";
import Header from "@/components/layout/header";
import { useStore } from "@/lib/store";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { sidebarCollapsed } = useStore();

  return (
    <div className="min-h-screen">
      <Sidebar />
      
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"}`}>
        <Header />
        
        <main className="flex-1 overflow-y-auto bg-background gradient-mesh p-4 lg:p-6">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
