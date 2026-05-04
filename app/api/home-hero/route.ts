import { db } from "@/lib/db";
import { homeHero, type HeroSlide } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  const rows = await db
    .select()
    .from(homeHero)
    .where(eq(homeHero.id, "singleton"))
    .limit(1);

  return NextResponse.json(rows[0] || null);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const slides: HeroSlide[] = Array.isArray(body.slides) ? body.slides : [];
  const intervalMs =
    typeof body.intervalMs === "number" && body.intervalMs >= 1500
      ? Math.min(body.intervalMs, 60000)
      : 5000;

  await db
    .insert(homeHero)
    .values({
      id: "singleton",
      slides,
      intervalMs,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: homeHero.id,
      set: {
        slides,
        intervalMs,
        updatedAt: new Date(),
      },
    });

  return NextResponse.json({ success: true });
}
