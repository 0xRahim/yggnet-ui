"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowUpDown,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock3,
  ExternalLink,
  Filter,
  Globe,
  Image as ImageIcon,
  LayoutGrid,
  ListFilter,
  Search,
  Settings2,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ResultType = "web" | "image" | "docs" | "news" | "video";

type SearchResult = {
  id: number;
  title: string;
  url: string;
  domain: string;
  description: string;
  type: ResultType;
  tags: string[];
  updatedAt: string;
  score: number;
  isBookmarked?: boolean;
};

const ALL_RESULTS: SearchResult[] = [
  {
    id: 1,
    title: "Yggnet Search — Fast, private, and customizable web search",
    url: "yggnet.app/search",
    domain: "yggnet.app",
    description:
      "Discover web pages, docs, images, and news with a clean interface, advanced filters, and instant pagination.",
    type: "web",
    tags: ["Search", "Privacy", "Speed"],
    updatedAt: "2h ago",
    score: 98,
    isBookmarked: true,
  },
  {
    id: 2,
    title: "How to build a search engine UI with Next.js and shadcn/ui",
    url: "docs.yggnet.app/guides/search-ui",
    domain: "docs.yggnet.app",
    description:
      "A practical guide covering query routing, filters, result cards, pagination, keyboard shortcuts, and empty states.",
    type: "docs",
    tags: ["Next.js", "UI", "Guide"],
    updatedAt: "1 day ago",
    score: 91,
  },
  {
    id: 3,
    title: "Design systems for search results pages",
    url: "blog.yggnet.app/design/search-pages",
    domain: "blog.yggnet.app",
    description:
      "Patterns for ranking, snippets, metadata, relevance indicators, and mobile-friendly result lists.",
    type: "web",
    tags: ["Design", "UX", "Ranking"],
    updatedAt: "3 days ago",
    score: 86,
  },
  {
    id: 4,
    title: "Search UX patterns that reduce bounce rate",
    url: "news.yggnet.app/search-ux-patterns",
    domain: "news.yggnet.app",
    description:
      "A compact breakdown of faceted filtering, autosuggest, highlighted terms, and result grouping.",
    type: "news",
    tags: ["UX", "Patterns", "Conversion"],
    updatedAt: "5 days ago",
    score: 84,
  },
  {
    id: 5,
    title: "Image search inspiration collection",
    url: "assets.yggnet.app/collections/image-search",
    domain: "assets.yggnet.app",
    description:
      "Curated screenshots of modern search pages with card layouts, filters, and compact controls.",
    type: "image",
    tags: ["Images", "Inspiration", "Cards"],
    updatedAt: "6 days ago",
    score: 79,
  },
  {
    id: 6,
    title: "Search indexing and ranking basics",
    url: "learn.yggnet.app/search-indexing",
    domain: "learn.yggnet.app",
    description:
      "Understand relevance signals, snippets, boosting, recency, and term highlighting for better ranking.",
    type: "docs",
    tags: ["Indexing", "Ranking", "Relevance"],
    updatedAt: "1 week ago",
    score: 88,
  },
  {
    id: 7,
    title: "Better search suggestions with instant feedback",
    url: "blog.yggnet.app/instant-suggestions",
    domain: "blog.yggnet.app",
    description:
      "Add query suggestions, history, trending searches, and refined filters to improve search efficiency.",
    type: "web",
    tags: ["Autocomplete", "Suggestions", "Search"],
    updatedAt: "2 weeks ago",
    score: 83,
  },
  {
    id: 8,
    title: "Search result card component examples",
    url: "ui.yggnet.app/components/search-cards",
    domain: "ui.yggnet.app",
    description:
      "Reusable card layouts for text, media, documents, and discovery results with consistent spacing.",
    type: "docs",
    tags: ["Components", "Cards", "Reusable"],
    updatedAt: "2 weeks ago",
    score: 81,
  },
  {
    id: 9,
    title: "Search engine ideas for personal knowledge bases",
    url: "notes.yggnet.app/pkb-search",
    domain: "notes.yggnet.app",
    description:
      "Ideas for semantic search, topic filters, pinned queries, and quick open in a personal content vault.",
    type: "docs",
    tags: ["Knowledge Base", "Semantic", "Topics"],
    updatedAt: "3 weeks ago",
    score: 76,
  },
  {
    id: 10,
    title: "Search analytics dashboard",
    url: "analytics.yggnet.app/search-dashboard",
    domain: "analytics.yggnet.app",
    description:
      "See query volume, click-through rate, zero-result rate, and popular filters over time.",
    type: "web",
    tags: ["Analytics", "CTR", "Metrics"],
    updatedAt: "1 month ago",
    score: 74,
  },
];

