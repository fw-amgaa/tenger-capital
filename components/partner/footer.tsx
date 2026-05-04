"use client";

import Image from "next/image";
import Link from "next/link";
import { animate } from "framer-motion";
import { useState, type FormEvent } from "react";
import { ArrowUp, Send } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/lib/language-context";
import { pickLang, type PartnerPageBundle } from "@/lib/partners/shared";
import { cn } from "@/lib/utils";

const SOCIAL_ICONS: Record<string, React.FC<{ size?: number }>> = {
  facebook: FacebookIcon,
  twitter: TwitterIcon,
  linkedin: LinkedInIcon,
  youtube: YoutubeIcon,
  instagram: InstagramIcon,
};

export default function PartnerFooter({
  bundle,
}: {
  bundle: PartnerPageBundle;
}) {
  const { language } = useLanguage();
  const { page, links, socials, underwriters } = bundle;
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const subscribeTitle = pickLang(
    language,
    page.footerSubscribeTitleMn,
    page.footerSubscribeTitleEn,
  );
  const linksTitle = pickLang(
    language,
    page.footerLinksTitleMn,
    page.footerLinksTitleEn,
  );

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/journal/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          source: `partner-${page.slug}`,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        toast.success(
          data.duplicate
            ? language === "en"
              ? "You're already subscribed."
              : "Та аль хэдийн бүртгэгдсэн байна."
            : language === "en"
              ? "Subscribed."
              : "Амжилттай нэгдлээ.",
        );
        setEmail("");
      } else {
        toast.error(
          language === "en"
            ? "Couldn't subscribe — please check your email."
            : "Бүртгүүлж чадсангүй — имэйлээ шалгана уу.",
        );
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="p-4 contact-anchor" id="contact">
      <div className="relative flex flex-col gap-4 lg:gap-8 lg:pt-[3rem] sm:px-16">
        <div
          className={cn(
            "relative grid h-full gap-[3rem] rounded-[2rem]",
            "grid-cols-1 lg:grid-cols-[1.1fr_1.4fr_1fr]",
            "px-[2rem] pt-[2.5rem] pb-[4rem] lg:p-[3rem] lg:pb-[5rem]",
            "bg-black",
          )}
          style={{
            backgroundImage:
              "linear-gradient(color-mix(in oklch, var(--partner-primary) 12%, transparent), color-mix(in oklch, var(--partner-primary) 12%, transparent))",
          }}
        >
          {/* Column 1: Underwriter logos (or Tenger logo fallback) */}
          <div className="flex flex-col gap-8 max-lg:items-center">
            {underwriters.length === 0 ? (
              <Image
                src={page.tengerLogoUrl || "/logo/logo_main_light_new.png"}
                alt="Tenger Capital"
                width={140}
                height={40}
                className="object-contain"
              />
            ) : (
              underwriters.map((u) => (
                <div
                  key={u.id}
                  className="flex flex-col gap-2 max-lg:items-center"
                >
                  <span className="text-xs text-white/55">
                    {pickLang(language, u.labelMn, u.labelEn)}
                  </span>
                  <div className="relative h-10 w-[150px]">
                    <Image
                      src={u.logoUrl}
                      alt={pickLang(language, u.labelMn, u.labelEn)}
                      fill
                      className="object-contain object-left max-lg:object-center"
                      sizes="150px"
                    />
                  </div>
                </div>
              ))
            )}

            {/* Contact info */}
            {page.footerEmail || page.footerPhone ? (
              <div className="flex flex-col gap-1 mt-4 text-xs text-white/60 max-lg:items-center">
                {page.footerEmail ? (
                  <a
                    href={`mailto:${page.footerEmail}`}
                    className="hover:text-white transition-colors"
                  >
                    {page.footerEmail}
                  </a>
                ) : null}
                {page.footerPhone ? (
                  <a
                    href={`tel:${page.footerPhone.replace(/\s+/g, "")}`}
                    className="hover:text-white transition-colors"
                  >
                    {page.footerPhone}
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Column 2: Subscribe + social */}
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-lg md:text-xl text-white">{subscribeTitle}</h3>

            <form
              onSubmit={handleSubscribe}
              className="relative w-full max-w-[460px]"
            >
              <div
                className="relative flex items-center rounded-full overflow-hidden bg-black/40 transition-all"
                style={{
                  border: "1px solid color-mix(in oklch, var(--partner-primary) 40%, transparent)",
                  boxShadow:
                    "0 0 0 4px color-mix(in oklch, var(--partner-primary) 8%, transparent)",
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={
                    language === "en"
                      ? "Enter your email"
                      : "И-мэйл хаягаа бичнэ үү"
                  }
                  className="flex-1 bg-transparent px-5 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  data-tc-cta={`partner-${page.slug}-subscribe`}
                  className="flex items-center gap-2 px-5 py-3 m-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white transition-all disabled:opacity-60"
                  style={{
                    background: "var(--partner-primary)",
                  }}
                >
                  <Send size={14} />
                  {submitting
                    ? language === "en"
                      ? "Joining…"
                      : "Илгээж байна…"
                    : language === "en"
                      ? "Join"
                      : "Нэгдэх"}
                </button>
              </div>
            </form>

            {socials.length > 0 ? (
              <div className="flex items-center gap-3 mt-2">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICONS[s.kind] ?? GenericIcon;
                  return (
                    <a
                      key={s.id}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-tc-cta={`partner-${page.slug}-social-${s.kind}`}
                      className="flex items-center justify-center h-9 w-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/40 transition-all"
                      aria-label={s.kind}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            ) : null}
          </div>

          {/* Column 3: Useful links */}
          <div className="flex flex-col gap-4 max-lg:items-center">
            <h4 className="text-sm text-white">{linksTitle}</h4>
            <ul className="flex flex-col gap-2 text-sm text-white/55">
              {links.length === 0 ? (
                <li className="text-white/30 text-xs">
                  {language === "en"
                    ? "No links yet"
                    : "Линк нэмнэ үү"}
                </li>
              ) : (
                links.map((l) => (
                  <li key={l.id}>
                    <Link
                      href={l.url}
                      target={l.url.startsWith("http") ? "_blank" : "_self"}
                      className="hover:text-white transition-colors"
                    >
                      {pickLang(language, l.labelMn, l.labelEn)}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>

          {/* Back-to-top button */}
          <button
            onClick={() =>
              animate(window.scrollY, 0, {
                duration: 1.2,
                ease: [0.22, 1, 0.36, 1],
                onUpdate: (v) => window.scrollTo(0, v),
              })
            }
            aria-label="Back to top"
            className="absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex items-center justify-center h-10 w-10 rounded-full text-white shadow-lg cursor-pointer"
            style={{ background: "var(--partner-primary)" }}
          >
            <ArrowUp size={16} />
          </button>
        </div>

        <p className="text-white text-xs tracking-wide opacity-50 text-center px-4">
          © {new Date().getFullYear()}{" "}
          {pickLang(language, page.nameMn, page.nameEn)} ·{" "}
          {language === "en"
            ? "Built with Tenger Capital"
            : "Тэнгэр Капитал хамтран ажиллаж байна"}
        </p>
      </div>
    </footer>
  );
}

function FacebookIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}
function TwitterIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 13 11"
    >
      <path d="M9.514.001h1.852L7.32 4.64l4.762 6.311H8.353L5.43 7.123l-3.34 3.827H.238l4.329-4.962L0 .002h3.823L6.46 3.5zM8.862 9.84h1.027L3.262 1.055H2.16z" />
    </svg>
  );
}
function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 13 12"
    >
      <path d="M3.05 1.219a1.216 1.216 0 1 1-2.434-.002 1.216 1.216 0 0 1 2.433.002m.036 2.116H.653v7.615h2.433zm3.844 0H4.509v7.615h2.396V6.954c0-2.226 2.901-2.433 2.901 0v3.996h2.403V6.127c0-3.753-4.294-3.613-5.304-1.77z" />
    </svg>
  );
}
function YoutubeIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 17 12"
    >
      <path d="m7 7.822 4.058-2.346L7 3.13zm9.04-6.124c.102.368.172.86.219 1.486.055.626.078 1.166.078 1.635l.047.657c0 1.712-.125 2.971-.344 3.777-.196.704-.65 1.157-1.353 1.353-.368.101-1.04.172-2.072.219a52 52 0 0 1-2.808.078l-1.243.047c-3.277 0-5.318-.125-6.124-.344-.704-.196-1.157-.65-1.353-1.353-.101-.368-.172-.86-.219-1.486A19 19 0 0 1 .79 6.133l-.047-.657c0-1.713.125-2.972.344-3.778C1.283.995 1.737.541 2.44.346 2.808.244 3.48.174 4.513.126A52 52 0 0 1 7.32.049L8.564.001c3.276 0 5.317.126 6.123.345.704.195 1.157.649 1.353 1.352" />
    </svg>
  );
}
function InstagramIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 13 13"
    >
      <path d="M4.422.436h5.074A3.506 3.506 0 0 1 13 3.939v5.074a3.503 3.503 0 0 1-3.504 3.503H4.422A3.506 3.506 0 0 1 .92 9.013V3.939A3.503 3.503 0 0 1 4.422.436m-.12 1.208a2.175 2.175 0 0 0-2.175 2.174v5.316c0 1.202.973 2.174 2.175 2.174h5.315a2.175 2.175 0 0 0 2.174-2.174V3.818a2.173 2.173 0 0 0-2.174-2.174zm5.828.906a.755.755 0 1 1 0 1.51.755.755 0 0 1 0-1.51m-3.17.906a3.02 3.02 0 1 1 0 6.04 3.02 3.02 0 0 1 0-6.04m0 1.208a1.812 1.812 0 1 0 0 3.624 1.812 1.812 0 0 0 0-3.624" />
    </svg>
  );
}
function GenericIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
