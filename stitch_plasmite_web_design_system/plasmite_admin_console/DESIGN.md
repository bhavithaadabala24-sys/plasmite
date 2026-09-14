---
name: Plasmite Admin Console
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#47464b'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#77767b'
  outline-variant: '#c8c5cb'
  surface-tint: '#5f5e61'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1e'
  on-primary-container: '#858387'
  inverse-primary: '#c8c5ca'
  secondary: '#515f74'
  on-secondary: '#ffffff'
  secondary-container: '#d5e3fc'
  on-secondary-container: '#57657a'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#131b2e'
  on-tertiary-container: '#7c839b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e1e6'
  primary-fixed-dim: '#c8c5ca'
  on-primary-fixed: '#1b1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#d5e3fc'
  secondary-fixed-dim: '#b9c7df'
  on-secondary-fixed: '#0d1c2e'
  on-secondary-fixed-variant: '#3a485b'
  tertiary-fixed: '#dae2fd'
  tertiary-fixed-dim: '#bec6e0'
  on-tertiary-fixed: '#131b2e'
  on-tertiary-fixed-variant: '#3f465c'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display:
    fontFamily: Inter
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.375rem
  body-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Inter
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-md:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1.25rem
    letterSpacing: 0.005em
  label-sm:
    fontFamily: Inter
    fontSize: 0.6875rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.04em
  code-md:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: 1.25rem
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.6875rem
    fontWeight: '400'
    lineHeight: 1rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 0.75rem
  margin: 1rem
  space-xs: 0.25rem
  space-sm: 0.375rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
---

## Brand & Style

The design system embodies an uncompromising, dependable, and high-density operational aesthetic engineered specifically for mission-critical infrastructure oversight, platform engineering, and administrative governance. It conveys strict rigor, rapid triage efficiency, and absolute reliability.

Drawing inspiration from structured industrial engineering tools and mission control dashboards, the style is defined by:
- **Utilitarian Rigor:** Absolute economy of motion. Decorative flourishes and gratuitous padding are systematically replaced with structural density, sharp semantic hierarchies, and high information throughput.
- **Hairline Framing:** Surface separation relies on deliberate, 1px geometric borders over diffused dropshadows. Surfaces remain crisp, flat, and legible under varying monitor environments.
- **High Operational Contrast:** An ink-and-canvas balance allows primary administrative content to sit in high clarity against bright backgrounds, while tactical chromatic alerts (telemetry green, warning amber, critical containment red) instantly draw immediate operator focus without visual clutter.

## Colors

The color palette prioritizes operational focus and scannability, anchoring high-contrast ink against neutral slates.

### Functional Palette
- **Canvas Base:** `#FFFFFF` serves as the structural workspace, framed by `#F8FAFC` for secondary toolbars, side rails, and table header rows.
- **Hairline Dividers:** `#E2E8F0` establishes structural boundaries, complemented by an interactive hover boundary at `#CBD5E1`.
- **Primary Ink (`#18181B`):** Applied to primary actions, interactive toggle states, table row headers, and dominant labels to deliver unambiguous legibility.
- **Secondary Slate (`#475569`):** Reserved for technical metadata, secondary navigation items, and descriptive supporting text.
- **Neutral Muted (`#64748B`):** Utilized for table column headers, unit labels, inactive tab states, and baseline metrics.

### Tactical Accents
- **Operational Green (`#10B981`):** Active daemon instances, validated TLS routes, and healthy services. Paired with `#ECFDF5` for status indicator surfaces.
- **Elevated Warning (`#F97316`):** Degraded nodes, disk capacity thresholds, and expiring certificates. Paired with `#FFF7ED`.
- **Critical & Admin Containment (`#EF4444`):** Elevated administrative mode, destructive actions, cluster panic conditions, and rate violations. Paired with `#FEF2F2`.
- **Informational Blue (`#2563EB`):** Dynamic runtime configurations, staged patches, and operational logs.

## Typography

The type system pairs **Inter** for clean hierarchical legibility with **JetBrains Mono** for operational data density.

### Typographic Rules
- **Inter:** Serves as the primary operational workhorse across navigation, labels, table headers, forms, and analytical titles. Font weight is strictly restrained between regular (400) for dense prose, medium (500) for controls and table text, and semibold (600) for navigational anchors and view headers.
- **JetBrains Mono:** Mandated for machine-parsed information: UUIDs, cryptographic hashes, commit SHAs, IPv4/IPv6 addresses, memory addresses, latency figures, and ISO-8601 timestamps.
- **Upper-Case Micro Labels:** Structural categories, permission levels, and column header names use `label-sm` with tabular spacing and uppercase capitalization to maintain scan paths across wide viewport viewports.

