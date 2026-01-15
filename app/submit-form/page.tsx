import { ScrollControlProvider } from "@/components/scroll-control";
import FAQ from "@/components/sections/faq";
import Footer from "@/components/sections/footer";
import Header from "@/components/sections/header";
import { ContactForm } from "./form";

export default function SubmitFormPage() {
  return (
    <ScrollControlProvider>
      <Header />

      <div className="section-container text-8xl h-screen flex items-center justify-center">
        REACH OUT TO US
      </div>

      <ContactForm />

      <div className="my-16 md:my-32">
        <FAQ />
      </div>

      <Footer />
    </ScrollControlProvider>
  );
}
