"use client";

import { useEffect } from "react";

export function Motion() {
  useEffect(() => {
    let disposed = false;
    let cleanup = () => {};
    // Both imports are bundled locally by Next. Rendering never waits for animation.
    Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([core, plugin]) => {
        if (disposed) return;
        const gsap = core.gsap;
        const ScrollTrigger = plugin.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);
        const media = gsap.matchMedia();
        document.documentElement.dataset.motionReady = "true";
        media.add("(prefers-reduced-motion: no-preference)", () => {
          gsap
            .timeline({ defaults: { ease: "power3.out" } })
            .from(".hero-visual img", {
              clipPath: "inset(12% 10% 12% 10%)",
              scale: 1.08,
              duration: 1.6,
            })
            .from(
              ".hero-line > span",
              { yPercent: 110, rotate: 3, stagger: 0.13, duration: 1.1 },
              0.15,
            )
            .from(
              ".hero-caption",
              { opacity: 0, y: 16, stagger: 0.15, duration: 0.8 },
              0.7,
            )
            .from(".hero-bottom", { y: 16, duration: 0.8 }, 0.7)
            .from(
              ".hero-wordmark",
              { yPercent: 40, opacity: 0, duration: 1.3 },
              0.3,
            );
          gsap.from(".intro-photo", {
            clipPath: "inset(14% 0% 14% 100%)",
            duration: 1.25,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: ".intro-photo",
              start: "top 85%",
              once: true,
            },
          });
          gsap.from(".intro-detail", {
            y: 70,
            rotate: -6,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".intro-detail",
              start: "top 95%",
              once: true,
            },
          });
          gsap.from(".intro-title .word", {
            color: "#758c9d",
            stagger: 0.15,
            scrollTrigger: {
              trigger: ".intro-title",
              start: "top 85%",
              end: "bottom 45%",
              scrub: true,
            },
          });
          gsap.from(".room-showcase", {
            clipPath: "inset(0% 8% 0% 8%)",
            scrollTrigger: {
              trigger: ".room-showcase",
              start: "top 90%",
              end: "top 35%",
              scrub: 0.6,
            },
          });
          gsap.utils
            .toArray<HTMLElement>(".gallery-tile")
            .forEach((tile, index) => {
              gsap.from(tile, {
                clipPath: index % 2 ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)",
                y: index % 2 ? 40 : -40,
                duration: 1.1,
                ease: "power3.inOut",
                scrollTrigger: { trigger: tile, start: "top 94%", once: true },
              });
            });
          gsap.from(".invitation-line > span", {
            yPercent: 105,
            stagger: 0.12,
            duration: 1.1,
            scrollTrigger: {
              trigger: ".invitation",
              start: "top 75%",
              once: true,
            },
          });
          gsap.to(".location-art img", {
            scale: 1.09,
            ease: "none",
            scrollTrigger: {
              trigger: ".location-art",
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          });
        });
        media.add(
          "(min-width: 1000px) and (min-height: 540px) and (prefers-reduced-motion: no-preference)",
          () => {
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".hero",
                  start: "top top",
                  end: "+=70%",
                  pin: true,
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              })
              .to(
                ".hero-visual",
                {
                  clipPath: "inset(0% 0% 0% 0%)",
                  scale: 1.08,
                  xPercent: -6,
                  duration: 1,
                },
                0,
              )
              .to(".hero-copy", { yPercent: -22, opacity: 0, duration: 0.8 }, 0)
              .to(
                ".hero-wordmark",
                {
                  yPercent: -30,
                  letterSpacing: "0.08em",
                  opacity: 0.85,
                  duration: 1,
                },
                0,
              )
              .to(".hero-bottom", { opacity: 0, duration: 0.3 }, 0);
            gsap.to(".intro-photo img", {
              yPercent: -9,
              ease: "none",
              scrollTrigger: {
                trigger: ".intro",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.7,
              },
            });
            gsap.to(".intro-detail", {
              y: -70,
              ease: "none",
              scrollTrigger: {
                trigger: ".intro",
                start: "top bottom",
                end: "bottom top",
                scrub: 0.9,
              },
            });
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: ".story",
                  start: "top top",
                  end: "+=170%",
                  pin: true,
                  scrub: 0.8,
                  invalidateOnRefresh: true,
                },
              })
              .to(".story-image-1", { scale: 1.1, duration: 1.5 }, 0)
              .fromTo(
                ".story-image-2",
                { clipPath: "inset(100% 0 0 0)" },
                { clipPath: "inset(0% 0 0 0)", duration: 0.9 },
                0.5,
              )
              .fromTo(
                ".story-image-3",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: 0.9 },
                1.5,
              )
              .to(
                ".story-track",
                { yPercent: -66.6667, duration: 2.4, ease: "none" },
                0,
              )
              .to(
                ".story-progress span",
                { scaleY: 1, duration: 2.4, ease: "none" },
                0,
              );
          },
        );
        media.add(
          "(max-width: 999px) and (prefers-reduced-motion: no-preference)",
          () => {
            // Natural mobile scrolling: no pinning or horizontal scroll hijacking.
            gsap.to(".hero-visual img", {
              y: 35,
              ease: "none",
              scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
            gsap.utils
              .toArray<HTMLElement>(".story-chapter")
              .forEach((chapter) => {
                gsap.from(chapter.querySelector("h3"), {
                  x: -28,
                  duration: 0.7,
                  ease: "power3.out",
                  scrollTrigger: {
                    trigger: chapter,
                    start: "top 85%",
                    once: true,
                  },
                });
              });
          },
        );
        media.add(
          "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
          () => {
            const removers = gsap.utils
              .toArray<HTMLElement>("[data-magnetic]")
              .map((button) => {
                const x = gsap.quickTo(button, "x", {
                  duration: 0.35,
                  ease: "power3.out",
                });
                const y = gsap.quickTo(button, "y", {
                  duration: 0.35,
                  ease: "power3.out",
                });
                const move = (event: PointerEvent) => {
                  const rect = button.getBoundingClientRect();
                  x((event.clientX - rect.left - rect.width / 2) * 0.12);
                  y((event.clientY - rect.top - rect.height / 2) * 0.16);
                };
                const reset = () => {
                  x(0);
                  y(0);
                };
                button.addEventListener("pointermove", move);
                button.addEventListener("pointerleave", reset);
                button.addEventListener("blur", reset);
                return () => {
                  button.removeEventListener("pointermove", move);
                  button.removeEventListener("pointerleave", reset);
                  button.removeEventListener("blur", reset);
                };
              });
            return () => removers.forEach((remove) => remove());
          },
        );
        let frame = 0;
        const refresh = () => {
          cancelAnimationFrame(frame);
          frame = requestAnimationFrame(() => ScrollTrigger.refresh());
        };
        const observer = new ResizeObserver(refresh);
        const collection = document.querySelector(".stay");
        if (collection) observer.observe(collection);
        window.addEventListener("load", refresh);
        document.fonts.ready.then(() => {
          if (!disposed) refresh();
        });
        cleanup = () => {
          observer.disconnect();
          window.removeEventListener("load", refresh);
          cancelAnimationFrame(frame);
          media.revert();
          delete document.documentElement.dataset.motionReady;
        };
      })
      .catch(() => {
        document.documentElement.dataset.motionReady = "unavailable";
      });
    return () => {
      disposed = true;
      cleanup();
    };
  }, []);
  return null;
}
