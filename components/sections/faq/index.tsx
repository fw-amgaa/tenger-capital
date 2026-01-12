import Seperator from "../../seperator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../ui/accordion";
import { brokerFaqs } from "./questions";

const FAQ = () => {
  const lang = "en";

  return (
    <div className="section-container flex flex-col gap-8 relative">
      {/* <div className="absolute left-0 w-full h-screen z-0">
        <Image
          src={"/brand/traditional-pattern.png"}
          fill
          objectFit="cover"
          alt="pattern"
        />
      </div> */}

      <Seperator />

      <div className="grid md:grid-cols-2 z-1">
        <h1 className="text-4xl mb-12">Frequently Asked Questions</h1>

        <Accordion
          type="single"
          collapsible
          className="w-full"
          defaultValue="item-1"
        >
          {brokerFaqs.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{item[lang].question}</AccordionTrigger>
              <AccordionContent className="opacity-80 leading-relaxed">
                {item[lang].answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default FAQ;
