import { ScrollControlProvider } from "@/components/scroll-control";
import { MacbookScrollSection } from "./macbook-scroll";
import Footer from "@/components/sections/footer";
import HeroSection from "./hero-section";
import UnderWriting from "./underwriting";
import Brokerage from "./brokerage";
import WealthManagement from "./wealth-management";
import FAQ from "@/components/sections/faq";

export default function Page() {
    return <ScrollControlProvider>
        <HeroSection />
        <UnderWriting />
        <Brokerage />
        <WealthManagement />
        <MacbookScrollSection />

        <div className="my-40">
            <FAQ />
        </div>

        <Footer />
    </ScrollControlProvider>
}