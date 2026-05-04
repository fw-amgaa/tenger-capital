import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  json,
  integer,
  bigint,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

// Better-auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Form submissions table
export const formSubmission = pgTable("form_submission", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  hasAccount: boolean("has_account").notNull().default(false),
  investAmount: text("invest_amount"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Form page content (singleton CMS)
export const formPageContent = pgTable("form_page_content", {
  id: text("id").primaryKey(),
  title: text("title"),
  titleEn: text("title_en"),
  description: text("description"),
  descriptionEn: text("description_en"),
  paragraphs: json("paragraphs").$type<string[]>().notNull().default([]),
  paragraphsEn: json("paragraphs_en").$type<string[]>().notNull().default([]),
  images: json("images").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type HeroSlide = {
  id: string;
  type: "image" | "video";
  url: string;
  alt?: string;
};

export const homeHero = pgTable("home_hero", {
  id: text("id").primaryKey(),
  slides: json("slides").$type<HeroSlide[]>().notNull().default([]),
  intervalMs: integer("interval_ms").notNull().default(5000),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// Analytics — raw event tables (90-day retention)
// ============================================================

export const analyticsVisitor = pgTable(
  "analytics_visitor",
  {
    id: text("id").primaryKey(),
    firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    device: text("device"),
    os: text("os"),
    browser: text("browser"),
    language: text("language"),
    userAgent: text("user_agent"),
  },
  (t) => [index("idx_visitor_last_seen").on(t.lastSeenAt)],
);

export const analyticsSession = pgTable(
  "analytics_session",
  {
    id: text("id").primaryKey(),
    visitorId: text("visitor_id").notNull(),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    endedAt: timestamp("ended_at"),
    landingPath: text("landing_path"),
    exitPath: text("exit_path"),
    referrer: text("referrer"),
    referrerHost: text("referrer_host"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmTerm: text("utm_term"),
    utmContent: text("utm_content"),
    language: text("language"),
    country: text("country"),
    region: text("region"),
    city: text("city"),
    device: text("device"),
    os: text("os"),
    browser: text("browser"),
    pageviews: integer("pageviews").notNull().default(0),
    durationMs: integer("duration_ms").notNull().default(0),
    isBounce: boolean("is_bounce").notNull().default(true),
  },
  (t) => [
    index("idx_session_started_at").on(t.startedAt),
    index("idx_session_visitor").on(t.visitorId),
    index("idx_session_country").on(t.country),
  ],
);

export const analyticsPageview = pgTable(
  "analytics_pageview",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    visitorId: text("visitor_id").notNull(),
    path: text("path").notNull(),
    query: text("query"),
    title: text("title"),
    startedAt: timestamp("started_at").notNull().defaultNow(),
    endedAt: timestamp("ended_at"),
    durationMs: integer("duration_ms"),
    maxScrollPct: integer("max_scroll_pct").notNull().default(0),
    viewportW: integer("viewport_w"),
    viewportH: integer("viewport_h"),
    isExit: boolean("is_exit").notNull().default(false),
  },
  (t) => [
    index("idx_pageview_started_at").on(t.startedAt),
    index("idx_pageview_session").on(t.sessionId),
    index("idx_pageview_path").on(t.path),
  ],
);

export const analyticsSectionView = pgTable(
  "analytics_section_view",
  {
    id: text("id").primaryKey(),
    pageviewId: text("pageview_id").notNull(),
    sessionId: text("session_id").notNull(),
    visitorId: text("visitor_id").notNull(),
    pagePath: text("page_path").notNull(),
    sectionId: text("section_id").notNull(),
    firstSeenAt: timestamp("first_seen_at").notNull().defaultNow(),
    lastSeenAt: timestamp("last_seen_at").notNull().defaultNow(),
    dwellMs: integer("dwell_ms").notNull().default(0),
    maxVisiblePct: integer("max_visible_pct").notNull().default(0),
  },
  (t) => [
    index("idx_section_pageview").on(t.pageviewId),
    index("idx_section_path_section").on(t.pagePath, t.sectionId),
    index("idx_section_first_seen").on(t.firstSeenAt),
  ],
);

export const analyticsEvent = pgTable(
  "analytics_event",
  {
    id: text("id").primaryKey(),
    sessionId: text("session_id").notNull(),
    visitorId: text("visitor_id").notNull(),
    pageviewId: text("pageview_id"),
    type: text("type").notNull(),
    name: text("name"),
    target: text("target"),
    value: text("value"),
    payload: json("payload").$type<Record<string, unknown>>(),
    path: text("path"),
    occurredAt: timestamp("occurred_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_event_occurred_at").on(t.occurredAt),
    index("idx_event_session").on(t.sessionId),
    index("idx_event_type").on(t.type),
  ],
);

// ============================================================
// Analytics — daily aggregate tables (long-term retention)
// ============================================================

export const analyticsDailyOverview = pgTable("analytics_daily_overview", {
  day: text("day").primaryKey(),
  visitors: integer("visitors").notNull().default(0),
  newVisitors: integer("new_visitors").notNull().default(0),
  sessions: integer("sessions").notNull().default(0),
  pageviews: integer("pageviews").notNull().default(0),
  bounces: integer("bounces").notNull().default(0),
  totalDurationMs: bigint("total_duration_ms", { mode: "number" })
    .notNull()
    .default(0),
});

export const analyticsDailyPath = pgTable(
  "analytics_daily_path",
  {
    day: text("day").notNull(),
    path: text("path").notNull(),
    pageviews: integer("pageviews").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    avgDurationMs: integer("avg_duration_ms").notNull().default(0),
    bounces: integer("bounces").notNull().default(0),
    exits: integer("exits").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.path] })],
);

export const analyticsDailySection = pgTable(
  "analytics_daily_section",
  {
    day: text("day").notNull(),
    pagePath: text("page_path").notNull(),
    sectionId: text("section_id").notNull(),
    impressions: integer("impressions").notNull().default(0),
    uniqueVisitors: integer("unique_visitors").notNull().default(0),
    avgDwellMs: integer("avg_dwell_ms").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.pagePath, t.sectionId] })],
);

