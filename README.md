# Crorepreneur

Website for Crorepreneur, an Instagram influencer marketing agency founded by
Chabi Gupta. One page, told as a scroll story: a dark cover with a headline
that types itself on a loop and the brands we have worked with drifting
along its bottom, a manifesto, the track record, the work (real case
studies), the one service (hyperlocal campaigns), the method, a section on
the founder, and the call to start a campaign, which opens an enquiry form.
A separate About page (`/about`) tells companies who we work with and
introduces the founder. Matte and editorial: dark and warm off-white
sections in turn, with a dusty violet accent. On a laptop, every section
fits one screen.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4.
Scroll animation with GSAP ScrollTrigger and Lenis smooth scrolling; UI
motion with Motion; icons from Lucide.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

Fonts are self-hosted from `app/fonts` (Geist and Instrument Serif, both
under the SIL Open Font License), so the build needs no network access.

## The work

Crorepreneur's real work is in two sections, with content under `work` in
`content/site.ts`.

**Track record** (`components/sections/Proof.tsx`) has two parts:

- **The numbers:** four figures that count up as they scroll into view.
- **Forbes India:** the feature (Top 100 Digital Stars, 2022) on a large
  lavender panel beside the numbers. It is set in type only, with no Forbes
  logo or photo.

**Selected work** (`components/sections/Work.tsx`) puts every case on one
rail of cards, in this order:

- **Featured:** the Netflix India launch of *Maa Behen*.
- **Brand campaigns:** ITC Sunrise Masale (Chhath), Horlicks and Jharkhand
  Tourism.
- **Strategy and consulting:** the jewellery retailer in Jharkhand,
  Microsoft Copilot and Ben Olive Mill.
- **The page it started on:** @yourregularmom.

The rail runs off the right edge of the screen. It swipes on touch and
scrolls on a trackpad. The arrow buttons beside the heading
(`components/ui/RailButtons.tsx`) move it one card at a time. Each button
turns off at its end of the rail.

Each case links to its original post. Every number comes from the post
itself, as of October 2026, so update them in `content/site.ts` as they
grow. Cover images are stills from each post or video, saved as WebP in
`public/images/work/`.

## The approach

The Approach section (`components/sections/Process.tsx`, copy under `process`
in `content/site.ts`) shows the five moves (Listen, Spark, Create, Amplify,
Compound).

- **Laptops and wider:** a staircase like the one in the logo. Each move is a
  column one step higher than the last, with a small graph standing on its
  step. The steps rise less on short or narrow screens (`--rise`), so all
  five fit on one.
- **Phones and tablets:** the same list, simply stacked.
- **Cost:** the staircase is CSS (`.stairs` in `app/globals.css`) and the
  graphs are inline SVG, so the section needs no script and does no work
  while scrolling.
- **The graphs:** illustrations rather than data, and the page says so.

## The About page

`/about` (`app/about/page.tsx`, sections in `components/about/`, copy under
`about` in `content/site.ts`) speaks to companies on both sides of a border:
global brands coming to India, and Indian brands going everywhere else. It
has these parts:

- **Opening:** Chabi's line on resonance, and what Crorepreneur does.
- **Who we work with:** two cards, "Into India" and "Out of India", then the
  brands we have worked with.
- **The founder:** Chabi Gupta, with her portrait.
- **The tech behind Crorepreneur:** under her bio, a short note on Shubham
  Kumar Agrawal, without a photo.
- **What we believe**, then a way to start a campaign.

Its bar keeps a **Back to home** button in view, and the home page links to
it from the navigation, the footer and the founder section. Every page
change starts at the top of the new page (`components/ui/ScrollReset.tsx`).