const RESULT_TYPES: Array<{ value: ResultType | "all"; label: string; icon: React.ReactNode }> = [
  { value: "all", label: "All", icon: <Globe className="h-4 w-4" /> },
  { value: "web", label: "Web", icon: <Globe className="h-4 w-4" /> },
  { value: "docs", label: "Docs", icon: <BookOpen className="h-4 w-4" /> },
  { value: "news", label: "News", icon: <TrendingUp className="h-4 w-4" /> },
  { value: "image", label: "Images", icon: <ImageIcon className="h-4 w-4" /> },
  { value: "video", label: "Videos", icon: <LayoutGrid className="h-4 w-4" /> },
];

const SORTS = [
  { value: "relevance", label: "Relevance" },
  { value: "recent", label: "Most recent" },
  { value: "score", label: "Top match" },
];

const PAGE_SIZE = 6;

function clampPage(page: number, totalPages: number) {
  return Math.min(Math.max(page, 1), Math.max(totalPages, 1));
}

function getPageItems<T>(items: T[], page: number, size: number) {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
}

function buildPageWindow(current: number, total: number) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const items = [1];
  const left = Math.max(2, current - 1);
  const right = Math.min(total - 1, current + 1);

  if (left > 2) items.push(-1);
  for (let i = left; i <= right; i++) items.push(i);
  if (right < total - 1) items.push(-1);
  items.push(total);
  return items;
}

function ResultIcon({ type }: { type: ResultType }) {
  switch (type) {
    case "docs":
      return <BookOpen className="h-4 w-4" />;
    case "news":
      return <TrendingUp className="h-4 w-4" />;
    case "image":
      return <ImageIcon className="h-4 w-4" />;
    case "video":
      return <LayoutGrid className="h-4 w-4" />;
    default:
      return <Globe className="h-4 w-4" />;
  }
}

