"use client";

import { useLanguage } from "@/lib/language-context";
import { useEffect, useRef, useState } from "react";

interface PrincipleProps {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  delay?: number;
}

function PrincipleCard({ title, description, delay = 0 }: PrincipleProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={cardRef}
      className={`group relative overflow-hidden rounded-2xl p-[1px] transition-all duration-700 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      {/* Subtle glow effect on hover */}
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-[rgb(255,153,0)]/10 blur-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative">
        {/* Title */}
        <div className="mb-3 text-xl font-bold text-white/80 md:text-2xl lg:text-3xl">
          {title}
        </div>

        {/* Divider */}
        <div className="mb-6 h-px w-16 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />

        {/* Description */}
        <p className="text-white/60 md:text-md">{description}</p>
      </div>
    </div>
  );
}

export default function GuidingPrinciples() {
  const { t } = useLanguage();
  return (
    <section className="relative overflow-hidden section-container py-8 lg:py-16">
      {/* Ambient background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 h-96 w-96 rounded-full bg-[rgb(255,153,0)]/[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 -right-48 h-96 w-96 rounded-full bg-[rgb(248,229,181)]/[0.02] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Header */}
        <div className="pb-16 text-center md:mb-20">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-white md:text-4xl lg:text-5xl">
            {t("Guiding Principles")}
          </h2>
        </div>

        {/* Principles Grid */}
        <div className="grid gap-16 md:grid-cols-2">
          <PrincipleCard
            number="01"
            title={t("Client First")}
            subtitle="Your Success Is Our Priority"
            description={t("clientfirst.desc")}
            delay={0}
          />
          <PrincipleCard
            number="02"
            title={t("Transparent Integrity")}
            subtitle="Honesty in Every Interaction"
            description={t("transparentintegrity.desc")}
            delay={100}
          />
          <PrincipleCard
            number="03"
            title={t("Productive Capital")}
            subtitle="Leading Through Knowledge"
            description={t("productivecapital.desc")}
            delay={200}
          />
          <PrincipleCard
            number="04"
            title={t("Long-Term Partnership")}
            subtitle="Building Generational Wealth"
            description={t("longtermpartnership.desc")}
            delay={300}
          />
        </div>
      </div>
    </section>
  );
}
