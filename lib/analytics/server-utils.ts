const BOT_REGEX =
  /bot|crawl|spider|slurp|bingpreview|headless|lighthouse|chrome-lighthouse|pingdom|monitor|preview|prerender|facebookexternalhit|whatsapp|telegrambot|linkedinbot|twitterbot|discordbot|google|yandex|baiduspider|duckduck|applebot/i;

export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua) return true;
  return BOT_REGEX.test(ua);
}

export type ParsedUA = {
  device: "mobile" | "tablet" | "desktop";
  os: string;
  browser: string;
};

export function parseUserAgent(ua: string): ParsedUA {
  const lower = ua.toLowerCase();

  const isTablet = /ipad|tablet|playbook|silk/.test(lower) && !/mobile/.test(lower);
  const isMobile =
    /mobi|android|iphone|ipod|blackberry|iemobile|opera mini/.test(lower) &&
    !isTablet;
  const device: ParsedUA["device"] = isTablet
    ? "tablet"
    : isMobile
      ? "mobile"
      : "desktop";

  let os = "Other";
  if (/windows nt/.test(lower)) os = "Windows";
  else if (/mac os x|macintosh/.test(lower)) os = "macOS";
  else if (/iphone|ipad|ipod/.test(lower)) os = "iOS";
  else if (/android/.test(lower)) os = "Android";
  else if (/linux/.test(lower)) os = "Linux";
  else if (/cros/.test(lower)) os = "ChromeOS";

  let browser = "Other";
  if (/edg\//.test(lower)) browser = "Edge";
  else if (/opr\/|opera/.test(lower)) browser = "Opera";
  else if (/samsungbrowser/.test(lower)) browser = "Samsung";
  else if (/firefox\//.test(lower)) browser = "Firefox";
  else if (/chrome\//.test(lower) && !/edg\//.test(lower)) browser = "Chrome";
  else if (/safari\//.test(lower) && !/chrome\//.test(lower)) browser = "Safari";

  return { device, os, browser };
}

export type GeoHeaders = {
  country: string | null;
  region: string | null;
  city: string | null;
};

export function readGeoHeaders(headers: Headers): GeoHeaders {
  const decode = (v: string | null) => {
    if (!v) return null;
    try {
      const decoded = decodeURIComponent(v).trim();
      return decoded.length > 0 ? decoded : null;
    } catch {
      return v.trim() || null;
    }
  };
  return {
    country: decode(headers.get("x-vercel-ip-country")),
    region: decode(
      headers.get("x-vercel-ip-country-region") ||
        headers.get("x-vercel-ip-region"),
    ),
    city: decode(headers.get("x-vercel-ip-city")),
  };
}

export function extractReferrerHost(referrer: string | null | undefined): string | null {
  if (!referrer) return null;
  try {
    return new URL(referrer).host.toLowerCase();
  } catch {
    return null;
  }
}

export function isAdminCookiePresent(cookieHeader: string | null): boolean {
  if (!cookieHeader) return false;
  return (
    cookieHeader.includes("__Secure-better-auth.session_token=") ||
    cookieHeader.includes("better-auth.session_token=")
  );
}

export function clamp(n: unknown, min: number, max: number, fallback = 0): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : fallback;
  return Math.max(min, Math.min(max, Math.floor(v)));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export function isUuid(s: unknown): s is string {
  return typeof s === "string" && UUID_RE.test(s);
}

export function safePath(s: unknown, max = 512): string {
  if (typeof s !== "string") return "/";
  const trimmed = s.slice(0, max);
  if (!trimmed.startsWith("/")) return "/";
  return trimmed;
}

export function safeText(s: unknown, max = 1024): string | null {
  if (typeof s !== "string") return null;
  return s.slice(0, max);
}
