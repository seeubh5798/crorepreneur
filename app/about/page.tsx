import type { Metadata } from "next";
import { about, site } from "@/content/site";
import { AboutHeader } from "@/components/about/AboutHeader";
import { AboutSections } from "@/components/about/AboutSections";
import { Footer } from "@/components/layout/Footer";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { EnquiryDialog } from "@/components/ui/EnquiryDialog";

const title = `${about.title} | ${site.name}`;

export const metadata: Metadata = {
  title,
  description: about.description,
  openGraph: {
    title,
    description: about.description,
    siteName: site.name,
    type: "website",
  },
};

/** The About page: the story, the people, what they believe. Its bar leads back home. */
export default function AboutPage() {
  return (
    <>
      <AboutHeader />
      <main id="main" className="relative z-10 overflow-x-clip">
        <AboutSections />
      </main>
      <div className="relative z-10">
        <Footer onHome={false} />
      </div>
      <ScrollStory />
      <EnquiryDialog />
    </>
  );
}
