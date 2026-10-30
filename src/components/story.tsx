"use client";

import Image from "next/image";
import { useRef } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ } from "@/lib/gsap";
import { hotel, photo } from "@/lib/hotel";
import { Arrow } from "./icons";

const chapters = [
  {
    word: "Linger",
    title: "Let the day slow down.",
    text: "Make time for conversation. Find a quiet corner, enjoy the restaurant, or take in the city from the fifth-floor lounge.",
    image: "5f9a6ecdf363f4e4",
    alt: "Seating area at Jizzax Hotel with traditional patterned cushions",
    link: { label: "Dining", href: "https://jizzaxhotel.uz/en-gb/restaurants/" },
  },
  {
    word: "Connect",
    title: "Bring ideas together.",
    text: "A place to meet, exchange ideas, and make plans. Our conference room and team are here to help.",
    image: "b4227c450f5945ba",
    alt: "Jizzax Hotel conference room with rows of blue upholstered chairs",
    link: {
      label: "Gatherings",
      href: `mailto:${hotel.email}?subject=Meeting%20enquiry`,
    },
  },
  {
    word: "Unwind",
    title: "A quiet room above the city.",
    text: "Soft light, crisp linen and a private balcony in our suites. Spaces to unwind are never far away.",
    image: "2c10cb74b517fcc4",
    alt: "The senior king suite with patterned headboard art and tall windows",
    link: { label: "Wellness", href: "https://jizzaxhotel.uz/en-gb/spa/" },
  },
];

export function Story() {
  const root = useRef<HTMLElement>(null);

  useGsap(root, (media) => {
    const q = gsap.utils.selector(root);

    media.add(MQ.desktop, () => {
      const element = root.current!;
      element.classList.add("is-pinned");
      const figures = q(".story-figure");
      const copies = q(".story-copy");
      gsap.set(copies.slice(1), { autoAlpha: 0 });
      gsap.set(figures.slice(1), { clipPath: "inset(100% 0% 0% 0%)" });

      const timeline = gsap.timeline({
        defaults: { ease: "power2.inOut" },
        scrollTrigger: {
          trigger: q(".story-pin")[0],
          start: "top top",
          end: () => `+=${window.innerHeight * (chapters.length - 0.4)}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      });
      timeline.to(q(".story-progress span"), {
        scaleY: 1,
        ease: "none",
        duration: chapters.length - 0.4,
      }, 0);
      for (let i = 1; i < chapters.length; i++) {
        const at = i - 0.7;
        const leaving = copies[i - 1].querySelectorAll("[data-line]");
        const entering = copies[i].querySelectorAll("[data-line]");
        timeline
          .to(figures[i - 1].querySelector("img"), { scale: 1.18, yPercent: -8, duration: 1 }, at)
          .fromTo(figures[i], { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1 }, at)
          .fromTo(figures[i].querySelector("img"), { scale: 1.4, yPercent: 10 }, { scale: 1.05, yPercent: 0, duration: 1.1 }, at)
          .to(leaving, { yPercent: -110, opacity: 0, stagger: 0.05, duration: 0.45 }, at)
          .set(copies[i - 1], { autoAlpha: 0 }, at + 0.5)
          .set(copies[i], { autoAlpha: 1 }, at + 0.35)
          .fromTo(entering, { yPercent: 110, opacity: 0 }, { yPercent: 0, opacity: 1, stagger: 0.06, duration: 0.55, ease: "expo.out" }, at + 0.4)
          .to(q(".story-counter-track"), { yPercent: (-100 / chapters.length) * i, duration: 0.6, ease: "expo.inOut" }, at + 0.25)
          .to(q(".story-word-track"), { yPercent: (-100 / chapters.length) * i, duration: 0.8, ease: "expo.inOut" }, at + 0.1);
      }
      return () => element.classList.remove("is-pinned");
    });

    media.add(MQ.compact, () => {
      // Sticky cards: each chapter settles back as the next one slides over it.
      const cards = q(".story-chapter");
      cards.forEach((card, index) => {
        const next = cards[index + 1];
        gsap.from(card.querySelectorAll("[data-line]"), {
          yPercent: 60,
          opacity: 0,
          stagger: 0.08,
          duration: 1,
          scrollTrigger: { trigger: card, start: "top 70%", once: true },
        });
        if (!next) return;
        gsap.to(card.querySelector(".story-card"), {
          scale: 0.9,
          yPercent: -4,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 12%",
            scrub: true,
          },
        });
        gsap.to(card.querySelector(".story-dim"), {
          opacity: 0.6,
          ease: "none",
          scrollTrigger: {
            trigger: next,
            start: "top bottom",
            end: "top 12%",
            scrub: true,
          },
        });
      });
    });
  });

  return (
    <section
      ref={root}
      className="story"
      id="experiences"
      aria-labelledby="story-title"
      data-header="dark"
    >
      <div className="story-pin">
        <div className="story-head">
          <span className="kicker-label">03 — More than a stay</span>
          <h2 id="story-title">
            The Jizzax <em>rhythm.</em>
          </h2>
        </div>
        <div className="story-word" aria-hidden="true">
          <span className="story-word-track">
            {chapters.map((chapter) => (
              <span key={chapter.word}>{chapter.word}</span>
            ))}
          </span>
        </div>
        <div className="story-counter" aria-hidden="true">
          <span className="story-counter-window">
            <span className="story-counter-track">
              {chapters.map((chapter, index) => (
                <span key={chapter.word}>0{index + 1}</span>
              ))}
            </span>
          </span>
          <span>/ 0{chapters.length}</span>
        </div>
        <div className="story-progress" aria-hidden="true">
          <span />
        </div>

        {chapters.map((chapter, index) => (
          <article className="story-chapter" key={chapter.word}>
            <div className="story-card">
              <figure className="story-figure">
                <Image
                  src={photo(chapter.image)}
                  alt={chapter.alt}
                  fill
                  sizes="(max-width: 999px) 92vw, 50vw"
                />
              </figure>
              <div className="story-copy">
                <span className="story-index" data-line>
                  0{index + 1} / {chapter.word}
                </span>
                <div className="line-mask">
                  <h3 data-line>{chapter.title}</h3>
                </div>
                <div className="line-mask">
                  <p data-line>{chapter.text}</p>
                </div>
                <div className="line-mask">
                  <a className="text-link" href={chapter.link.href} data-line>
                    {chapter.link.label} <Arrow diagonal />
                  </a>
                </div>
              </div>
              <span className="story-dim" aria-hidden="true" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
