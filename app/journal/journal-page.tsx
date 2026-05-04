"use client";

import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import Link from "next/link";
import {
  JOURNAL_CATEGORIES,
  JOURNAL_SUGGESTIONS,
  formatDate,
  timeAgo,
  type JournalPost,
} from "@/lib/journal/data";
import { TrackedSection } from "@/components/analytics/tracked-section";
import { getTracker } from "@/lib/analytics/tracker";
import BlogCard from "@/components/blog-card";

type SearchHandler = () => void;

function MotionText({
  text,
  baseDelay = 0,
  charDelay = 0.025,
}: {
  text: string;
  baseDelay?: number;
  charDelay?: number;
}) {
  const words = text.split(" ");
  let charIndex = 0;
  return (
    <span aria-label={text}>
      {words.map((w, wi) => {
        const chars = [...w];
        return (
          <span key={wi} className="word">
            {chars.map((c, ci) => {
              const i = charIndex++;
              const delay = `${(baseDelay + i * charDelay).toFixed(3)}s`;
              return (
                <span key={ci} className="ch" style={{ animationDelay: delay }}>
                  {c}
                </span>
              );
            })}
            {wi < words.length - 1 ? (
              <span style={{ display: "inline-block", width: "0.32em" }} />
            ) : null}
          </span>
        );
      })}
    </span>
  );
}

function FadeIn({
  delay = 0,
  className = "",
  children,
}: {
  delay?: number;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`j-fade-in ${className}`}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
}

function Hero({ articleCount }: { articleCount: number }) {
  return (
    <section className="j-hero">
      <FadeIn delay={0.1}>
        <div className="j-hero-eyebrow">
          <span>The Journal</span>
          <span className="dot" />
          <span>Issue №48</span>
        </div>
      </FadeIn>

      <h1 className="j-hero-wordmark">
        <span className="row">
          <MotionText text="THE TENGER" baseDelay={0.35} />
        </span>
        <span className="row">
          <MotionText text="JOURNAL" baseDelay={0.7} />
        </span>
      </h1>

      <FadeIn delay={1.55}>
        <p className="j-hero-sub">
          Хөрөнгө оруулалт, эдийн засаг, санхүүгийн боловсрол — тэнгэрийн зайтай
          харах өөр өнцөг.
        </p>
      </FadeIn>

      <FadeIn delay={1.7}>
        <div className="j-hero-meta">
          <span>
            <strong>{articleCount}</strong> articles
          </span>
          <span className="j-hero-meta-sep" />
          <span>
            <strong>{JOURNAL_CATEGORIES.length - 1}</strong> sections
          </span>
          <span className="j-hero-meta-sep" />
          <span>
            <strong>Weekly</strong> issue
          </span>
        </div>
      </FadeIn>

      <FadeIn delay={2.0}>
        <div className="j-hero-scroll">
          <span>Scroll</span>
          <span className="line" />
        </div>
      </FadeIn>
    </section>
  );
}

function SearchIcon() {
  return (
    <svg
      className="j-search-icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function SearchBar({
  onOpen,
  hidden,
  inputRef,
}: {
  onOpen: SearchHandler;
  hidden?: boolean;
  inputRef?: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={inputRef}
      className="j-search"
      style={hidden ? { visibility: "hidden" } : undefined}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onOpen();
      }}
      role="button"
      tabIndex={0}
    >
      <SearchIcon />
      <input
        readOnly
        placeholder="Нийтлэл, ангилал, зохиогч хайх..."
        aria-label="Search the journal"
        onFocus={onOpen}
      />
      <span className="j-search-kbd">⌘K</span>
    </div>
  );
}

