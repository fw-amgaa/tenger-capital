"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useUploadThing } from "@/lib/uploadthing-client";
import {
  ExternalLink,
  GripVertical,
  ImagePlus,
  Loader2,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import type {
  PartnerConditionRow,
  PartnerFaqRow,
  PartnerHeroSlideRow,
  PartnerIntroImageRow,
  PartnerLinkRow,
  PartnerPageRow,
  PartnerUnderwriterLogoRow,
} from "@/lib/db/schema";
import type { PartnerPageBundle } from "@/lib/partners/shared";

type PageState = Pick<
  PartnerPageRow,
  | "slug"
  | "nameMn"
  | "nameEn"
  | "partnerLogoUrl"
  | "tengerLogoUrl"
  | "primaryColor"
  | "pdfUrl"
  | "pdfCtaLabelMn"
  | "pdfCtaLabelEn"
  | "orderUrl"
  | "orderCtaLabelMn"
  | "orderCtaLabelEn"
  | "heroEyebrowMn"
  | "heroEyebrowEn"
  | "heroTitleMn"
  | "heroTitleEn"
  | "heroSubtitleMn"
  | "heroSubtitleEn"
  | "introTitleMn"
  | "introTitleEn"
  | "introHtmlMn"
  | "introHtmlEn"
  | "conditionsTitleMn"
  | "conditionsTitleEn"
  | "conditionsLedeMn"
  | "conditionsLedeEn"
  | "downloadTitleMn"
  | "downloadTitleEn"
  | "downloadDescMn"
  | "downloadDescEn"
  | "faqTitleMn"
  | "faqTitleEn"
  | "footerSubscribeTitleMn"
  | "footerSubscribeTitleEn"
  | "footerLinksTitleMn"
  | "footerLinksTitleEn"
  | "footerEmail"
  | "footerPhone"
  | "published"
>;

type DraftHeroSlide = { id?: string; type: "image" | "video"; url: string };
type DraftIntroImage = {
  id?: string;
  url: string;
  captionMn: string;
  captionEn: string;
};
type DraftCondition = {
  id?: string;
  iconLabel: string;
  titleMn: string;
  titleEn: string;
  bodyMn: string;
  bodyEn: string;
};
type DraftFaq = {
  id?: string;
  qMn: string;
  qEn: string;
  aMn: string;
  aEn: string;
};
type DraftLink = {
  id?: string;
  labelMn: string;
  labelEn: string;
  url: string;
};
type DraftSocial = { id?: string; kind: string; url: string };
type DraftUnderwriter = {
  id?: string;
  labelMn: string;
  labelEn: string;
  logoUrl: string;
};

const SOCIAL_KINDS = [
  { id: "facebook", label: "Facebook" },
  { id: "twitter", label: "Twitter / X" },
  { id: "linkedin", label: "LinkedIn" },
  { id: "youtube", label: "YouTube" },
  { id: "instagram", label: "Instagram" },
];

function pageFromRow(row: PartnerPageRow): PageState {
  return {
    slug: row.slug,
    nameMn: row.nameMn,
    nameEn: row.nameEn,
    partnerLogoUrl: row.partnerLogoUrl,
    tengerLogoUrl: row.tengerLogoUrl,
    primaryColor: row.primaryColor,
    pdfUrl: row.pdfUrl,
    pdfCtaLabelMn: row.pdfCtaLabelMn,
    pdfCtaLabelEn: row.pdfCtaLabelEn,
    orderUrl: row.orderUrl,
    orderCtaLabelMn: row.orderCtaLabelMn,
    orderCtaLabelEn: row.orderCtaLabelEn,
    heroEyebrowMn: row.heroEyebrowMn,
    heroEyebrowEn: row.heroEyebrowEn,
    heroTitleMn: row.heroTitleMn,
    heroTitleEn: row.heroTitleEn,
    heroSubtitleMn: row.heroSubtitleMn,
    heroSubtitleEn: row.heroSubtitleEn,
    introTitleMn: row.introTitleMn,
    introTitleEn: row.introTitleEn,
    introHtmlMn: row.introHtmlMn,
    introHtmlEn: row.introHtmlEn,
    conditionsTitleMn: row.conditionsTitleMn,
    conditionsTitleEn: row.conditionsTitleEn,
    conditionsLedeMn: row.conditionsLedeMn,
    conditionsLedeEn: row.conditionsLedeEn,
    downloadTitleMn: row.downloadTitleMn,
    downloadTitleEn: row.downloadTitleEn,
    downloadDescMn: row.downloadDescMn,
    downloadDescEn: row.downloadDescEn,
    faqTitleMn: row.faqTitleMn,
    faqTitleEn: row.faqTitleEn,
    footerSubscribeTitleMn: row.footerSubscribeTitleMn,
    footerSubscribeTitleEn: row.footerSubscribeTitleEn,
    footerLinksTitleMn: row.footerLinksTitleMn,
    footerLinksTitleEn: row.footerLinksTitleEn,
    footerEmail: row.footerEmail,
    footerPhone: row.footerPhone,
    published: row.published,
  };
}

export function PartnerForm({ initial }: { initial: PartnerPageBundle }) {
  const router = useRouter();
  const [page, setPage] = useState<PageState>(pageFromRow(initial.page));
  const [heroSlides, setHeroSlides] = useState<DraftHeroSlide[]>(
    initial.heroSlides.map(toDraftHero),
  );
  const [introImages, setIntroImages] = useState<DraftIntroImage[]>(
    initial.introImages.map(toDraftIntro),
  );
  const [conditions, setConditions] = useState<DraftCondition[]>(
    initial.conditions.length > 0
      ? initial.conditions.map(toDraftCondition)
      : Array.from({ length: 9 }, () => emptyCondition()),
  );
  const [faqs, setFaqs] = useState<DraftFaq[]>(
    initial.faqs.map(toDraftFaq),
  );
  const [links, setLinks] = useState<DraftLink[]>(
    initial.links.map(toDraftLink),
  );
  const [socials, setSocials] = useState<DraftSocial[]>(
    initial.socials.map((s) => ({ id: s.id, kind: s.kind, url: s.url })),
  );
  const [underwriters, setUnderwriters] = useState<DraftUnderwriter[]>(
    initial.underwriters.map(toDraftUnderwriter),
  );
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const setP = <K extends keyof PageState>(k: K, v: PageState[K]) =>
    setPage((s) => ({ ...s, [k]: v }));

  const handleSave = async () => {
    if (!page.nameMn.trim() && !page.nameEn.trim()) {
      toast.error("Нэр заавал бөглөнө үү (MN эсвэл EN).");
      return;
    }
    setSaving(true);
    try {
      const pageRes = await fetch(`/api/partners/${initial.page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(page),
      });
      if (!pageRes.ok) {
        toast.error("Үндсэн мэдээлэл хадгалж чадсангүй.");
        return;
      }
      const sectionsRes = await fetch(
        `/api/partners/${initial.page.id}/sections`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            heroSlides,
            introImages,
            conditions,
            faqs,
            links,
            socials,
            underwriters,
          }),
        },
      );
      if (!sectionsRes.ok) {
        toast.error("Хэсгүүдийг хадгалж чадсангүй.");
        return;
      }
      toast.success("Хадгаллаа.");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Энэ хуудсыг бүрмөсөн устгах уу?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/partners/${initial.page.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        toast.success("Устгагдлаа.");
        router.push("/dashboard/partners");
      } else {
        toast.error("Устгахад алдаа гарлаа.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid gap-5 max-w-5xl">
      {/* Header banner with quick actions */}
      <div className="flex flex-wrap items-center gap-3 -mt-2">
        <span className="text-xs font-mono text-muted-foreground">
          /partners/{initial.page.slug}
        </span>
        <Button asChild variant="ghost" size="sm">
          <Link href={`/partners/${initial.page.slug}`} target="_blank">
            <ExternalLink className="mr-1 h-3 w-3" />
            Урьдчилан үзэх
          </Link>
        </Button>
      </div>

      {/* Identity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Үндсэн мэдээлэл</CardTitle>
          <CardDescription>
            Нэр, slug, үндсэн өнгө болон лого. Slug хоосон үлдээвэл нэрнээс
            автоматаар үүснэ.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Нэр (MN)"
            labelEn="Name (EN)"
            valueMn={page.nameMn}
            valueEn={page.nameEn}
            onChangeMn={(v) => setP("nameMn", v)}
            onChangeEn={(v) => setP("nameEn", v)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label="Slug"
              value={page.slug}
              onChange={(v) => setP("slug", v)}
              placeholder="golomt-capital"
            />
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Үндсэн өнгө (Primary color)
              </Label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={page.primaryColor}
                  onChange={(e) => setP("primaryColor", e.target.value)}
                  className="h-9 w-12 rounded border bg-transparent cursor-pointer"
                />
                <Input
                  value={page.primaryColor}
                  onChange={(e) => setP("primaryColor", e.target.value)}
                  placeholder="#f5875a"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageField
              label="Хамтрагчийн лого"
              value={page.partnerLogoUrl}
              onChange={(v) => setP("partnerLogoUrl", v)}
            />
            <ImageField
              label="Tenger Capital лого (өөрчилж болно)"
              value={page.tengerLogoUrl}
              onChange={(v) => setP("tengerLogoUrl", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Header CTAs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Толгойн товчлуурууд</CardTitle>
          <CardDescription>
            Header дээрх PDF татах болон захиалга өгөх товчлуурын тохиргоо.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              PDF файл
            </Label>
            <PdfField
              value={page.pdfUrl}
              onChange={(v) => setP("pdfUrl", v)}
            />
            <BilingualInput
              labelMn="PDF товчны бичиг (MN)"
              labelEn="PDF button label (EN)"
              valueMn={page.pdfCtaLabelMn}
              valueEn={page.pdfCtaLabelEn}
              onChangeMn={(v) => setP("pdfCtaLabelMn", v)}
              onChangeEn={(v) => setP("pdfCtaLabelEn", v)}
            />
          </div>
          <div className="grid gap-3">
            <Label className="text-xs uppercase tracking-wide text-muted-foreground">
              Захиалгын товч
            </Label>
            <FieldInput
              label="Линк (URL)"
              value={page.orderUrl ?? ""}
              onChange={(v) => setP("orderUrl", v || null)}
              placeholder="https://… (хоосон үлдээж болно)"
            />
            <BilingualInput
              labelMn="Захиалга товчны бичиг (MN)"
              labelEn="Order button label (EN)"
              valueMn={page.orderCtaLabelMn}
              valueEn={page.orderCtaLabelEn}
              onChangeMn={(v) => setP("orderCtaLabelMn", v)}
              onChangeEn={(v) => setP("orderCtaLabelEn", v)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Hero */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Hero хэсэг</CardTitle>
          <CardDescription>
            Гол баннер. Зураг (эсвэл видео)-ыг олноор нэмбэл автоматаар
            ээлжилнэ.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Eyebrow (MN)"
            labelEn="Eyebrow (EN)"
            valueMn={page.heroEyebrowMn}
            valueEn={page.heroEyebrowEn}
            onChangeMn={(v) => setP("heroEyebrowMn", v)}
            onChangeEn={(v) => setP("heroEyebrowEn", v)}
          />
          <BilingualInput
            labelMn="Гарчиг (MN)"
            labelEn="Title (EN)"
            valueMn={page.heroTitleMn}
            valueEn={page.heroTitleEn}
            onChangeMn={(v) => setP("heroTitleMn", v)}
            onChangeEn={(v) => setP("heroTitleEn", v)}
          />
          <BilingualTextarea
            labelMn="Дэд гарчиг (MN)"
            labelEn="Subtitle (EN)"
            valueMn={page.heroSubtitleMn}
            valueEn={page.heroSubtitleEn}
            onChangeMn={(v) => setP("heroSubtitleMn", v)}
            onChangeEn={(v) => setP("heroSubtitleEn", v)}
          />
          <SlideListField
            slides={heroSlides}
            onChange={setHeroSlides}
          />
        </CardContent>
      </Card>

      {/* Introduction */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Танилцуулга</CardTitle>
          <CardDescription>
            Зураг + баялаг текст. EN, MN тус бүр rich text editor-той.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Гарчиг (MN)"
            labelEn="Title (EN)"
            valueMn={page.introTitleMn}
            valueEn={page.introTitleEn}
            onChangeMn={(v) => setP("introTitleMn", v)}
            onChangeEn={(v) => setP("introTitleEn", v)}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Body (MN)
              </Label>
              <RichTextEditor
                value={page.introHtmlMn}
                onChange={(v) => setP("introHtmlMn", v)}
                placeholder="Танилцуулгын текст..."
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                Body (EN)
              </Label>
              <RichTextEditor
                value={page.introHtmlEn}
                onChange={(v) => setP("introHtmlEn", v)}
                placeholder="Introduction body..."
              />
            </div>
          </div>
          <IntroImagesField
            images={introImages}
            onChange={setIntroImages}
          />
        </CardContent>
      </Card>

      {/* Conditions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">
            Нөхцөл (9 ширхэг)
          </CardTitle>
          <CardDescription>
            Гэрээний эсвэл бүтээгдэхүүний 9 нөхцөлийг бөглөнө үү.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Гарчиг (MN)"
            labelEn="Title (EN)"
            valueMn={page.conditionsTitleMn}
            valueEn={page.conditionsTitleEn}
            onChangeMn={(v) => setP("conditionsTitleMn", v)}
            onChangeEn={(v) => setP("conditionsTitleEn", v)}
          />
          <BilingualTextarea
            labelMn="Тайлбар (MN)"
            labelEn="Lede (EN)"
            valueMn={page.conditionsLedeMn}
            valueEn={page.conditionsLedeEn}
            onChangeMn={(v) => setP("conditionsLedeMn", v)}
            onChangeEn={(v) => setP("conditionsLedeEn", v)}
          />
          <ConditionsField
            conditions={conditions}
            onChange={setConditions}
          />
        </CardContent>
      </Card>

      {/* Download CTA */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Татах хэсэг</CardTitle>
          <CardDescription>
            FAQ-н өмнөх том баннер. PDF товчлуурыг ашиглана.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Гарчиг (MN)"
            labelEn="Title (EN)"
            valueMn={page.downloadTitleMn}
            valueEn={page.downloadTitleEn}
            onChangeMn={(v) => setP("downloadTitleMn", v)}
            onChangeEn={(v) => setP("downloadTitleEn", v)}
          />
          <BilingualTextarea
            labelMn="Тайлбар (MN)"
            labelEn="Description (EN)"
            valueMn={page.downloadDescMn}
            valueEn={page.downloadDescEn}
            onChangeMn={(v) => setP("downloadDescMn", v)}
            onChangeEn={(v) => setP("downloadDescEn", v)}
          />
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">FAQ</CardTitle>
          <CardDescription>
            Энэ хамтрагчид зориулсан түгээмэл асуултууд.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <BilingualInput
            labelMn="Гарчиг (MN)"
            labelEn="Title (EN)"
            valueMn={page.faqTitleMn}
            valueEn={page.faqTitleEn}
            onChangeMn={(v) => setP("faqTitleMn", v)}
            onChangeEn={(v) => setP("faqTitleEn", v)}
          />
          <FaqField faqs={faqs} onChange={setFaqs} />
        </CardContent>
      </Card>

      {/* Footer */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Footer</CardTitle>
          <CardDescription>
            Доод хэсгийн агуулга — холбоо барих, линк, social media, underwriter
            лого.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              label="И-мэйл"
              value={page.footerEmail}
              onChange={(v) => setP("footerEmail", v)}
              placeholder="info@…"
            />
            <FieldInput
              label="Утас"
              value={page.footerPhone}
              onChange={(v) => setP("footerPhone", v)}
              placeholder="+976 …"
            />
          </div>
          <BilingualInput
            labelMn="Subscribe гарчиг (MN)"
            labelEn="Subscribe title (EN)"
            valueMn={page.footerSubscribeTitleMn}
            valueEn={page.footerSubscribeTitleEn}
            onChangeMn={(v) => setP("footerSubscribeTitleMn", v)}
            onChangeEn={(v) => setP("footerSubscribeTitleEn", v)}
          />
          <BilingualInput
            labelMn="Линк блокийн гарчиг (MN)"
            labelEn="Links block title (EN)"
            valueMn={page.footerLinksTitleMn}
            valueEn={page.footerLinksTitleEn}
            onChangeMn={(v) => setP("footerLinksTitleMn", v)}
            onChangeEn={(v) => setP("footerLinksTitleEn", v)}
          />

          <UnderwritersField
            items={underwriters}
            onChange={setUnderwriters}
          />
          <LinksField items={links} onChange={setLinks} />
          <SocialsField items={socials} onChange={setSocials} />
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Тохиргоо</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="flex items-center gap-3 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={page.published}
              onChange={(e) => setP("published", e.target.checked)}
            />
            <div>
              <div className="font-medium">Нийтлэх</div>
              <div className="text-xs text-muted-foreground">
                Нийтлэгдсэн үед /partners/{initial.page.slug} нийтэд харагдана.
              </div>
            </div>
          </label>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between gap-3 pb-6">
        <Button
          variant="ghost"
          className="text-destructive hover:text-destructive"
          onClick={handleDelete}
          disabled={deleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {deleting ? "Устгаж байна…" : "Устгах"}
        </Button>
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Хадгалж байна…" : "Хадгалах"}
        </Button>
      </div>
    </div>
  );
}

// ---------- Field primitives ----------

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

function BilingualInput({
  labelMn,
  labelEn,
  valueMn,
  valueEn,
  onChangeMn,
  onChangeEn,
  placeholderMn,
  placeholderEn,
}: {
  labelMn: string;
  labelEn: string;
  valueMn: string;
  valueEn: string;
  onChangeMn: (v: string) => void;
  onChangeEn: (v: string) => void;
  placeholderMn?: string;
  placeholderEn?: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FieldInput
        label={labelMn}
        value={valueMn}
        onChange={onChangeMn}
        placeholder={placeholderMn}
      />
      <FieldInput
        label={labelEn}
        value={valueEn}
        onChange={onChangeEn}
        placeholder={placeholderEn}
      />
    </div>
  );
}

function BilingualTextarea({
  labelMn,
  labelEn,
  valueMn,
  valueEn,
  onChangeMn,
  onChangeEn,
}: {
  labelMn: string;
  labelEn: string;
  valueMn: string;
  valueEn: string;
  onChangeMn: (v: string) => void;
  onChangeEn: (v: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          {labelMn}
        </Label>
        <Textarea
          rows={3}
          value={valueMn}
          onChange={(e) => onChangeMn(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          {labelEn}
        </Label>
        <Textarea
          rows={3}
          value={valueEn}
          onChange={(e) => onChangeEn(e.target.value)}
        />
      </div>
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]?.ufsUrl) {
        onChange(res[0].ufsUrl);
        toast.success("Зураг нэмэгдлээ.");
      }
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });

  return (
    <div className="space-y-1">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </Label>
      {value ? (
        <div className="relative w-full max-w-xs aspect-[3/2] rounded-lg overflow-hidden border bg-muted/40 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={value}
            alt=""
            className="max-w-full max-h-full object-contain"
          />
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-1 right-1"
            onClick={() => onChange(null)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/40 max-w-xs"
          onClick={() => ref.current?.click()}
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin opacity-60" />
          ) : (
            <ImagePlus className="h-5 w-5 opacity-60" />
          )}
          <span className="text-xs text-muted-foreground">
            Зураг сонгох (PNG/JPG/WEBP, 8MB)
          </span>
        </div>
      )}
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) startUpload([f]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function PdfField({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("pdfUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]?.ufsUrl) {
        onChange(res[0].ufsUrl);
        toast.success("PDF нэмэгдлээ.");
      }
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });

  return (
    <div className="flex items-center gap-3">
      {value ? (
        <>
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline truncate max-w-md"
          >
            {value}
          </a>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onChange(null)}
          >
            Устгах
          </Button>
        </>
      ) : (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => ref.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
          ) : (
            <Plus className="mr-2 h-3 w-3" />
          )}
          PDF файл сонгох (16MB хүртэл)
        </Button>
      )}
      <input
        ref={ref}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) startUpload([f]);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ---------- Repeating-collection fields ----------

function SlideListField({
  slides,
  onChange,
}: {
  slides: DraftHeroSlide[];
  onChange: (next: DraftHeroSlide[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const newOnes: DraftHeroSlide[] = res
        .filter((r) => r.ufsUrl)
        .map((r) => ({ type: "image", url: r.ufsUrl! }));
      if (newOnes.length > 0) onChange([...slides, ...newOnes]);
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Hero зургууд
      </Label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {slides.map((s, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-muted/40"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={s.url}
              alt=""
              className="w-full h-full object-cover"
            />
            <div className="absolute top-1 left-1 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded">
              {i + 1}
            </div>
            <Button
              size="icon"
              variant="secondary"
              className="absolute top-1 right-1 h-7 w-7"
              onClick={() => onChange(slides.filter((_, idx) => idx !== i))}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
            <div className="absolute bottom-1 right-1 flex gap-1">
              {i > 0 ? (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6 text-[10px]"
                  onClick={() => move(slides, i, i - 1, onChange)}
                >
                  ←
                </Button>
              ) : null}
              {i < slides.length - 1 ? (
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-6 w-6 text-[10px]"
                  onClick={() => move(slides, i, i + 1, onChange)}
                >
                  →
                </Button>
              ) : null}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => ref.current?.click()}
          className="aspect-[3/4] rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-1 hover:bg-muted/40 cursor-pointer"
        >
          {isUploading ? (
            <Loader2 className="h-5 w-5 animate-spin opacity-60" />
          ) : (
            <ImagePlus className="h-5 w-5 opacity-60" />
          )}
          <span className="text-[11px] text-muted-foreground">
            Нэмэх
          </span>
        </button>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) startUpload(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function IntroImagesField({
  images,
  onChange,
}: {
  images: DraftIntroImage[];
  onChange: (next: DraftIntroImage[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      const newOnes: DraftIntroImage[] = res
        .filter((r) => r.ufsUrl)
        .map((r) => ({
          url: r.ufsUrl!,
          captionMn: "",
          captionEn: "",
        }));
      if (newOnes.length > 0) onChange([...images, ...newOnes]);
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });
  const update = (i: number, patch: Partial<DraftIntroImage>) =>
    onChange(images.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));

  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Танилцуулгын зургууд (хамгийн ихдээ 4 шилбэрхэг харагдана)
      </Label>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {images.map((img, i) => (
          <div
            key={i}
            className="border rounded-lg p-3 grid grid-cols-[80px_1fr_auto] gap-3 items-start"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt=""
              className="h-20 w-20 object-cover rounded"
            />
            <div className="grid gap-2">
              <Input
                value={img.captionMn}
                onChange={(e) => update(i, { captionMn: e.target.value })}
                placeholder="Тайлбар (MN, заавал биш)"
              />
              <Input
                value={img.captionEn}
                onChange={(e) => update(i, { captionEn: e.target.value })}
                placeholder="Caption (EN, optional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              {i > 0 ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => move(images, i, i - 1, onChange)}
                >
                  ↑
                </Button>
              ) : null}
              {i < images.length - 1 ? (
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => move(images, i, i + 1, onChange)}
                >
                  ↓
                </Button>
              ) : null}
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7 text-destructive"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => ref.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
        ) : (
          <Plus className="mr-2 h-3 w-3" />
        )}
        Зураг нэмэх
      </Button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length > 0) startUpload(files);
          e.target.value = "";
        }}
      />
    </div>
  );
}

function ConditionsField({
  conditions,
  onChange,
}: {
  conditions: DraftCondition[];
  onChange: (next: DraftCondition[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftCondition>) =>
    onChange(conditions.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-3">
      {conditions.map((c, i) => (
        <div
          key={i}
          className="border rounded-lg p-3 grid gap-3 grid-cols-1 md:grid-cols-[80px_1fr_auto] items-start"
        >
          <div className="space-y-1">
            <Label className="text-[10px] uppercase tracking-wide text-muted-foreground">
              No.
            </Label>
            <Input
              value={c.iconLabel}
              onChange={(e) => update(i, { iconLabel: e.target.value })}
              placeholder={String(i + 1).padStart(2, "0")}
            />
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={c.titleMn}
                onChange={(e) => update(i, { titleMn: e.target.value })}
                placeholder="Гарчиг (MN)"
              />
              <Input
                value={c.titleEn}
                onChange={(e) => update(i, { titleEn: e.target.value })}
                placeholder="Title (EN)"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                rows={2}
                value={c.bodyMn}
                onChange={(e) => update(i, { bodyMn: e.target.value })}
                placeholder="Тайлбар (MN)"
              />
              <Textarea
                rows={2}
                value={c.bodyEn}
                onChange={(e) => update(i, { bodyEn: e.target.value })}
                placeholder="Body (EN)"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {i > 0 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(conditions, i, i - 1, onChange)}
              >
                ↑
              </Button>
            ) : null}
            {i < conditions.length - 1 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(conditions, i, i + 1, onChange)}
              >
                ↓
              </Button>
            ) : null}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(conditions.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...conditions, emptyCondition()])}
      >
        <Plus className="mr-2 h-3 w-3" />
        Нөхцөл нэмэх
      </Button>
    </div>
  );
}

function FaqField({
  faqs,
  onChange,
}: {
  faqs: DraftFaq[];
  onChange: (next: DraftFaq[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftFaq>) =>
    onChange(faqs.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-3">
      {faqs.map((f, i) => (
        <div
          key={i}
          className="border rounded-lg p-3 grid gap-3 grid-cols-1 md:grid-cols-[1fr_auto] items-start"
        >
          <div className="grid gap-2">
            <div className="grid grid-cols-2 gap-2">
              <Input
                value={f.qMn}
                onChange={(e) => update(i, { qMn: e.target.value })}
                placeholder="Асуулт (MN)"
              />
              <Input
                value={f.qEn}
                onChange={(e) => update(i, { qEn: e.target.value })}
                placeholder="Question (EN)"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Textarea
                rows={3}
                value={f.aMn}
                onChange={(e) => update(i, { aMn: e.target.value })}
                placeholder="Хариулт (MN)"
              />
              <Textarea
                rows={3}
                value={f.aEn}
                onChange={(e) => update(i, { aEn: e.target.value })}
                placeholder="Answer (EN)"
              />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            {i > 0 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(faqs, i, i - 1, onChange)}
              >
                ↑
              </Button>
            ) : null}
            {i < faqs.length - 1 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(faqs, i, i + 1, onChange)}
              >
                ↓
              </Button>
            ) : null}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(faqs.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...faqs,
            { qMn: "", qEn: "", aMn: "", aEn: "" },
          ])
        }
      >
        <Plus className="mr-2 h-3 w-3" />
        Асуулт нэмэх
      </Button>
    </div>
  );
}

function LinksField({
  items,
  onChange,
}: {
  items: DraftLink[];
  onChange: (next: DraftLink[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftLink>) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Footer-ийн линкүүд
      </Label>
      {items.map((l, i) => (
        <div
          key={i}
          className="border rounded-lg p-2 grid gap-2 grid-cols-[16px_1fr_1fr_2fr_auto] items-center"
        >
          <GripVertical className="h-3 w-3 text-muted-foreground" />
          <Input
            value={l.labelMn}
            onChange={(e) => update(i, { labelMn: e.target.value })}
            placeholder="Бичиг (MN)"
          />
          <Input
            value={l.labelEn}
            onChange={(e) => update(i, { labelEn: e.target.value })}
            placeholder="Label (EN)"
          />
          <Input
            value={l.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://…"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...items,
            { labelMn: "", labelEn: "", url: "" },
          ])
        }
      >
        <Plus className="mr-2 h-3 w-3" />
        Линк нэмэх
      </Button>
    </div>
  );
}

function SocialsField({
  items,
  onChange,
}: {
  items: DraftSocial[];
  onChange: (next: DraftSocial[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftSocial>) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Social media
      </Label>
      {items.map((s, i) => (
        <div
          key={i}
          className="border rounded-lg p-2 grid gap-2 grid-cols-[1fr_2fr_auto] items-center"
        >
          <select
            value={s.kind}
            onChange={(e) => update(i, { kind: e.target.value })}
            className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
          >
            {SOCIAL_KINDS.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
          <Input
            value={s.url}
            onChange={(e) => update(i, { url: e.target.value })}
            placeholder="https://…"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 text-destructive"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...items,
            { kind: SOCIAL_KINDS[0].id, url: "" },
          ])
        }
      >
        <Plus className="mr-2 h-3 w-3" />
        Social холбоос нэмэх
      </Button>
    </div>
  );
}

function UnderwritersField({
  items,
  onChange,
}: {
  items: DraftUnderwriter[];
  onChange: (next: DraftUnderwriter[]) => void;
}) {
  const update = (i: number, patch: Partial<DraftUnderwriter>) =>
    onChange(items.map((x, idx) => (idx === i ? { ...x, ...patch } : x)));
  return (
    <div className="space-y-2">
      <Label className="text-xs uppercase tracking-wide text-muted-foreground">
        Footer-ийн underwriter лого (зургийн дээр гарах бичигтэй)
      </Label>
      {items.map((u, i) => (
        <div
          key={i}
          className="border rounded-lg p-3 grid gap-3 grid-cols-1 md:grid-cols-[120px_1fr_auto] items-start"
        >
          <UnderwriterLogo
            value={u.logoUrl}
            onChange={(v) => update(i, { logoUrl: v })}
          />
          <div className="grid gap-2">
            <Input
              value={u.labelMn}
              onChange={(e) => update(i, { labelMn: e.target.value })}
              placeholder="Бичиг (MN) — ж: Үндсэн андеррайтер"
            />
            <Input
              value={u.labelEn}
              onChange={(e) => update(i, { labelEn: e.target.value })}
              placeholder="Label (EN) — e.g. Lead underwriter"
            />
          </div>
          <div className="flex flex-col gap-1">
            {i > 0 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(items, i, i - 1, onChange)}
              >
                ↑
              </Button>
            ) : null}
            {i < items.length - 1 ? (
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                onClick={() => move(items, i, i + 1, onChange)}
              >
                ↓
              </Button>
            ) : null}
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-destructive"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([
            ...items,
            { labelMn: "", labelEn: "", logoUrl: "" },
          ])
        }
      >
        <Plus className="mr-2 h-3 w-3" />
        Underwriter нэмэх
      </Button>
    </div>
  );
}

function UnderwriterLogo({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res[0]?.ufsUrl) onChange(res[0].ufsUrl);
    },
    onUploadError: (e) => {
      toast.error(`Алдаа: ${e.message}`);
    },
  });
  return value ? (
    <div className="relative h-20 w-full bg-muted/40 rounded border flex items-center justify-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={value}
        alt=""
        className="max-h-full max-w-full object-contain"
      />
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-1 right-1 h-6 w-6"
        onClick={() => onChange("")}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  ) : (
    <>
      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="h-20 w-full border-2 border-dashed rounded flex items-center justify-center hover:bg-muted/40 cursor-pointer"
      >
        {isUploading ? (
          <Loader2 className="h-5 w-5 animate-spin opacity-60" />
        ) : (
          <ImagePlus className="h-5 w-5 opacity-60" />
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) startUpload([f]);
          e.target.value = "";
        }}
      />
    </>
  );
}

// ---------- helpers ----------
function move<T>(
  arr: T[],
  from: number,
  to: number,
  set: (next: T[]) => void,
) {
  if (to < 0 || to >= arr.length) return;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  set(next);
}

function emptyCondition(): DraftCondition {
  return {
    iconLabel: "",
    titleMn: "",
    titleEn: "",
    bodyMn: "",
    bodyEn: "",
  };
}

function toDraftHero(s: PartnerHeroSlideRow): DraftHeroSlide {
  return {
    id: s.id,
    type: s.type === "video" ? "video" : "image",
    url: s.url,
  };
}
function toDraftIntro(s: PartnerIntroImageRow): DraftIntroImage {
  return {
    id: s.id,
    url: s.url,
    captionMn: s.captionMn,
    captionEn: s.captionEn,
  };
}
function toDraftCondition(c: PartnerConditionRow): DraftCondition {
  return {
    id: c.id,
    iconLabel: c.iconLabel,
    titleMn: c.titleMn,
    titleEn: c.titleEn,
    bodyMn: c.bodyMn,
    bodyEn: c.bodyEn,
  };
}
function toDraftFaq(f: PartnerFaqRow): DraftFaq {
  return {
    id: f.id,
    qMn: f.qMn,
    qEn: f.qEn,
    aMn: f.aMn,
    aEn: f.aEn,
  };
}
function toDraftLink(l: PartnerLinkRow): DraftLink {
  return {
    id: l.id,
    labelMn: l.labelMn,
    labelEn: l.labelEn,
    url: l.url,
  };
}
function toDraftUnderwriter(u: PartnerUnderwriterLogoRow): DraftUnderwriter {
  return {
    id: u.id,
    labelMn: u.labelMn,
    labelEn: u.labelEn,
    logoUrl: u.logoUrl,
  };
}

