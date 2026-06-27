"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { api } from "@/lib/api";
import {
  Folder,
  Hash,
  Link as LinkIcon,
  Plus,
  Search,
  Trash2,
  BookMarked,
  Loader2,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Bookmark = {
  id: number;
  user_id: number;
  folder_id: number | null;
  title: string;
  url: string;
  description: string | null;
  tags: string | null;
  folder_name: string | null;
};

type FolderItem = {
  id: number;
  user_id: number;
  name: string;
};

export default function BookmarkPage() {
  const [items, setItems] = useState<Bookmark[]>([]);
  const [allFolders, setAllFolders] = useState<FolderItem[]>([]);
  const [activeFolder, setActiveFolder] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [form, setForm] = useState({
    url: "",
    title: "",
    description: "",
    tags: "",
    folder: "General",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [bookmarksData, foldersData] = await Promise.all([
        api.get<Bookmark[]>("/bookmarks"),
        api.get<FolderItem[]>("/bookmarks/folders"),
      ]);
      setItems(bookmarksData);
      setAllFolders(foldersData);
    } catch (err) {
      console.error("Failed to fetch bookmarks/folders", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const add = async () => {
    if (!form.url.trim() || !form.title.trim()) return;

    try {
      const newItem = await api.post<Bookmark>("/bookmarks", {
        title: form.title.trim(),
        url: form.url.trim(),
        description: form.description.trim(),
        tags: form.tags.trim(),
        folder_name: form.folder.trim() || "General",
      });

      setItems((prev) => [newItem, ...prev]);

      // Refresh folders if a new one was potentially created
      const foldersData = await api.get<FolderItem[]>("/bookmarks/folders");
      setAllFolders(foldersData);

      setForm({
        url: "",
        title: "",
        description: "",
        tags: "",
        folder: "General",
      });
    } catch (err) {
      console.error("Failed to add bookmark", err);
    }
  };

  const remove = async (id: number) => {
    try {
      await api.delete(`/bookmarks/${id}`);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      console.error("Failed to delete bookmark", err);
    }
  };

  const folders = useMemo(() => {
    return ["All", ...allFolders.map((f) => f.name)];
  }, [allFolders]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();

    return items
      .filter((i) => (activeFolder === "All" ? true : i.folder_name === activeFolder))
      .filter((i) => {
        const searchable = [
          i.title,
          i.description || "",
          i.folder_name || "",
          i.tags || "",
          i.url,
        ]
          .join(" ")
          .toLowerCase();

        return searchable.includes(q);
      });
  }, [items, activeFolder, query]);

  return (
    <div className="w-full px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BookMarked className="h-4 w-4" />
            Bookmark Manager
          </div>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Bookmarks</h1>
            <p className="text-sm text-muted-foreground">
              Organize saved links by folder, search instantly, and keep your library tidy.
            </p>
          </div>
        </div>

        {/* Top stats */}
        <div className="grid gap-3 sm:grid-cols-3">
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Total bookmarks</div>
            <div className="mt-1 text-2xl font-semibold">{items.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Visible now</div>
            <div className="mt-1 text-2xl font-semibold">{filtered.length}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-muted-foreground">Folders</div>
            <div className="mt-1 text-2xl font-semibold">{folders.length - 1}</div>
          </Card>
        </div>

        {/* Main layout */}
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="space-y-4 xl:sticky xl:top-6 self-start">
            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Folder className="h-4 w-4" />
                Folders
              </div>

              <div className="space-y-1">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  folders.map((f) => {
                    const count = items.filter((i) =>
                      f === "All" ? true : i.folder_name === f
                    ).length;

                    return (
                      <button
                      key={f}
                      onClick={() => setActiveFolder(f)}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
                        activeFolder === f
                          ? "bg-muted text-foreground"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                      }`}
                    >
                      <span>{f}</span>
                      <span className="text-xs opacity-70">{count}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </Card>

            <Card className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                <Search className="h-4 w-4" />
                Search
              </div>
              <Input
                placeholder="Search bookmarks..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10"
              />
            </Card>
          </aside>

          {/* Content */}
          <section className="space-y-6 min-w-0">
            {/* Add form */}
            <Card className="p-4 sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold">Add bookmark</h2>
                  <p className="text-sm text-muted-foreground">
                    Save a new link to your collection.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                  <Input
                    placeholder="URL"
                    value={form.url}
                    onChange={(e) => setForm({ ...form, url: e.target.value })}
                  />
                </div>

                <Input
                  placeholder="Description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />

                <div className="grid gap-3 md:grid-cols-[1fr_180px_auto]">
                  <Input
                    placeholder="Tags (comma separated)"
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  />
                  <Input
                    placeholder="Folder"
                    value={form.folder}
                    onChange={(e) => setForm({ ...form, folder: e.target.value })}
                  />
                  <Button onClick={add} className="w-full md:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
            </Card>

            <Separator />

            {/* Results */}
            <div className="flex items-center justify-between gap-3">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filtered.length}</span>{" "}
                bookmark{filtered.length === 1 ? "" : "s"}
              </div>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <p className="mt-4 text-sm text-muted-foreground">Loading bookmarks...</p>
                </div>
              ) : filtered.length === 0 ? (
                <Card className="p-10 text-center">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <BookMarked className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <h3 className="text-base font-medium">No bookmarks found</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Try a different search term or add a new bookmark.
                  </p>
                </Card>
              ) : (
                filtered.map((b) => (
                  <Card
                    key={b.id}
                    className="group p-4 transition hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-2">
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 font-medium hover:underline"
                        >
                          <LinkIcon className="h-4 w-4 shrink-0" />
                          <span className="truncate">{b.title}</span>
                        </a>

                        <p className="text-sm text-muted-foreground">
                          {b.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-2">
                            {b.folder_name && <Badge variant="secondary">{b.folder_name}</Badge>}

                            {b.tags?.split(",").map((t) => t.trim()).filter(Boolean).map((t) => (
                            <Badge key={t} variant="outline">
                              <Hash className="mr-1 h-3 w-3" />
                              {t}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => remove(b.id)}
                        className="shrink-0 opacity-100 transition group-hover:bg-muted sm:opacity-0 sm:group-hover:opacity-100"
                        aria-label="Delete bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}