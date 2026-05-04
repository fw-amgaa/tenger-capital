export type SectionDef = { id: string; label: string };

export const SECTION_REGISTRY: Record<string, SectionDef[]> = {
  "/": [
    { id: "hero", label: "Hero" },
    { id: "video-intro", label: "Видео танилцуулга" },
    { id: "brief", label: "Brief" },
    { id: "work-with-us", label: "Хамтран ажиллах" },
    { id: "team-members", label: "Багийн гишүүд" },
    { id: "offerings", label: "Үйлчилгээнүүд" },
    { id: "partners", label: "Хамтрагчид" },
    { id: "faq", label: "FAQ" },
  ],
  "/submit-form": [
    { id: "submit-form-intro", label: "Урилга" },
    { id: "submit-form-content", label: "Тайлбар" },
    { id: "submit-form", label: "Маягт" },
    { id: "faq", label: "FAQ" },
  ],
  "/journal": [
    { id: "journal-hero", label: "Hero" },
    { id: "journal-search", label: "Хайлт" },
    { id: "journal-categories", label: "Ангилал" },
    { id: "journal-featured", label: "Editor's pick" },
    { id: "journal-grid", label: "Нийтлэлүүд" },
    { id: "journal-newsletter", label: "Имэйл захиалга" },
  ],
  "/faq": [
    { id: "faq-banner", label: "Промо баннер" },
    { id: "faq-popular", label: "Хамгийн их асуудаг" },
    { id: "faq-help", label: "Холбоо барих" },
  ],
};

export function getRegisteredSections(path: string): SectionDef[] {
  return SECTION_REGISTRY[path] ?? [];
}

export function listAllRegisteredPaths(): string[] {
  return Object.keys(SECTION_REGISTRY);
}
