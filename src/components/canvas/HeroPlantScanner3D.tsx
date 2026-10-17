"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { sound } from "@/utils/audio";

export default function HeroPlantScanner3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030704, 0.055);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.2, 5.2);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for the entire rotating specimen
    const specimenGroup = new THREE.Group();
    scene.add(specimenGroup);

    // 1. Organic Stem System
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.0, 0),
      new THREE.Vector3(0.08, -1.0, 0.04),
      new THREE.Vector3(-0.06, 0.0, -0.05),
      new THREE.Vector3(0.12, 1.0, 0.08),
      new THREE.Vector3(0.0, 1.8, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 64, 0.07, 16, false);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.5,
      clearcoatRoughness: 0.2,
      emissive: 0x052e16,
      emissiveIntensity: 0.4,
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    specimenGroup.add(stemMesh);

    // 2. Multi-tier Broad Organic Leaves
    const leafGeom = new THREE.CylinderGeometry(0.02, 0.75, 1.8, 32, 16, false);
    // Sculpt leaf shape by deforming vertices
    const pos = leafGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const factor = Math.sin(((y + 0.9) / 1.8) * Math.PI);
      pos.setX(i, pos.getX(i) * factor * 1.6);
      pos.setZ(i, pos.getZ(i) * 0.12 * factor);
    }
    leafGeom.computeVertexNormals();

    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.3,
      metalness: 0.05,
      transmission: 0.35, // Subsurface light transmission
      thickness: 0.5,
      clearcoat: 0.7,
      clearcoatRoughness: 0.2,
      emissive: 0x064e3b,
      emissiveIntensity: 0.3,
      side: THREE.DoubleSide,
    });

    const leafConfigs = [
      { y: 0.2, rotY: 0, rotZ: 0.65, scale: 1.1 },
      { y: 0.6, rotY: Math.PI * 0.7, rotZ: 0.6, scale: 0.95 },
      { y: 1.0, rotY: Math.PI * 1.4, rotZ: 0.55, scale: 0.8 },
      { y: -0.4, rotY: Math.PI * 0.35, rotZ: 0.75, scale: 1.25 },
      { y: -0.8, rotY: Math.PI * 1.1, rotZ: 0.7, scale: 1.3 },
      { y: 1.5, rotY: Math.PI * 0.2, rotZ: 0.35, scale: 0.65 },
    ];

    leafConfigs.forEach((cfg) => {
      const leaf = new THREE.Mesh(leafGeom, leafMat);
      leaf.position.y = cfg.y;
      leaf.rotation.y = cfg.rotY;
      leaf.rotation.z = cfg.rotZ;
      leaf.scale.set(cfg.scale, cfg.scale, cfg.scale);
      specimenGroup.add(leaf);
    });

    // 3. Volumetric Scanning Ring Plane (Cinematic laser tomography)
    const scanRingGeom = new THREE.RingGeometry(1.6, 1.72, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.65,
    });
    const scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);

    // Inner scanning disk
    const scanDiskGeom = new THREE.CircleGeometry(1.6, 64);
    const scanDiskMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.08,
      blending: THREE.AdditiveBlending,
    });
    const scanDisk = new THREE.Mesh(scanDiskGeom, scanDiskMat);
    scanDisk.rotation.x = Math.PI / 2;
    scene.add(scanDisk);

    // 4. Bioluminescent Floating Spores / Nanoparticles
    const particleCount = 280;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.2;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.0;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
      particleSpeeds[i] = 0.003 + Math.random() * 0.008;
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.045,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.2);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xecfdf5, 2.5);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimCyanLight = new THREE.PointLight(0x06b6d4, 3.5, 8);
    rimCyanLight.position.set(-3, 1, -2);
    scene.add(rimCyanLight);

    const emeraldGlow = new THREE.PointLight(0x10b981, 2.5, 6);
    emeraldGlow.position.set(0, -1, 2);
    scene.add(emeraldGlow);

    // Mouse / Touch Interactivity
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      sound.playScanTone();
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      targetRotY += deltaX * 0.008;
      targetRotX += deltaY * 0.004;
      targetRotX = Math.max(-0.4, Math.min(0.4, targetRotX));
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    // Animation Loop
    let clock = new THREE.Clock();
    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Specimen idle rotation + user drag interpolation
      specimenGroup.rotation.y += 0.004;
      specimenGroup.rotation.y += (targetRotY - specimenGroup.rotation.y) * 0.05;
      specimenGroup.rotation.x += (targetRotX - specimenGroup.rotation.x) * 0.05;

      // Laser scanning ring oscillation
      const scanY = Math.sin(elapsed * 1.5) * 1.6;
      scanRing.position.y = scanY;
      scanDisk.position.y = scanY;
      scanRing.rotation.z += 0.008;

      // Particle floating drift
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 2.2) {
          positions[i * 3 + 1] = -2.0;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] md:h-[640px] cursor-grab active:cursor-grabbing select-none">
      <div ref={mountRef} className="w-full h-full" />
      {/* HUD Scanner Data Overlay */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs uppercase tracking-widest text-emerald-400 font-mono">
            Holographic Scanner // Live 3D Stream
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          Tomography: 120 Slice Planes / s | λ = 532 nm Laser
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none text-right font-mono text-[11px] text-emerald-400/80">
        <div>ORBIT: Drag to inspect 360°</div>
        <div>VASCULAR FLUX: Active (8.4 μL/min)</div>
      </div>
    </div>
  );
}
