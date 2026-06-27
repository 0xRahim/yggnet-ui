import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Sans_3 } from "next/font/google";
import "../globals.css";
import { cn } from "@/lib/utils";

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
        {/* UNAUTHENTICATED APP SHELL */}
        <div className="flex min-h-screen w-full flex-col">
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}