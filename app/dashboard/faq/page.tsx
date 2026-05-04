"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Plus, Pencil, Eye, EyeOff, Save } from "lucide-react";
import type {
  FaqCategoryRow,
  FaqPromoRow,
  FaqQuestionRow,
} from "@/lib/db/schema";
import { FaqDashboardShell } from "./dashboard-shell";

export default function FaqDashboardPage() {
  const [cats, setCats] = useState<FaqCategoryRow[]>([]);
  const [questions, setQuestions] = useState<FaqQuestionRow[]>([]);
  const [promo, setPromo] = useState<FaqPromoRow | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const [c, q, p] = await Promise.all([
        fetch("/api/faq/categories").then((r) => r.json()),
        fetch("/api/faq/questions").then((r) => r.json()),
        fetch("/api/faq/promo").then((r) => r.json()),
      ]);
      if (Array.isArray(c)) setCats(c);
      if (Array.isArray(q)) setQuestions(q);
      setPromo(p);
    } catch {
      toast.error("Жагсаалтыг ачаалж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  return (
    <FaqDashboardShell
      crumbs={[{ label: "FAQ", href: "/dashboard/faq" }]}
      title="FAQ удирдлага"
      subtitle="Категориуд, асуултууд, баннер болон орчуулгыг бүгдийг энд засна."
      actions={
        <Button asChild>
          <Link href="/faq" target="_blank">
            <Eye className="size-4 mr-1" /> Хуудас үзэх
          </Link>
        </Button>
      }
    >
      <PromoEditor promo={promo} onSaved={reload} />

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Категориуд</CardTitle>
            <CardDescription>
              Дарааллыг `sortOrder`-оор удирдана. Нийтлэгдээгүй категори нь
              сайтад харагдахгүй.
            </CardDescription>
          </div>
          <CreateCategoryButton onCreated={reload} />
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          {loading && (
            <p className="text-sm text-muted-foreground">Ачааллаж байна...</p>
          )}
          {!loading && cats.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Категори үүсгэгдээгүй байна. Доорх товчоор эхлүүлнэ үү.
            </p>
          )}
          {cats.map((c) => {
            const qCount = questions.filter((q) => q.categoryId === c.id).length;
            return (
              <Link
                key={c.id}
                href={`/dashboard/faq/${c.id}`}
                className="group flex items-center justify-between gap-4 rounded-md border p-3 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground w-8">
                    {c.icon || "—"}
                  </span>
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {c.labelMn || c.labelEn || c.slug}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {c.labelEn} · /{c.slug} · {qCount} асуулт
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                  {c.published ? (
                    <Eye className="size-4 text-emerald-600" />
                  ) : (
                    <EyeOff className="size-4 text-muted-foreground" />
                  )}
                  <Pencil className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </CardContent>
      </Card>
    </FaqDashboardShell>
  );
}

function CreateCategoryButton({ onCreated }: { onCreated: () => void }) {
  const [open, setOpen] = useState(false);
  const [labelMn, setLabelMn] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [icon, setIcon] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!labelMn && !labelEn) {
      toast.error("Нэр (MN эсвэл EN) шаардлагатай.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/faq/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ labelMn, labelEn, icon }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Үүсгэж чадсангүй.");
      return;
    }
    toast.success("Категори үүслээ.");
    setOpen(false);
    setLabelMn("");
    setLabelEn("");
    setIcon("");
    onCreated();
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus className="size-4 mr-1" /> Шинэ категори
      </Button>
    );
  }
  return (
    <div className="flex flex-col gap-2 rounded-md border p-3 bg-accent/40 w-[360px]">
      <Input
        placeholder="Нэр (MN)"
        value={labelMn}
        onChange={(e) => setLabelMn(e.target.value)}
      />
      <Input
        placeholder="Label (EN)"
        value={labelEn}
        onChange={(e) => setLabelEn(e.target.value)}
      />
      <Input
        placeholder="Icon (e.g. 01)"
        value={icon}
        onChange={(e) => setIcon(e.target.value)}
      />
      <div className="flex gap-2">
        <Button size="sm" onClick={submit} disabled={saving}>
          {saving ? "..." : "Үүсгэх"}
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setOpen(false)}>
          Болих
        </Button>
      </div>
    </div>
  );
}

