import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getFaqContent } from "@/lib/faq/data";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const drafts = url.searchParams.get("drafts") === "1";
  if (drafts) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }
  const content = await getFaqContent({ includeDrafts: drafts });
  return NextResponse.json(content);
}