## Layout & Spacing

The spatial engine is built around a rigorous 4px baseline, tuned specifically for data-dense dashboards, terminal logs, and wide enterprise matrices.

### Layout Philosophy
- **Density Grid:** A fixed-margin, fluid-content split layout. Side navigation collapses between 56px (icon mode) and 240px (expanded mode).
- **Table Density Standards:** Standard table rows observe an exact 32px height rhythm (`space-xs` vertical padding on cells), while high-density telemetry views use 28px rows.
- **Horizontal Anchoring:** Layouts utilize 1200px minimum viewport targeting with full edge-to-edge expansion for log streams and cluster topographies. Margin spacing contracts to 12px on compact auxiliary viewports and scales to 24px on widescreen multi-monitor engineering setups.

## Elevation & Depth

Visual hierarchy rejects exaggerated drop shadows and soft blurred layering, adopting instead an engineered **Hairline Surface Model**.

### Structural Levels
- **Layer 0 (Canvas):** Flat `#FFFFFF` workspace.
- **Layer 1 (Sub-Panels & Headers):** Backing frames and panel headers at `#F8FAFC`, enclosed by a 1px `#E2E8F0` border.
- **Layer 2 (Popovers, Command Palette, Dropdowns):** `#FFFFFF` surface with a 1px border (`#CBD5E1`) and a sharp micro-depth drop shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05), 0 4px 6px -1px rgba(0, 0, 0, 0.04)`.
- **Layer 3 (Modal Overlays):** `#FFFFFF` with a crisp `0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.03)` shadow, flanked by an administrative backdrop tint (`#0F172A` at 30% opacity).

## Shapes

The design system enforces a strict 4px (`roundedness: 1`) geometric standard across interactive controls, panels, input fields, badges, and code blocks.

### Corner Radii Guidelines
- **Controls & Form Inputs:** 4px radius (`0.25rem`). Maintains visual precision and preserves dense horizontal space.
- **Cards & Data Tables:** 4px radius (`0.25rem`) on bounding containers. Inner table rows remain square (0px) to prevent nested border clipping.
- **Status Indicators & Micro Badges:** 2px to 4px radius. Strict anti-pill policy; circular treatments are reserved solely for circular connection status dots (4px by 4px diameter).

## Components

### Buttons
- **Primary:** Solid `#18181B` fill, `#FFFFFF` text, 4px corner radius, 28px height (`px-3 py-1`), `label-md` font. Active: `#27272A`.
- **Destructive / Admin Execution:** `#EF4444` solid fill, `#FFFFFF` text. Focus state exhibits a 2px `#F87171` outline offset.
- **Secondary / Outline:** `#FFFFFF` fill, 1px `#E2E8F0` border, `#18181B` text. Hover: `#F8FAFC` background with a `#CBD5E1` border.
- **Ghost:** Transparent background, `#475569` text. Hover: `#F1F5F9`.

### Data Tables
- **Header:** Height 32px, background `#F8FAFC`, border-bottom 1px `#E2E8F0`, typography `label-sm` in `#64748B`.
- **Cells:** Vertical padding 6px, horizontal padding 12px, border-bottom 1px `#F1F5F9`. Hover row highlights with `#F8FAFC`.

### Badges & Technical Indicators
- **Admin Badge:** Solid `#FEF2F2` background, 1px `#FCA5A5` border, `#B91C1C` text in uppercase `label-sm`, 4px radius.
- **Connection Indicator:** Inline flex, 6px circular dot (`#10B981`) with a 1.5px whitespace halo, accompanied by JetBrains Mono status text.

### Form Inputs & Selects
- Height 28px, border 1px `#E2E8F0`, background `#FFFFFF`, typography `body-md`. Focus ring: 1px `#18181B` outline without blur glow. Disabled: `#F1F5F9` background, `#94A3B8` text.

### Monospaced Code Blocks & Telemetry Strips
- Background `#0F172A`, text `#E2E8F0`, typography `code-md`, 4px radius, 1px `#1E293B` perimeter line. Timestamps colored `#64748B`.