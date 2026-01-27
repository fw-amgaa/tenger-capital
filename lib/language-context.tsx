"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "mn";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const savedLang = localStorage.getItem("language") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "mn")) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "mn" : "en";
    setLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  const t = (key: string): string => {
    const translation = translations[key];
    if (!translation) return key;
    return translation[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Translations object
const translations: Record<string, { en: string; mn: string }> = {
  // Hero Section
  "Established in 2007.": {
    en: "Established in 2007.",
    mn: "2007 онд үүсгэн байгуулагдсан.",
  },
  "One of top 3 securities as of 2026.": {
    en: "One of top 3 securities as of 2026.",
    mn: "Зах зээлд тэргүүлэгч ТОП-3 компанийн нэг",
  },
  "Raised over ₮300 Billion in 2025H2.": {
    en: "Raised over ₮300 Billion in 2025H2.",
    mn: "2025 оны 2 улиралд 300 гаруй тэрбум төгрөгийг татан төвлөрүүлсэн.",
  },
  "OPEN": {
    en: "OPEN",
    mn: "Нээх",
  },
  "SUBMIT YOUR PROJECT": {
    en: "SUBMIT YOUR PROJECT",
    mn: "Хамтран ажиллах",
  },
  "Create Value Through Investing": {
    en: "Create Value Through Investing",
    mn: "Хөрөнгө оруулалтаар үнэт зүйл, үнэ цэнийг бүтээнэ.",
  },
  "Underwriting | Brokerage | Wealth Management": {
    en: "Underwriting | Brokerage | Wealth Management",
    mn: "Андеррайтер | Брокер | Хөрөнгө оруулалтын зөвлөх",
  },

  // Brief Section
  "INSPIRED BY TENGER": {
    en: "INSPIRED BY TENGER",
    mn: "Тэнгэр Капиталын үнэт зүйлс",
  },
  "Inspired by Tenger": {
    en: "Inspired by Tenger",
    mn: "Тэнгэр Капиталын үнэт зүйлс",
  },
  "Integrity. Wisdom. Foresight.": {
    en: "Integrity. Wisdom. Foresight.",
    mn: "Ёс зүйтэй. Мэдлэгт суурилсан. Алсын хараатай",
  },
  "brief.description": {
    en: "From executing trades to structuring deals and managing wealth, Tenger Capital offers the expertise and clarity clients rely on. We turn questions into strategy and uncertainty into opportunity.",
    mn: "Тэнгэр Капитал үнэт цаасны компани нь харилцагчдадаа дэлхийн болон Монголын хөрөнгийн биржүүдийн арилжаанд оролцох, хөрөнгө оруулалт татан төвлөрүүлэх, өөрийн хөрөнгийг амжилттай удирдахад нь үнэнч туслагч нь байна. Бид асуудлыг шийдэл, асуултыг боломж болгоно.",
  },

  // Work With Us Section
  "Why Should You Work With Us?": {
    en: "Why Should You Work With Us?",
    mn: "Яагаад Тэнгэр Капитал ҮЦК ХХК-ийг сонгох ёстой вэ?",
  },
  "workwithus.stat1.title": {
    en: "The 2025 Growth shows that Tenger Capital is expanding rapidly, multiplied by 9.2x its transaction volume compared to it's previous year.",
    mn: "2025 онд Тэнгэр Капитал үнэт цаасны компанийн арилжааны гүйцэтгэл өнгөрсөн оны мөн үеийнхээс 9.2 дахин хурдацтай өсөв.",
  },
  "workwithus.stat2.title": {
    en: "Our Market Share in Primary Bond Issuance in 2025 covers 25% of the entire market.",
    mn: "2025 онд Тэнгэр Капитал үнэт цаасны компани нь бондын зах зээлийн арилжааны 25%-ийг гүйцэтгэв.",
  },
  "workwithus.stat3.title": {
    en: "Tenger Capital ranks second in 2025 Primary Bond Market with total volume of 379.2 Billion MNT.",
    mn: "2025 онд Тэнгэр Капитал үнэт цаасны компани нь бондын зах зээлээс 379.2 тэрбум төгрөгийн санхүүжилтийг татан төвлөрүүлсэн амжилтаар салбартаа 2-т эрэмбэлэгдэв.",
  },

  // Team Section
  "MEET THE TEAM": {
    en: "MEET THE TEAM",
    mn: "Манай хамт олон",
  },

  // Blogs Section
  "Our Thinking": {
    en: "Our Thinking",
    mn: "Бидний анхааралд",
  },
  "What's top of mind for our investment team": {
    en: "What's top of mind for our investment team",
    mn: "Шинжээчдийн таамаглал",
  },
  "EXPLORE OUR BLOG": {
    en: "EXPLORE OUR BLOG",
    mn: "Хамтдаа судлая",
  },

  // Partners Section
  "Partners": {
    en: "Partners",
    mn: "Манай харилцагчид",
  },

  // FAQ Section
  "Frequently Asked Questions": {
    en: "Frequently Asked Questions",
    mn: "Түгээмэл асуулт, хариулт",
  },
  "faq.q1": {
    en: "What is a security, and what types of securities can I invest in?",
    mn: "Хувьцаа гэж юу вэ? Ямар хувьцаанд хөрөнгө оруулах вэ?",
  },
  "faq.q2": {
    en: "How do I open a securities account, and how long does it take?",
    mn: "Үнэт цаасны дансыг хэрхэн нээх вэ? Данс нээгдэхэд хэр хугацаа орох вэ?",
  },
  "faq.q3": {
    en: "Who can open a securities account?",
    mn: "Үнэт цаасны дансыг хэн нээх вэ?",
  },
  "faq.q4": {
    en: "When can I trade, and can I place orders outside trading hours?",
    mn: "Арилжаанд хэрхэн оролцох вэ? Биржийн арилжааны цаг хаагдсан ч захиалга өгч болох уу?",
  },
  "faq.q5": {
    en: "How do bonds work, and what happens if I hold them until maturity?",
    mn: "Бонд гэж юу вэ? Бонд эзэмших хугацааг тодруулж өгөөч?",
  },
  "faq.q6": {
    en: "How do you protect client assets and personal information?",
    mn: "Харилцагчдын санхүү болон хувь хүний мэдээллийн аюулгүй байдлыг хэрхэн хангадаг вэ?",
  },
  "faq.q7": {
    en: "Do you provide investment advice or asset management support?",
    mn: "Өөрийн хөрөнгийг хэрхэн удирдах талаар зөвлөгөө өгдөг үү?",
  },

  // Footer Navigation
  "Home": {
    en: "Home",
    mn: "Нүүр хуудас",
  },
  "About": {
    en: "About",
    mn: "Бидний тухай",
  },
  "What We Offer": {
    en: "What We Offer",
    mn: "Бидний үйлчилгээ",
  },
  "Submit A Form": {
    en: "Submit A Form",
    mn: "Хүсэлт илгээх",
  },
  "OPEN AN ACCOUNT": {
    en: "OPEN AN ACCOUNT",
    mn: "Үнэт цаасны данс нээх",
  },

  // CTA Section
  "Every Money Question. One Trusted Team.": {
    en: "Every Money Question. One Trusted Team.",
    mn: "Таны асуулт бүрд Бид \"шийдэл\" өгнө.",
  },

  // Offerings Page
  "Our services.": {
    en: "Our services.",
    mn: "Бидний үйлчилгээ",
  },
  "What Tenger Capital will offer:": {
    en: "What Tenger Capital will offer:",
    mn: "Тэнгэр Капитал санал болгож байна.",
  },

  // Underwriting
  "Underwriting": {
    en: "Underwriting",
    mn: "Андеррайтын үйлчилгээ",
  },
  "Building value that lasts.": {
    en: "Building value that lasts.",
    mn: "Тасралтгүй өсөх хөрөнгө оруулалтын үнэ цэн",
  },
  "underwriting.description": {
    en: "Tenger Capital SC LLC provides end-to-end underwriting and capital-raising solutions for corporations and institutions, guiding clients through structuring, regulatory compliance, marketing, and distribution. We ensure efficient execution and help issuers raise capital confidently across domestic and private markets.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь төрийн болон хувийн хэвшлийн аж ахуйн нэгжүүдэд хөрөнгийн зах зээлээс санхүүжилт татах, зээлжих зэрэглэлээ ахиулах, хэлцэл зохион байгуулах, хөрөнгө оруулалтын багц бүрдүүлэх, санхүүгийн удирдлагын бодлогыг зөв удирдахад нь бүх төрлийн зөвлөх үйлчилгээг мэргэжлийн түвшинд үзүүлэхээс гадна хөрөнгийн зах зээлд гарахад нь зуучлан ажиллаж байна.",
  },
  "Debt Issuance": {
    en: "Debt Issuance",
    mn: "Бондын санхүүжилт",
  },
  "debt.description": {
    en: "We structure and execute debt offerings—from flexible OTC placements to MSE-listed bonds—and asset-backed securities. Our team manages structuring, due diligence, documentation, filings, and investor marketing, helping clients raise capital for expansion, refinancing, working capital, or development projects.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь нь засгийн газар болон орон нутгийн засаг захиргааны байгууллага, компаниудад хөрөнгийн зах зээлээс нээлттэй болон хаалттай хэлбэрээр бондын санхүүжилт татах замаар өртгөө бууруулах, мөнгөн урсгалын хөрвөх чадвараа нэмэгдүүлэхэд нь туслах үйлчилгээг санал болгож байна.",
  },
  "IPO & Equity Capital Markets": {
    en: "IPO & Equity Capital Markets",
    mn: "IPO хийх- Хувьцааны санхүүжилт",
  },
  "ipo.description": {
    en: "We guide companies through the IPO process on the Mongolian Stock Exchange, covering preparation, valuation, prospectus drafting, regulatory filings, underwriting, and investor outreach. Our support helps issuers engage markets effectively, build sustainable shareholder structures, and achieve long-term success.",
    mn: "Бид төрийн болон хувийн өмчит компаниудын хөгжлийг шинэ шатанд гаргах буюу Монголын Хөрөнгийн Бирж дээр анх удаа хувьцаагаа олон нийтэд нээлттэй санал болгох /IPO/ үйл явцыг мэргэжлийн өндөр түвшинд удирдан, хөрөнгө оруулагчдад санал болгон ажилладаг. Тухайн компанийн засаглал, өмчийн хэлбэр бүтэц, үйл ажиллагаа, санхүүгийн мэдээлэл олон нийтэд ил тод болох, урт хугацааны тогтвортой амжилтад хөтлөх гүүр нь болдог.",
  },
  "Mergers & Acquisitions": {
    en: "Mergers & Acquisitions",
    mn: "Компанийн нэгдэх, нийлүүлэх (M&A) үйлчилгээ",
  },
  "ma.description": {
    en: "We advise on buy-side and sell-side M&A, supporting target evaluation, due diligence, deal structuring, valuation, and execution. Our team ensures confidential, strategic guidance, helping clients secure favorable terms and achieve optimal transaction outcomes.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь аж ахуйн нэгжүүдийн үйл ажиллагаа болон санхүүгийн чадавхийг сайжруулах, шинэ инновац нэвтрүүлэх, өрсөлдөх чадвараа нэмэх, бизнесийн үнэ цэнээ өсгөхөд нь дэмжлэг үзүүлэх зорилготой нэгдэх, нийлэх хэлцлийг хийхэд мэргэжлийн зуучлагчийн үйлчилгээ үзүүлдэг.",
  },

  // Brokerage
  "Brokerage": {
    en: "Brokerage",
    mn: "Брокерийн үйлчилгээ",
  },
  "Stand solid. Stay liquid.": {
    en: "Stand solid. Stay liquid.",
    mn: "Тогтвортой. Хөрвөх чадвартай",
  },
  "brokerage.description": {
    en: "Tenger Capital SC LLC delivers dynamic, full-service brokerage solutions for both individual and institutional investors. We help you take control of your cash flows and put your capital to work with purpose. Powered by our research and advisory experts, you gain the insight and confidence to act decisively in today's fast-moving markets.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь хувь хүн болон байгууллагуудыг гадаад, дотоодын хөрөнгийн биржүүдийн арилжаанд оролцох, хувьцаа, бонд, үнэт метал зэрэг бүтээгдэхүүнээс сонголт хийх, хөрөнгө оруулалтын багц бүрдүүлэх, өөрийн мөнгөн хөрөнгийг зөв зохистой удирдахад нь дэмжлэг үзүүлэн ажиллаж байна. Манай мэргэшсэн шинжээчид хурдацтай өсөн тэлж буй хөрөнгийн зах зээлд оновчтой шийдвэр гаргахад тань туслах болно.",
  },
  "Domestic Exchange": {
    en: "Domestic Exchange",
    mn: "Монголын хөрөнгийн зах зээл",
  },
  "domestic.description": {
    en: "Investors can access the domestic primary and secondary markets through our online investment platform and mobile apps and manage their portfolios, track performance, and stay informed with market insights.",
    mn: "Хөрөнгө оруулагч нь Тэнгэр Капитал ҮЦК ХХК-ийн онлайн арилжааны платформ, гар утасны аппликейшнийг ашиглан тив дэлхийн хаана ч байсан хүссэн цагтаа МХБ болон дэлхийн хөрөнгийн биржүүдийн анхдагч болон хоёрдогч зах зээлийн арилжаанд оролцож, өөрийн дансны үлдэгдэл, гүйлгээ, өгөөжөө тооцох зэрэг давуу талтай.",
  },
  "Equities": {
    en: "Equities",
    mn: "Хувьцаа",
  },
  "Corporate bonds": {
    en: "Corporate bonds",
    mn: "Компанийн бонд",
  },
  "Government bonds": {
    en: "Government bonds",
    mn: "Засгийн газрын бонд",
  },
  "Asset-backed securities": {
    en: "Asset-backed securities",
    mn: "Хөрөнгөөр баталгаажсан үнэт цаас",
  },
  "Open your account": {
    en: "Open your account",
    mn: "Арилжаанд оролцох",
  },
  "International Markets": {
    en: "International Markets",
    mn: "Дэлхийн хөрөнгийн зах зээл",
  },
  "international.description": {
    en: "Investors can access 160 stock markets of over 35 countries. Invest globally in stocks, ETFs, options, futures, currencies and bonds through our partner Interactive Brokers' unified platform",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн харилцагчид дэлхийд алдартай Interactive Brokers платформыг ашиглаг 35 улсын 160 гаруй биржийн арилжаанд оролцож, хувьцаа, ETF, опцион, фьючерс, валют, Засгийн газрын болон комапийн бондод хөрөнгө оруулах боломжтой.",
  },
  "OTC market": {
    en: "OTC market",
    mn: "Биржийн бус зах зээл",
  },
  "otc.description": {
    en: "Investors can participate in the fastest growing capital market sector in Mongolia. We facilitate both sides of issuance and sales of private bonds with thorough due dilligence and integrity.",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн харилцагч нь Монголын хөрөнгийн зах зээлд хурдацтай өсөн тэлж буй Биржийн бус зах зээлийн /OTC/ арилжаанд оролцож, өндөр өгөөж хүртэх боломжтой. Бид тус зах зээлд Монголын ТОП ААН-үүдийг үнэт цаас гаргахад нь мэргэжлийн үйлчилгээ үзүүлэхээс гадна хөрөнгө оруулагчдын эрх ашгийг эрхэмлэн ажиллаж байна.",
  },

  // Wealth Management
  "Wealth & Asset Management": {
    en: "Wealth & Asset Management",
    mn: "Баялгийн удирдлага",
  },
  "Wealth Management": {
    en: "Wealth Management",
    mn: "Баялгийн удирдлага",
  },
  "Preserving wealth. Securing future.": {
    en: "Preserving wealth. Securing future.",
    mn: "Баялгийн сан. Насан туршийн баталгаа",
  },
  "wealth.description": {
    en: "Tenger Capital SC LLC delivers tailored wealth and asset management solutions designed to help clients grow, preserve, and strategically allocate their capital. Through disciplined portfolio management, in-house equity research, and a structured fund platform, we offer investment strategies that align with each client's risk appetite and long-term financial objectives.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь харилцагч бүрт тохирсон тусгай саналыг боловсруулж, харилцагчийн мөнгөн хөрөнгийг өсгөх, хадгалах, оновчтой хуваарилахад чиглэсэн хөрөнгийн удирдлагын цогц шийдлийг санал болгодог. Бид зорилгод суурилсан зөвлөгөө, судалгаанд тулгуурласан хөрөнгө оруулалт, ил тод тайлагналыг харилцагчдадаа санал болгож тогтвортой өсөлтийг бий болгоно.",
  },
  "Fund Management": {
    en: "Fund Management",
    mn: "Хөрөнгө оруулалтын сан",
  },
  "fund.description": {
    en: "We provide personalized fund and portfolio management tailored to each client's goals and risk appetite. Our team builds diversified portfolios—from conservative fixed-income to growth-oriented equity funds—while actively monitoring and adjusting allocations to stay aligned with market conditions and client objectives.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь харилцагч бүрийн зорилго, эрсдэлийн түвшинд нийцсэн хөрөнгө оруулалтын төрөлжсөн багцыг бүрдүүлэхийн зэрэгцээ зах зээлийн чиг хандлагыг соргогоор мэдэрч, хуваарилалтыг тогтмол хянах, шинэчлэх зэргээр мэргэжлийн түвшинд удирдан ажилладаг.",
  },
  "Equity&Market Research": {
    en: "Equity&Market Research",
    mn: "Судалгаа-Шинжилгээ",
  },
  "research.description": {
    en: "Our dedicated research unit delivers fundamental equity research, technical analyses, sector analyses, macroeconomic insights, and valuation assessments. These research capabilities form the backbone of our investment decisions, supporting portfolio construction, idea generation, and tactical market positioning.",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн судлаач, шинжээчдийн баг нь харилцагчдад хөрөнгө оруулалтын шийдвэр гаргахад нь дэмжлэг үзүүлэх үүднээс дэлхийн болон Монголын эдийн засаг, хөрөнгийн зах зээлийн чиг хандлага, өсөлттэй, салбар, компаниудын суурь болон техникийн шинжилгээ, үнэлгээ, судалгааг тогтмол гүйцэтгэдэг.",
  },

  // Why Choose Us (Offerings page)
  "offerings.whychoose.title": {
    en: "Why Should You Work With Us?",
    mn: "Яагаад Тэнгэр Капиталыг сонгох ёстой вэ?",
  },
  "offerings.underwriting.title": {
    en: "Underwriting",
    mn: "Андеррайтерийн үйлчилгээ",
  },
  "offerings.underwriting.desc": {
    en: "We turn big ideas into real capital — fast, structured, and market-ready. Your deal gets the clarity, reach, and execution it deserves.",
    mn: "Бид том санаануудыг бодит хөрөнгө болгож, үнэ цэнийг бүтээдэг.",
  },
  "offerings.brokerage.title": {
    en: "Brokerage",
    mn: "Брокерийн үйлчилгээ",
  },
  "offerings.brokerage.desc": {
    en: "Trade smarter with a team that actually knows you. Precision execution, real-time insights, and zero guesswork — just clean, confident moves.",
    mn: "Хөрөнгө оруулалтын ухаалаг шийдвэр гаргахад тань мэргэжлийн баг, хамт олон туслана. Таны захиалга бүрийг цаг хугацаатай уралдан гүйцэтгэнэ.",
  },
  "offerings.wealth.title": {
    en: "Wealth Management",
    mn: "Баялгийн удирдлага",
  },
  "offerings.wealth.desc": {
    en: "Your goals, engineered. Dedicated experts, tailored strategies, and smart guidance that makes every decision feel effortless.",
    mn: "Бид харилцагчдынхаа мөнгөн хөрөнгийг нарийвчилсан тооцоолол, зах зээлийн гүн судалгаатайгаар удирдаж, бодит өсөлт, тогтвортой ирээдүй рүү хөтлөнө.",
  },
};
