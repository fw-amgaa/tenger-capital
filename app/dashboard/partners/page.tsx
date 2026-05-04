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
import { Plus, Pencil, ExternalLink, Eye, EyeOff } from "lucide-react";
import { PartnerDashboardShell } from "./dashboard-shell";
import type { PartnerPageRow } from "@/lib/db/schema";

export default function PartnerListPage() {
  const [rows, setRows] = useState<PartnerPageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetchAll = () => {
    setLoading(true);
    fetch("/api/partners?drafts=1")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setRows(data))
      .catch(() => toast.error("Жагсаалтыг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchAll, []);

  const handleCreate = async () => {
    const nameMn = prompt("Шинэ хамтрагчийн нэр (Монгол)");
    if (!nameMn || !nameMn.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nameMn: nameMn.trim() }),
      });
      if (!res.ok) {
        toast.error("Үүсгэж чадсангүй.");
        return;
      }
      const created = await res.json();
      toast.success("Шинэ хамтрагч үүслээ.");
      window.location.href = `/dashboard/partners/${created.id}`;
    } finally {
      setCreating(false);
    }
  };

  return (
    <PartnerDashboardShell
      crumbs={[{ label: "Хамтрагчид" }]}
      title="Хамтрагчдын хуудсууд"
      subtitle="Та хамтрагч компани бүрд тусдаа landing page үүсгэж, дотор нь бүх агуулгыг засаж болно."
      actions={
        <Button onClick={handleCreate} disabled={creating}>
          <Plus className="mr-2 h-4 w-4" />
          {creating ? "Үүсгэж байна…" : "Шинэ хуудас"}
        </Button>
      }
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : rows.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Хуудас алга байна</CardTitle>
            <CardDescription>
              Эхний хамтрагчийн хуудсаа үүсгэхийн тулд дээрх товчийг дарна уу.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Нэр</th>
                <th className="text-left px-4 py-3">Slug</th>
                <th className="text-left px-4 py-3">Үндсэн өнгө</th>
                <th className="text-left px-4 py-3">Төлөв</th>
                <th className="text-right px-4 py-3">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr
                  key={p.id}
                  className="border-t hover:bg-muted/30 transition-colors"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/partners/${p.id}`}
                      className="font-medium hover:underline"
                    >
                      {p.nameMn || p.nameEn || "(нэргүй)"}
                    </Link>
                    {p.nameEn && p.nameMn && p.nameEn !== p.nameMn ? (
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.nameEn}
                      </div>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground font-mono">
                    /partners/{p.slug}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block h-4 w-4 rounded-full border"
                        style={{ background: p.primaryColor }}
                      />
                      <span className="text-xs font-mono text-muted-foreground">
                        {p.primaryColor}
                      </span>
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
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/dashboard/partners/${p.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button asChild size="icon" variant="ghost">
                        <Link href={`/partners/${p.slug}`} target="_blank">
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
    </PartnerDashboardShell>
  );
}
