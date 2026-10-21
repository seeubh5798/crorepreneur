# Crorepreneur

Website for Crorepreneur, an Instagram influencer marketing agency founded by
Chabi Gupta. One page, told as a scroll story: the founder on a
magazine-style cover with a headline that types itself on a loop, a
manifesto, the work (real case studies), the one service (hyperlocal
campaigns), the method, a section on the founder, and the call to start a
campaign, which opens an enquiry form. A separate About page (`/about`)
tells the story and introduces the team. Light and dark themes, in a matte
finish.

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

Fonts are self-hosted from `app/fonts`, so the build needs no network access.

## The work

The Work section (`components/sections/Work.tsx`, content under `work` in
`content/site.ts`) shows Crorepreneur's real work, in this order:

- **The numbers:** four figures that count up as they scroll into view.
- **Featured:** the Netflix India launch of *Maa Behen*.
- **Brand campaigns:** ITC Sunrise Masale (Chhath), Horlicks and Jharkhand
  Tourism.
- **Strategy and consulting:** the jewellery retailer in Jharkhand,
  Microsoft Copilot and Ben Olive Mill.
- **The page and the press:** @yourregularmom beside the Forbes India
  feature.

Each case links to its original post. Every number comes from the post
itself, as of October 2026, so update them in `content/site.ts` as they
grow. Cover images are stills from each post or video, saved as WebP in
`public/images/work/`. On phones, each row of cards is a rail you swipe
sideways; from tablets up it is a grid.

## The About page

`/about` (`app/about/page.tsx`, sections in `components/about/`, copy under
`about` in `content/site.ts`) has four parts:

- **Opening:** Chabi's line on resonance.
- **How we got here:** a timeline from 2020 to 2026.
- **The people behind it:** Chabi Gupta (founder, MBA from Kelley) and
  Shubham Kumar Agrawal (technology, IIT Bhubaneswar).
- **What we believe**, then a way to start a campaign.

Its bar keeps a **Back to home** button in view, and the home page links to
it from the navigation, the footer and the founder section.

Both portraits are transparent cutouts on the same studio backdrop as the
founder card on the home page. Chabi's is `public/images/founder.webp`.
Shubham's, `public/images/team/shubham.webp`, is his LinkedIn photo with the
background removed. To frame a portrait, set `image.height` (the figure's
height as a share of the frame) and `image.top` (where its top sits) for that
person in `about.team`. The facts come from both LinkedIn profiles, Chabi's
posts and Forbes India, as of October 2026.

## Motion

`components/motion/ScrollStory.tsx` does everything that follows the
scroll: smooth, weighted scrolling on mouse and trackpad (Lenis), the cover
sinking into the dark as it scrolls away, and the manifesto lighting up
word by word. Blocks ease in as they enter the screen (`Reveal`) and
figures count up once (`CountUp`).

There is no WebGL on the page, which keeps it light and fast on phones.
Visitors who prefer reduced motion get the page still, with no scroll
effects.

## The Start a Campaign form

Every "Start a Campaign" button opens the enquiry form
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

`public/images/founder.webp` is a transparent cutout, about 830 x 1250. It is
a studio-style edit of her photo, made with an AI model run locally: the
styling (hair behind one shoulder), a tailored black blazer over an ivory
top, studio light and an editorial grade. Her face is the original
photograph. The unedited cutout is kept at `design/founder-original.webp`,
outside `public/` so it is not published; copy it over
`public/images/founder.webp` to use it instead. To use a different photo:

- Export it as a transparent WebP or PNG cut out from the background, head
  and shoulders.
- Save it over `public/images/founder.webp` (or change `founder.image.src`).
- Update `founder.image.aspect` to its width divided by its height.
- `founder.image.avatar` sets the crop of the small round avatar.

The same file is used on the cover, the founder section and the avatars.

## Where things live

```
app/                  Layout, page, design tokens (globals.css), fonts
app/about/            The About page
components/
  about/              About page sections, its bar and back button
  layout/             Navbar, MobileMenu, Footer
  sections/           Hero, Manifesto, Work, Capabilities, Process,
                      Founder, FinalCTA
  motion/             ScrollStory: GSAP, ScrollTrigger and Lenis
  ui/                 Button, EnquiryDialog, TypeLines, ThemeToggle,
                      Wordmark, Reveal, Magnetic, CountUp, CopyEmail,
                      Cursor, icons
content/site.ts       All copy, the case studies and placeholder content
lib/                  Enquiry delivery, smooth scrolling, theme, helpers
public/images/        founder.webp (the portrait on the site)
  work/               Cover images for the case studies
  team/               Team portraits for the About page
design/               founder-original.webp (unedited cutout, not published)
```

## Design system

The finish is matte throughout: warm-neutral grounds, a dusty violet used
sparingly, flat fills, soft shadows and fine grain, with no gloss or glow.

Colours, type and easing are CSS custom properties at the top of
`app/globals.css`. The bare `:root` block is the light palette; the two dark
blocks redefine the same tokens.

The theme follows the system setting until the visitor uses the toggle. Their
choice is stored in `localStorage` and applied in `<head>` before first paint.
