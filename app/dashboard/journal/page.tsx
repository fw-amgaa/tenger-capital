"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Pencil, ExternalLink, Star, Eye, EyeOff } from "lucide-react";
import { JournalDashboardShell } from "./dashboard-shell";
import type { JournalPostRow } from "@/lib/db/schema";

export default function JournalListPage() {
  const [posts, setPosts] = useState<JournalPostRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal/posts?drafts=1")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setPosts(data))
      .catch(() => toast.error("Жагсаалтыг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <JournalDashboardShell
      crumbs={[{ label: "Журнал" }]}
      title="Журнал — Нийтлэлүүд"
      subtitle="Бүх нийтлэлийн жагсаалт. Шинэ нийтлэл нэмэх, ноорогт ажиллах боломжтой."
      actions={
        <Button asChild>
          <Link href="/dashboard/journal/new">
            <Plus className="mr-2 h-4 w-4" />
            Шинэ нийтлэл
          </Link>
        </Button>
      }
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : posts.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Нийтлэл алга байна</CardTitle>
            <CardDescription>
              Эхний нийтлэлээ үүсгэхийн тулд дээрх товчийг дарна уу.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Author</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Views</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium flex items-center gap-2">
                      {p.featured && (
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      )}
                      <Link
                        href={`/dashboard/journal/${p.id}`}
                        className="hover:underline"
                      >
                        {p.title}
                      </Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{p.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{p.author || "—"}</div>
                    <div className="text-xs text-muted-foreground">
                      {p.authorRole}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {p.published ? (
                      <Badge className="bg-green-600/15 text-green-400 border-green-600/30">
                        <Eye className="mr-1 h-3 w-3" />
                        Нийтлэгдсэн
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="mr-1 h-3 w-3" />
                        Ноорог
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">
                    {p.views}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/dashboard/journal/${p.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/journal/${p.slug}`} target="_blank">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </JournalDashboardShell>
  );
}
