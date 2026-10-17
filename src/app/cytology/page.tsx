"use client";

import React, { useState } from "react";
import PlantCell3D from "@/components/canvas/PlantCell3D";
import { CELL_ORGANELLES, Organelle } from "@/data/cellOrganelles";
import { sound } from "@/utils/audio";
import {
  Dna,
  Zap,
  Activity,
  Layers,
  Sparkles,
  Info,
  Maximize2,
  Atom,
  Clock,
  Eye,
  EyeOff,
} from "lucide-react";

export default function CytologyPage() {
  const [selectedOrganelle, setSelectedOrganelle] = useState<Organelle>(CELL_ORGANELLES[1]); // Default to Chloroplast
  const [isCellWallCutaway, setIsCellWallCutaway] = useState<boolean>(true);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            <Dna className="w-4 h-4" />
            <span>Cytological Plant Cell Mega-Lab</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Eukaryotic Plant Cell in 3D
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2 font-mono">
            Interactive real-time model of plant cytological architecture. Click or select any organelle to zoom, inspect membrane structures, and trace bioenergetic ATP & photosynthetic flux.
          </p>
        </div>

        {/* Quick Cutaway Toggle */}
        <button
          onClick={() => {
            setIsCellWallCutaway(!isCellWallCutaway);
            sound.playSliceClick();
          }}
          className="px-4 py-2 rounded-xl glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300 hover:bg-cyan-950/40 flex items-center gap-2 transition-all"
        >
          {isCellWallCutaway ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{isCellWallCutaway ? "Cutaway Mode: Active (90% Opacity)" : "Opaque Cell Wall"}</span>
        </button>
      </div>

      {/* Main 3D Viewport & Organelle Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Viewport */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <PlantCell3D
            selectedOrganelle={selectedOrganelle}
            onSelectOrganelle={(org) => {
              setSelectedOrganelle(org);
              sound.playInspectChime();
            }}
            isCellWallCutaway={isCellWallCutaway}
          />

          {/* Organelle Quick Jump Selector Grid */}
          <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 flex flex-col gap-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-zinc-400">
              Select Organelle to Inspect & Orbit Focus
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {CELL_ORGANELLES.map((org) => (
                <button
                  key={org.id}
                  onClick={() => {
                    setSelectedOrganelle(org);
                    sound.playInspectChime();
                  }}
                  className={`p-2.5 rounded-xl text-left border text-xs transition-all ${
                    selectedOrganelle.id === org.id
                      ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-md shadow-cyan-500/10 scale-102"
                      : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  <div className="font-bold truncate">{org.name}</div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    Vol: {org.volumePercent}%
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deep Organelle Readout & Biochemical Machinery */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <div className="glass-panel-glow p-6 rounded-2xl border border-cyan-400/40 flex flex-col gap-4 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {selectedOrganelle.category} Organelle
              </span>
              <span className="text-xs text-zinc-400">
                {selectedOrganelle.diameterUm}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">
                {selectedOrganelle.name}
              </h2>
              <div className="text-xs italic text-zinc-400">
                {selectedOrganelle.scientificTerm}
              </div>
            </div>

            <p className="text-xs font-sans text-zinc-300 leading-relaxed">
              {selectedOrganelle.description}
            </p>

            <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs">
              <span className="font-bold text-cyan-300 block mb-1">
                Biochemical & Energetic Function:
              </span>
              <p className="font-sans text-zinc-300 leading-relaxed text-[11px]">
                {selectedOrganelle.biochemicalFunction}
              </p>
            </div>

            {/* Metabolic Reactions */}
            <div className="flex flex-col gap-2">
              <div className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                Active Metabolic Reactions
              </div>
              <ul className="space-y-1 text-[11px] font-sans text-zinc-300 list-disc list-inside">
                {selectedOrganelle.metabolicReactions.map((reaction, i) => (
                  <li key={i}>{reaction}</li>
                ))}
              </ul>
            </div>

            {/* Key Catalytic Enzymes */}
            <div className="flex flex-col gap-2 pt-2 border-t border-cyan-500/20">
              <div className="text-xs uppercase tracking-wider text-amber-400 font-bold">
                Key Proteins & Enzymes
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedOrganelle.keyProteinsAndEnzymes.map((enz, i) => (
                  <span
                    key={i}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-emerald-500/20 text-zinc-300"
                  >
                    {enz}
                  </span>
                ))}
              </div>
            </div>

            {/* Symbiogenetic Evolutionary Origin */}
            <div className="p-3 rounded-xl bg-zinc-900/60 border border-emerald-500/15 text-[11px] text-zinc-400">
              <span className="font-bold text-zinc-200 block mb-0.5">
                Evolutionary Origin:
              </span>
              <p className="font-sans text-[11px] leading-relaxed">
                {selectedOrganelle.evolutionaryOrigin}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
