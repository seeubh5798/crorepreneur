/**
 * All site copy and placeholder content lives in this file.
 *
 * Everything marked PLACEHOLDER is temporary and written to be replaced: for
 * now, only the contact email. Nothing else in the codebase needs to change
 * when you swap it.
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
  /** The About page, linked from the navigation, the founder section and the footer. */
  about: { label: "About", href: "/about" },
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
  coverLines: ["Hyperlocal campaigns", "Local-language creators", "City-by-city rollouts"],
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

/** A piece of work: a campaign, a strategy project, or the page itself. */
export type CaseStudy = {
  id: string;
  /** Who it was for. */
  client: string;
  /** What kind of work, shown on the image. */
  kind: string;
  date: string;
  title: string;
  summary: string;
  /** Short facts, such as who starred in it. */
  facts?: string[];
  /** Numbers from the post itself, as of October 2026. */
  stats?: { figure: string; label: string }[];
  /** `position` is the CSS object-position, for images cropped to the card. */
  image: { src: string; alt: string; position?: string };
  link: { label: string; href: string };
  /** A second link, such as the client's own post. */
  also?: { label: string; href: string };
};

export const work = {
  title: "Selected work",
  intro: "Campaigns made with creators for brands, a state tourism board and local retail, and the strategy behind them.",
  /** Counted up as they scroll into view. */
  highlights: [
    { value: 177, suffix: "K", label: "Followers on @yourregularmom" },
    { value: 35, suffix: "M", label: "Views on our best reel" },
    { value: 50, suffix: "x", label: "Store footfall in one month" },
    { value: 12.5, decimals: 1, suffix: "K", label: "Likes on one festive reel" },
  ] satisfies Metric[],
  featured: {
    id: "netflix-maa-behen",
    client: "Netflix India",
    kind: "Film launch",
    date: "June 2026",
    title: "Maa Behen, launched by a real mother and daughter",
    summary:
      "For the release of Maa Behen, Chabi and her mother Anita joined Madhuri Dixit, Tripti Dimri and Dharna Durga on the film's press set and did what @yourregularmom does best: swap desi mum stories in their own dialect. A meme cold open, a skit with the cast, and one clear line to close: now streaming on Netflix.",
    facts: ["With Madhuri Dixit, Tripti Dimri and Dharna Durga", "Shot on the film's press set", "Posted on @yourregularmom"],
    stats: [
      { figure: "3,157", label: "likes" },
      { figure: "89", label: "comments" },
    ],
    image: {
      src: "/images/work/netflix-maa-behen.webp",
      alt: "Madhuri Dixit laughing with Tripti Dimri and Dharna Durga in front of a Netflix Maa Behen poster",
    },
    link: { label: "Watch the reel", href: "https://www.instagram.com/reel/DZUgpaBuS41/" },
  } satisfies CaseStudy,
  /** A comment left on the featured reel. */
  featuredQuote: { text: "I will watch movie because of this promo!", by: "A comment on the reel" },
  campaignsTitle: "Brand campaigns",
  campaigns: [
    {
      id: "sunrise-chhath",
      client: "ITC Sunrise Masale",
      kind: "Festive campaign",
      date: "October 2025",
      title: "Chhath, the way families tell it",
      summary:
        "For Urja Ka Vardan, Sunrise put Chhath stories, puja timings and Chhath songs sung by Maithili Thakur on WhatsApp. Anita brought it to the families who keep the festival, in their own language.",
      stats: [
        { figure: "12,592", label: "likes" },
        { figure: "22", label: "comments" },
      ],
      image: { src: "/images/work/sunrise-chhath.webp", alt: "Anita Gupta in an orange saree, preparing for Chhath", position: "50% 38%" },
      link: { label: "Watch the reel", href: "https://www.instagram.com/reel/DQMbSL9kqRK/" },
    },
    {
      id: "horlicks",
      client: "Horlicks",
      kind: "In-store offer",
      date: "December 2025",
      title: "A grandparent's afternoon, and a free milkshake",
      summary:
        "A quiet afternoon with the grandchild, a cup of Horlicks, and the milkshake that came free with the 500 g jar. A family moment first, then a nudge to look for the offer at the local store.",
      stats: [
        { figure: "751", label: "likes" },
        { figure: "10", label: "comments" },
      ],
      image: { src: "/images/work/horlicks.webp", alt: "A small child beside a jar of Horlicks", position: "50% 75%" },
      link: { label: "Watch the reel", href: "https://www.instagram.com/reel/DSSZR-bksiI/" },
    },
    {
      id: "jharkhand-tourism",
      client: "Jharkhand Tourism",
      kind: "State tourism",
      date: "May 2026",
      title: "Jharkhand, from Ranchi to the world",
      summary:
        "At Jharkhand's first State Level Influencer Meet, in Patratu, the Tourism Department launched a portal that connects creators with the government to tell the state's story. Chabi was one of the 100+ creators there, to give its waterfalls, forests, food and people a bigger stage.",
      stats: [
        { figure: "100+", label: "creators at the meet" },
        { figure: "2,214", label: "likes on Chabi's post" },
      ],
      image: {
        src: "/images/work/jharkhand-tourism.webp",
        alt: "Creators and officials at the Jharkhand Tourism State Level Influencers Meet",
      },
      link: { label: "See Chabi's post", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
      also: { label: "JTDC's post", href: "https://www.instagram.com/p/DYRCfAAjBby/" },
    },
  ] satisfies CaseStudy[],
  strategyTitle: "Strategy and consulting",
  strategy: [
    {
      id: "jewellery-jharkhand",
      client: "Jewellery retailer, Jharkhand",
      kind: "Local marketing",
      date: "March 2025",
      title: "Kuch Naya Sochte Hai: 50x footfall in a month",
      summary:
        "A new luxury flagship was putting off the tier-2 shoppers who built the brand. A SWOT analysis pointed back to its local roots: well-loved local faces, stories tied to regional traditions, and a message that it was still for them, on regional TV, in cinemas, in local papers and on billboards across the city.",
      stats: [{ figure: "50x", label: "store footfall within a month" }],
      image: { src: "/images/work/jewellery-jharkhand.webp", alt: "A mother and daughter laughing together in a jewellery showroom" },
      link: {
        label: "Read the case study",
        href: "https://www.linkedin.com/posts/chabi-gupta-cg_marketingstrategy-swotanalysis-retailconsulting-ugcPost-7301859308042874880-gDep/",
      },
    },
    {
      id: "microsoft-copilot",
      client: "Microsoft",
      kind: "Growth strategy",
      date: "February 2024",
      title: "Growing Copilot's free and Pro users",
      summary:
        "For Kelley MBA's Spring Intensive with Microsoft, Chabi's team planned how Copilot could win users and keep them. They built personas such as Carol the Alchemist, proposed reaching small businesses on LinkedIn, Instagram, TikTok and Pinterest with reasons to teach their own audiences, and made a directional ad.",
      facts: ["Kelley School of Business, Indiana University"],
      image: {
        src: "/images/work/microsoft-copilot.webp",
        alt: "A black-and-white frame from the team's directional ad: Chabi, captioned as an Instagram influencer",
      },
      link: {
        label: "Read on LinkedIn",
        href: "https://www.linkedin.com/posts/chabi-gupta-cg_microsoft-kelleyschoolofbusiness-iu-ugcPost-7168869625051525121-4osX/",
      },
    },
    {
      id: "ben-olive-mill",
      client: "Ben Olive Mill, Greece",
      kind: "Growth strategy",
      date: "April 2023",
      title: "An olive mill in Kalamata, made for families",
      summary:
        "A sustainable growth plan for an olive mill tour in Kalamata. The team found its biggest draw, wide farms where American families can slow down together, and turned the visit into a short documentary, scripted in fifteen minutes on the day.",
      facts: ["Kelley School of Business, Indiana University"],
      image: { src: "/images/work/ben-olive-mill.webp", alt: "Visitors at a tasting table among olive trees" },
      link: {
        label: "Read on LinkedIn",
        href: "https://www.linkedin.com/posts/chabi-gupta-cg_greeceexperience-olivemill-teamwork-ugcPost-7053638544828887040-EVZp/",
      },
    },
  ] satisfies CaseStudy[],
  /** The page it started on. Follower and post counts as of October 2026. */
  channel: {
    handle: "@yourregularmom",
    names: "Anita Gupta & Chabi Gupta",
    title: "The page where it started",
    summary:
      "Chabi started @yourregularmom with her mother in 2020: family comedy in Bihari, from Ranchi and Chicago. A reel about a Gucci belt passed 4 million views, with a like from Priyanka Chopra. Brands from Big Bazaar to Netflix have worked with the page since.",
    stats: [
      { figure: "177K", label: "followers" },
      { figure: "867", label: "posts" },
      { figure: "35M", label: "views on the best reel" },
    ],
    image: { src: "/images/work/yourregularmom.webp", alt: "Chabi Gupta laughing beside her mother, Anita, who wears a yellow saree" },
    link: { label: "Follow on Instagram", href: "https://www.instagram.com/yourregularmom/" },
  },
  press: {
    outlet: "Forbes India",
    date: "July 2022",
    headline: "From Bihari to Kashmiri, the rise and rise of regional Indian digital content stars",
    quote:
      "There is recognition and fame, and I owe it to the power of Instagram and to the language that made us stand out in the crowd.",
    by: "Chabi Gupta, in Forbes India",
    link: {
      label: "Read the feature",
      href: "https://www.forbesindia.com/article/2022-india039s-top-digital-stars/from-bihari-to-kashmiri-the-rise-and-rise-of-regional-indian-digital-content-stars/78465/1",
    },
  },
};

/** The one service: hyperlocal creator campaigns, for companies running campaigns. */
export const capabilities = {
  title: "What we do",
  intro: "One service, done properly: creator campaigns that sound local in every city they run in.",
  offering: {
    name: "Hyperlocal Campaigns",
    statement: "Speak like the city you sell to.",
    body: "For companies running campaigns across India. We cast creators from the cities you want to reach, in their own language and dialect, and build the campaign around what their audience talks about at home: family, food, festivals, the neighbourhood. One brief, and every city hears it in its own words.",
    includesLabel: "What a campaign includes",
    includes: [
      "Creators cast city by city, by language, dialect and audience",
      "Scripts and skits rooted in local life, written with the creators",
      "Shoots at home, on location, or at your launch, premiere or event",
      "Rollout across cities, with partnership ads behind what works",
      "Reporting city by city, through to sales",
    ],
    madeForLabel: "Made for",
    madeFor: ["Film and OTT releases", "Product launches", "Store and restaurant openings", "Festive campaigns", "Regional rollouts"],
  },
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
  /** Her own words, from LinkedIn (June 2026). */
  quote:
    "I didn't get this collaboration because I had the biggest numbers in the room. I got it because I had the most specific story in the room.",
  bio: [
    "Chabi grew up in Jharkhand and built @yourregularmom with her mother from a town most marketers overlook: 177K followers, a Forbes India Top 100 Digital Star, and campaigns for Netflix, ITC and Horlicks.",
    "She brings an MBA from Indiana University's Kelley School of Business, and consulting work for Microsoft, Ecolab and a Jharkhand jeweller, to every brief.",
  ],
  aboutLink: "Read our story",
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
    cities: { label: "Cities or regions", placeholder: "Ranchi, Patna, all of Jharkhand…" },
    phone: { label: "Phone or WhatsApp", placeholder: "+91" },
    message: {
      label: "About the campaign",
      placeholder: "Goals, timing, the audience you want to reach, anything we should know.",
    },
  },
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

/**
 * The About page (/about). Facts from the founders' LinkedIn profiles and
 * posts, and from Forbes India, as of October 2026.
 */
export const about = {
  title: "About us",
  description:
    "Crorepreneur is a hyperlocal creator marketing agency with its roots in Ranchi, founded by Chabi Gupta, with Shubham Kumar Agrawal behind its technology.",
  back: "Back to home",
  backShort: "Back",
  headline: ["Stop chasing reach.", "Chase resonance."],
  headlineBy: "Chabi Gupta, founder",
  intro:
    "Crorepreneur is a hyperlocal creator marketing agency with its roots in Ranchi, Jharkhand. We make campaigns in the languages, cultures and places that mainstream media called too niche to matter, and we keep finding what our audience knew all along: niche is just another word for loyal.",
  storyTitle: "How we got here",
  storyIntro: "From a family comedy page in Ranchi to campaigns for Netflix, ITC and a state tourism board.",
  story: [
    {
      year: "2020",
      title: "@yourregularmom begins",
      text: "Chabi starts a page with her mother, Anita: family comedy in Bihari, filmed at home in Ranchi.",
    },
    {
      year: "2022",
      title: "Forbes India's Top 100 Digital Stars",
      text: "A reel about a Gucci belt passes 4 million views, and Forbes India features the duo among the regional creators who put language and culture first.",
    },
    {
      year: "2024",
      title: "An MBA from Kelley",
      text: "Chabi completes her MBA at Indiana University's Kelley School of Business, with consulting projects for Microsoft, Ecolab and Ben Olive Mill.",
    },
    {
      year: "2025",
      title: "Campaigns at home",
      text: "Kuch Naya Sochte Hai lifts a Jharkhand jeweller's footfall 50x in a month, campaigns for ITC Sunrise and Horlicks follow, and Tata Steel invites Chabi to speak on International Women's Day.",
    },
    {
      year: "2026",
      title: "Netflix, and Jharkhand Tourism",
      text: "Maa Behen with Madhuri Dixit, for a film that reached No. 2 on Netflix's global Top 10 for non-English films, and a seat at Jharkhand's first State Level Influencer Meet.",
    },
  ],
  teamTitle: "The people behind it",
  teamIntro: "A marketer who built her audience from a town in Jharkhand, and an engineer who builds what runs underneath.",
  team: [
    {
      id: "chabi",
      name: "Chabi Gupta",
      role: "Founder",
      line: "Strategy, creators and every campaign.",
      /** The headline credential, shown beside the name. */
      badge: "MBA, Kelley School of Business",
      image: {
        src: "/images/founder.webp",
        alt: "Chabi Gupta, smiling, in a tailored black blazer",
        /** Width divided by height of the cutout. */
        aspect: 830 / 1250,
        /** Height of the figure and where its top sits, as shares of the frame's height. */
        height: 1.3,
        top: 0.24,
        /** How far in from each side the figure fades, as a share of its width. */
        sideFade: 0.06,
      },
      bio: [
        "Chabi grew up in Jharkhand, the daughter of a forest department officer. Her career ran from engineering to analytics and product management, at Sabre, Gametion and BYJU'S, before it found marketing.",
        "In 2020 she started @yourregularmom with her mother. It has grown to 177K followers, its best reel has passed 35 million views, and it put her among Forbes India's Top 100 Digital Stars. Along the way she took an MBA at Indiana University's Kelley School of Business.",
      ],
      credentials: [
        "MBA, Kelley School of Business, Indiana University",
        "Forbes India Top 100 Digital Star",
        "Creator of @yourregularmom, 177K followers",
        "Formerly at Sabre, Gametion and BYJU'S",
      ],
      links: [
        { label: "LinkedIn", href: "https://www.linkedin.com/in/chabi-gupta-cg/" },
        { label: "Instagram", href: "https://www.instagram.com/chabigupta/" },
      ],
    },
    {
      id: "shubham",
      name: "Shubham Kumar Agrawal",
      role: "Technology",
      line: "The tech behind Crorepreneur's products and offerings.",
      badge: "IIT Bhubaneswar",
      image: {
        src: "/images/team/shubham.webp",
        alt: "Shubham Kumar Agrawal in glasses, a dark suit and a navy tie",
        aspect: 400 / 384,
        height: 0.62,
        top: 0.25,
        sideFade: 0.16,
      },
      bio: [
        "Shubham builds the technology behind Crorepreneur's products and offerings. An IIT Bhubaneswar graduate, he has spent over four years building full-stack products, most recently as a lead full-stack engineer.",
        "He likes fast, simple systems and knowing why they are fast: Node.js and Go on the server; Redis, PostgreSQL and PostGIS for data; and an eye on what the hardware underneath is doing.",
      ],
      credentials: [
        "IIT Bhubaneswar, 2017–2021",
        "MCM Scholarship, Government of India, 2018–2020",
        "Winner, Unconference at E-Summit 2019, IIT Madras",
        "CodeChef 4 star, rated 1884",
      ],
      links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/shubham-kumar-agrawal-45311b171/" }],
    },
  ],
  beliefsTitle: "What we believe",
  beliefs: [
    {
      title: "Niche is just another word for loyal.",
      text: "The audiences mainstream media calls too small are the ones that show up, every time.",
    },
    {
      title: "Chase resonance, not reach.",
      text: "Reach gets you noticed once. Resonance gets you called back.",
    },
    {
      title: "The most specific story wins.",
      text: "Netflix did not need another influencer. They needed something real: a mother, a daughter, and a dynamic that cannot be manufactured.",
    },
    {
      title: "Most places have a story problem.",
      text: "Jharkhand doesn't have a tourism problem. It has a storytelling problem. The destinations are already here; the story just hasn't caught up.",
    },
  ],
  ctaTitle: "Have a story worth telling?",
  ctaBody: "Tell us about the brand and the cities you want to reach. You will hear back within two working days.",
} as const;
