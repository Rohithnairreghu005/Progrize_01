import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import Lenis from "lenis";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("refactory", "0.625, 0.05, 0, 1");
export function useMotion(root, setStage) {
  useEffect(() => {
    const mm = gsap.matchMedia();
    let lenis;
    let tick;
    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        lenis = new Lenis({
          lerp: 0.165,
          wheelMultiplier: 1.25,
          anchors: true,
        });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(tick);
        const chars = gsap.utils.toArray(".hero-title .flicker-char");
        const entrance = gsap.timeline();
        entrance.from(
          ".site-header",
          { y: -100, opacity: 0, duration: 0.8, ease: "refactory" },
          0,
        );
        entrance.fromTo(
          gsap.utils.shuffle([...chars]),
          { opacity: 0 },
          { opacity: 1, duration: 0.08, repeat: 2, yoyo: true, stagger: 0.018 },
          0.2,
        );
        entrance.from(
          ".hero-banner, .hero-description, .hero-actions, .scroll-prompt",
          { opacity: 0, duration: 0.8, stagger: 0.12 },
          0.5,
        );
        gsap.utils.toArray("[data-line-draw]").forEach((el, i) => {
          const timeline = gsap.timeline(
            i
              ? { scrollTrigger: { trigger: el, start: "top 85%", once: true } }
              : { delay: 0.25 },
          );
          if (!el.querySelector("path")) {
            timeline.from(
              el.querySelectorAll(".figma-asset"),
              {
                clipPath: "inset(0% 100% 0% 0%)",
                opacity: 0.15,
                duration: 2,
                ease: "refactory",
                stagger: 0.15,
                clearProps: "clipPath,opacity",
              },
              0,
            );
          }
          el.querySelectorAll("path,line,circle,rect,polyline,ellipse").forEach(
            (path, index) => {
              if (
                !path.getAttribute("stroke") ||
                path.hasAttribute("stroke-dasharray")
              )
                return;
              try {
                const length = path.getTotalLength();
                timeline.fromTo(
                  path,
                  { strokeDasharray: length, strokeDashoffset: length },
                  {
                    strokeDashoffset: 0,
                    duration: 2,
                    ease: "refactory",
                    clearProps: "strokeDasharray,strokeDashoffset",
                  },
                  Math.min(index * 0.03, 1.2),
                );
              } catch {}
            },
          );
        });
        gsap.utils.toArray("[data-heading-reveal]").forEach((el) => {
          gsap.from(el, {
            opacity: 0.12,
            duration: 1,
            ease: "refactory",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          });
        });
        gsap.utils.toArray("[data-reveal]").forEach((el) => {
          gsap.from(el, {
            y: 25,
            opacity: 0,
            duration: 0.9,
            ease: "refactory",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
        const process = root.current?.querySelector(".process-track");
        if (process) {
          gsap.fromTo(
            ".journey-character",
            { y: 18, rotation: -1.2 },
            {
              y: -12,
              rotation: 1.2,
              ease: "none",
              scrollTrigger: {
                trigger: process,
                start: "top 80%",
                end: "bottom 20%",
                scrub: 0.7,
                onUpdate: (self) =>
                  setStage(Math.min(3, Math.floor(self.progress * 4))),
              },
            },
          );
        }
        gsap.utils.toArray("[data-count]").forEach((el) => {
          const state = { value: 0 },
            end = Number(el.dataset.count);
          gsap.to(state, {
            value: end,
            duration: 1.5,
            ease: "refactory",
            onUpdate: () => {
              el.textContent = String(Math.round(state.value));
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
        if (root.current?.querySelector(".grid-beam"))
          gsap.to(".grid-beam", {
            strokeDashoffset: -140,
            duration: 3,
            ease: "none",
            repeat: -1,
          });
        return () => {
          lenis?.destroy();
          if (tick) gsap.ticker.remove(tick);
        };
      });
    }, root);
    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);
}
