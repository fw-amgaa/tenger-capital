"use client";

import Seperator from "../../seperator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { brokerFaqs } from "./questions";
import { useLanguage } from "@/lib/language-context";

const FAQ = () => {
  const { language, t } = useLanguage();

  return (
    <div className="section-container flex flex-col gap-8 relative">
      <Seperator />

      <div className="grid md:grid-cols-2 z-1">
        <h1 className="text-4xl mb-12">{t("Frequently Asked Questions")}</h1>

        <Accordion type="single" collapsible className="w-full">
          {brokerFaqs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item[language].question}</AccordionTrigger>
              <AccordionContent className="opacity-80 leading-relaxed p-6 pt-0">
                {item[language].answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
