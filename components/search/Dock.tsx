"use client";

import { useState } from "react";
import { Plus, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
  name: string;
  url: string;
  icon: string;
};

export default function Dock() {
  const [apps, setApps] = useState<AppItem[]>([
    {
      id: 1,
      name: "Google",
      url: "https://google.com",
      icon: "https://www.google.com/favicon.ico",
    },
    {
      id: 2,
      name: "Youtube",
      url: "https://youtube.com",
      icon: "https://youtube.com/favicon.ico",
    },
  ]);

  // dialog state
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");

  const addApp = () => {
    if (!url) return;

    const newApp: AppItem = {
      id: Date.now(),
      name: url.replace("https://", "").replace("http://", ""),
      url,
      icon: `${url.replace(/\/$/, "")}/favicon.ico`,
    };

    setApps((prev) => [...prev, newApp]);
    setUrl("");
    setOpen(false);
  };

  const unpinApp = (id: number) => {
    setApps((prev) => prev.filter((app) => app.id !== id));
  };

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-20 flex-col items-center gap-4 border-r bg-background/80 py-4 backdrop-blur-xl">
      
      {/* APPS */}
      <div className="flex flex-col gap-3">
        {apps.map((app) => (
          <div key={app.id} className="relative group">
            
            <a
              href={app.url}
              target="_blank"
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all hover:scale-110 hover:bg-muted"
            >
              <Image
                src={app.icon}
                alt={app.name}
                width={24}
                height={24}
                className="rounded-md"
              />
            </a>

            {/* tooltip */}
            <span className="absolute left-14 hidden whitespace-nowrap rounded-md bg-background px-2 py-1 text-xs shadow-md group-hover:block">
              {app.name}
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
        ))}
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

          <input
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Enter website URL (https://...)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addApp}>Add</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  );
}