function ResultCard({ result }: { result: SearchResult }) {
  return (
    <Card className="overflow-hidden rounded-2xl border-border/70 bg-background shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="space-y-3 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-[11px]">
                <ResultIcon type={result.type} />
                <span className="ml-1 capitalize">{result.type}</span>
              </Badge>
              <span className="inline-flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {result.updatedAt}
              </span>
            </div>

            <CardTitle className="line-clamp-2 text-base font-semibold leading-snug sm:text-lg">
              <Link href="#" className="transition-colors hover:text-primary">
                {result.title}
              </Link>
            </CardTitle>

            <CardDescription className="mt-1 flex items-center gap-2 text-xs sm:text-sm">
              <span className="font-medium text-foreground/90">{result.domain}</span>
              <span className="text-muted-foreground">•</span>
              <span className="truncate text-muted-foreground">{result.url}</span>
            </CardDescription>
          </div>

          <Badge variant="outline" className="rounded-full px-2.5 py-1 text-xs">
            <Star className="mr-1 h-3.5 w-3.5" />
            {result.score}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
          {result.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {result.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="rounded-full px-2.5 py-1 text-[11px]">
              {tag}
            </Badge>
          ))}
        </div>

        <Separator />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {result.isBookmarked ? <Badge variant="secondary" className="rounded-full">Saved</Badge> : null}
            <span>Result #{result.id}</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 rounded-xl px-3">
              Preview
            </Button>
            <Button size="sm" className="h-8 rounded-xl px-3">
              Open
              <ExternalLink className="ml-2 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SearchPage() {
  const [query, setQuery] = React.useState("search engine ui");
  const [activeType, setActiveType] = React.useState<ResultType | "all">("all");
  const [sortBy, setSortBy] = React.useState("relevance");
  const [safeSearch, setSafeSearch] = React.useState(true);
  const [bookmarksOnly, setBookmarksOnly] = React.useState(false);
  const [page, setPage] = React.useState(1);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    let items = ALL_RESULTS.filter((item) => {
      const matchesQuery =
        !q ||
        [item.title, item.description, item.domain, item.url, ...item.tags]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesType = activeType === "all" || item.type === activeType;
      const matchesBookmarks = !bookmarksOnly || Boolean(item.isBookmarked);
      const matchesSafeSearch = safeSearch ? item.type !== "video" : true;

      return matchesQuery && matchesType && matchesBookmarks && matchesSafeSearch;
    });

    items = [...items].sort((a, b) => {
      if (sortBy === "recent") return b.updatedAt.localeCompare(a.updatedAt);
      if (sortBy === "score") return b.score - a.score;
      return b.score - a.score;
    });

    return items;
  }, [query, activeType, sortBy, safeSearch, bookmarksOnly]);

  const totalResults = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));
  const currentPage = clampPage(page, totalPages);
  const pageItems = getPageItems(filtered, currentPage, PAGE_SIZE);
  const pageWindow = buildPageWindow(currentPage, totalPages);

  React.useEffect(() => {
    setPage(1);
  }, [query, activeType, sortBy, safeSearch, bookmarksOnly]);

  const hasResults = pageItems.length > 0;

  return (
    <main className="min-h-screen bg-background">
      <section className="flex min-h-screen flex-col px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4">
          <header className="rounded-2xl border bg-muted/20 p-4 shadow-sm backdrop-blur-sm sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  Search results
                </div>
                <div>
                  <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                    YggNet
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground sm:text-base">
                    Search, refine, and navigate results in the same visual language as the home page.
                  </p>
                </div>
              </div>

              <div className="grid gap-2 sm:grid-cols-3">
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Results</p>
                  <p className="mt-1 text-xl font-semibold">{totalResults}</p>
                </div>
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Page</p>
                  <p className="mt-1 text-xl font-semibold">
                    {currentPage} / {totalPages}
                  </p>
                </div>
                <div className="rounded-xl border bg-background px-4 py-3">
                  <p className="text-xs text-muted-foreground">Mode</p>
                  <p className="mt-1 text-xl font-semibold capitalize">{sortBy}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="flex items-center gap-2 rounded-2xl border bg-background px-3 py-2 shadow-sm focus-within:ring-2 focus-within:ring-ring">
                <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search the web, docs, or anything..."
                  className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
                />
                {query ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-xl"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <Filter className="mr-2 h-4 w-4" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 rounded-2xl">
                    <DropdownMenuLabel>Search filters</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={safeSearch}
                      onCheckedChange={(checked) => setSafeSearch(Boolean(checked))}
                    >
                      Safe search
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={bookmarksOnly}
                      onCheckedChange={(checked) => setBookmarksOnly(Boolean(checked))}
                    >
                      Bookmarks only
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="rounded-xl">
                      <ListFilter className="mr-2 h-4 w-4" />
                      {SORTS.find((s) => s.value === sortBy)?.label ?? "Sort"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                    <DropdownMenuLabel>Sort results</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                      {SORTS.map((sort) => (
                        <DropdownMenuRadioItem key={sort.value} value={sort.value}>
                          {sort.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" className="rounded-xl">
                  <Settings2 className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <Tabs value={activeType} onValueChange={(value) => setActiveType(value as typeof activeType)}>
                <TabsList className="h-auto flex-wrap gap-1 rounded-2xl p-1">
                  {RESULT_TYPES.map((item) => (
                    <TabsTrigger
                      key={item.value}
                      value={item.value}
                      className="rounded-xl px-3 py-2 text-sm data-[state=active]:shadow-sm"
                    >
                      <span className="mr-2 inline-flex items-center">{item.icon}</span>
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="h-4 w-4" />
                <span>{safeSearch ? "Safe search on" : "Safe search off"}</span>
              </div>
            </div>
          </header>

          <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
            <section className="space-y-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <p>
                  Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, totalResults)}-
                  {Math.min(currentPage * PAGE_SIZE, totalResults)} of {totalResults}
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border bg-muted/30 px-3 py-1 text-xs">
                  <ArrowUpDown className="h-3.5 w-3.5" />
                  {SORTS.find((s) => s.value === sortBy)?.label}
                </div>
              </div>

              {!hasResults ? (
                <Card className="rounded-2xl border-dashed bg-background">
                  <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                    <div className="rounded-full border bg-muted/30 p-4">
                      <Search className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-lg font-semibold">No results found</h2>
                      <p className="max-w-md text-sm text-muted-foreground">
                        Try another keyword or clear some filters.
                      </p>
                    </div>
                    <Button
                      onClick={() => {
                        setQuery("");
                        setActiveType("all");
                        setBookmarksOnly(false);
                      }}
                    >
                      Reset search
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {pageItems.map((result) => (
                    <ResultCard key={result.id} result={result} />
                  ))}
                </div>
              )}

              {hasResults ? (
                <div className="rounded-2xl border bg-background p-3 shadow-sm sm:p-4">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          aria-disabled={currentPage === 1}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => clampPage(p - 1, totalPages));
                          }}
                        />
                      </PaginationItem>

                      {pageWindow.map((item, index) =>
                        item === -1 ? (
                          <PaginationItem key={`ellipsis-${index}`}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              href="#"
                              isActive={item === currentPage}
                              onClick={(e) => {
                                e.preventDefault();
                                setPage(item);
                              }}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          aria-disabled={currentPage === totalPages}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage((p) => clampPage(p + 1, totalPages));
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              ) : null}
            </section>

            <aside className="space-y-4 lg:sticky lg:top-4 lg:h-fit">
              <Card className="rounded-2xl border bg-muted/20 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Search insights</CardTitle>
                  <CardDescription>Quick signals for the current query.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Top domain</p>
                      <p className="mt-1 truncate text-sm font-medium">yggnet.app</p>
                    </div>
                    <div className="rounded-xl border bg-background p-3">
                      <p className="text-xs text-muted-foreground">Avg. score</p>
                      <p className="mt-1 text-sm font-medium">
                        {Math.round(
                          filtered.reduce((sum, item) => sum + item.score, 0) /
                            Math.max(filtered.length, 1)
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                      Suggestions
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {["next.js ui", "search ranking", "shadcn pagination", "semantic search"].map(
                        (suggestion) => (
                          <Button
                            key={suggestion}
                            variant="secondary"
                            size="sm"
                            className="rounded-full"
                            onClick={() => setQuery(suggestion)}
                          >
                            {suggestion}
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border bg-muted/20 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Keyboard help</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
                    <span>Search</span>
                    <Badge variant="outline" className="rounded-full">/</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
                    <span>Next page</span>
                    <Badge variant="outline" className="rounded-full">→</Badge>
                  </div>
                  <div className="flex items-center justify-between rounded-xl border bg-background px-3 py-2">
                    <span>Previous page</span>
                    <Badge variant="outline" className="rounded-full">←</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl border bg-muted/20 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Active filters</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Badge variant={activeType === "all" ? "default" : "secondary"} className="rounded-full">
                    {activeType === "all" ? "All types" : activeType}
                  </Badge>
                  <Badge variant={sortBy === "relevance" ? "default" : "secondary"} className="rounded-full">
                    <ArrowUpDown className="mr-1 h-3.5 w-3.5" />
                    {sortBy}
                  </Badge>
                  {safeSearch ? <Badge variant="secondary" className="rounded-full">Safe search</Badge> : null}
                  {bookmarksOnly ? <Badge variant="secondary" className="rounded-full">Bookmarks only</Badge> : null}
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
