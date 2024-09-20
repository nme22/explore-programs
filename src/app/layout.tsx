import { cn } from "@/lib/utils";
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

import type { Metadata } from "next";

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
    <ClerkProvider>
      <html lang="en">
        <body
          className={cn(
            "antialiased bg-background text-foreground",
            inter.className,
          )}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