Chabi's portrait is the same transparent cutout as on the home page
(`public/images/founder.webp`), on the same studio backdrop. To frame it, set
`image.height` (the figure's height as a share of the frame) and `image.top`
(where its top sits) in `about.founder`.

## One screen per section

From laptop width up (1024 px and wider), every section fits one screen.
Its height is the screen's height minus the 60 px bar. The cover runs under
the bar, so it gets the whole screen.

- **How:** the `screen` class in `app/globals.css` makes a section at least
  that tall and centres what is in it.
- **Sizing:** type and spacing inside are sized against the screen's height
  (`svh`) as well as its width, inside `clamp()`. They shrink on short
  screens and stop growing on tall ones.
- **Checked sizes:** 1024 x 768, 1180 x 820, 1280 x 720, 1280 x 800,
  1366 x 680, 1440 x 800, 1536 x 864 and 1920 x 950.
- **Phones and tablets:** sections are as tall as their content and scroll
  as usual.

When you add copy to a section, check that it still fits on a short laptop
screen, such as 1366 x 680.

## Motion

`components/motion/ScrollStory.tsx` does everything that follows the
scroll: smooth, weighted scrolling on mouse and trackpad (Lenis), the cover
sinking into the dark as it scrolls away, and the manifesto lighting up
word by word. Blocks ease in as they enter the screen (`Reveal`). A block
that is scrolled past too fast to be seen, or jumped over from the
navigation, is shown anyway. Figures count up once (`CountUp`).

There is no WebGL on the page, which keeps it light and fast on phones.
Visitors who prefer reduced motion get the page still, with no scroll
effects.

## The Start a Campaign form

Every "Let’s Grow Your Brand" button opens the enquiry form
(`components/ui/EnquiryDialog.tsx`, copy under `enquiry` in
`content/site.ts`): name, work email, brand, website or Instagram, the
cities or regions the campaign should run in, a budget range, phone and a
note. Name, email and brand are required.

There is no backend yet, so `sendEnquiry()` in `lib/enquiry.ts` opens the
visitor's email app with the enquiry filled in, addressed to
`site.contact.email`, and the form tells them to press send. To deliver
enquiries from a backend instead, change only that function: POST the
enquiry and resolve `"sent"`. The form already shows a thank-you for that
case. Without script, the buttons open a blank email instead.

## Replace the placeholders

Everything temporary is marked `PLACEHOLDER` in **`content/site.ts`**. That
file holds all copy on the site, including the case studies under `work`.

| What | Where |
| --- | --- |
| Founder photo | Replace `public/images/founder.webp` (transparent cutout) |
| Founder name, bio and quote | `founder` and `founderSection` in `content/site.ts` (now her own words, from LinkedIn) |
| Contact email | `site.contact.email` |
| Social links in the footer | Add an `href` to each entry in `site.socials` |

### The founder photo

`public/images/founder.webp` is her studio headshot as a transparent cutout,
1323 x 1037. The photo's starry backdrop is removed so she sits on the site's
own backdrops; nothing else is retouched. The source photo is kept at
`design/founder-studio.jpg`, outside `public/` so it is not published.
(`design/founder-original.webp` is the previous portrait, no longer used.)
To use a different photo:

- Export it as a transparent WebP or PNG cut out from the background, head
  and shoulders.
- Save it over `public/images/founder.webp` (or change `founder.image.src`).
- Update `founder.image.aspect` to its width divided by its height.
- `founder.image.avatar` sets the crop of the small round avatar, and
  `about.founder.image` sets how it sits in the About page's frame.

The same file is used on the cover, the founder section, the avatar and the
About page.

## The logo

The logo files are in `public/brand/`, rebuilt as vectors from the brand's own
artwork ("Primary logo.pdf"):

- `crorepreneur-logo.svg`: the primary logo, in its original colours, for
  light grounds.
- `crorepreneur-logo-light.svg`: the same, in light ink, for dark grounds.
  It is used in the footer.
- `crorepreneur-lockup-light.svg`, `crorepreneur-lockup.svg`: the
  horizontal lockup, the mark beside the name, for the header and the About
  page's bar.

`components/ui/Logo.tsx` places them. The browser-tab icon (`app/icon.svg`) is
the staircase and its arrow, simplified to read at 16 px.

How they were built:

- **Text:** set from the real Poppins outlines (SIL Open Font License),
  matched to the artwork glyph by glyph.
- **Staircase:** drawn as exact strokes, dots and a triangle.
- **₹:** traced from the artwork, because it is not Poppins.
- **Colours:** orange `#e4562e`, grey `#a3a7af` and ink `#16171c`.

## Where things live

```
app/                  Layout, page, design tokens (globals.css), fonts
app/about/            The About page
components/
  about/              About page sections, its bar and back button
  layout/             Navbar, MobileMenu, Footer
  sections/           Hero, Manifesto, Proof, Work, Capabilities,
                      Process, Founder, FinalCTA
  motion/             ScrollStory: GSAP, ScrollTrigger and Lenis
  ui/                 Button, EnquiryDialog, TypeLines, Logo, Reveal,
                      RailButtons, Magnetic, CountUp, CopyEmail, Cursor,
                      icons
content/site.ts       All copy, the case studies and placeholder content
lib/                  Enquiry delivery, smooth scrolling, helpers
public/brand/         The logo files
public/images/        founder.webp (the portrait on the site)
  work/               Cover images for the case studies
design/               founder-studio.jpg (the source photo, not published)
```

## Design system

Matte and editorial:

- **Sections** alternate between a near-black and a warm off-white, with a
  soft lavender band for the one service.
- **Colour:** a dusty violet used sparingly, as light rather than paint: the
  spotlight behind the founder on the cover, a word in the voice, small
  rules and dots.
- **Finish:** flat fills, soft shadows and fine grain, with no gloss.

**Type.** Geist throughout, set heavy and tight for headings
(`display`, `section-title`) and plain for everything else. Instrument Serif
italic (`serif`) carries the voice: the last word of the cover headline,
the founder's quote and signature, and the section labels. The logo keeps its
own Poppins lettering and colours.

**Grounds.** Colours, type and easing are CSS custom properties at the top
of `app/globals.css`. The warm off-white is the default. A section picks
another ground with a scheme class, and each scheme redefines the same
tokens, so every component looks right on any ground:

- `scheme-ink` (the deepest dark: the cover, the close, the bars);
- `scheme-dark` (the track record, Work, Approach, the About founder);
- `scheme-accent` (lavender: the services band and the About beliefs).

**Pieces.**

- Every section opens with a short violet rule and its name in the serif
  voice (`section-label`).
- Lists hang off small violet dots (`hook-list`).
- The primary button is a matte pill with a violet arrow; the close uses a
  larger one.

There is one fixed look, so there is no light/dark switch.
