import React from "react";
import Link from "next/link";
import { Leaf, Globe, ExternalLink } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-emerald-500/20 py-10 px-4 lg:px-8 mt-24 text-zinc-400 font-mono text-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <span className="font-bold text-zinc-200 tracking-wider">
              PHYTOCOSM 3D // DIGITAL BOTANICAL RESEARCH
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 max-w-md">
            Interactive real-time 3D microscopic dissection, cellular organelle cytology, and organic plant biochemistry visualization engine built with Next.js, Three.js, and WebGL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-[11px]">
          <Link
            href="/specimens"
            className="hover:text-emerald-400 transition-colors"
          >
            Specimens Directory
          </Link>
          <Link
            href="/cytology"
            className="hover:text-emerald-400 transition-colors"
          >
            Plant Cell 3D
          </Link>
          <Link
            href="/biochemistry"
            className="hover:text-emerald-400 transition-colors"
          >
            Biochemistry Lab
          </Link>
          <Link
            href="/comparative"
            className="hover:text-emerald-400 transition-colors"
          >
            Comparative Anatomy
          </Link>
          <Link
            href="/encyclopedia"
            className="hover:text-emerald-400 transition-colors"
          >
            Glossary
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 text-[10px]">
            Ready for Vercel Deploy
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto border-t border-emerald-500/10 mt-6 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-zinc-500">
        <div>© 2026 Phytocosm. Open-Access Botanical Data & Cytological Visualizations.</div>
        <div>Engineered for WebGL 2.0 & High-DPI Displays</div>
      </div>
    </footer>
  );
}
