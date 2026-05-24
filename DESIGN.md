# Personal Radio — DESIGN.md

## Visual Theme & Atmosphere

Editorial music object. Warm paper surfaces, a single album artifact as hero, physical unwrap metaphor. Calm, premium, not SaaS-dashboard. Density: low. Motion: deliberate, 1.1–1.8s for unwrap beats.

## Color Palette & Roles

| Role | Value | Use |
| --- | --- | --- |
| Paper | `#f6f4ef` | Page card background |
| Paper deep | `#ebe7dc` | Subtle panels |
| Ink | `#151515` | Primary text |
| Ink soft | `rgba(21,21,21,0.58)` | Meta, secondary |
| Ink faint | `rgba(21,21,21,0.32)` | Dividers, hints |
| Cover ground | `#171717` | Album edge bleed |
| Stage void | `#000` | Outer canvas |

## Typography

- Display: Georgia / Songti SC — album title, serif, tight leading
- UI: Avenir Next / PingFang SC — meta, controls, uppercase tracking on meta line
- Scale: meta 14–19px tracked; title clamp 42–72px

## Component Stylings

- **Album cover**: rounded clamp 22–30px; soft warm shadow; no harsh lens flares on wrap
- **Plastic wrap**: same transform plane as cover; soft-light grain; low opacity; overlaps at seal — never a visible gap
- **Seal**: frosted band, tear via clip-path — never scale-to-line
- **Controls**: circular ghost buttons; minimal chrome until `open` state

## Layout Principles

- Wrapped: centered column, cover + copy stack
- Open: liquid visual full stage; album copy may compress
- Spacing: 14px detail gaps; generous vertical rhythm on wrap screen

## Depth & Elevation

- One primary shadow on cover; avoid stacked glows
- Plastic is a surface treatment, not a floating card

## Do's and Don'ts

- Do: keep wrap/seal/image on one 3D plane during rotate
- Do: prefer soft-light / subtle noise over diagonal screen blends
- Don't: backdrop-filter on wrap layers (breaks rotation composite)
- Don't: separate texture PNG that slides differently from artwork

## Responsive Behavior

- Cover size: `clamp(300px, 52vmin, 560px)` desktop; ~78vw mobile cap 360px
- Touch: whole cover button is tap target

## Agent Prompt Guide

Build like a physical record mailer opening: warm paper, one serif title, thin shrink-wrap sheen, center seal tear, then liquid glass scene. Restrained accents; no purple gradients; no generic startup hero.
