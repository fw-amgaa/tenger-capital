import type { JournalPostRow } from "@/lib/db/schema";

export type JournalPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  tags: string[];
  author: string;
  authorRole: string;
  initials: string;
  date: string;
  readTime: string;
  views: string;
  featured?: boolean;
  image: string;
  coverGrad: string;
  coverNote: string;
  bodyHtml?: string;
  lede?: string;
};

const FALLBACK_IMAGE = "/mockups/blogs/1.avif";
const FALLBACK_GRAD =
  "linear-gradient(135deg, oklch(0.32 0.08 50) 0%, oklch(0.10 0.02 50) 100%)";

function formatViews(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return String(n);
}

export function rowToJournalPost(row: JournalPostRow): JournalPost {
  const date = (row.publishedAt ?? row.createdAt).toISOString().slice(0, 10);
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    category: row.category,
    tags: row.tags,
    author: row.author,
    authorRole: row.authorRole,
    initials: row.authorInitials,
    date,
    readTime: String(row.readTime),
    views: formatViews(row.views),
    featured: row.featured,
    image: row.coverImage || FALLBACK_IMAGE,
    coverGrad: FALLBACK_GRAD,
    coverNote: "",
    bodyHtml: row.bodyHtml,
    lede: row.lede,
  };
}

export type JournalCategory = {
  id: string;
  label: string;
  labelEn: string;
};

