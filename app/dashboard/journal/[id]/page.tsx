"use client";

import { use, useEffect, useState } from "react";
import { JournalDashboardShell } from "../dashboard-shell";
import { PostForm } from "../post-form";
import type { JournalPostRow } from "@/lib/db/schema";
import { toast } from "sonner";

export default function EditJournalPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [post, setPost] = useState<JournalPostRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/journal/posts/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => setPost(data))
      .catch(() => toast.error("Нийтлэлийг олсонгүй."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <JournalDashboardShell
      crumbs={[
        { label: "Журнал", href: "/dashboard/journal" },
        { label: post?.title || "Засах" },
      ]}
      title={post ? `Засах · ${post.title}` : "Засах"}
      subtitle={post ? `/${post.slug}` : undefined}
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : post ? (
        <PostForm mode="edit" initial={post} />
      ) : (
        <div className="text-muted-foreground text-sm">Нийтлэл олдсонгүй.</div>
      )}
    </JournalDashboardShell>
  );
}
