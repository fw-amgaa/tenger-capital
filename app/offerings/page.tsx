import { ScrollControlProvider } from "@/components/scroll-control";
import { MacbookScrollSection } from "./macbook-scroll";
import Footer from "@/components/sections/footer";

export default function Page() {
    return <ScrollControlProvider>
        <MacbookScrollSection />

        <Footer />
    </ScrollControlProvider>
}