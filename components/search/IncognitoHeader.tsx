"use client";

import Image from "next/image";
import { useState } from "react";
import SearchBox from "@/components/search/SearchBox";
import { Search, Shield, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function IncognitoHero() {
  const [mode, setMode] = useState<"search" | "incognito">("search");

  const incognito = mode === "incognito";

  return (
    <section
      className={[
        "flex min-h-[80vh] items-center justify-center px-4",
        "transition-colors duration-500",
        incognito ? "bg-background" : "bg-background",
      ].join(" ")}
    >
      <div className="flex w-full max-w-4xl flex-col items-center text-center">
        <div
          className={[
            "mb-4 rounded-full border p-3 shadow-sm transition-all duration-500",
            incognito
              ? "border-border/70 bg-muted/20"
              : "border-border/60 bg-background",
          ].join(" ")}
        >
          <Image
            src="/images/logo.png"
            alt="YggNet Logo"
            width={120}
            height={120}
            priority
            className="h-auto w-[96px] sm:w-[120px]"
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            YggNet
          </h1>

          <p className="mx-auto max-w-lg text-sm text-muted-foreground sm:text-base">
            {incognito
              ? "Private mode is on. Search without leaving visible traces in this session."
              : "Search, discover, and connect with knowledge."}
          </p>
        </div>

        <div className="mt-6 flex items-center rounded-xl border bg-muted/30 p-1 backdrop-blur-md">
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
              "rounded-2xl border p-2 shadow-sm transition-all duration-500",
              incognito
                ? "border-border/70 bg-muted/20"
                : "border-border/60 bg-background",
            ].join(" ")}
          >
            <div className="flex items-center gap-2 px-3 pb-2 text-left text-xs text-muted-foreground">
              <EyeOff className="h-3.5 w-3.5" />
              {incognito
                ? "Incognito search"
                : "Standard search"}
            </div>

            <SearchBox />
          </div>
        </div>
      </div>
    </section>
  );
}