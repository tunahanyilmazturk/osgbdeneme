import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "HanTech - OSGB Yönetim Sistemi",
  description: "HanTech OSGB Yönetim Sistemi - Firma sağlık taramaları, periyodik muayeneler, randevu yönetimi ve fiyat teklifleri",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
