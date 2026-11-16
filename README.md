# Progrize — React website

React + Vite implementation of [Figma frame 50:114](https://www.figma.com/design/7ramekuSzDwYQQNwVlpI3S/Jobhunter?node-id=50-114): Manrope typography, pale green surfaces, lime accents and the exact exported illustrations and SVG assets. The existing GSAP/Lenis animation and interactive features are retained.

## Start

```sh
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

## Verify and build

```sh
npm test
npm run test:motion
npm run build
npm run preview
```

`dist/` is the deployable static site. DOM tests exercise real component state and interaction wiring. The motion test also initializes Lenis and GSAP using DOM-environment mocks; it does not measure rendered animation fidelity.

## Features

- ReFactory-inspired fixed navigation, expanding submenu and mobile menu
- Centered hero with the reference's technical background drawing
- Character flicker, SVG drawing, smooth scrolling and scroll-triggered reveals
- Four-stage scroll-scrubbed application assembly with status indicators
- Draggable employer carousel with swipe, keyboard, arrow and dot controls
- Match score, proven skills, public employer grades and reply promises
- Job search, category filters, empty state and session-only bookmarks
- Profile panels, feature filters and expandable details
- Downloadable SVG passport card
- Native signup/application dialogs and validated demonstration forms
- Accessible names, keyboard focus and reduced-motion alternatives

## Structure

- `src/main.jsx`: page sections and product interactions
- `src/ui.jsx`: shared controls, branding and SVG wrappers
- `src/motion.js`: GSAP and Lenis motion lifecycle
- `src/useCharacterGaze.js`: cursor-following head/eyes, pointer lifecycle and reduced-motion fallback
- `src/content.js`: employer data, promises and feature content
- `src/styles.css`: shared layout and interaction foundations
- `src/light-design.css`: Figma light-theme typography, composition and responsive styles
- `src/figma-assets.js`: local Figma asset paths and intrinsic dimensions
- `public/figma/`: exact downloaded Figma illustrations, portrait, logos, icons and diagrams
- `public/fonts/`: locally hosted reference typefaces
- `tests/interactions.mjs`: DOM interaction and motion-initialization checks
- `DESIGN.md`: reference analysis, implementation decisions and limitations

## Reference and scope

Design: Figma frame `50:114` in Jobhunter. The original section contexts and comparison screenshots remain local in `.figma/reference/`, which is excluded from Git. Assets are permanent local files under `public/figma/` and have no temporary Figma URLs at runtime.

The motion language comes from the earlier ReFactory-inspired implementation. The Figma character replaces the old application assembly; it responds gently to scroll. The character also follows the mouse with bounded eye movement and a gentle head turn. Text flicker, smooth scrolling, drawing reveals, counters and the interactive carousel remain.

Forms, roles and employer statistics are demonstrations. There is no authentication, account creation, email delivery, application submission or persistent storage.

The production build, interaction tests, motion initialization and asset coverage are verified. The connected browser host remains unavailable, so desktop/mobile layout and animation fidelity still need visual browser review.

The asset-verification fixture is tracked at `tests/figma-assets.json`; it includes local filenames and source node identifiers without temporary download URLs.
