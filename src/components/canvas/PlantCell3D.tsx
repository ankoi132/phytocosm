"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Organelle, CELL_ORGANELLES } from "@/data/cellOrganelles";
import { sound } from "@/utils/audio";

interface Props {
  selectedOrganelle: Organelle | null;
  onSelectOrganelle: (organelle: Organelle) => void;
  isCellWallCutaway: boolean;
}

export default function PlantCell3D({
  selectedOrganelle,
  onSelectOrganelle,
  isCellWallCutaway,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const cellWallRef = useRef<THREE.Mesh | null>(null);
  const organelleMeshesRef = useRef<{ mesh: THREE.Object3D; organelle: Organelle }[]>([]);

  // Smooth camera interpolation on organelle select
  useEffect(() => {
    if (selectedOrganelle && cameraRef.current && controlsRef.current) {
      const [tx, ty, tz] = selectedOrganelle.position3D;
      controlsRef.current.target.set(tx, ty, tz);
      cameraRef.current.position.set(tx + 1.2, ty + 0.9, tz + 2.0);
      controlsRef.current.update();
      sound.playInspectChime();
    }
  }, [selectedOrganelle]);

  // Cutaway toggle for cell wall
  useEffect(() => {
    if (cellWallRef.current) {
      const mat = cellWallRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = isCellWallCutaway ? 0.2 : 0.45;
        mat.transmission = isCellWallCutaway ? 0.9 : 0.65;
        mat.needsUpdate = true;
      }
    }
  }, [isCellWallCutaway]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030704);
    scene.fog = new THREE.FogExp2(0x030704, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.2, 2.4, 4.8);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 1.0;
    controlsRef.current = controls;

    // 2. Lights
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.4);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xf0fdf4, 2.5);
    sun.position.set(5, 7, 5);
    scene.add(sun);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3.0, 10);
    cyanPoint.position.set(-4, 2, -3);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 2.5, 8);
    violetPoint.position.set(3, -2, -2);
    scene.add(violetPoint);

    const cellGroup = new THREE.Group();
    scene.add(cellGroup);

    organelleMeshesRef.current = [];

    // 3. Hexagonal/Prismatic Plant Cell Wall (Polyhedral outer geometry)
    const cellWallGeom = new THREE.CylinderGeometry(2.4, 2.4, 3.2, 6, 1, false);
    const cellWallMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      roughness: 0.2,
      metalness: 0.05,
      transmission: 0.65,
      transparent: true,
      opacity: 0.45,
      clearcoat: 0.8,
      side: THREE.DoubleSide,
      wireframe: false,
    });
    const cellWallMesh = new THREE.Mesh(cellWallGeom, cellWallMat);
    cellWallRef.current = cellWallMesh;
    cellGroup.add(cellWallMesh);

    // Cell wall outline wireframe
    const wireframeGeom = new THREE.WireframeGeometry(cellWallGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x22c55e,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeom, wireframeMat);
    cellGroup.add(wireframeLine);

    // Map organelle to cell wall
    const cellWallData = CELL_ORGANELLES.find((o) => o.id === "cell-wall");
    if (cellWallData) {
      organelleMeshesRef.current.push({ mesh: cellWallMesh, organelle: cellWallData });
    }

    // 4. Central Vacuole (Massive translucent fluid sac)
    const vacuoleData = CELL_ORGANELLES.find((o) => o.id === "central-vacuole");
    if (vacuoleData) {
      const vacGeom = new THREE.SphereGeometry(1.4, 32, 32);
      vacGeom.scale(1.2, 0.95, 1.1);
      const vacMat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        roughness: 0.1,
        metalness: 0.05,
        transmission: 0.8,
        transparent: true,
        opacity: 0.65,
        emissive: 0x083344,
        emissiveIntensity: 0.4,
      });
      const vacMesh = new THREE.Mesh(vacGeom, vacMat);
      vacMesh.position.set(...vacuoleData.position3D);
      cellGroup.add(vacMesh);
      organelleMeshesRef.current.push({ mesh: vacMesh, organelle: vacuoleData });
    }

    // 5. Chloroplasts with interior Thylakoid Grana Discs
    const chloroData = CELL_ORGANELLES.find((o) => o.id === "chloroplast");
    if (chloroData) {
      const chloroCluster = new THREE.Group();
      chloroCluster.position.set(...chloroData.position3D);

      // Main primary chloroplast
      const chloroGeom = new THREE.SphereGeometry(0.45, 24, 24);
      chloroGeom.scale(1.4, 0.7, 0.7);
      const chloroMat = new THREE.MeshPhysicalMaterial({
        color: 0x16a34a,
        roughness: 0.3,
        metalness: 0.1,
        clearcoat: 0.6,
        emissive: 0x052e16,
        emissiveIntensity: 0.5,
      });
      const chloroMesh = new THREE.Mesh(chloroGeom, chloroMat);
      chloroCluster.add(chloroMesh);

      // Add a couple of satellite chloroplasts orbiting perimeter
      const satOffsets = [
        [0.8, -0.6, -0.7],
        [-1.2, 0.8, -1.0],
        [0.4, 1.2, 0.8],
      ];
      satOffsets.forEach((pos) => {
        const satMesh = new THREE.Mesh(chloroGeom.clone(), chloroMat);
        satMesh.position.set(pos[0], pos[1], pos[2]);
        satMesh.rotation.set(Math.random(), Math.random(), Math.random());
        cellGroup.add(satMesh);
      });

      cellGroup.add(chloroCluster);
      organelleMeshesRef.current.push({ mesh: chloroCluster, organelle: chloroData });
    }

    // 6. Nucleus & Nucleolus
    const nucleusData = CELL_ORGANELLES.find((o) => o.id === "nucleus");
    if (nucleusData) {
      const nucleusGroup = new THREE.Group();
      nucleusGroup.position.set(...nucleusData.position3D);

      const nucGeom = new THREE.SphereGeometry(0.65, 32, 32);
      const nucMat = new THREE.MeshPhysicalMaterial({
        color: 0x7c3aed,
        roughness: 0.35,
        transmission: 0.4,
        transparent: true,
        opacity: 0.85,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.4,
      });
      const nucMesh = new THREE.Mesh(nucGeom, nucMat);
      nucleusGroup.add(nucMesh);

      // Inner dense nucleolus
      const nucleolusMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 16, 16),
        new THREE.MeshBasicMaterial({ color: 0xc084fc })
      );
      nucleusGroup.add(nucleolusMesh);

      cellGroup.add(nucleusGroup);
      organelleMeshesRef.current.push({ mesh: nucleusGroup, organelle: nucleusData });
    }

    // 7. Mitochondria
    const mitoData = CELL_ORGANELLES.find((o) => o.id === "mitochondria");
    if (mitoData) {
      const mitoGroup = new THREE.Group();
      mitoGroup.position.set(...mitoData.position3D);

      const mitoGeom = new THREE.CapsuleGeometry(0.18, 0.45, 16, 16);
      mitoGeom.rotateZ(Math.PI / 4);
      const mitoMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706,
        roughness: 0.4,
        emissive: 0x78350f,
        emissiveIntensity: 0.45,
      });
      const mitoMesh = new THREE.Mesh(mitoGeom, mitoMat);
      mitoGroup.add(mitoMesh);

      cellGroup.add(mitoGroup);
      organelleMeshesRef.current.push({ mesh: mitoGroup, organelle: mitoData });
    }

    // 8. Endoplasmic Reticulum & Golgi
    const erData = CELL_ORGANELLES.find((o) => o.id === "endoplasmic-reticulum");
    if (erData) {
      const erGroup = new THREE.Group();
      erGroup.position.set(...erData.position3D);

      for (let s = 0; s < 4; s++) {
        const torusGeom = new THREE.TorusGeometry(0.4 + s * 0.12, 0.035, 12, 32, Math.PI * 1.3);
        const torusMat = new THREE.MeshBasicMaterial({
          color: 0xec4899,
          transparent: true,
          opacity: 0.85,
        });
        const torusMesh = new THREE.Mesh(torusGeom, torusMat);
        torusMesh.position.y = s * 0.08;
        torusMesh.rotation.x = Math.PI / 3;
        erGroup.add(torusMesh);
      }

      cellGroup.add(erGroup);
      organelleMeshesRef.current.push({ mesh: erGroup, organelle: erData });
    }

    // 9. Golgi Apparatus
    const golgiData = CELL_ORGANELLES.find((o) => o.id === "golgi-apparatus");
    if (golgiData) {
      const golgiGroup = new THREE.Group();
      golgiGroup.position.set(...golgiData.position3D);

      for (let g = 0; g < 5; g++) {
        const plateGeom = new THREE.CylinderGeometry(0.35 - g * 0.03, 0.38 - g * 0.03, 0.03, 24);
        plateGeom.scale(1.2, 1, 0.6);
        const plateMat = new THREE.MeshBasicMaterial({
          color: 0x06b6d4,
          transparent: true,
          opacity: 0.85,
        });
        const plateMesh = new THREE.Mesh(plateGeom, plateMat);
        plateMesh.position.y = g * 0.07;
        plateMesh.rotation.z = Math.sin(g * 0.3) * 0.2;
        golgiGroup.add(plateMesh);
      }

      cellGroup.add(golgiGroup);
      organelleMeshesRef.current.push({ mesh: golgiGroup, organelle: golgiData });
    }

    // 10. Plasmodesmata Channels
    const plasmoData = CELL_ORGANELLES.find((o) => o.id === "plasmodesmata");
    if (plasmoData) {
      const plasmoGroup = new THREE.Group();
      plasmoGroup.position.set(...plasmoData.position3D);

      for (let p = 0; p < 8; p++) {
        const poreGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.45, 12);
        const poreMat = new THREE.MeshBasicMaterial({ color: 0xfacc15 });
        const poreMesh = new THREE.Mesh(poreGeom, poreMat);
        const theta = (p / 8) * Math.PI * 2;
        poreMesh.position.set(Math.cos(theta) * 1.8, 0, Math.sin(theta) * 1.8);
        plasmoGroup.add(poreMesh);
      }

      cellGroup.add(plasmoGroup);
      organelleMeshesRef.current.push({ mesh: plasmoGroup, organelle: plasmoData });
    }

    // 11. Raycaster for Organelle Selection Click
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objectsToTest = organelleMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(objectsToTest, true);

      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit.parent && hit.parent !== cellGroup) {
          hit = hit.parent;
        }
        const found = organelleMeshesRef.current.find((item) => item.mesh === hit);
        if (found) {
          onSelectOrganelle(found.organelle);
        }
      }
    };
    renderer.domElement.addEventListener("click", onPointerDown);

    // 12. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Subtle cytoplasm streaming organelle micro-movement
      if (chloroData && organelleMeshesRef.current) {
        const chloroItem = organelleMeshesRef.current.find((i) => i.organelle.id === "chloroplast");
        if (chloroItem) {
          chloroItem.mesh.rotation.y = Math.sin(elapsed * 0.4) * 0.15;
        }
      }

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
      renderer.domElement.removeEventListener("click", onPointerDown);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [onSelectOrganelle]);

  return (
    <div className="relative w-full h-[540px] md:h-[680px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400">
            3D Plant Cell Cytology Lab // Interactive Cytoplasm
          </span>
        </div>
        <span className="text-[11px] text-zinc-400 font-mono">
          Click any organelle to zoom & inspect biochemical pathway
        </span>
      </div>
    </div>
  );
}
