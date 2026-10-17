"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLANT_SPECIMENS, PlantSpecimen, HotspotPin } from "@/data/plants";
import PlantDissection3D from "@/components/canvas/PlantDissection3D";
import { sound } from "@/utils/audio";
import {
  Layers,
  Scissors,
  Split,
  Eye,
  Activity,
  Droplet,
  Gauge,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  Info,
  Maximize2,
  Atom,
  RotateCcw,
} from "lucide-react";

interface Props {
  id: string;
}

export default function SpecimenDissectionClient({ id }: Props) {
  const specimen = PLANT_SPECIMENS.find((s) => s.id === id);

  if (!specimen) {
    notFound();
  }

  // State for 3D dissection controls
  const [dissectionDepth, setDissectionDepth] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [showVascularFlow, setShowVascularFlow] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<"organic" | "bioluminescent" | "xray" | "wireframe">("organic");
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [activeTab, setActiveTab] = useState<"histology" | "phytochemistry" | "biomechanics" | "adaptation">("histology");

  const currentIdx = PLANT_SPECIMENS.findIndex((s) => s.id === specimen.id);
  const prevSpecimen = PLANT_SPECIMENS[(currentIdx - 1 + PLANT_SPECIMENS.length) % PLANT_SPECIMENS.length];
  const nextSpecimen = PLANT_SPECIMENS[(currentIdx + 1) % PLANT_SPECIMENS.length];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 lg:px-8 py-8 flex flex-col gap-8">
      {/* Top Breadcrumb & Specimen Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-500/20 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/specimens"
            onClick={() => sound.playSliceClick()}
            className="flex items-center gap-1 text-xs font-mono text-zinc-400 hover:text-emerald-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Directory</span>
          </Link>
          <span className="text-zinc-600">/</span>
          <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">
            {specimen.commonName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/specimens/${prevSpecimen.id}`}
            onClick={() => sound.playSliceClick()}
            className="px-3 py-1.5 rounded-lg glass-panel text-xs font-mono text-zinc-300 hover:text-emerald-300 border border-emerald-500/20 transition-colors"
          >
            ← {prevSpecimen.commonName}
          </Link>
          <Link
            href={`/specimens/${nextSpecimen.id}`}
            onClick={() => sound.playSliceClick()}
            className="px-3 py-1.5 rounded-lg glass-panel text-xs font-mono text-zinc-300 hover:text-emerald-300 border border-emerald-500/20 transition-colors"
          >
            {nextSpecimen.commonName} →
          </Link>
        </div>
      </div>

      {/* Specimen Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-mono border border-emerald-500/30">
              {specimen.family}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-xs font-mono border border-cyan-500/30">
              {specimen.photosynthesisType} Photosynthesis
            </span>
            <span className="text-xs font-mono text-zinc-400">
              {specimen.clade}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            {specimen.commonName}
          </h1>
          <p className="text-sm italic font-mono text-zinc-400">
            {specimen.scientificName} — Habitat: {specimen.habitat}
          </p>
        </div>
      </div>

      {/* Main 3D Dissection Viewport & Interactive Controls Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Viewport & HUD Controls */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <PlantDissection3D
            specimen={specimen}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            dissectionDepth={dissectionDepth}
            isExploded={isExploded}
            showVascularFlow={showVascularFlow}
            renderMode={renderMode}
          />

          {/* Dissection Controls Toolbar */}
          <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-emerald-500/25 flex flex-col gap-4">
            {/* Real-time Dissection Slider */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Scissors className="w-4 h-4" />
                  <span>Dissection Slice Depth</span>
                </span>
                <span className="text-zinc-300 font-mono">
                  {dissectionDepth === 0 ? "Surface Intact (0%)" : `Transverse Cut: ${dissectionDepth}%`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={dissectionDepth}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setDissectionDepth(val);
                  if (Math.abs(val - dissectionDepth) > 5) {
                    sound.playSliceClick();
                  }
                }}
                className="w-full accent-emerald-400 cursor-pointer h-2 bg-emerald-950 rounded-lg"
              />
              <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                <span>0% Upper Epicuticle</span>
                <span>50% Vascular Core (Xylem/Phloem)</span>
                <span>100% Complete Stem Section</span>
              </div>
            </div>

            {/* Quick Toggle Controls */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-emerald-500/15">
              {/* Exploded View Toggle */}
              <button
                onClick={() => {
                  setIsExploded(!isExploded);
                  sound.playSliceClick();
                }}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                  isExploded
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Split className="w-3.5 h-3.5" />
                <span>Exploded View</span>
              </button>

              {/* Vascular Flow Toggle */}
              <button
                onClick={() => {
                  setShowVascularFlow(!showVascularFlow);
                  sound.playFluidsPulse();
                }}
                className={`p-2.5 rounded-xl border text-xs font-mono flex items-center justify-center gap-2 transition-all ${
                  showVascularFlow
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300"
                    : "glass-panel border-cyan-500/20 text-zinc-400 hover:text-zinc-200"
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Vascular Flow</span>
              </button>

              {/* Reset View */}
              <button
                onClick={() => {
                  setDissectionDepth(0);
                  setIsExploded(false);
                  setSelectedHotspot(null);
                  sound.playSliceClick();
                }}
                className="p-2.5 rounded-xl glass-panel border border-emerald-500/20 text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset View</span>
              </button>

              {/* Render Style Cycle */}
              <div className="flex items-center gap-1">
                <select
                  value={renderMode}
                  onChange={(e) => {
                    setRenderMode(e.target.value as any);
                    sound.playSliceClick();
                  }}
                  className="w-full px-2.5 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 focus:outline-none focus:border-emerald-400"
                >
                  <option value="organic">Organic Realistic</option>
                  <option value="bioluminescent">Bioluminescent</option>
                  <option value="xray">X-Ray Radiography</option>
                  <option value="wireframe">Wireframe Mesh</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Hotspots & Selected Anatomy Inspector */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Active Hotspot Inspector Card */}
          {selectedHotspot ? (
            <div className="glass-panel-glow p-5 rounded-2xl border border-emerald-400 flex flex-col gap-3 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
                  {selectedHotspot.category} Hotspot
                </span>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-zinc-400 hover:text-zinc-200 text-xs font-mono"
                >
                  Close ×
                </button>
              </div>

              <h3 className="text-lg font-bold text-white">
                {selectedHotspot.title}
              </h3>
              <p className="text-xs text-zinc-300 leading-relaxed">
                {selectedHotspot.description}
              </p>

              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono space-y-1">
                <div className="text-zinc-400 text-[11px]">
                  {selectedHotspot.detailData.metric}:
                </div>
                <div className="text-emerald-300 font-bold text-sm">
                  {selectedHotspot.detailData.value}
                </div>
                <div className="text-zinc-400 text-[11px] pt-1 border-t border-emerald-500/15">
                  {selectedHotspot.detailData.significance}
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-4 rounded-2xl border border-emerald-500/20 text-xs font-mono text-zinc-400">
              <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
                <Info className="w-4 h-4" />
                <span>3D Anatomical Hotspots</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed mb-3">
                Click any of the pulsating glowing pins in the 3D viewport or select from the list below to zoom directly onto micro-structures.
              </p>
              <div className="flex flex-col gap-2">
                {specimen.hotspots.map((pin) => (
                  <button
                    key={pin.id}
                    onClick={() => {
                      setSelectedHotspot(pin);
                      sound.playInspectChime();
                    }}
                    className="p-2 rounded-xl text-left hover:bg-emerald-500/20 border border-emerald-500/15 transition-colors flex items-center justify-between"
                  >
                    <span className="font-bold text-zinc-200">{pin.label}</span>
                    <span className="text-[10px] text-emerald-400 uppercase">
                      {pin.category}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Vascular Biomechanics Live Telemetry Card */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/20 flex flex-col gap-3 font-mono">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-bold border-b border-emerald-500/20 pb-2">
              Vascular Biomechanics Telemetry
            </div>

            <div className="flex flex-col gap-2 text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px]">Xylem Hydraulic Conductivity</span>
                <span className="text-cyan-400 font-bold">{specimen.vascularBiomechanics.xylemConductivity}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Phloem Osmotic Sieve Pressure</span>
                <span className="text-amber-400 font-bold">{specimen.vascularBiomechanics.phloemOsmoticPressure}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Transpiration Water Loss Flux</span>
                <span className="text-emerald-400 font-bold">{specimen.vascularBiomechanics.transpirationRate}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">Parenchyma Hydrostatic Turgor</span>
                <span className="text-emerald-300 font-bold">{specimen.vascularBiomechanics.turgorPressure}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Tab Analysis Deck (Histology, Phytochemistry, Adaptation) */}
      <section className="glass-panel rounded-2xl p-6 sm:p-8 border border-emerald-500/25 mt-4">
        {/* Tab Headers */}
        <div className="flex flex-wrap items-center gap-2 border-b border-emerald-500/20 pb-4 mb-6">
          <button
            onClick={() => {
              setActiveTab("histology");
              sound.playSliceClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "histology"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-emerald-950/30"
            }`}
          >
            Histological Strata ({specimen.histologicalLayers.length} Layers)
          </button>

          <button
            onClick={() => {
              setActiveTab("phytochemistry");
              sound.playSliceClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "phytochemistry"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-emerald-950/30"
            }`}
          >
            Phytochemistry & Secondary Metabolites
          </button>

          <button
            onClick={() => {
              setActiveTab("adaptation");
              sound.playSliceClick();
            }}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
              activeTab === "adaptation"
                ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-emerald-950/30"
            }`}
          >
            Evolutionary Innovation
          </button>
        </div>

        {/* Tab 1: Histological Layers */}
        {activeTab === "histology" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specimen.histologicalLayers.map((layer) => (
              <div
                key={layer.id}
                className="p-5 rounded-xl bg-zinc-900/50 border border-emerald-500/15 flex flex-col gap-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-300">
                    {layer.name}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                    {layer.depthRangeUm}
                  </span>
                </div>
                <div className="text-[11px] italic text-zinc-500">
                  {layer.scientificTerm}
                </div>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed pt-1">
                  {layer.description}
                </p>
                <div className="pt-2 text-[11px] space-y-1 text-zinc-400 border-t border-emerald-500/10">
                  <div>
                    <span className="text-zinc-500">Chloroplast Density: </span>
                    <span className="text-emerald-400 font-bold">{layer.chloroplastDensity}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500">Physiological Role: </span>
                    <span className="text-zinc-300 font-sans">{layer.physiologicalRole}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Phytochemistry */}
        {activeTab === "phytochemistry" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specimen.keyPhytochemicals.map((chem, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-zinc-900/50 border border-emerald-500/15 flex flex-col gap-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-300">
                    {chem.name}
                  </span>
                  <span className="text-[11px] font-bold text-cyan-400">
                    {chem.formula}
                  </span>
                </div>
                <div className="text-[10px] uppercase tracking-wider text-amber-400">
                  Class: {chem.category}
                </div>
                <p className="text-zinc-300 font-sans text-xs leading-relaxed pt-1">
                  {chem.role}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Adaptation */}
        {activeTab === "adaptation" && (
          <div className="flex flex-col gap-4 font-mono text-xs">
            <div className="p-6 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 leading-relaxed font-sans text-sm">
              <span className="font-bold text-emerald-400 block text-base font-mono mb-2">
                Specialized Biomechanical Adaptation
              </span>
              {specimen.evolutionaryAdaptation}
            </div>

            <div className="p-6 rounded-xl bg-zinc-900/40 border border-emerald-500/15 text-zinc-300 leading-relaxed font-sans text-xs">
              <span className="font-bold text-zinc-200 block text-sm font-mono mb-2">
                Habitat & Ecological Niche
              </span>
              {specimen.overview}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
