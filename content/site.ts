/**
 * All site copy and placeholder content lives in this file.
 *
 * Everything marked PLACEHOLDER is temporary and written to be replaced: the
 * founder's bio and quote, the contact email, the three campaigns and their
 * numbers. Nothing else in the codebase needs to change when you swap them.
 */

export const site = {
  name: "Crorepreneur",
  /** The wordmark is set in two voices: a serif "Crore" and a sans "preneur". */
  wordmark: { lead: "Crore", tail: "preneur" },
  title: "Crorepreneur | Influencer marketing on Instagram, by Chabi Gupta",
  description:
    "Crorepreneur is an Instagram influencer marketing agency founded by Chabi Gupta. We match brands with creators their customers trust, produce content people stop for, and track what it earns.",
  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Approach", href: "#approach" },
    { label: "Founder", href: "#founder" },
  ],
  contact: {
    /** PLACEHOLDER: replace with the real inbox. */
    email: "hello@crorepreneur.com",
    subject: "New campaign enquiry",
  },
  /** Add an href to show a link in the footer. Empty entries stay hidden. */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/chabigupta/" },
    { label: "LinkedIn", href: "" },
    { label: "YouTube", href: "" },
  ],
} as const;

export const founder = {
  /** PLACEHOLDER: read from the Instagram handle. Confirm the spelling. */
  name: "Chabi Gupta",
  firstName: "Chabi",
  role: "Founder, Crorepreneur",
  instagram: { handle: "@chabigupta", user: "chabigupta", href: "https://www.instagram.com/chabigupta/" },
  image: {
    /**
     * Replace this one file to swap the portrait: /public/images/founder.webp
     * It is a transparent cutout (WebP with alpha), about 830 x 1250. It is a
     * studio-style AI edit of her photo (styling, tailoring, light); her face is
     * the original photograph. The unedited cutout is kept, unpublished, at
     * /design/founder-original.webp.
     */
    src: "/images/founder.webp",
    alt: "Chabi Gupta, founder of Crorepreneur, smiling, in a tailored black blazer",
    /** Width divided by height of the photo file. Update if the photo changes shape. */
    aspect: 830 / 1250,
    /** Where the portrait fades out at the bottom, as fractions of its height. */
    fade: [0.58, 0.92] as [number, number],
    /** Soft fade at the left and right edges, where the photo crops the sleeves. */
    sideFade: 0.14,
    /** Crop for the small round avatar. */
    avatar: { scale: 2.1, position: "50% 16%" },
  },
};

export const hero = {
  /** Three short lines, set like magazine cover lines. */
  headline: ["Creators.", "Culture.", "Crores."],
  body: "An Instagram influencer marketing agency. We match brands with the creators their customers already trust, and turn those posts into revenue.",
  /** Opens the enquiry form (see `enquiry` below). */
  primaryCta: { label: "Start a Campaign" },
  secondaryCta: { label: "See the work", href: "#work" },
  coverLines: ["Influencer marketing", "Reels and UGC studio", "Creator-led growth"],
} as const;

export const manifesto = {
  /** Lights up word by word as it scrolls past. */
  statement:
    "Attention is cheap. Influence is earned. We find the creators your customers already follow, give them a story worth telling, and put spend behind the posts that sell.",
  body: "One team runs it end to end: discovery, briefs, contracts, content, paid amplification and reporting, measured in revenue rather than reach.",
  categoriesLabel: "Creators we work with",
  categories: ["Beauty", "Fashion", "Food", "Travel", "Tech", "Finance", "Fitness", "Parenting", "Gaming", "Home"],
} as const;

