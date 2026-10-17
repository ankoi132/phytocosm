"use client";

import React, { useState } from "react";
import Link from "next/link";
import HeroPlantScanner3D from "@/components/canvas/HeroPlantScanner3D";
import { PLANT_SPECIMENS } from "@/data/plants";
import { sound } from "@/utils/audio";
import {
  Sparkles,
  Layers,
  Dna,
  Atom,
  Scale,
  ArrowRight,
  ShieldAlert,
  Zap,
  Activity,
  Droplets,
  Gauge,
  Cpu,
} from "lucide-react";

export default function HomePage() {
  const [activeSpecimenIdx, setActiveSpecimenIdx] = useState(0);
  const activeSpecimen = PLANT_SPECIMENS[activeSpecimenIdx];

  return (
    <div className="w-full flex flex-col items-center">
      {/* 1. Cinematic Hero Section */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center px-4 lg:px-8 pt-8 pb-16 overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          {/* Left Column: Mission Statement & Key Metrics */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono w-fit">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Next-Gen Botanical Cytology & Dissection Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
              Deconstruct <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                Plant Biology
              </span>{" "}
              in Real-Time 3D.
            </h1>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl">
              From sub-micron organelle biochemistry to long-distance xylem hydraulic tension.
              Phytocosm empowers botanists, researchers, and students to micro-dissect organic plant
              structures with dynamic 3D cutting planes, simulated vascular flows, and molecular inspection.
            </p>

            {/* Live Specimen Telemetry Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="glass-panel p-3 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-mono mb-1">
                  <Activity className="w-3.5 h-3.5" />
                  <span>Xylem Flux</span>
                </div>
                <div className="text-lg font-bold font-mono text-zinc-100">4.8 × 10⁻⁴</div>
                <div className="text-[10px] text-zinc-500 font-mono">kg m⁻¹ s⁻¹ MPa⁻¹</div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono mb-1">
                  <Droplets className="w-3.5 h-3.5" />
                  <span>Turgor Pressure</span>
                </div>
                <div className="text-lg font-bold font-mono text-zinc-100">0.72 MPa</div>
                <div className="text-[10px] text-zinc-500 font-mono">Palisade Parenchyma</div>
              </div>

              <div className="glass-panel p-3 rounded-xl border border-emerald-500/20 col-span-2 sm:col-span-1">
                <div className="flex items-center gap-1.5 text-amber-400 text-xs font-mono mb-1">
                  <Gauge className="w-3.5 h-3.5" />
                  <span>Photosystems</span>
                </div>
                <div className="text-lg font-bold font-mono text-zinc-100">98.2% Eff.</div>
                <div className="text-[10px] text-zinc-500 font-mono">Quantum Yield PSII</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="/specimens"
                onClick={() => sound.playInspectChime()}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-500/25 transition-all hover:scale-105"
              >
                <span>Launch 3D Dissection Lab</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/cytology"
                onClick={() => sound.playSliceClick()}
                className="px-6 py-3 rounded-xl glass-panel hover:bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold font-mono text-xs uppercase tracking-wider transition-all"
              >
                Explore Plant Cell 3D
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive 3D Holographic Scanner */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center">
            <HeroPlantScanner3D />
          </div>
        </div>
      </section>

      {/* 2. Interactive Specimen Showcase Carousel */}
      <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-20 border-t border-emerald-500/15">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-1">
              Specimen Directory // 6 Botanical Systems
            </div>
            <h2 className="text-3xl font-black text-white">
              Selected Evolutionary Adaptations
            </h2>
          </div>
          <p className="text-xs font-mono text-zinc-400 max-w-md">
            Click any specimen below to inspect its internal vascular architecture, tissue layers, and secondary metabolite synthesis.
          </p>
        </div>

        {/* Specimen Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {PLANT_SPECIMENS.map((specimen, idx) => (
            <button
              key={specimen.id}
              onClick={() => {
                setActiveSpecimenIdx(idx);
                sound.playSliceClick();
              }}
              className={`p-3 rounded-xl text-left transition-all border font-mono ${
                activeSpecimenIdx === idx
                  ? "glass-panel-glow border-emerald-400 text-emerald-300 scale-102"
                  : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200 hover:border-emerald-500/40"
              }`}
            >
              <div className="text-[10px] text-emerald-500 font-bold uppercase mb-1">
                SP-0{idx + 1}
              </div>
              <div className="text-xs font-bold truncate text-white">
                {specimen.commonName}
              </div>
              <div className="text-[10px] text-zinc-500 italic truncate">
                {specimen.scientificName}
              </div>
            </button>
          ))}
        </div>

        {/* Featured Specimen Active Spotlight Panel */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/30 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
                {activeSpecimen.family}
              </span>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                {activeSpecimen.photosynthesisType} Photosynthesis
              </span>
              <span className="text-zinc-500 text-xs font-mono">
                {activeSpecimen.clade}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white">
              {activeSpecimen.commonName}{" "}
              <span className="text-base font-normal italic text-zinc-400">
                ({activeSpecimen.scientificName})
              </span>
            </h3>

            <p className="text-zinc-300 text-sm leading-relaxed">
              {activeSpecimen.overview}
            </p>

            <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300 leading-relaxed">
              <span className="font-bold text-emerald-400 block mb-1">
                Evolutionary Innovation:
              </span>
              {activeSpecimen.evolutionaryAdaptation}
            </div>

            {/* Primary Metabolites breakdown bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                <span>Cell Wall Dry Mass Composition</span>
                <span className="text-emerald-400">
                  {activeSpecimen.primaryMetabolites.cellulosePercent}% Cellulose |{" "}
                  {activeSpecimen.primaryMetabolites.ligninPercent}% Lignin
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-zinc-800 overflow-hidden flex">
                <div
                  style={{ width: `${activeSpecimen.primaryMetabolites.cellulosePercent}%` }}
                  className="bg-emerald-500"
                  title="Cellulose"
                />
                <div
                  style={{ width: `${activeSpecimen.primaryMetabolites.ligninPercent}%` }}
                  className="bg-amber-600"
                  title="Lignin"
                />
                <div
                  style={{ width: `${activeSpecimen.primaryMetabolites.hemicellulosePercent}%` }}
                  className="bg-cyan-500"
                  title="Hemicellulose"
                />
                <div
                  style={{ width: `${activeSpecimen.primaryMetabolites.pectinPercent}%` }}
                  className="bg-pink-500"
                  title="Pectin"
                />
              </div>
            </div>

            <div className="pt-2">
              <Link
                href={`/specimens/${activeSpecimen.id}`}
                onClick={() => sound.playInspectChime()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold font-mono text-xs uppercase tracking-wider transition-all"
              >
                <span>Enter 3D Dissection Chamber</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: Key Phytochemicals */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="text-xs font-mono uppercase tracking-wider text-emerald-400 pb-2 border-b border-emerald-500/20">
              Active Phytochemical Compounds
            </div>
            {activeSpecimen.keyPhytochemicals.map((chem, i) => (
              <div
                key={i}
                className="p-3 rounded-xl bg-zinc-900/60 border border-emerald-500/15 flex flex-col gap-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-zinc-100">{chem.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {chem.formula}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-snug">{chem.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Biological Laboratories Cards Grid */}
      <section className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-20 border-t border-emerald-500/15">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-2">
            Integrated Scientific Modules
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Explore Botany Across All Dimensions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Module 1: Dissection */}
          <Link
            href="/specimens"
            onClick={() => sound.playSliceClick()}
            className="group glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">
                3D Tissue Dissection
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Slice dynamically through plant stems and leaves. Observe Xylem conduits, Phloem sieve tubes, and palisade mesophyll in real-time.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 pt-6">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 2: Cytology */}
          <Link
            href="/cytology"
            onClick={() => sound.playSliceClick()}
            className="group glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
                <Dna className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                Plant Cell Cytology 3D
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inspect double-membrane chloroplasts with internal thylakoid grana discs, central vacuoles, and plasmodesmata communication channels.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 pt-6">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 3: Biochemistry */}
          <Link
            href="/biochemistry"
            onClick={() => sound.playSliceClick()}
            className="group glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
                <Atom className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                Biochemistry & Molecules
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Interact with 3D atomic models of Chlorophyll a, Cellulose, and Terpenes. Trace the 5 phases of the Calvin-Benson carbon cycle.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-amber-400 pt-6">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Module 4: Comparative */}
          <Link
            href="/comparative"
            onClick={() => sound.playSliceClick()}
            className="group glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                Comparative Anatomy
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Analyze structural adaptations: Monocot Atactostele vs. Dicot Eustele, and C3 vs. C4 Kranz anatomy vs. Desert CAM succulent strategies.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono text-purple-400 pt-6">
              <span>Launch Module</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
