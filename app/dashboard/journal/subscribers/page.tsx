"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JournalDashboardShell } from "../dashboard-shell";
import type { JournalSubscriberRow } from "@/lib/db/schema";

export default function SubscribersPage() {
  const [subs, setSubs] = useState<JournalSubscriberRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/journal/subscribe")
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setSubs(data))
      .catch(() => toast.error("Захиалагчдыг ачаалж чадсангүй."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <JournalDashboardShell
      crumbs={[
        { label: "Журнал", href: "/dashboard/journal" },
        { label: "Захиалагчид" },
      ]}
      title={`Имэйл захиалагчид (${subs.length})`}
      subtitle="Newsletter form-аар бүртгүүлсэн уншигчид."
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : subs.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Захиалагч алга</CardTitle>
            <CardDescription>
              Хэн ч одоогоор имэйл захиалаагүй байна.
            </CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="text-left px-4 py-3">Email</th>
                  <th className="text-left px-4 py-3">Source</th>
                  <th className="text-left px-4 py-3">Joined</th>
                </tr>
              </thead>
              <tbody>
                {subs.map((s) => (
                  <tr key={s.id} className="border-t">
                    <td className="px-4 py-3 font-mono">{s.email}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {s.source}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground tabular-nums">
                      {new Date(s.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </JournalDashboardShell>
  );
}
