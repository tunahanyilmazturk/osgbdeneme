"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ToastProvider } from "@/components/ui/toast";
import { type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </NextThemesProvider>
  );
}
