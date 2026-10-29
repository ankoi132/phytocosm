"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Organelle, CELL_ORGANELLES } from "@/data/cellOrganelles";
import { sound } from "@/utils/audio";
import { getCellularParenchymaTexture } from "@/utils/proceduralTextures";

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
  const vacuoleMeshRef = useRef<THREE.Mesh | null>(null);
  const organelleMeshesRef = useRef<{ mesh: THREE.Object3D; organelle: Organelle }[]>([]);

  // Target camera and target coordinates for smooth cinematic lerp
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(3.2, 2.4, 4.8));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));

  // Smooth camera interpolation on organelle select
  useEffect(() => {
    if (selectedOrganelle) {
      const [tx, ty, tz] = selectedOrganelle.position3D;
      targetLookAtRef.current.set(tx, ty, tz);
      targetCamPosRef.current.set(tx + 1.25, ty + 0.85, tz + 1.9);
      sound.playInspectChime();
    }
  }, [selectedOrganelle]);

  // Cutaway toggle for cell wall
  useEffect(() => {
    if (cellWallRef.current) {
      const mat = cellWallRef.current.material as THREE.MeshPhysicalMaterial;
      if (mat) {
        mat.opacity = isCellWallCutaway ? 0.22 : 0.55;
        mat.transmission = isCellWallCutaway ? 0.92 : 0.6;
        mat.needsUpdate = true;
      }
    }
  }, [isCellWallCutaway]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030704);
    scene.fog = new THREE.FogExp2(0x030704, 0.04);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(targetCamPosRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 0.8;
    controlsRef.current = controls;

    // 2. Cinematic Biological Lights
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.5);
    scene.add(ambientLight);

    const sun = new THREE.DirectionalLight(0xf0fdf4, 2.8);
    sun.position.set(5, 7, 5);
    scene.add(sun);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3.2, 11);
    cyanPoint.position.set(-4, 2, -3);
    scene.add(cyanPoint);

    const violetPoint = new THREE.PointLight(0xa855f7, 2.5, 9);
    violetPoint.position.set(3, -2, -2);
    scene.add(violetPoint);

    const cellGroup = new THREE.Group();
    scene.add(cellGroup);

    organelleMeshesRef.current = [];

    // 3. Hexagonal Prismatic Plant Cell Wall & Middle Lamella
    const cellWallGeom = new THREE.CylinderGeometry(2.4, 2.4, 3.2, 6, 2, false);
    const cellTexture = getCellularParenchymaTexture();

    const cellWallMat = new THREE.MeshPhysicalMaterial({
      color: 0x15803d,
      roughness: 0.25,
      metalness: 0.05,
      transmission: 0.65,
      transparent: true,
      opacity: 0.45,
      clearcoat: 0.85,
      clearcoatRoughness: 0.2,
      bumpMap: cellTexture,
      bumpScale: 0.015,
      side: THREE.DoubleSide,
    });
    const cellWallMesh = new THREE.Mesh(cellWallGeom, cellWallMat);
    cellWallRef.current = cellWallMesh;
    cellGroup.add(cellWallMesh);

    // Subtle Middle Lamella outer frame line
    const wireframeGeom = new THREE.WireframeGeometry(cellWallGeom);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: 0x4ade80,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeLine = new THREE.LineSegments(wireframeGeom, wireframeMat);
    cellGroup.add(wireframeLine);

    const cellWallData = CELL_ORGANELLES.find((o) => o.id === "cell-wall");
    if (cellWallData) {
      organelleMeshesRef.current.push({ mesh: cellWallMesh, organelle: cellWallData });
    }

    // 4. Central Vacuole & Tonoplast (Internal turgor engine)
    const vacuoleData = CELL_ORGANELLES.find((o) => o.id === "central-vacuole");
    if (vacuoleData) {
      const vacGeom = new THREE.SphereGeometry(1.4, 36, 36);
      vacGeom.scale(1.2, 0.95, 1.1);
      const vacMat = new THREE.MeshPhysicalMaterial({
        color: 0x06b6d4,
        roughness: 0.08,
        metalness: 0.05,
        transmission: 0.82,
        transparent: true,
        opacity: 0.7,
        ior: 1.34, // Water refractive index
        emissive: 0x083344,
        emissiveIntensity: 0.45,
      });
      const vacMesh = new THREE.Mesh(vacGeom, vacMat);
      vacMesh.position.set(...vacuoleData.position3D);
      vacuoleMeshRef.current = vacMesh;
      cellGroup.add(vacMesh);
      organelleMeshesRef.current.push({ mesh: vacMesh, organelle: vacuoleData });
    }

    // 5. High-Fidelity Chloroplast with 3D Thylakoid Grana Stacks & Stroma Lamellae
    const chloroData = CELL_ORGANELLES.find((o) => o.id === "chloroplast");
    if (chloroData) {
      const chloroMaster = new THREE.Group();
      chloroMaster.position.set(...chloroData.position3D);

      // Semi-transparent double-membrane envelope (lenticular biconvex shape)
      const envelopeGeom = new THREE.SphereGeometry(0.55, 32, 32);
      envelopeGeom.scale(1.45, 0.65, 0.85);

      const envelopeMat = new THREE.MeshPhysicalMaterial({
        color: 0x16a34a,
        roughness: 0.22,
        metalness: 0.08,
        transmission: 0.6,
        transparent: true,
        opacity: 0.75,
        clearcoat: 0.7,
        emissive: 0x052e16,
        emissiveIntensity: 0.5,
      });
      const envelopeMesh = new THREE.Mesh(envelopeGeom, envelopeMat);
      chloroMaster.add(envelopeMesh);

      // Internal Thylakoid Grana Stacks (stacked discs in deep chlorophyll green)
      const granaMat = new THREE.MeshStandardMaterial({
        color: 0x15803d,
        roughness: 0.35,
        emissive: 0x052e16,
        emissiveIntensity: 0.4,
      });

      const granumConfigs = [
        { x: -0.32, z: -0.12, discs: 5 },
        { x: -0.1, z: 0.18, discs: 6 },
        { x: 0.18, z: -0.15, discs: 5 },
        { x: 0.35, z: 0.12, discs: 4 },
      ];

      granumConfigs.forEach((gc) => {
        const stackGroup = new THREE.Group();
        stackGroup.position.set(gc.x, 0, gc.z);

        for (let d = 0; d < gc.discs; d++) {
          const discGeom = new THREE.CylinderGeometry(0.075, 0.075, 0.016, 16);
          const discMesh = new THREE.Mesh(discGeom, granaMat);
          discMesh.position.y = -0.08 + d * 0.032;
          stackGroup.add(discMesh);
        }
        chloroMaster.add(stackGroup);
      });

      // Stroma Lamellae ribbons connecting grana
      const lamellaGeom = new THREE.BoxGeometry(0.65, 0.008, 0.04);
      const lamellaMat = new THREE.MeshBasicMaterial({ color: 0x22c55e, transparent: true, opacity: 0.6 });
      const lamellaMesh = new THREE.Mesh(lamellaGeom, lamellaMat);
      lamellaMesh.rotation.y = 0.4;
      chloroMaster.add(lamellaMesh);

      // Satellite Chloroplasts around cell periphery
      const satPositions = [
        [0.85, -0.65, -0.75],
        [-1.25, 0.85, -1.05],
        [0.45, 1.25, 0.85],
      ];
      satPositions.forEach((pos) => {
        const satMesh = envelopeMesh.clone();
        satMesh.position.set(pos[0], pos[1], pos[2]);
        satMesh.rotation.set(Math.random(), Math.random(), Math.random());
        cellGroup.add(satMesh);
      });

      cellGroup.add(chloroMaster);
      organelleMeshesRef.current.push({ mesh: chloroMaster, organelle: chloroData });
    }

    // 6. Nucleus with Nuclear Pores & Chromatin
    const nucleusData = CELL_ORGANELLES.find((o) => o.id === "nucleus");
    if (nucleusData) {
      const nucleusGroup = new THREE.Group();
      nucleusGroup.position.set(...nucleusData.position3D);

      const nucGeom = new THREE.SphereGeometry(0.68, 32, 32);
      const nucMat = new THREE.MeshPhysicalMaterial({
        color: 0x7c3aed,
        roughness: 0.32,
        transmission: 0.45,
        transparent: true,
        opacity: 0.88,
        emissive: 0x4c1d95,
        emissiveIntensity: 0.45,
      });
      const nucMesh = new THREE.Mesh(nucGeom, nucMat);
      nucleusGroup.add(nucMesh);

      // Inner dense nucleolus
      const nucleolusMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.24, 20, 20),
        new THREE.MeshBasicMaterial({ color: 0xc084fc })
      );
      nucleusGroup.add(nucleolusMesh);

      // Nuclear Pores (subtle golden dimples on surface)
      for (let p = 0; p < 16; p++) {
        const poreMesh = new THREE.Mesh(
          new THREE.RingGeometry(0.02, 0.035, 12),
          new THREE.MeshBasicMaterial({ color: 0xe9d5ff, side: THREE.DoubleSide })
        );
        const phi = Math.acos(-1 + (2 * p) / 16);
        const theta = Math.sqrt(16 * Math.PI) * phi;
        poreMesh.position.set(
          0.69 * Math.cos(theta) * Math.sin(phi),
          0.69 * Math.sin(theta) * Math.sin(phi),
          0.69 * Math.cos(phi)
        );
        poreMesh.lookAt(0, 0, 0);
        nucleusGroup.add(poreMesh);
      }

      cellGroup.add(nucleusGroup);
      organelleMeshesRef.current.push({ mesh: nucleusGroup, organelle: nucleusData });
    }

    // 7. Mitochondria with Folded Cristae Baffles
    const mitoData = CELL_ORGANELLES.find((o) => o.id === "mitochondria");
    if (mitoData) {
      const mitoGroup = new THREE.Group();
      mitoGroup.position.set(...mitoData.position3D);

      const mitoGeom = new THREE.CapsuleGeometry(0.2, 0.48, 16, 16);
      mitoGeom.rotateZ(Math.PI / 4);

      const mitoMat = new THREE.MeshPhysicalMaterial({
        color: 0xd97706,
        roughness: 0.35,
        transmission: 0.5,
        transparent: true,
        opacity: 0.85,
        emissive: 0x78350f,
        emissiveIntensity: 0.5,
      });
      const mitoMesh = new THREE.Mesh(mitoGeom, mitoMat);
      mitoGroup.add(mitoMesh);

      // Internal Folded Cristae Plates
      for (let cr = 0; cr < 5; cr++) {
        const cristaGeom = new THREE.RingGeometry(0.04, 0.14, 16);
        const cristaMat = new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide });
        const cristaMesh = new THREE.Mesh(cristaGeom, cristaMat);
        cristaMesh.position.set(-0.1 + cr * 0.05, -0.1 + cr * 0.05, 0);
        cristaMesh.rotation.set(Math.PI / 3, Math.PI / 4, 0);
        mitoGroup.add(cristaMesh);
      }

      cellGroup.add(mitoGroup);
      organelleMeshesRef.current.push({ mesh: mitoGroup, organelle: mitoData });
    }

    // 8. Endoplasmic Reticulum (RER & SER folded sheets)
    const erData = CELL_ORGANELLES.find((o) => o.id === "endoplasmic-reticulum");
    if (erData) {
      const erGroup = new THREE.Group();
      erGroup.position.set(...erData.position3D);

      for (let s = 0; s < 5; s++) {
        const torusGeom = new THREE.TorusGeometry(0.38 + s * 0.1, 0.035, 12, 36, Math.PI * 1.4);
        const torusMat = new THREE.MeshStandardMaterial({
          color: 0xec4899,
          roughness: 0.4,
          emissive: 0x831843,
          emissiveIntensity: 0.3,
        });
        const torusMesh = new THREE.Mesh(torusGeom, torusMat);
        torusMesh.position.y = s * 0.07;
        torusMesh.rotation.x = Math.PI / 3.2;
        erGroup.add(torusMesh);
      }

      cellGroup.add(erGroup);
      organelleMeshesRef.current.push({ mesh: erGroup, organelle: erData });
    }

    // 9. Golgi Apparatus (Dictyosomes with transport vesicles)
    const golgiData = CELL_ORGANELLES.find((o) => o.id === "golgi-apparatus");
    if (golgiData) {
      const golgiGroup = new THREE.Group();
      golgiGroup.position.set(...golgiData.position3D);

      for (let g = 0; g < 5; g++) {
        const plateGeom = new THREE.CylinderGeometry(0.35 - g * 0.03, 0.38 - g * 0.03, 0.028, 24);
        plateGeom.scale(1.25, 1, 0.65);
        const plateMat = new THREE.MeshStandardMaterial({
          color: 0x06b6d4,
          roughness: 0.35,
          emissive: 0x0e7490,
          emissiveIntensity: 0.4,
        });
        const plateMesh = new THREE.Mesh(plateGeom, plateMat);
        plateMesh.position.y = g * 0.065;
        plateMesh.rotation.z = Math.sin(g * 0.3) * 0.2;
        golgiGroup.add(plateMesh);
      }

      // Budding secretory vesicles
      for (let v = 0; v < 6; v++) {
        const vGeom = new THREE.SphereGeometry(0.04, 12, 12);
        const vMat = new THREE.MeshBasicMaterial({ color: 0x67e8f9 });
        const vMesh = new THREE.Mesh(vGeom, vMat);
        vMesh.position.set((Math.random() - 0.5) * 0.5, 0.35 + Math.random() * 0.2, (Math.random() - 0.5) * 0.4);
        golgiGroup.add(vMesh);
      }

      cellGroup.add(golgiGroup);
      organelleMeshesRef.current.push({ mesh: golgiGroup, organelle: golgiData });
    }

    // 10. Plasmodesmata Channels traversing Cell Wall
    const plasmoData = CELL_ORGANELLES.find((o) => o.id === "plasmodesmata");
    if (plasmoData) {
      const plasmoGroup = new THREE.Group();
      plasmoGroup.position.set(...plasmoData.position3D);

      for (let p = 0; p < 8; p++) {
        const poreGeom = new THREE.CylinderGeometry(0.045, 0.045, 0.5, 12);
        const poreMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xca8a04, emissiveIntensity: 0.5 });
        const poreMesh = new THREE.Mesh(poreGeom, poreMat);
        const theta = (p / 8) * Math.PI * 2;
        poreMesh.position.set(Math.cos(theta) * 1.85, 0, Math.sin(theta) * 1.85);
        poreMesh.rotation.z = Math.PI / 2;
        poreMesh.rotation.y = theta;
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

    // 12. Animation Loop with Smooth Camera Lerp & Turgor Micro-Pulse
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth cinematic camera damping
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);
      controls.update();

      // Idle cell slow orbit
      cellGroup.rotation.y += 0.0015;

      // Vacuole organic turgor fluid micro-pulse
      if (vacuoleMeshRef.current) {
        const pulse = 1.0 + Math.sin(elapsed * 1.2) * 0.015;
        vacuoleMeshRef.current.scale.set(1.2 * pulse, 0.95 * pulse, 1.1 * pulse);
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
          Click any organelle to zoom & inspect biochemical pathway (Thylakoid Grana, Cristae & Pores Active)
        </span>
      </div>
    </div>
  );
}
