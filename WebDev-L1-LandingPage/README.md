# Dunemark — Offline-First Travel Journal Landing Page

[![OASIS INFOBYTE](https://img.shields.io/badge/OASIS%20INFOBYTE-Level%201%20Task%201-e06d44?style=flat-square)](https://oasisinfobyte.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-528a6f?style=flat-square)](LICENSE)
[![Vanilla Web Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-f5efe6?style=flat-square)](#technology-stack)

**Dunemark** is a premium, editorial landing page for a fictional offline-first field journal and topographic mapping app engineered specifically for expedition naturalists and remote explorers. The landing page showcases a rich dark editorial aesthetic anchored by a warm amber/sand accent (`#e06d44`), fluid responsive typography, and pure vector graphics without any third-party framework overhead.

---

## Preview

![Dunemark Landing Page](./screenshot.png)

---

## OASIS INFOBYTE Internship Information

- **Internship Program:** OASIS INFOBYTE Web Development & Designing Internship (OIBSIP)
- **Track Level:** Level 1
- **Task Number:** Task 1 — Landing Page
- **Author:** Bhanu Pratap Jonwar (MCA Student, ITM University)
- **Official Links:**
  - **LinkedIn:** [https://in.linkedin.com/in/bhanupratapjonwar](https://in.linkedin.com/in/bhanupratapjonwar)
  - **GitHub:** [https://github.com/bhanujonwar](https://github.com/bhanujonwar)
  - **Contact Email:** [bhanupratapjonwar@gmail.com](mailto:bhanupratapjonwar@gmail.com)

---

## Implemented Features (Strictly Matching Codebase)

1. **Fixed Header & Glassmorphism Navigation:**
   - Fixed header with 6 essential navigation links: `Home`, `Features`, `How it works`, `About`, `FAQ`, and `Contact`.
   - Transparent at the top of the viewport; applies glass blur background (`backdrop-filter: blur(16px)`) upon scrolling past 20px.
   - Real-time active-section highlighting via `IntersectionObserver`.
   - Smooth animated underline indicator on link hover and active state.
   - Accessible animated hamburger button for mobile viewports with `aria-expanded` and keyboard Escape-to-close support.
   - Calibrated 360px mobile header where brand logo and hamburger button never collide.

2. **Hero Section:**
   - Editorial headline, architecture label pill, and concise descriptive copy.
   - Dual Call-to-Action (CTA) group linking smoothly to feature and workflow sections.
   - Custom CSS/SVG Phone Mockup crafted entirely with vector SVG paths (zero external raster or stock images) showcasing offline GNSS telemetry, topographic contour maps, elevation waypoints, and audio memo bookmarks.

3. **Core Features Section (4 Modular Cards):**
   - **Zero-Signal GNSS Positioning:** Satellite GPS coordinate stamping with zero cellular dependency.
   - **Cryptographic Local Storage:** AES-256 equivalent local device storage with zero telemetry trackers.
   - **Cached Topographic Contours:** Pre-cached vector elevation profiles and mountain trail reliefs.
   - **Open GeoJSON & Archival Export:** Standardized open format route exports.
   - Smooth card hover lift transitions (`transform: translateY(-4px)`).

4. **Field Workflow Section (3 Clear Steps):**
   - Step 01: Pre-Cache Your Terrain (Base camp data bundling).
   - Step 02: Record Beyond The Grid (Airplane-mode waypoint capture).
   - Step 03: Compile Archival Dispatches (GeoJSON and hardcover compilation).

5. **About & Manifesto Section:**
   - Clear editorial copy explaining Dunemark's calm, offline-first philosophy compared to noisy continuous-connectivity apps.
   - 3 Key Benefit Cards: Battery Sovereignty (<3% battery consumption/day), Total Privacy Sovereignty, and Decades-Long Archival Durability.

6. **Interactive FAQ Accordion:**
   - Real semantic `<button>` trigger elements with full ARIA accessibility (`aria-expanded`, `aria-controls`, and `region` roles).
   - Expanding and collapsing panels with rotating chevron indicators and single-panel focus.

7. **Validated Direct Contact Dispatch:**
   - Developer profile card featuring verified links to LinkedIn, GitHub, and email.
   - Contact form with client-side JavaScript validation (name, email, subject, message length).
   - Honest dispatch mechanism: launches a pre-addressed `mailto:` link to `bhanupratapjonwar@gmail.com` with formatted parameters rather than simulating a fake server request.

8. **Semantic Footer:**
   - Dunemark brand mark and official copyright: `© 2026 Dunemark`.
   - Navigation links, developer contact placeholder, and social profile links.

---

## Design Standards & Compliance

- **Centred UI Constraint:** The main container (`.container`) enforces a strict `max-width: 1200px; margin-inline: auto;` ensuring balanced, centered presentation on ultra-wide 1920px displays without awkward horizontal stretching.
- **Zero Horizontal Overflow:** Enforced via `html, body { overflow-x: clip; }` and encapsulated glow elements, guaranteeing seamless rendering across all viewport widths (from 360px up to 1920px+).
- **Typography:** Strictly constrained to 2 Google Font families: **Fraunces** (editorial serif) and **DM Sans** (clean geometric sans-serif) with robust system fallbacks.
- **Zero Prohibited Elements:** No fake testimonials, no invented ratings or statistics, no custom cursor rings, no auto-playing sounds or background audio, no floating overlays blocking mobile CTAs, and no external raster images.
- **Motion Safety:** All animations respect `prefers-reduced-motion: reduce`. Content remains 100% visible if JavaScript is disabled.

---

## Technology Stack

- **Markup:** Semantic HTML5 (`header`, `nav`, `main`, `section`, `article`, `footer`, `button`, `form`)
- **Styling:** Modern Vanilla CSS3 (Custom Properties, CSS Grid, Flexbox, Fluid `clamp()` typography)
- **Scripting:** Clean Vanilla JavaScript ES6+ (Zero dependencies, Zero npm packages, Zero frameworks)

---

## How to Run Locally

Because this project is built with zero third-party dependencies, you do not need `npm`, `node`, or any dev server:

1. Clone or download this repository.
2. Locate `index.html` in the root folder.
3. Open `index.html` directly in any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Safari).

---

© 2026 Dunemark. Built by **Bhanu Pratap Jonwar** (MCA, ITM University) for **OASIS INFOBYTE**.
#
