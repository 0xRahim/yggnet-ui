"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { format, isToday, isThisWeek } from "date-fns";
import { api } from "@/lib/api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Trash2, Search, History as HistoryIcon } from "lucide-react";

type HistoryItem = {
  id: number;
  user_id: number;
  query: string;
  created_at: string;
};

// ---------------------------
// SECTION
// ---------------------------
const HistorySection = ({
  title,
  items,
  onRemove,
}: {
  title: string;
  items: HistoryItem[];
  onRemove: (id: number) => void;
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
          <HistoryRow key={item.id} item={item} onRemove={onRemove} />
        ))}
      </div>

      <Separator className="my-4" />
    </div>
  );
};

// ---------------------------
// UI ROW
// ---------------------------
const HistoryRow = ({
  item,
  onRemove,
}: {
  item: HistoryItem;
  onRemove: (id: number) => void;
}) => (
  <div className="group flex items-center justify-between rounded-xl border p-3 transition hover:bg-muted">
    <div className="flex items-center gap-3">
      <Search className="h-4 w-4 text-muted-foreground" />

      <div className="flex flex-col">
        <span className="text-sm font-medium">{item.query}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(item.created_at), "MMM d, yyyy • h:mm a")}
        </span>
      </div>
    </div>

    <Button
      size="icon"
      variant="ghost"
      onClick={() => onRemove(item.id)}
      className="opacity-0 transition group-hover:opacity-100"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  </div>
);

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchHistory = useCallback(async () => {
    try {
      const data = await api.get<HistoryItem[]>("/search/history");
      setItems(data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------------------------
  // LOAD
  // ---------------------------
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  // ---------------------------
  // DELETE SINGLE
  // ---------------------------
  const removeItem = async (id: number) => {
    try {
      await api.delete(`/search/history/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete history item", err);
    }
  };

  // ---------------------------
  // CLEAR ALL
  // ---------------------------
  const clearAll = async () => {
    try {
      await api.delete("/search/history");
      setItems([]);
    } catch (err) {
      console.error("Failed to clear history", err);
    }
  };

  // ---------------------------
  // GROUPING LOGIC
  // ---------------------------
  const grouped = useMemo(() => {
    const sorted = [...items].sort((a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return {
      today: sorted.filter((i) => isToday(new Date(i.created_at))),
      week: sorted.filter(
        (i) => isThisWeek(new Date(i.created_at)) && !isToday(new Date(i.created_at))
      ),
      older: sorted.filter((i) => !isThisWeek(new Date(i.created_at))),
    };
  }, [items]);

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
        {isLoading ? (
          <div className="py-12 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground" />
          </div>
        ) : (
          <>
            <HistorySection title="Today" items={grouped.today} onRemove={removeItem} />
            <HistorySection title="This Week" items={grouped.week} onRemove={removeItem} />
            <HistorySection title="Older" items={grouped.older} onRemove={removeItem} />

            {!items.length && (
              <div className="py-12 text-center text-sm text-muted-foreground">
                No search history yet
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
}
