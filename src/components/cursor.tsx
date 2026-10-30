"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useEffect, useState } from "react";

const follow = { stiffness: 520, damping: 42, mass: 0.5 };

// A follower ring for fine pointers. The native cursor is never hidden.
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<{ label: string | null; hover: boolean }>(
    { label: null, hover: false },
  );
  const x = useSpring(useMotionValue(-100), follow);
  const y = useSpring(useMotionValue(-100), follow);

  useEffect(() => {
    const query = window.matchMedia(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
    );
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    let current = "";
    const move = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      const target = event.target as Element | null;
      const label =
        target?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null;
      const hover = !!target?.closest("a, button, summary");
      const key = `${label}|${hover}`;
      if (key === current) return;
      current = key;
      setState({ label, hover });
    };
    const leave = () => {
      x.set(-100);
      y.set(-100);
    };
    window.addEventListener("pointermove", move, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.removeEventListener("pointerleave", leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const size = state.label ? 96 : state.hover ? 54 : 12;
  return (
    <motion.div className="cursor" aria-hidden="true" style={{ x, y }}>
      <motion.div
        className={`cursor-ring${state.label ? " has-label" : ""}${state.hover ? " is-hover" : ""}`}
        animate={{ width: size, height: size }}
        transition={{ type: "spring", stiffness: 380, damping: 30 }}
      >
        <AnimatePresence>
          {state.label && (
            <motion.span
              key={state.label}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.25 }}
            >
              {state.label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
