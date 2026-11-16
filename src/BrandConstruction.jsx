import React from "react";
import { FigmaAsset } from "./ui";

// Figma 102:224 uses a 496 × 556 construction canvas. Percent coordinates
// keep its geometry intact as the middle column contracts on smaller screens.
export function BrandConstruction() {
  const place = (x, y, w, h) => ({
    left: `${(x / 496) * 100}%`, top: `${(y / 556) * 100}%`,
    width: `${(w / 496) * 100}%`, height: `${(h / 556) * 100}%`,
  });
  const asset = (name, x, y, w, h, key = name, rotate = false) => (
    <span key={key} className={`construction-piece${rotate ? " construction-vertical" : ""}`} style={rotate ? place(x, y, h, w) : place(x, y, w, h)}>
      <FigmaAsset section="102:166" name={name} />
    </span>
  );
  return (
    <figure className="brand-construction" aria-label="Progrize logo construction drawing" data-reveal>
      <div className="construction-boundary" style={place(24, 24, 448, 448)} />
      {asset("imgConstructionCircle", 24, 24, 448, 448)}
      {asset("imgConstructionCircle1", 136, 136, 224, 224)}
      {[136, 248, 360].map((p) => (
        <React.Fragment key={p}>
          {asset("imgConstructionLine1", p, 24, 1, 448, `v${p}`, true)}
          {asset("imgConstructionLine2", 24, p, 448, 1, `h${p}`)}
        </React.Fragment>
      ))}
      {Array.from({ length: 61 }, (_, i) => {
        const p = (i + 1) * 8;
        const major = i % 5 === 0;
        const size = major ? 12 : 7;
        return <React.Fragment key={`tick${i}`}>
          {asset(major ? "imgConstructionLine3" : "imgConstructionLine5", p, 0, 1, size, `t${i}`, true)}
          {asset(major ? "imgConstructionLine3" : "imgConstructionLine5", p, 496 - size, 1, size, `b${i}`, true)}
          {asset(major ? "imgConstructionLine4" : "imgConstructionLine6", 0, p, size, 1, `l${i}`)}
          {asset(major ? "imgConstructionLine4" : "imgConstructionLine6", 496 - size, p, size, 1, `r${i}`)}
        </React.Fragment>;
      })}
      <div className="construction-mark" style={place(107, 137, 282, 222)} aria-hidden="true">
        <i /><i /><i />
      </div>
      {asset("imgConstructionLine7", 107, 359, 282, 1)}
      {[104.5, 170.5, 182.5, 272.5, 284.5, 386.5].map((x) => <i key={x} className="construction-point" style={place(x, 356.5, 5, 5)} />)}
      <figcaption>Progrize / BUILT AROUND YOU</figcaption>
    </figure>
  );
}
