"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Biomolecule } from "@/data/biochemistry";

interface Props {
  molecule: Biomolecule;
}

export default function MoleculeViewer3D({ molecule }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

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
    camera.position.set(0, 1.5, 7.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffffff, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight2.position.set(-5, -5, -3);
    scene.add(dirLight2);

    const molGroup = new THREE.Group();
    scene.add(molGroup);

    // 3. Atom Spheres
    molecule.atoms.forEach((atom) => {
      const atomGeom = new THREE.SphereGeometry(atom.radius * 1.1, 24, 24);
      const atomMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(atom.color),
        roughness: 0.25,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
      });
      const atomMesh = new THREE.Mesh(atomGeom, atomMat);
      atomMesh.position.set(...atom.position);
      molGroup.add(atomMesh);
    });

    // 4. Bond Cylinders
    const bondMat = new THREE.MeshPhysicalMaterial({
      color: 0x64748b,
      roughness: 0.35,
      metalness: 0.2,
    });

    molecule.bonds.forEach(([idxA, idxB]) => {
      const atomA = molecule.atoms[idxA];
      const atomB = molecule.atoms[idxB];
      if (!atomA || !atomB) return;

      const posA = new THREE.Vector3(...atomA.position);
      const posB = new THREE.Vector3(...atomB.position);
      const distance = posA.distanceTo(posB);
      const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);

      const bondGeom = new THREE.CylinderGeometry(0.06, 0.06, distance, 12);
      const bondMesh = new THREE.Mesh(bondGeom, bondMat);

      bondMesh.position.copy(midPoint);
      bondMesh.quaternion.setFromUnitVectors(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3().subVectors(posB, posA).normalize()
      );

      molGroup.add(bondMesh);
    });

    // Center geometry around origin
    const box = new THREE.Box3().setFromObject(molGroup);
    const center = box.getCenter(new THREE.Vector3());
    molGroup.position.sub(center);

    // 5. Animation Loop
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
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [molecule]);

  return (
    <div className="relative w-full h-[420px] md:h-[500px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute bottom-3 left-4 flex items-center gap-3 font-mono text-[11px] text-zinc-400">
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
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 inline-block" /> Magnesium (Mg)
        </span>
      </div>
    </div>
  );
}
