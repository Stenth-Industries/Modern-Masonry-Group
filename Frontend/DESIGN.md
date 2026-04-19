# Modern Masonry Group — DESIGN.md

> Obsidian & Brass. Luxury masonry. Cinematic editorial, true black surfaces, warm brass accents, architectural typography.

Inspired by Lamborghini and Ferrari brand design systems. Use this file to guide AI coding agents to generate UI that matches the Modern Masonry Group aesthetic.

---

## Brand Identity

- **Brand Name:** Modern Masonry Group
- **Tagline:** Built to Last. Designed to Impress.
- **Personality:** Premium, authoritative, architectural, editorial
- **Aesthetic:** Obsidian & Brass — cinematic luxury meets industrial craft
- **Tone:** Confident, refined, minimal. Never playful, never loud.

---

## Color Palette

```
--color-obsidian:       #0a0a0a   /* True black. Primary background. */
--color-obsidian-soft:  #111111   /* Elevated surfaces & cards */
--color-obsidian-mid:   #1a1a1a   /* Borders, dividers, subtle UI */
--color-obsidian-light: #242424   /* Hover states, panel backgrounds */

--color-brass:          #b8955a   /* Primary accent. CTAs, highlights. */
--color-brass-light:    #d4ae78   /* Hover state for brass elements */
--color-brass-dark:     #8a6d3f   /* Pressed state, deep accents */
--color-brass-muted:    rgba(184, 149, 90, 0.15) /* Subtle brass glow / tints */

--color-text-primary:   #f0ece4   /* Main text. Warm white, never pure. */
--color-text-secondary: #9a9690   /* Body copy, captions */
--color-text-muted:     #5a5652   /* Placeholder, labels */
--color-text-inverse:   #0a0a0a   /* Text on brass backgrounds */

--color-white:          #ffffff
--color-overlay:        rgba(10, 10, 10, 0.60)
```

---

## Typography

```
Font Stack:
  --font-display:  'Cormorant Garamond', Georgia, serif   /* Headlines, hero text */
  --font-heading:  'Outfit', 'Inter', sans-serif           /* Section titles, nav */
  --font-body:     'Inter', 'Outfit', sans-serif           /* Body text, UI copy */
  --font-mono:     'JetBrains Mono', monospace             /* Specs, codes, tags */

Scale (rem):
  --text-xs:   0.75rem   /* 12px — labels, tags */
  --text-sm:   0.875rem  /* 14px — captions, meta */
  --text-base: 1rem      /* 16px — body */
  --text-lg:   1.25rem   /* 20px — intro copy */
  --text-xl:   1.5rem    /* 24px — subheadings */
  --text-2xl:  2rem      /* 32px — section titles */
  --text-3xl:  3rem      /* 48px — hero subheadlines */
  --text-4xl:  5rem      /* 80px — hero headlines */
  --text-5xl:  7.5rem    /* 120px — editorial display */

Letter Spacing:
  Uppercase labels & tags:   letter-spacing: 0.2em
  Section headings:          letter-spacing: 0.05em
  Display / hero:            letter-spacing: -0.02em

Font Weights:
  Display headlines: 300 (light italic for Cormorant)
  Section titles:    600
  Body:              400
  Labels/tags:       500 uppercase
```

---

## Spacing System

```
--space-1:   0.25rem   /*  4px */
--space-2:   0.5rem    /*  8px */
--space-3:   0.75rem   /* 12px */
--space-4:   1rem      /* 16px */
--space-6:   1.5rem    /* 24px */
--space-8:   2rem      /* 32px */
--space-10:  2.5rem    /* 40px */
--space-12:  3rem      /* 48px */
--space-16:  4rem      /* 64px */
--space-20:  5rem      /* 80px */
--space-24:  6rem      /* 96px */
--space-32:  8rem      /* 128px */
```

---

## Borders & Radius

```
--radius-none:  0
--radius-sm:    2px
--radius-md:    4px
--radius-lg:    8px
--radius-full:  9999px

--border-subtle:  1px solid rgba(184, 149, 90, 0.12)
--border-default: 1px solid rgba(184, 149, 90, 0.25)
--border-strong:  1px solid rgba(184, 149, 90, 0.5)
--border-muted:   1px solid rgba(240, 236, 228, 0.08)
```

---

## Surfaces & Glassmorphism

```
/* Standard card / panel */
.surface {
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(184, 149, 90, 0.15);
}

/* Elevated / modal */
.surface-elevated {
  background: rgba(26, 26, 26, 0.95);
  backdrop-filter: blur(32px);
  border: 1px solid rgba(184, 149, 90, 0.25);
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(184, 149, 90, 0.08);
}

/* Subtle / background panel */
.surface-subtle {
  background: rgba(10, 10, 10, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(240, 236, 228, 0.06);
}
```

---

## Shadows & Glow

