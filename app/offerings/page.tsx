import { ScrollControlProvider } from "@/components/scroll-control";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import Brokerage from "./brokerage";
import HeroSection from "./hero-section";
import { MacbookScrollSection } from "./macbook-scroll";
import UnderWriting from "./underwriting";
import WealthManagement from "./wealth-management";

export default function Page() {

    return <ScrollControlProvider>
        <Header />

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