import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, Flip, SplitText);
  gsap.defaults({ ease: "expo.out", duration: 1.2 });
}

// Desktop compositions pin and scrub; compact screens get their own,
// pin-free choreography. Reduced motion matches neither, so content stays put.
export const MQ = {
  motion: "(prefers-reduced-motion: no-preference)",
  desktop:
    "(min-width: 1000px) and (min-height: 560px) and (prefers-reduced-motion: no-preference)",
  compact:
    "(max-width: 999px) and (prefers-reduced-motion: no-preference), (max-height: 559px) and (prefers-reduced-motion: no-preference)",
  finePointer:
    "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
} as const;

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, Flip, SplitText };
