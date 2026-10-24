/**
 * All site copy lives in this file, including the two emails the site sends
 * for every enquiry (`enquiryEmails`, laid out by worker/emails.ts).
 */

export const site = {
  name: "Crorepreneur",
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
  /** The address the site lives at, for links in its emails. */
  url: "https://crorepreneur.com",
  contact: {
    /** The inbox every enquiry goes to. */
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
  /** Shown on her name card on the cover, one per line. */
  credentials: ["Forbes India Top 100 Digital Star", "MBA, Kelley School of Business"],
  instagram: { handle: "@chabigupta", user: "chabigupta", href: "https://www.instagram.com/chabigupta/" },
  image: {
    /**
     * Replace this one file to swap the portrait: /public/images/founder.webp
     * It is her studio headshot as a transparent cutout (WebP with alpha),
     * 1323 x 1037, with the photo's starry backdrop removed so she sits on the
     * site's own backdrops. Nothing else is retouched. The source photo is
     * kept, unpublished, at /design/founder-studio.jpg.
     */
    src: "/images/founder.webp",
    alt: "Chabi Gupta, founder of Crorepreneur, smiling, in a tartan blazer with black satin lapels, a white shirt and a black bow",
    /** Width divided by height of the photo file. Update if the photo changes shape. */
    aspect: 1323 / 1037,
    /** Soft fade at the left and right edges, where the photo crops the shoulders. */
    sideFade: 0.12,
    /** Crop for the small round avatar. */
    avatar: { scale: 1.9, position: "50% 30%" },
  },
};

export const hero = {
  /** Set in spaced capitals above the headline. */
  eyebrow: "Your growth marketing partner",
  /** Three short lines that type themselves on a loop. */
  headline: ["Buzz.", "Trust.", "Revenue."],
  body: "Your creator-first, culture-forward growth marketing partner. We build campaigns that get your city talking, turn attention into trust, and turn that trust into loyal customers and measurable revenue growth.",
  /** The words in `body` picked out with a violet stroke. */
  bodyHighlight: "growth marketing partner",
  /** Opens the enquiry form (see `enquiry` below). */
  primaryCta: { label: "Let’s Grow Your Brand" },
  secondaryCta: { label: "See the work", href: "#work" },
  /** Who the work has been for, on a loop along the bottom of the cover. */
  clientsLabel: "Brands we have worked with",
  clients: [
    "Netflix India",
    "ITC Sunrise",
    "Horlicks",
    "Jharkhand Tourism",
    "Big Bazaar",
    "Microsoft",
    "Ecolab",
    "Ben Olive Mill",
  ],
} as const;

export const manifesto = {
  label: "Why Crorepreneur",
  /** Set large: the first line struck through, the second in the serif voice. */
  headline: ["Ads get skipped.", "Stories get shared."],
  /** Lights up word by word as it scrolls past. */
  statement: "We don’t make content people scroll past. We make moments people talk about.",
  body: "Every campaign starts with your customer: what they care about, who they trust, and what moves them. Then we put the right creators behind the right story and keep the city talking.",
  closing: {
    lead: "One team, end to end.",
    text: "The result is a brand people believe in, choose and keep coming back to.",
  },
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
  label: "Work",
  title: "Selected work",
  /** The rail of cases and its buttons. */
  railLabel: "Case studies",
  prev: "Previous case",
  next: "Next case",
  /** The screen before the cases: the numbers beside the press. */
  proofLabel: "Track record",
  proofTitle: "The work, in numbers",
  intro:
    "Campaigns made with creators for brands, a state tourism board and local retail, and the strategy behind them.",
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
    facts: [
      "With Madhuri Dixit, Tripti Dimri and Dharna Durga",
      "Shot on the film's press set",
      "Posted on @yourregularmom",
    ],
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
      image: {
        src: "/images/work/sunrise-chhath.webp",
        alt: "Anita Gupta in an orange saree, preparing for Chhath",
        position: "50% 38%",
      },
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
      image: {
        src: "/images/work/jewellery-jharkhand.webp",
        alt: "A mother and daughter laughing together in a jewellery showroom",
      },
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
    kind: "Our own page",
    date: "Since 2020",
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
    image: {
      src: "/images/work/yourregularmom.webp",
      alt: "Chabi Gupta laughing beside her mother, Anita, who wears a yellow saree",
    },
    link: { label: "Follow on Instagram", href: "https://www.instagram.com/yourregularmom/" },
  },
  press: {
    label: "As featured in",
    outlet: "Forbes India",
    honour: "Top 100 Digital Stars, 2022",
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
  label: "Services",
  title: "What we do",
  intro: "One service, done properly: creator campaigns that sound local in every city they run in.",
  offering: {
    name: "Hyperlocal Campaigns",
    statement: "Speak like the city you sell to.",
    body: "For global brands coming to India, and Indian brands going everywhere else. We cast creators from the cities you want to reach, in their own language and dialect, and build the campaign around what their audience talks about at home: family, food, festivals, the neighbourhood. One brief, and every market hears it in its own words.",
    includesLabel: "What a campaign includes",
    includes: [
      "Creators cast city by city, by language, dialect and audience",
      "Scripts and skits rooted in local life, written with the creators",
      "Shoots at home, on location, or at your launch, premiere or event",
      "Rollout across cities and countries, with partnership ads behind what works",
      "Reporting city by city, through to sales",
    ],
    madeForLabel: "Made for",
    madeFor: [
      "Film and OTT releases",
      "Product launches",
      "Store and restaurant openings",
      "Festive campaigns",
      "Market entry",
    ],
  },
} as const;

export const process = {
  label: "Approach",
  /** The last word is said in the serif voice. */
  title: ["Listen.", "Spark.", "Create.", "Amplify.", "Compound."],
  intro: "Five moves on every campaign, always in this order. Skip one and the budget leaks.",
  steps: [
    {
      id: "listen",
      name: "Listen",
      lead: "Learn what your audience watches, saves, shares and keeps coming back to.",
      points: [
        "Dig into comments, saves and search trends, not just follower counts",
        "Find what makes them sticky: the jokes, fears, habits and local pride",
        "Map the creators they already trust, city by city",
      ],
    },
    {
      id: "spark",
      name: "Spark",
      lead: "Turn that data into one insight worth talking about.",
      points: [
        "Find the tension your brand can solve better than anyone",
        "Shape one story that people feel before they understand it",
        "Pick creators whose voice makes that story believable",
      ],
    },
    {
      id: "create",
      name: "Create",
      lead: "Make content with creators that feels made for the feed, not for an ad break.",
      points: [
        "Reels and UGC in the creator’s own voice and language",
        "Every piece checked against the brief before it goes live",
        "Real formats for each platform",
      ],
    },
    {
      id: "amplify",
      name: "Amplify",
      lead: "Keep the buzz going across creators, cities and paid media.",
      points: [
        "Put spend behind the posts that already work",
        "Roll out in sequence so the conversation never goes quiet",
        "Make online buzz show up offline, in stores, events and word of mouth",
      ],
    },
    {
      id: "compound",
      name: "Compound",
      lead: "Track every rupee to sales, then make the next campaign smarter.",
      points: [
        "Measure revenue, repeat buyers and brand love, not just reach",
        "Learn what moved people and feed it into the next round",
        "Each campaign starts higher than the last",
      ],
    },
  ],
  /** Under the staircase. */
  note: "The graphs are illustrations, not data. Every campaign draws its own.",
} as const;

export const founderSection = {
  label: "Founder",
  title: "Meet Chabi.",
  /** Her own words, from LinkedIn (June 2026). */
  quote:
    "I didn't get this collaboration because I had the biggest numbers in the room. I got it because I had the most specific story in the room.",
  bio: [
    "Chabi built @yourregularmom with her mother from nothing: 177K followers, a Forbes India Top 100 Digital Star, and campaigns for Netflix, ITC and Horlicks.",
    "She brings an MBA from Indiana University's Kelley School of Business in the US, and strategy work for Microsoft and Ecolab, to every brief.",
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
  body: "Tell us about the brand and where it needs to be. You will hear back within 24 hours.",
  button: "Let’s Grow Your Brand",
} as const;

/** The "Start a campaign" form. Every "Let’s Grow Your Brand" button opens it. */
export const enquiry = {
  title: "Start a campaign",
  intro: "Tell us about the brand and where it needs to be. You will hear back within 24 hours.",
  fields: {
    name: { label: "Your name", placeholder: "Full name" },
    email: { label: "Work email", placeholder: "you@brand.com" },
    company: { label: "Brand or company", placeholder: "Brand name" },
    website: { label: "Website or Instagram", placeholder: "brand.com or @brand" },
    cities: { label: "Cities or markets", placeholder: "Mumbai, Delhi, the US, the UK…" },
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
  /** The spam check (Turnstile), shown while the form sends enquiries itself. */
  check: {
    label: "Spam check",
    wait: "One moment: the spam check is still running. Please send again in a second.",
  },
  /** Shown when the form hands the enquiry to the visitor's email app instead. */
  handedOff: {
    title: "Almost there",
    body: "Your email app has opened with everything filled in. Press send and we will reply within 24 hours.",
    fallback: "If nothing opened, write to us at",
  },
  /** Shown once the enquiry is in the inbox. */
  sent: {
    title: "Thank you",
    body: "Your enquiry is with us, and a copy is on its way to your inbox. We will reply within 24 hours.",
  },
  close: "Close",
} as const;

/**
 * The two emails the site sends for every enquiry; worker/emails.ts lays
 * them out. In the text, {firstName} and {name} are the sender's first and
 * full name, and {brand} their brand.
 */
export const enquiryEmails = {
  /** To the inbox: the enquiry in full. Replying answers the sender. */
  inbox: {
    from: "Crorepreneur website <website@crorepreneur.com>",
    subject: "New enquiry: {brand}, from {name}",
    title: "New enquiry",
    intro: "From the form on crorepreneur.com. Reply to this email to answer {name} directly.",
    /** The form asks "Your name"; here the labels are plain. */
    labels: { name: "Name", email: "Email" },
    receivedLabel: "Received",
    footer: "Sent by the enquiry form on crorepreneur.com.",
  },
  /** To the sender: thanks, what happens next, and a copy of what they sent. */
  reply: {
    from: "Crorepreneur <hello@crorepreneur.com>",
    replyTo: "hello@crorepreneur.com",
    subject: "Thanks, {firstName}. We will be in touch within 24 hours",
    /** The line an inbox shows beside the subject. */
    preview: "Your enquiry about {brand} is with the Crorepreneur team.",
    eyebrow: "Your growth marketing partner",
    /** The name is said in the serif voice, as on the cover. */
    title: "Thank you,",
    body: "Your enquiry about {brand} is with us. We read every brief ourselves, and we will get back to you within 24 hours with first thoughts and a few questions.",
    /** A booking link, such as a Calendly event, adds this button. Empty: no button. */
    call: {
      href: "",
      intro: "Rather talk sooner?",
      label: "Book a 30-minute call",
    },
    nextTitle: "What happens next",
    next: [
      { title: "We read your brief", text: "Who you want to reach, where, and what success looks like." },
      { title: "We reply within 24 hours", text: "With first ideas, and anything else we need to know." },
      { title: "We plan it together", text: "A short call to shape the campaign and the creators behind it." },
    ],
    summaryTitle: "What you sent us",
    signOff: "Warm regards,",
    signature: { name: "Chabi Gupta", role: "Founder, Crorepreneur" },
    footer: "You are receiving this because you sent an enquiry on crorepreneur.com. Reply to this email to reach us.",
  },
} as const;

/**
 * The About page (/about): who we work with, the founder, the tech behind
 * Crorepreneur and what we believe. Facts from the founders' LinkedIn
 * profiles and posts, as of October 2026.
 */
export const about = {
  title: "About us",
  description:
    "Crorepreneur is a creator marketing agency for global brands coming to India and Indian brands going everywhere else, founded by Chabi Gupta.",
  back: "Back to home",
  backShort: "Back",
  headline: ["Stop chasing reach.", "Chase resonance."],
  headlineBy: "Chabi Gupta, founder",
  intro:
    "Crorepreneur gets brands talked about by the creators people already trust. We work in two directions: global brands that want to win in India, and Indian brands that want to be known everywhere else. Our team works across the US and India, so we know both sides.",
  audienceLabel: "Who we work with",
  audienceTitle: "Built for brands that cross borders.",
  audiences: [
    {
      id: "into-india",
      direction: "Into India",
      title: "Global brands coming to India",
      text: "Launching in India, or growing there? We match you with the Indian creators your customers already follow, in the languages they speak, and turn their posts into sales.",
    },
    {
      id: "out-of-india",
      direction: "Out of India",
      title: "Indian brands going global",
      text: "Taking an Indian brand to the US, or anywhere else? We find the creators in the markets you want, and tell your story in a way those audiences recognise.",
    },
  ],
  brandsLabel: "Brands we have worked with",
  brands: ["Netflix India", "ITC Sunrise", "Horlicks", "Microsoft", "Big Bazaar", "Ecolab"],
  founderLabel: "The founder",
  founder: {
    id: "chabi",
    name: "Chabi Gupta",
    role: "Founder · Strategy behind Crorepreneur",
    /** The headline credential, shown on the photo. */
    badge: "MBA, Kelley School of Business",
    image: {
      src: "/images/founder.webp",
      alt: "Chabi Gupta, smiling, in a tartan blazer with black satin lapels, a white shirt and a black bow",
      /** Width divided by height of the cutout. */
      aspect: 1323 / 1037,
      /** Height of the figure and where its top sits, as shares of the frame's height. */
      height: 0.68,
      top: 0.32,
      /** How far in from each side the figure fades, as a share of its width. */
      sideFade: 0.1,
    },
    bio: [
      "Chabi started Crorepreneur after building an audience of her own from nothing: a page she made with her mother grew to 177K followers, and its best reel passed 35 million views.",
      "She took her MBA at Indiana University's Kelley School of Business in the US, and has worked with Netflix, ITC and Horlicks on campaigns and with Microsoft on strategy. She works between Chicago and India.",
    ],
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/chabi-gupta-cg/" },
      { label: "Instagram", href: "https://www.instagram.com/chabigupta/" },
    ],
  },
  /** A short note, without a photo, before the beliefs. */
  tech: {
    label: "Tech behind Crorepreneur",
    name: "Shubham Kumar Agrawal",
    text: "An IIT grad, AI enthusiast, and tech innovator, Shubham has worked with industry giants like Turing, Brane, and Shamrock AI, building cutting-edge products and AI-driven solutions from the ground up. With expertise in AI, automation, and end-to-end product development, he blends technology with creativity to turn ambitious ideas into scalable solutions. As the tech brain behind Crorepreneur, he drives the AI-powered tools, intelligent systems, and technology that fuel its campaigns and digital innovation.",
    link: { label: "LinkedIn", href: "https://www.linkedin.com/in/shubham-kumar-agrawal-45311b171/" },
  },
  beliefsLabel: "Beliefs",
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
      title: "Local beats global, everywhere.",
      text: "People trust voices that sound like home. That holds in Mumbai, in Chicago and everywhere in between.",
    },
  ],
  ctaTitle: "Have a story worth telling?",
  ctaBody:
    "Tell us about the brand and the markets you want to reach, in India or anywhere else. You will hear back within 24 hours.",
} as const;
