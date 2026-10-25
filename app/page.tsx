import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { Capabilities } from "@/components/sections/Capabilities";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { Proof } from "@/components/sections/Proof";
import { EnquiryDialog } from "@/components/ui/EnquiryDialog";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero />
        <Manifesto />
        <Proof />
        <CaseStudies />
        <Capabilities />
        <Process />
        <Founder />
        <FinalCTA />
      </main>
      <div className="relative z-10">
        <Footer />
      </div>
      <ScrollStory />
      <EnquiryDialog />
    </>
  );
}