```
--shadow-sm:     0 2px 8px rgba(0, 0, 0, 0.4);
--shadow-md:     0 8px 24px rgba(0, 0, 0, 0.5);
--shadow-lg:     0 16px 48px rgba(0, 0, 0, 0.6);
--shadow-xl:     0 32px 80px rgba(0, 0, 0, 0.7);

--glow-brass:    0 0 20px rgba(184, 149, 90, 0.3), 0 0 60px rgba(184, 149, 90, 0.1);
--glow-brass-sm: 0 0 8px rgba(184, 149, 90, 0.25);
```

---

## Transitions & Animation

```
--ease-out:     cubic-bezier(0.0, 0.0, 0.2, 1)
--ease-in-out:  cubic-bezier(0.4, 0.0, 0.2, 1)
--ease-spring:  cubic-bezier(0.34, 1.56, 0.64, 1)

--duration-fast:   150ms
--duration-base:   250ms
--duration-slow:   400ms
--duration-slower: 700ms
--duration-reveal: 1200ms

Animation principles:
  - Prefer transform + opacity over layout-affecting properties
  - Entrance: fade up (translateY 20px → 0) with stagger
  - Hover: subtle scale(1.02) on cards, brass border brightening
  - Page transitions: cinematic fade (700ms ease-out)
  - Parallax: subtle (0.3 ratio), never distracting
```

---

## Components

### Buttons

```
Primary (CTA):
  background: linear-gradient(135deg, #b8955a, #d4ae78)
  color: #0a0a0a
  font: 500 0.8rem uppercase, letter-spacing: 0.15em
  padding: 14px 32px
  border-radius: 2px
  transition: all 250ms ease
  hover → background: #d4ae78, shadow: --glow-brass-sm

Secondary (Ghost):
  background: transparent
  border: 1px solid rgba(184, 149, 90, 0.4)
  color: #b8955a
  hover → border-color: #b8955a, background: rgba(184,149,90,0.08)

Tertiary (Text link):
  color: #b8955a
  underline on hover via border-bottom: 1px solid currentColor
```

### Tags / Labels

```
background: rgba(184, 149, 90, 0.1)
border: 1px solid rgba(184, 149, 90, 0.25)
color: #b8955a
font: 500 0.7rem uppercase letter-spacing: 0.2em
padding: 4px 10px
border-radius: 2px
```

### Cards (Product / Brick)

```
background: rgba(17, 17, 17, 0.9)
border: 1px solid rgba(184, 149, 90, 0.1)
border-radius: 4px
overflow: hidden

hover:
  border-color: rgba(184, 149, 90, 0.35)
  transform: translateY(-4px)
  box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,149,90,0.2)
  transition: all 400ms cubic-bezier(0.0, 0.0, 0.2, 1)
```

### Navigation (Fixed)

```
background: rgba(10, 10, 10, 0.92)
backdrop-filter: blur(24px)
border-bottom: 1px solid rgba(184, 149, 90, 0.1)
height: 72px

Active link: color #b8955a, underline accent
Logo: brass tint filter
Scroll-shrink: height 72px → 56px, background darkens
```

### Dividers / Section Separators

```
Hairline:  1px solid rgba(184, 149, 90, 0.12)
Bold:      2px solid rgba(184, 149, 90, 0.4)
With glow: border + box-shadow: 0 0 8px rgba(184,149,90,0.15)
Ornamental: centered short line <60px wide, 2px brass
```

---

## Imagery & Visual Style

- **Photography:** High-contrast, chiaroscuro lighting. Dark vignettes. Stone and texture close-ups.
- **Overlays:** Always dark (60%+). Never white overlays.
- **Video/Hero:** Slow, deliberate movement. No cuts faster than 2s.
- **Textures:** Subtle noise grain overlay (opacity 0.04) on all dark surfaces.
- **Grid:** Editorial asymmetry. Odd column counts. Generous whitespace.
- **Icons:** Thin stroke (1.5px), never filled. Brass tint on active state.

---

## Do / Don't

| ✅ Do | ❌ Don't |
|---|---|
| True black (#0a0a0a) backgrounds | White or near-white backgrounds |
| Brass/gold accents sparingly | Overusing gold (feels cheap) |
| Uppercase tracking on labels | Uppercase body copy |
| Serif display fonts for hero text | Serif body copy |
| Micro-animations on all interactions | Bouncy or cartoonish animations |
| Generous section padding (80px+) | Cramped, dense layouts |
| Single-color CTA per view | Multiple competing CTAs |
| Photography with dark vignettes | Bright, saturated stock photos |
| Blur + dark overlay on backgrounds | Unobscured busy backgrounds |

---

## Usage

Drop this file into your project root. When prompting your AI coding agent, say:

> "Use DESIGN.md for all UI decisions — colors, typography, spacing, components, and animation principles."

This will instruct the agent to generate UI that matches the Modern Masonry Group's Obsidian & Brass luxury aesthetic.
