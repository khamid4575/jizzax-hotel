"use client";

import { createElement, useRef, type ReactNode } from "react";
import { useGsap } from "@/hooks/use-gsap";
import { gsap, MQ, SplitText } from "@/lib/gsap";

// Masked line reveal for headings. Lines re-split on resize and font swap;
// SplitText keeps an aria-label with the original text for screen readers.
export function RevealText({
  as = "h2",
  children,
  className,
  id,
  delay = 0,
}: {
  as?: "h2" | "h3" | "p";
  children: ReactNode;
  className?: string;
  id?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  useGsap(ref, (media) => {
    media.add(MQ.motion, () => {
      const element = ref.current!;
      const split = SplitText.create(element, {
        type: "lines",
        mask: "lines",
        linesClass: "reveal-line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 115,
            rotate: 2.5,
            transformOrigin: "0% 0%",
            duration: 1.4,
            delay,
            stagger: 0.09,
            scrollTrigger: { trigger: element, start: "top 88%", once: true },
          }),
      });
      return () => split.revert();
    });
  });
  return createElement(as, { ref, className, id }, children);
}
