"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PLANT_SPECIMENS, PlantSpecimen, HotspotPin } from "@/data/plants";
import PlantDissection3D, { DissectionControlsHandle } from "@/components/canvas/PlantDissection3D";
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
  Sun,
  Camera,
  Compass,
  Zap,
  Leaf,
} from "lucide-react";

interface Props {
  id: string;
}

export default function SpecimenDissectionClient({ id }: Props) {
  const specimen = PLANT_SPECIMENS.find((s) => s.id === id);

  if (!specimen) {
    notFound();
  }

  const dissectionRef = useRef<DissectionControlsHandle>(null);

  // Dissection States
  const [dissectionDepth, setDissectionDepth] = useState<number>(0);
  const [sliceAxis, setSliceAxis] = useState<"transverse" | "longitudinal">("transverse");
  const [isExploded, setIsExploded] = useState<boolean>(false);
  const [showVascularFlow, setShowVascularFlow] = useState<boolean>(true);
  const [renderMode, setRenderMode] = useState<"organic" | "bioluminescent" | "xray" | "wireframe">("organic");
  const [selectedHotspot, setSelectedHotspot] = useState<HotspotPin | null>(null);
  const [activeTab, setActiveTab] = useState<"histology" | "phytochemistry" | "biomechanics" | "adaptation">("histology");

  // Dynamic Biomechanical Simulation States
  const [turgorPressureMPa, setTurgorPressureMPa] = useState<number>(0.7);
  const [sunAzimuthDeg, setSunAzimuthDeg] = useState<number>(45);
  const [autumnProgress, setAutumnProgress] = useState<number>(0.0);
  const [isTrapSnapped, setIsTrapSnapped] = useState<boolean>(false);

  // Layer Isolation
  const [layerVisibility, setLayerVisibility] = useState({
    cuticle: true,
    mesophyll: true,
    xylem: true,
    phloem: true,
    pith: true,
  });

  const toggleLayer = (key: keyof typeof layerVisibility) => {
    sound.playSliceClick();
    setLayerVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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

        {/* Snapshot Capture Action Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => dissectionRef.current?.captureSnapshot()}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-md shadow-emerald-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>Export 3D Snapshot</span>
          </button>
        </div>
      </div>

      {/* Main 3D Dissection Viewport & Interactive Controls Deck */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 3D Viewport & Advanced Dissection Toolbar */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <PlantDissection3D
            ref={dissectionRef}
            specimen={specimen}
            selectedHotspot={selectedHotspot}
            onSelectHotspot={setSelectedHotspot}
            dissectionDepth={dissectionDepth}
            sliceAxis={sliceAxis}
            isExploded={isExploded}
            showVascularFlow={showVascularFlow}
            renderMode={renderMode}
            turgorPressureMPa={turgorPressureMPa}
            sunAzimuthDeg={sunAzimuthDeg}
            autumnProgress={autumnProgress}
            layerVisibility={layerVisibility}
          />

          {/* Advanced Dissection & Physics Deck */}
          <div className="glass-panel p-5 rounded-2xl border border-emerald-500/25 flex flex-col gap-5">
            {/* 1. Real-time Dissection Slider & Axis Toggle */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Scissors className="w-4 h-4" />
                  <span>Interactive Dissection Cutting Plane</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSliceAxis("transverse");
                      sound.playSliceClick();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      sliceAxis === "transverse"
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                        : "border-emerald-500/15 text-zinc-400"
                    }`}
                  >
                    Transverse Cut
                  </button>
                  <button
                    onClick={() => {
                      setSliceAxis("longitudinal");
                      sound.playSliceClick();
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all ${
                      sliceAxis === "longitudinal"
                        ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                        : "border-emerald-500/15 text-zinc-400"
                    }`}
                  >
                    Longitudinal Split
                  </button>
                </div>
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

              <div className="flex justify-between text-[10px] font-mono text-zinc-400">
                <span>0% Intact Surface</span>
                <span className="text-emerald-400 font-bold">
                  {dissectionDepth === 0 ? "Off" : `Cut Depth: ${dissectionDepth}%`}
                </span>
                <span>100% Core Axis</span>
              </div>
            </div>

            {/* 2. Biomechanical Simulators (Turgor Pressure & Sun Phototropism) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-emerald-500/15">
              {/* Turgor Pressure Slider */}
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-cyan-400 font-bold text-[11px]">
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Turgor Pressure Simulator</span>
                  </span>
                  <span className="text-zinc-300 font-bold">{turgorPressureMPa.toFixed(2)} MPa</span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.5"
                  step="0.05"
                  value={turgorPressureMPa}
                  onChange={(e) => setTurgorPressureMPa(Number(e.target.value))}
                  className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>0.0 (Wilted Droop)</span>
                  <span>0.7 (Normal)</span>
                  <span>1.5 (High Turgidity)</span>
                </div>
              </div>

              {/* Sun Azimuth Phototropism Slider */}
              <div className="flex flex-col gap-1.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Solar Phototropism Vector</span>
                  </span>
                  <span className="text-zinc-300 font-bold">{sunAzimuthDeg}° Azimuth</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="5"
                  value={sunAzimuthDeg}
                  onChange={(e) => setSunAzimuthDeg(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-500">
                  <span>0° (North)</span>
                  <span>90° (East)</span>
                  <span>180° (South)</span>
                  <span>270° (West)</span>
                </div>
              </div>
            </div>

            {/* 3. Specimen-Specific Interactive Actions */}
            {specimen.id === "dionaea-muscipula" && (
              <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs">
                <div>
                  <span className="font-bold text-red-400 flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>Dionaea Carnivorous Snap-Trap Mechanism</span>
                  </span>
                  <p className="text-[11px] text-zinc-300 font-sans mt-0.5">
                    Click trigger hairs in 3D or trigger mechanical action potential to snap bivalve lobes shut in 100ms.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      dissectionRef.current?.triggerSnapTrap();
                      setIsTrapSnapped(true);
                    }}
                    className="px-3.5 py-2 rounded-lg bg-red-500 hover:bg-red-400 text-zinc-950 font-bold transition-all shadow-md shadow-red-500/30"
                  >
                    ⚡ Trigger Snap
                  </button>
                  <button
                    onClick={() => {
                      dissectionRef.current?.resetSnapTrap();
                      setIsTrapSnapped(false);
                    }}
                    className="px-3.5 py-2 rounded-lg glass-panel hover:bg-emerald-950/50 text-emerald-300 border border-emerald-500/30 transition-all"
                  >
                    🔄 Re-Arm Trap
                  </button>
                </div>
              </div>
            )}

            {specimen.id === "ginkgo-biloba" && (
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/30 flex flex-col gap-2 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-amber-400 flex items-center gap-2">
                    <Leaf className="w-4 h-4 text-amber-400" />
                    <span>Ginkgo Autumn Foliage Carotenoid Transition</span>
                  </span>
                  <span className="text-zinc-300 font-bold">
                    {Math.round(autumnProgress * 100)}% Golden Foliage
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.02"
                  value={autumnProgress}
                  onChange={(e) => setAutumnProgress(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-1.5 bg-emerald-950 rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-zinc-400">
                  <span>Spring/Summer Photosynthetic Chlorophyll Green</span>
                  <span>Autumn Carotenoid Golden Yellow</span>
                </div>
              </div>
            )}

            {/* 4. Tissue Layer Isolation Switches */}
            <div className="flex flex-col gap-2 pt-3 border-t border-emerald-500/15 font-mono text-xs">
              <span className="text-zinc-400 text-[11px] font-bold uppercase tracking-wider">
                Isolate Anatomical Tissue Strata:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => toggleLayer("cuticle")}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    layerVisibility.cuticle
                      ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                      : "opacity-40 border-zinc-700 text-zinc-500"
                  }`}
                >
                  ✓ Cuticle & Epidermis
                </button>
                <button
                  onClick={() => toggleLayer("mesophyll")}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    layerVisibility.mesophyll
                      ? "bg-emerald-500/30 border-emerald-400 text-emerald-300"
                      : "opacity-40 border-zinc-700 text-zinc-500"
                  }`}
                >
                  ✓ Mesophyll Chlorenchyma
                </button>
                <button
                  onClick={() => toggleLayer("xylem")}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    layerVisibility.xylem
                      ? "bg-cyan-500/30 border-cyan-400 text-cyan-300"
                      : "opacity-40 border-zinc-700 text-zinc-500"
                  }`}
                >
                  ✓ Xylem Conduits
                </button>
                <button
                  onClick={() => toggleLayer("phloem")}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    layerVisibility.phloem
                      ? "bg-amber-500/30 border-amber-400 text-amber-300"
                      : "opacity-40 border-zinc-700 text-zinc-500"
                  }`}
                >
                  ✓ Phloem Sieve Tubes
                </button>
                <button
                  onClick={() => toggleLayer("pith")}
                  className={`px-3 py-1 rounded-lg text-xs border transition-all ${
                    layerVisibility.pith
                      ? "bg-yellow-500/30 border-yellow-400 text-yellow-300"
                      : "opacity-40 border-zinc-700 text-zinc-500"
                  }`}
                >
                  ✓ Central Pith
                </button>
              </div>
            </div>

            {/* 5. Camera Angle Presets & Render Styles */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-emerald-500/15 font-mono text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-zinc-500 text-[10px] uppercase">Camera Presets:</span>
                <button
                  onClick={() => dissectionRef.current?.setCameraPreset("macro")}
                  className="px-2.5 py-1 rounded-lg glass-panel hover:bg-emerald-950/40 text-zinc-300 border border-emerald-500/20 text-[11px]"
                >
                  Macro
                </button>
                <button
                  onClick={() => dissectionRef.current?.setCameraPreset("crossSection")}
                  className="px-2.5 py-1 rounded-lg glass-panel hover:bg-emerald-950/40 text-zinc-300 border border-emerald-500/20 text-[11px]"
                >
                  Cross-Section
                </button>
                <button
                  onClick={() => dissectionRef.current?.setCameraPreset("leafSurface")}
                  className="px-2.5 py-1 rounded-lg glass-panel hover:bg-emerald-950/40 text-zinc-300 border border-emerald-500/20 text-[11px]"
                >
                  Leaf Micro
                </button>
                <button
                  onClick={() => dissectionRef.current?.setCameraPreset("topDown")}
                  className="px-2.5 py-1 rounded-lg glass-panel hover:bg-emerald-950/40 text-zinc-300 border border-emerald-500/20 text-[11px]"
                >
                  Top-Down
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={renderMode}
                  onChange={(e) => {
                    setRenderMode(e.target.value as any);
                    sound.playSliceClick();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-xs font-mono text-emerald-300 focus:outline-none"
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
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                {selectedHotspot.description}
              </p>

              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/20 text-xs font-mono space-y-1">
                <div className="text-zinc-400 text-[11px]">
                  {selectedHotspot.detailData.metric}:
                </div>
                <div className="text-emerald-300 font-bold text-sm">
                  {selectedHotspot.detailData.value}
                </div>
                <div className="text-zinc-400 text-[11px] pt-1 border-t border-emerald-500/15 font-sans">
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
                Click any of the pulsating glowing pins in the 3D viewport or select below to zoom directly onto micro-structures.
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
