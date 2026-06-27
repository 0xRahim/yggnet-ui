"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export default function SearchBox() {
  const [query, setQuery] = useState("");

  return (
    <div className="w-full">
      <div className="flex w-full items-center gap-2 rounded-2xl border bg-background px-2 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
        
        {/* INPUT MUST GROW */}
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search the web, docs, or anything..."
          className="w-full flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />

        <Button size="icon" className="shrink-0 rounded-xl">
          <Search className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}