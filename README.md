# 🌿 PHYTOCOSM 3D (Φυτόκοσμος)
### Interactive Botanical Cytology, Internal Micro-Anatomy & Organic Biochemistry Laboratory

[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**PHYTOCOSM** is a cinematic real-time 3D plant internal anatomy, cell biology, and organic chemistry engine. Built with Next.js App Router, Three.js, and WebGL, it allows users to dissect biological specimens down to cellular and molecular levels.

---

## 🔬 Core Laboratories & Features

### 1. Transverse 3D Dissection Lab (`/specimens/[id]`)
- **Real-Time Dissection Cutting Plane**: Drag the dissection slider to dynamically slice through plant tissues, exposing illuminated internal cross-section rings:
  - Outer Cortex & Epicuticle
  - Phloem Ring (photosynthetic sucrose translocation)
  - Vascular Cambium Meristem (glowing lateral ring)
  - Xylem Vessels (capillary tension & mineral water sap)
  - Central Pith Parenchyma
- **Dual-Channel Vascular Flow Simulation**: Animated particle systems simulating upward Xylem transpiration (cyan) and downward Phloem translocation (amber).
- **Exploded View Mode**: Animate tissue strata apart in 3D space.
- **Interactive Raycasting Hotspots**: Click on 3D pins to zoom camera onto specialized structures (Fenestrations, Resin glands, Torus-margo valves, Jigsaw pavement cells).
- **4 Visual Rendering Styles**: Organic Realistic, Bioluminescent Cellular, X-Ray Radiography, and Technical Wireframe.

### 2. Eukaryotic Plant Cell Cytology 3D (`/cytology`)
- Complete 3D interactive plant cell model with orbit focus on:
  - **Cell Wall & Middle Lamella** (cellulose microfibril matrix)
  - **Chloroplasts** (thylakoid grana discs & stroma)
  - **Central Vacuole & Tonoplast** (turgor pressure engine)
  - **Nucleus & Nucleolus** (chromatin & transcription center)
  - **Mitochondria** (cristae & cellular respiration)
  - **Endoplasmic Reticulum & Golgi Dictyosomes**
  - **Plasmodesmata** (intercellular symplastic channels)
- Live cutaway toggle (transparent vs opaque cell wall).

### 3. Molecular & Biochemical Laboratory (`/biochemistry`)
- Interactive 3D Ball-and-Stick Molecular Viewer:
  - **Chlorophyll *a*** ($C_{55}H_{72}MgN_4O_5$): Porphyrin ring with coordinated $Mg^{2+}$ and phytol tail.
  - **Cellulose Microfibril** ($(C_6H_{10}O_5)_n$): $\beta$-1,4-glucan polymer with inter-chain hydrogen bonds.
  - **Beta-Caryophyllene** ($C_{15}H_{24}$): Bicyclic sesquiterpene synthesized in glandular trichomes.
  - **Rubisco Catalytic Site** ($L_8S_8$ hexadecameric core).
- **The Calvin-Benson Cycle**: 5-step interactive enzymatic reaction engine tracking ATP/NADPH consumption and triose phosphate regeneration.

### 4. Comparative Botanical Anatomy (`/comparative`)
- **Monocots vs. Eudicots**: Atactostele scattered bundles vs. Eustele ring vascular arrangement.
- **C3 vs. C4 vs. CAM**: Photorespiration suppression, Kranz wreath anatomy, and nocturnal malic acid accumulation.
- **Hydrophytes vs. Xerophytes**: Honeycomb Aerenchyma tissue vs. Sunken stomatal crypts.

### 5. Botanical Encyclopedia (`/encyclopedia`)
- Comprehensive glossary of histological and cytological terms with Greek/Latin etymology, physiological significance, and related taxa.

---

## 🌿 Curated Botanical Specimen Collection

1. ***Monstera Deliciosa*** (Tropical Araceae) — Lamina fenestration, geniculum pulvinus, calcium oxalate raphides.
2. ***Cannabis Sativa*** (Cannabaceae) — Capitate-stalked glandular trichomes, bast fiber cellulose, phytocannabinoids.
3. ***Sequoia Sempervirens*** (Coast Redwood) — 115m hydraulic limits, border-pitted torus-margo valves, fireproof tannin bark.
4. ***Arabidopsis Thaliana*** (Brassicaceae) — Genetic model, puzzle-piece pavement cells, myrosinase 'mustard bomb'.
5. ***Dionaea Muscipula*** (Venus Flytrap) — 100ms snap-trap bi-stability, mechanosensory trigger hairs, digestive acidic fluid.
6. ***Ginkgo Biloba*** (Ginkgoaceae) — Living fossil, open dichotomous venation, bilobalide & ginkgolides.

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Installation
```bash
git clone https://github.com/ankoi132/phytocosm.git
cd phytocosm
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```
frasssssssss
---

## ⚡ Deployment on Vercel

This repository is optimized for one-click deployment on [Vercel](https://vercel.com):
1. Import this repository into Vercel.
2. Framework Preset: **Next.js**.
3. Build Command: `next build`.
4. Output Directory: `.next`.
5. Deploy!
