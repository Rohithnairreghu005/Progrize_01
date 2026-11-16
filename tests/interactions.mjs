import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, mkdir } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { JSDOM } from "jsdom";
import { build } from "esbuild";

const dom = new JSDOM(
  '<!doctype html><html><body><div id="root"></div></body></html>',
  { url: "http://localhost", pretendToBeVisual: true },
);
for (const key of [
  "window",
  "document",
  "Window",
  "Document",
  "HTMLElement",
  "Element",
  "Node",
  "Event",
  "MouseEvent",
  "HTMLInputElement",
  "HTMLAnchorElement",
  "HTMLDialogElement",
  "MutationObserver",
  "getComputedStyle",
]) {
  Object.defineProperty(globalThis, key, {
    value:
      key === "getComputedStyle"
        ? dom.window.getComputedStyle.bind(dom.window)
        : dom.window[key],
    configurable: true,
  });
}
Object.defineProperty(globalThis, "navigator", {
  value: dom.window.navigator,
  configurable: true,
});
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
globalThis.requestAnimationFrame = dom.window.requestAnimationFrame.bind(
  dom.window,
);
globalThis.cancelAnimationFrame = dom.window.cancelAnimationFrame.bind(
  dom.window,
);
const motion = process.env.TEST_MOTION === "1";
const runtimeErrors = [];
window.addEventListener("error", (event) => runtimeErrors.push(event.error));
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver = window.ResizeObserver = ResizeObserverStub;
window.matchMedia = (query) => ({
  matches: query.includes("no-preference")
    ? motion
    : query.includes("reduce")
      ? !motion
      : false,
  media: query,
  addListener() {},
  removeListener() {},
  addEventListener() {},
  removeEventListener() {},
});
window.scrollTo = () => {};
HTMLElement.prototype.scrollTo = function (options) {
  this.scrollLeft = options.left || 0;
};
HTMLDialogElement.prototype.showModal = function () {
  this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
  this.removeAttribute("open");
};
const output = path.resolve("node_modules/.cache/progrize-test/app.mjs");
await mkdir(path.dirname(output), { recursive: true });
await build({
  entryPoints: ["src/main.jsx"],
  outfile: output,
  bundle: true,
  format: "esm",
  platform: "node",
  banner: {
    js: "import {createRequire} from 'node:module'; const require=createRequire(import.meta.url);",
  },
  external: ["react", "react-dom", "react-dom/client"],
  loader: { ".css": "empty" },
  plugins: [
    {
      name: "svg-raw",
      setup(b) {
        b.onResolve({ filter: /\.svg\?raw$/ }, (args) => ({
          path: path.resolve(args.resolveDir, args.path.replace("?raw", "")),
          namespace: "raw-svg",
        }));
        b.onLoad({ filter: /.*/, namespace: "raw-svg" }, async (args) => ({
          contents:
            "export default " +
            JSON.stringify(await readFile(args.path, "utf8")),
          loader: "js",
        }));
      },
    },
  ],
  logLevel: "silent",
});
const { act } = await import("react");
await act(async () => {
  await import(pathToFileURL(output).href);
});
// Exercise the pointer controller against a separate visible fixture.
const gazeOutput = path.resolve("node_modules/.cache/progrize-test/gaze.mjs");
await build({
  entryPoints: ["src/useCharacterGaze.js"],
  outfile: gazeOutput,
  bundle: true,
  format: "esm",
  platform: "node",
  external: ["react"],
  logLevel: "silent",
});
const { getGazeTarget, attachCharacterGaze } = await import(
  pathToFileURL(gazeOutput).href
);
const bounds = {
  left: 100,
  top: 60,
  width: 422,
  height: 629,
  bottom: 689,
  right: 522,
};
const viewport = { width: 1200, height: 800 };
const right = getGazeTarget(bounds, { x: 1200, y: 160 }, viewport);
const left = getGazeTarget(bounds, { x: 0, y: 160 }, viewport);
assert.ok(
  right.pupilX < 0 && left.pupilX > 0,
  "Mirrored artwork looks toward the pointer",
);
const extreme = getGazeTarget(bounds, { x: 1e9, y: 1e9 }, viewport);
assert.ok(
  Math.abs(extreme.pupilX) <= 3 && Math.abs(extreme.pupilY) <= 2.5,
  "Eyes remain inside their sockets",
);
assert.ok(
  Math.abs(extreme.rotation) <= 1.6 && Math.abs(extreme.rotationY) <= 4,
  "Head turn is bounded",
);
assert.ok(
  Object.values(getGazeTarget(bounds, { x: NaN, y: 0 }, viewport)).every(
    Number.isFinite,
  ),
);
const fixture = document.createElement("div");
fixture.innerHTML =
  '<div class="character-rig"><div class="character-head"><span class="character-eye-look"></span><span class="character-eye-look"></span></div></div>';
