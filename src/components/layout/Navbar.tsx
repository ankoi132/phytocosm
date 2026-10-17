"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sound } from "@/utils/audio";
import {
  Leaf,
  Layers,
  Dna,
  Atom,
  Scale,
  BookOpen,
  Volume2,
  VolumeX,
  Search,
  ChevronDown,
} from "lucide-react";
import { PLANT_SPECIMENS } from "@/data/plants";

export default function Navbar() {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playSliceClick();
    }
  };

  const navLinks = [
    { href: "/specimens", label: "Specimens", icon: Layers },
    { href: "/cytology", label: "Cytology (Cell 3D)", icon: Dna },
    { href: "/biochemistry", label: "Biochemistry", icon: Atom },
    { href: "/comparative", label: "Comparative", icon: Scale },
    { href: "/encyclopedia", label: "Encyclopedia", icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b border-emerald-500/20 px-4 lg:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            onClick={() => sound.playSliceClick()}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Leaf className="w-5 h-5 text-zinc-950 fill-zinc-950" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono font-black text-lg tracking-wider text-emerald-400 group-hover:text-emerald-300 transition-colors">
                PHYTOCOSM<span className="text-zinc-500">.3D</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-500/70">
                Botanical Cytology Lab
              </span>
            </div>
          </Link>

          {/* Telemetry pill */}
          <div className="hidden xl:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span>WebGL 3D Core Active</span>
          </div>
        </div>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || pathname?.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => sound.playSliceClick()}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono tracking-wide transition-all ${
                  isActive
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm shadow-emerald-500/10"
                    : "text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-zinc-500"}`} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Quick Specimen Switcher & Sound Toggle */}
        <div className="flex items-center gap-3">
          {/* Specimen quick jump dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setIsDropdownOpen(!isDropdownOpen);
                sound.playSliceClick();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-mono bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 border border-emerald-500/30 transition-colors"
            >
              <span>Dissect Specimen</span>
              <ChevronDown className="w-3.5 h-3.5 text-emerald-400" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 glass-panel-glow rounded-xl p-2 z-50 flex flex-col gap-1 border border-emerald-500/30 shadow-2xl animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1 text-[10px] font-mono uppercase text-zinc-400 border-b border-emerald-500/20">
                  Select Botanical Specimen
                </div>
                {PLANT_SPECIMENS.map((plant) => (
                  <Link
                    key={plant.id}
                    href={`/specimens/${plant.id}`}
                    onClick={() => {
                      setIsDropdownOpen(false);
                      sound.playInspectChime();
                    }}
                    className="flex flex-col px-2.5 py-1.5 rounded-lg hover:bg-emerald-500/20 transition-colors group"
                  >
                    <span className="text-xs font-bold text-zinc-200 group-hover:text-emerald-300">
                      {plant.commonName}
                    </span>
                    <span className="text-[10px] italic text-zinc-400 font-mono">
                      {plant.scientificName}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Audio Synthesizer Toggle */}
          <button
            onClick={toggleSound}
            title={isMuted ? "Unmute bio-synthesizer audio" : "Mute audio"}
            className="p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-400 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-zinc-500" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>
        </div>
      </div>
    </header>
  );
}
