"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PlantSpecimen, HotspotPin } from "@/data/plants";
import { sound } from "@/utils/audio";

interface Props {
  specimen: PlantSpecimen;
  selectedHotspot: HotspotPin | null;
  onSelectHotspot: (hotspot: HotspotPin | null) => void;
  dissectionDepth: number; // 0 to 100
  isExploded: boolean;
  showVascularFlow: boolean;
  renderMode: "organic" | "bioluminescent" | "xray" | "wireframe";
}

export default function PlantDissection3D({
  specimen,
  selectedHotspot,
  onSelectHotspot,
  dissectionDepth,
  isExploded,
  showVascularFlow,
  renderMode,
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const stemMeshRef = useRef<THREE.Mesh | null>(null);
  const leafGroupRef = useRef<THREE.Group | null>(null);
  const crossSectionCapRef = useRef<THREE.Group | null>(null);
  const vascularSystemRef = useRef<THREE.Points | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; pin: HotspotPin }[]>([]);

  // Update clipping plane based on dissectionDepth
  useEffect(() => {
    if (clipPlaneRef.current) {
      if (dissectionDepth <= 0) {
        clipPlaneRef.current.constant = 100; // No clipping
      } else {
        // Map 0-100 to y = 1.8 down to -1.5
        const yCut = 1.8 - (dissectionDepth / 100) * 3.3;
        clipPlaneRef.current.constant = -yCut;
        if (crossSectionCapRef.current) {
          crossSectionCapRef.current.position.y = yCut;
          crossSectionCapRef.current.visible = true;
        }
      }
    }
  }, [dissectionDepth]);

  // Update materials based on renderMode
  const updateMaterials = useCallback(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.startsWith("botanical_")) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        if (!mat) return;

        if (renderMode === "wireframe") {
          mat.wireframe = true;
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x064e3b);
          mat.transmission = 0;
          mat.opacity = 0.8;
          mat.transparent = true;
        } else if (renderMode === "xray") {
          mat.wireframe = false;
          mat.color.setHex(0x06b6d4);
          mat.emissive.setHex(0x083344);
          mat.transmission = 0.85;
          mat.roughness = 0.1;
          mat.opacity = 0.55;
          mat.transparent = true;
        } else if (renderMode === "bioluminescent") {
          mat.wireframe = false;
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x22c55e);
          mat.emissiveIntensity = 0.9;
          mat.transmission = 0.2;
          mat.transparent = false;
        } else {
          // Organic realistic
          mat.wireframe = false;
          mat.color.setStyle(specimen.geometryConfig.baseColor);
          mat.emissive.setHex(0x052e16);
          mat.emissiveIntensity = 0.3;
          mat.transmission = 0.35;
          mat.roughness = 0.35;
          mat.transparent = false;
        }
        mat.needsUpdate = true;
      }
    });
  }, [renderMode, specimen.geometryConfig.baseColor]);

  useEffect(() => {
    updateMaterials();
  }, [renderMode, updateMaterials]);

  // Toggle vascular flow particles visibility
  useEffect(() => {
    if (vascularSystemRef.current) {
      vascularSystemRef.current.visible = showVascularFlow;
    }
  }, [showVascularFlow]);

  // Exploded View transition
  useEffect(() => {
    if (leafGroupRef.current) {
      const targetSpread = isExploded ? 1.6 : 1.0;
      leafGroupRef.current.children.forEach((leaf, idx) => {
        const originalY = leaf.userData.originalY ?? leaf.position.y;
        leaf.userData.originalY = originalY;
        leaf.position.y = isExploded ? originalY * targetSpread + (idx % 2 === 0 ? 0.3 : -0.3) : originalY;
        leaf.position.x = leaf.userData.originalX ?? leaf.position.x;
        leaf.position.x *= isExploded ? 1.4 : 1.0;
      });
    }
  }, [isExploded]);

  // Smooth focus on selected hotspot
  useEffect(() => {
    if (selectedHotspot && controlsRef.current && cameraRef.current) {
      const [tx, ty, tz] = selectedHotspot.position;
      controlsRef.current.target.set(tx, ty, tz);
      cameraRef.current.position.set(tx + 1.2, ty + 0.8, tz + 2.0);
      controlsRef.current.update();
      sound.playInspectChime();
    }
  }, [selectedHotspot]);

  // Main Three.js Lifecycle
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030704);
    scene.fog = new THREE.FogExp2(0x030704, 0.05);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(2.8, 1.8, 4.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.localClippingEnabled = true;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 12;
    controls.minDistance = 0.8;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 2. Global Clipping Plane for Dissection
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    clipPlaneRef.current = clipPlane;

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0x064e3b, 1.5);
    scene.add(ambient);

    const keySun = new THREE.DirectionalLight(0xf0fdf4, 2.8);
    keySun.position.set(5, 7, 5);
    scene.add(keySun);

    const rimCyan = new THREE.PointLight(0x06b6d4, 3.0, 9);
    rimCyan.position.set(-4, 2, -3);
    scene.add(rimCyan);

    const fillGreen = new THREE.PointLight(0x10b981, 2.0, 7);
    fillGreen.position.set(3, -2, 2);
    scene.add(fillGreen);

    // 4. Plant Geometry Generation based on modelType
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    const leafGroup = new THREE.Group();
    leafGroupRef.current = leafGroup;
    modelGroup.add(leafGroup);

    // Common material with clipping plane attached
    const plantMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(specimen.geometryConfig.baseColor),
      roughness: 0.35,
      metalness: 0.08,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
      transmission: 0.3,
      thickness: 0.6,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane],
      clipShadows: true,
    });

    const stemMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(specimen.geometryConfig.stemColor),
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.4,
      clippingPlanes: [clipPlane],
      clipShadows: true,
    });

    // Stem Tube
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.8, 0),
      new THREE.Vector3(0.05, -0.9, 0.03),
      new THREE.Vector3(-0.04, 0.0, -0.03),
      new THREE.Vector3(0.08, 0.9, 0.05),
      new THREE.Vector3(0, 1.6, 0),
    ]);
    const stemGeom = new THREE.TubeGeometry(stemCurve, 48, 0.09, 16, false);
    const stemMesh = new THREE.Mesh(stemGeom, stemMaterial);
    stemMesh.name = "botanical_stem";
    stemMeshRef.current = stemMesh;
    modelGroup.add(stemMesh);

    // Specimen-Specific Leaves
    const { modelType, leafCount } = specimen.geometryConfig;

    if (modelType === "monstera") {
      // Perforated broad leaf blades
      for (let i = 0; i < leafCount; i++) {
        const leafGeom = new THREE.CylinderGeometry(0.02, 0.85, 1.9, 32, 16, false);
        const pos = leafGeom.attributes.position;
        for (let j = 0; j < pos.count; j++) {
          const y = pos.getY(j);
          const f = Math.sin(((y + 0.95) / 1.9) * Math.PI);
          pos.setX(j, pos.getX(j) * f * 1.8);
          pos.setZ(j, pos.getZ(j) * 0.1 * f);
        }
        leafGeom.computeVertexNormals();

        const leaf = new THREE.Mesh(leafGeom, plantMaterial);
        leaf.name = "botanical_leaf_" + i;
        const progress = i / leafCount;
        leaf.position.y = -0.8 + progress * 2.2;
        leaf.rotation.y = progress * Math.PI * 3.5;
        leaf.rotation.z = 0.55 + Math.sin(i) * 0.15;
        leaf.userData.originalY = leaf.position.y;
        leaf.userData.originalX = leaf.position.x;
        leafGroup.add(leaf);
      }
    } else if (modelType === "cannabis") {
      // Radiating palmate leaflets
      for (let i = 0; i < leafCount; i++) {
        const palmateCluster = new THREE.Group();
        const leafletCount = 7;
        for (let l = 0; l < leafletCount; l++) {
          const lGeom = new THREE.ConeGeometry(0.18, 1.4 - Math.abs(l - 3) * 0.22, 16);
          lGeom.scale(1, 1, 0.12);
          const lMesh = new THREE.Mesh(lGeom, plantMaterial);
          lMesh.name = "botanical_leaflet_" + i + "_" + l;
          const spreadAngle = (l - 3) * 0.24;
          lMesh.rotation.z = spreadAngle;
          lMesh.position.x = Math.sin(spreadAngle) * 0.7;
          lMesh.position.y = Math.cos(spreadAngle) * 0.7;
          palmateCluster.add(lMesh);
        }
        palmateCluster.scale.set(0.7, 0.7, 0.7);
        palmateCluster.position.y = -1.0 + (i / leafCount) * 2.4;
        palmateCluster.rotation.y = (i / leafCount) * Math.PI * 4;
        palmateCluster.rotation.x = 0.45;
        palmateCluster.userData.originalY = palmateCluster.position.y;
        palmateCluster.userData.originalX = palmateCluster.position.x;
        leafGroup.add(palmateCluster);
      }
    } else if (modelType === "ginkgo") {
      // Fan-shaped bilobed leaves
      for (let i = 0; i < leafCount; i++) {
        const fanGeom = new THREE.CylinderGeometry(0.01, 0.8, 0.9, 32, 8, false, 0, Math.PI);
        fanGeom.scale(1.2, 0.08, 1.2);
        fanGeom.rotateX(Math.PI / 2);
        const fan = new THREE.Mesh(fanGeom, plantMaterial);
        fan.name = "botanical_ginkgo_" + i;
        fan.position.y = -0.9 + (i / leafCount) * 2.3;
        fan.rotation.y = (i / leafCount) * Math.PI * 3.8;
        fan.rotation.z = 0.4;
        fan.userData.originalY = fan.position.y;
        fan.userData.originalX = fan.position.x;
        leafGroup.add(fan);
      }
    } else {
      // Default architectural foliage
      for (let i = 0; i < leafCount; i++) {
        const defGeom = new THREE.ConeGeometry(0.5, 1.4, 24);
        defGeom.scale(1.1, 1, 0.2);
        const defLeaf = new THREE.Mesh(defGeom, plantMaterial);
        defLeaf.name = "botanical_default_" + i;
        defLeaf.position.y = -0.9 + (i / leafCount) * 2.2;
        defLeaf.rotation.y = (i / leafCount) * Math.PI * 3.2;
        defLeaf.rotation.z = 0.6;
        defLeaf.userData.originalY = defLeaf.position.y;
        defLeaf.userData.originalX = defLeaf.position.x;
        leafGroup.add(defLeaf);
      }
    }

    // 5. Cross-Section Cap Plane (Shows internal rings when slicing)
    const capGroup = new THREE.Group();
    capGroup.rotation.x = Math.PI / 2;
    capGroup.visible = false;
    crossSectionCapRef.current = capGroup;
    scene.add(capGroup);

    // Concentric histological rings:
    // Pith (amber)
    const pithMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 32),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide })
    );
    capGroup.add(pithMesh);

    // Xylem ring (cyan)
    const xylemMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.18, 0.38, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide })
    );
    capGroup.add(xylemMesh);

    // Vascular Cambium ring (gold line)
    const cambiumMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.38, 0.42, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
    );
    capGroup.add(cambiumMesh);

    // Phloem ring (emerald)
    const phloemMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.42, 0.62, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    capGroup.add(phloemMesh);

    // Cortex / Epidermis ring (dark green)
    const cortexMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.62, 0.78, 32),
      new THREE.MeshBasicMaterial({ color: 0x064e3b, side: THREE.DoubleSide })
    );
    capGroup.add(cortexMesh);

    // 6. Dual-Channel Vascular Stream Particles
    const flowCount = 360;
    const flowPositions = new Float32Array(flowCount * 3);
    const flowColors = new Float32Array(flowCount * 3);
    const flowDirections = new Float32Array(flowCount); // +1 upward xylem, -1 downward phloem

    const xylemColor = new THREE.Color(0x06b6d4); // Cyan water
    const phloemColor = new THREE.Color(0xf59e0b); // Amber sugar

    for (let i = 0; i < flowCount; i++) {
      const isXylem = i % 2 === 0;
      flowDirections[i] = isXylem ? 1 : -1;
      const radius = isXylem ? 0.05 + Math.random() * 0.04 : 0.12 + Math.random() * 0.05;
      const theta = Math.random() * Math.PI * 2;
      flowPositions[i * 3] = Math.cos(theta) * radius;
      flowPositions[i * 3 + 1] = -1.8 + Math.random() * 3.4;
      flowPositions[i * 3 + 2] = Math.sin(theta) * radius;

      const c = isXylem ? xylemColor : phloemColor;
      flowColors[i * 3] = c.r;
      flowColors[i * 3 + 1] = c.g;
      flowColors[i * 3 + 2] = c.b;
    }

    const flowGeom = new THREE.BufferGeometry();
    flowGeom.setAttribute("position", new THREE.BufferAttribute(flowPositions, 3));
    flowGeom.setAttribute("color", new THREE.BufferAttribute(flowColors, 3));

    const flowMat = new THREE.PointsMaterial({
      size: 0.04,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const flowPoints = new THREE.Points(flowGeom, flowMat);
    vascularSystemRef.current = flowPoints;
    scene.add(flowPoints);

    // 7. Interactive Hotspot Markers
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    hotspotMeshesRef.current = [];

    specimen.hotspots.forEach((pin) => {
      const pinGeom = new THREE.SphereGeometry(0.07, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({
        color: 0x22c55e,
        wireframe: false,
      });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.set(...pin.position);

      // Outer glowing ring
      const ringGeom = new THREE.RingGeometry(0.09, 0.12, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x34d399,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeom, ringMat);
      pinMesh.add(ringMesh);

      pinGroup.add(pinMesh);
      hotspotMeshesRef.current.push({ mesh: pinMesh, pin });
    });

    // 8. Raycaster Pointer Interaction for Hotspots
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const meshesToTest = hotspotMeshesRef.current.map((item) => item.mesh);
      const intersects = raycaster.intersectObjects(meshesToTest, true);

      if (intersects.length > 0) {
        let hit = intersects[0].object;
        while (hit.parent && hit.parent !== pinGroup) {
          hit = hit.parent as THREE.Mesh;
        }
        const found = hotspotMeshesRef.current.find((item) => item.mesh === hit);
        if (found) {
          onSelectHotspot(found.pin);
        }
      }
    };
    renderer.domElement.addEventListener("click", onPointerDown);

    // 9. Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      controls.update();

      // Slow ambient model rotation when idle
      if (!controls.autoRotate) {
        modelGroup.rotation.y += 0.002;
      }

      // Animate vascular flow particles
      if (showVascularFlow) {
        const posArr = flowGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < flowCount; i++) {
          const dir = flowDirections[i];
          posArr[i * 3 + 1] += dir * 0.012;
          if (dir > 0 && posArr[i * 3 + 1] > 1.6) {
            posArr[i * 3 + 1] = -1.8;
          } else if (dir < 0 && posArr[i * 3 + 1] < -1.8) {
            posArr[i * 3 + 1] = 1.6;
          }
        }
        flowGeom.attributes.position.needsUpdate = true;
      }

      // Hotspot pulse
      hotspotMeshesRef.current.forEach(({ mesh }, idx) => {
        const s = 1.0 + Math.sin(elapsed * 4 + idx) * 0.18;
        mesh.scale.set(s, s, s);
      });

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
  }, [specimen, onSelectHotspot, showVascularFlow]);

  return (
    <div className="relative w-full h-[550px] md:h-[700px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Controls HUD */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 font-mono text-xs">
        <div className="glass-panel px-3 py-1.5 rounded-lg border border-emerald-500/30 text-emerald-400 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>REAL-TIME 3D DISSECTION</span>
        </div>
      </div>

      {/* Dissection Cross Section Ring Legend (when sliced) */}
      {dissectionDepth > 0 && (
        <div className="absolute bottom-4 left-4 glass-panel px-4 py-2.5 rounded-xl border border-emerald-500/30 text-xs font-mono space-y-1">
          <div className="text-emerald-300 font-bold uppercase tracking-wider text-[11px] pb-1 border-b border-emerald-500/20">
            Transverse Anatomy Cross-Section
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-900 border border-emerald-500" />
            <span className="text-zinc-300">Cortex / Epidermis</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-zinc-300">Phloem (Sucrose Translocation)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="text-zinc-300">Vascular Cambium (Lateral Meristem)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span className="text-zinc-300">Xylem (Capillary Tension & Sap)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-200" />
            <span className="text-zinc-300">Central Pith Parenchyma</span>
          </div>
        </div>
      )}
    </div>
  );
}
