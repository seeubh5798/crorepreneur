import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cases, site } from "@/content/site";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { EnquiryDialog } from "@/components/ui/EnquiryDialog";
import { CasePage } from "@/components/work/CasePage";

type Props = { params: Promise<{ id: string }> };

/** One page per case study, written out at build time: /work/sunrise and so on. Any other id is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return cases.items.map((study) => ({ id: study.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const study = cases.items.find((item) => item.id === id);
  if (!study) return {};
  const title = `${study.name} | ${cases.page.label} | ${site.name}`;
  return {
    metadataBase: new URL(site.url),
    title,
    description: study.line,
    alternates: { canonical: `/work/${study.id}` },
    openGraph: {
      title,
      description: study.line,
      siteName: site.name,
      type: "article",
      url: `/work/${study.id}`,
      images: [{ url: study.card.image, alt: study.card.alt }],
    },
  };
}

/** A case study: its video, its story, the next case. Its bar leads back to the rest of the work. */
export default async function CaseStudyPage({ params }: Props) {
  const { id } = await params;
  const at = cases.items.findIndex((item) => item.id === id);
  if (at < 0) notFound();
  const study = cases.items[at];
  const next = cases.items[(at + 1) % cases.items.length];

  return (
    <>
      <PageHeader back={{ href: "/#work", label: cases.page.back, short: cases.page.backShort }} />
      <main id="main" className="relative z-10 overflow-x-clip">
        <CasePage study={study} next={next} />
      </main>
      <div className="relative z-10">
        <Footer onHome={false} />
      </div>
      <ScrollStory />
      <EnquiryDialog />
    </>
  );
}
