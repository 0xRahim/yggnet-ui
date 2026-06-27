import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3 } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";

import AuthGuard from "@/components/AuthGuard";
import Dock from "@/components/search/Dock";
import RightSidebar from "@/components/search/RightSidebar";

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YggNet",
  description: "A search that you own",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        geistSans.variable,
        geistMono.variable,
        sourceSans3.variable
      )}
    >
      <body className="min-h-full bg-background text-foreground">
        <AuthGuard>
          {/* GLOBAL APP SHELL */}
          <div className="flex min-h-screen">
            {/* LEFT DOCK */}
            <Dock />

            {/* MAIN CONTENT */}
            <main className="flex-1 pl-24">{children}</main>

            {/* RIGHT SIDEBAR TRIGGER + SHEET */}
            <RightSidebar />
          </div>
        </AuthGuard>
      </body>
    </html>
  );
}