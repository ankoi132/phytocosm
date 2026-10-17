"use client";

import React, { useState } from "react";
import MoleculeViewer3D from "@/components/canvas/MoleculeViewer3D";
import { BIOMOLECULES, CALVIN_CYCLE_STEPS, Biomolecule } from "@/data/biochemistry";
import { sound } from "@/utils/audio";
import {
  Atom,
  Zap,
  Activity,
  Sun,
  Layers,
  ArrowRight,
  Flame,
  CheckCircle,
} from "lucide-react";

export default function BiochemistryPage() {
  const [selectedMolecule, setSelectedMolecule] = useState<Biomolecule>(BIOMOLECULES[0]);
  const [activeCalvinStep, setActiveCalvinStep] = useState<number>(1);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-emerald-500/20 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
            <Atom className="w-4 h-4" />
            <span>Biochemical & Molecular Laboratory</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            Plant Organic Molecules & Pathways
          </h1>
          <p className="text-zinc-400 text-sm max-w-2xl mt-2 font-mono">
            Explore 3D atomic structures of key plant metabolites, photosynthetic pigments, and the step-by-step enzymatic reactions of the Calvin-Benson carbon cycle.
          </p>
        </div>
      </div>

      {/* 1. 3D Molecule Viewer Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Molecule Viewport */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <MoleculeViewer3D molecule={selectedMolecule} />

          {/* Molecule Selector Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs">
            {BIOMOLECULES.map((mol) => (
              <button
                key={mol.id}
                onClick={() => {
                  setSelectedMolecule(mol);
                  sound.playInspectChime();
                }}
                className={`p-3 rounded-xl text-left border transition-all ${
                  selectedMolecule.id === mol.id
                    ? "bg-amber-500/20 border-amber-400 text-amber-300 shadow-md shadow-amber-500/10 scale-102"
                    : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <div className="font-bold truncate">{mol.name}</div>
                <div className="text-[10px] text-zinc-500 truncate">{mol.formula}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Molecular Profile Readout */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="glass-panel-amber p-6 rounded-2xl border border-amber-500/30 flex flex-col gap-4 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-widest text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                Class: {selectedMolecule.class}
              </span>
              <span className="text-zinc-400">{selectedMolecule.molecularWeight}</span>
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">{selectedMolecule.name}</h2>
              <div className="text-emerald-400 text-sm font-bold mt-0.5">
                {selectedMolecule.formula}
              </div>
            </div>

            <p className="text-zinc-300 font-sans text-xs leading-relaxed">
              {selectedMolecule.description}
            </p>

            <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/20 space-y-2">
              <div>
                <span className="text-amber-400 font-bold block mb-0.5">
                  Biosynthetic Site:
                </span>
                <span className="text-zinc-300 font-sans text-[11px]">
                  {selectedMolecule.biosyntheticLocation}
                </span>
              </div>
              <div>
                <span className="text-amber-400 font-bold block mb-0.5">
                  Biological Role:
                </span>
                <span className="text-zinc-300 font-sans text-[11px]">
                  {selectedMolecule.biologicalRole}
                </span>
              </div>
              {selectedMolecule.absorptionPeaksNm && (
                <div>
                  <span className="text-amber-400 font-bold block mb-0.5">
                    Photon Absorption Peaks:
                  </span>
                  <span className="text-cyan-300 font-bold text-[11px]">
                    {selectedMolecule.absorptionPeaksNm}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-400">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Rotational drag active. Inspect atom valence geometries.</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Calvin-Benson Cycle Interactive Step-by-Step Pathway */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/25 flex flex-col gap-6">
        <div>
          <div className="text-xs uppercase font-mono tracking-widest text-emerald-400 mb-1">
            Photosynthetic Carbon Assimilation
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">
            The Calvin-Benson Cycle Reaction Engine
          </h2>
          <p className="text-xs font-mono text-zinc-400 mt-1 max-w-2xl">
            Tracing the light-independent enzymatic fixation of atmospheric CO₂ into organic triose phosphate sugars inside the chloroplast stroma.
          </p>
        </div>

        {/* Step Buttons Tracker */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {CALVIN_CYCLE_STEPS.map((step) => (
            <button
              key={step.stepNumber}
              onClick={() => {
                setActiveCalvinStep(step.stepNumber);
                sound.playSliceClick();
              }}
              className={`p-3 rounded-xl text-left border font-mono transition-all ${
                activeCalvinStep === step.stepNumber
                  ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/10 scale-102"
                  : "bg-zinc-900/50 border-emerald-500/15 text-zinc-400 hover:text-zinc-200"
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="text-emerald-500 font-bold">Step {step.stepNumber}</span>
                {activeCalvinStep === step.stepNumber && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                )}
              </div>
              <div className="text-xs font-bold text-white truncate">{step.name}</div>
              <div className="text-[10px] text-zinc-500 truncate">{step.phase}</div>
            </button>
          ))}
        </div>

        {/* Active Step Detailed Card */}
        {(() => {
          const step = CALVIN_CYCLE_STEPS.find((s) => s.stepNumber === activeCalvinStep)!;
          return (
            <div className="p-6 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    {step.phase}
                  </span>
                  <span className="text-zinc-400 text-sm font-bold">Step {step.stepNumber} of 5</span>
                </div>
                <h3 className="text-xl font-bold text-white">{step.name}</h3>

                <div className="space-y-2 pt-2">
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/20">
                    <span className="text-zinc-500 block text-[10px]">Reactants In:</span>
                    <span className="text-cyan-300 font-bold text-xs">{step.reactants}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-900/80 border border-emerald-500/20">
                    <span className="text-zinc-500 block text-[10px]">Products Out:</span>
                    <span className="text-emerald-300 font-bold text-xs">{step.products}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="space-y-3">
                  <div>
                    <span className="text-amber-400 block text-[10px] font-bold uppercase tracking-wider mb-1">
                      Catalytic Enzyme:
                    </span>
                    <span className="text-zinc-100 font-bold text-sm">{step.catalystEnzyme}</span>
                  </div>

                  <div>
                    <span className="text-zinc-500 block text-[10px] uppercase tracking-wider mb-1">
                      Energetic Flux:
                    </span>
                    <span className="text-pink-400 font-bold text-xs">{step.energyConsumedOrProduced}</span>
                  </div>

                  <div className="pt-2 border-t border-emerald-500/15">
                    <span className="text-zinc-400 block text-[10px] uppercase tracking-wider mb-1">
                      Physiological Significance:
                    </span>
                    <p className="font-sans text-zinc-300 text-xs leading-relaxed">
                      {step.physiologicalSignificance}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>
    </div>
  );
}
