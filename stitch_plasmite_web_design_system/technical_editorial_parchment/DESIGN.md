---
name: Technical Editorial & Parchment
colors:
  surface: '#fbf9f6'
  surface-dim: '#dbdad7'
  surface-bright: '#fbf9f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f0'
  surface-container: '#efeeeb'
  surface-container-high: '#eae8e5'
  surface-container-highest: '#e4e2df'
  on-surface: '#1b1c1a'
  on-surface-variant: '#4c463f'
  inverse-surface: '#30312f'
  inverse-on-surface: '#f2f0ed'
  outline: '#7d766e'
  outline-variant: '#cec5bc'
  surface-tint: '#645d54'
  primary: '#28231b'
  on-primary: '#ffffff'
  primary-container: '#3e3830'
  on-primary-container: '#aaa197'
  inverse-primary: '#cfc5ba'
  secondary: '#615e58'
  on-secondary: '#ffffff'
  secondary-container: '#e7e2da'
  on-secondary-container: '#67645e'
  tertiary: '#25231e'
  on-tertiary: '#ffffff'
  tertiary-container: '#3b3933'
  on-tertiary-container: '#a7a29b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ece1d5'
  primary-fixed-dim: '#cfc5ba'
  on-primary-fixed: '#201b14'
  on-primary-fixed-variant: '#4c463d'
  secondary-fixed: '#e7e2da'
  secondary-fixed-dim: '#cac6bf'
  on-secondary-fixed: '#1d1b17'
  on-secondary-fixed-variant: '#494741'
  tertiary-fixed: '#e7e2d9'
  tertiary-fixed-dim: '#cbc6be'
  on-tertiary-fixed: '#1d1b16'
  on-tertiary-fixed-variant: '#494640'
  background: '#fbf9f6'
  on-background: '#1b1c1a'
  surface-variant: '#e4e2df'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 44px
    fontWeight: '600'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-xl-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: -0.005em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: 0em
  body-xl:
    fontFamily: Literata
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 32px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Literata
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: 0em
  body-md:
    fontFamily: Literata
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.005em
  body-sm:
    fontFamily: Literata
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 2rem
  margin-sm: 1rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system combines the deliberate discipline of traditional literary publishing with the mechanical precision of modern engineering systems. Inspired by archival lab notebooks, high-grade book typography, and distraction-free writing environments, the interface presents as a tactile, human-crafted artifact.

### Core Philosophy
- **Inverted Typographic Architecture:** Headings and structural signposts are rendered with technical, geometric exactness (`Space Grotesk`), while the primary body and reading prose prioritize warm, literary comfort (`Literata`). This inversion subverts the conventional "serif-for-titles, sans-for-body" paradigm, treating UI headings as structural schematics and content as archival text.
- **Warm Parchment Atmosphere:** The surface language eliminates sterile digital cool-grays and blinding whites, grounding the experience in natural paper tones (`#FAF8F5`) and deep mineral carbon inks (`#1A1917`).
- **Quiet Engineering Precision:** Accents and interactive states rely strictly on monochromatic ink values and deliberate line hierarchy rather than loud, synthetic primary hues.
- **Physical Metaphor:** Surfaces behave like sheets of heavy-stock paper resting within a folio—defined by razor-thin borders and microscopic, soft light occlusions.

## Colors

The palette is rooted in mineral pigments, warm papers, and ink density gradations. Digital brightness is softened to create a restful, daylight-balanced reading experience.

### Palette Architecture
- **Primary Ink (`#3E3830`):** Raw umber-infused charcoal. Used for primary interactive actions, high-density focus states, and heavy typographic marks.
- **Canvas / Parchment (`#FAF8F5`):** Warm unbleached paper foundation. Serves as the global backdrop across all canvas levels.
- **Surface Foil (`#FFFFFF`):** Pure white card planes resting on top of parchment, creating optical lift without relying on heavy contrast.
- **Deep Ink Black (`#1A1917`):** Primary text and headline rendering, balancing extreme legibility with organic softness.
- **Muted Stone (`#797670`):** Secondary metadata, inactive states, subtle labels, and inline technical annotations.
- **Hairline Border (`#EAE6DF`):** Tactile boundary lines mimicking bookbinding scores. Never exceeds 1px.
- **Interactive State Ink (`#2C2A26`):** Hover and pressed states for solid ink controls.

## Typography

Typography establishes the tension between archival documentation and high-precision instrument readouts.

### Hierarchy & Usage
- **Space Grotesk (Display, Headings, UI Badges):** Engineered, modular, and structurally frank. Used for titles, section headers, navigation bars, buttons, and numeric badges. It delivers the sensation of a drafted blueprint or machine-printed header.
- **Literata (Body, Long-form, Captions):** Designed specifically for extended screen reading. Features warm diagonal stresses, gentle terminals, and generous x-height. It turns reading prose into a tactile, literary exercise.
- **Letter Spacing:** Headlines utilize tighter kerning (`-0.03em` to `-0.01em`) to maintain ink density, whereas uppercase labels and technical metadata receive expanded tracking (`0.02em` to `0.04em`) to ensure instant glanceability.