export const JOURNAL_POSTS: JournalPost[] = [
  {
    id: "p1",
    slug: "market-volatility-mongolia-2026",
    title: "Зах зээлийн хэлбэлзэл ба урт хугацааны харагдац",
    excerpt:
      "Хөрөнгийн зах зээлийн өдөр тутмын хэлбэлзэл нь хөрөнгө оруулагчдын анхаарлыг сарниулдаг. Энэ нийтлэлд бид яагаад тэвчээр хамгийн үнэт хөрөнгө гэдгийг авч үзнэ.",
    category: "Шинжилгээ",
    tags: ["Зах зээл", "Стратеги", "Long-term"],
    author: "Б. Нэргүй",
    authorRole: "Шинжээч ахлах",
    initials: "БН",
    date: "2026-04-18",
    readTime: "8",
    views: "2.4k",
    featured: true,
    image: "/mockups/blogs/1.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.32 0.08 50) 0%, oklch(0.10 0.02 50) 100%)",
    coverNote: "[ HERO IMAGE — market candle pattern ]",
  },
  {
    id: "p2",
    slug: "rsus-explained",
    title: "Understanding RSUs: A Comprehensive Guide",
    excerpt:
      "Restricted stock units are one of the most common forms of equity compensation. Here's what every Mongolian professional working at a global firm should know.",
    category: "Боловсрол",
    tags: ["RSUs", "Equity", "Compensation"],
    author: "Christopher Nelson",
    authorRole: "Founder, WealthOps",
    initials: "CN",
    date: "2025-09-12",
    readTime: "12",
    views: "5.1k",
    image: "/mockups/blogs/2.avif",
    coverGrad:
      "linear-gradient(160deg, oklch(0.20 0.04 60) 0%, oklch(0.10 0.02 50) 100%)",
    coverNote: "[ portrait ]",
  },
  {
    id: "p3",
    slug: "diversification-101",
    title: "Хөрөнгийн портфелийг яаж тэнцвэржүүлэх вэ",
    excerpt:
      "Нэг сагсанд бүх өндгөө хийхгүй байх нь сонгодог зөвлөгөө. Гэвч практикт энэ юу гэсэн үг вэ — Монголын зах зээлийн контекстэд?",
    category: "Стратеги",
    tags: ["Portfolio", "Risk", "Diversification"],
    author: "Д. Энхтүвшин",
    authorRole: "Хөрөнгө оруулалтын зөвлөх",
    initials: "ДЭ",
    date: "2025-09-08",
    readTime: "7",
    views: "3.8k",
    image: "/mockups/blogs/3.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.94 0.025 70) 0%, oklch(0.86 0.05 50) 100%)",
    coverNote: "[ minimalist still life ]",
  },
  {
    id: "p4",
    slug: "what-to-do-with-equity",
    title: "What to Do With Your Equity Before You Sell, Quit, or Vest",
    excerpt:
      "Workshop with Expert Barbara Saksa on the most common mistakes Mongolian tech employees make when handling stock options abroad.",
    category: "Боловсрол",
    tags: ["Equity", "Investment", "Strategy"],
    author: "Barbara Saksa",
    authorRole: "Equity Advisor",
    initials: "BS",
    date: "2025-08-22",
    readTime: "15",
    views: "4.2k",
    image: "/mockups/blogs/1.avif",
    coverGrad:
      "linear-gradient(140deg, oklch(0.16 0.03 30) 0%, oklch(0.08 0.01 30) 100%)",
    coverNote: "[ workshop photography ]",
  },
  {
    id: "p5",
    slug: "consolidate-old-accounts",
    title: "Хуучин дансуудаа нэгтгэх — энгийн алхамууд",
    excerpt:
      "Олон банк, олон брокер, олон данс. Тэдгээрийг нэгтгэснээр та яагаад жилд дунджаар 1.4% илүү өгөөж олж авдаг вэ?",
    category: "Зөвлөмж",
    tags: ["Tax", "Stock Options", "Finance"],
    author: "Г. Алтанзул",
    authorRole: "Хөрөнгө оруулалтын зөвлөх",
    initials: "ГА",
    date: "2025-07-30",
    readTime: "6",
    views: "1.9k",
    image: "/mockups/blogs/2.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.93 0.02 130) 0%, oklch(0.85 0.06 110) 100%)",
    coverNote: "[ plant / minimalism ]",
  },
  {
    id: "p6",
    slug: "mse-2026-outlook",
    title: "MSE 2026: Эдийн засагч 12 нэрсийн таамаглал",
    excerpt:
      "Бид Монголын тэргүүлэгч эдийн засагчдаас MSE-ийн ирэх жилийн чиглэлийн талаар санал асуусан. Үр дүн нь сонирхолтой болсон.",
    category: "Мэдээ",
    tags: ["MSE", "Forecast", "Macro"],
    author: "Тэнгэр Шинжээ",
    authorRole: "Editorial team",
    initials: "ТШ",
    date: "2025-07-15",
    readTime: "10",
    views: "8.7k",
    image: "/mockups/blogs/3.avif",
    coverGrad:
      "linear-gradient(160deg, oklch(0.18 0.05 50) 0%, oklch(0.06 0.02 50) 100%)",
    coverNote: "[ trading floor / data viz ]",
  },
  {
    id: "p7",
    slug: "esg-mongolia",
    title: "ESG investing in a mining-led economy",
    excerpt:
      "Can a country whose GDP is built on copper and coal still produce credible ESG funds? A frank look at the trade-offs and the early winners.",
    category: "Шинжилгээ",
    tags: ["ESG", "Mining", "Sustainability"],
    author: "Sarah Koval",
    authorRole: "Senior Analyst",
    initials: "SK",
    date: "2025-06-28",
    readTime: "11",
    views: "2.1k",
    image: "/mockups/blogs/1.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.24 0.06 145) 0%, oklch(0.10 0.02 145) 100%)",
    coverNote: "[ landscape contrast ]",
  },
  {
    id: "p8",
    slug: "young-investors-mongolia",
    title: "Залуу хөрөнгө оруулагчид: 25 насанд эхлэх 5 алхам",
    excerpt:
      "Эрт эхэлсэн нь хожим эхэлсэнтэй харьцуулахад нөхөж баршгүй давуу талтай. Хүүгийн хүүгийн ид шид.",
    category: "Боловсрол",
    tags: ["Beginners", "Compound", "Saving"],
    author: "Б. Нэргүй",
    authorRole: "Шинжээч ахлах",
    initials: "БН",
    date: "2025-06-10",
    readTime: "5",
    views: "12.3k",
    image: "/mockups/blogs/2.avif",
    coverGrad:
      "linear-gradient(140deg, oklch(0.92 0.03 80) 0%, oklch(0.84 0.07 60) 100%)",
    coverNote: "[ progression ]",
  },
  {
    id: "p9",
    slug: "ipo-pipeline-2026",
    title: "Mongolia's IPO pipeline: who is next?",
    excerpt:
      "Гурван томоохон компани 2026 онд танилцуулга гаргахаар бэлтгэж байна. Тэдний санхүүгийн гүйцэтгэлд гүн шинжилгээ хийлээ.",
    category: "Мэдээ",
    tags: ["IPO", "Pipeline", "MSE"],
    author: "Д. Энхтүвшин",
    authorRole: "Хөрөнгө оруулалтын зөвлөх",
    initials: "ДЭ",
    date: "2025-05-22",
    readTime: "9",
    views: "6.4k",
    image: "/mockups/blogs/3.avif",
    coverGrad:
      "linear-gradient(160deg, oklch(0.18 0.02 0) 0%, oklch(0.08 0.01 0) 100%)",
    coverNote: "[ skyline / financial district ]",
  },
  {
    id: "p10",
    slug: "behavioral-finance-trap",
    title: "Зан төлөвийн санхүү: Бид өөрсдийгөө яаж хуурдаг вэ",
    excerpt:
      "Хөрөнгө оруулалтын хамгийн муу дайсан нь зах зээл биш — танай тархи. Шинжлэх ухааны жишгээр харъя.",
    category: "Шинжилгээ",
    tags: ["Behavior", "Psychology", "Bias"],
    author: "Sarah Koval",
    authorRole: "Senior Analyst",
    initials: "SK",
    date: "2025-04-30",
    readTime: "9",
    views: "3.3k",
    image: "/mockups/blogs/1.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.22 0.04 250) 0%, oklch(0.08 0.02 250) 100%)",
    coverNote: "[ abstract maze ]",
  },
  {
    id: "p11",
    slug: "fixed-income-mongolia",
    title: "Тогтмол орлогын зах зээл: Монголд боломж бий юу?",
    excerpt:
      "Засгийн газрын бонд, корпорацийн өрийн бичиг — Монголын тогтмол орлогын зах зээлийн өнөөгийн байдал ба ирээдүй.",
    category: "Стратеги",
    tags: ["Bonds", "Fixed-income", "Yield"],
    author: "Г. Алтанзул",
    authorRole: "Хөрөнгө оруулалтын зөвлөх",
    initials: "ГА",
    date: "2025-04-15",
    readTime: "8",
    views: "2.7k",
    image: "/mockups/blogs/2.avif",
    coverGrad:
      "linear-gradient(135deg, oklch(0.94 0.02 60) 0%, oklch(0.88 0.04 30) 100%)",
    coverNote: "[ documents / texture ]",
  },
  {
    id: "p12",
    slug: "macro-2026-q1",
    title: "Q1 2026 макро тойм: Инфляци, бодлогын хүү, валют",
    excerpt:
      "Энэ улирлын гол макро эдийн засгийн үзүүлэлтүүд. Монголбанкны хүүгийн шийдвэр ба валютын зах зээлийн чиг хандлага.",
    category: "Мэдээ",
    tags: ["Macro", "Q1", "Inflation"],
    author: "Тэнгэр Шинжээ",
    authorRole: "Editorial team",
    initials: "ТШ",
    date: "2026-04-02",
    readTime: "7",
    views: "4.6k",
    image: "/mockups/blogs/3.avif",
    coverGrad:
      "linear-gradient(160deg, oklch(0.20 0.04 30) 0%, oklch(0.08 0.02 30) 100%)",
    coverNote: "[ macro chart ]",
  },
];

