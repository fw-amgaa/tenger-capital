"use client";

import { useLanguage } from "@/lib/language-context";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function LetterFromCeo() {
  const ref = useRef(null);
  const isInView = useInView(ref);
  const { t, language } = useLanguage();

  return (
    <div
      ref={ref}
      // style={{
      //   backgroundImage: 'url("/about-us/bg-pattern.png")',
      //   backgroundSize: "cover",
      //   backgroundPosition: "center",
      // }}
      className="section-container px-8 md:px-16"
    >
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="md:mt-0 md:min-h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 space-y-8 md:gap-16 py-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="z-10 md:w-[50%] text-center md:text-left"
        >
          <h1 className="text-3xl md:text-4xl tracking-tight text-primary">
            {t("Letter from CEO")}
          </h1>
          <div className="mt-2 mb-12 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />

          <div className="max-w-xl mx-auto mb-8 text-sm font-light italic">
            {language === "en" ? (
              <>
                <div className="mb-2">
                  Tenger Capital Securities LLC was founded in 2007 and is now a
                  company with 19 years of history.
                </div>
                <div className="mb-2">
                  In 2025, we elevated our operations to a new level by fully
                  renewing our corporate strategy, governance, leadership team,
                  and organizational structure based on the core principle that{" "}
                  <b className="font-bold">
                    &ldquo;the path to growing everyone&apos;s wealth must be
                    clear, reliable, and well‑directed.&rdquo;
                  </b>
                </div>
                <div className="mb-2 ml-8">
                  As part of this transformation, we successfully raised more
                  than <b className="font-bold">600 billion MNT</b> within a
                  short period in 2025, while our trading performance grew by{" "}
                  <b className="font-bold">502.5%</b> — a{" "}
                  <b className="font-bold">9.2</b>-fold increase — positioning
                  us as one of the <b className="font-bold">Top‑3</b> leading
                  companies in the sector.
                </div>
                <div className="mb-2">
                  Going forward, we are committed to consistently delivering
                  professional, ethical, responsible, and sustainable
                  performance at all levels of our operations, always
                  prioritizing the best interests of our clients.
                </div>
              </>
            ) : (
              <>
                <div className="mb-2">
                  Тэнгэр Капитал ҮЦК ХХК нь 2007 онд үүсгэн байгуулагдсан бөгөөд
                  19 жилийн түүхэн замналтай компани юм.
                </div>
                <div className="mb-2">
                  Бид 2025 онд{" "}
                  <b className="font-bold">
                    &ldquo;Хүн бүрийн хөрөнгийг өсгөх зам ойлгомжтой,
                    найдвартай, зөв чиглэлтэй байх ёстой&rdquo;
                  </b>{" "}
                  гэсэн суурь зарчимд үндэслэн компанийн стратеги, засаглал,
                  удирдлагын баг, бүтцийг бүрэн шинэчилснээр үйл ажиллагаагаа
                  шинэ түвшинд гаргаад байна.
                </div>
                <div className="mb-2 ml-8">
                  Тус шинэчлэлийн хүрээнд бид богино хугацаанд буюу 2025 онд
                  нийт <b className="font-bold">600 гаруй тэрбум</b> төгрөгийг
                  амжилттай татан төвлөрүүлснээс гадна арилжааны гүйцэтгэл{" "}
                  <b className="font-bold">502.5%</b> буюу{" "}
                  <b className="font-bold">9.2</b> дахин өсөж, салбартаа
                  тэргүүлэгч <b className="font-bold">ТОП-3</b> компанийн нэгэнд
                  зүй ёсоор тооцогдож байна.
                </div>
                <div className="mb-2">
                  Цаашид ч бид үйл ажиллагааныхаа бүхий л түвшинд харилцагчийн
                  эрх ашгийг дээдэлсэн, мэргэжлийн ёс зүйтэй, хариуцлагатай,
                  тогтвортой гүйцэтгэлийг тууштай хэрэгжүүлэн ажиллах болно
                  гэдгээ илэрхийлэхэд таатай байна.
                </div>
              </>
            )}
          </div>
          <p className="text-sm text-white font-bold max-w-xl mx-auto">
            {t("ceo.regards")}
          </p>
          <p className="text-sm text-primary mt-1">{t("ceo.name")}</p>
          <p className="text-sm text-white mt-1">{t("ceo.title")}</p>
        </motion.div>

        <div className="w-full md:w-[40%] aspect-[279/333] md:aspect-[500/630] rounded-3xl overflow-hidden relative">
          <Image
            objectFit="cover"
            src={"/team-members/all-bw part1-3.jpg"}
            alt="hero"
            fill
          />
        </div>
      </motion.main>
    </div>
  );
}
