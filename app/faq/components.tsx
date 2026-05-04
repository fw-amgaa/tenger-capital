"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { getTracker } from "@/lib/analytics/tracker";
import {
  FaqCategory,
  FaqPopularRef,
  FaqPromo,
  FaqQuestion,
} from "@/lib/faq/content";

// =====================================================
// Inline icons (kept tiny; no need for an extra dep)
// =====================================================

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 12" fill="currentColor" aria-hidden="true">
      <path d="m9.169 0-.853.853L12.302 4.84H0v1.32h12.302l-3.986 3.986.853.853L14.6 5.5z" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 22 24" fill="currentColor" aria-hidden="true">
      <path d="M2 1.4 20 12 2 22.6z" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

// Inline-markdown for **bold** spans inside answer text.
function renderRich(s: string) {
  const parts = s.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) {
      return <strong key={i}>{p.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{p}</Fragment>;
  });
}

function smoothScrollTo(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

// =====================================================
// Promo banner
// =====================================================

export function FaqBanner({ promo }: { promo: FaqPromo }) {
  return (
    <div className="faq-banner">
      <div className="faq-banner-body">
        <div>
          <div className="meta">
            <span className="pulse" />
            {promo.meta}
          </div>
          <h1 style={{ marginTop: 24 }}>
            {promo.eyebrow.split("•")[0].trim()}{" "}
            <span className="accent">{promo.title}</span>
          </h1>
        </div>
        <p>{promo.blurb}</p>
        <button className="faq-banner-cta" type="button">
          {promo.cta}
          <span className="arrow">
            <svg viewBox="0 0 14 8" fill="currentColor" aria-hidden="true">
              <path d="m8.7 0-.79.79L11.04 3.4H0v1.2h11.04L7.91 7.21l.79.79L13 4z" />
            </svg>
          </span>
        </button>
      </div>
      <div className="faq-banner-visual" aria-hidden="true">
        <div className="grid-bg" />
        <div className="reg tl" />
        <div className="reg bl" />
        <div className="reg br" />
        <span className="corner">{promo.cornerLabel}</span>
        <div className="glyph">{promo.glyph}</div>
      </div>
    </div>
  );
}

// =====================================================
// Search bar
// =====================================================

export function FaqSearch({
  value,
  onChange,
  totalQs,
  matchCount,
}: {
  value: string;
  onChange: (v: string) => void;
  totalQs: number;
  matchCount: number;
}) {
  return (
    <div className="faq-section">
      <div className="faq-search">
        <span className="icon">
          <SearchIcon />
        </span>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") onChange("");
          }}
          placeholder="Асуултаас хайх... · Search across all questions"
          aria-label="Асуултаас хайх"
        />
        {value && (
          <button className="clear" type="button" onClick={() => onChange("")}>
            Esc
          </button>
        )}
      </div>
      {value ? (
        <div className="faq-search-meta">
          {matchCount} of {totalQs} questions match &ldquo;{value}&rdquo;
        </div>
      ) : null}
    </div>
  );
}

// =====================================================
// Sticky category nav
// =====================================================

