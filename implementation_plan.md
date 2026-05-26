# Implementation Plan: Audio Fusion Studio Dynamic Website Builder

We will create a highly advanced, fully dynamic, modular landing page and CMS (Page Builder) for **Audio Fusion Studio** (by Sahu). 

Instead of a hardcoded layout, the website's structure, section order, text, pricing, services, and visual elements will be stored in a **Firebase Realtime Database**. The client landing page will fetch this layout and dynamically render components in the exact order specified. The Admin Panel will feature a drag-and-drop or order resequencing UI where the user can move sections up/down, add new sections from predefined templates, toggle their visibility, and edit every single detail inside them.

---

## User Review Required

> [!IMPORTANT]
> **No Hardcoded Sections**: Every single component (Hero, Services, Showcase, Pricing, Contact, etc.) will be dynamically rendered based on database configuration. This gives the studio complete control over their content and layout.
>
> **Section Reordering UI**: In the Admin Panel, we will build a sleek and stable reordering mechanism (using HTML5 drag-and-drop paired with instant button controls for maximum compatibility and ease of use on mobile/desktop).
>
> **Branding & Logo Splash Page**: Sahu can set/upload the studio's custom logo via the Admin panel. If enabled, the landing page will display a premium soundwave splash intro, pulsing the logo in-sync with a fluid visualizer wave, and showing an customizable load tagline (e.g. "Entering the Fusion...") before smoothly unlocking the site.
>
> **Service Discounts & Cross-Outs**: Sahu can configure discounts directly on specific services. The cards will dynamically render the active deal price, the original rate with a strikethrough line, and a glowing neon promo badge (e.g. "Save 20%").
>
> **Slot Booking & WhatsApp Integration [NEW]**: Clients can book slots (date/time) for specific services. Upon booking, a notification will be sent directly via WhatsApp to the studio owner and the client, keeping everything organized.
>
> **Team & Roles Section [NEW]**: A dedicated section to showcase the team members, their expertise, and what they do in the studio.
>
> **Isolated Directory**: We will build this project inside `audio-fusion` in your workspace to keep Sahu's files and database nodes separate from your personal profile layout.

---

## Open Questions

> [!WARNING]
> **Firebase Realtime DB**: We will use the Firebase Realtime Database workspace (e.g. `sahill-trial`) but keep Sahu's data in the isolated path `/audio-fusion` so that your main portfolio remains clean and untouched.

---

## Proposed Changes

We will create a brand new Next.js project inside the `audio-fusion` directory.

### 1. Project Initialization & Base Configuration
#### [NEW] `audio-fusion/package.json`
- Initialize standard Next.js dependencies along with `framer-motion`, `lucide-react`, and `firebase`.

#### [NEW] `audio-fusion/app/lib/firebase.js`
- Configure connection to the Firebase Realtime Database node for `/audio-fusion`.

#### [NEW] `audio-fusion/app/globals.css`
- Core Design System: **Y2K Acid / Grainy Neon Aura Aesthetic**. Deep black backgrounds with highly saturated, iridescent, blurred gradient meshes (thermal colors like deep purples, hot pinks, bright oranges) overlaid with heavy SVG film grain/noise. Bold, high-contrast, slightly glitchy/distorted typography (like 'Clash Display' or 'Syne') with duotone elements. This matches the provided visual references of glowing, grainy "Midnight Dreams" / "Flip the Switch" style posters.

---

### 2. Modular Section Components (Client-Facing)
We will build highly styled modular sections that load their content dynamically from properties.

#### [NEW] `audio-fusion/components/IntroSplash.js`
- Full-screen entry splash page with a liquid-synth intro animation. Loads Sahu's custom logo, pulses it with glow animations, displays a loader tagline, and plays a sleek fade-out reveal using Framer Motion.

#### [NEW] `audio-fusion/components/Hero.js`
- Glowing interactive player with neon waveforms, background audio waves, and custom headings.

#### [NEW] `audio-fusion/components/Team.js`
- Grid of team members with photos, roles, and descriptions of their expertise.

#### [NEW] `audio-fusion/components/Services.js`
- Grid of services cards. Displays icons, titles, descriptions, current pricing, strikethrough original prices, and glowing offer/promo badges. Links to the booking section.

#### [NEW] `audio-fusion/components/Booking.js`
- A calendar and time slot selector allowing clients to book a session. Integrates with a WhatsApp API (or `wa.me` links) to send booking details instantly.

#### [NEW] `audio-fusion/components/Showcase.js`
- Music visualizer / sound showreel and audio stream embeds.

#### [NEW] `audio-fusion/components/Pricing.js`
- Modular pricing tables with editable tiers, highlight status, and "Book Session" buttons.

#### [NEW] `audio-fusion/components/Contact.js`
- Contact details, operational hours, social media links, and a functional lead-capture form.

---

### 3. Dynamic Page Engine & Layout
#### [NEW] `audio-fusion/app/page.js`
- Fetches dynamic branding settings (logo, intro configurations) and sections from Firebase.
- Handles the state of the `IntroSplash` entrance animation.
- Dynamically iterates and renders sections using the fetched order array.
- Implements premium page-level transitions.

---

### 4. Admin Page Builder & Section Reorder Dashboard
#### [NEW] `audio-fusion/app/admin/page.js`
- Secure admin login screen and full-height sidebar.
- **Branding & Logo Manager**: Dedicated panel to input/upload the studio logo URL, set the logo's theme/glow color, customize the loading splash message, and toggle the intro splash on/off.
- **Section Manager**: A visual listing of all sections in the current order with "Drag & Drop" / Up-Down ordering triggers.
- **Section Editor Modal**: Context-sensitive fields for editing content. The Services Editor lets Sahu manage discounts. Team Editor allows adding/removing members. Booking Settings allow configuring the WhatsApp number and available times.
- **Layout Creator**: Dropdown to select and append a new section template type to the landing page.

---

## Verification Plan

### Automated & Manual Tests
- **Booking Flow & WhatsApp**: Verify that selecting a slot successfully formats a WhatsApp message with the correct booking details.
- **Team Preview**: Add a team member in the admin and verify they appear on the frontend.
- **Branding & Intro Preview**: Toggle the intro animation on/off, change the logo URL, and verify the splash screen matches in real time.
- **Services Discounts**: Add dynamic rates and verify that the client landing page correctly displays crossed-out original rates and neon badges.
- **Firebase Connection**: Validate reading/writing layout data from `/audio-fusion` RTDB node.
- **Dynamic Reordering**: Add multiple sections in Admin, reorder them, and verify that the client landing page immediately updates the sequence in real time.
- **Visibility Toggle**: Disable a section in Admin and ensure it instantly disappears on the live website.
- **Responsive & Design Review**: Test neon effects, HSL glows, and scroll animations on both mobile and desktop screen sizes.

