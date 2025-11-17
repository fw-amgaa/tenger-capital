import AutoScrollGallery from "./auto-scroll-gallery";
import GradientBorderButton from "../../gradient-border-button";
import { motion } from "framer-motion";
import TextCarousel from "../../ui/text-carousel";
import InfoBubbleDialog from "../info-bubble-dialog";

export default function HeroSection({ introDone }: { introDone: boolean }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="section-container mt-32 md:mt-0 md:h-screen relative flex flex-wrap items-center justify-center md:justify-between md:px-16 lg:px-32 xl:px-48 space-y-8 md:gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 40 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="z-10 md:w-[370px] text-center md:text-left"
      >
        <div className="flex items-center gap-4">
          <TextCarousel items={["$1B Assets Under Management", "500,00+ Downloads", "Top 10 Investment Firms (2025)"]} />
          <InfoBubbleDialog items={["As of 9/22/2025.", "500,000+ Downloads: App download numbers are estimates based on anonymous user IDs from both Android and Apple iOS platforms, and may include multiple instances of counting due to changes in IDs over time. Data is as of 4/03/2025, since 2021. This number does not represent TG client count.", "Top 10 Investment Firms (2024), Financial Services Review: This recognition was based on nominations from subscribers of Financial Services Review (“FSR”) who collaborated with the nominated firms. While we purchased a reprint package, including an interview and editorial process, this payment was solely for promotional purposes and did not influence our selection as a Top 10 Investment Firm. The award was determined by FSR’s independent evaluation process, which reviewed nominations for innovation, customer satisfaction, and market presence, and was finalized by a panel of senior financial professionals who are also regular contributors and advisors to FSR. Please note that this recognition does not evaluate client satisfaction, is not representative of client experiences, does not guarantee future performance, and does not serve as an endorsement of TG. It should not be viewed as an assurance of specific results or experiences from engaging TG for investment advisory services."]} />
        </div>
        <h1 className="text-4xl md:text-5xl tracking-tight text-primary mb-4 mt-6">
          Create Value Through Investing
        </h1>
        <p className="text-sm font-light italic text-muted-foreground max-w-xl mx-auto mb-8">
          Brokerage | Underwriting | Advisory and Research | Wealth Management
        </p>

        <div className="flex gap-2">
          <GradientBorderButton>OPEN</GradientBorderButton>
          <GradientBorderButton hasBorder={false} borderAnimation={false}>
            SUBMIT YOUR PROJECT
          </GradientBorderButton>
        </div>
      </motion.div>

      <AutoScrollGallery />
    </motion.main>
  );
}