export function FaqCatnav({
  cats,
  activeId,
}: {
  cats: FaqCategory[];
  activeId: string;
}) {
  return (
    <nav className="faq-catnav" aria-label="FAQ categories">
      <div className="faq-catnav-inner">
        {cats.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`faq-catnav-item ${activeId === c.id ? "active" : ""}`}
            onClick={() => smoothScrollTo(`cat-${c.id}`)}
          >
            <span className="num">{c.icon}</span>
            {c.label}
            <span className="count">{c.questions.length}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

// =====================================================
// Popular strip (cross-category)
// =====================================================

export function FaqPopular({
  cats,
  popular,
}: {
  cats: FaqCategory[];
  popular: FaqPopularRef[];
}) {
  const items = popular
    .map((p, i) => {
      const cat = cats.find((c) => c.id === p.catId);
      const q = cat?.questions.find((x) => x.id === p.qid);
      if (!cat || !q) return null;
      return { ...q, cat, idx: i + 1 };
    })
    .filter(Boolean) as Array<FaqQuestion & { cat: FaqCategory; idx: number }>;

  return (
    <section className="faq-section faq-popular">
      <div className="head">
        <h2>Хамгийн их асуудаг · Most asked</h2>
        <span className="meta">Top 5 across all categories</span>
      </div>
      <div className="faq-popular-list">
        {items.map((it) => (
          <button
            key={it.id}
            type="button"
            className="faq-popular-item"
            onClick={() => smoothScrollTo(`cat-${it.cat.id}`)}
          >
            <span className="num">№{String(it.idx).padStart(2, "0")}</span>
            <span className="q">{it.q}</span>
            <div className="row">
              <span className="cat">{it.cat.label}</span>
              <span className="arrow">
                <ArrowRight />
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

// =====================================================
// Per-category video card
// =====================================================

function FaqVideo({ cat }: { cat: FaqCategory }) {
  return (
    <div className="faq-video">
      <div className="faq-video-thumb" style={{ background: cat.videoThumb }}>
        <div className="ph">{cat.videoThumbNote}</div>
        <button
          className="play"
          type="button"
          aria-label={`Play video: ${cat.videoTitle}`}
          onClick={() =>
            getTracker().event({
              type: "video_play",
              name: `faq-${cat.id}`,
              target: `section:cat-${cat.id}`,
            })
          }
        >
          <PlayIcon />
        </button>
        <span className="duration">{cat.videoDuration}</span>
      </div>
      <div className="faq-video-body">
        <span className="label">▶ Video intro · {cat.label}</span>
        <h3>{cat.videoTitle}</h3>
        <span className="sub">{cat.videoTitleEn}</span>
        <button
          type="button"
          className="cta"
          onClick={() =>
            getTracker().event({
              type: "cta_click",
              name: `faq-video-full-${cat.id}`,
              target: `section:cat-${cat.id}`,
            })
          }
        >
          Бүтэн видеог үзэх <ArrowRight />
        </button>
      </div>
    </div>
  );
}

// =====================================================
// Single accordion question
// =====================================================

function FaqAccordionQuestion({
  q,
  num,
}: {
  q: FaqQuestion;
  num: string;
}) {
  const [open, setOpen] = useState(false);
  const [feedback, setFeedback] = useState<"yes" | "no" | null>(null);
  const bodyId = `faq-q-body-${q.id}`;

  const submitFeedback = (value: "yes" | "no") => {
    setFeedback(value);
    getTracker().event({
      type: "faq_feedback",
      name: q.id,
      value,
    });
  };

  return (
    <div className={`faq-q ${open ? "open" : ""}`}>
      <button
        className="faq-q-head"
        type="button"
        onClick={() => {
          const next = !open;
          setOpen(next);
          if (next) {
            getTracker().event({
              type: "faq_open",
              name: q.id,
            });
          }
        }}
        aria-expanded={open}
        aria-controls={bodyId}
      >
        <span className="faq-q-num">{num}</span>
        <span className="qtext">
          {q.q}
          {q.qEn && <em>{q.qEn}</em>}
        </span>
        {q.helpful ? (
          <span className="helpful">
            <span className="num">{q.helpful}</span>
            Helpful
          </span>
        ) : (
          <span />
        )}
        <span className="faq-q-toggle" aria-hidden="true" />
      </button>
      <div className="faq-q-body" id={bodyId} role="region">
        <div>
          <div className="faq-q-content">
            <p className="answer">{renderRich(q.a)}</p>
            <div className="faq-q-feedback">
              <span className="label">
                Энэ хариулт тус болсон уу? · Was this helpful?
              </span>
              <button
                type="button"
                className={feedback === "yes" ? "active" : ""}
                aria-pressed={feedback === "yes"}
                onClick={() => submitFeedback("yes")}
              >
                Тийм · Yes
              </button>
              <button
                type="button"
                className={feedback === "no" ? "active" : ""}
                aria-pressed={feedback === "no"}
                onClick={() => submitFeedback("no")}
              >
                Үгүй · No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// =====================================================
// Category section (header + video + accordion list)
// =====================================================

export function FaqCategorySection({
  cat,
  queryFilter,
}: {
  cat: FaqCategory;
  queryFilter: string;
}) {
  const filtered = useMemo(() => {
    if (!queryFilter) return cat.questions;
    const q = queryFilter.toLowerCase();
    return cat.questions.filter(
      (x) =>
        x.q.toLowerCase().includes(q) ||
        (x.qEn || "").toLowerCase().includes(q) ||
        x.a.toLowerCase().includes(q),
    );
  }, [cat.questions, queryFilter]);

  if (queryFilter && filtered.length === 0) return null;

  return (
    <section
      className="faq-cat"
      id={`cat-${cat.id}`}
      data-cat-id={cat.id}
    >
      <div className="faq-cat-head">
        <div className="faq-cat-num">
          {cat.icon}
          <span className="dot">.</span>
        </div>
        <div className="faq-cat-title-block">
          <div className="label">{cat.labelEn}</div>
          <h2>{cat.label}</h2>
          <p className="intro">{cat.intro}</p>
        </div>
      </div>
      <FaqVideo cat={cat} />
      <div className="faq-list">
        {filtered.map((q, i) => (
          <FaqAccordionQuestion
            key={q.id}
            q={q}
            num={`${cat.icon}.${String(i + 1).padStart(2, "0")}`}
          />
        ))}
      </div>
    </section>
  );
}

// =====================================================
// Help / contact card
// =====================================================

export function FaqHelp() {
  return (
    <section className="faq-section">
      <div className="faq-help">
        <div className="faq-help-body">
          <div className="faq-eyebrow">
            Still have questions
            <span className="dot" />
            Хариулт олдсонгүй юу?
          </div>
          <h2>
            Бид <em>тантай</em> ярилцахдаа таатай байна.
          </h2>
          <p>
            Манай зөвлөхүүд ажлын өдөр 9:00 – 18:00 цагийн хооронд утсаар,
            чатаар, имэйлээр хариулна. VIP харилцагчдын хувьд 24/7 тэргүүлэх
            дугаар нээлттэй.
          </p>
        </div>
        <div className="faq-help-channels">
          <div className="faq-help-row">
            <span className="label">Утас · Phone</span>
            <a className="value" href="tel:+97677110272">
              +976 7711 0272
            </a>
          </div>
          <div className="faq-help-row">
            <span className="label">Имэйл · Email</span>
            <a className="value" href="mailto:hello@tengercapital.mn">
              hello@tengercapital.mn
            </a>
          </div>
          <div className="faq-help-row">
            <span className="label">Чат · Live chat</span>
            <a className="value" href="#" data-tc-cta="faq-live-chat">
              Begin a conversation →
            </a>
          </div>
          <div className="faq-help-row">
            <span className="label">Уулзалт · Visit</span>
            <span className="value">Чингисийн өргөн чөлөө</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Hook: scroll-spy that watches all category sections and
// returns the id of the topmost visible one. Lives here so
// the parent page can pass the result to FaqCatnav.
// =====================================================

export function useActiveCategory(catIds: string[]) {
  const [active, setActive] = useState(catIds[0] ?? "");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (catIds.length === 0) return;

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              a.target.getBoundingClientRect().top -
              b.target.getBoundingClientRect().top,
          );
        const top = visible[0]?.target as HTMLElement | undefined;
        if (top?.dataset.catId) setActive(top.dataset.catId);
      },
      { rootMargin: "-100px 0% -65% 0%" },
    );

    catIds.forEach((id) => {
      const el = document.getElementById(`cat-${id}`);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [catIds]);

  return active;
}
