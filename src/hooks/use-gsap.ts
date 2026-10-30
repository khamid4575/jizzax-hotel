"use client";

import {
  useEffect,
  useLayoutEffect,
  type DependencyList,
  type RefObject,
} from "react";
import { gsap } from "@/lib/gsap";

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

type Setup = (media: gsap.MatchMedia) => void | (() => void);

// Scopes every tween, ScrollTrigger and SplitText created in `setup` to one
// component, and reverts all of them (and their inline styles) on unmount.
export function useGsap(
  scope: RefObject<HTMLElement | null>,
  setup: Setup,
  deps: DependencyList = [],
) {
  useIsomorphicLayoutEffect(() => {
    const element = scope.current;
    if (!element) return;
    const media = gsap.matchMedia(element);
    let teardown: void | (() => void);
    const context = gsap.context(() => {
      teardown = setup(media);
    }, element);
    return () => {
      teardown?.();
      media.revert();
      context.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
