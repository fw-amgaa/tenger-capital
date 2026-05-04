"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { PartnerDashboardShell } from "../dashboard-shell";
import { PartnerForm } from "../partner-form";
import type { PartnerPageBundle } from "@/lib/partners/shared";

export default function EditPartnerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [bundle, setBundle] = useState<PartnerPageBundle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/partners/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => setBundle(data))
      .catch(() => toast.error("Хуудас олдсонгүй."))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <PartnerDashboardShell
      crumbs={[
        { label: "Хамтрагчид", href: "/dashboard/partners" },
        { label: bundle?.page.nameMn || bundle?.page.nameEn || "Засах" },
      ]}
      title={
        bundle
          ? `Засах · ${bundle.page.nameMn || bundle.page.nameEn}`
          : "Засах"
      }
      subtitle={bundle ? `/partners/${bundle.page.slug}` : undefined}
    >
      {loading ? (
        <div className="text-muted-foreground text-sm">Уншиж байна…</div>
      ) : bundle ? (
        <PartnerForm initial={bundle} />
      ) : (
        <div className="text-muted-foreground text-sm">
          Хуудас олдсонгүй.
        </div>
      )}
    </PartnerDashboardShell>
  );
}
