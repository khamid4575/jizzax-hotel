"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ } from "@/lib/gsap";
import { photo } from "@/lib/hotel";

// CSS describes the final, expanded composition. Motion only adds the
// "contained frame" starting state, so no-JS and reduced motion stay complete.
export function Expansion() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    media.add(MQ.desktop, () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=160%",
            pin: q(".expand-stage")[0],
            scrub: 0.8,
            anticipatePin: 1,
          },
        })
        .fromTo(
          q(".expand-frame"),
          { clipPath: "inset(21% 35% 21% 35% round 18px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1 },
          0,
        )
        .fromTo(q(".expand-frame img"), { scale: 1.5 }, { scale: 1, duration: 1.1 }, 0)
        .fromTo(q(".expand-shade"), { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.45)
        .fromTo(
          q(".expand-left"),
          { xPercent: 0, color: "#071d35" },
          { xPercent: -22, color: "#ffffff", duration: 1 },
          0,
        )
        .fromTo(
          q(".expand-right"),
          { xPercent: 0, color: "#071d35" },
          { xPercent: 22, color: "#ffffff", duration: 1 },
          0,
        )
        .fromTo(q(".expand-label"), { color: "#0762b7" }, { color: "#b8dff1", duration: 0.5 }, 0.4)
        .from(q(".expand-caption"), { y: 60, autoAlpha: 0, duration: 0.35 }, 0.95)
        .to({}, { duration: 0.25 });
    });

    media.add(MQ.compact, () => {
      gsap
        .timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: root.current,
            start: "top 85%",
            end: "top 10%",
            scrub: true,
          },
        })
        .fromTo(
          q(".expand-frame"),
          { clipPath: "inset(12% 14% 12% 14% round 22px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px)" },
          0,
        )
        .fromTo(q(".expand-frame img"), { scale: 1.35 }, { scale: 1 }, 0)
        .from(q(".expand-left"), { xPercent: -30 }, 0)
        .from(q(".expand-right"), { xPercent: 30 }, 0);
    });
  });

  return (
    <section
      ref={root}
      className="expand"
      aria-labelledby="expand-title"
      data-header="dark"
    >
      <div className="expand-stage">
        <div className="expand-frame">
          <Image
            src={photo("7aca0fed2df37ef5")}
            alt="The Jizzax lobby, with a regional ornament on the ceiling and a glass entrance"
            fill
            sizes="100vw"
            quality={75}
          />
          <div className="expand-shade" />
        </div>
        <span className="expand-label">02 — Arrival</span>
        <h2 id="expand-title" className="expand-title">
          <span className="expand-left">A welcome</span>
          <span className="expand-right">
            <em>with soul.</em>
          </span>
        </h2>
        <p className="expand-caption">
          Step into a place shaped by Uzbek hospitality. Local patterns,
          familiar warmth, and time to settle in.
        </p>
      </div>
    </section>
  );
}
