"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PLANT_SPECIMENS } from "@/data/plants";
import { sound } from "@/utils/audio";
import {
  Layers,
  Search,
  Filter,
  ArrowRight,
  Droplet,
  Zap,
  Activity,
  Sparkles,
} from "lucide-react";

export default function SpecimensPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClade, setSelectedClade] = useState<string>("all");

  const filteredSpecimens = PLANT_SPECIMENS.filter((specimen) => {
    const matchesSearch =
      specimen.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.scientificName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      specimen.family.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClade =
      selectedClade === "all" ||
      specimen.clade.toLowerCase().includes(selectedClade.toLowerCase());

    return matchesSearch && matchesClade;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-12 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-500/20 pb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            <Layers className="w-4 h-4" />
            <span>Botanical Specimen Directory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Biological Specimens & 3D Dissection
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2">
            Select a plant to enter the virtual micro-dissection suite. Slice through tissue strata, inspect vascular flow dynamics, and analyze specialized secondary metabolites.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search species, family..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <select
            value={selectedClade}
            onChange={(e) => setSelectedClade(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-zinc-300 focus:outline-none focus:border-emerald-400"
          >
            <option value="all">All Clades</option>
            <option value="monocot">Monocotyledons</option>
            <option value="eudicot">Eudicotyledons</option>
            <option value="gymnosperm">Gymnosperms</option>
          </select>
        </div>
      </div>

      {/* Specimens Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSpecimens.map((specimen, idx) => (
          <div
            key={specimen.id}
            className="glass-panel hover:glass-panel-glow rounded-2xl p-6 border border-emerald-500/20 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {specimen.family}
                </span>
                <span className="text-[10px] font-mono text-zinc-400">
                  {specimen.photosynthesisType} Photosynthesis
                </span>
              </div>

              {/* Title & Scientific Name */}
              <h2 className="text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                {specimen.commonName}
              </h2>
              <p className="text-xs italic text-zinc-400 font-mono mb-4">
                {specimen.scientificName}
              </p>

              {/* Overview excerpt */}
              <p className="text-xs text-zinc-300 leading-relaxed mb-6 line-clamp-3">
                {specimen.overview}
              </p>

              {/* Quick Biometrics Badges */}
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/15 mb-6">
                <div>
                  <span className="text-zinc-500 block">Cellulose</span>
                  <span className="text-emerald-400 font-bold">
                    {specimen.primaryMetabolites.cellulosePercent}% Dry Wt
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Lignin</span>
                  <span className="text-amber-400 font-bold">
                    {specimen.primaryMetabolites.ligninPercent}% Dry Wt
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Tissue Layers</span>
                  <span className="text-cyan-400 font-bold">
                    {specimen.histologicalLayers.length} Strata
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block">3D Hotspots</span>
                  <span className="text-purple-400 font-bold">
                    {specimen.hotspots.length} Anatomical Pins
                  </span>
                </div>
              </div>
            </div>

            {/* Launch CTA */}
            <Link
              href={`/specimens/${specimen.id}`}
              onClick={() => sound.playInspectChime()}
              className="w-full py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 group-hover:text-zinc-950 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              <span>Dissect in 3D</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