export const analyticsDailyGeo = pgTable(
  "analytics_daily_geo",
  {
    day: text("day").notNull(),
    country: text("country").notNull(),
    region: text("region").notNull().default(""),
    city: text("city").notNull().default(""),
    visitors: integer("visitors").notNull().default(0),
    sessions: integer("sessions").notNull().default(0),
    pageviews: integer("pageviews").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.day, t.country, t.region, t.city] })],
);

export const analyticsDailyAcquisition = pgTable(
  "analytics_daily_acquisition",
  {
    day: text("day").notNull(),
    referrerHost: text("referrer_host").notNull().default(""),
    utmSource: text("utm_source").notNull().default(""),
    utmMedium: text("utm_medium").notNull().default(""),
    utmCampaign: text("utm_campaign").notNull().default(""),
    visitors: integer("visitors").notNull().default(0),
    sessions: integer("sessions").notNull().default(0),
  },
  (t) => [
    primaryKey({
      columns: [t.day, t.referrerHost, t.utmSource, t.utmMedium, t.utmCampaign],
    }),
  ],
);

export const analyticsDailyDevice = pgTable(
  "analytics_daily_device",
  {
    day: text("day").notNull(),
    device: text("device").notNull().default(""),
    os: text("os").notNull().default(""),
    browser: text("browser").notNull().default(""),
    language: text("language").notNull().default(""),
    sessions: integer("sessions").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.day, t.device, t.os, t.browser, t.language] }),
  ],
);

// ============================================================
// Journal — blog posts, comments, newsletter subscribers
// ============================================================

export const journalPost = pgTable(
  "journal_post",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    titleEn: text("title_en"),
    excerpt: text("excerpt").notNull().default(""),
    excerptEn: text("excerpt_en"),
    bodyHtml: text("body_html").notNull().default(""),
    bodyHtmlEn: text("body_html_en"),
    lede: text("lede").notNull().default(""),
    ledeEn: text("lede_en"),
    category: text("category").notNull().default("Шинжилгээ"),
    tags: json("tags").$type<string[]>().notNull().default([]),
    author: text("author").notNull().default(""),
    authorRole: text("author_role").notNull().default(""),
    authorInitials: text("author_initials").notNull().default(""),
    coverImage: text("cover_image"),
    readTime: integer("read_time").notNull().default(5),
    views: integer("views").notNull().default(0),
    featured: boolean("featured").notNull().default(false),
    published: boolean("published").notNull().default(false),
    publishedAt: timestamp("published_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_journal_post_published").on(t.published, t.publishedAt),
    index("idx_journal_post_category").on(t.category),
  ],
);

export const journalComment = pgTable(
  "journal_comment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    postId: uuid("post_id")
      .notNull()
      .references(() => journalPost.id, { onDelete: "cascade" }),
    parentId: uuid("parent_id"),
    authorName: text("author_name").notNull(),
    authorInitials: text("author_initials").notNull().default(""),
    body: text("body").notNull(),
    likes: integer("likes").notNull().default(0),
    approved: boolean("approved").notNull().default(false),
    isAuthor: boolean("is_author").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_journal_comment_post").on(t.postId, t.createdAt),
    index("idx_journal_comment_approved").on(t.approved),
  ],
);

