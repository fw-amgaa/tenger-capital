"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Plus, Save, Trash2 } from "lucide-react";
import type { FaqCategoryRow, FaqQuestionRow } from "@/lib/db/schema";
import { FaqDashboardShell } from "../dashboard-shell";

export default function CategoryEditor({
  cat,
  questions,
}: {
  cat: FaqCategoryRow;
  questions: FaqQuestionRow[];
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    icon: cat.icon,
    slug: cat.slug,
    labelMn: cat.labelMn,
    labelEn: cat.labelEn,
    introMn: cat.introMn,
    introEn: cat.introEn,
    videoTitleMn: cat.videoTitleMn,
    videoTitleEn: cat.videoTitleEn,
    videoDuration: cat.videoDuration,
    videoThumb: cat.videoThumb,
    videoThumbNote: cat.videoThumbNote,
    accent: cat.accent,
    sortOrder: cat.sortOrder,
    published: cat.published,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/faq/categories/${cat.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Хадгалж чадсангүй.");
      return;
    }
    toast.success("Хадгалагдлаа.");
    router.refresh();
  };

  const remove = async () => {
    if (
      !confirm(
        "Энэ категори болон бүх асуултыг устгах уу? Үйлдэл буцаагдахгүй.",
      )
    )
      return;
    setDeleting(true);
    const res = await fetch(`/api/faq/categories/${cat.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Устгаж чадсангүй.");
      return;
    }
    toast.success("Устгагдлаа.");
    router.push("/dashboard/faq");
  };

  return (
    <FaqDashboardShell
      crumbs={[
        { label: "FAQ", href: "/dashboard/faq" },
        { label: cat.labelMn || cat.labelEn || cat.slug },
      ]}
      title={cat.labelMn || cat.labelEn || "Категори"}
      subtitle="Категорийн талбарууд + асуултууд."
      actions={
        <>
          <Button asChild variant="ghost" size="sm">
            <Link href="/dashboard/faq">
              <ChevronLeft className="size-4 mr-1" /> Буцах
            </Link>
          </Button>
          <Button onClick={save} disabled={saving}>
            <Save className="size-4 mr-1" /> {saving ? "Хадгалж..." : "Хадгалах"}
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={remove}
            disabled={deleting}
          >
            <Trash2 className="size-4 mr-1" /> Устгах
          </Button>
        </>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Үндсэн талбарууд</CardTitle>
          <CardDescription>
            MN — заавал. EN — нэмэлт. Хоёр хэлийг ч энд бөглөнө.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label>Icon (e.g. 01)</Label>
            <Input
              value={form.icon}
              onChange={(e) => set("icon", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Slug</Label>
            <Input
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Нэр (MN)</Label>
            <Input
              value={form.labelMn}
              onChange={(e) => set("labelMn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Label (EN)</Label>
            <Input
              value={form.labelEn}
              onChange={(e) => set("labelEn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Танилцуулга (MN)</Label>
            <Textarea
              rows={3}
              value={form.introMn}
              onChange={(e) => set("introMn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Intro (EN)</Label>
            <Textarea
              rows={3}
              value={form.introEn}
              onChange={(e) => set("introEn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Видео гарчиг (MN)</Label>
            <Input
              value={form.videoTitleMn}
              onChange={(e) => set("videoTitleMn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Video title (EN)</Label>
            <Input
              value={form.videoTitleEn}
              onChange={(e) => set("videoTitleEn", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Видео үргэлжлэх хугацаа (e.g. 4:18)</Label>
            <Input
              value={form.videoDuration}
              onChange={(e) => set("videoDuration", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Видео thumb (CSS gradient)</Label>
            <Input
              value={form.videoThumb}
              onChange={(e) => set("videoThumb", e.target.value)}
              placeholder="linear-gradient(...)"
            />
          </div>
          <div className="flex flex-col gap-2 md:col-span-2">
            <Label>Видео thumb note</Label>
            <Input
              value={form.videoThumbNote}
              onChange={(e) => set("videoThumbNote", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Accent өнгө</Label>
            <Input
              value={form.accent}
              onChange={(e) => set("accent", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Дараалал (sortOrder)</Label>
            <Input
              type="number"
              value={form.sortOrder}
              onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
            />
          </div>
          <label className="flex items-center gap-3 text-sm cursor-pointer md:col-span-2">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
            />
            <div>
              <div className="font-medium">Нийтлэх</div>
              <div className="text-xs text-muted-foreground">
                Тэмдэглэгдсэн үед /faq хуудсанд харагдана.
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      <QuestionsBlock catId={cat.id} initial={questions} />
    </FaqDashboardShell>
  );
}

function QuestionsBlock({
  catId,
  initial,
}: {
  catId: string;
  initial: FaqQuestionRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initial);

  const reload = async () => {
    const res = await fetch(
      `/api/faq/questions?categoryId=${encodeURIComponent(catId)}`,
    );
    if (res.ok) setItems(await res.json());
    router.refresh();
  };

  const add = async () => {
    const res = await fetch("/api/faq/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId: catId,
        sortOrder: items.length,
      }),
    });
    if (!res.ok) {
      toast.error("Үүсгэж чадсангүй.");
      return;
    }
    toast.success("Шинэ асуулт нэмэгдлээ.");
    reload();
  };

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Асуултууд</CardTitle>
          <CardDescription>
            **bold** дотроо тэмдэглэвэл дэлгэцэнд эрхэмлэн харуулна. Popular
            тэмдэг тавьсан нь &quot;Most asked&quot; самбарт орох болзолтой.
          </CardDescription>
        </div>
        <Button size="sm" onClick={add}>
          <Plus className="size-4 mr-1" /> Шинэ асуулт
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Асуулт байхгүй. Дээрх товчоор эхлүүлнэ үү.
          </p>
        )}
        {items.map((q) => (
          <QuestionRow key={q.id} q={q} onChanged={reload} />
        ))}
      </CardContent>
    </Card>
  );
}

function QuestionRow({
  q,
  onChanged,
}: {
  q: FaqQuestionRow;
  onChanged: () => void;
}) {
  const [form, setForm] = useState({
    qMn: q.qMn,
    qEn: q.qEn,
    aMn: q.aMn,
    aEn: q.aEn,
    helpful: q.helpful,
    isPopular: q.isPopular,
    popularRank: q.popularRank ?? 0,
    sortOrder: q.sortOrder,
    published: q.published,
  });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await fetch(`/api/faq/questions/${q.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        popularRank: form.isPopular ? form.popularRank : null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Хадгалж чадсангүй.");
      return;
    }
    toast.success("Хадгалагдлаа.");
    onChanged();
  };

  const remove = async () => {
    if (!confirm("Энэ асуултыг устгах уу?")) return;
    setDeleting(true);
    const res = await fetch(`/api/faq/questions/${q.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Устгаж чадсангүй.");
      return;
    }
    toast.success("Устгагдлаа.");
    onChanged();
  };

  return (
    <div className="rounded-md border p-4 flex flex-col gap-3">
      <div className="grid gap-3 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label>Асуулт (MN)</Label>
          <Input value={form.qMn} onChange={(e) => set("qMn", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2">
          <Label>Question (EN)</Label>
          <Input value={form.qEn} onChange={(e) => set("qEn", e.target.value)} />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label>Хариулт (MN) — **bold** дэмжинэ</Label>
          <Textarea
            rows={4}
            value={form.aMn}
            onChange={(e) => set("aMn", e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2 md:col-span-2">
          <Label>Answer (EN) — **bold** supported</Label>
          <Textarea
            rows={4}
            value={form.aEn}
            onChange={(e) => set("aEn", e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Helpful count</Label>
          <Input
            type="number"
            className="w-24"
            value={form.helpful}
            onChange={(e) => set("helpful", Number(e.target.value) || 0)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Sort order</Label>
          <Input
            type="number"
            className="w-24"
            value={form.sortOrder}
            onChange={(e) => set("sortOrder", Number(e.target.value) || 0)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPopular}
            onChange={(e) => set("isPopular", e.target.checked)}
          />
          Popular
        </label>
        {form.isPopular && (
          <div className="flex flex-col gap-1">
            <Label className="text-xs">Popular rank</Label>
            <Input
              type="number"
              className="w-24"
              value={form.popularRank}
              onChange={(e) =>
                set("popularRank", Number(e.target.value) || 0)
              }
            />
          </div>
        )}
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => set("published", e.target.checked)}
          />
          Нийтлэх
        </label>
        <div className="ml-auto flex gap-2">
          <Button size="sm" onClick={save} disabled={saving}>
            <Save className="size-4 mr-1" /> {saving ? "..." : "Хадгалах"}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            onClick={remove}
            disabled={deleting}
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
