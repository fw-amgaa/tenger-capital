"use client";

import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbLink,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, X, Save, Type, AlignLeft, List, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { ImageUploader } from "@/components/ui/image-uploader";

interface ContentState {
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  paragraphs: string[];
  paragraphsEn: string[];
  images: string[];
}

export default function FormContentPage() {
  const [content, setContent] = useState<ContentState>({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    paragraphs: [],
    paragraphsEn: [],
    images: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/form-page-content")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setContent({
            title: data.title || "",
            titleEn: data.titleEn || "",
            description: data.description || "",
            descriptionEn: data.descriptionEn || "",
            paragraphs: data.paragraphs || [],
            paragraphsEn: data.paragraphsEn || [],
            images: data.images || [],
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/form-page-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      });
      if (res.ok) {
        toast.success("Агуулга амжилттай хадгалагдлаа.");
      } else {
        toast.error("Агуулга хадгалахад алдаа гарлаа.");
      }
    } catch {
      toast.error("Агуулга хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () =>
    setContent((c) => ({
      ...c,
      paragraphs: [...c.paragraphs, ""],
      paragraphsEn: [...c.paragraphsEn, ""],
    }));

  const updateParagraph = (i: number, val: string) =>
    setContent((c) => {
      const p = [...c.paragraphs];
      p[i] = val;
      return { ...c, paragraphs: p };
    });

  const updateParagraphEn = (i: number, val: string) =>
    setContent((c) => {
      const p = [...c.paragraphsEn];
      p[i] = val;
      return { ...c, paragraphsEn: p };
    });

  const removeParagraph = (i: number) =>
    setContent((c) => ({
      ...c,
      paragraphs: c.paragraphs.filter((_, idx) => idx !== i),
      paragraphsEn: c.paragraphsEn.filter((_, idx) => idx !== i),
    }));

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Хяналтын самбар</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Маягтын агуулга</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Маягтын агуулга
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Энэ агуулга нийтийн сайтын холбоо барих маягтын дээр харагдана.
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Хадгалж байна…" : "Хадгалах"}
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Уншиж байна…
            </div>
          ) : (
            <div className="grid gap-5 max-w-3xl">
              {/* Title */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    Гарчиг
                  </CardTitle>
                  <CardDescription>
                    Хэсгийн дээд талд харагдах гарчиг.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">МН</Label>
                    <Input
                      placeholder="жнь: Одоогийн бондын санал"
                      value={content.title}
                      onChange={(e) =>
                        setContent((c) => ({ ...c, title: e.target.value }))
                      }
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">EN</Label>
                    <Input
                      placeholder="e.g. Current Bond Offering"
                      value={content.titleEn}
                      onChange={(e) =>
                        setContent((c) => ({ ...c, titleEn: e.target.value }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Тайлбар
                  </CardTitle>
                  <CardDescription>
                    Гарчгийн доор харагдах богино оршил текст.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">МН</Label>
                    <Textarea
                      placeholder="Богино тайлбар бичнэ үү…"
                      value={content.description}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          description: e.target.value,
                        }))
                      }
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">EN</Label>
                    <Textarea
                      placeholder="Write a brief description…"
                      value={content.descriptionEn}
                      onChange={(e) =>
                        setContent((c) => ({
                          ...c,
                          descriptionEn: e.target.value,
                        }))
                      }
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Paragraphs */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <List className="h-4 w-4 text-muted-foreground" />
                        Догол мөрүүд
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Дарааллаар харагдах текст блокууд.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addParagraph}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Нэмэх
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {content.paragraphs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                      Догол мөр байхгүй байна. &quot;Нэмэх&quot; дарна уу.
                    </p>
                  ) : (
                    content.paragraphs.map((p, i) => (
                      <div key={i} className="border rounded-lg p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-muted-foreground">
                            Догол мөр {i + 1}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-muted-foreground hover:text-destructive"
                            onClick={() => removeParagraph(i)}
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">МН</Label>
                          <RichTextEditor
                            value={p}
                            onChange={(html) => updateParagraph(i, html)}
                            placeholder="Монгол текст бичнэ үү…"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">EN</Label>
                          <RichTextEditor
                            value={content.paragraphsEn[i] || ""}
                            onChange={(html) => updateParagraphEn(i, html)}
                            placeholder="Write English text…"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    Зургууд
                  </CardTitle>
                  <CardDescription>
                    Зураг чирж оруулах эсвэл дарж сонгоно уу. Тор хэлбэрээр харагдана.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImageUploader
                    value={content.images}
                    onChange={(urls) => setContent((c) => ({ ...c, images: urls }))}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end pb-6">
                <Button onClick={handleSave} disabled={saving} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Хадгалж байна…" : "Хадгалах"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
