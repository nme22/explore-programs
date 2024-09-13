import { cn } from "@/lib/utils/style";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: {
    default: "Explore Programs",
    template: "%s · Explore Programs",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn("antialiased", inter.className)}>{children}</body>
    </html>
  );
}