export type Metric = {
  /** Number that counts up, e.g. 240 */
  value: number;
  /** Decimal places to show while counting */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

export type Project = {
  id: string;
  client: string;
  sector: string;
  year: string;
  /** Shown on the 3D phone, like a post caption. */
  handle: string;
  title: string;
  summary: string;
  services: string[];
  headline: Metric;
  supporting: { figure: string; label: string }[];
  /** Two colours for the phone screen artwork. */
  palette: [string, string];
  /** Colour of the glow behind the phone. Any CSS colour or token. */
  tone: string;
  art: "vessels" | "currents" | "glow";
};

export const work = {
  title: "Selected campaigns",
  intro: "Three brands, three different problems, one way of working with creators.",
  /**
   * PLACEHOLDER: these three campaigns and their numbers are illustrative.
   * Replace them with real client work, then set `sampleNotice` to null.
   */
  sampleNotice: "Sample campaigns shown while client case studies are prepared.",
  projects: [
    {
      id: "mitti",
      client: "Mitti",
      sector: "D2C homeware",
      year: "2026",
      handle: "mitti.home",
      title: "42 home creators, one handmade story",
      summary:
        "A ceramics label with loyal buyers and no story. We cast 42 home and lifestyle creators, shot the studio with them, and launched a film series their audiences asked to buy from.",
      services: ["Creator campaigns", "Content studio", "Instagram growth"],
      headline: { value: 240, prefix: "+", suffix: "%", label: "Engagement in 90 days" },
      supporting: [
        { figure: "18.4M", label: "Reel views" },
        { figure: "₹1.2 Cr", label: "Launch-month revenue" },
      ],
      palette: ["#e7b18f", "#7d4f3a"],
      tone: "var(--accent-warm)",
      art: "vessels",
    },
    {
      id: "vayu",
      client: "Vayu Mobility",
      sector: "Electric scooters",
      year: "2026",
      handle: "vayu.rides",
      title: "Test rides booked from creator reels",
      summary:
        "Paid spend was buying clicks, not test rides. We moved budget to partnership ads with 18 auto and city creators and rebuilt the funnel around one action: book a ride.",
      services: ["Paid amplification", "Creator campaigns", "Funnel"],
      headline: { value: 3.8, decimals: 1, suffix: "x", label: "Return on ad spend" },
      supporting: [
        { figure: "12,400", label: "Test rides booked" },
        { figure: "−41%", label: "Cost per test ride" },
      ],
      palette: ["#7fa2ff", "#1c2c6b"],
      tone: "var(--accent-blue)",
      art: "currents",
    },
    {
      id: "glowhaus",
      client: "Glowhaus",
      sector: "Skincare",
      year: "2025",
      handle: "glowhaus",
      title: "120 micro-creators, one routine",
      summary:
        "A strong product drowned out by bigger launches. We seeded 120 micro-creators, turned their routines into ads, and made the brand the one people searched for by name.",
      services: ["Creator campaigns", "UGC", "Paid amplification"],
      headline: { value: 172, prefix: "+", suffix: "%", label: "Branded search" },
      supporting: [
        { figure: "9,000+", label: "UGC videos licensed" },
        { figure: "2.3x", label: "Repeat orders" },
      ],
      palette: ["#c7a8ff", "#4a2a8f"],
      tone: "var(--accent)",
      art: "glow",
    },
  ] satisfies Project[],
};

export const capabilities = {
  title: "What we do",
  intro: "Five services for brands on Instagram. Take the whole system or the part you are missing.",
  items: [
    {
      id: "campaigns",
      name: "Creator Campaigns",
      statement: "The right creators, not just the biggest ones.",
      deliverables: ["Creator discovery and vetting", "Briefs, contracts and usage rights", "Campaign management"],
    },
    {
      id: "studio",
      name: "Content Studio",
      statement: "Reels people watch twice.",
      deliverables: ["Reels and short-form production", "UGC for ads and listings", "Creative direction"],
    },
    {
      id: "amplify",
      name: "Paid Amplification",
      statement: "Put money behind proof.",
      deliverables: ["Partnership ads with creators", "Whitelisting and boosting", "Tracking through to sales"],
    },
    {
      id: "growth",
      name: "Instagram Growth",
      statement: "An account that grows on its own.",
      deliverables: ["Profile and content strategy", "Content calendars", "Community management"],
    },
    {
      id: "founders",
      name: "Founder Brands",
      statement: "Make the founder the brand.",
      deliverables: ["Personal brand strategy", "Founder-led content", "Collaborations and PR"],
    },
  ],
} as const;

export const process = {
  title: ["Find.", "Brief.", "Create.", "Amplify."],
  intro: "The same four moves on every campaign, in this order. Skipping one is how budgets get wasted.",
  chart: {
    axisLabel: "Campaign views, log scale",
    ticks: ["1 L", "10 L", "1 Cr"],
    markLabel: "The crore mark",
    note: "Illustrative curve. Every campaign draws its own.",
  },
  steps: [
    {
      name: "Find",
      text: "Shortlist creators by audience fit, real engagement and past results, not follower count.",
    },
    {
      name: "Brief",
      text: "Give each creator one clear story and the freedom to tell it in their own voice.",
    },
    {
      name: "Create",
      text: "Produce Reels and UGC with them, reviewed against the brief before anything goes live.",
    },
    {
      name: "Amplify",
      text: "Put spend behind the posts that perform and track every rupee through to sales.",
    },
  ],
} as const;

export const founderSection = {
  title: "Meet Chabi.",
  /** PLACEHOLDER: her own words belong here. */
  quote:
    "Too much marketing is judged by how busy it looks. I started Crorepreneur to judge it by what it adds to the business.",
  /** PLACEHOLDER: replace with her real bio. */
  bio: [
    "Chabi Gupta founded Crorepreneur to give brands an influencer partner that thinks like an owner.",
    "She leads strategy on every account and works directly with the creators on the roster.",
  ],
  follow: "Follow on Instagram",
  principles: [
    { name: "Senior hands", text: "The people who pitch are the people who do the work." },
    { name: "Creators first", text: "We pay fairly, brief clearly and let creators sound like themselves." },
    { name: "Revenue first", text: "Every report opens with what the business earned." },
  ],
} as const;

export const cta = {
  figure: "1,00,00,000",
  headline: ["Your next crore", "starts with", "one post."],
  body: "Tell us about the brand and where it needs to be. You will hear back within two working days.",
  button: "Start a Campaign",
} as const;

/** The "Start a Campaign" form. Every button with that label opens it. */
export const enquiry = {
  title: "Start a campaign",
  intro: "Tell us about the brand and where it needs to be. You will hear back within two working days.",
  fields: {
    name: { label: "Your name", placeholder: "Full name" },
    email: { label: "Work email", placeholder: "you@brand.com" },
    company: { label: "Brand or company", placeholder: "Brand name" },
    website: { label: "Website or Instagram", placeholder: "brand.com or @brand" },
    phone: { label: "Phone or WhatsApp", placeholder: "+91" },
    message: {
      label: "About the campaign",
      placeholder: "Goals, timing, the audience you want to reach, anything we should know.",
    },
  },
  servicesLabel: "What do you need?",
  budgetLabel: "Monthly budget",
  budgets: ["Under ₹2 L", "₹2–5 L", "₹5–15 L", "₹15 L+", "Not sure yet"],
  optional: "Optional",
  submit: "Send enquiry",
  sending: "Sending…",
  errors: {
    name: "Please tell us your name.",
    email: "Please enter a valid email address.",
    company: "Please tell us the brand or company.",
  },
  /** Shown after the form hands the enquiry to the visitor's email app (until there is a backend). */
  handedOff: {
    title: "Almost there",
    body: "Your email app has opened with everything filled in. Press send and we will reply within two working days.",
    fallback: "If nothing opened, write to us at",
  },
  /** Shown once a backend has delivered the enquiry. */
  sent: {
    title: "Thank you",
    body: "Your enquiry is with us. We will reply within two working days.",
  },
  close: "Close",
} as const;
