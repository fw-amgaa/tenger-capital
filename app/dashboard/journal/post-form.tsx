"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useUploadThing } from "@/lib/uploadthing-client";
import { ImagePlus, Loader2, Save, Trash2, X } from "lucide-react";
import type { JournalPostRow } from "@/lib/db/schema";
import { JOURNAL_CATEGORIES } from "@/lib/journal/data";

type FormState = {
  slug: string;
  title: string;
  excerpt: string;
  lede: string;
  bodyHtml: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  authorInitials: string;
  coverImage: string | null;
  readTime: number;
  featured: boolean;
  published: boolean;
};

const EMPTY: FormState = {
  slug: "",
  title: "",
  excerpt: "",
  lede: "",
  bodyHtml: "",
  category: "Шинжилгээ",
  tags: [],
  author: "",
  authorRole: "",
  authorInitials: "",
  coverImage: null,
  readTime: 5,
  featured: false,
  published: false,
};

function fromRow(row: JournalPostRow): FormState {
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    lede: row.lede,
    bodyHtml: row.bodyHtml,
    category: row.category,
    tags: row.tags,
    author: row.author,
    authorRole: row.authorRole,
    authorInitials: row.authorInitials,
    coverImage: row.coverImage,
    readTime: row.readTime,
    featured: row.featured,
    published: row.published,
  };
}

export function PostForm({
  initial,
  mode,
}: {
  initial?: JournalPostRow;
  mode: "new" | "edit";
}) {
  const router = useRouter();
  const [state, setState] = useState<FormState>(
    initial ? fromRow(initial) : EMPTY,
  );
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]?.ufsUrl) {
        set("coverImage", res[0].ufsUrl);
        toast.success("Зураг нэмэгдлээ.");
      }
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });

  // Auto-derive author initials when author name changes (only if blank)
  useEffect(() => {
    if (!state.author || state.authorInitials) return;
    const initials = state.author
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("");
    if (initials) setState((s) => ({ ...s, authorInitials: initials }));
  }, [state.author, state.authorInitials]);

  const addTag = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (state.tags.includes(t)) return;
    set("tags", [...state.tags, t]);
    setTagInput("");
  };
  const removeTag = (t: string) =>
    set(
      "tags",
      state.tags.filter((x) => x !== t),
    );

  const handleSave = async () => {
    if (!state.title.trim()) {
      toast.error("Гарчиг шаардлагатай.");
      return;
    }
    setSaving(true);
    try {
      const url =
        mode === "new"
          ? "/api/journal/posts"
          : `/api/journal/posts/${initial?.slug}`;
      const method = mode === "new" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        toast.error(err.error || "Хадгалахад алдаа гарлаа.");
        return;
      }
      const saved = await res.json();
      toast.success(mode === "new" ? "Үүсгэлээ." : "Шинэчиллээ.");
      if (mode === "new") {
        router.push(`/dashboard/journal/${saved.id}`);
      } else {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initial) return;
    if (!confirm("Энэ нийтлэлийг устгах уу?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/journal/posts/${initial.slug}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Устгагдлаа.");
        router.push("/dashboard/journal");
      } else {
        toast.error("Устгахад алдаа гарлаа.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-5 max-w-4xl">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Үндсэн мэдээлэл</CardTitle>
          <CardDescription>Гарчиг, ангилал, зохиогч.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Title
            </Label>
            <Input
              value={state.title}
              onChange={(e) => set("title", e.target.value)}
              placeholder="Зах зээлийн хэлбэлзэл..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Slug
              </Label>
              <Input
                value={state.slug}
                onChange={(e) => set("slug", e.target.value)}
                placeholder="market-volatility-2026"
              />
              <p className="text-xs text-muted-foreground">
                Хоосон үлдээвэл title-аас автоматаар үүснэ.
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Category
              </Label>
              <select
                value={state.category}
                onChange={(e) => set("category", e.target.value)}
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                {JOURNAL_CATEGORIES.filter((c) => c.id !== "all").map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label} · {c.labelEn}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Excerpt
            </Label>
            <Textarea
              value={state.excerpt}
              onChange={(e) => set("excerpt", e.target.value)}
              rows={3}
              placeholder="Карт дээр харагдах товч хураангуй."
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Lede
            </Label>
            <Textarea
              value={state.lede}
              onChange={(e) => set("lede", e.target.value)}
              rows={3}
              placeholder="Нийтлэлийн дээд талд гарах хошуу мэдрэмж."
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Хавтасны зураг</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {state.coverImage ? (
            <div className="relative w-full max-w-md aspect-[4/3] rounded-lg overflow-hidden border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={state.coverImage}
                alt=""
                className="w-full h-full object-cover"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => set("coverImage", null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div
              className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/40"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin opacity-60" />
              ) : (
                <ImagePlus className="h-6 w-6 opacity-60" />
              )}
              <span className="text-sm text-muted-foreground">
                Зураг сонгох (PNG/JPG/WEBP, 8MB хүртэл)
              </span>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) startUpload([f]);
              e.target.value = "";
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Зохиогч</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Name
            </Label>
            <Input
              value={state.author}
              onChange={(e) => set("author", e.target.value)}
              placeholder="Б. Нэргүй"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Role
            </Label>
            <Input
              value={state.authorRole}
              onChange={(e) => set("authorRole", e.target.value)}
              placeholder="Шинжээч ахлах"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Initials
            </Label>
            <Input
              value={state.authorInitials}
              onChange={(e) => set("authorInitials", e.target.value)}
              maxLength={3}
              placeholder="БН"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Тагууд</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {state.tags.map((t) => (
              <Badge
                key={t}
                variant="secondary"
                className="gap-1 pl-2 pr-1 py-1"
              >
                {t}
                <button
                  type="button"
                  onClick={() => removeTag(t)}
                  className="hover:bg-muted rounded p-0.5"
                  aria-label={`Remove ${t}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addTag(tagInput);
                }
              }}
              placeholder="Таг бичээд Enter дарна уу"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => addTag(tagInput)}
            >
              Нэмэх
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Агуулга</CardTitle>
          <CardDescription>
            Нийтлэлийн биеийг энд бичнэ. H2/H3, жагсаалт, эшлэл дэмжинэ.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={state.bodyHtml}
            onChange={(html) => set("bodyHtml", html)}
            placeholder="Нийтлэлийн агуулга..."
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Тохиргоо</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1 max-w-xs">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Read time (min)
            </Label>
            <Input
              type="number"
              min={1}
              max={60}
              value={state.readTime}
              onChange={(e) => set("readTime", Number(e.target.value) || 1)}
            />
          </div>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={state.featured}
              onChange={(e) => set("featured", e.target.checked)}
            />
            <div>
              <div className="font-medium">Editor&apos;s pick</div>
              <div className="text-xs text-muted-foreground">
                Журналын нүүрэнд том картаар онцлогдоно. Нэг л нийтлэл идэвхтэй
                байж болно.
              </div>
            </div>
          </label>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={state.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            <div>
              <div className="font-medium">Нийтлэх</div>
              <div className="text-xs text-muted-foreground">
                Тэмдэглэвэл уншигчдад нийтэд харагдана.
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 pb-6">
        {mode === "edit" && initial ? (
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive"
            onClick={handleDelete}
            disabled={deleting}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleting ? "Устгаж байна…" : "Устгах"}
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}
