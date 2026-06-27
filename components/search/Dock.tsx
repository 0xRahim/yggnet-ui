"use client";

import { useState, useEffect } from "react";
import { Plus, MoreVertical, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { api } from "@/lib/api";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AppItem = {
  id: number;
  title: string;
  url: string;
};

export default function Dock() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // dialog state
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    const fetchPinned = async () => {
      try {
        const data = await api.get<AppItem[]>("/pinned");
        setApps(data);
      } catch (err) {
        console.error("Failed to fetch pinned websites", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPinned();
  }, []);

  const addApp = async () => {
    if (!url || !title) return;
    setIsAdding(true);

    try {
      const newApp = await api.post<AppItem>("/pinned", {
        title,
        url,
      });

      setApps((prev) => [...prev, newApp]);
      setUrl("");
      setTitle("");
      setOpen(false);
    } catch (err) {
      console.error("Failed to add pinned website", err);
    } finally {
      setIsAdding(false);
    }
  };

  const unpinApp = async (id: number) => {
    try {
      await api.delete(`/pinned/${id}`);
      setApps((prev) => prev.filter((app) => app.id !== id));
    } catch (err) {
      console.error("Failed to delete pinned website", err);
    }
  };

  const getIcon = (url: string) => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
    } catch {
      return "/images/logo.png";
    }
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center gap-4 border-r bg-background/80 py-4 backdrop-blur-xl">
      
      {/* APPS */}
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <div className="flex h-12 w-12 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          apps.map((app) => (
            <div key={app.id} className="relative group">
              <a
                href={app.url}
                target="_blank"
                className="flex h-12 w-12 items-center justify-center rounded-xl transition-all hover:scale-110 hover:bg-muted"
              >
                <Image
                  src={getIcon(app.url)}
                  alt={app.title}
                  width={24}
                  height={24}
                  className="rounded-md"
                />
              </a>

              {/* tooltip */}
              <span className="absolute left-14 hidden whitespace-nowrap rounded-md bg-background px-2 py-1 text-xs shadow-md group-hover:block">
                {app.title}
              </span>

              {/* unpin menu */}
              <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-5 w-5"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="start">
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => unpinApp(app.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Unpin
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD BUTTON */}
      <div className="mt-auto pb-4">
        <Button
          size="icon"
          variant="outline"
          onClick={() => setOpen(true)}
          className="h-12 w-12 rounded-xl transition-all hover:scale-110"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add App</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="Google"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">URL</label>
              <input
                className="w-full rounded-md border px-3 py-2 text-sm"
                placeholder="https://google.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isAdding}>
              Cancel
            </Button>
            <Button onClick={addApp} disabled={isAdding}>
              {isAdding ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
