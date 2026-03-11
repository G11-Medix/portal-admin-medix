import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Medix Admin",
  description: "Portal interno para operacion y monitoreo de Medix",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">{children}</body>
    </html>
  );
}
