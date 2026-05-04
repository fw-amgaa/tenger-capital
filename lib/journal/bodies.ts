import type { JournalPost } from "./data";

export type ArticleBlock =
  | { type: "p"; id?: string; text: string }
  | { type: "h2"; id?: string; text: string }
  | { type: "h3"; id?: string; text: string }
  | { type: "blockquote"; text: string; cite?: string }
  | { type: "pullquote"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "callout"; title: string; text: string }
  | { type: "stat-row"; stats: { value: string; label: string }[] }
  | { type: "figure"; note: string; caption: string };

export type ArticleBody = {
  lede: string;
  toc: { id: string; label: string }[];
  notes: { title: string; body: string }[];
  paras: ArticleBlock[];
};

export const ARTICLE_BODIES: Record<string, ArticleBody> = {
  p1: {
    lede: "Зах зээл өдөр бүр өсч уруудна. Гэхдээ урт хугацааны хөрөнгө оруулагчийн хувьд энэ хэлбэлзэл нь ердөө л дэвсгэр чимээ — стратеги биш.",
    toc: [
      { id: "intro", label: "Intro: Daily noise, weekly signal" },
      { id: "data", label: "Үндсэн өгөгдөл (2018–2026)" },
      { id: "behavior", label: "Зан төлөвийн алдаа" },
      { id: "framework", label: "Тэвчээрийн framework" },
      { id: "conclusion", label: "Дүгнэлт" },
    ],
    notes: [
      {
        title: "Pull quote",
        body: "Дунд зэргийн хөрөнгө оруулагч 1990 оноос хойш жилд 4.1% өгөөж олсон бол S&P 500 11.4% өсөв.",
      },
      {
        title: "Term",
        body: "Volatility — стандарт хазайлт буюу үнийн хэлбэлзлийн хэмжүүр. Эрсдэл биш — анхаарал татагч.",
      },
      {
        title: "Read next",
        body: "Зан төлөвийн санхүү: Бид өөрсдийгөө яаж хуурдаг вэ →",
      },
    ],
    paras: [
      {
        type: "p",
        id: "intro",
        text: "Сар бүрийн эхээр хөрөнгийн зах зээлийн график шиг бүх юм гулсаж унаад дараа нь сэргэдэг хэв маяг бид бүхэнд танил. Гэвч хэдхэн өдрийн дараа л унагасан мэт сэтгэгдэл нь юу болсныг бараг бүгдийг нь мартдаг.",
      },
      {
        type: "p",
        text: "Энэ нийтлэлд би 2018 оноос хойших MSE Top-20 индексийн өдөр тутмын өгөгдөл болон Тэнгэрийн өөрийн портфелийн өгөөжийг ашиглан, **хэлбэлзэл ба өгөөж хоёр огт өөр зүйл** гэдгийг харуулна.",
      },
      { type: "h2", id: "data", text: "Үндсэн өгөгдөл (2018–2026)" },
      {
        type: "p",
        text: "Сүүлийн 8 жилийн хугацаанд MSE Top-20 индекс жилд дунджаар 14.6%-иар өссөн. Гэхдээ нэг ч жил дунджаасаа 4%-аас бага алдаа гарсангүй — өсөлт тогтвортой биш, Тагш хуваарилагдаагүй.",
      },
      {
        type: "stat-row",
        stats: [
          { value: "14.6%", label: "Дундаж жилийн өгөөж" },
          { value: "27.3%", label: "Хамгийн муу жил" },
          { value: "62%", label: "Эерэг өдрийн харьцаа" },
        ],
      },
      {
        type: "p",
        text: "Хамгийн сонирхолтой нь — хамгийн сайн 10 өдрийг алгасвал нийт өгөөж 14.6%-аас 6.2%-д унадаг. Өөрөөр хэлбэл, **зөв цаг сонгох гэсэн бүх оролдлого үндсэн өгөөжийн талаас илүүг устгах эрсдэлтэй**.",
      },
      {
        type: "blockquote",
        text: "Time in the market beats timing the market.",
        cite: "— Hopelessly Cliché, but verifiably true",
      },
      { type: "h2", id: "behavior", text: "Зан төлөвийн алдаа" },
      {
        type: "p",
        text: "Зах зээл унахад 80%-ийн хөрөнгө оруулагч худалддаг. Зах зээл өсч байхад 80% нь худалдаж авдаг. Энэ нь яг буруу дараалал.",
      },
      {
        type: "ul",
        items: [
          "Loss aversion — алдагдлыг олзноос 2 дахин их мэдэрдэг",
          "Recency bias — сүүлийн 30 хоногийн зах зээл бүх зүйлийн төлөөлөл биш",
          "Anchoring — өмнөх үнэд 'зөв' гэж барьцаалдаг",
        ],
      },
      {
        type: "callout",
        title: "Гол зөвлөгөө",
        text: "Стратеги бичсэний дараа л график үзэх. Эсрэгээр биш. График нь шийдвэр гаргахгүй — стратеги шийдвэр гаргадаг.",
      },
      {
        type: "pullquote",
        text: "Тэвчээр бол хөрөнгө оруулалтын хамгийн өндөр зардалтай ур чадвар.",
      },
      { type: "h2", id: "framework", text: "Тэвчээрийн framework" },
      { type: "p", text: "Тэнгэрийн санал болгож буй 4-алхмын framework:" },
      {
        type: "ol",
        items: [
          "**Define** — амьдралын зорилго тус бүрд тусдаа цаг хугацааны хүрээ тавих",
          "**Diversify** — тус бүрд нь тохирсон хөрөнгийн хуваарилалт бий болгох",
          "**Defer** — өдөр тутмын мэдээнд хариу үйлдэл хийхгүй",
          "**Decide annually** — жилд нэг л удаа дахин тэнцвэржүүлэх",
        ],
      },
      {
        type: "figure",
        note: "[ Chart: 4D framework illustration ]",
        caption:
          "Дөрвөн D — Define, Diversify, Defer, Decide. Энэ дарааллыг буруу солих нь ихэнх алдааны эх үүсвэр.",
      },
      { type: "h2", id: "conclusion", text: "Дүгнэлт" },
      {
        type: "p",
        text: "Зах зээл хэлбэлзэх нь танай эрсдэл биш. Танай зан төлөв л эрсдэл. Хамгийн сайн портфель ч атугай **тэвчээртэй эзэндээ л үр шимээ өгдөг**.",
      },
      {
        type: "p",
        text: "Дараагийн дугаарт: бид зан төлөвийн алдааны 7 цэгт зориулсан тусдаа гүн шинжилгээ хийнэ. Уулзацгаая.",
      },
    ],
  },
};