function highlightText(text: string, query: string): React.ReactNode {
  const term = query.trim();
  if (!term) return text;
  const re = new RegExp(
    `(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
    "i",
  );
  const parts = text.split(re);
  return parts.map((p, i) =>
    re.test(p) ? <mark key={i}>{p}</mark> : <Fragment key={i}>{p}</Fragment>,
  );
}

function CmdK({
  open,
  onClose,
  onPick,
  allPosts,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (post: JournalPost) => void;
  allPosts: JournalPost[];
}) {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      setActive(0);
      const timer = setTimeout(() => inputRef.current?.focus(), 80);
      return () => clearTimeout(timer);
    }
  }, [open]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return null;
    const arts = allPosts.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.excerpt.toLowerCase().includes(term) ||
        p.author.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term) ||
        p.tags.some((t) => t.toLowerCase().includes(term)),
    ).slice(0, 6);
    const cats = JOURNAL_CATEGORIES.filter(
      (c) =>
        c.id !== "all" &&
        (c.label.toLowerCase().includes(term) ||
          c.labelEn.toLowerCase().includes(term)),
    );
    const authors = [
      ...new Set(
        allPosts.filter((p) => p.author.toLowerCase().includes(term)).map(
          (p) => p.author,
        ),
      ),
    ];
    return { arts, cats, authors };
  }, [q, allPosts]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (!filtered) return;
      const total =
        filtered.arts.length + filtered.cats.length + filtered.authors.length;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, total - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      }
      if (e.key === "Enter" && filtered.arts[active]) {
        e.preventDefault();
        onPick(filtered.arts[active]);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, active, onClose, onPick]);

  return (
    <>
      <div
        className={`j-cmd-overlay${open ? " is-open" : ""}`}
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`j-cmd${open ? " is-open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search the journal"
      >
        <div className="j-cmd-head">
          <SearchIcon />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="Хайх... · Search articles, authors, categories"
            aria-label="Search input"
          />
          <span className="esc">esc</span>
        </div>

        <div className="j-cmd-body">
          {!filtered && (
            <>
              <div className="j-cmd-group">
                <h5>Trending</h5>
                {JOURNAL_SUGGESTIONS.map((s, i) => (
                  <div
                    key={i}
                    className="j-cmd-item"
                    onMouseEnter={() => setActive(i)}
                  >
                    <div className="icn">↗</div>
                    <div className="body">
                      <div className="title">{s.title}</div>
                      <div className="sub">{s.sub}</div>
                    </div>
                    <div className="meta">↵</div>
                  </div>
                ))}
              </div>
              <div className="j-cmd-group">
                <h5>Recent</h5>
                {allPosts.slice(0, 4).map((p) => (
                  <div
                    key={p.id}
                    className="j-cmd-item"
                    onClick={() => onPick(p)}
                  >
                    <div className="icn">📄</div>
                    <div className="body">
                      <div className="title">{p.title}</div>
                      <div className="sub">
                        {p.category} · {p.readTime} мин
                      </div>
                    </div>
                    <div className="meta">{timeAgo(p.date)}</div>
                  </div>
                ))}
              </div>
            </>
          )}

          {filtered &&
            filtered.arts.length === 0 &&
            filtered.cats.length === 0 &&
            filtered.authors.length === 0 && (
              <div className="j-cmd-empty">
                <span className="em">No results for &ldquo;{q}&rdquo;</span>
                Try a different query, or browse by category.
              </div>
            )}

          {filtered && filtered.arts.length > 0 && (
            <div className="j-cmd-group">
              <h5>Articles</h5>
              {filtered.arts.map((p, i) => (
                <div
                  key={p.id}
                  className={`j-cmd-item${active === i ? " is-active" : ""}`}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => onPick(p)}
                >
                  <div className="icn">📄</div>
                  <div className="body">
                    <div className="title">{highlightText(p.title, q)}</div>
                    <div className="sub">
                      {p.category} · {p.author} · {p.readTime} мин
                    </div>
                  </div>
                  <div className="meta">{timeAgo(p.date)}</div>
                </div>
              ))}
            </div>
          )}

          {filtered && filtered.cats.length > 0 && (
            <div className="j-cmd-group">
              <h5>Categories</h5>
              {filtered.cats.map((c) => (
                <div key={c.id} className="j-cmd-item">
                  <div className="icn">#</div>
                  <div className="body">
                    <div className="title">
                      {highlightText(c.label, q)}{" "}
                      <span style={{ color: "var(--j-muted-2)", fontSize: 12 }}>
                        · {c.labelEn}
                      </span>
                    </div>
                  </div>
                  <div className="meta">
                    {allPosts.filter((p) => p.category === c.id).length}{" "}
                    posts
                  </div>
                </div>
              ))}
            </div>
          )}

          {filtered && filtered.authors.length > 0 && (
            <div className="j-cmd-group">
              <h5>Authors</h5>
              {filtered.authors.map((a) => (
                <div key={a} className="j-cmd-item">
                  <div className="icn">👤</div>
                  <div className="body">
                    <div className="title">{highlightText(a, q)}</div>
                  </div>
                  <div className="meta">
                    {allPosts.filter((p) => p.author === a).length} нийтлэл
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="j-cmd-foot">
          <div className="legend">
            <span>
              <kbd>↑</kbd>
              <kbd>↓</kbd>Move
            </span>
            <span>
              <kbd>↵</kbd>Open
            </span>
            <span>
              <kbd>esc</kbd>Close
            </span>
          </div>
          <span style={{ fontFamily: "var(--font-mono)" }}>
            tenger.mn / journal
          </span>
        </div>
      </div>
    </>
  );
}

function PostCard({ post }: { post: JournalPost }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      data-tc-cta={`journal-card-${post.slug}`}
      className="block"
    >
      <BlogCard
        title={post.title}
        image={post.image}
        publishedDate={post.date}
        tags={[post.category, ...post.tags.slice(0, 1)]}
      />
    </Link>
  );
}

function FeaturedCard({ post }: { post: JournalPost }) {
  return (
    <Link
      href={`/journal/${post.slug}`}
      className="j-featured"
      data-tc-cta="journal-editors-pick"
    >
      <div className="j-featured-img">
        <div className="ph" style={{ background: post.coverGrad }}>
          {post.coverNote}
        </div>
        <span className="badge">★ Editor&apos;s pick</span>
        <div className="pills">
          <span className="p">{post.category}</span>
          <span className="p">{post.readTime} min</span>
        </div>
      </div>
      <div className="j-featured-body">
        <div>
          <div className="j-featured-meta">
            <span className="cat">{post.category}</span>
            <span className="dot" />
            <span>{formatDate(post.date)}</span>
            <span className="dot" />
            <span>{post.views} views</span>
          </div>
          <h2>{post.title}</h2>
          <p className="j-featured-excerpt">{post.excerpt}</p>
        </div>
        <div className="j-featured-author">
          <div className="j-avatar">{post.initials}</div>
          <div style={{ flex: 1 }}>
            <div className="who">{post.author}</div>
            <div className="role">{post.authorRole}</div>
          </div>
          <div className="j-read-link">
            <span>Read</span>
            <span className="arr">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

function NewsletterCard() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">(
    "idle",
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || status === "submitting") return;
    setStatus("submitting");
    getTracker().event({
      type: "form_submit_attempt",
      name: "journal_newsletter",
      target: "section:newsletter-signup",
    });
    try {
      const res = await fetch("/api/journal/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source: "journal-newsletter" }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
        getTracker().event({
          type: "form_submit_success",
          name: "journal_newsletter",
          target: "section:newsletter-signup",
        });
      } else {
        setStatus("error");
        getTracker().event({
          type: "form_submit_error",
          name: "journal_newsletter",
          target: "section:newsletter-signup",
        });
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="j-news">
      <div className="j-news-card">
        <div>
          <div className="j-news-eyebrow">
            <span className="dot" />
            <span>Subscribe</span>
          </div>
          <h3>
            Долоо хоног бүрийн
            <br />
            санхүүгийн товчлол
          </h3>
          <p>
            Шинэ дүн шинжилгээ, зах зээлийн тойм, ховор уулзалтын зар. 7,400+
            уншигч долоо хоног бүр Лхагва гаригт хүлээн авдаг.
          </p>
          <div className="j-news-stats">
            <span>
              <strong>7,400+</strong>
              <span>уншигч</span>
            </span>
            <span>
              <strong>52</strong>
              <span>дугаар / жил</span>
            </span>
            <span>
              <strong>3 мин</strong>
              <span>унших цаг</span>
            </span>
          </div>
        </div>
        <div>
          <form className="j-news-form" onSubmit={onSubmit}>
            <div className="row">
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                data-tc-cta="journal-newsletter-subscribe"
                disabled={status === "submitting"}
              >
                {status === "submitting"
                  ? "Илгээж байна…"
                  : status === "success"
                  ? "Subscribed ✓"
                  : "Subscribe"}
              </button>
            </div>
            <span className="j-news-fine">
              {status === "error"
                ? "Алдаа гарлаа. Дахин оролдоно уу."
                : "Spam байхгүй. Хүссэн үедээ цуцлах боломжтой."}
            </span>
          </form>
        </div>
      </div>
    </section>
  );
}

export default function JournalListPage({
  posts,
}: {
  posts: JournalPost[];
}) {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchSticky, setSearchSticky] = useState(false);
  const [shown, setShown] = useState(9);

  const heroSearchRef = useRef<HTMLDivElement | null>(null);
  const stickySearchRef = useRef<HTMLDivElement | null>(null);

  const featured = posts.find((p) => p.featured);
  const others = posts.filter((p) => !p.featured);

  const filtered = useMemo(() => {
    if (activeCat === "all") return others;
    return others.filter((p) => p.category === activeCat);
  }, [activeCat, others]);

  const counts = useMemo(() => {
    const obj: Record<string, number> = { all: others.length };
    JOURNAL_CATEGORIES.forEach((c) => {
      if (c.id !== "all")
        obj[c.id] = others.filter((p) => p.category === c.id).length;
    });
    return obj;
  }, [others]);

  // Restore view preference
  useEffect(() => {
    const stored = localStorage.getItem("tenger-journal-view");
    if (stored === "grid" || stored === "list") setView(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("tenger-journal-view", view);
  }, [view]);

  useEffect(() => {
    const onScroll = () => {
      if (!heroSearchRef.current) return;
      const r = heroSearchRef.current.getBoundingClientRect();
      const passed = r.bottom < 80;
      setSearchSticky(passed && window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const onPick = (post: JournalPost) => {
    window.location.href = `/journal/${post.slug}`;
  };

  return (
    <>
      <TrackedSection id="journal-hero">
        <Hero articleCount={posts.length} />
      </TrackedSection>

      <TrackedSection id="journal-search">
        <div style={{ padding: "16px 20px 24px" }}>
          <SearchBar
            onOpen={() => setCmdOpen(true)}
            hidden={searchSticky}
            inputRef={heroSearchRef}
          />
        </div>
      </TrackedSection>

      {searchSticky && (
        <div
          ref={stickySearchRef}
          className="j-search is-floating"
          onClick={() => setCmdOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setCmdOpen(true);
          }}
        >
          <SearchIcon />
          <input
            readOnly
            placeholder="Хайх..."
            aria-label="Search the journal"
          />
          <span className="j-search-kbd">⌘K</span>
        </div>
      )}

      <section className="section-container">
        <TrackedSection id="journal-categories">
          <div className="j-cats" role="tablist">
            {JOURNAL_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`j-cat${activeCat === c.id ? " is-active" : ""}`}
                onClick={() => {
                  setActiveCat(c.id);
                  setShown(9);
                }}
                role="tab"
                aria-selected={activeCat === c.id}
                data-tc-cta={`journal-category-${c.id}`}
              >
                {c.label}
                <span className="count">{counts[c.id] ?? 0}</span>
              </button>
            ))}
            <div className="j-cats-spacer" />
            <div className="j-view-toggle" role="tablist">
              <button
                className={view === "grid" ? "is-active" : ""}
                onClick={() => setView("grid")}
                aria-label="Grid view"
                data-tc-cta="journal-view-grid"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
              <button
                className={view === "list" ? "is-active" : ""}
                onClick={() => setView("list")}
                aria-label="List view"
                data-tc-cta="journal-view-list"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>
          </div>
        </TrackedSection>

        {featured && activeCat === "all" && (
          <TrackedSection id="journal-featured">
            <FeaturedCard post={featured} />
          </TrackedSection>
        )}

        <TrackedSection id="journal-grid">
          <div className="j-grid-section">
            <div className="j-grid-head">
              <h3>{activeCat === "all" ? "Latest" : activeCat}</h3>
              <span className="count">{filtered.length} нийтлэл</span>
            </div>

            <div
              className={
                view === "grid"
                  ? "grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                  : "grid grid-cols-1 gap-8 max-w-2xl mx-auto"
              }
            >
              {filtered.slice(0, shown).map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>

            {filtered.length > shown && (
              <div className="j-load">
                <div className="j-load-info">
                  Showing {shown} of {filtered.length} articles
                </div>
                <button
                  type="button"
                  onClick={() => setShown((s) => s + 6)}
                  data-tc-cta="journal-load-more"
                  style={{
                    padding: "12px 28px",
                    border: "1px solid var(--j-line)",
                    borderRadius: 999,
                    background: "var(--j-bg-card)",
                    color: "var(--j-ink)",
                    fontFamily: "inherit",
                    fontSize: 13,
                    cursor: "pointer",
                  }}
                >
                  Цааш үзэх · Load more
                </button>
              </div>
            )}
          </div>
        </TrackedSection>

        <TrackedSection id="journal-newsletter">
          <NewsletterCard />
        </TrackedSection>
      </section>

      <CmdK
        open={cmdOpen}
        onClose={() => setCmdOpen(false)}
        onPick={onPick}
        allPosts={posts}
      />
    </>
  );
}
