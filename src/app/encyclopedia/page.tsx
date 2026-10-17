"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GLOSSARY_ENTRIES, GlossaryEntry } from "@/data/encyclopedia";
import { sound } from "@/utils/audio";
import {
  BookOpen,
  Search,
  Filter,
  ExternalLink,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function EncyclopediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Histology", "Cytology", "Physiology", "Biochemistry", "Morphology"];

  const filteredEntries = GLOSSARY_ENTRIES.filter((entry) => {
    const matchesSearch =
      entry.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.botanicalSignificance.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || entry.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Botanical Encyclopedia</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Cytology & Histology Glossary
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2 font-mono">
            Scientific taxonomy, cell wall mechanics, vascular fluid dynamics, and biochemical terminology with etymological roots.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search terms, etymologies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-emerald-400"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              sound.playSliceClick();
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
              selectedCategory === cat
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200 hover:bg-emerald-950/40"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Glossary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEntries.map((entry, idx) => (
          <div
            key={idx}
            className="glass-panel hover:glass-panel-glow p-6 rounded-2xl border border-emerald-500/20 flex flex-col justify-between gap-4 transition-all"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                  {entry.category}
                </span>
                <span className="text-[10px] font-mono italic text-zinc-500">
                  {entry.etymology}
                </span>
              </div>

              <h2 className="text-xl font-bold text-white pt-1">{entry.term}</h2>

              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {entry.definition}
              </p>

              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/15 text-[11px] text-zinc-400 font-mono space-y-1">
                <span className="text-emerald-400 font-bold block text-[10px] uppercase">
                  Biological Significance:
                </span>
                <p className="font-sans text-zinc-300 leading-relaxed">
                  {entry.botanicalSignificance}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-emerald-500/15 font-mono text-[11px]">
              <span className="text-zinc-500 block text-[10px] uppercase mb-1">
                Related Botanical Taxa:
              </span>
              <div className="flex flex-wrap gap-1">
                {entry.relatedSpecies.map((sp, sIdx) => (
                  <span
                    key={sIdx}
                    className="text-[10px] px-2 py-0.5 rounded bg-zinc-900 border border-emerald-500/20 text-zinc-300"
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
