"use client";

import { animate } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import GradientBorderButton from "../gradient-border-button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/language-context";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="p-4">
      <div className="relative flex flex-col gap-4 lg:gap-8 lg:pt-[3rem] px-16">
        <div
          className={cn(
            "relative grid h-full gap-[5rem] rounded-[2rem] grid-cols-1 grid-rows-[1fr] lg:grid-cols-3 px-[2rem] pt-[2.5rem] pb-[4rem] lg:p-[3rem] lg:pb-[5rem] lg:gap-0 bg-white",
            // "md:min-h-[40rem] lg:min-h-[50rem]"
            "md:min-h-[20rem] lg:min-h-[30rem]"
          )}
        >
          <div className="flex h-full flex-col justify-between max-md:items-center">
            <button
              onClick={() =>
                animate(window.scrollY, 0, {
                  duration: 1.2,
                  ease: [0.22, 1, 0.36, 1],
                  onUpdate: (v) => window.scrollTo(0, v),
                })
              }
              className="type-btn text-black flex items-center gap-[1rem] opacity-[.5] transition-opacity duration-300 hover:opacity-100 text-sm mb-4 md:mb-0 cursor-pointer"
            >
              {t("Back to top")}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="8"
                fill="none"
              >
                <path
                  fill="currentColor"
                  d="M5 3.006.833 7.173l.584.583L5 4.173l3.583 3.583.584-.583zm-5-2.5h10v.833H0z"
                ></path>
              </svg>
            </button>

            <Image
              src={"/logo/logo_main_dark.png"}
              alt="logo"
              width={128}
              height={50}
            />
          </div>

          <div className="flex h-full flex-col justify-between items-center">
            <div className="flex flex-col gap-[4rem] lg:flex-row lg:gap-[30%]">
              <div className="text-black type-xs flex flex-col gap-2 text-center lg:text-left">
                <h4 className="text-sm opacity-[.4]">{t("Tenger Capital")}</h4>
                <ul className="flex flex-col text-sm">
                  <li>
                    <Link
                      className="relative w-fit inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/"
                    >
                      {t("Home")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/about"
                    >
                      {t("About")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/offerings"
                    >
                      {t("What We Offer")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      className="relative w-fit pt-[.2rem] lg:pt-[.35rem] inline-block pb-[.1rem] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
                      target="_self"
                      href="/submit-form"
                    >
                      {t("Submit A Form")}
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-black text-xs max-lg:hidden tracking-wide">
              {t("footer.copyright")}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end justify-between max-lg:w-full lg:h-full">
            <GradientBorderButton mode="light" borderAnimation={false}>
              {t("OPEN AN ACCOUNT")}
            </GradientBorderButton>
            <div className="text-black flex flex-col items-center justify-center gap-[3rem] max-lg:w-full mt-8 md:mt-0">
              <div className="flex gap-[1.5rem] lg:ml-auto">
                <Link
                  target="_blank"
                  aria-label="Social link for x"
                  className="flex-center"
                  href="https://x.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M9.514.001h1.852L7.32 4.64l4.762 6.311H8.353L5.43 7.123l-3.34 3.827H.238l4.329-4.962L0 .002h3.823L6.46 3.5zM8.862 9.84h1.027L3.262 1.055H2.16z"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for linkedin"
                  className="flex-center"
                  href="https://www.linkedin.com/company/TG-invest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M3.05 1.219a1.216 1.216 0 1 1-2.434-.002 1.216 1.216 0 0 1 2.433.002m.036 2.116H.653v7.615h2.433zm3.844 0H4.509v7.615h2.396V6.954c0-2.226 2.901-2.433 2.901 0v3.996h2.403V6.127c0-3.753-4.294-3.613-5.304-1.77z"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for youtube"
                  className="flex-center"
                  href="https://www.youtube.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="11"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="m7 7.822 4.058-2.346L7 3.13zm9.04-6.124c.102.368.172.86.219 1.486.055.626.078 1.166.078 1.635l.047.657c0 1.712-.125 2.971-.344 3.777-.196.704-.65 1.157-1.353 1.353-.368.101-1.04.172-2.072.219a52 52 0 0 1-2.808.078l-1.243.047c-3.277 0-5.318-.125-6.124-.344-.704-.196-1.157-.65-1.353-1.353-.101-.368-.172-.86-.219-1.486A19 19 0 0 1 .79 6.133l-.047-.657c0-1.713.125-2.972.344-3.778C1.283.995 1.737.541 2.44.346 2.808.244 3.48.174 4.513.126A52 52 0 0 1 7.32.049L8.564.001c3.276 0 5.317.126 6.123.345.704.195 1.157.649 1.353 1.352"
                    ></path>
                  </svg>
                </Link>
                <Link
                  target="_blank"
                  aria-label="Social link for instagram"
                  className="flex-center"
                  href="https://www.instagram.com/TGvest"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="13"
                    height="13"
                    fill="none"
                  >
                    <path
                      fill="currentColor"
                      d="M4.422.436h5.074A3.506 3.506 0 0 1 13 3.939v5.074a3.503 3.503 0 0 1-3.504 3.503H4.422A3.506 3.506 0 0 1 .92 9.013V3.939A3.503 3.503 0 0 1 4.422.436m-.12 1.208a2.175 2.175 0 0 0-2.175 2.174v5.316c0 1.202.973 2.174 2.175 2.174h5.315a2.175 2.175 0 0 0 2.174-2.174V3.818a2.173 2.173 0 0 0-2.174-2.174zm5.828.906a.755.755 0 1 1 0 1.51.755.755 0 0 1 0-1.51m-3.17.906a3.02 3.02 0 1 1 0 6.04 3.02 3.02 0 0 1 0-6.04m0 1.208a1.812 1.812 0 1 0 0 3.624 1.812 1.812 0 0 0 0-3.624"
                    ></path>
                  </svg>
                </Link>
              </div>
              <p className="text-black text-[0.9rem] font-[400] text-balance max-lg:text-center max-lg:opacity-50 lg:hidden">
                {t("footer.copyright")}
              </p>
            </div>
          </div>
        </div>

        {/* <div className="bg-[#191919] leading-[1.4] text-xs rounded-[2rem] p-8 opacity-[0.8] text-[#f8f8f8CC)] [&amp;_p:not(:last-child)]:mb-[1em]">
          <p className="mb-2 font-bold text-base mt-4">1. General Provisions</p>

          <p className="mb-2">
            <strong>1.1. Introduction and Acceptance</strong>
          </p>
          <p className="mb-2">
            These Terms and Conditions (the &quot;Agreement&quot;) govern the
            provision of services by <strong>Tenger Capital LLC</strong>{" "}
            (registration number [Insert Registration Number]), a financial
            institution licensed and regulated by the Financial Regulatory
            Commission (FRC) of Mongolia, with its registered office in
            Ulaanbaatar, Mongolia (hereinafter referred to as &quot;Tenger
            Capital,&quot; the &quot;Company,&quot; &quot;we,&quot;
            &quot;us,&quot; or &quot;our&quot;).
          </p>
          <p className="mb-2">
            By opening an account, engaging in any transaction, or using any
            service provided by Tenger Capital, the client (the
            &quot;Client&quot; or &quot;you&quot;) acknowledges and agrees to be
            bound by this Agreement.
          </p>

          <p className="mb-2">
            <strong>1.2. Regulatory Framework</strong>
          </p>
          <p className="mb-2">
            Tenger Capital is authorized to operate in Mongolia and is primarily
            governed by, but not limited to, the following Mongolian legislation
            &quot;Applicable Laws&quot;): The Law on the Securities
            Market,&nbsp;The Law on Non-Bank Financial Activities (as applicable
            to specific licensed activities),&nbsp;The Law on Combating Money
            Laundering and Terrorist Financing,&nbsp;The Civil Code of
            Mongolia,&nbsp;and The Law on the Legal Status of the Financial
            Regulatory Commission (FRC).
          </p>
          <p className="mb-2">
            In the event of any conflict between this Agreement and the
            Applicable Laws, the{" "}
            <strong>Applicable Laws of Mongolia shall prevail</strong>.
          </p>

          <p className="mb-2">
            <strong>1.3. Services Provided</strong>
          </p>
          <p className="mb-2">
            Tenger Capital provides services including, but not limited
            to:&nbsp;<strong>Brokerage Services:</strong> Execution of buy and
            sell orders for securities on regulated markets.&nbsp;
            <strong>Underwriting Services:</strong> Facilitation of issuance and
            distribution of securities (IPO, SEO, etc.).&nbsp;
            <strong>
              Wealth Management & Investment Advisory Services:
            </strong>{" "}
            Portfolio management, financial planning, and investment
            recommendations.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            2. Disclaimers and Risk Disclosure
          </p>

          <div className="mb-2 p-3 border border-red-600 bg-red-900 bg-opacity-20 rounded">
            <p className="mb-2 font-bold text-red-500">
              2.1. Investment Risk Disclaimer
            </p>
            <p className="mb-2 text-red-400">
              <strong>ALL INVESTMENTS CARRY RISK.</strong> The value of
              securities and investments can fall as well as rise, and the
              Client may not recover the amount originally invested. Past
              performance is not an indicator or guarantee of future results.
              Tenger Capital does not guarantee the return of the Client&apos;s
              principal or any investment profits.
            </p>
          </div>

          <p className="mb-2">
            <strong>2.2. Non-Reliance on Company Information</strong>
          </p>
          <p className="mb-2">
            Any information, analysis, or recommendations provided by Tenger
            Capital are based on sources believed to be reliable, but no
            representation or warranty, express or implied, is made as to their
            accuracy, completeness, or fairness.{" "}
            <strong>
              The Client shall not rely solely on the information provided by
              Tenger Capital
            </strong>{" "}
            and must conduct their own independent assessment of the
            appropriateness of any transaction in light of their personal
            objectives, financial circumstances, and risk tolerance.
          </p>

          <p className="mb-2">
            <strong>2.3. No Fiduciary Duty (General Brokerage)</strong>
          </p>
          <p className="mb-2">
            Unless Tenger Capital explicitly enters into a written discretionary
            portfolio management agreement creating a fiduciary relationship,
            Tenger Capital acts as an{" "}
            <strong>execution-only or advisory-only service provider</strong>.
            In such cases, Tenger Capital has no fiduciary duty to the Client
            regarding the suitability of self-directed trades or unsolicited
            investment decisions made by the Client.
          </p>

          <p className="mb-2">
            <strong>2.4. Market and Economic Conditions</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall not be liable for any loss arising from events
            beyond its reasonable control, including, but not limited to,
            government restrictions, changes in Mongolian or international
            financial regulations, market volatility, force majeure events, or
            technological failures.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            3. Client Obligations and Representations
          </p>

          <p className="mb-2">
            <strong>3.1. Know Your Client (KYC) and Due Diligence</strong>
          </p>
          <p className="mb-2">
            In compliance with the{" "}
            <strong>
              Law on Combating Money Laundering and Terrorist Financing
            </strong>
            , the Client must provide accurate, complete, and current personal
            and financial information, including the source of funds. The Client
            agrees to promptly notify Tenger Capital of any changes to this
            information.
          </p>

          <p className="mb-2">
            <strong>3.2. Legal Capacity and Authority</strong>
          </p>
          <p className="mb-2">
            The Client represents and warrants that they have the full legal
            capacity and authority to enter into this Agreement and to engage in
            all transactions contemplated herein.
          </p>

          <p className="mb-2">
            <strong>3.3. Client Assets Segregation</strong>
          </p>
          <p className="mb-2">
            In accordance with the <strong>Law on the Securities Market</strong>
            , Tenger Capital is required to segregate client assets from the
            Company&apos;s proprietary assets. Client assets will be held in
            separate accounts or custodians to ensure the protection of investor
            interests.
          </p>

          <p className="mb-2">
            <strong>3.4. Confidentiality and Data Protection</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall maintain the confidentiality of Client
            information in accordance with Mongolian law. However, the Client
            acknowledges that Tenger Capital may be required to disclose
            information to the{" "}
            <strong>
              Financial Regulatory Commission (FRC), the Bank of Mongolia, or
              other governmental and judicial authorities
            </strong>{" "}
            as required by law.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            4. Execution and Settlement of Transactions
          </p>

          <p className="mb-2">
            <strong>4.1. Best Execution</strong>
          </p>
          <p className="mb-2">
            Tenger Capital shall strive to execute Client orders in accordance
            with the principles of <strong>best execution</strong>, considering
            price, cost, speed, likelihood of execution and settlement, size,
            nature, and any other relevant consideration, in compliance with the{" "}
            <strong>Law on the Securities Market</strong>.
          </p>

          <p className="mb-2">
            <strong>4.2. Fees and Charges</strong>
          </p>
          <p className="mb-2">
            The Client agrees to pay all fees, commissions, and charges
            associated with the services and transactions as outlined in Tenger
            Capital&apos;s separate fee schedule, which may be amended from time
            to time with reasonable notice to the Client.
          </p>

          <p className="mb-2">
            <strong>4.3. Market Manipulation and Insider Trading</strong>
          </p>
          <p className="mb-2">
            The Client is strictly prohibited from engaging in any activity that
            constitutes{" "}
            <strong>
              market manipulation, insider trading, or other fraudulent
              practices
            </strong>{" "}
            under the Applicable Laws. Any such activity may result in the
            immediate termination of services and reporting to the FRC and law
            enforcement authorities.
          </p>

          <hr className="border-gray-700 my-4" />

          <p className="mb-2 font-bold text-base mt-4">
            5. Termination and Governing Law
          </p>

          <p className="mb-2">
            <strong>5.1. Termination</strong>
          </p>
          <p className="mb-2">
            Tenger Capital may terminate this Agreement immediately upon written
            notice to the Client if the Client breaches any provision of this
            Agreement or if required by the FRC or other regulatory authority.
          </p>

          <p className="mb-2">
            <strong>5.2. Governing Law</strong>
          </p>
          <p className="mb-2">
            This Agreement and all disputes, claims, or controversies arising
            out of or relating to this Agreement, or the breach thereof, shall
            be governed by and construed in accordance with the{" "}
            <strong>laws of Mongolia</strong>, without regard to its conflict of
            laws principles.
          </p>

          <p className="mb-2">
            <strong>5.3. Dispute Resolution</strong>
          </p>
          <p className="mb-2">
            Any dispute, controversy, or claim arising out of or relating to
            this Agreement shall first be subject to good faith negotiation
            between the parties. If the dispute cannot be resolved, it shall be
            submitted to the competent <strong>courts of Mongolia</strong> in
            Ulaanbaatar.
          </p>

          <p className="mb-2"></p>
          <p className="mb-2 text-center font-bold p-2 bg-opacity-20 rounded">
            By continuing to use Tenger Capital&apos;s services, you affirm your
            acceptance of these Terms and Conditions.
          </p>

          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
          <ul></ul>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;
