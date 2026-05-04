"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDate, type JournalPost } from "@/lib/journal/data";
import { TrackedSection } from "@/components/analytics/tracked-section";
import { getTracker } from "@/lib/analytics/tracker";
import BlogCard from "@/components/blog-card";

type CommentRow = {
  id: string;
  postId: string;
  parentId: string | null;
  authorName: string;
  authorInitials: string;
  body: string;
  likes: number;
  approved: boolean;
  isAuthor: boolean;
  createdAt: string;
};

type TocItem = { id: string; label: string; level: number };

function copyShareLink() {
  if (typeof window === "undefined") return;
  navigator.clipboard?.writeText(window.location.href).catch(() => {});
}

function tryShare(title: string) {
  if (typeof navigator === "undefined") return;
  type ShareNav = Navigator & {
    share?: (data: { title?: string; url?: string }) => Promise<void>;
  };
  const n = navigator as ShareNav;
  if (typeof n.share === "function") {
    n.share({ title, url: window.location.href }).catch(() => {});
  } else {
    copyShareLink();
  }
}

function slugifyHeading(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/<[^>]+>/g, "")
      .trim()
      .replace(/[^\p{Letter}\p{Number}\s-]/gu, "")
      .replace(/\s+/g, "-") || "section"
  );
}

function makeInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

function timeAgoMn(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(ms / 60000);
  if (minutes < 1) return "Сая";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} цагийн өмнө`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} өдрийн өмнө`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks} долоо хоногийн өмнө`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} сарын өмнө`;
  return `${Math.floor(days / 365)} жилийн өмнө`;
}

