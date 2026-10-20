# Crorepreneur

Website for Crorepreneur, an Instagram influencer marketing agency founded by
Chabi Gupta. One page, told as a scroll story: the founder on a magazine-style
cover with a headline that types itself on a loop, a manifesto, selected
campaigns, services, the method, a section on the founder, and the call to
start a campaign, which opens an enquiry form. Light and dark themes, in a
matte finish.

Built with Next.js (App Router), React, TypeScript and Tailwind CSS v4.
3D with three.js, React Three Fiber and drei; scroll animation with GSAP
ScrollTrigger and Lenis smooth scrolling; UI motion with Motion; icons from
Lucide.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve the production build
npm run lint
```

Fonts are self-hosted from `app/fonts`, so the build needs no network access.

## How the 3D works

A single fixed WebGL canvas sits behind the whole page
(`components/three/Stage3D.tsx`). The HTML scrolls over it.

- **The phone** (`story/Phone.tsx`) flies to whichever slot the section on
  screen reserves for it. A slot is any element with a `data-anchor` name
  (see `story/anchors.ts`). It turns a full circle when the section changes,
  rocks with scroll speed and follows the mouse. It has a satin titanium
  frame, a soft-touch back and side buttons. Its screen is drawn with the
  canvas API (`story/screen.ts`): Chabi's reel, or the selected campaign,
  with a playback bar that keeps running. The view counter climbs from 100
  to 1,00,00,000 as the page scrolls.
- **The orrery** (`story/Orrery.tsx`) is a gyroscope of three thin rings, in
  satin metal and matte violet, each turning on its own axis inside the
  next, with matte spheres on tilted orbits around it. It orbits Chabi's
  head on the cover and her portrait further down, wraps the phone wherever
  the phone lands (passing in front of it and behind it), and drifts large
  and far back behind the sections that are mostly text. It assembles with a
  slow spin when the page opens and turns faster while the page scrolls.
- **The lighting** (`story/Studio.tsx`) is a drei `Environment` built from
  soft boxes (`Lightformer`), plus muted rim lights that keep moving, so the
  light travels over every surface.
- **The atmosphere** (`story/StoryCanvas.tsx`): a fog in the page's own
  colour fades whatever is far behind the phone into the page, for depth at
  no cost per frame.
- **The closing figure** (`crore/CroreScene.tsx`) is one crore in satin
  metal. The numerals fly in, then turn to face the cursor.

The page and the scene share state through `lib/story.ts`.
`components/motion/ScrollStory.tsx` drives all of it from the scroll
position: the current section, scroll speed, view count, the cover sinking
into the dark, and the manifesto lighting up word by word.

It is built to stay light so scrolling stays smooth: no post-processing
(the canvas renders straight to the screen, with neutral tone mapping), a
capped pixel ratio, slots measured once and then placed from the scroll
position (nothing reads layout in the render loop), and the closing figure's
canvas only draws while it is on screen. If the frame rate still drops, the
main canvas lowers its resolution.

The 3D loads after the page is interactive and only where WebGL works.
Visitors who prefer reduced motion get no 3D and no scroll effects. Flat phone
mock-ups stand in each slot until the 3D is drawing, so the layout never has a
hole. On phones the scene uses fewer icons and a lower pixel ratio.

## The Start a Campaign form

Every "Start a Campaign" button opens the enquiry form
(`components/ui/EnquiryDialog.tsx`, copy under `enquiry` in
`content/site.ts`): name, work email, brand, website or Instagram, the
services they need, a budget range, phone and a note. Name, email and brand
are required.

There is no backend yet, so `sendEnquiry()` in `lib/enquiry.ts` opens the
visitor's email app with the enquiry filled in, addressed to
`site.contact.email`, and the form tells them to press send. To deliver
enquiries from a backend instead, change only that function: POST the
enquiry and resolve `"sent"`. The form already shows a thank-you for that
case. Without script, the buttons open a blank email instead.

## Replace the placeholders

Everything temporary is marked `PLACEHOLDER` in **`content/site.ts`**. That
file holds all copy on the site.

| What | Where |
| --- | --- |
| Founder photo | Replace `public/images/founder.webp` (transparent cutout) |
| Founder name, bio and quote | `founder` and `founderSection` in `content/site.ts` |
| Contact email | `site.contact.email` |
| Campaigns and their numbers | `work.projects` |
| "Sample campaigns" notice | Set `work.sampleNotice` to `null` once the work is real |
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

The same file is used on the cover, the phone's screen, the founder section
and the avatars.

## Where things live

```
app/                  Layout, page, design tokens (globals.css), fonts
components/
  layout/             Navbar, MobileMenu, Footer
  sections/           Hero, Manifesto, ProjectShowcase, Capabilities,
                      Process, Founder, FinalCTA
  motion/             ScrollStory: GSAP, ScrollTrigger and Lenis
  three/              Stage3D loader, shared helpers, CroreFigure
    story/            Phone, Orrery, Studio, screen drawing, anchors
    crore/            The closing 3D figure
  ui/                 Button, EnquiryDialog, TypeLines, ThemeToggle,
                      Wordmark, PhoneSlot, Reveal, Magnetic, CountUp,
                      CopyEmail, Cursor, icons
content/site.ts       All copy and placeholder content
lib/                  Story state, enquiry delivery, theme, helpers
public/images/        founder.webp (the portrait on the site)
design/               founder-original.webp (unedited cutout, not published)
```

## Design system

The finish is matte throughout: warm-neutral grounds, a dusty violet used
sparingly, flat fills, soft shadows and fine grain, with no gloss or glow.

Colours, type and easing are CSS custom properties at the top of
`app/globals.css`. The bare `:root` block is the light palette; the two dark
blocks redefine the same tokens. The 3D reads the same tokens (`--metal`,
`--matte-*` and `--bg`), so its finishes and backdrop follow the theme.

The theme follows the system setting until the visitor uses the toggle. Their
choice is stored in `localStorage` and applied in `<head>` before first paint.
