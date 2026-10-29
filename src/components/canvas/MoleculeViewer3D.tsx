"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Biomolecule } from "@/data/biochemistry";
import { sound } from "@/utils/audio";

interface Props {
  molecule: Biomolecule;
}

interface AtomHoverData {
  element: string;
  name: string;
  radiusPm: number;
  hybridization: string;
  electronegativity: number;
  screenPos: { x: number; y: number };
}

export default function MoleculeViewer3D({ molecule }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<"ballAndStick" | "spaceFilling">("ballAndStick");
  const [hoveredAtom, setHoveredAtom] = useState<AtomHoverData | null>(null);

  const atomMeshesRef = useRef<{ mesh: THREE.Mesh; atom: typeof molecule.atoms[0] }[]>([]);
  const bondMeshesRef = useRef<THREE.Mesh[]>([]);

  // Update scale of atoms based on viewMode (ball and stick vs van der Waals space filling)
  useEffect(() => {
    atomMeshesRef.current.forEach(({ mesh, atom }) => {
      const targetScale = viewMode === "spaceFilling" ? (atom.element === "Mg" ? 2.4 : 2.0) : 1.0;
      mesh.scale.set(targetScale, targetScale, targetScale);
    });
    bondMeshesRef.current.forEach((bond) => {
      bond.visible = viewMode === "ballAndStick";
    });
  }, [viewMode]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030704);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.4, 7.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.9;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.2);
    dirLight1.position.set(5, 6, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.6);
    dirLight2.position.set(-5, -5, -3);
    scene.add(dirLight2);

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    atomMeshesRef.current = [];
    bondMeshesRef.current = [];

    // 3. Atom Spheres with Material Subsurface sheen
    molecule.atoms.forEach((atom) => {
      const atomGeom = new THREE.SphereGeometry(atom.radius * 1.05, 32, 32);
      const isMg = atom.element === "Mg";

      const atomMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(atom.color),
        roughness: isMg ? 0.15 : 0.25,
        metalness: isMg ? 0.35 : 0.08,
        clearcoat: 0.85,
        clearcoatRoughness: 0.15,
        emissive: isMg ? 0x22c55e : (atom.element === "O" ? 0x7f1d1d : 0x0f172a),
        emissiveIntensity: isMg ? 0.6 : 0.2,
      });
      const atomMesh = new THREE.Mesh(atomGeom, atomMat);
      atomMesh.position.set(...atom.position);
      molGroup.add(atomMesh);

      atomMeshesRef.current.push({ mesh: atomMesh, atom });
    });

    // 4. Bond Cylinders
    const bondMat = new THREE.MeshPhysicalMaterial({
      color: 0x64748b,
      roughness: 0.3,
      metalness: 0.25,
      clearcoat: 0.5,
    });

    molecule.bonds.forEach(([idxA, idxB]) => {
      const atomA = molecule.atoms[idxA];
      const atomB = molecule.atoms[idxB];
      if (!atomA || !atomB) return;

      const posA = new THREE.Vector3(...atomA.position);
      const posB = new THREE.Vector3(...atomB.position);
      const distance = posA.distanceTo(posB);
      const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

      const bondGeom = new THREE.CylinderGeometry(0.055, 0.055, distance, 16);
      const bondMesh = new THREE.Mesh(bondGeom, bondMat);

      bondMesh.position.copy(midPoint);
      bondMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(posB, posA).normalize()
      );

      molGroup.add(bondMesh);
      bondMeshesRef.current.push(bondMesh);
    });

    // Center geometry around origin
    const box = new THREE.Box3().setFromObject(molGroup);
    const center = box.getCenter(new THREE.Vector3());
    molGroup.position.sub(center);

    // 5. Raycaster for Atom Hover Tooltips
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshes = atomMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshes, false);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const found = atomMeshesRef.current.find((item) => item.mesh === hit);
        if (found) {
          const el = found.atom.element;
          const elementData: Record<string, { name: string; radiusPm: number; hybridization: string; electronegativity: number }> = {
            C: { name: "Carbon", radiusPm: 77, hybridization: "sp² / sp³", electronegativity: 2.55 },
            O: { name: "Oxygen", radiusPm: 73, hybridization: "sp³ bent", electronegativity: 3.44 },
            N: { name: "Nitrogen", radiusPm: 75, hybridization: "sp² planar", electronegativity: 3.04 },
            Mg: { name: "Magnesium", radiusPm: 160, hybridization: "Coordination core (Mg²⁺)", electronegativity: 1.31 },
            H: { name: "Hydrogen", radiusPm: 37, hybridization: "1s", electronegativity: 2.20 },
          };
          const meta = elementData[el] || { name: el, radiusPm: 80, hybridization: "sp", electronegativity: 2.0 };
          setHoveredAtom({
            element: el,
            name: meta.name,
            radiusPm: meta.radiusPm,
            hybridization: meta.hybridization,
            electronegativity: meta.electronegativity,
            screenPos: { x: e.clientX - rect.left, y: e.clientY - rect.top },
          });
          return;
        }
      }
      setHoveredAtom(null);
    };

    renderer.domElement.addEventListener("mousemove", onPointerMove);

    // 6. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("mousemove", onPointerMove);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [molecule]);

  return (
    <div className="relative w-full h-[440px] md:h-[520px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Right View Mode Toggle */}
      <div className="absolute top-4 right-4 flex items-center gap-2 font-mono text-xs z-10">
        <button
          onClick={() => {
            setViewMode("ballAndStick");
            sound.playSliceClick();
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            viewMode === "ballAndStick"
              ? "bg-amber-500/30 border-amber-400 text-amber-300 shadow-md"
              : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Ball & Stick
        </button>
        <button
          onClick={() => {
            setViewMode("spaceFilling");
            sound.playSliceClick();
          }}
          className={`px-3 py-1.5 rounded-lg border transition-all ${
            viewMode === "spaceFilling"
              ? "bg-amber-500/30 border-amber-400 text-amber-300 shadow-md"
              : "glass-panel border-emerald-500/20 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          van der Waals (CPK)
        </button>
      </div>

      {/* Atom Hover Tooltip */}
      {hoveredAtom && (
        <div
          className="absolute pointer-events-none glass-panel-glow px-3 py-2 rounded-xl border border-amber-400/50 text-xs font-mono text-zinc-100 z-20 space-y-0.5"
          style={{
            left: `${hoveredAtom.screenPos.x + 12}px`,
            top: `${hoveredAtom.screenPos.y - 40}px`,
          }}
        >
          <div className="text-amber-400 font-bold flex items-center gap-2">
            <span>{hoveredAtom.name} ({hoveredAtom.element})</span>
          </div>
          <div className="text-[10px] text-zinc-400">
            Radius: <span className="text-zinc-200">{hoveredAtom.radiusPm} pm</span> | EN: <span className="text-zinc-200">{hoveredAtom.electronegativity}</span>
          </div>
          <div className="text-[10px] text-cyan-300">
            Orbital: {hoveredAtom.hybridization}
          </div>
        </div>
      )}

      {/* Element Color Key Bar */}
      <div className="absolute bottom-3 left-4 flex flex-wrap items-center gap-3 font-mono text-[11px] text-zinc-400 pointer-events-none">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-500 inline-block" /> Carbon (C)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Oxygen (O)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Nitrogen (N)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block shadow-sm shadow-green-400/50" /> Magnesium (Mg²⁺)
        </span>
      </div>
    </div>
  );
}