export default function ArticlePage({
  post,
  related,
}: {
  post: JournalPost;
  related: JournalPost[];
}) {
  const [progress, setProgress] = useState(0);
  const [activeToc, setActiveToc] = useState<string | undefined>();
  const [bookmarked, setBookmarked] = useState(false);
  const [toc, setToc] = useState<TocItem[]>([]);
  const [comments, setComments] = useState<CommentRow[]>([]);
  const [commentName, setCommentName] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const bodyRef = useRef<HTMLElement | null>(null);
  const tocIdsRef = useRef<string[]>([]);

  // Annotate headings with stable IDs after the HTML is mounted, then build TOC.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root) return;
    const headings = Array.from(
      root.querySelectorAll("h2, h3"),
    ) as HTMLHeadingElement[];
    const used = new Set<string>();
    const items: TocItem[] = headings.map((h) => {
      let id = h.id || slugifyHeading(h.textContent || "");
      let candidate = id;
      let n = 2;
      while (used.has(candidate)) candidate = `${id}-${n++}`;
      id = candidate;
      used.add(id);
      h.id = id;
      return {
        id,
        label: (h.textContent || "").trim(),
        level: h.tagName === "H2" ? 2 : 3,
      };
    });
    setToc(items);
    tocIdsRef.current = items.map((t) => t.id);
    if (items[0]) setActiveToc(items[0].id);
  }, [post.bodyHtml]);

  useEffect(() => {
    const stored = localStorage.getItem(`tenger-bookmark-${post.id}`);
    setBookmarked(stored === "1");
  }, [post.id]);

  // Increment view counter exactly once per pageload
  useEffect(() => {
    const key = `tenger-viewed-${post.slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/journal/posts/${post.slug}/view`, { method: "POST" }).catch(
      () => {},
    );
  }, [post.slug]);

  // Load comments
  useEffect(() => {
    fetch(`/api/journal/comments?slug=${encodeURIComponent(post.slug)}`)
      .then((r) => r.json())
      .then((data) => Array.isArray(data) && setComments(data))
      .catch(() => {});
  }, [post.slug]);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const total = h.scrollHeight - h.clientHeight;
        const p =
          total > 0
            ? Math.min(100, Math.max(0, (h.scrollTop / total) * 100))
            : 0;
        setProgress(p);

        let cur = tocIdsRef.current[0];
        for (const id of tocIdsRef.current) {
          const el = document.getElementById(id);
          if (el && el.getBoundingClientRect().top < 200) cur = id;
        }
        setActiveToc(cur);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const onTocClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
    getTracker().event({
      type: "link_click",
      name: `toc-${id}`,
      target: `article:${post.slug}`,
    });
  };

  const toggleBookmark = () => {
    const next = !bookmarked;
    setBookmarked(next);
    localStorage.setItem(`tenger-bookmark-${post.id}`, next ? "1" : "0");
    getTracker().event({
      type: "button_click",
      name: next ? "article-bookmark-add" : "article-bookmark-remove",
      target: `article:${post.slug}`,
    });
  };

  const onShare = () => {
    tryShare(post.title);
    getTracker().event({
      type: "button_click",
      name: "article-share",
      target: `article:${post.slug}`,
    });
  };

  const onCopyLink = () => {
    copyShareLink();
    getTracker().event({
      type: "button_click",
      name: "article-copy-link",
      target: `article:${post.slug}`,
    });
  };

  const onPrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  const submitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = commentName.trim();
    const body = commentBody.trim();
    if (!name || !body) return;
    setSubmitting(true);
    getTracker().event({
      type: "form_submit_attempt",
      name: "journal_comment",
      target: `article:${post.slug}`,
    });
    try {
      const res = await fetch("/api/journal/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, authorName: name, body }),
      });
      if (res.ok) {
        setCommentBody("");
        getTracker().event({
          type: "form_submit_success",
          name: "journal_comment",
          target: `article:${post.slug}`,
        });
      } else {
        getTracker().event({
          type: "form_submit_error",
          name: "journal_comment",
          target: `article:${post.slug}`,
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const topLevelComments = useMemo(
    () => comments.filter((c) => !c.parentId),
    [comments],
  );
  const repliesByParent = useMemo(() => {
    const m = new Map<string, CommentRow[]>();
    for (const c of comments) {
      if (!c.parentId) continue;
      const arr = m.get(c.parentId) ?? [];
      arr.push(c);
      m.set(c.parentId, arr);
    }
    return m;
  }, [comments]);

  return (
    <>
      <div
        className="j-progress"
        style={{ width: `${progress}%` }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
      />

      <div className="section-container a-crumbs">
        <Link href="/journal">Journal</Link>
        <span className="sep">/</span>
        <Link href={`/journal#${post.category}`}>{post.category}</Link>
        <span className="sep">/</span>
        <span className="cur">{post.slug}</span>
      </div>

      <TrackedSection id="article-header">
        <header className="a-head section-container">
          <div className="cat">{post.category}</div>
          <h1>{post.title}</h1>
          {post.lede && <p className="lede">{post.lede}</p>}
          <div className="meta">
            <span className="who">
              <span className="av">{post.initials}</span>
              {post.author}
            </span>
            <span className="dot" />
            <span>{formatDate(post.date)}</span>
            <span className="dot" />
            <span>{post.readTime} мин унших</span>
            <span className="dot" />
            <span>{post.views} views</span>
          </div>
        </header>
      </TrackedSection>

      <div className="section-container">
        <div className="a-hero">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="ph" style={{ background: post.coverGrad }}>
              {post.coverNote}
            </div>
          )}
        </div>
      </div>

      <TrackedSection id="article-body">
        <main className="section-container a-body">
          <aside className="a-side-l">
            {toc.length > 0 && (
              <nav className="a-toc" aria-label="On this page">
                <h6>On this page</h6>
                <ul>
                  {toc.map((t) => (
                    <li
                      key={t.id}
                      style={t.level === 3 ? { paddingLeft: 12 } : undefined}
                    >
                      <a
                        href={`#${t.id}`}
                        className={activeToc === t.id ? "is-active" : ""}
                        onClick={onTocClick(t.id)}
                        aria-current={
                          activeToc === t.id ? "location" : undefined
                        }
                      >
                        {t.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </aside>

          <article
            className="a-content"
            ref={bodyRef}
            dangerouslySetInnerHTML={{ __html: post.bodyHtml || "" }}
          />

          <aside className="a-side-r">
            <div className="a-rail">
              <h6>Article</h6>
              <div className="a-rail-stat">
                <span>👁</span>
                <span>
                  <strong>{post.views}</strong> views
                </span>
              </div>
              <div className="a-rail-stat">
                <span>⏱</span>
                <span>
                  <strong>{post.readTime}</strong> мин уншина
                </span>
              </div>
              <h6 style={{ marginTop: 20 }}>Үйлдэл</h6>
              <div className="a-rail-actions">
                <button onClick={toggleBookmark} type="button">
                  {bookmarked ? "★" : "☆"} &nbsp;{" "}
                  {bookmarked ? "Хадгалсан" : "Bookmark"}
                </button>
                <button onClick={onShare} type="button">
                  ↗ &nbsp; Хуваалцах
                </button>
                <button onClick={onPrint} type="button">
                  ⎙ &nbsp; Хэвлэх
                </button>
              </div>
            </div>
          </aside>
        </main>
      </TrackedSection>

      <div className="section-container">
        <TrackedSection id="article-tags">
          <div className="a-tags">
            {post.tags.map((t) => (
              <span key={t} className="a-tag">
                #{t}
              </span>
            ))}
          </div>

          <div className="a-bottom-share">
            <div className="label">Энэ нийтлэлийг хуваалцах</div>
            <div className="icons">
              <a
                className="ic"
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : "",
                )}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on X"
              >
                𝕏
              </a>
              <a
                className="ic"
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                  typeof window !== "undefined" ? window.location.href : "",
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on LinkedIn"
              >
                in
              </a>
              <a
                className="ic"
                href={`mailto:?subject=${encodeURIComponent(post.title)}`}
                aria-label="Share via Email"
              >
                ✉
              </a>
              <button
                className="ic"
                type="button"
                onClick={onCopyLink}
                aria-label="Copy link"
                style={{ cursor: "pointer", border: "1px solid var(--j-line)" }}
              >
                ⎘
              </button>
            </div>
          </div>
        </TrackedSection>

        <TrackedSection id="article-author">
          <div className="a-author">
            <div className="av">{post.initials}</div>
            <div>
              <h4 className="name">{post.author}</h4>
              <div className="role">{post.authorRole}</div>
              <p>
                Тэнгэр Капиталын редакцын баг. Зах зээлийн шинжилгээ, хөрөнгө
                оруулалтын стратеги, санхүүгийн боловсролын чиглэлээр тогтмол
                нийтлэл бичдэг.
              </p>
            </div>
          </div>
        </TrackedSection>

        <TrackedSection id="article-comments">
          <section className="a-comments">
            <h3>Хэлэлцүүлэг</h3>
            <div className="sub">
              {comments.length} сэтгэгдэл · хэлэлцүүлэгт орох
            </div>

            <form className="a-comment-form" onSubmit={submitComment}>
              <div className="av">
                {commentName ? makeInitials(commentName) || "?" : "?"}
              </div>
              <div className="field">
                <input
                  value={commentName}
                  onChange={(e) => setCommentName(e.target.value)}
                  placeholder="Таны нэр · Your name"
                  required
                  style={{
                    width: "100%",
                    border: "1px solid var(--j-line)",
                    borderRadius: 12,
                    padding: "10px 14px",
                    fontFamily: "inherit",
                    fontSize: 13,
                    marginBottom: 8,
                    background: "var(--j-bg-card)",
                    color: "var(--j-ink)",
                  }}
                />
                <textarea
                  placeholder="Та юу гэж бодож байна вэ?"
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  required
                />
                <div className="ctrl">
                  <span className="hint">
                    Сэтгэгдлүүд админ зөвшөөрсний дараа харагдана.
                  </span>
                  <button
                    className="send"
                    type="submit"
                    disabled={submitting}
                    data-tc-cta="article-comment-submit"
                  >
                    {submitting ? "Илгээж байна…" : "Илгээх"}
                  </button>
                </div>
              </div>
            </form>

            {topLevelComments.length === 0 ? (
              <div
                style={{
                  padding: 24,
                  textAlign: "center",
                  color: "var(--j-muted)",
                  fontSize: 13,
                }}
              >
                Эхний сэтгэгдлийг та үлдээгээрэй.
              </div>
            ) : (
              topLevelComments.map((c) => {
                const replies = repliesByParent.get(c.id) ?? [];
                return (
                  <div className="item" key={c.id}>
                    <div className="av">{c.authorInitials || "?"}</div>
                    <div>
                      <div>
                        <span className="who">{c.authorName}</span>
                        {c.isAuthor && (
                          <span
                            style={{
                              fontFamily: "var(--font-mono)",
                              fontSize: 10,
                              marginLeft: 8,
                              padding: "2px 6px",
                              border: "1px solid var(--j-line)",
                              borderRadius: 4,
                              color: "var(--j-muted)",
                              letterSpacing: "0.1em",
                            }}
                          >
                            АВТОР
                          </span>
                        )}
                        <span className="when">{timeAgoMn(c.createdAt)}</span>
                      </div>
                      <div className="body">{c.body}</div>
                      {replies.map((r) => (
                        <div className="reply" key={r.id}>
                          <div className="av">{r.authorInitials || "?"}</div>
                          <div>
                            <div>
                              <span className="who">
                                {r.authorName}
                                {r.isAuthor && (
                                  <span
                                    style={{
                                      fontFamily: "var(--font-mono)",
                                      fontSize: 10,
                                      marginLeft: 8,
                                      padding: "2px 6px",
                                      border: "1px solid var(--j-line)",
                                      borderRadius: 4,
                                      color: "var(--j-muted)",
                                      letterSpacing: "0.1em",
                                    }}
                                  >
                                    АВТОР
                                  </span>
                                )}
                              </span>
                              <span className="when">
                                {timeAgoMn(r.createdAt)}
                              </span>
                            </div>
                            <div className="body">{r.body}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </section>
        </TrackedSection>

        <TrackedSection id="article-related">
          <section className="a-related">
            <h4>Үргэлжлүүлэн уншина уу</h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/journal/${p.slug}`}
                  data-tc-cta={`article-related-${p.slug}`}
                  className="block"
                >
                  <BlogCard
                    title={p.title}
                    image={p.image}
                    publishedDate={p.date}
                    tags={[p.category, ...p.tags.slice(0, 1)]}
                  />
                </Link>
              ))}
            </div>
          </section>
        </TrackedSection>
      </div>
    </>
  );
}
