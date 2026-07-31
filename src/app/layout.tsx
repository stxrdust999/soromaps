import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Soromaps",
  description: "Plataforma digital interativa de Sorocaba",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        inter.variable,
      )}
    >
      <head>
        <link
          rel="icon"
          href="/logo/logoipsum-emblem.svg"
          type="image/svg+xml"
          sizes="32x32"
        />
      </head>

      <body className="min-h-full">
        <TooltipProvider>{children}</TooltipProvider>

        <Toaster
          position="bottom-right"
          richColors
          duration={5000}
          closeButton
        />
      </body>
    </html>
  );
}
