import { useEffect } from "react";
import gsap from "gsap";

/** Bounded, shared gaze for both eyes. The artwork is horizontally mirrored. */
export function getGazeTarget(bounds, pointer, viewport) {
  const centerX = bounds.left + bounds.width * 0.5;
  const centerY = bounds.top + bounds.height * 0.16;
  let x =
    (pointer.x - centerX) / Math.max(bounds.width, viewport.width * 0.45, 1);
  let y =
    (pointer.y - centerY) /
    Math.max(bounds.height * 0.5, viewport.height * 0.45, 1);
  if (!Number.isFinite(x) || !Number.isFinite(y)) x = y = 0;
  const distance = Math.max(1, Math.hypot(x, y));
  x /= distance;
  y /= distance;
  return {
    pupilX: -x * 3,
    pupilY: y * 2.5,
    headX: -x * 2,
    headY: y * 0.65,
    rotation: -x * 1.6,
    rotationY: -x * 4,
    rotationX: -y * 2,
  };
}

/** Attaches a gaze controller without re-rendering React on pointer movement. */
export function attachCharacterGaze(character) {
  const rig = character.querySelector(".character-rig");
  const head = character.querySelector(".character-head");
  const eyes = [...character.querySelectorAll(".character-eye-look")];
  if (!rig || !head || eyes.length !== 2) return () => {};

  const options = { duration: 0.35, ease: "power3.out" };
  const headTo = Object.fromEntries(
    ["x", "y", "rotation", "rotationY", "rotationX"].map((property) => [
      property,
      gsap.quickTo(head, property, options),
    ]),
  );
  const eyeTo = eyes.map((eye) => ({
    x: gsap.quickTo(eye, "x", { duration: 0.2, ease: "power2.out" }),
    y: gsap.quickTo(eye, "y", { duration: 0.2, ease: "power2.out" }),
  }));
  let frame = null;
  let lastPointer = null;
  let active = false;
  let disposed = false;
  const apply = (gaze) => {
    headTo.x(gaze.headX);
    headTo.y(gaze.headY);
    headTo.rotation(gaze.rotation);
    headTo.rotationY(gaze.rotationY);
    headTo.rotationX(gaze.rotationX);
    eyeTo.forEach((eye) => {
      eye.x(gaze.pupilX);
      eye.y(gaze.pupilY);
    });
  };
  const reset = () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    lastPointer = null;
    if (active)
      apply({
        pupilX: 0,
        pupilY: 0,
        headX: 0,
        headY: 0,
        rotation: 0,
        rotationY: 0,
        rotationX: 0,
      });
    active = false;
  };
  const update = () => {
    frame = null;
    if (
      disposed ||
      !lastPointer ||
      document.hidden ||
      document.querySelector("dialog[open]")
    ) {
      reset();
      return;
    }
    const bounds = character.getBoundingClientRect();
    if (
      !bounds.width ||
      !bounds.height ||
      bounds.bottom < 0 ||
      bounds.top > window.innerHeight
    ) {
      reset();
      return;
    }
    active = true;
    apply(
      getGazeTarget(bounds, lastPointer, {
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    );
  };
  const move = (event) => {
    if (event.pointerType === "touch" || event.isPrimary === false) return;
    lastPointer = { x: event.clientX, y: event.clientY };
    if (frame === null) frame = requestAnimationFrame(update);
  };
  const leave = (event) => {
    if (event.relatedTarget == null) reset();
  };
  const visibility = () => {
    if (document.hidden) reset();
  };
  const onScroll = () => {
    if (!active) return;
    const bounds = character.getBoundingClientRect();
    if (bounds.bottom < 0 || bounds.top > window.innerHeight) reset();
  };

  rig.classList.add("gaze-enabled");
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerout", leave, { passive: true });
  window.addEventListener("blur", reset);
  document.addEventListener("visibilitychange", visibility);
  window.addEventListener("scroll", onScroll, { passive: true });

  return () => {
    disposed = true;
    if (frame !== null) cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerout", leave);
    window.removeEventListener("blur", reset);
    document.removeEventListener("visibilitychange", visibility);
    window.removeEventListener("scroll", onScroll);
    Object.values(headTo).forEach((to) => to.tween.kill());
    eyeTo.forEach((eye) => {
      eye.x.tween.kill();
      eye.y.tween.kill();
    });
    gsap.set([head, ...eyes], { clearProps: "transform" });
    rig.classList.remove("gaze-enabled");
  };
}

export function useCharacterGaze(characterRef) {
  useEffect(() => {
    const media = gsap.matchMedia();
    media.add(
      "(prefers-reduced-motion: no-preference) and (hover: hover) and (pointer: fine)",
      () => {
        if (characterRef.current)
          return attachCharacterGaze(characterRef.current);
      },
    );
    return () => media.revert();
  }, [characterRef]);
}
