import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { FigmaAsset } from "./ui";

export function HeroArtwork() {
  const ref = useRef(null);
  useEffect(() => {
    const artwork = ref.current;
    const hero = artwork.closest(".hero");
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)", () => {
      artwork.classList.add("jobee-awake");
      const pupils = [...artwork.querySelectorAll(".jobee-pupil")];
      const eyeballs = [...artwork.querySelectorAll(".jobee-eyeball")];
      const gaze = pupils.map((pupil) => ({
        x: gsap.quickTo(pupil, "xPercent", { duration: .24, ease: "power2.out" }),
        y: gsap.quickTo(pupil, "yPercent", { duration: .24, ease: "power2.out" }),
      }));
      let visible = true;
      let blinkTimer;
      let blinkAnimation;
      const blink = () => {
        if (!visible || document.hidden || document.querySelector('dialog[open]')) return;
        blinkAnimation?.kill();
        blinkAnimation = gsap.timeline().to(eyeballs, { scaleY: .04, duration: .09, stagger: .015, ease: "power2.in" }).to(eyeballs, { scaleY: 1, duration: .15, stagger: .015, ease: "power2.out" });
      };
      const scheduleBlink = () => {
        blinkTimer = gsap.delayedCall(3.5 + Math.random() * 3, () => { blink(); scheduleBlink(); });
      };
      scheduleBlink();
      const x = gsap.quickTo(artwork, "x", { duration: 0.8, ease: "power3.out" });
      const y = gsap.quickTo(artwork, "y", { duration: 0.8, ease: "power3.out" });
      const turn = gsap.quickTo(artwork, "rotation", { duration: 0.9, ease: "power3.out" });
      const reset = () => { x(0); y(0); turn(0); gaze.forEach((eye) => { eye.x(0); eye.y(0); }); };
      const move = (event) => {
        if (!visible || document.hidden || event.pointerType === "touch" || document.querySelector('[role="dialog"]')) return reset();
        const bounds = hero.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - 0.5) * 2));
        const dy = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - 0.5) * 2));
        x(dx * 14); y(dy * 10); turn(dx * 0.5);
        const face = artwork.querySelector(".jobee-eye-2").getBoundingClientRect();
        const angle = Math.atan2(event.clientY - face.top - face.height / 2, event.clientX - face.left - face.width / 2) + Math.PI / 12;
        const distance = Math.min(1, Math.hypot(event.clientX - face.left, event.clientY - face.top) / 220);
        gaze.forEach((eye) => { eye.x(Math.cos(angle) * 20 * distance); eye.y(Math.sin(angle) * 16 * distance); });
      };
      const visibility = () => { if (document.hidden) reset(); };
      const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) reset(); }) : null;
      observer?.observe(artwork);
      window.addEventListener("pointermove", move);
      hero.addEventListener("pointerleave", reset);
      hero.addEventListener("pointerdown", blink);
      window.addEventListener("blur", reset);
      document.addEventListener("visibilitychange", visibility);
      return () => {
        window.removeEventListener("pointermove", move);
        hero.removeEventListener("pointerleave", reset);
        hero.removeEventListener("pointerdown", blink);
        window.removeEventListener("blur", reset);
        document.removeEventListener("visibilitychange", visibility);
        observer?.disconnect();
        blinkTimer?.kill();
        blinkAnimation?.kill();
        pupils.forEach((pupil) => gsap.killTweensOf(pupil));
        gsap.set([...pupils, ...eyeballs], { clearProps: "transform" });
        artwork.classList.remove("jobee-awake");
        gsap.killTweensOf(artwork);
        gsap.set(artwork, { clearProps: "transform" });
      };
    });
    return () => media.revert();
  }, []);
  return (
    <div className="hero-artwork" aria-hidden="true">
      <div className="hero-artwork-motion" ref={ref}>
        <div className="jobee-sprite">
          <FigmaAsset section="53:4768" name="imgImage8" fetchPriority="high" />
          {[1, 2, 3].map((eye) => (
            <span key={eye} className={`jobee-eye jobee-eye-${eye}`}>
              <span className="jobee-eyeball"><span className="jobee-pupil" /></span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
