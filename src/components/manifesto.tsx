"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { RevealText } from "./reveal-text";

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);
    media.add(MQ.motion, () => {
      // Words light up one by one as the paragraph passes through the viewport.
      const split = SplitText.create(q(".manifesto-text"), {
        type: "words",
        wordsClass: "manifesto-word",
      });
      gsap.fromTo(
        split.words,
        { opacity: 0.14 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.12,
          scrollTrigger: {
            trigger: q(".manifesto-text"),
            start: "top 78%",
            end: "bottom 42%",
            scrub: true,
          },
        },
      );
      gsap.to(q(".ornament"), {
        rotate: 180,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
      q(".collage figure").forEach((figure, index) => {
        gsap.fromTo(
          figure,
          {
            clipPath:
              index % 2 ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)",
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            duration: 1.6,
            ease: "expo.inOut",
            scrollTrigger: { trigger: figure, start: "top 88%", once: true },
          },
        );
      });
      return () => split.revert();
    });

    media.add(MQ.desktop, () => {
      // Four depth planes: each layer drifts at its own rate.
      q("[data-speed]").forEach((layer) => {
        const speed = Number(layer.dataset.speed);
        gsap.fromTo(
          layer,
          { yPercent: -speed * 50 },
          {
            yPercent: speed * 50,
            ease: "none",
            scrollTrigger: {
              trigger: q(".collage"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
      q(".collage figure img").forEach((image) =>
        gsap.fromTo(
          image,
          { scale: 1.25, yPercent: -6 },
          {
            scale: 1.05,
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: image.closest("figure"),
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        ),
      );
    });
  });

  return (
    <section
      ref={root}
      className="manifesto"
      id="about"
      aria-labelledby="manifesto-title"
      data-header="light"
    >
      <div className="kicker">
        <span>01 — A sense of place</span>
        <span>Inspired by Jizzax. At home in Tashkent.</span>
      </div>
      <RevealText id="manifesto-title" className="manifesto-title">
        Uzbek warmth. <em>A new perspective.</em>
      </RevealText>
      <p className="manifesto-text">
        There’s a particular feeling to a place that welcomes you. A thoughtful
        detail. A familiar warmth. Space to make yourself at home. At Jizzax
        Hotel, the spirit of Jizzax meets a contemporary Tashkent address, near
        New Uzbekistan Park.
      </p>

      <div className="collage">
        <figure className="collage-a" data-speed="0.18">
          <Image
            src={photo("d0464e578d38e548")}
            alt="A guest room with blue curtains and natural light"
            fill
            sizes="(max-width: 999px) 86vw, 44vw"
          />
        </figure>
        <figure className="collage-b" data-speed="-0.35">
          <Image
            src={photo("dc37521878c2d8a9")}
            alt="A junior suite opening onto a balcony above the city"
            fill
            sizes="(max-width: 999px) 52vw, 24vw"
          />
        </figure>
        <svg
          className="ornament"
          data-speed="-0.6"
          viewBox="0 0 120 120"
          aria-hidden="true"
        >
          <g fill="none" stroke="currentColor" strokeWidth="0.8">
            <rect x="25" y="25" width="70" height="70" />
            <rect
              x="25"
              y="25"
              width="70"
              height="70"
              transform="rotate(45 60 60)"
            />
            <circle cx="60" cy="60" r="20" />
            <circle cx="60" cy="60" r="49" strokeDasharray="2 5" />
          </g>
        </svg>
        <p className="collage-note" data-speed="0.45">
          The details
          <br />
          make the difference.
        </p>
        <div className="collage-copy" data-speed="-0.12">
          <p>
            Local patterns, a fifth-floor lounge and quiet corners for
            conversation — every space is shaped for an unhurried stay.
          </p>
          <a
            className="text-link"
            href="https://jizzaxhotel.uz/en-gb/about/"
          >
            Get to know Jizzax <Arrow diagonal />
          </a>
        </div>
      </div>
    </section>
  );
}