fixture.getBoundingClientRect = () => bounds;
document.body.appendChild(fixture);
const detach = attachCharacterGaze(fixture);
const fixtureHead = fixture.querySelector(".character-head");
window.dispatchEvent(
  new MouseEvent("pointermove", { clientX: 1100, clientY: 180 }),
);
await new Promise((resolve) => setTimeout(resolve, 450));
assert.match(
  fixtureHead.style.transform,
  /translate/,
  "Pointer movement animates the head",
);
assert.ok(
  fixture.querySelector(".character-eye-look").style.transform,
  "Pointer movement animates the eyes",
);
const previous = fixtureHead.style.transform;
const touch = new MouseEvent("pointermove", { clientX: 0, clientY: 0 });
Object.defineProperty(touch, "pointerType", { value: "touch" });
window.dispatchEvent(touch);
await new Promise((resolve) => setTimeout(resolve, 50));
assert.equal(
  fixtureHead.style.transform,
  previous,
  "Touch input does not trigger gaze",
);
window.dispatchEvent(new Event("blur"));
await new Promise((resolve) => setTimeout(resolve, 450));
assert.ok(
  !fixtureHead.style.transform.includes("rotateY("),
  "Blur returns the head to neutral",
);
detach();
assert.equal(
  fixtureHead.style.transform,
  "",
  "Cleanup removes transient transforms",
);
assert.equal(
  fixture.querySelector(".character-rig").classList.contains("gaze-enabled"),
  false,
);
window.dispatchEvent(
  new MouseEvent("pointermove", { clientX: 1100, clientY: 180 }),
);
await new Promise((resolve) => setTimeout(resolve, 30));
assert.equal(
  fixtureHead.style.transform,
  "",
  "Cleanup removes pointer listeners",
);
fixture.remove();
assert.equal(
  document
    .querySelector(".journey-character .character-rig")
    .classList.contains("gaze-enabled"),
  motion,
  "Reduced motion keeps the original static illustration",
);
console.log(
  "PASS: gaze direction, movement limits, touch fallback, neutral reset, reduced motion and cleanup",
);
const $ = (selector) => document.querySelector(selector);
const all = (selector) => [...document.querySelectorAll(selector)];
const click = async (el) => {
  assert.ok(el, "Expected control exists");
  await act(async () =>
    el.dispatchEvent(new MouseEvent("click", { bubbles: true })),
  );
};
const textButton = (within, label) =>
  all(`${within} button`).find((el) =>
    el.textContent.replaceAll("\u00a0", " ").includes(label),
  );
assert.equal(all("h1").length, 1);
assert.equal($(".brand").getAttribute("aria-label"), "Progrize home");
assert.match($(".brand").textContent, /Progrize/);
assert.equal($(".progrize-mark").getAttribute("src"), "/progrize-mark.svg");
assert.ok(
  !/\bheard\b/i.test(document.body.textContent),
  "No legacy brand in page copy",
);
assert.match(await readFile("index.html", "utf8"), /<title>Progrize/);
assert.equal(all(".company-image img").length, 4);
assert.equal(all(".job-row").length, 4);
assert.ok($(".hero-title").textContent.includes("Every application"));
assert.ok($(".grid-drawing img"));
const assets = JSON.parse(
  await readFile("tests/figma-assets.json", "utf8"),
);
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const renderedHashes = new Set();
for (const image of all("img[data-figma-asset]")) {
  const bytes = await readFile(path.join("public", image.getAttribute("src")));
  assert.ok(bytes.length > 0, "Rendered asset is present and nonempty");
  assert.ok(
    Number(image.getAttribute("width")) > 0 &&
      Number(image.getAttribute("height")) > 0,
    "Asset has intrinsic dimensions",
  );
  renderedHashes.add(hash(bytes));
}
for (const asset of assets) {
  if (asset.name === "imgHeardMark") continue; // Replaced by the explicitly requested Progrize identity.
  const bytes = await readFile(path.join("public/figma", asset.file));
  assert.ok(
    renderedHashes.has(hash(bytes)),
    `Figma asset or byte-identical source is represented: ${asset.section}/${asset.name}`,
  );
}
assert.ok($(".journey-character img").getAttribute("alt"));
assert.ok($(".profile-portrait img").getAttribute("alt"));
assert.match($(".employer-card.active h3").textContent, /Figma/);
console.log(
  "PASS: all Figma image/SVG sources are local, nonempty, intrinsically sized, and represented in their UI slots",
);
console.log("PASS: page renders with reference SVG drawings and all roles");