export function getDefaultBody(post: JournalPost): ArticleBody {
  return {
    lede: post.excerpt,
    toc: [
      { id: "intro", label: "Introduction" },
      { id: "context", label: "Context" },
      { id: "framework", label: "Framework" },
      { id: "examples", label: "Worked examples" },
      { id: "takeaway", label: "Takeaway" },
    ],
    notes: [
      { title: "Reading", body: `${post.readTime} мин · ${post.views} views` },
      { title: "Author", body: `${post.author} · ${post.authorRole}` },
      { title: "Tags", body: post.tags.join(" · ") },
    ],
    paras: [
      { type: "p", id: "intro", text: post.excerpt },
      {
        type: "p",
        text: "Энэ нийтлэлд бид сэдвийг гурван өнцгөөс судална: түүхэн өгөгдөл, өнөөгийн нөхцөл, ирээдүйн чиглэл. Хөрөнгө оруулагчдад **практик ач холбогдолтой** хэсгүүдэд илүү анхаарна.",
      },
      { type: "h2", id: "context", text: "Context — Яагаад одоо?" },
      {
        type: "p",
        text: "Зах зээлийн нөхцөл байдал сүүлийн арван жилд маш олон удаа өөрчлөгдсөн. Гэвч зарим зарчим хэвээр үлдсэн. Эдгээр зарчмыг тодорхой жишээгээр харуулъя.",
      },
      {
        type: "blockquote",
        text: "Зах зээл богино хугацаанд санал хураах машин, урт хугацаанд жинлүүр.",
        cite: "— Benjamin Graham",
      },
      { type: "h2", id: "framework", text: "Framework" },
      {
        type: "p",
        text: "Бидний санал болгож буй framework нь дараах гурван багана дээр тулгуурлана. Энэ нь шинээр эхэлж буй болон туршлагатай хөрөнгө оруулагч аль алинд нь хэрэгтэй.",
      },
      {
        type: "ul",
        items: [
          "**Goal-based allocation** — зорилгод тулгуурласан хөрөнгийн хуваарилалт",
          "**Risk-adjusted return** — эрсдэлээр тохируулсан өгөөжийг хэмжих",
          "**Tax efficiency** — татварын үр ашигт хувилбарыг сонгох",
        ],
      },
      {
        type: "stat-row",
        stats: [
          { value: "73%", label: "Investors who beat market" },
          { value: "1.4%", label: "Average annual edge" },
          { value: "10y+", label: "Holding period" },
        ],
      },
      { type: "h2", id: "examples", text: "Worked examples" },
      {
        type: "p",
        text: "Доорх жишээнүүд бүгд бодит мэдээлэл дээр суурилсан, гэхдээ нэрс өөрчлөгдсөн. Эдгээр нь дунджаас илүү гэхээсээ илүү **түгээмэл** тохиолдлууд.",
      },
      {
        type: "callout",
        title: "Тэмдэглэл",
        text: "Энэ нь хөрөнгө оруулалтын зөвлөгөө биш, ерөнхий боловсролын мэдээлэл. Өөрийн нөхцөл байдалд нийцсэн зөвлөгөө авахын тулд зөвлөхтэйгөө уулзана уу.",
      },
      {
        type: "pullquote",
        text: "Хамгийн их өгөөж бус, хамгийн зөв өгөөж л чухал.",
      },
      { type: "h2", id: "takeaway", text: "Takeaway" },
      {
        type: "p",
        text: "Тэвчээр, зорилго, framework — энэ гурав л урт хугацааны амжилтын суурь. Дараагийн дугаарт бид энэ сэдвийн хоёрдугаар хэсгийг хүргэх болно.",
      },
    ],
  };
}

export function getBody(post: JournalPost): ArticleBody {
  return ARTICLE_BODIES[post.id] || getDefaultBody(post);
}
