"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Trash2 } from "lucide-react";
import { JournalDashboardShell } from "../dashboard-shell";
import type { JournalCommentRow, JournalPostRow } from "@/lib/db/schema";

type CommentWithPost = JournalCommentRow & {
  postSlug?: string;
  postTitle?: string;
};

export default function JournalCommentsPage() {
  const [items, setItems] = useState<CommentWithPost[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [commentsRes, postsRes] = await Promise.all([
        fetch("/api/journal/comments?all=1"),
        fetch("/api/journal/posts?drafts=1"),
      ]);
      const comments: JournalCommentRow[] = await commentsRes.json();
      const posts: JournalPostRow[] = await postsRes.json();
      const postMap = new Map(posts.map((p) => [p.id, p]));
      setItems(
        comments.map((c) => ({
          ...c,
          postSlug: postMap.get(c.postId)?.slug,
          postTitle: postMap.get(c.postId)?.title,
        })),
      );
    } catch {
      toast.error("Сэтгэгдэлүүдийг ачаалж чадсангүй.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string, approved: boolean) => {
    const res = await fetch(`/api/journal/comments/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved }),
    });
    if (res.ok) {
      setItems((prev) =>
        prev.map((c) => (c.id === id ? { ...c, approved } : c)),
      );
      toast.success(approved ? "Зөвшөөрөв." : "Татан буулгав.");
    } else {
      toast.error("Алдаа гарлаа.");
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Энэ сэтгэгдлийг устгах уу?")) return;
    const res = await fetch(`/api/journal/comments/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setItems((prev) => prev.filter((c) => c.id !== id));
      toast.success("Устгагдлаа.");
    } else {
      toast.error("Алдаа гарлаа.");
    }
  };

  const pending = items.filter((c) => !c.approved);
  const approved = items.filter((c) => c.approved);

  return (
    <JournalDashboardShell
      crumbs={[
        { label: "Журнал", href: "/dashboard/journal" },
        { label: "Сэтгэгдэл" },
      ]}
      title="Сэтгэгдэл — Шүүлт"
      subtitle="Шинэ сэтгэгдэлийг зөвшөөрсний дараа л нийтэд харагдана."
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : items.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Сэтгэгдэл алга</CardTitle>
            <CardDescription>Хоосон.</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="grid gap-6">
          <Section
            title={`Хүлээгдэж буй (${pending.length})`}
            items={pending}
            onApprove={(id) => approve(id, true)}
            onDelete={remove}
            actionLabel="Зөвшөөрөх"
          />
          <Section
            title={`Зөвшөөрөгдсөн (${approved.length})`}
            items={approved}
            onApprove={(id) => approve(id, false)}
            onDelete={remove}
            actionLabel="Татан буулгах"
          />
        </div>
      )}
    </JournalDashboardShell>
  );
}

function Section({
  title,
  items,
  onApprove,
  onDelete,
  actionLabel,
}: {
  title: string;
  items: CommentWithPost[];
  onApprove: (id: string) => void;
  onDelete: (id: string) => void;
  actionLabel: string;
}) {
  if (items.length === 0)
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>Юу ч алга.</CardDescription>
        </CardHeader>
      </Card>
    );
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {items.map((c) => (
          <div
            key={c.id}
            className="border rounded-lg p-4 grid grid-cols-[40px_1fr_auto] gap-3"
          >
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold">
              {c.authorInitials || "?"}
            </div>
            <div className="space-y-1">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-medium text-sm">{c.authorName}</span>
                {c.isAuthor && (
                  <Badge variant="outline" className="text-[10px]">
                    АВТОР
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>
              {c.postTitle && (
                <div className="text-xs text-muted-foreground">
                  → {c.postTitle}
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap">{c.body}</div>
            </div>
            <div className="flex flex-col gap-1">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onApprove(c.id)}
              >
                <Check className="mr-1 h-3.5 w-3.5" />
                {actionLabel}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="text-destructive hover:text-destructive"
                onClick={() => onDelete(c.id)}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" />
                Устгах
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
