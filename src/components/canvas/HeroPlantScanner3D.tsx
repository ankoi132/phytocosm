"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { sound } from "@/utils/audio";
import { getLeafMicroTexture } from "@/utils/proceduralTextures";

function applyOrganicCurvature(
  geom: THREE.BufferGeometry,
  droopFactor: number = 0.2,
  cupFactor: number = 0.08,
  waveFactor: number = 0.018
) {
  const pos = geom.attributes.position;
  geom.computeBoundingBox();
  const bbox = geom.boundingBox!;
  const height = bbox.max.y - bbox.min.y || 1.0;
  const minY = bbox.min.y;

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    const progressY = Math.max(0, Math.min(1, (y - minY) / height));
    const droop = -droopFactor * Math.pow(progressY, 2.2);
    const cup = cupFactor * Math.pow(x, 2);
    const wave = Math.sin(progressY * 12) * waveFactor * Math.abs(x);

    pos.setZ(i, z + droop + cup + wave);
  }
  geom.computeVertexNormals();
}

export default function HeroPlantScanner3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030704, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 1.1, 5.0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Group for the entire rotating holographic specimen
    const specimenGroup = new THREE.Group();
    scene.add(specimenGroup);

    // 1. Organic Stem System
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -2.0, 0),
      new THREE.Vector3(0.08, -1.0, 0.04),
      new THREE.Vector3(-0.06, 0.0, -0.04),
      new THREE.Vector3(0.1, 1.0, 0.06),
      new THREE.Vector3(0.0, 1.8, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 64, 0.075, 16, false);
    const stemMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      emissive: 0x052e16,
      emissiveIntensity: 0.45,
    });
    const stemMesh = new THREE.Mesh(stemGeom, stemMat);
    specimenGroup.add(stemMesh);

    // 2. High-Fidelity Extruded Monstera Leaves with Fenestration Holes & Organic Curvature
    const leafMicro = getLeafMicroTexture();
    const leafMat = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      roughness: 0.26,
      metalness: 0.05,
      transmission: 0.38,
      thickness: 0.6,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
      bumpMap: leafMicro.bump,
      bumpScale: 0.012,
      emissive: 0x064e3b,
      emissiveIntensity: 0.35,
      side: THREE.DoubleSide,
    });

    const leafConfigs = [
      { y: 0.3, rotY: 0, rotZ: 0.65, scale: 0.85 },
      { y: 0.8, rotY: Math.PI * 0.7, rotZ: 0.6, scale: 0.75 },
      { y: 1.2, rotY: Math.PI * 1.4, rotZ: 0.55, scale: 0.65 },
      { y: -0.3, rotY: Math.PI * 0.35, rotZ: 0.75, scale: 0.95 },
      { y: -0.8, rotY: Math.PI * 1.1, rotZ: 0.7, scale: 1.0 },
      { y: 1.6, rotY: Math.PI * 0.2, rotZ: 0.4, scale: 0.55 },
    ];

    leafConfigs.forEach((cfg) => {
      const leafAssembly = new THREE.Group();

      const leafShape = new THREE.Shape();
      leafShape.moveTo(0, 0);
      leafShape.bezierCurveTo(0.35, 0.25, 0.75, 0.65, 0.68, 1.25);
      leafShape.bezierCurveTo(0.6, 1.65, 0.25, 2.05, 0, 2.3);
      leafShape.bezierCurveTo(-0.25, 2.05, -0.6, 1.65, -0.68, 1.25);
      leafShape.bezierCurveTo(-0.75, 0.65, -0.35, 0.25, 0, 0);

      // Fenestration cutouts
      const holeConfigs = [
        { x: 0.22, y: 0.7, rx: 0.06, ry: 0.16, rot: 0.2 },
        { x: 0.28, y: 1.2, rx: 0.08, ry: 0.22, rot: 0.15 },
        { x: -0.22, y: 0.7, rx: 0.06, ry: 0.16, rot: -0.2 },
        { x: -0.28, y: 1.2, rx: 0.08, ry: 0.22, rot: -0.15 },
      ];

      holeConfigs.forEach((h) => {
        const holePath = new THREE.Path();
        holePath.absellipse(h.x, h.y, h.rx, h.ry, 0, Math.PI * 2, true, h.rot);
        leafShape.holes.push(holePath);
      });

      const leafGeom = new THREE.ExtrudeGeometry(leafShape, {
        depth: 0.015,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 1,
        bevelSize: 0.006,
        bevelThickness: 0.006,
      });

      // Apply organic curvature
      applyOrganicCurvature(leafGeom, 0.22, 0.08, 0.016);

      const leafMesh = new THREE.Mesh(leafGeom, leafMat);
      leafMesh.rotation.x = -Math.PI / 2.3;
      leafAssembly.add(leafMesh);

      // Midrib
      const midribMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.025, 2.2, 10),
        new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.35 })
      );
      midribMesh.position.set(0, 1.1, 0.02);
      leafMesh.add(midribMesh);

      leafAssembly.position.y = cfg.y;
      leafAssembly.rotation.y = cfg.rotY;
      leafAssembly.rotation.z = cfg.rotZ;
      leafAssembly.scale.set(cfg.scale, cfg.scale, cfg.scale);

      specimenGroup.add(leafAssembly);
    });

    // 3. Volumetric Scanning Ring Plane (Cinematic laser tomography)
    const scanRingGeom = new THREE.RingGeometry(1.65, 1.76, 64);
    const scanRingMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.75,
    });
    const scanRing = new THREE.Mesh(scanRingGeom, scanRingMat);
    scanRing.rotation.x = Math.PI / 2;
    scene.add(scanRing);

    // Inner scanning glowing disk
    const scanDiskGeom = new THREE.CircleGeometry(1.65, 64);
    const scanDiskMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.09,
      blending: THREE.AdditiveBlending,
    });
    const scanDisk = new THREE.Mesh(scanDiskGeom, scanDiskMat);
    scanDisk.rotation.x = Math.PI / 2;
    scene.add(scanDisk);

    // Second counter-rotating telemetry ring
    const telemetryRingGeom = new THREE.RingGeometry(1.85, 1.88, 48);
    const telemetryRingMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const telemetryRing = new THREE.Mesh(telemetryRingGeom, telemetryRingMat);
    telemetryRing.rotation.x = Math.PI / 2;
    scene.add(telemetryRing);

    // 4. Bioluminescent Floating Spores / Nanoparticles
    const particleCount = 320;
    const particleGeom = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const radius = 0.5 + Math.random() * 2.4;
      particlePositions[i * 3] = Math.cos(theta) * radius;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 4.2;
      particlePositions[i * 3 + 2] = Math.sin(theta) * radius;
      particleSpeeds[i] = 0.004 + Math.random() * 0.009;
    }
    particleGeom.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.048,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeom, particleMat);
    scene.add(particleSystem);

    // 5. Lighting Setup
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.3);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xecfdf5, 2.6);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    const rimCyanLight = new THREE.PointLight(0x06b6d4, 3.8, 9);
    rimCyanLight.position.set(-3, 1, -2);
    scene.add(rimCyanLight);

    const emeraldGlow = new THREE.PointLight(0x10b981, 2.8, 7);
    emeraldGlow.position.set(0, -1, 2);
    scene.add(emeraldGlow);

    // Mouse / Touch Interactivity with Smooth Parallax & Orbit
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotY = 0;
    let targetRotX = 0;
    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      sound.playScanTone();
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseParallaxX = normX * 0.15;
      mouseParallaxY = normY * 0.1;

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

      // Specimen idle rotation + drag rotation + mouse parallax tilt
      specimenGroup.rotation.y += 0.0035;
      specimenGroup.rotation.y += (targetRotY - specimenGroup.rotation.y) * 0.05;
      specimenGroup.rotation.x += (targetRotX + mouseParallaxY - specimenGroup.rotation.x) * 0.05;
      specimenGroup.rotation.z += (mouseParallaxX - specimenGroup.rotation.z) * 0.05;

      // Laser scanning ring oscillation
      const scanY = Math.sin(elapsed * 1.4) * 1.7;
      scanRing.position.y = scanY;
      scanDisk.position.y = scanY;
      scanRing.rotation.z += 0.008;
      telemetryRing.rotation.z -= 0.006;

      // Particle floating drift
      const positions = particleGeom.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleSpeeds[i];
        if (positions[i * 3 + 1] > 2.3) {
          positions[i * 3 + 1] = -2.1;
        }
      }
      particleGeom.attributes.position.needsUpdate = true;

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
    <div className="relative w-full h-[540px] md:h-[660px] cursor-grab active:cursor-grabbing select-none">
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
          Tomography: 120 Slice Planes / s | λ = 532 nm Laser | High-Fidelity Fenestration Mesh
        </span>
      </div>

      <div className="absolute bottom-4 right-4 pointer-events-none text-right font-mono text-[11px] text-emerald-400/80">
        <div>ORBIT: Drag to inspect 360°</div>
        <div>VASCULAR FLUX: Active (8.4 μL/min)</div>
      </div>
    </div>
  );
}
