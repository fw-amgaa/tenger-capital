"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type Language = "en" | "mn";

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

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
  "Raised over ₮300 Billion in 2025.": {
    en: "Raised over ₮300 Billion in 2025.",
    mn: "2025 онд 300 гаруй тэрбум төгрөгийг татан төвлөрүүлсэн.",
  },
  OPEN: {
    en: "OPEN",
    mn: "Нээх",
  },
  "SUBMIT YOUR PROJECT": {
    en: "SUBMIT YOUR PROJECT",
    mn: "Хамтран ажиллах",
  },
  "Create Value Through Investing": {
    en: "Create Value Through Investing",
    mn: "Хөрөнгө оруулалтаар үнэ цэнийг бүтээнэ",
  },
  "Underwriting | Brokerage | Wealth Management": {
    en: "Underwriting | Brokerage | Wealth Management",
    mn: "Андеррайтер | Брокер | Хөрөнгө оруулалтын зөвлөх",
  },

  // Brief Section
  "INSPIRED BY TENGER": {
    en: "INSPIRED BY TENGER",
    mn: "Бидний үнэт зүйлс",
  },
  "Inspired by Tenger": {
    en: "Inspired by Tenger",
    mn: "Бидний үнэт зүйлс",
  },
  "Integrity.": {
    en: "Integrity.",
    mn: "Мэргэжлийн өндөр ёс зүй.",
  },
  "Wisdom.": {
    en: "Wisdom.",
    mn: "Нээлттэй мэдлэг.",
  },
  "Foresight.": {
    en: "Foresight.",
    mn: "Баялгийн хуримтлал",
  },

  // Brief carousel
  "Real-Time Data": {
    en: "Real-Time Data",
    mn: "Бодит цагийн мэдээлэл",
  },
  "brief.realtime.desc": {
    en: "Keep track with current market orders and prices of your MSE products.",
    mn: "МХБ-ийн арилжааны захиалга, бодит цагийн ханшийг харна.",
  },
  "Human Service": {
    en: "Human Service",
    mn: "Мэргэжлийн зөвлөгөө",
  },
  "brief.human.desc": {
    en: "All Tenger Capital clients have access to a dedicated wealth advisor.",
    mn: "Харилцагч бүрд тусгайлан үйлчлэх зөвлөх брокер ажиллана.",
  },
  "Monitor your Portfolio": {
    en: "Monitor your Portfolio",
    mn: "Багцаа хянах",
  },
  "brief.portfolio.desc": {
    en: "Your total portfolio including all your bonds and stocks in one place.",
    mn: "Бонд, хувьцаа зэрэг хөрөнгө оруулалтын багцын үлдэгдэл, өгөөжөө хянана.",
  },
  "For illustrative purposes only.": {
    en: "For illustrative purposes only.",
    mn: "Зөвхөн жишээ зорилгоор.",
  },

  // Offerings section
  "A DAY": {
    en: "A DAY",
    mn: "НЭГ ӨДӨР",
  },
  "A YEAR": {
    en: "A YEAR",
    mn: "НЭГ ЖИЛ",
  },
  "Markets move daily.": {
    en: "Markets move daily.",
    mn: "Зах зээл өдөр бүр хэлбэлздэг.",
  },
  "Your focus shouldn't.": {
    en: "Your focus shouldn't.",
    mn: "Таны анхаарал сарних ёсгүй.",
  },
  "We filter out the noise,": {
    en: "We filter out the noise,",
    mn: "Бид хязгааргүй үргэлжлэх",
  },
  "so you don't have to.": {
    en: "so you don't have to.",
    mn: "мэдээллийн урсгалаас зөвийг шүүнэ.",
  },
  "offerings.disclaimer": {
    en: "For illustrative purposes only; not representative of actual clients.",
    mn: "Зөвхөн жишээ зорилгоор; бодит харилцагчдыг төлөөлөхгүй.",
  },
  "Growth is not guaranteed": {
    en: "Growth is not guaranteed",
    mn: "Өсөлт баталгаатай биш",
  },
  "brief.description": {
    en: "From executing trades to structuring deals and managing wealth, Tenger Capital offers the expertise and clarity clients rely on. We turn questions into strategy and uncertainty into opportunity.",
    mn: "Тэнгэр Капитал үнэт цаасны компани нь харилцагчдадаа дэлхийн болон Монголын хөрөнгийн биржийн арилжаанд оролцох, хөрөнгө оруулалт татан төвлөрүүлэх, өөрийн хөрөнгийг амжилттай удирдахад нь үнэнч туслагч нь байна. Бид асуудлыг шийдэл, асуултыг боломж болгоно.",
  },

  // Work With Us Section
  "Why Should You Work With Us?": {
    en: "Why Should You Work With Us?",
    mn: "Яагаад Тэнгэр Капиталыг сонгох ёстой вэ?",
  },
  "workwithus.stat1.title": {
    en: "The 2025 Growth shows that Tenger Capital is expanding rapidly, multiplied by 9.2x its transaction volume compared to it's previous year.",
    mn: "2025 онд Тэнгэр Капитал компанийн арилжааны дүн 502.5% буюу 9.2 дахин хурдацтай өсөв.",
  },
  "workwithus.stat2.title": {
    en: "Our Market Share in Primary Bond Issuance in 2025 covers 25% of the entire market.",
    mn: "2025 онд Тэнгэр Капитал нь бондын зах зээлийн арилжааны 25%-ийг гүйцэтгэв.",
  },
  "workwithus.stat3.title": {
    en: "Tenger Capital ranks second in 2025 Primary Bond Market with total volume of 379.2 Billion MNT.",
    mn: "2025 онд Тэнгэр Капитал нь бондын зах зээлээс 379.2 тэрбум төгрөгийн санхүүжилтийг татан төвлөрүүлснээр салбартаа 2-т эрэмбэлэгдэв.",
  },

  // Team Section
  "MEET THE TEAM": {
    en: "MEET THE TEAM",
    mn: "Удирдлагын баг",
  },

  // Blogs Section
  "Our Thinking": {
    en: "Our Thinking",
    mn: 'Бид хөрөнгийн зах зээлийн хязгааргүй мэдээллээс "зөв"-ийг нь зөвлөнө.',
  },
  "What's top of mind for our investment team": {
    en: "What's top of mind for our investment team",
    mn: "Шинжээчдийн таамаглал",
  },
  "EXPLORE OUR BLOG": {
    en: "Explore our blog",
    mn: "Хамтдаа судлая",
  },

  // Partners Section
  Partners: {
    en: "Our partners",
    mn: "Манай харилцагчид",
  },
  "partners.subtitle": {
    en: "In partnership with Mongolia's top companies, we help drive large-scale national projects and contribute to our country's growth.",
    mn: "Бид Монголын шилдэг ААН-үүдтэй хамтран үндэсний хэмжээний томоохон төсөл хөтөлбөрүүдийг хэрэгжүүлэх замаар эх орныхоо хөгжилд өөрсдийн хувь нэмрээ оруулдаг.",
  },

  // FAQ Section
  "Frequently Asked Questions": {
    en: "Frequently Asked Questions",
    mn: "Түгээмэл асуулт, хариулт",
  },
  "faq.q1": {
    en: "What is a security, and what types of securities can I invest in?",
    mn: "Үнэт цаас гэж юу вэ? Хэрхэн хөрөнгө оруулах вэ?",
  },
  "faq.q2": {
    en: "How do I open a securities account, and how long does it take?",
    mn: "Үнэт цаасны дансыг хэрхэн нээх вэ? Данс нээгдэхэд хэр хугацаа орох вэ?",
  },
  "faq.q3": {
    en: "Who can open a securities account?",
    mn: "Хэн үнэт цаасны данс нээж болох вэ?",
  },
  "faq.q4": {
    en: "When can I trade, and can I place orders outside trading hours?",
    mn: "Хэрхэн арилжааны захиалга өгөх вэ? Биржийн арилжааны цаг хаагдсан ч захиалга өгч болох уу?",
  },
  "faq.q5": {
    en: "How do bonds work, and what happens if I hold them until maturity?",
    mn: "Бонд гэж юу вэ? Бонд эзэмших хугацааг тодруулж өгөөч?",
  },
  "faq.q6": {
    en: "How do you protect client assets and personal information?",
    mn: "Тухайн харилцагчийн санхүү болон хувь хүний мэдээллийн аюулгүй байдлыг хэрхэн хангадаг вэ?",
  },
  "faq.q7": {
    en: "Do you provide investment advice or asset management support?",
    mn: "Өөрийн хөрөнгийг хэрхэн удирдах талаар зөвлөгөө өгдөг үү?",
  },

  // Footer Navigation
  Home: {
    en: "Home",
    mn: "Нүүр хуудас",
  },
  About: {
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
  LOGIN: {
    en: "LOG IN",
    mn: "АРИЛЖААНД ОРОЛЦОХ",
  },
  "OPEN AN ACCOUNT": {
    en: "OPEN AN ACCOUNT",
    mn: "ДАНС НЭЭХ",
  },

  // CTA Section
  "Every Money Question.": {
    en: "Every Money Question.",
    mn: "Таны асуудал бүрд",
  },
  "One Trusted Team.": {
    en: "One Trusted Team.",
    mn: "бид шийдэл санал болгоно.",
  },

  // Offerings Page
  "Our services.": {
    en: "Our services.",
    mn: "Бидний үйлчилгээ.",
  },
  "What Tenger Capital will offer:": {
    en: "What Tenger Capital will offer:",
    mn: "Тэнгэр Капитал санал болгож байна.",
  },

  // Underwriting
  Underwriting: {
    en: "Underwriting",
    mn: "Андеррайтерын үйлчилгээ",
  },
  "Building value that lasts.": {
    en: "Building value that lasts.",
    mn: "Тасралтгүй өсөх үнэ цэн",
  },
  "underwriting.description": {
    en: "Tenger Capital SC LLC provides end-to-end underwriting and capital-raising solutions for corporations and institutions, guiding clients through structuring, regulatory compliance, marketing, and distribution. We ensure efficient execution and help issuers raise capital confidently across domestic and private markets.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь төр, хувийн хэвшлийн ААН-үүдэд хөрөнгийн зах зээлээс санхүүжилт татах, зээлжих зэрэглэлээ ахиулах, хэлцэл зохион байгуулах, хөрөнгө оруулалтын багц бүрдүүлэх, санхүүгийн удирдлагын бодлогыг хэрэгжүүлэхэд нь бүх төрлийн зөвлөх үйлчилгээг мэргэжлийн өндөр түвшинд үзүүлдэг.",
  },
  "Debt Issuance": {
    en: "Debt Issuance",
    mn: "Бондын санхүүжилт",
  },
  "debt.description": {
    en: "We structure and execute debt offerings—from flexible OTC placements to MSE-listed bonds—and asset-backed securities. Our team manages structuring, due diligence, documentation, filings, and investor marketing, helping clients raise capital for expansion, refinancing, working capital, or development projects.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь Монгол Улсын засгийн газар, засаг захиргааны байгууллага, компаниудад хөрөнгийн зах зээлээс нээлттэй, хаалттай хэлбэрээр бондын санхүүжилт татах, өртгөө бууруулах, мөнгөн урсгалын хөрвөх чадвараа нэмэхэд нь зориулсан үйлчилгээг үзүүлдэг.",
  },
  "IPO & Equity Capital Markets": {
    en: "IPO & Equity Capital Markets",
    mn: "IPO-Хувьцааны санхүүжилт",
  },
  "ipo.description": {
    en: "We guide companies through the IPO process on the Mongolian Stock Exchange, covering preparation, valuation, prospectus drafting, regulatory filings, underwriting, and investor outreach. Our support helps issuers engage markets effectively, build sustainable shareholder structures, and achieve long-term success.",
    mn: "Бид төр, хувийн хэвшлийн компаниудыг Монголын Хөрөнгийн Бирж дээр хувьцаагаа анх удаа олон нийтэд нээлттэй санал болгох /IPO/ ажлыг мэргэжлийн өндөр түвшинд удирдан, хөрөнгө оруулагчдад санал болгох замаар урт хугацааны тогтвортой өсөлтөд хөтлөн ажилладаг.",
  },
  "Mergers & Acquisitions": {
    en: "Mergers & Acquisitions",
    mn: "Компанийг нэгдэх, нийлүүлэх (M&A) үйлчилгээ",
  },
  "ma.description": {
    en: "We advise on buy-side and sell-side M&A, supporting target evaluation, due diligence, deal structuring, valuation, and execution. Our team ensures confidential, strategic guidance, helping clients secure favorable terms and achieve optimal transaction outcomes.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь ААН-үүдийн үйл ажиллагаа, санхүүгийн чадавхийг сайжруулах, шинэ инновац нэвтрүүлэх, өрсөлдөх чадвар, бизнесийн үнэ цэнээ өсгөхөд нь дэмжлэг үзүүлэх зорилгоор компаниудын нэгдэх, нийлэх хэлцлийг мэргэжлийн зуучлагчийн хувьд чанартай гүйцэтгэдэг.",
  },

  // Brokerage
  Brokerage: {
    en: "Brokerage",
    mn: "Брокерын үйлчилгээ",
  },
  "Stand solid.": {
    en: "Stand solid.",
    mn: "Тогтвортой.",
  },
  "Stay liquid.": {
    en: "Stay liquid.",
    mn: "Хөрвөх чадвартай",
  },
  "brokerage.description": {
    en: "Tenger Capital SC LLC delivers dynamic, full-service brokerage solutions for both individual and institutional investors. We help you take control of your cash flows and put your capital to work with purpose. Powered by our research and advisory experts, you gain the insight and confidence to act decisively in today's fast-moving markets.",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн мэргэшсэн хамт олны зүгээс хувь хүн, ААН-үүдийг дэлхийн болон Монголын хөрөнгийн биржүүдийн арилжаанд оролцох, хөрөнгө оруулалтын багц бүрдүүлэх, өөрийн мөнгөн хөрөнгийг оновчтой удирдахад нь луужин болон ажилладаг.",
  },
  "Domestic Exchange": {
    en: "Domestic Exchange",
    mn: "Монголын хөрөнгийн зах зээл",
  },
  "domestic.description": {
    en: "Investors can access the domestic primary and secondary markets through our online investment platform and mobile apps and manage their portfolios, track performance, and stay informed with market insights.",
    mn: "Эрхэм та манай онлайн арилжааны платформ, гар утасны аппликейшныг ашиглан тив дэлхийн хаана ч байсан хүссэн үедээ МХБ болон дэлхийн хөрөнгийн биржүүдийн анхдагч болон хоёрдогч зах зээлийн арилжаанд оролцож, өөрийн дансны үлдэгдэл, гүйлгээ, өгөөж зэргийг тооцох давуу талтай.",
  },
  Equities: {
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
    mn: "АРИЛЖААНД ОРОЛЦОХ",
  },
  "International Markets": {
    en: "International Markets",
    mn: "Дэлхийн хөрөнгийн зах зээл",
  },
  "international.description": {
    en: "Investors can access 160 stock markets of over 35 countries. Invest globally in stocks, ETFs, options, futures, currencies and bonds through our partner Interactive Brokers' unified platform",
    mn: "Эрхэм та дэлхийд алдартай Interactive Brokers платформыг ашиглан 35 улсын 160 гаруй биржийн арилжаанд оролцож, хувьцаа, ETF, опцион, фьючерс, валют, Засгийн газрын болон компанийн бондод хөрөнгө оруулах боломжтой.",
  },
  "OTC market": {
    en: "OTC market",
    mn: "Биржийн бус зах зээл",
  },
  "otc.description": {
    en: "Investors can participate in the fastest growing capital market sector in Mongolia. We facilitate both sides of issuance and sales of private bonds with thorough due dilligence and integrity.",
    mn: "Бид Монголын ТОП ААН-үүдийг Биржийн бус зах зээлд /OTC/ үнэт цаас гаргаж, хөрөнгө оруулалт татахад нь мэргэжлийн өндөр түвшний үйлчилгээ үзүүлэхээс гадна өндөр өгөөж хүртэх боломжийг харилцагчдадаа олгодог.",
  },

  // Wealth Management
  "Wealth & Asset Management": {
    en: "Wealth & Asset Management",
    mn: "Хөрөнгийн удирдлага",
  },
  "Wealth Management": {
    en: "Wealth Management",
    mn: "Хөрөнгийн удирдлага",
  },
  "Preserving wealth.": {
    en: "Preserving wealth.",
    mn: "Баялгийн сан.",
  },
  "Securing future.": {
    en: "Securing future.",
    mn: "Насан туршийн баталгаа",
  },
  "wealth.description": {
    en: "Tenger Capital SC LLC delivers tailored wealth and asset management solutions designed to help clients grow, preserve, and strategically allocate their capital. Through disciplined portfolio management, in-house equity research, and a structured fund platform, we offer investment strategies that align with each client's risk appetite and long-term financial objectives.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь харилцагчийн мөнгөн хөрөнгийг өсгөх, оновчтой хуваарилахад нь чиглэсэн хөрөнгийн удирдлагын цогц бодлогыг хэрэгжүүлдэг. Бид харилцагч бүрийн зорилгод суурилсан зөвлөгөө, судалгаанд тулгуурласан хөрөнгө оруулалтын санал, ил тод тайлагналыг санал болгож, тогтвортой өсөлтийг бий болгоно.",
  },
  "Fund Management": {
    en: "Fund Management",
    mn: "Хөрөнгө оруулалтын сан",
  },
  "fund.description": {
    en: "We provide personalized fund and portfolio management tailored to each client's goals and risk appetite. Our team builds diversified portfolios—from conservative fixed-income to growth-oriented equity funds—while actively monitoring and adjusting allocations to stay aligned with market conditions and client objectives.",
    mn: "Тэнгэр Капитал ҮЦК ХХК нь зах зээлийн чиг хандлагыг соргогоор мэдэрч, харилцагч бүрийн зорилго, эрсдэлийн түвшинд нийцсэн хөрөнгө оруулалтын төрөлжсөн багцыг мэргэжлийн түвшинд бүрдүүлэн ажилладаг.",
  },
  "Equity&Market Research": {
    en: "Equity&Market Research",
    mn: "Судалгаа-Шинжилгээ",
  },
  "research.description": {
    en: "Our dedicated research unit delivers fundamental equity research, technical analyses, sector analyses, macroeconomic insights, and valuation assessments. These research capabilities form the backbone of our investment decisions, supporting portfolio construction, idea generation, and tactical market positioning.",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн мэргэшсэн шинжээчдийн баг нь харилцагчдад хөрөнгө оруулалтын оновчтой шийдвэр гаргахад нь дэмжлэг үзүүлэх үүднээс дэлхийн болон Монголын эдийн засаг, хөрөнгийн зах зээлийн чиг хандлага, өсөлттэй, салбар, компаниудын бүх төрлийн судалгааг тогтмол гүйцэтгэдэг.",
  },

  // Why Choose Us (Offerings page)
  "offerings.whychoose.title": {
    en: "Why Should You Work With Us?",
    mn: "Яагаад Тэнгэр Капиталыг сонгох ёстой вэ?",
  },
  "offerings.underwriting.title": {
    en: "Underwriting",
    mn: "Андеррайтерын үйлчилгээ",
  },
  "offerings.underwriting.desc": {
    en: "We turn big ideas into real capital — fast, structured, and market-ready. Your deal gets the clarity, reach, and execution it deserves.",
    mn: "Бид цаасан дээрх шинэ санаа, төсөл хөтөлбөрийг бодитоор хэрэгжүүлж, үнэ цэнийг бүтээдэг.",
  },
  "offerings.brokerage.title": {
    en: "Brokerage",
    mn: "Брокерын үйлчилгээ",
  },
  "offerings.brokerage.desc": {
    en: "Trade smarter with a team that actually knows you. Precision execution, real-time insights, and zero guesswork — just clean, confident moves.",
    mn: "Бид таныг хөрөнгө оруулалтын оновчтой шийдвэр гаргахад тань мэргэжлийн дэмжлэг үзүүлэхээс гадна цаг хугацаатай уралдан гүйцэтгэнэ.",
  },
  "offerings.wealth.title": {
    en: "Wealth Management",
    mn: "Хөрөнгийн удирдлага",
  },
  "offerings.wealth.desc": {
    en: "Your goals, engineered. Dedicated experts, tailored strategies, and smart guidance that makes every decision feel effortless.",
    mn: "Бид таны мөнгөн хөрөнгийг зах зээлийн гүн судалгаа, нарийвчилсан тооцоонд үндэслэн удирдаж, бодит өсөлт, тогтвортой ирээдүй рүү хөтлөнө.",
  },

  // About Page - Hero
  "Founded on Integrity.": {
    en: "Founded on Integrity.",
    mn: "Шударга, ёс зүйтэй",
  },
  "Focused on Your Future.": {
    en: "Focused on Your Future.",
    mn: "Ирээдүйг бид бүтээнэ.",
  },

  // About Page - Letter from CEO
  "Letter from CEO": {
    en: "Letter from CEO",
    mn: "Гүйцэтгэх захирлын мэндчилгээ",
  },
  "ceo.letter": {
    en: '"As CEO, I founded this company with a simple belief: everyone deserves access to clear, reliable guidance when it comes to building their wealth. Too many people feel overwhelmed by financial decisions, and our mission is to change that. We combine proven strategies with a modern, client-first approach so you can move forward with confidence and clarity."',
    mn: 'Тэнгэр Капитал ҮЦК ХХК нь 2007 онд үүсгэн байгуулагдсан бөгөөд 19 жилийн түүхэн замналтай компани юм.\nБид 2025 онд "Хүн бүрийн хөрөнгийг өсгөх зам ойлгомжтой, найдвартай, зөв чиглэлтэй байх ёстой" гэсэн суурь зарчимд үндэслэн компанийн стратеги, засаглал, удирдлагын баг, бүтцийг бүрэн шинэчилснээр үйл ажиллагаагаа шинэ түвшинд гаргаад байна.\nТус шинэчлэлийн хүрээнд бид богино хугацаанд буюу 2025 оны 2 дугаар хагаст нийт 300 гаруй тэрбум төгрөгийг амжилттай татан төвлөрүүлснээс гадна арилжааны гүйцэтгэл 502.5% буюу 9.2 дахин өсөж, салбартаа тэргүүлэгч ТОП-3 компанийн нэгэнд зүй ёсоор тооцогдож байна.\nМанай хамт олон нь төр, хувийн хэвшлийн ААН-үүдийг хөрөнгийн зах зээлд амжилттай нэвтрэх, санхүүжилт татахад нь бүх төрлийн зөвлөх үйлчилгээг үзүүлэхээс гадна харилцагч бүрийн зорилгод нийцсэн тусгай шийдэл бүхий хөрөнгийн удирдлагын цогц үйлчилгээг санал болгон ажилладаг.\nБид харилцагч, айл өрх бүрийн өнөөдрийн хөрөнгийг маргаашийн үнэ цэнтэй хуримтлал болгон өсгөх замаар эдийн засгийн тогтвортой өсөлтийг бий болгож, эх орныхоо хөгжилд бодит хувь нэмрээ оруулахыг зорьдог билээ.\nЦаашид ч бид үйл ажиллагааныхаа бүхий л түвшинд харилцагчийн эрх ашгийг дээдэлсэн, мэргэжлийн ёс зүйтэй, хариуцлагатай, тогтвортой гүйцэтгэлийг тууштай хэрэгжүүлэн ажиллах болно гэдгээ илэрхийлэхэд таатай байна.',
  },
  "ceo.regards": {
    en: "Respectfully,",
    mn: "Хүндэтгэсэн:",
  },
  "ceo.name": {
    en: "Ts. Gombodorj",
    mn: "Ц.Гомбодорж",
  },
  "ceo.title": {
    en: "CEO of Tenger Capital SC LLC",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн Гүйцэтгэх захирал",
  },

  // About Page - Key Figures
  "Trusted by Clients Worldwide": {
    en: "Trusted by Clients Worldwide",
    mn: "Амжилтын товчоон",
  },
  "keyfigures.subtitle": {
    en: "Building wealth through expertise, innovation, and unwavering commitment to excellence",
    mn: "Өндөр мэдлэг, мэргэжлийн туршлага, гүйцэтгэлийн өндөр стандарт, оновчтой шийдлийг санал болгох замаар хөрөнгө оруулалтын цэнтэй ирээдүйг бүтээнэ.",
  },
  "Billion raised in 2025H1": {
    en: "Billion raised in 2025H1",
    mn: "2025 онд татан төвлөрүүлсэн санхүүжилт",
  },
  "Institutional and HNW clients": {
    en: "Institutional and HNW clients",
    mn: "Институци, мэргэжлийн хөрөнгө оруулагч",
  },
  "Years of Experience": {
    en: "Years of Experience",
    mn: "жилийн туршлага",
  },
  "Client Retention Rate": {
    en: "Client Retention Rate",
    mn: "Идэвхтэй хөрөнгө оруулагч",
  },
  "Retail Clients": {
    en: "Retail Clients",
    mn: "Харилцагч",
  },

  // About Page - Guiding Principles
  "Guiding Principles": {
    en: "Guiding Principles",
    mn: "Бидний зарчим",
  },
  "Client First": {
    en: "Client First",
    mn: "Нэн тэргүүнд харилцагчийн эрх ашиг",
  },
  "clientfirst.desc": {
    en: "We place our clients at the heart of everything we do. Every strategy, every decision, and every recommendation is crafted with your unique financial goals and risk tolerance in mind. Your trust drives our commitment to excellence.",
    mn: "Бид үйл ажиллагааныхаа бүхий л түвшинд харилцагчийнхаа эрх ашгийг эрхэмлэн ажилладаг. Тэнгэр Капитал ҮЦК ХХК-ийн алсын хараа, эрхэм зорилго, бодлого шийдвэр нь харилцагчийн эрх ашиг, зорилгод нийцэхээс гадна эрсдэлээс сэргийлэхэд чиглэдэг.",
  },
  "Transparent Integrity": {
    en: "Transparent Integrity",
    mn: "Ёс зүйтэй, ил тод",
  },
  "transparentintegrity.desc": {
    en: "We believe in complete transparency and unwavering integrity. From fee structures to investment strategies, we ensure you have full visibility into how we manage your wealth. No hidden agendas, just honest guidance you can rely on.",
    mn: "Бид Монгол Улсад хүчин төгөлдөр үйлчилж буй холбогдох хууль тогтоомж, бодлого шийдвэрийг чандлан сахихын зэрэгцээ аливаа ашиг сонирхлын зөрчлөөс ангид байж, найдвартай, нээлттэй, ил тод үйл ажиллагааг явуулдаг.",
  },
  "Productive Capital": {
    en: "Productive Capital",
    mn: "Үнэ цэнтэй хөрөнгө оруулалт",
  },
  "productivecapital.desc": {
    en: "We believe capital should deliver measurable value. Through disciplined structuring, efficient execution, and prudent risk management, we ensure each transaction supports issuers and investors while contributing to the long-term development of Mongolia's capital markets.",
    mn: "Бид үнэт цаас гаргагч болон хөрөнгө оруулагчдын эрх ашигт нийцсэн, бодит өгөөж, хэмжигдэхүйц үнэ цэнийг бүтээх оновчтой шийдлийг хэрэгжүүлэх замаар Монголын хөрөнгийн зах зээлийн хөгжилд хувь нэмрээ оруулан ажиллаж байна.",
  },
  "Long-Term Partnership": {
    en: "Long-Term Partnership",
    mn: "Урт хугацааны түншлэл",
  },
  "longtermpartnership.desc": {
    en: "We're not just executing trades—we're building lasting relationships. Our approach focuses on sustainable, long-term growth for issuers and investors alike. From structuring deals to navigating market shifts, we're here for every milestone, adapting strategies as your goals evolve.",
    mn: "Бид үнэт цаас гаргагч, хөрөнгө оруулагчдыг холбох гүүр нь байх зорилтынхоо хүрээнд аливаа хамтын ажиллагааны эхлэлээс төгсгөл хүртэлх бүхий л цаг хугацаанд өндөр итгэлцэл, тогтвортой өсөлтийг эрхэмлэсэн урт хугацааны түншлэлийн харилцааг бэхжүүлэн ажилладаг.",
  },

  // About Page - Personalized Service
  "Personalized service": {
    en: "Personalized service",
    mn: "Зөвхөн танд зориулсан үйлчилгээ",
  },
  "A service as individual as you are": {
    en: "A service as individual as you are",
    mn: "Таны зорилгод нийцсэн үйлчилгээ",
  },
  "personalized.desc": {
    en: "Every client receives individualized attention from a dedicated broker and analyst, ensuring you always have experts on hand to answer questions and navigate every financial decision with confidence.",
    mn: "Манай мэргэжлийн баг хамт олон зөвхөн танд зориулсан үйлчилгээг үзүүлэхээс гадна хөрөнгийн зах зээлийн мэдлэг, мэдээллээр тогтмол хангаж, ухаалаг шийдвэр гаргахад тань туслах болно.",
  },

  // About Page - Timeline
  "Changelog from our journey": {
    en: "Changelog from our journey",
    mn: "Бидний бахархал",
  },
  // Timeline 2007
  "timeline.2007.songdo": {
    en: "- USD 15.3 million equity financing in the healthcare sector",
    mn: "- Улаанбаатар Сонгдо эмнэлэг: 15.3 сая ам.доллар (хувьцааны санхүүжилт)",
  },
  "timeline.2007.gemnet": {
    en: "- USD 14.0 million debt financing in the information technology sector",
    mn: "- Gemnet: 14 сая ам.доллар (өрийн санхүүжилт)",
  },
  "timeline.2007.premium": {
    en: "- MNT 30.0 billion merger and consolidation in the cement industry",
    mn: "- Premium Concrete: 30.0 тэрбум төгрөг (нэгдэл)",
  },
  "timeline.2007.master1": {
    en: "- MNT 2.0 billion corporate bond issuance in the real estate sector",
    mn: "- Master Group: 2.0 тэрбум төгрөг",
  },
  "timeline.2007.master2": {
    en: "- USD 10.0 million project financing in the real estate sector",
    mn: "- 10.0 сая ам.доллар (төслийн санхүүжилт)",
  },
  "timeline.2007.tenger1": {
    en: "- MNT 6.0 billion merger and consolidation in the insurance sector",
    mn: "- Тэнгэр даатгал ХХК: 6.0 тэрбум төгрөг (нэгдэл)",
  },
  "timeline.2007.tenger2": {
    en: "- MNT 2.5 billion liquidation and asset disposal transaction in the mining sector",
    mn: "- Уул уурхайн салбар: 2.5 тэрбум төгрөг (нөхөн олговор)",
  },
  // Timeline 2023 Q3
  "timeline.2023q3.lendmn": {
    en: "Served as Co-Underwriter for LendMN NBFI JSC's public bond issuance, successfully raising MNT 3.0 billion.",
    mn: "LendMN ББСБ ХК: 3.0 тэрбум төгрөг (туслах андеррайтер)",
  },
  "timeline.2023q3.agro": {
    en: "Acting as Underwriter, successfully placed a MNT 2.5 billion OTCly offered bond of Agro World LLC, an early-stage industrial company, to professional investors on the OTC market.",
    mn: "Agro World ХХК: 2.5 тэрбум төгрөг (OTC)",
  },
  // Timeline 2023 Q4
  "timeline.2023q4.lendmn": {
    en: "Worked as Lead Underwriter for LendMN NBFI JSC's MNT 5.0 billion OTC debt instrument; successfully placed MNT 3.0 billion in 2023, with the remaining MNT 2.0 billion placed in early 2024 through a blockchain-based platform under the Sandbox regulatory framework.",
    mn: "LendMN ББСБ ХК: 5.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2023q4.bumbiin": {
    en: "Served as Lead Underwriter for Bumbiin Shovkh LLC's MNT 20.0 billion OTC bond. As of March 2024, the full amount was raised and repayment completed. Proceeds supported the completion of a mixed-use residential and commercial development project.",
    mn: "Бумбын шовх ХХК: 20.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2023q4.health": {
    en: "Provided advisory services on a MNT 40.0 billion debt restructuring transaction for a private healthcare company, including financial modeling and business / equity valuation.",
    mn: "Эрүүл мэндийн компани: 40.0 тэрбум төгрөг (ХБҮЦ)",
  },
  // Timeline 2024 Q1
  "timeline.2024q1.gsb": {
    en: "Acted as Lead Underwriter for GSB Capital NBFI's MNT 20.0 billion OTC debt instrument; completed repayment in 2025 Q1.",
    mn: "GSB Capital ББСБ: 20.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2024q1.lendmn": {
    en: "Served as Lead Underwriter for LendMN NBFI JSC on a MNT 20.0 billion OTC bond issuance and successfully raised MNT 15.0 billion, the maximum amount permitted by the Financial Regulatory Commission as of 2024 Q4.",
    mn: "LendMN ББСБ ХК: 15.0 тэрбум төгрөг (OTC)",
  },
  // Timeline 2024 Q2
  "timeline.2024q2.dem": {
    en: "Acted as Lead Underwriter for Developing Entrepreneurial Mongolia NBFI LLC on a MNT 2.7 billion OTC bond issuance; full proceeds were raised repayment completed in 2024 Q3.",
    mn: "Developing Entrepreneurial Mongolia ББСБ: 2.7 тэрбум төгрөг (OTC)",
  },
  "timeline.2024q2.platin": {
    en: "Worked as Underwriter for Platin City LLC's MNT 1.5 billion OTC bond, successfully raising the full amount. Proceeds support real-estate dealership operations, improving liquidity for property buyers and sellers.",
    mn: "Platin City ХХК: 1.5 тэрбум төгрөг (OTC)",
  },
  // Timeline 2024 Q4
  "timeline.2024q4.shunkhlai": {
    en: "Participated as Co-Underwriter for Shunkhlai LLC's MNT 80.0 billion public bond issuance, successfully raising MNT 15.0 billion.",
    mn: "Шунхлай ХК: 15.0 тэрбум төгрөг (туслах андеррайтер)",
  },
  // Timeline 2025 Q1
  "timeline.2025q1.abts": {
    en: "Acted as Underwriter for ABTS NBFI LLC, a Japanese-invested company, successfully raising a MNT 1.6 billion OTC bond.",
    mn: "ABTS ББСБ: 1.6 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q1.khan": {
    en: "Served as Underwriter for Khan-Altai Resource LLC's MNT 20.0 billion OTC bond, fully raising the entire amount.",
    mn: "Хан Алтай ХХК: 20.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q1.premier": {
    en: "Worked as Underwriter for Premier Investment Group LLC on a MNT 10.0 billion OTC bond issuance, successfully raising the funds.",
    mn: "Примьер инвэстмент ХХК: 10.0 тэрбум төгрөг (OTC)",
  },
  // Timeline 2025 Q2
  "timeline.2025q2.bers": {
    en: "Served as Lead Underwriter for Bers Finance NBFI LLC's MNT 5.0 billion OTC debt instrument.",
    mn: "Бэрс Финанс ББСБ: 5.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q2.eco": {
    en: "Acted as Lead Underwriter for Eco Car Center LLC's MNT 9.5 billion OTC debt instrument.",
    mn: "Eco Car Center ХХК: 9.5 тэрбум төгрөг (OTC, ХБҮЦ)",
  },
  "timeline.2025q2.munkhiin": {
    en: "Acted as Lead Underwriter for Munkhiin Useg LLC's MNT 3.5 billion OTC bond, successfully raising MNT 3.2 billion.",
    mn: "Мөнхийн үсэг ХХК: 3.2 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q2.alliance": {
    en: "Served as Lead Underwriter for Alliance Capital NBFI LLC's MNT 1.6 billion OTC bond.",
    mn: "Альянс Капитал ББСБ: 1.6 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q2.mongolalt": {
    en: "Worked as Lead Underwriter for Mongol Alt LLC's MNT 6.0 billion OTC bond.",
    mn: "Монгол Алт ХХК: 6.0 тэрбум төгрөг (OTC)",
  },
  // Timeline 2025 Q3
  "timeline.2025q3.bichil": {
    en: "Acted as Lead Underwriter for Bichil Globus BZG LLC's MNT 10.0 billion OTC debt instrument.",
    mn: "Бичил Глобус БЗГ ХХК: 10.0 тэрбум төгрөг (OTC, ХБҮЦ)",
  },
  "timeline.2025q3.monblox": {
    en: "Served as Lead Underwriter for Mon Blox LLC's MNT 3.0 billion OTC bond, successfully raising MNT 3.0 billion.",
    mn: "Мон Блокс ХХК: 3.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q3.westhill": {
    en: "Worked as Lead Underwriter for West Hill LLC's MNT 2.0 billion OTC bond.",
    mn: "Вэст Хилл ХХК: 2.0 тэрбум төгрөг (OTC)",
  },
  "timeline.2025q3.finco": {
    en: "Acted as Lead Underwriter for Finco Capital NBFI LLC's MNT 3.0 billion OTC bond.",
    mn: "Finco Capital ББСБ: 3.0 тэрбум төгрөг (OTC)",
  },

  // Offerings Page header
  "Our services.page": {
    en: "Our services.",
    mn: "Бидний үйлчилгээ.",
  },

  // About page
  "About us": {
    en: "About us",
    mn: "Бидний тухай",
  },

  // Team member names
  "Gombodorj Nyamtogtokh": {
    en: "Gombodorj Nyamtogtokh",
    mn: "Нямтогтох Гомбодорж",
  },
  "Darkhanbayar Radnaa-Ochir": {
    en: "Darkhanbayar Radnaa-Ochir",
    mn: "Раднаа-Очир Дарханбаяр",
  },
  "Lkhamsuren Boldbaatar": {
    en: "Lkhamsuren Boldbaatar",
    mn: "Болдбаатар Лхамсүрэн",
  },
  "Dashnyam Sanduijav": {
    en: "Dashnyam Sanduijav",
    mn: "Сандуйжав Дашням",
  },
  "Byambatogoo Davaasuren": {
    en: "Byambatogoo Davaasuren",
    mn: "Даваасүрэн Бямбатогоо",
  },
  "Bilguun Ganbaatar": {
    en: "Bilguun Ganbaatar",
    mn: "Ганбаатар Билгүүн",
  },

  // Team member roles
  "Chief Executive Officer": {
    en: "Chief Executive Officer",
    mn: "Гүйцэтгэх захирал",
  },
  "Tenger Capital LLC": {
    en: "Tenger Capital",
    mn: "Тэнгэр Капитал ҮЦК ХХК",
  },
  "Tenger Fund Management": {
    en: "Tenger Fund Management",
    mn: "Тэнгэр фанд менежмент ХХК",
  },
  "Chief Financial and Operating Officer": {
    en: "Chief Financial and Operating Officer",
    mn: "Санхүү үйл ажиллагааны газрын захирал",
  },
  "Chief Investment Officer": {
    en: "Chief Investment Officer",
    mn: "Хөрөнгө оруулалтын газрын захирал",
  },
  "Chief Marketing Officer": {
    en: "Chief Marketing Officer",
    mn: "Маркетингийн газрын захирал",
  },
  "Chief Trade Officer": {
    en: "Chief Trade Officer",
    mn: "Арилжааны газрын захирал",
  },
  "Broker & Office Manager": {
    en: "Broker & Office Manager",
    mn: "Брокер, Оффисын менежер",
  },
  Broker: {
    en: "Broker",
    mn: "Брокер",
  },
  "Marketing Manager": {
    en: "Marketing Manager",
    mn: "Маркетингийн менежер",
  },
  Analyst: {
    en: "Analyst",
    mn: "Шинжээч",
  },
  Accountant: {
    en: "Accountant",
    mn: "Нягтлан бодогч",
  },
  Driver: {
    en: "Driver",
    mn: "Жолооч",
  },

  // Timeline titles
  "2023 Q3": {
    en: "2023 Q3",
    mn: "2023 3 улиралд",
  },
  "2023 Q4": {
    en: "2023 Q4",
    mn: "2023 4 улиралд",
  },
  "2024 Q1": {
    en: "2024 Q1",
    mn: "2024 1 улиралд",
  },
  "2024 Q2": {
    en: "2024 Q2",
    mn: "2024 2 улиралд",
  },
  "2024 Q4": {
    en: "2024 Q4",
    mn: "2024 4 улиралд",
  },
  "2025 Q1": {
    en: "2025 Q1",
    mn: "2025 1 улиралд",
  },
  "2025 Q2": {
    en: "2025 Q2",
    mn: "2025 2 улиралд",
  },
  "2025 Q3": {
    en: "2025 Q3",
    mn: "2025 3 улиралд",
  },

  // Footer
  "Back to top": {
    en: "Back to top",
    mn: "Дээш буцах",
  },
  "footer.copyright": {
    en: "© 2026 Tenger Capital LLC. All Rights Reserved",
    mn: "© 2026 Тэнгэр Капитал ҮЦК ХХК. Бүх эрх хуулиар хамгаалагдсан",
  },

  // Timeline subtitle
  "timeline.subtitle": {
    en: "We've been working on Tenger Capital for the past 19 years. Here's a timeline of our journey.",
    mn: "Тэнгэр Капитал ҮЦК ХХК-ийн бахархал бол харилцагчдынхаа хамтаар бүтээсэн 19 жилийн түүх юм.  ",
  },

  // Footer
  "Tenger Capital": {
    en: "Tenger Capital",
    mn: "Тэнгэр Капитал",
  },

  // Key Figures
  "Average Annual Return": {
    en: "Average Annual Return",
    mn: "Жилийн дундаж өгөөж",
  },

  // Navigation
  Offerings: {
    en: "Offerings",
    mn: "Үйлчилгээ",
  },
  "DISCOVER NOW": {
    en: "DISCOVER NOW",
    mn: "ДЭЛГЭРЭНГҮЙ",
  },
  "Submit form": {
    en: "Submit form",
    mn: "Хүсэлт илгээх",
  },
  "REACH OUT TO US": {
    en: "REACH OUT TO US",
    mn: "ХОЛБОО БАРИХ",
  },
  "Learn More": {
    en: "Learn More",
    mn: "Дэлгэрэнгүй",
  },
  Login: {
    en: "Login",
    mn: "Арилжаанд оролцох",
  },
  "Since 2024": {
    en: "Since 2024",
    mn: "2024 оноос хойш",
  },
  "of 2025 total issuance": {
    en: "of 2025 total issuance",
    mn: "2025 оны нийт арилжааны",
  },
  "Billion MNT": {
    en: "Billion MNT",
    mn: "Тэрбум ₮",
  },

  // Submit Form Page
  "REACH OUT TO US.page": {
    en: "REACH OUT TO US",
    mn: "ХОЛБОО БАРИХ",
  },
  "submitform.title": {
    en: "Bond Form",
    mn: "Бондын форм",
  },
  "submitform.description": {
    en: "If you are interested in this high-yield investment product, please leave your information.",
    mn: "Та өндөр өгөөжтэй тус хөрөнгө оруулалтын бүтээгдэхүүнийг сонирхож байвал өөрийн мэдээллээ үлдээнэ үү.",
  },
  "Full Name": {
    en: "Full Name",
    mn: "Бүтэн нэр",
  },
  "e.g John Doe": {
    en: "e.g John Doe",
    mn: "жнь. Бат Дорж",
  },
  "Email Address": {
    en: "Email Address",
    mn: "Имэйл хаяг",
  },
  "submitform.email.note": {
    en: "We'll never share your email with anyone else.",
    mn: "Таны имэйл хаягийг бусдад дамжуулахгүй.",
  },
  "Phone Number": {
    en: "Phone Number",
    mn: "Утасны дугаар",
  },
  "Do you have Tenger Capital account?": {
    en: "Do you have a Tenger Capital account?",
    mn: "Танд Тэнгэр Капиталын данс байгаа юу?",
  },
  Yes: {
    en: "Yes",
    mn: "Тийм",
  },
  No: {
    en: "No",
    mn: "Үгүй",
  },
  "How much are you planning to invest?": {
    en: "How much are you planning to invest?",
    mn: "Хэдэн төгрөгийн хөрөнгө оруулалт хийхээр төлөвлөж байна вэ?",
  },
  "submitform.amount1": {
    en: "Up to 10 million MNT",
    mn: "10 сая төгрөг хүртэл",
  },
  "submitform.amount2": {
    en: "10-50 million MNT",
    mn: "10-50 сая төгрөг хүртэл",
  },
  "submitform.amount3": {
    en: "50-100 million MNT",
    mn: "50-100 сая төгрөг хүртэл",
  },
  "submitform.amount4": {
    en: "100-300 million MNT",
    mn: "100-300 сая төгрөг хүртэл",
  },
  "submitform.amount5": {
    en: "300+ million MNT",
    mn: "300 сая төгрөгөөс дээш",
  },
  Reset: {
    en: "Reset",
    mn: "Цэвэрлэх",
  },
  Submit: {
    en: "Submit",
    mn: "Илгээх",
  },
  "submitform.success": {
    en: "You have submitted the form successfully. Thanks for reaching out.",
    mn: "Таны хүсэлт амжилттай илгээгдлээ. Баярлалаа.",
  },
};
