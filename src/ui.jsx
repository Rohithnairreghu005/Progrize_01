import React, { useRef } from "react";
import gsap from "gsap";
import { ArrowUpRight, ArrowDown, Plus, Minus } from "lucide-react";
import { figmaAssets } from "./figma-assets";

export function FigmaAsset({
  section,
  name,
  alt = "",
  className = "",
  ...props
}) {
  const asset = figmaAssets[section]?.[name];
  if (!asset) throw new Error(`Missing Figma asset: ${section}/${name}`);
  return (
    <img
      {...props}
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={alt}
      className={`figma-asset ${className}`}
      data-figma-asset={`${section}/${name}`}
      draggable={false}
    />
  );
}

export function FlickerText({ children, className = "" }) {
  const ref = useRef(null);
  return (
    <span
      className={`flicker-text ${className}`}
      ref={ref}
      onMouseEnter={() => {
        if (
          window.matchMedia(
            "(prefers-reduced-motion: reduce), (pointer: coarse)",
          ).matches
        )
          return;
        gsap.killTweensOf(ref.current.children);
        gsap.fromTo(
          ref.current.children,
          { opacity: 1 },
          {
            opacity: 0.08,
            repeat: 1,
            yoyo: true,
            duration: 0.08,
            stagger: { each: 0.022, from: "random" },
            onComplete: () =>
              gsap.set(ref.current?.children || [], { clearProps: "opacity" }),
          },
        );
      }}
    >
      {typeof children === "string" ? (
        <>
          <span className="sr-only">{children}</span>
          {[...children].map((c, i) => (
            <span className="flicker-char" aria-hidden="true" key={i}>
              {c === " " ? "\u00a0" : c}
            </span>
          ))}
        </>
      ) : (
        children
      )}
    </span>
  );
}
export function Button({
  children,
  onClick,
  href,
  secondary = false,
  className = "",
  header = false,
  ...props
}) {
  const C = href ? "a" : "button";
  return (
    <C
      {...props}
      href={href}
      onClick={onClick}
      className={`button ${secondary ? "button-secondary" : ""} ${className}`}
    >
      <FlickerText>{children}</FlickerText>
      <FigmaAsset
        section="50:115"
        name={header ? "imgArrowUpRight" : "imgArrowUpRight3"}
      />
    </C>
  );
}
export function GridDrawing({ type = "hero", className = "" }) {
  return (
    <div
      className={`grid-drawing grid-${type} ${className}`}
      aria-hidden="true"
      data-line-draw
    >
      <div className="grid-canvas">
        {type === "hero" ? (
          <>
            <FigmaAsset
              section="50:115"
              name="imgGroup"
              className="hero-grid-lines"
            />
            <FigmaAsset
              section="50:115"
              name="imgGroup1"
              className="hero-grid-curves"
            />
          </>
        ) : (
          <FigmaAsset
            section={type === "mission" ? "50:506" : "50:999"}
            name="imgReferenceDiagram"
          />
        )}
      </div>
    </div>
  );
}

export function Tabs({ items, value, onChange, label }) {
  return (
    <div className="tabs" role="group" aria-label={label}>
      {items.map((x) => (
        <button
          key={x}
          aria-pressed={value === x}
          onClick={() => onChange(x)}
          className={value === x ? "active" : ""}
        >
          <FlickerText>{x}</FlickerText>
          <FigmaAsset section="50:115" name="imgArrowUpRight3" />
        </button>
      ))}
    </div>
  );
}
export function SectionHeading({ title, children, center = false }) {
  return (
    <div className={`section-heading ${center ? "center" : ""}`}>
      <h2 data-heading-reveal>{title}</h2>
      {children}
    </div>
  );
}
export function Brand({ large = false, ink = false }) {
  return (
    <a
      className={`brand ${large ? "brand-large" : ""} ${ink ? "brand-ink" : ""}`}
      href="#home"
      aria-label="Progrize home"
    >
      <span className="progrize-mark" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="progrize-wordmark">Progrize</span>
    </a>
  );
}
export function Crosshair({ className = "" }) {
  return (
    <svg
      className={`crosshair ${className}`}
      viewBox="0 0 20 20"
      aria-hidden="true"
    >
      <path
        d="M10 1v18M1 10h18"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <circle cx="10" cy="10" r="5" stroke="currentColor" fill="none" />
    </svg>
  );
}
export function PlusMinus({ open, section = "50:766" }) {
  return open ? (
    <Minus size={17} />
  ) : (
    <FigmaAsset section={section} name="imgPlus" />
  );
}
export function ScrollPrompt() {
  return (
    <a className="scroll-prompt" href="#journey">
      <span>Scroll to begin</span>
      <FigmaAsset section="50:115" name="imgArrowDown" />
    </a>
  );
}
