# Progrize visual system

## Current authority

Figma frame [HEARD / ReFactory · Desktop · Light](https://www.figma.com/design/7ramekuSzDwYQQNwVlpI3S/Jobhunter?node-id=50-114), implemented in the existing React + Vite project. The light Figma frame supersedes the earlier black-and-orange implementation. HEARD content and existing interactions are retained.

The complete frame screenshot and high-fidelity context for all thirteen sections were retrieved before editing. Reference records live in `.figma/reference/`. The screenshot is a comparison target and is never used as an implementation asset.

## Tokens and type

- Page: #fafbf7
- White panels: #ffffff
- Quiet surfaces: #f0f2ec
- Secondary controls: #e5eadd
- Main text: #172014
- Supporting text: #4d5846
- Metadata: #626d5b
- Dividers: #cfd6c7
- Primary accent: #e1ff76
- Text accent: #4d6500
- Manrope, locally hosted in weights 400, 500, 600 and 700. Roboto Mono remains on the score percentages, matching the source.
- Main heading: 87.4px / 1.08, bold, -7% tracking at the 1440px reference width.
- Section headings: 50px / 1.08, semibold, -5% tracking.
- Small controls: 4px radius. Panels: 8px radius. Journey frame: 80px radius.
- Desktop content gutter: 108px at 1440px, with responsive gutters below that width.

## Source assets

All 47 exported image/SVG references are saved under `public/figma/`. Identical SVGs are reused by byte identity. `src/figma-assets.js` records each asset's local path and intrinsic dimensions; `FigmaAsset` renders them without changing SVG root dimensions.

Included source assets: the hero construction lines and curves, the job-seeker character, Figma employer logo, cropped profile portrait, verification diagram, mission and final CTA diagrams, brand marks and UI icons. Hero line groups preserve their Figma offsets. The character uses the horizontal mirror shown in Figma; the portrait preserves the source crop.

## Motion retained and adapted

`src/motion.js` retains GSAP, ScrollTrigger, the ReFactory easing curve (0.625, 0.05, 0, 1), and Lenis (lerp 0.165, wheelMultiplier 1.25).

- Random character flicker on headline entrance and text hover.
- Fixed navigation entrance, section reveals and animated counts.
- Smooth scrolling and draggable/swipeable employer carousel with keyboard controls.
- The former exploded application assembly is replaced by the Figma character, with gentle scroll-driven vertical and rotational motion and progressive journey labels.
- The source SVG drawings remain external local assets; clip-path reveals animate their wrappers while preserving the exported artwork.
- Reduced-motion mode shows static artwork and naturally flowing content.

## Interactions and responsive behavior

Job filters, role search, empty states, bookmarks, skills/profile tabs, promise and feature accordions, mobile navigation, dialogs and passport download continue to work. The employer carousel's first card is Figma, as in the new frame; job listings preserve their source company names.

At mobile widths, multi-column sections stack, the navigation expands into a menu, artwork scales through its containing composition, and the carousel keeps swipe support. The main design is implemented as semantic React components rather than fixed Figma coordinates.

## Verification

Production build, DOM interactions, motion initialization, local asset existence and intrinsic dimensions are checked. The asset test confirms that every exported asset, or a byte-identical export, is represented in the rendered component tree. The local preview serves the updated page.

The connected browser host remains unavailable. Effective browser geometry and desktop/mobile animation fidelity have not been visually verified; pixel-perfect parity is not claimed.

## Latest sync and brand override

The user renamed the product to **Progrize**. The live UI, accessible names, dialogs, metadata, footer and downloaded passport use that name; a local P monogram replaces the legacy H mark. Original Figma asset names and historical source records remain as provenance.

The refreshed thirteen-section contexts are saved as `latest-*.jsx`. Applied changes: 107.4px medium hero heading; regular section headings; highlighted “yourself” in the journey; 48px action buttons; lime first employer card and job section; four company images with source crops; orange, blue and dark profile badges with updated icons. The existing GSAP/Lenis motion and interaction system is retained.

## Cursor-following character

The job-seeker illustration now uses a CSS head/eye rig layered from the unchanged source PNG. Both pupils track a bounded shared gaze; the head adds a small turn about the neck. Skin shades around the pupils were sampled read-only from the source image to blend the overlays. The original image is shown when motion is reduced or a fine hover pointer is unavailable.

`src/useCharacterGaze.js` batches pointer events through one pending animation frame and uses existing GSAP quickTo setters. Pointer tracking is independent of the outer scroll animation. The controller resets on window blur, pointer exit, hidden document, open dialogs, or offscreen artwork, and removes listeners/tweens when disposed. No React state updates occur on pointer movement.

Behavior checks cover direction, movement bounds, touch handling, reset, reduced motion and cleanup. Browser visual verification remains unavailable.
