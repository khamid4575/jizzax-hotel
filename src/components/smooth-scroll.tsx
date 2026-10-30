"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.motionReady = "true";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | null = null;
    const tick = (time: number) => lenis?.raf(time * 1000);

    const start = () => {
      if (lenis || reduce.matches) return;
      // Wheel input is smoothed; touch keeps native momentum scrolling.
      lenis = new Lenis({
        lerp: 0.085,
        wheelMultiplier: 0.9,
        anchors: true,
        autoRaf: false,
      });
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
      setLenis(lenis);
    };
    const stop = () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis?.destroy();
      lenis = null;
      setLenis(null);
    };
    const onChange = () => {
      if (reduce.matches) {
        stop();
        delete root.dataset.motion;
      } else start();
      ScrollTrigger.refresh();
    };

    start();
    reduce.addEventListener("change", onChange);
    let frame = 0;
    const refresh = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      cancelAnimationFrame(frame);
      reduce.removeEventListener("change", onChange);
      window.removeEventListener("load", refresh);
      stop();
      delete root.dataset.motionReady;
    };
  }, []);
  return null;
}