export const journalSubscriber = pgTable(
  "journal_subscriber",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    source: text("source").notNull().default("journal-newsletter"),
    confirmed: boolean("confirmed").notNull().default(false),
    unsubscribedAt: timestamp("unsubscribed_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => [index("idx_journal_subscriber_created").on(t.createdAt)],
);

// ============================================================
// FAQ — categories, questions, promo banner (CMS)
// ============================================================

export const faqCategory = pgTable(
  "faq_category",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    icon: text("icon").notNull().default(""),
    labelMn: text("label_mn").notNull().default(""),
    labelEn: text("label_en").notNull().default(""),
    introMn: text("intro_mn").notNull().default(""),
    introEn: text("intro_en").notNull().default(""),
    videoTitleMn: text("video_title_mn").notNull().default(""),
    videoTitleEn: text("video_title_en").notNull().default(""),
    videoDuration: text("video_duration").notNull().default(""),
    videoThumb: text("video_thumb").notNull().default(""),
    videoThumbNote: text("video_thumb_note").notNull().default(""),
    accent: text("accent").notNull().default("#f5875a"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("idx_faq_category_sort").on(t.sortOrder)],
);

export const faqQuestion = pgTable(
  "faq_question",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    categoryId: uuid("category_id")
      .notNull()
      .references(() => faqCategory.id, { onDelete: "cascade" }),
    qMn: text("q_mn").notNull().default(""),
    qEn: text("q_en").notNull().default(""),
    aMn: text("a_mn").notNull().default(""),
    aEn: text("a_en").notNull().default(""),
    helpful: integer("helpful").notNull().default(0),
    isPopular: boolean("is_popular").notNull().default(false),
    popularRank: integer("popular_rank"),
    sortOrder: integer("sort_order").notNull().default(0),
    published: boolean("published").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [
    index("idx_faq_question_category").on(t.categoryId, t.sortOrder),
    index("idx_faq_question_popular").on(t.isPopular, t.popularRank),
  ],
);

export const faqPromo = pgTable("faq_promo", {
  id: text("id").primaryKey(),
  eyebrowMn: text("eyebrow_mn").notNull().default(""),
  eyebrowEn: text("eyebrow_en").notNull().default(""),
  metaMn: text("meta_mn").notNull().default(""),
  metaEn: text("meta_en").notNull().default(""),
  titleMn: text("title_mn").notNull().default(""),
  titleEn: text("title_en").notNull().default(""),
  blurbMn: text("blurb_mn").notNull().default(""),
  blurbEn: text("blurb_en").notNull().default(""),
  ctaMn: text("cta_mn").notNull().default(""),
  ctaEn: text("cta_en").notNull().default(""),
  glyph: text("glyph").notNull().default(""),
  cornerLabel: text("corner_label").notNull().default(""),
  enabled: boolean("enabled").notNull().default(true),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ============================================================
// Partner landing pages — fully dynamic, multi-page CMS
// ============================================================

export const partnerPage = pgTable(
  "partner_page",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),

    // Branding
    nameMn: text("name_mn").notNull().default(""),
    nameEn: text("name_en").notNull().default(""),
    partnerLogoUrl: text("partner_logo_url"),
    tengerLogoUrl: text("tenger_logo_url"),
    primaryColor: text("primary_color").notNull().default("#f5875a"),

    // Header CTAs
    pdfUrl: text("pdf_url"),
    pdfCtaLabelMn: text("pdf_cta_label_mn").notNull().default("Танилцуулга татах"),
    pdfCtaLabelEn: text("pdf_cta_label_en").notNull().default("Download intro"),
    orderUrl: text("order_url"),
    orderCtaLabelMn: text("order_cta_label_mn").notNull().default("Захиалга өгөх"),
    orderCtaLabelEn: text("order_cta_label_en").notNull().default("Place order"),

    // Hero
    heroEyebrowMn: text("hero_eyebrow_mn").notNull().default(""),
    heroEyebrowEn: text("hero_eyebrow_en").notNull().default(""),
    heroTitleMn: text("hero_title_mn").notNull().default(""),
    heroTitleEn: text("hero_title_en").notNull().default(""),
    heroSubtitleMn: text("hero_subtitle_mn").notNull().default(""),
    heroSubtitleEn: text("hero_subtitle_en").notNull().default(""),

    // Introduction
    introTitleMn: text("intro_title_mn").notNull().default(""),
    introTitleEn: text("intro_title_en").notNull().default(""),
    introHtmlMn: text("intro_html_mn").notNull().default(""),
    introHtmlEn: text("intro_html_en").notNull().default(""),

    // Conditions
    conditionsTitleMn: text("conditions_title_mn").notNull().default(""),
    conditionsTitleEn: text("conditions_title_en").notNull().default(""),
    conditionsLedeMn: text("conditions_lede_mn").notNull().default(""),
    conditionsLedeEn: text("conditions_lede_en").notNull().default(""),

    // Download CTA block
    downloadTitleMn: text("download_title_mn").notNull().default(""),
    downloadTitleEn: text("download_title_en").notNull().default(""),
    downloadDescMn: text("download_desc_mn").notNull().default(""),
    downloadDescEn: text("download_desc_en").notNull().default(""),

    // FAQ
    faqTitleMn: text("faq_title_mn").notNull().default(""),
    faqTitleEn: text("faq_title_en").notNull().default(""),

    // Footer
    footerSubscribeTitleMn: text("footer_subscribe_title_mn")
      .notNull()
      .default("Бидэнтэй нэгдэх"),
    footerSubscribeTitleEn: text("footer_subscribe_title_en")
      .notNull()
      .default("Join us"),
    footerLinksTitleMn: text("footer_links_title_mn")
      .notNull()
      .default("Хэрэгцээт линк"),
    footerLinksTitleEn: text("footer_links_title_en")
      .notNull()
      .default("Useful links"),
    footerEmail: text("footer_email").notNull().default(""),
    footerPhone: text("footer_phone").notNull().default(""),

    published: boolean("published").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => [index("idx_partner_page_published").on(t.published)],
);

export const partnerHeroSlide = pgTable(
  "partner_hero_slide",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("image"), // 'image' | 'video'
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_hero_slide_page").on(t.pageId, t.sortOrder)],
);

export const partnerIntroImage = pgTable(
  "partner_intro_image",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    captionMn: text("caption_mn").notNull().default(""),
    captionEn: text("caption_en").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_intro_image_page").on(t.pageId, t.sortOrder)],
);

export const partnerCondition = pgTable(
  "partner_condition",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    iconLabel: text("icon_label").notNull().default(""),
    titleMn: text("title_mn").notNull().default(""),
    titleEn: text("title_en").notNull().default(""),
    bodyMn: text("body_mn").notNull().default(""),
    bodyEn: text("body_en").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_condition_page").on(t.pageId, t.sortOrder)],
);

export const partnerFaq = pgTable(
  "partner_faq",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    qMn: text("q_mn").notNull().default(""),
    qEn: text("q_en").notNull().default(""),
    aMn: text("a_mn").notNull().default(""),
    aEn: text("a_en").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_faq_page").on(t.pageId, t.sortOrder)],
);

export const partnerLink = pgTable(
  "partner_link",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    labelMn: text("label_mn").notNull().default(""),
    labelEn: text("label_en").notNull().default(""),
    url: text("url").notNull().default(""),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_link_page").on(t.pageId, t.sortOrder)],
);

export const partnerSocial = pgTable(
  "partner_social",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(), // facebook|twitter|linkedin|youtube|instagram
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_social_page").on(t.pageId, t.sortOrder)],
);

export const partnerUnderwriterLogo = pgTable(
  "partner_underwriter_logo",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    pageId: uuid("page_id")
      .notNull()
      .references(() => partnerPage.id, { onDelete: "cascade" }),
    labelMn: text("label_mn").notNull().default(""),
    labelEn: text("label_en").notNull().default(""),
    logoUrl: text("logo_url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("idx_partner_underwriter_logo_page").on(t.pageId, t.sortOrder)],
);

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type FormSubmission = typeof formSubmission.$inferSelect;
export type FormPageContent = typeof formPageContent.$inferSelect;
export type HomeHero = typeof homeHero.$inferSelect;
export type AnalyticsVisitor = typeof analyticsVisitor.$inferSelect;
export type AnalyticsSession = typeof analyticsSession.$inferSelect;
export type AnalyticsPageview = typeof analyticsPageview.$inferSelect;
export type AnalyticsSectionView = typeof analyticsSectionView.$inferSelect;
export type AnalyticsEvent = typeof analyticsEvent.$inferSelect;
export type JournalPostRow = typeof journalPost.$inferSelect;
export type JournalCommentRow = typeof journalComment.$inferSelect;
export type JournalSubscriberRow = typeof journalSubscriber.$inferSelect;
export type FaqCategoryRow = typeof faqCategory.$inferSelect;
export type FaqQuestionRow = typeof faqQuestion.$inferSelect;
export type FaqPromoRow = typeof faqPromo.$inferSelect;
export type PartnerPageRow = typeof partnerPage.$inferSelect;
export type PartnerHeroSlideRow = typeof partnerHeroSlide.$inferSelect;
export type PartnerIntroImageRow = typeof partnerIntroImage.$inferSelect;
export type PartnerConditionRow = typeof partnerCondition.$inferSelect;
export type PartnerFaqRow = typeof partnerFaq.$inferSelect;
export type PartnerLinkRow = typeof partnerLink.$inferSelect;
export type PartnerSocialRow = typeof partnerSocial.$inferSelect;
export type PartnerUnderwriterLogoRow = typeof partnerUnderwriterLogo.$inferSelect;
