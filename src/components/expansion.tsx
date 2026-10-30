"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { photo } from "@/lib/hotel";

const SLICES = 6;
// Each panel overlaps its neighbour slightly so no sub-pixel seam shows.
const panel = (i: number) =>
  `inset(0% ${Math.max(0, (100 / SLICES) * (SLICES - 1 - i) - 0.3)}% 0% ${(100 / SLICES) * i}%)`;

// The lobby assembles from vertical panels, like a carved screen sliding
// shut. CSS shows the finished photograph; motion only adds the journey.
export function Expansion() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    const slices = () => q(".slice");

    media.add(MQ.desktop, () => {
      const split = SplitText.create(q(".expand-title"), {
        type: "words,chars",
        charsClass: "expand-char",
      });
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=90%",
            pin: q(".expand-stage")[0],
            scrub: 0.8,
          },
        })
        .fromTo(
          slices(),
          {
            yPercent: (i) => (i % 2 ? 62 : -62),
            clipPath: (i) => `inset(0% ${(100 / SLICES) * (SLICES - 1 - i)}% 0% ${(100 / SLICES) * i + 3}%)`,
          },
          {
            yPercent: 0,
            clipPath: (i) => panel(i),
            duration: 1,
            stagger: { each: 0.06, from: "center" },
            ease: "power3.inOut",
          },
          0,
        )
        .fromTo(q(".slice img"), { scale: 1.2 }, { scale: 1, duration: 1.2 }, 0)
        .from(split.chars, {
          yPercent: (i) => (i % 2 ? 60 : -60),
          opacity: 0,
          stagger: 0.025,
          duration: 0.5,
        }, 0.15)
        .from(q(".expand-label, .expand-caption"), { y: 30, autoAlpha: 0, duration: 0.3, stagger: 0.1 }, 0.4)
        .to({}, { duration: 0.2 });
      return () => split.revert();
    });

    media.add(MQ.compact, () => {
      gsap.fromTo(
        slices(),
        { yPercent: (i) => (i % 2 ? 40 : -40) },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 15%", scrub: true },
        },
      );
    });
  });

  return (
    <section
      ref={root}
      className="expand"
      aria-labelledby="expand-title"
      data-header="light"
    >
      <div className="expand-stage">
        <div className="expand-copy">
          <span className="sr-only">
            The Jizzax lobby, with a regional ornament on the ceiling and a glass
            entrance.
          </span>
          <span className="expand-label">02 — Arrival</span>
          <h2 id="expand-title" className="expand-title">
            A welcome <em>with soul.</em>
          </h2>
          <p className="expand-caption">
            Step into a place shaped by Uzbek hospitality. Local patterns,
            familiar warmth, and time to settle in.
          </p>
        </div>
        <div className="expand-frame" aria-hidden="true">
          {Array.from({ length: SLICES }, (_, i) => (
            <div
              className="slice"
              key={i}
              style={{
                clipPath: panel(i),
              }}
            >
              <Image
                src={photo("7aca0fed2df37ef5")}
                alt=""
                fill
                sizes="(max-width: 999px) 92vw, 52vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
