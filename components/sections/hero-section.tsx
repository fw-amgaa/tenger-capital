import AutoScrollGallery from "../auto-scroll-gallery";
import GradientBorderButton from "../gradient-border-button";
import { motion } from "framer-motion";

export default function HeroSection({ introDone }: { introDone: boolean }) {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: introDone ? 1 : 0 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="mt-32 md:mt-0 md:max-h-screen relative flex flex-wrap items-center justify-center md:justify-between lg:px-16 xl:px-32 space-y-8 md:gap-8"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: introDone ? 1 : 0, y: introDone ? 0 : 40 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="z-10 md:w-[360px] text-center md:text-left"
      >
        <h1 className="text-4xl md:text-5xl tracking-tight text-primary mb-4">
          Wealth Manager In Your Pocket
        </h1>
        <p className="text-lg font-light text-muted-foreground max-w-xl mx-auto mb-8">
          From RSUs to tax planning, investing, and everything in between. Our
          wealth and investment teams handle complexity so you don’t have to.
        </p>

        <GradientBorderButton>OPEN</GradientBorderButton>
      </motion.div>

      <AutoScrollGallery />
    </motion.main>
  );
}
