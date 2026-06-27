"use client";

import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";
import { Menu, History, Bookmark } from "lucide-react";

export default function RightSidebar() {
  const router = useRouter();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="fixed right-4 top-4 z-50 h-10 w-10 rounded-xl shadow-sm"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="
          w-full sm:max-w-sm md:max-w-md lg:max-w-lg
          p-4 sm:p-6
          overflow-y-auto
        "
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-4">
          {/* HISTORY */}
          <button
            onClick={() => router.push("/history")}
            className="
              rounded-xl border p-4 text-left
              transition-all hover:bg-muted hover:shadow-sm
            "
          >
            <div className="flex items-center gap-2 font-medium">
              <History className="h-4 w-4" />
              History
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Recently visited pages
            </p>
          </button>

          {/* BOOKMARKS */}
          <button
            onClick={() => router.push("/bookmark")}
            className="
              rounded-xl border p-4 text-left
              transition-all hover:bg-muted hover:shadow-sm
            "
          >
            <div className="flex items-center gap-2 font-medium">
              <Bookmark className="h-4 w-4" />
              Bookmarks
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Saved websites
            </p>
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
}