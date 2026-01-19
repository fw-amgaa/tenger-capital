import React from "react";
import { Timeline } from "@/components/ui/timeline";
import Image from "next/image";

function TimelineItem({
  title,
  facts,
  imagePath,
}: {
  title: string;
  facts: string[];
  imagePath: string;
}) {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="flex flex-col sm:flex-row sm:gap-4">
        <div className="border rounded-sm overflow-hidden w-[150px] h-16 bg-[#111111] p-1">
          <div className="relative bg-black w-full h-full rounded-xs">
            <Image src={imagePath} alt={title} objectFit="cover" fill />
          </div>
        </div>
        <p className="mt-1 sm:mt-5 text-xs font-bold text-neutral-800 md:text-sm dark:text-neutral-200">
          {title}
        </p>
      </div>
      <div>
        <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
        {facts.map((fact, index) => (
          <p
            key={index}
            className="mb-5 h-10 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200"
          >
            {fact}
          </p>
        ))}
      </div>
    </div>
  );
}

export function TimelineSection() {
  const data = [
    {
      title: "2007",
      content: (
        <div key="1" className="flex flex-col gap-8">
          <TimelineItem
            title="Songdo"
            facts={[
              "- USD 15.3 million equity financing in the healthcare sector",
            ]}
            imagePath="/timeline/songdo.png"
          />

          <TimelineItem
            title="Gemnet"
            facts={[
              "- USD 14.0 million debt financing in the information technology sector",
            ]}
            imagePath="/timeline/gemnet.png"
          />

          <TimelineItem
            title="Premium Concrete"
            facts={[
              "- MNT 30.0 billion merger and consolidation in the cement industry",
            ]}
            imagePath="/timeline/premium-concrete.png"
          />

          <TimelineItem
            title="Master Group"
            facts={[
              "- MNT 2.0 billion corporate bond issuance in the real estate sector",
              "- USD 10.0 million project financing in the real estate sector",
            ]}
            imagePath="/partners/master group.png"
          />

          <TimelineItem
            title="Tenger Insurance"
            facts={[
              "- MNT 6.0 billion merger and consolidation in the insurance sector",
              "- MNT 2.5 billion liquidation and asset disposal transaction in the mining sector",
            ]}
            imagePath="/timeline/tenger.png"
          />
        </div>
      ),
    },
    {
      title: "2023 Q3",
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Served as Co-Underwriter for LendMN NBFI JSC’s public bond issuance,
            successfully raising MNT 3.0 billion.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Acting as Underwriter, successfully placed a MNT 2.5 billion OTCly
            offered bond of Agro World LLC, an early-stage industrial company,
            to professional investors on the OTC market.
          </p>
        </div>
      ),
    },
    {
      title: "2023 Q4",
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Worked as Lead Underwriter for LendMN NBFI JSC’s MNT 5.0 billion OTC
            debt instrument; successfully placed MNT 3.0 billion in 2023, with
            the remaining MNT 2.0 billion placed in early 2024 through a
            blockchain-based platform under the Sandbox regulatory framework.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Served as Lead Underwriter for Bumbiin Shovkh LLC’s MNT 20.0 billion
            OTC bond. As of March 2024, the full amount was raised and repayment
            completed. Proceeds supported the completion of a mixed-use
            residential and commercial development project.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Provided advisory services on a MNT 40.0 billion debt restructuring
            transaction for a private healthcare company, including financial
            modeling and business / equity valuation.
          </p>
        </div>
      ),
    },
    {
      title: "2024 Q1",
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Acted as Lead Underwriter for GSB Capital NBFI’s MNT 20.0 billion
            OTC debt instrument; completed repayment in 2025 Q1.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Served as Lead Underwriter for LendMN NBFI JSC on a MNT 20.0 billion
            OTC bond issuance and successfully raised MNT 15.0 billion, the
            maximum amount permitted by the Financial Regulatory Commission as
            of 2024 Q4.
          </p>
        </div>
      ),
    },
    {
      title: "2024 Q2",
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Acted as Lead Underwriter for Developing Entrepreneurial Mongolia
            NBFI LLC on a MNT 2.7 billion OTC bond issuance; full proceeds were
            raised repayment completed in 2024 Q3.
          </p>
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Worked as Underwriter for Platin City LLC’s MNT 1.5 billion OTC
            bond, successfully raising the full amount. Proceeds support
            real-estate dealership operations, improving liquidity for property
            buyers and sellers.
          </p>
        </div>
      ),
    },
    {
      title: "2024 Q4",
      content: (
        <div key="2">
          <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
          <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            Participated as Co-Underwriter for Shunkhlai LLC’s MNT 80.0 billion
            public bond issuance, successfully raising MNT 15.0 billion.
          </p>
        </div>
      ),
    },
    {
      title: "2025 Q1",
      content: (
        <div key="3">
          {/* <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
            2025 Track Record
          </p> */}
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Acted as Underwriter for ABTS NBFI LLC, a Japanese-invested
              company, successfully raising a MNT 1.6 billion OTC bond.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Served as Underwriter for Khan-Altai Resource LLC’s MNT 20.0
              billion OTC bond, fully raising the entire amount.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Worked as Underwriter for Premier Investment Group LLC on a MNT
              10.0 billion OTC bond issuance, successfully raising the funds.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2025 Q2",
      content: (
        <div key="3">
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Served as Lead Underwriter for Bers Finance NBFI LLC’s MNT 5.0
              billion OTC debt instrument.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Acted as Lead Underwriter for Eco Car Center LLC’s MNT 9.5 billion
              OTC debt instrument.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Acted as Lead Underwriter for Munkhiin Useg LLC’s MNT 3.5 billion
              OTC bond, successfully raising MNT 3.2 billion.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Served as Lead Underwriter for Alliance Capital NBFI LLC’s MNT 1.6
              billion OTC bond.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Worked as Lead Underwriter for Mongol Alt LLC’s MNT 6.0 billion
              OTC bond.
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "2025 Q3",
      content: (
        <div key="3">
          <div className="mb-8">
            <div className="mb-2 h-px w-24 bg-gradient-to-r from-[rgb(255,153,0)] to-transparent" />
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Acted as Lead Underwriter for Bichil Globus BZG LLC’s MNT 10.0
              billion OTC debt instrument.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Served as Lead Underwriter for Mon Blox LLC’s MNT 3.0 billion OTC
              bond, successfully raising MNT 3.0 billion.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Worked as Lead Underwriter for West Hill LLC’s MNT 2.0 billion OTC
              bond.
            </p>
            <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
              Acted as Lead Underwriter for Finco Capital NBFI LLC’s MNT 3.0
              billion OTC bond.
            </p>
          </div>
        </div>
      ),
    },
    // {
    //   title: "2024",
    //   content: (
    //     <div key="13">
    //       <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
    //         Built and launched Aceternity UI and Aceternity UI Pro from scratch
    //       </p>
    //       <div className="grid grid-cols-2 gap-8 gap-4">
    //         <img
    //           src="https://assets.aceternity.com/templates/startup-1.webp"
    //           alt="startup template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-contain shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           src="https://assets.aceternity.com/templates/startup-2.webp"
    //           alt="startup template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Early 2025",
    //   content: (
    //     <div key="14">
    //       <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
    //         I usually run out of copy, but when I see content this big, I try to
    //         integrate lorem ipsum.
    //       </p>
    //       <p className="mb-8 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
    //         Lorem ipsum is for people who are too lazy to write copy. But we are
    //         not. Here are some more example of beautiful designs I built.
    //       </p>
    //       <div className="grid grid-cols-2 gap-4">
    //         <img
    //           src="https://assets.aceternity.com/pro/hero-sections.png"
    //           alt="hero template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           src="https://assets.aceternity.com/features-section.png"
    //           alt="feature template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   title: "Changelog",
    //   content: (
    //     <div key="15">
    //       <p className="mb-4 text-xs font-normal text-neutral-800 md:text-sm dark:text-neutral-200">
    //         Deployed 5 new components on Aceternity today
    //       </p>
    //       <div className="mb-8">
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Card grid component
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Startup template Aceternity
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Random file upload lol
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Himesh Reshammiya Music CD
    //         </div>
    //         <div className="flex items-center gap-2 text-xs text-neutral-700 md:text-sm dark:text-neutral-300">
    //           ✅ Salman Bhai Fan Club registrations open
    //         </div>
    //       </div>
    //       <div className="grid grid-cols-2 gap-4">
    //         <img
    //           src="https://assets.aceternity.com/pro/hero-sections.png"
    //           alt="hero template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //         <img
    //           src="https://assets.aceternity.com/features-section.png"
    //           alt="feature template"
    //           width={500}
    //           height={500}
    //           className="h-20 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-60"
    //         />
    //       </div>
    //     </div>
    //   ),
    // },
  ];
  return (
    <div className="relative w-full overflow-clip">
      <Timeline data={data} />
    </div>
  );
}
