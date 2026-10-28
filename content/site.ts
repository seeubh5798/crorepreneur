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
  /**
   * Crorepreneur's own accounts, in the footer and the enquiry emails. Add an
   * href to show a link; empty entries stay hidden.
   */
  socials: [
    {
      network: "instagram",
      label: "Instagram",
      href: "https://www.instagram.com/crorepreneur_pvt_ltd/",
    },
    {
      network: "linkedin",
      label: "LinkedIn",
      href: "https://www.linkedin.com/company/crorepreneur-private-limited/",
    },
    { network: "youtube", label: "YouTube", href: "" },
  ],
  /** Over the footer's social buttons; each button reads "Follow Crorepreneur on …" to screen readers. */
  follow: { label: "Follow us on", name: "Follow Crorepreneur on" },
} as const;

export const founder = {
  name: "Chabi Gupta",
  firstName: "Chabi",
  role: "Founder, Crorepreneur",
  /** Shown on her name card on the cover, one per line. */
  credentials: ["Forbes India Top 100 Digital Star", "MBA, Kelley School of Business"],
  instagram: {
    handle: "@chabigupta",
    user: "chabigupta",
    href: "https://www.instagram.com/chabigupta/",
  },
  image: {
    /**
     * Replace this one file to swap the portrait: /public/images/founder.webp
     * It is her studio headshot as a transparent cutout (WebP with alpha),
     * 1323 x 1037, with the photo's starry backdrop removed so she sits on the
     * site's own backdrops. Nothing else is retouched. The source photo is
     * kept, unpublished, at /design/founder-studio.jpg.
     */
    src: "/images/founder.webp",
    /**
     * Smaller copies of the same file, for phones: the cover offers all three
     * and each screen loads the smallest that is sharp on it. Make them again
     * if the photo changes (see the README).
     */
    smaller: [
      { src: "/images/founder-720.webp", width: 720 },
      { src: "/images/founder-1080.webp", width: 1080 },
    ],
    width: 1323,
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

/** A video in a case study, played on the site itself. */
export type CaseVideo = {
  /** A light copy (540p), for slow connections and data saver. */
  src: string;
  /** The full-quality copy everyone else gets, and its size in pixels. */
  hd?: string;
  width: number;
  height: number;
  /** The still shown until it plays. */
  poster: string;
  /** "m:ss". */
  length: string;
  /** Where the original lives, such as the post on Instagram. */
  original: { label: string; href: string };
  /** Short words for the player, such as the post's month. */
  caption: string;
};

/** A still shown with a case's Reels, such as the creative a Reel became. */
export type CaseImage = {
  src: string;
  alt: string;
  caption: string;
  original: { label: string; href: string };
};

/**
 * One case study: what the brand came with, what we made, what happened.
 * `media` is either Reels (tall, one or more, with a still that belongs to
 * the results if there is one) or one film (wide).
 */
export type CaseStudy = {
  /** Its address: /work/<id>. */
  id: string;
  name: string;
  /** The line under the name, set large. */
  line: string;
  /** Client, year, industry and the rest, in order. */
  facts: readonly { label: string; value: string }[];
  /** The headline result. */
  result: string;
  challenge: readonly string[];
  solution: readonly string[];
  results: { points?: readonly string[]; text?: readonly string[] };
  media:
    | {
        kind: "reels";
        videos: readonly CaseVideo[];
        image?: CaseImage;
        /** Clips from a post rather than Reels: named so on the card and in the player. */
        clips?: boolean;
      }
    | { kind: "film"; video: CaseVideo };
  /** Its card on the home page: a still, which part of it to keep in the frame, and what it shows. */
  card: { image: string; alt: string; position?: string };
  links: readonly { label: string; href: string }[];
};

/** The track record: four numbers beside the Forbes India feature (see Proof). */
export const proof = {
  label: "Track record",
  title: "The work, in numbers",
  /** Counted up as they scroll into view. */
  highlights: [
    { value: 177, suffix: "K", label: "Followers on @yourregularmom" },
    { value: 35, suffix: "M", label: "Views on our best reel" },
    { value: 50, suffix: "x", label: "Store footfall in one month" },
    {
      value: 12.5,
      decimals: 1,
      suffix: "K",
      label: "Likes on one festive reel",
    },
  ] satisfies Metric[],
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

/**
 * Selected work: each brand's case study, from the problem it came with to
 * what happened. Videos are compressed copies in /public/videos, played on
 * the site; the originals stay linked.
 */
export const cases = {
  label: "Work",
  title: "Brands and their case studies",
  intro: "What each brand came to us with, what we made, and what it did.",
  /** For screen readers: the row of cards. */
  railLabel: "Case studies",
  prev: "Previous case studies",
  next: "More case studies",
  more: "Read the case study",
  /** On a card, what plays on its page: "Film · 1:18", "5 Reels". */
  kinds: { film: "Film", reel: "Reel", reels: "Reels", clips: "clips" },
  resultLabel: "Result",
  /** Each case's own page (app/work/[id]). */
  page: {
    label: "Case study",
    back: "All case studies",
    backShort: "Work",
    storyLabel: "The story",
    story: {
      challenge: "Challenge",
      solution: "Creative solution",
      results: "Results",
    },
    originals: "Where it ran",
    next: "Next case study",
    /** The case's video player (components/work/CasePlayer.tsx): button names, for screen readers and tooltips. */
    player: {
      /** On the video that started by itself, silently. Plays it from the start, with sound. */
      sound: "Sound on",
      play: "Play",
      pause: "Pause",
      replay: "Play again",
      back: "Back 10 seconds",
      forward: "Forward 10 seconds",
      mute: "Mute",
      unmute: "Unmute",
      volume: "Volume",
      seek: "Seek",
      /** Between the two times when the seek bar is read out: "0:42 of 1:18". */
      of: "of",
      fullscreen: "Full screen",
      exitFullscreen: "Exit full screen",
      reels: "Reels",
      next: "Next Reel",
      /** For a case whose videos are clips from a post. */
      clips: "Clips",
      nextClip: "Next clip",
      close: "Close",
      nowPlaying: "Now playing",
    },
  },
  items: [
    {
      id: "sunrise",
      name: "Sunrise Masale",
      line: "Brought a new masala range into eastern India’s kitchens, one Mummy at a time.",
      facts: [
        { label: "Client", value: "Sunrise Masale" },
        { label: "Year", value: "2025–2026" },
        { label: "Industry", value: "FMCG, food and spices" },
        { label: "Capabilities", value: "Creator strategy, regional launch, content production" },
      ],
      result: "5.6 lakh+ views across four collab Reels",
      challenge: [
        "Masala is the hardest switch in an Indian kitchen. Families stay loyal to the brand their mother used, and big national names dominate the shelf. Sunrise was launching new masalas in eastern India and needed home cooks to notice them, trust them and try them. Ads alone wouldn’t get there.",
      ],
      solution: [
        "We didn’t sell the masala; we handed it to the person whose approval matters most in an eastern Indian home: Mummy. Across five Reels on @yourregularmom, Sunrise became part of everyday cooking in Bihari-Jharkhandi homes: traditional prep on the rooftop, a weeknight tadka, the first taste test, the packet opened right on the stove. Every post was a collab with @sunrise_masale, and the top ones were crossposted to Facebook to reach the older home cooks who actually buy masala.",
      ],
      results: {
        points: [
          "5,67,284 views across four collab Reels",
          "4,16,000+ accounts reached",
          "17,000+ likes, 400+ shares and 350+ saves, which is people planning to cook with it, not just scrolling past",
          "The best Reel reached 2,34,690 views and 12.7K likes, with a skip rate below the account average",
        ],
      },
      media: {
        kind: "reels",
        videos: [
          {
            src: "/videos/sunrise-1.mp4",
            hd: "/videos/hd/sunrise-1.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/sunrise-1.webp",
            length: "1:41",
            caption: "September 2025",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DOlcsdRklMn/" },
          },
          {
            src: "/videos/sunrise-2.mp4",
            hd: "/videos/hd/sunrise-2.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/sunrise-2.webp",
            length: "1:24",
            caption: "October 2025, for Chhath",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DQMbSL9kqRK/" },
          },
          {
            src: "/videos/sunrise-3.mp4",
            hd: "/videos/hd/sunrise-3.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/sunrise-3.webp",
            length: "1:30",
            caption: "February 2026",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DU407KeDlMX/" },
          },
          {
            src: "/videos/sunrise-4.mp4",
            hd: "/videos/hd/sunrise-4.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/sunrise-4.webp",
            length: "1:26",
            caption: "September 2026",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DdjcFBYuNcE/" },
          },
          {
            src: "/videos/sunrise-5.mp4",
            hd: "/videos/hd/sunrise-5.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/sunrise-5.webp",
            length: "1:11",
            caption: "September 2026",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/Dd30CgAuP8j/" },
          },
        ],
      },
      card: {
        image: "/images/work/sunrise-chhath.webp",
        alt: "Anita Gupta in an orange saree, preparing for Chhath",
        position: "50% 38%",
      },
      links: [],
    },
    {
      id: "horlicks",
      name: "Horlicks",
      line: "We turned an in-store offer into a day with the grandchild.",
      facts: [
        { label: "Client", value: "Horlicks, a Hindustan Unilever brand" },
        { label: "Year", value: "2025" },
        { label: "Industry", value: "FMCG, nutrition drinks" },
        { label: "Capabilities", value: "Creator partnership, family storytelling, content production" },
        { label: "Offer", value: "A free Horlicks Classic Malt Milkshake with the 500 g jar" },
      ],
      result: "An in-store offer, told as a family day",
      challenge: [
        "Horlicks had a simple offer on its 500 g jar: a free Horlicks Classic Malt Milkshake. But an offer printed on a pack only works if shoppers notice it, and a band on a jar is easy to miss on a crowded shelf. An ad that shouts “free” is just as easy to scroll past. Horlicks needed the families who buy the jar to hear about the offer from someone they trust, and then look for it at their local store.",
      ],
      solution: [
        "We didn’t make an ad about a freebie. We made a day with the grandchild. In the reel, titled on screen “bonding day with GrandChild”, the little one arrives at Mummy’s door with a backpack, sits on the kitchen counter while she makes pancakes, and gets a Horlicks milkshake with breakfast. The day ends with an evening snack and playtime.",
        "The offer gets one clear line on screen, “Buy 500g Horlicks Jar = Milkshake FREE!”, over the milkshake on the breakfast tray and then a close-up of the jar’s “FREE” band, so viewers know exactly what to look for. The caption says it the way a grandparent would: “If you spot this offer at your local store, it’s worth picking up.” The reel tagged Horlicks India and was marked #ad.",
      ],
      results: {
        points: ["751 likes and 10 comments on @yourregularmom"],
        text: [
          "Horlicks got its offer told the way families pass on a good deal: shown in use at home, with one line on what to buy and where to look for it.",
        ],
      },
      media: {
        kind: "reels",
        videos: [
          {
            src: "/videos/horlicks.mp4",
            hd: "/videos/hd/horlicks.mp4",
            width: 1080,
            height: 1920,
            poster: "/videos/horlicks.webp",
            length: "1:02",
            caption: "December 2025",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DSSZR-bksiI/" },
          },
        ],
      },
      card: {
        image: "/images/work/horlicks.webp",
        alt: "A small child beside a jar of Horlicks",
        position: "50% 60%",
      },
      links: [{ label: "Watch on Instagram", href: "https://www.instagram.com/reel/DSSZR-bksiI/" }],
    },
    {
      id: "saraswaan",
      name: "Saraswaan Jewellers",
      line: "Turned an intimidating new flagship into the talk of the town.",
      facts: [
        {
          label: "Client",
          value: "Saraswaan, from the house of Maa Gayatri Jewellers, a leading jewellery retailer in Jharkhand",
        },
        { label: "Year", value: "2025" },
        { label: "Industry", value: "Retail, jewellery" },
        {
          label: "Capabilities",
          value: "Brand strategy, integrated campaign, local influencer partnerships, creative",
        },
      ],
      result: "50x store footfall in one month",
      challenge: [
        "The brand ran several stores across Jharkhand’s tier-2 cities, each serving a different kind of customer. Its new high-end flagship was a big investment, but it backfired. Loyal customers felt the brand had left its homegrown roots, new customers assumed they couldn’t afford it, and footfall dropped. With that much capital already spent, the flagship had to work, and it couldn’t pull customers away from the other stores.",
      ],
      solution: [
        "We found the brand’s real advantage wasn’t luxury. It was local trust that went back generations. So we launched “Kuch Naya Sochte Hai”, a campaign that presented the flagship as the next chapter of a story Jharkhand already knew. Local personalities people love wore the jewellery, which was tied to regional traditions and positioned as premium but approachable. The campaign ran across regional TV and news channels, cinemas, local newspapers and billboards around the city, so every channel carried the same message.",
      ],
      results: {
        text: [
          "Store footfall grew 50x within one month, and the campaign became the talk of the town. Customers came to see the flagship as part of the brand they already trusted. Each store kept its own customers, so the flagship grew the business without taking sales from the other locations.",
        ],
      },
      media: {
        kind: "film",
        video: {
          src: "/videos/saraswaan.mp4",
          hd: "/videos/hd/saraswaan.mp4",
          width: 1280,
          height: 720,
          poster: "/images/work/jewellery-jharkhand.webp",
          length: "1:18",
          caption: "Kuch Naya Sochte Hai",
          original: { label: "Read on LinkedIn", href: "https://lnkd.in/p/dvyHUbum" },
        },
      },
      card: {
        image: "/images/work/jewellery-jharkhand.webp",
        alt: "A mother and daughter laughing together in a jewellery showroom",
      },
      links: [{ label: "Read on LinkedIn", href: "https://lnkd.in/p/dvyHUbum" }],
    },
    {
      id: "ben-olive-mill",
      name: "Ben Olive Mill",
      line: "We made a working olive farm a destination for American families.",
      facts: [
        { label: "Client", value: "Ben Olive Mill – Tour & Tasting" },
        { label: "Year", value: "2023" },
        { label: "Industry", value: "Agritourism, hospitality" },
        { label: "Capabilities", value: "Growth strategy, positioning, documentary film, partnerships" },
      ],
      result: "A farm reframed as a family escape",
      challenge: [
        "Visitors come to Greece for its islands and ruins. Few plan a trip around a working olive mill in Kalamata. Ben Olive Mill had an exceptional experience to offer, but nothing gave travellers a reason to go out of their way for it.",
      ],
      solution: [
        "We stopped selling the olive oil and started selling the place. Research showed what American tourists value most: a slow picnic in the open and the ritual of tasting olive oil where it’s made. We created a documentary around those two moments, scripted and filmed on location in a single visit. To turn interest into visits, we set up partnerships with local hotels and hostels, putting the mill on the itinerary of travellers already in town.",
      ],
      results: {
        text: [
          "The mill now has a clear story, a film that tells it, and a local network that sends visitors its way. All of it is aimed at the guests most likely to book: American families looking for a quieter Greece.",
        ],
      },
      media: {
        kind: "film",
        video: {
          src: "/videos/ben-olive-mill.mp4",
          hd: "/videos/hd/ben-olive-mill.mp4",
          width: 1280,
          height: 720,
          poster: "/images/work/ben-olive-mill.webp",
          length: "2:49",
          caption: "The documentary",
          original: {
            label: "Read on LinkedIn",
            href: "https://www.linkedin.com/posts/chabi-gupta-cg_greeceexperience-olivemill-teamwork-ugcPost-7053638544828887040-EVZp/",
          },
        },
      },
      card: {
        image: "/images/work/ben-olive-mill.webp",
        alt: "Visitors at a tasting table among olive trees",
      },
      links: [
        {
          label: "Read on LinkedIn",
          href: "https://www.linkedin.com/posts/chabi-gupta-cg_greeceexperience-olivemill-teamwork-ugcPost-7053638544828887040-EVZp/",
        },
      ],
    },
    {
      id: "microsoft-copilot",
      name: "Microsoft Copilot",
      line: "We positioned Copilot as the business partner every Trailblazer needs.",
      facts: [
        { label: "Client", value: "Microsoft" },
        { label: "Year", value: "2024" },
        { label: "Industry", value: "Technology, generative AI" },
        { label: "Capabilities", value: "Growth strategy, audience personas, go-to-market, creative direction" },
        { label: "Engagement", value: "Kelley MBA Spring Intensive" },
      ],
      result: "A growth and retention plan for Copilot Free and Pro",
      challenge: [
        "Copilot was one of the most capable AI assistants on the market, built into the tools millions of people already use every day. But being capable doesn’t get people to adopt it. Microsoft needed to grow its user base across the Free and Pro tiers, then keep those users coming back as competitors fought for the same attention.",
      ],
      solution: [
        "We focused on one audience: the Trailblazers. They are 25 to 34, freelancing or running a small business, online seven hours a day, and wearing every hat in the company. Our persona, “Carol the Alchemist,” had big ambitions and no team to share the load.",
        "We built the marketing strategy around her and turned Copilot from a tool into the hero of her story. It wasn’t another app to learn. It was a real co-pilot that drafts the emails, builds the decks, crunches the numbers and keeps the business moving while she steers. To reach Trailblazers where they already spend time, we planned a go-to-market across LinkedIn, Instagram, TikTok and Pinterest. Small business owners would be rewarded for showing their audiences how they run their work with Copilot beside them. A directional film, made in a three-day, sixteen-hour creative sprint, brought the idea to life.",
      ],
      results: {
        text: [
          "Microsoft received a persona-led growth strategy built around its highest-potential audience. It included a peer-driven SME advocacy model and one clear promise for both adoption and retention: run your business with a co-pilot.",
        ],
      },
      media: {
        kind: "film",
        video: {
          src: "/videos/hd/microsoft-copilot.mp4",
          width: 960,
          height: 540,
          poster: "/images/work/microsoft-copilot.webp",
          length: "1:37",
          caption: "The directional film",
          original: {
            label: "Read on LinkedIn",
            href: "https://www.linkedin.com/posts/chabi-gupta-cg_microsoft-kelleyschoolofbusiness-iu-ugcPost-7168869625051525121-4osX/",
          },
        },
      },
      card: {
        image: "/images/work/microsoft-copilot.webp",
        alt: "A black-and-white frame from the team’s directional film: Chabi, captioned as an Instagram influencer",
      },
      links: [
        {
          label: "Read on LinkedIn",
          href: "https://www.linkedin.com/posts/chabi-gupta-cg_microsoft-kelleyschoolofbusiness-iu-ugcPost-7168869625051525121-4osX/",
        },
      ],
    },
    {
      id: "netflix-maa-behen",
      name: "Netflix India: Maa Behen",
      line: "We brought a real mother and daughter to a film about mothers and daughters.",
      facts: [
        { label: "Client", value: "Netflix India" },
        { label: "Year", value: "2026" },
        { label: "Industry", value: "Entertainment, streaming" },
        { label: "Capabilities", value: "Creator partnership, scriptwriting, content production" },
      ],
      result: "1M+ reach and 2,000+ shares",
      challenge: [
        "Maa Behen was a film about family, starring Madhuri Dixit, Triptii Dimri and Dharna Durga. Netflix needed its pre-launch content to feel as real as the relationships on screen. Big follower counts were easy to find. A mother-daughter bond that audiences already believed in was not.",
      ],
      solution: [
        "Netflix didn’t need another influencer. It needed the real thing. @yourregularmom has spent years building an audience of 200,000 from a town in Jharkhand, with one mother, one daughter and banter that has never been scripted to look real, because it is. We wrote reels that put that dynamic in the same room as the film’s cast and let the two families meet. In our humour, our language and our home, Bollywood’s biggest names met the kind of mother every viewer recognises. The script landed so well that Madhuri Dixit broke into laughter on camera.",
      ],
      results: {
        points: [
          "1M+ accounts reached",
          "2,000+ shares, as audiences passed it on to their own mothers and sisters",
          "Maa Behen rose to #2 on Netflix’s Global Top 10 Non-English Films and trended in 15 countries",
        ],
        text: [
          "The campaign proved what we had always believed. Regional is not niche. It’s loyal, and global brands are starting to notice.",
        ],
      },
      media: {
        kind: "film",
        video: {
          src: "/videos/netflix-maa-behen.mp4",
          hd: "/videos/hd/netflix-maa-behen.mp4",
          width: 1920,
          height: 1080,
          poster: "/images/work/netflix-maa-behen.webp",
          length: "1:55",
          caption: "With Madhuri Dixit and Triptii Dimri",
          original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/DZUgpaBuS41/" },
        },
      },
      card: {
        image: "/images/work/netflix-maa-behen.webp",
        alt: "Madhuri Dixit laughing with Triptii Dimri and Dharna Durga in front of a Netflix Maa Behen poster",
      },
      links: [
        {
          label: "Read on LinkedIn",
          href: "https://www.linkedin.com/feed/update/urn:li:activity:7476718806867046400/",
        },
        { label: "Watch on Instagram", href: "https://www.instagram.com/reel/DZUgpaBuS41/" },
      ],
    },
    {
      id: "india-fights-corona",
      name: "Ministry of Information & Broadcasting: #IndiaFightsCorona",
      line: "Our most viral reel became the Government of India’s vaccine message.",
      facts: [
        { label: "Featured by", value: "Ministry of Information & Broadcasting, Government of India" },
        { label: "Year", value: "2021" },
        { label: "Industry", value: "Public health, government communications" },
        { label: "Capabilities", value: "Original content, cultural storytelling, organic virality" },
      ],
      result: "1.7M views in two days, then a national vaccine campaign",
      challenge: [
        "In 2021, India needed hundreds of millions of people to trust a vaccine. Facts and figures couldn’t do it alone. Messages that work at that scale tend to feel personal, familiar and impossible to ignore.",
      ],
      solution: [
        "We weren’t trying to sell anything. We filmed something every Indian household knows: a mother finding out what her daughter spent. In “My DPS Belt,” Mummy inspects a ₹35,000 Gucci belt, says it looks just like a school uniform belt, and delivers the lecture every child has heard about wasting money. There was no script and no brief, just a real reaction from a real Bihari mother.",
        "It became part of everyday conversation. And once it was part of the conversation, it became something the Government could use. The Ministry of Information & Broadcasting turned the moment into a #IndiaFightsCorona creative. The ₹35,000 belt makes Mummy angry. The free vaccine makes Mummy happy and keeps the whole family safe.",
      ],
      results: {
        points: [
          "The reel crossed 1.7 million Instagram views within two days of posting",
          "Picked up by national media, with viewers saying the reaction was exactly how their own mothers respond to an expensive purchase",
          "Adopted by the Government of India for COVID-19 vaccine awareness and shared across the Ministry’s official channels",
        ],
        text: [
          "When a government chooses your content to reach a billion people, the work has gone well beyond entertainment.",
        ],
      },
      media: {
        kind: "reels",
        videos: [
          {
            src: "/videos/india-fights-corona.mp4",
            hd: "/videos/hd/india-fights-corona.mp4",
            width: 640,
            height: 1136,
            poster: "/videos/india-fights-corona.webp",
            length: "1:04",
            caption: "“My DPS Belt”, June 2021",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/tv/CQCHH_ag69e/" },
          },
        ],
        image: {
          src: "/images/work/india-fights-corona.webp",
          alt: "The Ministry of Information & Broadcasting’s #IndiaFightsCorona post: a ₹35,000 belt makes Mummy angry; the vaccine, free at government centres, makes Mummy happy and keeps the entire family safe.",
          caption: "The Ministry’s #IndiaFightsCorona post",
          original: { label: "Open on X", href: "https://x.com/COVIDNewsByMIB/status/1406228355037286400" },
        },
      },
      card: {
        image: "/images/work/india-fights-corona.webp",
        alt: "The Ministry of Information & Broadcasting’s #IndiaFightsCorona post, with Anita Gupta and the ₹35,000 belt",
        position: "50% 0%",
      },
      links: [
        { label: "The Ministry’s post", href: "https://x.com/COVIDNewsByMIB/status/1406228355037286400" },
        {
          label: "Inshorts",
          href: "https://inshorts.com/en/news/govt-uses-viral-%E2%82%B935k-gucci-belt-makes-mom-angry-meme-for-covid-vaccine-awareness-1624111577740",
        },
        {
          label: "Free Press Journal",
          href: "https://www.freepressjournal.in/viral/35000-ka-belt-this-video-of-mothers-hilarious-reaction-to-daughters-gucci-accessory-is-the-funniest-thing-on-internet-today",
        },
        {
          label: "SheThePeople",
          href: "https://www.shethepeople.tv/viral-video/viral-video-desi-mom-reaction-daughter-gucci-belt",
        },
      ],
    },
    {
      id: "jharkhand-tourism",
      name: "Jharkhand Tourism: State Level Influencers Meet",
      line: "When Jharkhand first brought its own creators together to tell the state’s story, we were in the room.",
      facts: [
        {
          label: "Hosted by",
          value: "Department of Tourism, Arts, Culture, Sports & Youth Affairs, Government of Jharkhand",
        },
        { label: "Year", value: "2026" },
        { label: "Industry", value: "State tourism, government communications" },
        { label: "Capabilities", value: "Creator storytelling, event coverage, government collab" },
        { label: "Event", value: "Jharkhand’s first State Level Influencers Meet, Patratu" },
      ],
      result: "At the state’s first creator meet, then a collab post with Jharkhand Tourism",
      challenge: [
        "Jharkhand has waterfalls, forests, tribal art and festivals, but it is still a small name on India’s travel map. In 2024 it drew 1.83% of India’s domestic tourist visits and just 0.22% of its foreign ones.",
        "The state knew where the gap was. People now find places to visit on social media, and Jharkhand’s presence there was still thin. Its Tourism Minister said as much at the meet. A brochure wouldn’t change that. Voices from Jharkhand that people already trust could.",
      ],
      solution: [
        "On 11 May 2026, the Department of Tourism held Jharkhand’s first State Level Influencers Meet, at Paryatan Vihar in Patratu. Sudivya Kumar, the state’s Tourism Minister at the time, told the room the state could have invited creators from the big metros. It chose its own. He launched the Influencer Engagement Portal there, so creators can work with the department formally. Chabi, who was born and raised in Jharkhand, was one of more than 80 creators at the meet.",
        "We covered the day the way our audience knows us: first person, from the inside. Chabi took her followers through it, from the steps of Paryatan Vihar to the Minister’s address, in a 20-slide post of eight videos and twelve photos, tagged to @jharkhandtourism. The official post about the meet, on @jharkhandtourism, went out as a collab with @yourregularmom, so it ran on the state’s page and on ours.",
      ],
      results: {
        points: [
          "One of more than 80 creators at the state’s first State Level Influencers Meet",
          "2,200+ likes and 23 comments on our 20-slide post from the day",
          "2,500+ likes on the official meet post on @jharkhandtourism, a collab with @yourregularmom",
          "In June, a meeting with Tourism Secretary Mukesh Kumar and the Director of Tourism",
        ],
        text: [
          "This is the start of the work, not the end. As Chabi wrote after that meeting, “Jharkhand doesn’t have a tourism problem. It has a storytelling problem.” The destinations are already here. Now the state’s own creators have a way in to tell their story.",
        ],
      },
      media: {
        kind: "reels",
        clips: true,
        videos: [
          {
            src: "/videos/jharkhand-tourism-1.mp4",
            hd: "/videos/hd/jharkhand-tourism-1.mp4",
            width: 720,
            height: 960,
            poster: "/videos/jharkhand-tourism-1.webp",
            length: "0:10",
            caption: "Arriving at the meet, May 2026",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
          },
          {
            src: "/videos/jharkhand-tourism-2.mp4",
            hd: "/videos/hd/jharkhand-tourism-2.mp4",
            width: 720,
            height: 960,
            poster: "/videos/jharkhand-tourism-2.webp",
            length: "0:12",
            caption: "Paryatan Vihar, Patratu",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
          },
          {
            src: "/videos/jharkhand-tourism-3.mp4",
            hd: "/videos/hd/jharkhand-tourism-3.mp4",
            width: 720,
            height: 960,
            poster: "/videos/jharkhand-tourism-3.webp",
            length: "0:54",
            caption: "The Tourism Minister’s address",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
          },
          {
            src: "/videos/jharkhand-tourism-4.mp4",
            hd: "/videos/hd/jharkhand-tourism-4.mp4",
            width: 720,
            height: 960,
            poster: "/videos/jharkhand-tourism-4.webp",
            length: "1:00",
            caption: "On Jharkhand as a monsoon destination",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
          },
        ],
      },
      card: {
        image: "/images/work/jharkhand-tourism-meet.webp",
        alt: "Chabi Gupta in front of the State Level Influencers Meet 2026 backdrop at Paryatan Vihar, Patratu",
        position: "50% 30%",
      },
      links: [
        { label: "Our post from the meet", href: "https://www.instagram.com/p/DYPtGunmEFq/" },
        { label: "Jharkhand Tourism collab post", href: "https://www.instagram.com/p/DYRCfAAjBby/" },
        {
          label: "Read on LinkedIn",
          href: "https://www.linkedin.com/posts/chabi-gupta-cg_jharkhandtourism-digitalstorytelling-creatoreconomy-activity-7474064422035173377-df1O",
        },
      ],
    },
    {
      id: "yourregularmom",
      name: "@yourregularmom",
      line: "Where Crorepreneur started: a mother, a daughter and the way they talk at home.",
      facts: [
        { label: "Client", value: "Our own page, run by Anita Gupta and Chabi Gupta" },
        { label: "Year", value: "2020–2026" },
        { label: "Industry", value: "Creator media, family comedy" },
        { label: "Capabilities", value: "Original content, regional storytelling, audience building" },
        { label: "Featured by", value: "Forbes India (2022), Indian Idol 13 (2023)" },
      ],
      result: "From 6.5K to 177K followers",
      challenge: [
        "Chabi started @yourregularmom in 2020 with her mother, Anita. Like any new page, it had no audience. What it had was a family home in Ranchi and the way the two of them talk to each other, in Bihari. By mid-June 2021, the page had 6.5K followers and seven videos.",
      ],
      solution: [
        "We didn’t script Mummy. Chabi sets up an everyday moment: interrupting her serial, asking her about an emoji, showing her a new purchase. Anita reacts the way she always does. She speaks in Bihari, using words like ‘chikanjibhi’ for a foodie and ‘latkhor’ for someone stubborn, and her lines go on screen as she says them. As Anita told Forbes India, “I don’t pretend to be anyone else, what you see is who I am.”",
        "Then we kept going. Seven videos became 19 within three weeks of “My DPS Belt”. By October 2026 there were 872 posts: Durga Puja in Ranchi, Chhath, trips to Nanighar in Patna, and life between Ranchi and Chicago. When brands came, they came into the same home.",
      ],
      results: {
        points: [
          "6.5K followers in mid-June 2021, 62.4K by 3 July, and 177K with 872 posts in October 2026",
          "“My DPS Belt” passed 4 million views, drew a like from Priyanka Chopra, and within a week became the Government of India’s #IndiaFightsCorona vaccine message",
          "Featured by Forbes India in its 2022 Top Digital Stars coverage, and on Indian Idol 13 in January 2023, where Sony’s post called Mummy ‘Gucci waali aunty’",
          "Brands from Big Bazaar in 2021 to Sunrise Masale, Horlicks and Netflix India have run campaigns on the page",
        ],
        text: [
          "This is where Crorepreneur began. Every campaign we make still starts with what this page taught us: people trust voices that sound like home.",
        ],
      },
      media: {
        kind: "reels",
        videos: [
          {
            src: "/videos/yourregularmom-2.mp4",
            hd: "/videos/hd/yourregularmom-2.mp4",
            width: 720,
            height: 1280,
            poster: "/videos/yourregularmom-2.webp",
            length: "0:30",
            caption: "June 2021",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/CQSk-pBASRw/" },
          },
          {
            src: "/videos/yourregularmom-1.mp4",
            hd: "/videos/hd/yourregularmom-1.mp4",
            width: 720,
            height: 1280,
            poster: "/videos/yourregularmom-1.webp",
            length: "0:25",
            caption: "September 2021",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/CUU7jnXl4f5/" },
          },
          {
            src: "/videos/yourregularmom-3.mp4",
            hd: "/videos/hd/yourregularmom-3.mp4",
            width: 640,
            height: 1138,
            poster: "/videos/yourregularmom-3.webp",
            length: "0:30",
            caption: "August 2021, for Big Bazaar",
            original: { label: "Open on Instagram", href: "https://www.instagram.com/reel/CSEXMWJjyNV/" },
          },
        ],
      },
      card: {
        image: "/images/work/yourregularmom.webp",
        alt: "Chabi Gupta laughing beside her mother, Anita, who wears a yellow saree",
      },
      links: [
        { label: "Follow on Instagram", href: "https://www.instagram.com/yourregularmom/" },
        {
          label: "Forbes India",
          href: "https://www.forbesindia.com/article/2022-india039s-top-digital-stars/from-bihari-to-kashmiri-the-rise-and-rise-of-regional-indian-digital-content-stars/78465/1",
        },
        {
          label: "SheThePeople",
          href: "https://www.shethepeople.tv/viral-video/gucci-belt-mom-viral-video-daughter-35k-saree/",
        },
        {
          label: "Zee News",
          href: "https://zeenews.india.com/hindi/off-beat/funny-video-of-famous-regular-mom-showing-ashirwad-emoji-on-whatsapp-instagram-reels-video/931460",
        },
        {
          label: "India.com",
          href: "https://www.india.com/viral/viral-video-daughter-disturbs-mom-watching-anupamaa-gets-hilarious-scolding-for-it-watch-5047976/",
        },
        { label: "Indian Idol 13, on Instagram", href: "https://www.instagram.com/reel/CnYzNiGhBCe/" },
      ],
    },
  ] satisfies CaseStudy[],
} as const;

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
    {
      name: "Senior hands",
      text: "The people who pitch are the people who do the work.",
    },
    {
      name: "Creators first",
      text: "We pay fairly, brief clearly and let creators sound like themselves.",
    },
    {
      name: "Revenue first",
      text: "Every report opens with what the business earned.",
    },
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
    website: {
      label: "Website or Instagram",
      placeholder: "brand.com or @brand",
    },
    cities: {
      label: "Cities or markets",
      placeholder: "Mumbai, Delhi, the US, the UK…",
    },
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
      {
        title: "We read your brief",
        text: "Who you want to reach, where, and what success looks like.",
      },
      {
        title: "We reply within 24 hours",
        text: "With first ideas, and anything else we need to know.",
      },
      {
        title: "We plan it together",
        text: "A short call to shape the campaign and the creators behind it.",
      },
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
    links: [
      { label: "LinkedIn", href: "https://www.linkedin.com/in/shubham-kumar-agrawal-45311b171/" },
      { label: "Instagram", href: "https://www.instagram.com/number1theory/" },
    ],
    /** His studio portrait, cropped to 4:5 like hers. */
    image: { src: "/images/team/shubham.webp", alt: "Shubham Kumar Agrawal" },
    badge: "IITian",
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

/**
 * The careers page (app/careers), linked from the footer. One role is open;
 * `posted` is its date in Google's job listings (the page's structured data).
 */
export const careers = {
  title: "Careers",
  description:
    "Join Crorepreneur in Ranchi. We’re hiring a Marketing Intern to work with our CEO and CTO on creator campaigns for brands across India and beyond.",
  /** The footer link, and the small tag beside it. */
  link: "Careers",
  hiring: "We’re hiring",
  headline: ["Build the buzz", "with us."],
  intro:
    "Crorepreneur is a small team making creator campaigns that get cities talking, for brands like Netflix India, Sunrise Masale and Horlicks. Our office is in Ranchi, and we’re growing.",
  rolesLabel: "Open roles",
  role: {
    title: "Marketing Intern",
    posted: "2026-10-28",
    city: "Ranchi",
    region: "Jharkhand",
    tags: ["Ranchi office", "Internship", "Option to go full-time"],
    team: "You’ll work closely with our CEO, Chabi Gupta, and our CTO, Shubham Kumar Agrawal, on campaigns for real brands.",
    doesLabel: "What you’ll do",
    does: [
      "Find creators city by city, by language, dialect and audience, and keep our roster fresh",
      "Turn a brand’s brief into a campaign plan: who to reach, what their city talks about, and the idea",
      "Write scripts, hooks and captions with our creators, in Hindi and English",
      "Help run shoots and rollouts: creators, brands, schedules and locations",
      "Track what every campaign does, from reach and shares to store visits and sales, and report it plainly",
      "Grow Crorepreneur’s own name on Instagram, LinkedIn and our website, with the CTO",
      "Research the brands we should work with next, and help build the pitches",
    ],
    looksForLabel: "Who you are",
    looksFor: [
      "You live on Instagram and YouTube, and can say why one reel works and another doesn’t",
      "You write well in Hindi and English; another Indian language is a plus",
      "You’re organised, you follow up, and a spreadsheet doesn’t scare you",
      "You can work from our office in Ranchi",
    ],
    goodLabel: "Good to know",
    good: [
      "When the work takes you out of town, for a shoot, a launch or an event, we cover the travel expenses.",
      "If the results are strong, the internship can turn into a full-time role.",
    ],
    /** The button, and the pop-up it opens (ApplyDialog). */
    apply: {
      label: "Apply for this role",
      lead: "Sounds like you?",
      title: "Apply for this role",
      note: "Send us your CV, a few lines on why you, and links to anything you’ve made: a page, a reel, a post.",
      write: "Write to",
      button: "Write to us",
      close: "Close",
      /** Filled in for them when "Write to us" opens their email app. */
      subject: "Application: Marketing Intern, Ranchi",
      body: "Hi Chabi and Shubham,\n\nI’d like to apply for the Marketing Intern role in Ranchi.\n\nA little about me:\n\nLinks to things I’ve made:\n\n(CV attached)",
    },
  },
} as const;