await click(textButton(".job-toolbar", "Engineering"));
assert.equal(all(".job-row").length, 1);
assert.match($(".job-row").textContent, /Frontend Engineer/);
await click(textButton(".job-toolbar", "All roles"));
await act(async () => {
  const input = $(".search input");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(
    input,
    "Koto",
  );
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
assert.equal(all(".job-row").length, 1);
assert.match($(".job-row").textContent, /Brand Designer/);
await click($(".bookmark"));
assert.equal(
  $(".bookmark").getAttribute("aria-label"),
  "Unsave Brand Designer",
);
assert.match($(".workspace-footer").textContent, /1 SAVED/);
await act(async () => {
  const input = $(".search input");
  Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(
    input,
    "no-such-company",
  );
  input.dispatchEvent(new Event("input", { bubbles: true }));
});
assert.ok($(".empty-state"));
console.log("PASS: job category, search, empty state and bookmarks");

await click(textButton(".skill-options", "Development"));
assert.match($(".profile-card-top").textContent, /Frontend developer/);
assert.match($(".profile-tags").textContent, /TypeScript/);
await click(textButton(".profile-card .tabs", "Proven skills"));
assert.equal(all(".profile-line").length, 3);
await click(textButton(".profile-card .tabs", "Experience"));
assert.match($(".profile-content").textContent, /Senior Developer/);
console.log("PASS: skills and profile tabs");

await click(all(".promise-rule > button")[1]);
assert.equal(
  all(".promise-rule > button")[1].getAttribute("aria-expanded"),
  "true",
);
assert.equal($("#promise-1").hidden, false);
assert.equal($("#promise-0").hidden, true);
await click(textButton(".feature-section .tabs", "Employers"));
assert.equal(all(".feature-item").length, 2);
await click($(".feature-item > button"));
assert.ok($(".feature-expanded"));
console.log("PASS: promise accordions and feature filters");

await click($('.carousel-controls button[aria-label="Next employer"]'));
assert.equal(
  $('.carousel-controls button[aria-pressed="true"]').getAttribute(
    "aria-label",
  ),
  "View Brightside Health",
);
await click($('.carousel-controls button[aria-label="Previous employer"]'));
assert.equal(
  $('.carousel-controls button[aria-pressed="true"]').getAttribute(
    "aria-label",
  ),
  "View Figma",
);
await click($(".nav-dropdown > button"));
assert.equal($(".nav-dropdown > button").getAttribute("aria-expanded"), "true");
await click($(".mobile-menu"));
assert.equal($(".mobile-menu").getAttribute("aria-expanded"), "true");
await click($(".mobile-menu"));
console.log("PASS: carousel controls, dropdown and mobile navigation");

await click($(".nav-actions .button"));
assert.ok($(".modal[open]"));
assert.equal($(".modal").getAttribute("aria-label"), "Join Progrize");
await act(async () =>
  $(".modal form").dispatchEvent(
    new Event("submit", { bubbles: true, cancelable: true }),
  ),
);
assert.ok($(".success"));
await click($(".modal-close"));
assert.equal($(".modal"), null);
assert.equal(document.body.style.overflow, "");
await click($(".nav-login"));
assert.equal(all(".modal input").length, 1);
await act(async () => {
  const e = new Event("cancel", { bubbles: false, cancelable: true });
  $(".modal").dispatchEvent(e);
});
assert.equal($(".modal"), null);
console.log("PASS: signup, login, preview confirmation and dialog cleanup");

for (const link of all('a[href^="#"]')) {
  const id = link.getAttribute("href").slice(1);
  assert.ok(document.getElementById(id), `Anchor target exists: ${id}`);
}
console.log("PASS: all section navigation links resolve");
assert.deepEqual(runtimeErrors, [], "No unhandled runtime errors");
console.log(
  "All interaction checks passed. Layout and animation fidelity require visual browser review.",
);
process.exit(0);
