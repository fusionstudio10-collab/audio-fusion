# 🎵 Audio Fusion Studio - Information Tree & Context Map

This document serves as the permanent, authoritative knowledge tree for the **Audio Fusion Studio Dynamic Page Builder & CMS** website project. It contains all structural, architectural, database, and conversational context so that any developer or AI assistant can immediately understand the project state without requiring repeat explanations.

---

## 👤 Project Overview
* **Client / Studio Owner:** Sahu
* **Lead Engineer:** Sahil Thorat
* **Project Name:** Audio Fusion Studio
* **Core Product:** A highly-dynamic, modular landing page website coupled with an advanced Page Builder Admin Panel allowing full drag-and-drop/reorder capabilities, instant section editing, pricing tables management, and custom content modification.

---

## 📐 Project Architecture (Dynamic Page Builder Model)

Instead of hardcoding components, the website functions as a **Dynamic Page Rendering Engine**. 

```text
Database Sections List (Firebase RTDB: /audio-fusion/sections)
   │
   ├── [Order 1]: Hero Cover Visualizer  ---> (Rendered First)
   ├── [Order 2]: Studio Services Grid   ---> (Rendered Second)
   ├── [Order 3]: Pricing Packages Grid  ---> (Rendered Third)
   └── [Order 4]: Contact & Lead Form    ---> (Rendered Fourth)
```

---

## 📂 System Directory Structure
The standalone project is built using **Next.js 14** (App Router), **Framer Motion** for premium liquid animations, **Lucide Icons**, and **Firebase Realtime Database**.

```text
audio-fusion/
├── package.json              # Standalone dependencies & dev script (port 3001)
├── next.config.mjs           # Next.js configurations
├── jsconfig.json             # Absolute path alias settings (@/*)
├── app/
│   ├── layout.js             # Global html wrapping & Google Fonts loading
│   ├── page.js               # Client landing page (Dynamic Engine)
│   ├── globals.css           # Premium glassmorphic glows & soundwave styles
│   ├── lib/
│   │   ├── firebase.js       # Firebase database configuration
│   │   └── defaultData.js    # Seed template data if database is empty
│   ├── admin/
│   │   ├── page.js           # Admin Dashboard & Page Layout Manager
│   └── components/           # Modular Dynamic Sections
│       ├── Hero.js           # Wave visualizer & audio showreel player
│       ├── About.js          # Biography, stats & equipment photos
│       ├── Services.js       # Dynamic services cards & dynamic rates
│       ├── Pricing.js        # Flat-rate pricing grids with badges
│       └── Contact.js        # Contact details & booking lead capture
└── information_tree.md       # [This File] Permanent system context map
```

---

## 🗄️ Database Schema & Data Models
All website components are fully dynamic and read from a single array under `/audio-fusion/sections` in the Firebase Realtime Database. 

### 1. Section Base Schema
Each section node contains:
```json
{
  "id": "sec-unique-id",
  "type": "hero | about | services | pricing | contact",
  "name": "Human Readable Label",
  "visible": true,
  "content": { ... }
}
```

### 2. Section Content Specifications

* **Hero Section (`type: "hero"`)**
  ```json
  {
    "title": "String",
    "subtitle": "String",
    "tagline": "String",
    "accentColor": "Hex Code Color",
    "trackTitle": "String",
    "trackUrl": "MP3 Audio URL for Visualizer Player"
  }
  ```

* **About Section (`type: "about"`)**
  ```json
  {
    "title": "String",
    "bio": "Markdown or Text Block",
    "stats": [
      { "label": "String", "value": "String" }
    ]
  }
  ```

* **Services Section (`type: "services"`)**
  ```json
  {
    "title": "String",
    "description": "String",
    "items": [
      {
        "id": "srv-unique-id",
        "icon": "Music | Sliders | Mic | Headphones",
        "title": "String",
        "desc": "String",
        "price": "String",
        "originalPrice": "String (optional, e.g., '$120' for discount striking)",
        "discountBadge": "String (optional, e.g., '20% OFF' or 'Promo')"
      }
    ]
  }
  ```

* **Pricing Section (`type: "pricing"`)**
  ```json
  {
    "title": "String",
    "description": "String",
    "packages": [
      {
        "id": "pkg-unique-id",
        "name": "String",
        "price": "String",
        "period": "String",
        "features": ["Feature String 1", "Feature String 2"],
        "popular": true
      }
    ]
  }
  ```

* **Contact Section (`type: "contact"`)**
  ```json
  {
    "title": "String",
    "description": "String",
    "email": "String",
    "phone": "String",
    "address": "String",
    "hours": "String"
  }
  ```

### 3. Global Settings & Branding (`/audio-fusion/settings`)
To support customizable branding and the premium intro animation, we store a separate configurations node:
```json
{
  "studioName": "String",
  "logoUrl": "String (URL of the uploaded logo image or SVG)",
  "logoGlowColor": "Hex Code Color (e.g., '#FFD700' to power the visualizer/ambient theme)",
  "introEnabled": "Boolean (toggles the splash intro page)",
  "introDuration": "Number (in seconds, e.g., 3)",
  "introText": "String (e.g., 'Initializing Soundwave...')"
}
```

---

## 🔄 Conversation & Decision Log (Brief Summary)
* **Isolated Environment:** Decided to build the codebase in a standalone folder `audio-fusion` so Sahu's project can be packaged, pushed to its own GitHub repository, and deployed on Vercel separately without interfering with Sahil's personal files.
* **Database Isolation:** Connected the app to `/audio-fusion` in the Firebase Realtime Database to keep Sahil's portfolio records and Sahu's studio layouts independent.
* **Editor Flow:** The Admin interface will support full section reordering (Up/Down sorting buttons and visual drag styling), toggling visibility (`visible: true/false`), editing values, and adding new pre-modeled dynamic sections.
* **Promotions & Offers:** Added service fields (`originalPrice` and `discountBadge`) so Sahu can configure discounts/cross-outs directly from the Admin Panel to drive conversions.
* **Custom Logo & Splash Intro:** Added a dynamic Branding Settings schema. Sahu can upload/set their custom studio logo from the Admin Panel. When enabled, a premium, soundwave-powered splash screen renders on the first visit, dynamically loading Sahu's logo and scaling/glowing it with custom animations before smoothly opening the main studio site.

