"use client";

import React, { useState } from "react";
import { COMPARATIVE_DATA } from "@/data/comparative";
import { sound } from "@/utils/audio";
import {
  Scale,
  GitCompare,
  Droplet,
  Sun,
  Layers,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

export default function ComparativePage() {
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState<number>(0);
  const activeCategory = COMPARATIVE_DATA[selectedCategoryIdx];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-purple-400 mb-2">
            <Scale className="w-4 h-4" />
            <span>Evolutionary & Structural Biology</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Comparative Botanical Anatomy
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2 font-mono">
            Direct side-by-side contrast of divergent vascular arrangements, photosynthetic carbon pumps, and tissue hydromorphology.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs">
        {COMPARATIVE_DATA.map((cat, idx) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategoryIdx(idx);
              sound.playSliceClick();
            }}
            className={`p-4 rounded-2xl text-left border transition-all flex flex-col gap-1 ${
              selectedCategoryIdx === idx
                ? "glass-panel-glow border-purple-400 text-purple-300 scale-102"
                : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            <div className="text-[10px] text-purple-400 font-bold uppercase">
              Comparison 0{idx + 1}
            </div>
            <div className="text-sm font-bold text-white truncate">{cat.title}</div>
            <div className="text-[11px] text-zinc-500 line-clamp-1">{cat.subtitle}</div>
          </button>
        ))}
      </div>

      {/* Active Comparison Framework Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-purple-500/20 font-mono text-xs text-zinc-300 leading-relaxed">
        <span className="text-purple-400 font-bold block mb-1">Theoretical Context:</span>
        <p className="font-sans text-sm">{activeCategory.description}</p>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className={`grid grid-cols-1 ${activeCategory.items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"} gap-6`}>
        {activeCategory.items.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-between gap-6 transition-all"
          >
            <div className="space-y-4">
              <div>
                <div className="text-[10px] font-mono text-purple-400 uppercase tracking-wider mb-1">
                  Morphotype Group
                </div>
                <h3 className="text-2xl font-black text-white">{item.name}</h3>
                <div className="text-xs font-mono italic text-zinc-400 mt-0.5">
                  {item.scientificGroup}
                </div>
              </div>

              {/* Stem & Vascular Anatomy */}
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-emerald-500/15 space-y-2 font-mono text-xs">
                <div>
                  <span className="text-purple-400 font-bold block text-[10px] uppercase">
                    Stem Stele Architecture:
                  </span>
                  <p className="font-sans text-zinc-300 text-[11px] leading-relaxed">
                    {item.stemAnatomy}
                  </p>
                </div>

                <div>
                  <span className="text-cyan-400 font-bold block text-[10px] uppercase">
                    Leaf & Venation Morphology:
                  </span>
                  <p className="font-sans text-zinc-300 text-[11px] leading-relaxed">
                    {item.leafAnatomy}
                  </p>
                </div>

                <div>
                  <span className="text-amber-400 font-bold block text-[10px] uppercase">
                    Vascular Cambium Potential:
                  </span>
                  <p className="font-sans text-zinc-300 text-[11px] leading-relaxed">
                    {item.vascularArrangement}
                  </p>
                </div>
              </div>

              {/* Key Diagnostic Points List */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-zinc-300 uppercase tracking-wider block">
                  Diagnostic Hallmarks:
                </span>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  {item.keyDifferencePoints.map((point, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Water Use Efficiency */}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs font-mono">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase mb-0.5">
                  Water-Use Efficiency (WUE):
                </span>
                <p className="font-sans text-zinc-300 text-[11px] leading-relaxed">
                  {item.waterUseEfficiency}
                </p>
              </div>
            </div>

            {/* Representative Species */}
            <div className="pt-4 border-t border-emerald-500/15 font-mono text-xs">
              <span className="text-zinc-500 block text-[10px] uppercase mb-1">
                Representative Flora:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {item.representativeSpecies.map((sp, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-emerald-500/20 text-emerald-300"
                  >
                    {sp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