export const JOURNAL_CATEGORIES: JournalCategory[] = [
  { id: "all", label: "Бүгд", labelEn: "All" },
  { id: "Шинжилгээ", label: "Шинжилгээ", labelEn: "Analysis" },
  { id: "Боловсрол", label: "Боловсрол", labelEn: "Education" },
  { id: "Стратеги", label: "Стратеги", labelEn: "Strategy" },
  { id: "Зөвлөмж", label: "Зөвлөмж", labelEn: "Advice" },
  { id: "Мэдээ", label: "Мэдээ", labelEn: "News" },
];

export const JOURNAL_SUGGESTIONS = [
  { type: "trend", title: "MSE 2026 forecast", sub: "Хамгийн их уншигдсан 7 хоногт" },
  { type: "trend", title: "RSUs guide", sub: "Trending in Education" },
  { type: "trend", title: "Behavioral bias", sub: "Editor's pick" },
];

export function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const d = new Date(dateStr);
  const ms = now.getTime() - d.getTime();
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);
  if (days < 1) return "today";
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
  if (days < 30)
    return `${Math.floor(days / 7)} week${
      Math.floor(days / 7) === 1 ? "" : "s"
    } ago`;
  if (months < 12) return `${months} month${months === 1 ? "" : "s"} ago`;
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export function getPostBySlug(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((p) => p.slug === slug);
}
