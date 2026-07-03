import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "WorkSphere AI – Intelligent Workforce Management",
  description: "AI-powered shift planning, fatigue risk management & workforce operations platform for enterprise teams.",
  keywords: ["workforce management", "shift planning", "fatigue risk", "HR management", "employee scheduling"],
  authors: [{ name: "WorkSphere AI" }],
  openGraph: {
    title: "WorkSphere AI",
    description: "Intelligent Workforce Management Platform",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster position="top-right" richColors closeButton />
        </Providers>
      </body>
    </html>
  );
}
