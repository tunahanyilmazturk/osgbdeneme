"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UISidebarState {
  sidebarCollapsed: boolean;
  mobileOpen: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<UISidebarState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileOpen: false,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      setMobileOpen: (open) => set({ mobileOpen: open }),
    }),
    {
      name: "hantech-sidebar",
      partialize: (state) => ({ sidebarCollapsed: state.sidebarCollapsed }),
    }
  )
);
