import type { Metadata } from "next";
import { about, careers, site } from "@/content/site";
import { ApplyDialog } from "@/components/careers/ApplyDialog";
import { Careers } from "@/components/careers/Careers";
import { Footer } from "@/components/layout/Footer";
import { PageHeader } from "@/components/layout/PageHeader";
import { ScrollStory } from "@/components/motion/ScrollStory";
import { EnquiryDialog } from "@/components/ui/EnquiryDialog";

const title = `${careers.title} | ${site.name}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title,
  description: careers.description,
  alternates: { canonical: "/careers" },
  openGraph: {
    title,
    description: careers.description,
    siteName: site.name,
    type: "website",
    url: "/careers",
  },
};

/**
 * The open role, described for search engines (Google lists it in its job
 * search). No pay is given, as the page gives none.
 */
function jobPosting() {
  const { role } = careers;
  const list = (items: readonly string[]) => `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: role.title,
    description: [
      `<p>${careers.intro}</p>`,
      `<p>${role.team}</p>`,
      `<p>${role.doesLabel}:</p>${list(role.does)}`,
      `<p>${role.looksForLabel}:</p>${list(role.looksFor)}`,
      `<p>${role.goodLabel}:</p>${list(role.good)}`,
    ].join(""),
    datePosted: role.posted,
    employmentType: "INTERN",
    directApply: false,
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
      logo: `${site.url}/brand/email-logo.png`,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: role.city,
        addressRegion: role.region,
        addressCountry: "IN",
      },
    },
  };
}

/** Careers: who we are, and the roles open. Its bar leads back home. */
export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPosting()).replace(/</g, "\\u003c") }}
      />
      <PageHeader back={{ href: "/", label: about.back, short: about.backShort }} />
      <main id="main" className="relative z-10 overflow-x-clip">
        <Careers />
      </main>
      <div className="relative z-10">
        <Footer onHome={false} />
      </div>
      <ScrollStory />
      <EnquiryDialog />
      <ApplyDialog />
    </>
  );
}
