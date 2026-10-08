import { manifesto } from "@/content/site";
import { PhoneSlot } from "@/components/ui/PhoneSlot";
import { Reveal } from "@/components/ui/Reveal";

/**
 * One statement that lights up word by word as it scrolls past (ScrollStory),
 * with the phone landing beside it showing the founder's reel. Under it, the
 * creator categories run past in a slow band.
 */
export function Manifesto() {
  const words = manifesto.statement.split(" ");
  return (
    <section
      id="manifesto"
      data-stage="manifesto"
      aria-label="What Crorepreneur does"
      className="relative py-20 lg:py-32"
    >
      <div className="shell grid items-center gap-x-10 gap-y-12 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p
            data-manifesto
            className="display text-[clamp(2.15rem,6.4vw,3.4rem)] leading-[1.06] text-fg lg:text-[clamp(3rem,4.4vw,4.4rem)]"
          >
            {words.map((word, index) => (
              <span key={`${word}-${index}`} data-word className="manifesto-word">
                {word}{" "}
              </span>
            ))}
          </p>
          <Reveal>
            <p className="mt-8 max-w-[34rem] text-[1.0625rem] leading-[1.6] text-fg-2">{manifesto.body}</p>
          </Reveal>
        </div>
        <div className="relative flex justify-center lg:col-span-4 lg:col-start-9">
          <div aria-hidden="true" className="slot-glow absolute inset-[-10%]" />
          <PhoneSlot anchor="phone-manifesto" show="founder" className="h-[min(64svh,34rem)] max-w-full" />
        </div>
      </div>

      <div className="mt-20 lg:mt-28">
        <p className="shell mb-5 text-sm text-fg-3">{manifesto.categoriesLabel}</p>
        <div className="marquee border-y border-line" aria-label={manifesto.categories.join(", ")}>
          <div aria-hidden="true" className="marquee-track">
            {[0, 1].map((copy) => (
              <ul key={copy} className="marquee-group">
                {manifesto.categories.map((category) => (
                  <li key={category} className="display marquee-item">
                    {category}
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
