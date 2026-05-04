import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { config } from "dotenv";
import { eq } from "drizzle-orm";
import { JOURNAL_POSTS } from "../lib/journal/data";
import { getBody, type ArticleBlock } from "../lib/journal/bodies";
import { journalPost } from "../lib/db/schema";

config({ path: ".env.local" });
config({ path: ".env" });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool);

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inlineToHtml(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safeHref = String(href).replace(/"/g, "&quot;");
    return `<a href="${safeHref}">${label}</a>`;
  });
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  return out;
}

function blocksToHtml(blocks: ArticleBlock[]): string {
  const parts: string[] = [];
  for (const b of blocks) {
    switch (b.type) {
      case "p":
        parts.push(`<p>${inlineToHtml(b.text)}</p>`);
        break;
      case "h2":
        parts.push(`<h2>${escapeHtml(b.text)}</h2>`);
        break;
      case "h3":
        parts.push(`<h3>${escapeHtml(b.text)}</h3>`);
        break;
      case "blockquote": {
        const cite = b.cite ? `<cite>${escapeHtml(b.cite)}</cite>` : "";
        parts.push(`<blockquote>${escapeHtml(b.text)}${cite}</blockquote>`);
        break;
      }
      case "pullquote":
        parts.push(`<p><em>${escapeHtml(b.text)}</em></p>`);
        break;
      case "ul":
        parts.push(
          `<ul>${b.items.map((it) => `<li>${inlineToHtml(it)}</li>`).join("")}</ul>`,
        );
        break;
      case "ol":
        parts.push(
          `<ol>${b.items.map((it) => `<li>${inlineToHtml(it)}</li>`).join("")}</ol>`,
        );
        break;
      case "callout":
        parts.push(
          `<blockquote><strong>${escapeHtml(b.title)}:</strong> ${inlineToHtml(b.text)}</blockquote>`,
        );
        break;
      case "stat-row":
        parts.push(
          `<ul>${b.stats.map((s) => `<li><strong>${escapeHtml(s.value)}</strong> — ${escapeHtml(s.label)}</li>`).join("")}</ul>`,
        );
        break;
      case "figure":
        parts.push(
          `<p><em>${escapeHtml(b.note)}</em><br/>${escapeHtml(b.caption)}</p>`,
        );
        break;
    }
  }
  return parts.join("\n");
}

async function seedJournal() {
  console.log("Seeding journal posts…");
  for (const post of JOURNAL_POSTS) {
    const existing = await db
      .select({ id: journalPost.id })
      .from(journalPost)
      .where(eq(journalPost.slug, post.slug))
      .limit(1);

    if (existing.length > 0) {
      console.log(`  · skip ${post.slug} (already exists)`);
      continue;
    }

    const body = getBody(post);
    const bodyHtml = blocksToHtml(body.paras);
    const publishedAt = new Date(post.date);

    await db.insert(journalPost).values({
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      bodyHtml,
      lede: body.lede,
      category: post.category,
      tags: post.tags,
      author: post.author,
      authorRole: post.authorRole,
      authorInitials: post.initials,
      coverImage: post.image,
      readTime: parseInt(post.readTime, 10) || 5,
      featured: !!post.featured,
      published: true,
      publishedAt,
    });

    console.log(`  ✓ inserted ${post.slug}`);
  }

  console.log("Done.");
  await pool.end();
}

seedJournal().catch((err) => {
  console.error(err);
  process.exit(1);
});
