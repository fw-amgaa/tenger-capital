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
import { Plus, X, Save, ImageIcon, Type, AlignLeft, List } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/ui/rich-text-editor";

interface ContentState {
  title: string;
  description: string;
  paragraphs: string[];
  images: string[];
}

export default function FormContentPage() {
  const [content, setContent] = useState<ContentState>({
    title: "",
    description: "",
    paragraphs: [],
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
            description: data.description || "",
            paragraphs: data.paragraphs || [],
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
        toast.success("Content saved successfully.");
      } else {
        toast.error("Failed to save content.");
      }
    } catch {
      toast.error("Failed to save content.");
    } finally {
      setSaving(false);
    }
  };

  const addParagraph = () =>
    setContent((c) => ({ ...c, paragraphs: [...c.paragraphs, ""] }));

  const updateParagraph = (i: number, val: string) =>
    setContent((c) => {
      const p = [...c.paragraphs];
      p[i] = val;
      return { ...c, paragraphs: p };
    });

  const removeParagraph = (i: number) =>
    setContent((c) => ({
      ...c,
      paragraphs: c.paragraphs.filter((_, idx) => idx !== i),
    }));

  const addImage = () =>
    setContent((c) => ({ ...c, images: [...c.images, ""] }));

  const updateImage = (i: number, val: string) =>
    setContent((c) => {
      const imgs = [...c.images];
      imgs[i] = val;
      return { ...c, images: imgs };
    });

  const removeImage = (i: number) =>
    setContent((c) => ({
      ...c,
      images: c.images.filter((_, idx) => idx !== i),
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
                  <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Form Page Content</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Form Page Content
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                This content appears above the contact form on the public site.
              </p>
            </div>
            <Button onClick={handleSave} disabled={saving || loading}>
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Loading…
            </div>
          ) : (
            <div className="grid gap-5 max-w-3xl">
              {/* Title */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Type className="h-4 w-4 text-muted-foreground" />
                    Section Title
                  </CardTitle>
                  <CardDescription>
                    Optional heading shown at the top of this section.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="e.g. Current Bond Offering"
                    value={content.title}
                    onChange={(e) =>
                      setContent((c) => ({ ...c, title: e.target.value }))
                    }
                  />
                </CardContent>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlignLeft className="h-4 w-4 text-muted-foreground" />
                    Description
                  </CardTitle>
                  <CardDescription>
                    A short introductory text shown below the title.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    placeholder="Write a brief description…"
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
                </CardContent>
              </Card>

              {/* Paragraphs */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <List className="h-4 w-4 text-muted-foreground" />
                        Paragraphs
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Body text blocks displayed in order.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addParagraph}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {content.paragraphs.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                      No paragraphs yet. Click &quot;Add&quot; to get started.
                    </p>
                  ) : (
                    content.paragraphs.map((p, i) => (
                      <div key={i} className="flex gap-2 items-start">
                        <div className="flex-1 space-y-1">
                          <Label className="text-xs text-muted-foreground">
                            Paragraph {i + 1}
                          </Label>
                          <RichTextEditor
                            value={p}
                            onChange={(html) => updateParagraph(i, html)}
                            placeholder="Write paragraph text…"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-5 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeParagraph(i)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              {/* Images */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                        Images
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Paste public image URLs. They display in a grid.
                      </CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addImage}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1" />
                      Add Image
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {content.images.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6 border-2 border-dashed rounded-lg">
                      No images yet. Click &quot;Add Image&quot; to get started.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {content.images.map((url, i) => (
                        <div key={i} className="space-y-2">
                          {url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={url}
                              alt={`Image ${i + 1}`}
                              className="w-full h-36 object-cover rounded-lg border"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div className="w-full h-36 rounded-lg border-2 border-dashed flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="h-8 w-8 opacity-30" />
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              value={url}
                              onChange={(e) => updateImage(i, e.target.value)}
                              placeholder="https://example.com/image.jpg"
                              className="text-xs"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              className="shrink-0 text-muted-foreground hover:text-destructive"
                              onClick={() => removeImage(i)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end pb-6">
                <Button onClick={handleSave} disabled={saving} size="lg">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
