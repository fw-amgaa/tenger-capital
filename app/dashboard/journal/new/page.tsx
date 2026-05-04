import { JournalDashboardShell } from "../dashboard-shell";
import { PostForm } from "../post-form";

export default function NewJournalPostPage() {
  return (
    <JournalDashboardShell
      crumbs={[
        { label: "Журнал", href: "/dashboard/journal" },
        { label: "Шинэ нийтлэл" },
      ]}
      title="Шинэ нийтлэл"
      subtitle="Гарчиг, агуулга, хавтасны зургийг бөглөөд хадгалаарай."
    >
      <PostForm mode="new" />
    </JournalDashboardShell>
  );
}
