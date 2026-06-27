"use client";

import { useEffect, useMemo, useState } from "react";
import { format, isToday, isThisWeek, isYesterday } from "date-fns";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Trash2, Search, History as HistoryIcon } from "lucide-react";

type HistoryItem = {
  id: string;
  query: string;
  createdAt: number;
};

const STORAGE_KEY = "yggnet-history";

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);

  // ---------------------------
  // LOAD
  // ---------------------------
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
  
    if (stored) {
      setItems(JSON.parse(stored));
      return;
    }
  
    // ---------------------------
    // DEMO DATA (seed only once)
    // ---------------------------
    const now = Date.now();
  
    const demo: HistoryItem[] = [
      // TODAY
      {
        id: "1",
        query: "best AI search engines",
        createdAt: now - 1000 * 60 * 30, // 30 min ago
      },
      {
        id: "2",
        query: "shadcn sidebar tutorial",
        createdAt: now - 1000 * 60 * 90, // 1.5 hrs ago
      },
  
      // THIS WEEK
      {
        id: "3",
        query: "nextjs app router layout patterns",
        createdAt: now - 1000 * 60 * 60 * 24 * 2, // 2 days ago
      },
      {
        id: "4",
        query: "lucide react icon usage examples",
        createdAt: now - 1000 * 60 * 60 * 24 * 3, // 3 days ago
      },
  
      // OLDER
      {
        id: "5",
        query: "tailwind css dark mode setup",
        createdAt: now - 1000 * 60 * 60 * 24 * 10, // 10 days ago
      },
      {
        id: "6",
        query: "react state management patterns",
        createdAt: now - 1000 * 60 * 60 * 24 * 20, // 20 days ago
      },
    ];
  
    setItems(demo);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  }, []);

  // ---------------------------
  // SAVE
  // ---------------------------
  const save = (data: HistoryItem[]) => {
    setItems(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  };

  // ---------------------------
  // DELETE SINGLE
  // ---------------------------
  const removeItem = (id: string) => {
    save(items.filter((i) => i.id !== id));
  };

  // ---------------------------
  // CLEAR ALL
  // ---------------------------
  const clearAll = () => {
    save([]);
  };

  // ---------------------------
  // GROUPING LOGIC
  // ---------------------------
  const grouped = useMemo(() => {
    const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt);

    return {
      today: sorted.filter((i) => isToday(i.createdAt)),
      week: sorted.filter(
        (i) => isThisWeek(i.createdAt) && !isToday(i.createdAt)
      ),
      older: sorted.filter((i) => !isThisWeek(i.createdAt)),
    };
  }, [items]);

  // ---------------------------
  // UI ROW
  // ---------------------------
  const Row = ({ item }: { item: HistoryItem }) => (
    <div className="group flex items-center justify-between rounded-xl border p-3 transition hover:bg-muted">
      <div className="flex items-center gap-3">
        <Search className="h-4 w-4 text-muted-foreground" />

        <div className="flex flex-col">
          <span className="text-sm font-medium">{item.query}</span>
          <span className="text-xs text-muted-foreground">
            {format(item.createdAt, "MMM d, yyyy • h:mm a")}
          </span>
        </div>
      </div>

      <Button
        size="icon"
        variant="ghost"
        onClick={() => removeItem(item.id)}
        className="opacity-0 transition group-hover:opacity-100"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  // ---------------------------
  // SECTION
  // ---------------------------
  const Section = ({
    title,
    items,
  }: {
    title: string;
    items: HistoryItem[];
  }) => {
    if (!items.length) return null;

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{title}</h2>
          <Badge variant="secondary">{items.length}</Badge>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <Row key={item.id} item={item} />
          ))}
        </div>

        <Separator className="my-4" />
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HistoryIcon className="h-5 w-5" />
          <h1 className="text-xl font-semibold">Search History</h1>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={clearAll}
          disabled={!items.length}
        >
          Clear All
        </Button>
      </div>

      {/* CONTENT */}
      <Card className="p-4 space-y-6">
        <Section title="Today" items={grouped.today} />
        <Section title="This Week" items={grouped.week} />
        <Section title="Older" items={grouped.older} />

        {!items.length && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No search history yet
          </div>
        )}
      </Card>
    </div>
  );
}