"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";
import { photo } from "@/lib/hotel";
import { Arrow } from "./icons";
import { Rosette } from "./rosette";

function Chip({ image, shape }: { image: string; shape: "arch" | "pill" }) {
  return (
    <span className={`chip chip-${shape}`} aria-hidden="true">
      <span className="chip-inner">
        <Image src={photo(image)} alt="" fill sizes="240px" />
      </span>
    </span>
  );
}

export function Manifesto() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);

    media.add(MQ.motion, () => {
      // Photographs open up inside the sentence as it scrolls into place.
      gsap.fromTo(
        q(".chip-inner"),
        { clipPath: "inset(0% 50% 0% 50%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          ease: "none",
          stagger: 0.15,
          scrollTrigger: {
            trigger: q(".manifesto-title")[0],
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        },
      );
      gsap.fromTo(
        q(".chip-inner img"),
        { scale: 1.7 },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: q(".manifesto-title")[0],
            start: "top 85%",
            end: "bottom 40%",
            scrub: 0.6,
          },
        },
      );
      gsap.from(q(".manifesto-line"), {
        yPercent: 110,
        duration: 1.4,
        stagger: 0.1,
        scrollTrigger: { trigger: q(".manifesto-title")[0], start: "top 85%", once: true },
      });

      // Ink fill: each line is painted from left to right as it passes.
      const split = SplitText.create(q(".manifesto-text"), {
        type: "lines",
        linesClass: "ink-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.lines,
            { backgroundPositionX: "100%" },
            {
              backgroundPositionX: "0%",
              ease: "none",
              stagger: 0.5,
              scrollTrigger: {
                trigger: q(".manifesto-text")[0],
                start: "top 80%",
                end: "bottom 50%",
                scrub: true,
              },
            },
          ),
      });

      gsap.fromTo(
        q(".manifesto-arch"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.8,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".manifesto-arch")[0], start: "top 85%", once: true },
        },
      );
      gsap.fromTo(
        q(".manifesto-detail"),
        { clipPath: "inset(0% 0% 100% 0%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.5,
          delay: 0.3,
          ease: "expo.inOut",
          scrollTrigger: { trigger: q(".manifesto-arch")[0], start: "top 75%", once: true },
        },
      );
      gsap.to(q(".manifesto-rosette"), {
        rotate: 120,
        ease: "none",
        scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
      });
      gsap.from(q(".fact"), {
        y: 40,
        autoAlpha: 0,
        stagger: 0.1,
        duration: 1.2,
        scrollTrigger: { trigger: q(".facts")[0], start: "top 88%", once: true },
      });
      q("[data-count]").forEach((node) => {
        const counter = { value: 0 };
        gsap.to(counter, {
          value: Number(node.dataset.count),
          duration: 2,
          ease: "power3.out",
          scrollTrigger: { trigger: node, start: "top 90%", once: true },
          onUpdate: () => {
            node.textContent = String(Math.round(counter.value)).padStart(2, "0");
          },
        });
      });
      return () => split.revert();
    });

    media.add(MQ.desktop, () => {
      gsap.fromTo(
        q(".manifesto-arch img"),
        { yPercent: -8, scale: 1.2 },
        {
          yPercent: 8,
          scale: 1.05,
          ease: "none",
          scrollTrigger: { trigger: q(".manifesto-arch")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
      );
      gsap.fromTo(
        q(".manifesto-detail"),
        { yPercent: 30 },
        {
          yPercent: -40,
          ease: "none",
          scrollTrigger: { trigger: q(".manifesto-visual")[0], start: "top bottom", end: "bottom top", scrub: true },
        },
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

      <h2 id="manifesto-title" className="manifesto-title">
        <span className="line-mask">
          <span className="manifesto-line">
            Uzbek <Chip image="7aca0fed2df37ef5" shape="arch" /> warmth,
          </span>
        </span>
        <span className="line-mask">
          <span className="manifesto-line">
            <em>a new</em> <Chip image="d0464e578d38e548" shape="pill" />{" "}
            <em>perspective</em>
          </span>
        </span>
        <span className="line-mask">
          <span className="manifesto-line">
            in the heart of <Chip image="f5aa3152a6cc4417" shape="arch" />{" "}
            Tashkent.
          </span>
        </span>
      </h2>

      <div className="manifesto-body">
        <div className="manifesto-visual">
          <Rosette className="manifesto-rosette" />
          <figure className="manifesto-arch">
            <Image
              src={photo("5f9a6ecdf363f4e4")}
              alt="Seating area at Jizzax Hotel with traditional patterned cushions"
              fill
              sizes="(max-width: 999px) 80vw, 34vw"
            />
          </figure>
          <figure className="manifesto-detail">
            <Image
              src={photo("dc37521878c2d8a9")}
              alt="A junior suite opening onto a balcony above the city"
              fill
              sizes="(max-width: 999px) 44vw, 17vw"
            />
            <figcaption>The details make the difference.</figcaption>
          </figure>
        </div>

        <div className="manifesto-copy">
          <p className="manifesto-text">
            There’s a particular feeling to a place that welcomes you. A
            thoughtful detail, a familiar warmth, space to make yourself at
            home. Here the spirit of Jizzax meets a contemporary Tashkent
            address, near New Uzbekistan Park.
          </p>
          <a className="text-link" href="https://jizzaxhotel.uz/en-gb/about/">
            Get to know Jizzax <Arrow diagonal />
          </a>
          <dl className="facts">
            <div className="fact">
              <dt>Room & suite types</dt>
              <dd data-count="8">08</dd>
            </div>
            <div className="fact">
              <dt>Floor lounge with city views</dt>
              <dd>
                <span data-count="5">05</span>
                <sup>th</sup>
              </dd>
            </div>
            <div className="fact">
              <dt>Restaurant, wellness & meetings</dt>
              <dd className="fact-word">
                <em>All here</em>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