function PromoEditor({
  promo,
  onSaved,
}: {
  promo: FaqPromoRow | null;
  onSaved: () => void;
}) {
  const [state, setState] = useState({
    eyebrowMn: "",
    eyebrowEn: "",
    metaMn: "",
    metaEn: "",
    titleMn: "",
    titleEn: "",
    blurbMn: "",
    blurbEn: "",
    ctaMn: "",
    ctaEn: "",
    glyph: "",
    cornerLabel: "",
    enabled: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!promo) return;
    setState({
      eyebrowMn: promo.eyebrowMn,
      eyebrowEn: promo.eyebrowEn,
      metaMn: promo.metaMn,
      metaEn: promo.metaEn,
      titleMn: promo.titleMn,
      titleEn: promo.titleEn,
      blurbMn: promo.blurbMn,
      blurbEn: promo.blurbEn,
      ctaMn: promo.ctaMn,
      ctaEn: promo.ctaEn,
      glyph: promo.glyph,
      cornerLabel: promo.cornerLabel,
      enabled: promo.enabled,
    });
  }, [promo]);

  const set = <K extends keyof typeof state>(k: K, v: (typeof state)[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const save = async () => {
    setSaving(true);
    const res = await fetch("/api/faq/promo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Хадгалж чадсангүй.");
      return;
    }
    toast.success("Промо хадгалагдлаа.");
    onSaved();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Промо баннер</CardTitle>
        <CardDescription>
          /faq хуудасны дээд талд гарах онцолсон зурвас. Хоёр хэлээр бөглөнө.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <Bilingual
          labelMn="Eyebrow (MN)"
          labelEn="Eyebrow (EN)"
          mn={state.eyebrowMn}
          en={state.eyebrowEn}
          onMn={(v) => set("eyebrowMn", v)}
          onEn={(v) => set("eyebrowEn", v)}
        />
        <Bilingual
          labelMn="Pulse мета (MN)"
          labelEn="Pulse meta (EN)"
          mn={state.metaMn}
          en={state.metaEn}
          onMn={(v) => set("metaMn", v)}
          onEn={(v) => set("metaEn", v)}
        />
        <Bilingual
          labelMn="Гарчиг (MN)"
          labelEn="Title (EN)"
          mn={state.titleMn}
          en={state.titleEn}
          onMn={(v) => set("titleMn", v)}
          onEn={(v) => set("titleEn", v)}
        />
        <Bilingual
          labelMn="Тайлбар (MN)"
          labelEn="Blurb (EN)"
          mn={state.blurbMn}
          en={state.blurbEn}
          onMn={(v) => set("blurbMn", v)}
          onEn={(v) => set("blurbEn", v)}
          textarea
        />
        <Bilingual
          labelMn="CTA (MN)"
          labelEn="CTA (EN)"
          mn={state.ctaMn}
          en={state.ctaEn}
          onMn={(v) => set("ctaMn", v)}
          onEn={(v) => set("ctaEn", v)}
        />
        <div className="flex flex-col gap-2">
          <Label>Glyph (нэг тэмдэгт)</Label>
          <Input
            value={state.glyph}
            maxLength={4}
            onChange={(e) => set("glyph", e.target.value)}
          />
          <Label className="mt-2">Булангийн тэмдэглэгээ</Label>
          <Input
            value={state.cornerLabel}
            onChange={(e) => set("cornerLabel", e.target.value)}
          />
          <label className="flex items-center gap-2 text-sm mt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={state.enabled}
              onChange={(e) => set("enabled", e.target.checked)}
            />
            <span>Идэвхтэй (харагдах)</span>
          </label>
          <Button onClick={save} disabled={saving} className="mt-2 w-fit">
            <Save className="size-4 mr-1" /> Хадгалах
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Bilingual({
  labelMn,
  labelEn,
  mn,
  en,
  onMn,
  onEn,
  textarea = false,
}: {
  labelMn: string;
  labelEn: string;
  mn: string;
  en: string;
  onMn: (v: string) => void;
  onEn: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{labelMn}</Label>
      {textarea ? (
        <Textarea value={mn} rows={3} onChange={(e) => onMn(e.target.value)} />
      ) : (
        <Input value={mn} onChange={(e) => onMn(e.target.value)} />
      )}
      <Label>{labelEn}</Label>
      {textarea ? (
        <Textarea value={en} rows={3} onChange={(e) => onEn(e.target.value)} />
      ) : (
        <Input value={en} onChange={(e) => onEn(e.target.value)} />
      )}
    </div>
  );
}
