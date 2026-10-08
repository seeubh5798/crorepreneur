import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { Capabilities } from "@/components/sections/Capabilities";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Founder } from "@/components/sections/Founder";
import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Process } from "@/components/sections/Process";
import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { Stage3D } from "@/components/three/Stage3D";
import { EnquiryDialog } from "@/components/ui/EnquiryDialog";

export default function Home() {
  return (
    <>
      <Stage3D />
      <Navbar />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Hero />
        <Manifesto />
        <ProjectShowcase />
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
