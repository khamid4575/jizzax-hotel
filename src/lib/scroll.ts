import type Lenis from "lenis";

let instance: Lenis | null = null;
let locks = 0;

export const setLenis = (lenis: Lenis | null) => {
  instance = lenis;
};

// Dialogs lock both Lenis and native scrolling; nested locks are counted.
export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  instance?.stop();
  document.documentElement.style.overflow = "hidden";
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks) return;
  document.documentElement.style.overflow = "";
  instance?.start();
}

export function scrollToTarget(target: string | HTMLElement | number) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (instance && !reduce) {
    instance.scrollTo(target, { duration: 1.6 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduce ? "instant" : "smooth" });
    return;
  }
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  element?.scrollIntoView({ behavior: reduce ? "instant" : "smooth" });
}