## Layout & Spacing

Layouts follow strict structural columns paired with comfortable margins reminiscent of physical book layout margins.

### Spatial Principles
- **Grid Architecture:** An adaptable 12-column grid system for technical dashboards, collapsing to 6-column on tablets and 4-column on mobile.
- **Reading Margins:** For pure editorial and technical prose columns, restrict content width strictly to `68ch` to preserve comfortable line lengths for `Literata`.
- **Vertical Rhythm:** Rooted in a continuous 4px/8px modular cadence. Headings sit closer to their associated body paragraphs (`space-sm`) than the preceding section blocks (`space-xl`), creating explicit structural ownership.

## Elevation & Depth

Visual hierarchy abandons deep, aggressive drop shadows in favor of quiet plane separation and delicate line definitions.

### Stratification Rules
- **Flat Ground (Parchment - `#FAF8F5`):** The primary environment plane. Never elevated.
- **First Horizon (Cards & Panels - `#FFFFFF`):** Elevated purely through crisp 1px hairline borders (`#EAE6DF`) complemented by an ambient, diffused shadow: `0 2px 12px rgba(26, 25, 23, 0.03)`.
- **Floating Horizon (Dropdowns, Popovers, Flyouts):** Sits above content using `0 8px 24px rgba(26, 25, 23, 0.06)` combined with a 1px border (`#EAE6DF`).
- **Focus & Interaction:** Focus is indicated with crisp 1px double-offset outline rings or solid ink contrast fills, never blurred glow halos.

## Shapes

Shapes reflect precision-cut sheet edges. In keeping with roundedness level `1` (Soft), corners maintain a delicate, low-radius curvature that avoids generic bubble forms while softening cold raw geometry.

### Radius Scale
- **Micro UI & Interactive Controls (Buttons, Inputs, Badges):** `0.25rem` (4px). Provides tailored, stamp-like precision.
- **Structured Surfaces (Cards, Callouts, Code Blocks):** `0.5rem` (8px / `rounded-lg`). Ensures readable content containment without truncating corner space.
- **Macro Containers (Drawers, Modals, Overlays):** `0.75rem` (12px / `rounded-xl`). Defines prominent physical partitions.

## Components

Components feel mechanical yet human-crafted, emphasizing quiet confidence, ink density, and precise hairline framing.

### Buttons
- **Primary:** Background `#3E3830`, text `#FAF8F5`, 1px border `#3E3830`. Typography set in `Space Grotesk` Medium (`label-md`). Hover transitions smoothly to `#2C2A26`.
- **Secondary / Ghost:** Background transparent, text `#1A1917`, border 1px solid `#EAE6DF`. Hover background `#FAF8F5` with border `#C2BDB5`.
- **Padding:** 8px 16px for standard; 6px 12px for compact. Radius: `0.25rem`.

### Form Inputs & Textareas
- **Base Style:** Background `#FFFFFF`, 1px border `#EAE6DF`, text `#1A1917`, radius `0.25rem`. Typography set in `Literata` (`body-md`) for entered text, with `Space Grotesk` (`label-sm`) for outer field labels.
- **Focus State:** 1px border `#3E3830` with a clean `0 0 0 1px #3E3830` ring. No multi-color glow.
- **Placeholder:** `#797670` rendered with archival softness.

### Cards & Writing Surfaces
- **Card Container:** Pure white (`#FFFFFF`) background, hairline border 1px `#EAE6DF`, radius `0.5rem`, ambient shadow `0 2px 12px rgba(26, 25, 23, 0.03)`.
- **Card Padding:** `space-lg` (24px) internally. Header sections delimited by a 1px `#EAE6DF` horizontal partition.

### Chips & Status Badges
- **Style:** Background `#FAF8F5`, border 1px solid `#EAE6DF`, text `#3E3830`, font `Space Grotesk` (`label-sm`).
- **Semantic Indicators:** Expressed via discrete monochrome iconography or 4px square ink markers rather than loud neon chips.

### Checkboxes & Radio Buttons
- **Unchecked:** 1px border `#C2BDB5`, background `#FFFFFF`, radius `2px` (checkbox) or circular (radio).
- **Checked:** Background `#3E3830`, border `#3E3830`, icon/dot `#FAF8F5`.

### Lists & Technical Tables
- **Lists:** Unordered lists use subtle square en-dash markers instead of default round bullets.
- **Tables:** Hairline horizontal rows divided by 1px `#EAE6DF`. Column headers styled in `Space Grotesk` uppercase (`label-sm`, letter-spacing `0.04em`), right-aligned for numeric data. Alternating row fills are avoided; hover rows receive a subtle `#FAF8F5` tint.