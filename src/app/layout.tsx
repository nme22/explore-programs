import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], preload: true });

export const metadata: Metadata = {
  title: {
    default: "Explore Programs",
    template: "%s · Explore Programs",
  },
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <ClerkProvider>
        <body className={cn("antialiased", inter.className)}>{children}</body>
      </ClerkProvider>
    </html>
  );
}
