import { ScrollControlProvider } from "@/components/scroll-control";
import HeroSection from "./hero-section";
import LetterFromCeo from "./letter-from-ceo";
import Footer from "@/components/sections/footer";
import { TimelineSection } from "./timeline";
import TeamMembers from "@/components/sections/team-members";
import KeyFigures from "./key-figures";
import GuidingPrinciples from "./guiding-principles";
import Personalized from "./personalized";
import Header from "@/components/sections/header";

export default function Page() {
  return (
    <ScrollControlProvider>
      <Header />
      <HeroSection />
      <LetterFromCeo />
      <KeyFigures />
      <GuidingPrinciples />
      <TeamMembers showTitle={false} />
      <Personalized />
      <div className="mb-24">
        <TimelineSection />
      </div>
      <Footer />
    </ScrollControlProvider>
  );
}
