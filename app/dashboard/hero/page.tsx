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
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Save,
  Trash2,
  ArrowUp,
  ArrowDown,
  ImagePlus,
  FilmIcon,
  Loader2,
  Timer,
  Layers,
  ImageIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing-client";
import type { HeroSlide } from "@/lib/db/schema";
import { cn } from "@/lib/utils";

function makeId() {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export default function HeroDashboardPage() {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [intervalMs, setIntervalMs] = useState<number>(5000);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { startUpload: startImageUpload, isUploading: imageUploading } =
    useUploadThing("imageUploader", {
      onClientUploadComplete: (res) => {
        const newSlides: HeroSlide[] = res.map((r) => ({
          id: makeId(),
          type: "image",
          url: r.ufsUrl,
        }));
        setSlides((s) => [...s, ...newSlides]);
        toast.success("Зураг нэмэгдлээ.");
      },
      onUploadError: (e) => {
        toast.error(`Алдаа: ${e.message}`);
      },
    });

  const { startUpload: startVideoUpload, isUploading: videoUploading } =
    useUploadThing("videoUploader", {
      onClientUploadComplete: (res) => {
        const newSlides: HeroSlide[] = res.map((r) => ({
          id: makeId(),
          type: "video",
          url: r.ufsUrl,
        }));
        setSlides((s) => [...s, ...newSlides]);
        toast.success("Видео нэмэгдлээ.");
      },
      onUploadError: (e) => {
        toast.error(`Алдаа: ${e.message}`);
      },
    });

  const uploading = imageUploading || videoUploading;

  useEffect(() => {
    fetch("/api/home-hero")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setSlides(data.slides || []);
          setIntervalMs(data.intervalMs || 5000);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/home-hero", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slides, intervalMs }),
      });
      if (res.ok) toast.success("Хадгалагдлаа.");
      else toast.error("Хадгалахад алдаа гарлаа.");
    } catch {
      toast.error("Хадгалахад алдаа гарлаа.");
    } finally {
      setSaving(false);
    }
  };

  const move = (i: number, dir: -1 | 1) => {
    setSlides((prev) => {
      const next = [...prev];
      const j = i + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  };

  const remove = (i: number) =>
    setSlides((prev) => prev.filter((_, idx) => idx !== i));

  const updateAlt = (i: number, alt: string) =>
    setSlides((prev) => prev.map((s, idx) => (idx === i ? { ...s, alt } : s)));

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
                  <BreadcrumbLink href="/dashboard">
                    Хяналтын самбар
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Нүүр баннер</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 pt-2">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Нүүр баннер</h1>
              <p className="text-muted-foreground text-sm mt-1">
                Нүүр хуудасны баруун талын слайдер. Зураг эсвэл видео нэмж,
                дарааллыг өөрчлөх боломжтой.
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
              {/* Settings */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    Тохиргоо
                  </CardTitle>
                  <CardDescription>
                    Зургийн слайд хэдэн миллисекунд тутамд солигдох вэ. (Видео
                    нь дуусахад автоматаар дараагийн слайд руу шилжинэ.)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 max-w-xs">
                    <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Slide interval (ms)
                    </Label>
                    <Input
                      type="number"
                      min={1500}
                      max={60000}
                      step={500}
                      value={intervalMs}
                      onChange={(e) =>
                        setIntervalMs(Number(e.target.value) || 5000)
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Зөвлөмж: 4000–8000ms
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Slides */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Layers className="h-4 w-4 text-muted-foreground" />
                        Слайдууд
                        <Badge variant="secondary" className="ml-1">
                          {slides.length}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        Дарааллаар гарна. Сум дарж дараалал солиорой.
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length) startImageUpload(files);
                          e.target.value = "";
                        }}
                      />
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        className="hidden"
                        onChange={(e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length) startVideoUpload(files);
                          e.target.value = "";
                        }}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => imageInputRef.current?.click()}
                      >
                        {imageUploading ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <ImagePlus className="h-3.5 w-3.5 mr-1" />
                        )}
                        Зураг
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={uploading}
                        onClick={() => videoInputRef.current?.click()}
                      >
                        {videoUploading ? (
                          <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />
                        ) : (
                          <FilmIcon className="h-3.5 w-3.5 mr-1" />
                        )}
                        Видео
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {slides.length === 0 ? (
                    <div className="text-sm text-muted-foreground text-center py-12 border-2 border-dashed rounded-lg">
                      <ImageIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      Слайд байхгүй байна. Дээрх товчоор зураг эсвэл видео
                      нэмнэ үү.
                      <p className="text-xs mt-2">
                        Видео: MP4, 32MB хүртэл · Зураг: PNG/JPG/WEBP, 8MB
                        хүртэл
                      </p>
                    </div>
                  ) : (
                    slides.map((slide, i) => (
                      <div
                        key={slide.id}
                        className={cn(
                          "border rounded-lg p-3 flex gap-3 items-center"
                        )}
                      >
                        <div className="relative w-24 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                          {slide.type === "image" ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={slide.url}
                              alt={slide.alt || ""}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video
                              src={slide.url}
                              className="w-full h-full object-cover"
                              muted
                              playsInline
                              preload="metadata"
                            />
                          )}
                          <Badge
                            variant="secondary"
                            className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0 h-4"
                          >
                            {slide.type === "image" ? "IMG" : "VIDEO"}
                          </Badge>
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="text-xs text-muted-foreground truncate">
                            {slide.url.split("/").pop()}
                          </div>
                          <Input
                            placeholder="Alt text (заавал биш)"
                            value={slide.alt || ""}
                            onChange={(e) => updateAlt(i, e.target.value)}
                            className="h-8 text-xs"
                          />
                        </div>

                        <div className="flex flex-col gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={i === 0}
                            onClick={() => move(i, -1)}
                          >
                            <ArrowUp className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7"
                            disabled={i === slides.length - 1}
                            onClick={() => move(i, 1)}
                          >
                            <ArrowDown className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => remove(i)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))
                  )}
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
