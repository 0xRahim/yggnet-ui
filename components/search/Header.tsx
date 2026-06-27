"use client";

import Image from "next/image";
import { useState } from "react";
import SearchBox from "@/components/search/SearchBox";
import { Search, Shield, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  const [mode, setMode] = useState<"search" | "incognito">("search");

  const incognito = mode === "incognito";

  return (
    <section className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <Image
          src="/images/logo.png"
          alt="YggNet Logo"
          width={160}
          height={160}
          priority
          className="mb-2"
        />

        <h1 className="text-6xl font-extrabold tracking-tight">YggNet</h1>

        <p className="mt-3 max-w-md text-muted-foreground">
          {incognito
            ? "Incognito mode is on. Search privately in this session."
            : "Search, discover, and connect with knowledge."}
        </p>

        <div className="mt-5 flex items-center rounded-xl border bg-muted/40 p-1 backdrop-blur">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMode("search")}
            className={[
              "h-9 gap-2 rounded-lg px-3 transition-all",
              "text-muted-foreground hover:text-foreground",
              mode === "search" &&
                "bg-background text-foreground shadow-sm ring-1 ring-border",
            ].join(" ")}
          >
            <Search className="h-4 w-4" />
            <span className="text-xs font-medium">Search</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => setMode("incognito")}
            className={[
              "h-9 gap-2 rounded-lg px-3 transition-all",
              "text-muted-foreground hover:text-foreground",
              mode === "incognito" &&
                "bg-background text-foreground shadow-sm ring-1 ring-border",
            ].join(" ")}
          >
            <Shield className="h-4 w-4" />
            <span className="text-xs font-medium">Incognito</span>
          </Button>
        </div>

        <div className="mt-8 w-full max-w-3xl">
          <div
            className={[
              "rounded-2xl border p-2 shadow-sm transition-all duration-300",
              incognito ? "bg-muted/20" : "bg-background",
            ].join(" ")}
          >
            <div className="flex items-center gap-2 px-3 pb-2 text-left text-xs text-muted-foreground">
              {incognito ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
              {incognito ? "Private search" : "Standard search"}
            </div>

            <SearchBox incognito={incognito} />
          </div>
        </div>
      </div>
    </section>
  );
}