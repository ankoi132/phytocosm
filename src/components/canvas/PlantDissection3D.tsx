"use client";

import React, { useEffect, useRef, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PlantSpecimen, HotspotPin } from "@/data/plants";
import { sound } from "@/utils/audio";
import { getLeafMicroTexture, getBarkMicroTexture } from "@/utils/proceduralTextures";

export interface DissectionControlsHandle {
  captureSnapshot: () => void;
  setCameraPreset: (preset: "macro" | "crossSection" | "leafSurface" | "topDown") => void;
  triggerSnapTrap: () => void;
  resetSnapTrap: () => void;
}

interface Props {
  specimen: PlantSpecimen;
  selectedHotspot: HotspotPin | null;
  onSelectHotspot: (hotspot: HotspotPin | null) => void;
  dissectionDepth: number; // 0 to 100
  sliceAxis: "transverse" | "longitudinal";
  isExploded: boolean;
  showVascularFlow: boolean;
  renderMode: "organic" | "bioluminescent" | "xray" | "wireframe";
  turgorPressureMPa: number; // 0.0 (wilted) to 1.5 (turgid)
  sunAzimuthDeg: number; // 0 to 360
  autumnProgress: number; // 0 (green) to 1 (golden) for Ginkgo
  layerVisibility: {
    cuticle: boolean;
    mesophyll: boolean;
    xylem: boolean;
    phloem: boolean;
    pith: boolean;
  };
}

// Organic double curvature transformer: gives flat extrusions natural compound droop, cupping, and margin waves
function applyOrganicCurvature(
  geom: THREE.BufferGeometry,
  droopFactor: number = 0.15,
  cupFactor: number = 0.08,
  waveFactor: number = 0.02
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
    // Parabolic longitudinal droop
    const droop = -droopFactor * Math.pow(progressY, 2.2);
    // Transverse cupping along midrib
    const cup = cupFactor * Math.pow(x, 2);
    // Sinusoidal leaf margin wave
    const wave = Math.sin(progressY * 12) * waveFactor * Math.abs(x);

    pos.setZ(i, z + droop + cup + wave);
  }
  geom.computeVertexNormals();
}

const PlantDissection3D = forwardRef<DissectionControlsHandle, Props>(function PlantDissection3D(
  {
    specimen,
    selectedHotspot,
    onSelectHotspot,
    dissectionDepth,
    sliceAxis,
    isExploded,
    showVascularFlow,
    renderMode,
    turgorPressureMPa,
    sunAzimuthDeg,
    autumnProgress,
    layerVisibility,
  },
  ref
) {
  const mountRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const keySunRef = useRef<THREE.DirectionalLight | null>(null);
  const clipPlaneRef = useRef<THREE.Plane | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const leafGroupRef = useRef<THREE.Group | null>(null);
  const crossSectionCapRef = useRef<THREE.Group | null>(null);
  const vascularSystemRef = useRef<THREE.Points | null>(null);
  const hotspotMeshesRef = useRef<{ mesh: THREE.Mesh; pin: HotspotPin }[]>([]);

  // Smooth camera position and target lerp references
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(2.8, 1.8, 4.2));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.2, 0));

  // Live raycast hover probe state
  const [hoveredTissue, setHoveredTissue] = useState<string | null>(null);

  // Trap animation state for Dionaea
  const targetTrapAngleRef = useRef<number>(0.85);
  const trapLobeRefs = useRef<{ left: THREE.Group; right: THREE.Group }[]>([]);

  // 1. Expose Imperative Controls to Parent
  useImperativeHandle(ref, () => ({
    captureSnapshot: () => {
      if (!rendererRef.current) return;
      sound.playCameraShutter();
      const dataUrl = rendererRef.current.domElement.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `phytocosm_${specimen.id}_anatomy_capture.png`;
      a.click();
    },
    setCameraPreset: (preset) => {
      sound.playSliceClick();
      if (preset === "macro") {
        targetCamPosRef.current.set(2.8, 1.8, 4.2);
        targetLookAtRef.current.set(0, 0.2, 0);
      } else if (preset === "crossSection") {
        targetCamPosRef.current.set(0.0, 0.85, 2.7);
        targetLookAtRef.current.set(0, 0.2, 0);
      } else if (preset === "leafSurface") {
        targetCamPosRef.current.set(0.75, 1.15, 1.6);
        targetLookAtRef.current.set(0.2, 0.85, 0.1);
      } else if (preset === "topDown") {
        targetCamPosRef.current.set(0.01, 5.2, 0.01);
        targetLookAtRef.current.set(0, 0, 0);
      }
    },
    triggerSnapTrap: () => {
      targetTrapAngleRef.current = 0.06;
      sound.playActionPotential();
      setTimeout(() => {
        sound.playTrapSnap();
      }, 100);
    },
    resetSnapTrap: () => {
      targetTrapAngleRef.current = 0.85;
      sound.playFluidsPulse();
    },
  }));

  // Update Clipping Plane on Dissection Depth & Slice Axis
  useEffect(() => {
    if (!clipPlaneRef.current) return;

    if (dissectionDepth <= 0) {
      clipPlaneRef.current.constant = 100; // No cut
      if (crossSectionCapRef.current) {
        crossSectionCapRef.current.visible = false;
      }
    } else {
      if (sliceAxis === "transverse") {
        clipPlaneRef.current.normal.set(0, -1, 0);
        const yCut = 1.8 - (dissectionDepth / 100) * 3.4;
        clipPlaneRef.current.constant = -yCut;
        if (crossSectionCapRef.current) {
          crossSectionCapRef.current.position.set(0, yCut, 0);
          crossSectionCapRef.current.rotation.set(Math.PI / 2, 0, 0);
          crossSectionCapRef.current.visible = true;
        }
      } else {
        // Longitudinal vertical split along Z-axis
        clipPlaneRef.current.normal.set(0, 0, -1);
        const zCut = 0.8 - (dissectionDepth / 100) * 1.6;
        clipPlaneRef.current.constant = -zCut;
        if (crossSectionCapRef.current) {
          crossSectionCapRef.current.position.set(0, 0, zCut);
          crossSectionCapRef.current.rotation.set(0, 0, 0);
          crossSectionCapRef.current.visible = true;
        }
      }
    }
  }, [dissectionDepth, sliceAxis]);

  // Update Sun Direction from Azimuth
  useEffect(() => {
    if (keySunRef.current) {
      const rad = (sunAzimuthDeg * Math.PI) / 180;
      keySunRef.current.position.set(Math.cos(rad) * 6, 6, Math.sin(rad) * 6);
    }
  }, [sunAzimuthDeg]);

  // Update Materials based on renderMode, layerVisibility, and autumn progress
  const updateMaterials = useCallback(() => {
    if (!sceneRef.current) return;

    sceneRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.name.startsWith("botanical_")) {
        const mat = child.material as THREE.MeshPhysicalMaterial;
        if (!mat) return;

        // Layer Visibility Toggles
        if (child.name.includes("cuticle") && !layerVisibility.cuticle) {
          child.visible = false;
          return;
        }
        if (child.name.includes("mesophyll") && !layerVisibility.mesophyll) {
          child.visible = false;
          return;
        }
        if (child.name.includes("xylem") && !layerVisibility.xylem) {
          child.visible = false;
          return;
        }
        if (child.name.includes("phloem") && !layerVisibility.phloem) {
          child.visible = false;
          return;
        }
        if (child.name.includes("pith") && !layerVisibility.pith) {
          child.visible = false;
          return;
        }
        child.visible = true;

        // Render Modes
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
          mat.transmission = 0.88;
          mat.roughness = 0.1;
          mat.opacity = 0.55;
          mat.transparent = true;
        } else if (renderMode === "bioluminescent") {
          mat.wireframe = false;
          mat.color.setHex(0x10b981);
          mat.emissive.setHex(0x22c55e);
          mat.emissiveIntensity = 0.95;
          mat.transmission = 0.2;
          mat.transparent = false;
        } else {
          // Organic realistic mode
          mat.wireframe = false;
          if (specimen.id === "ginkgo-biloba" && autumnProgress > 0) {
            // Blend from spring green to autumn golden yellow
            const greenCol = new THREE.Color(specimen.geometryConfig.baseColor);
            const goldCol = new THREE.Color(0xfacc15);
            mat.color.copy(greenCol).lerp(goldCol, autumnProgress);
          } else {
            mat.color.setStyle(specimen.geometryConfig.baseColor);
          }
          mat.emissive.setHex(0x052e16);
          mat.emissiveIntensity = 0.25;
          mat.transmission = 0.38;
          mat.roughness = 0.28;
          mat.transparent = false;
        }
        mat.needsUpdate = true;
      }
    });
  }, [renderMode, layerVisibility, specimen, autumnProgress]);

  useEffect(() => {
    updateMaterials();
  }, [updateMaterials]);

  // Vascular Flow Toggle
  useEffect(() => {
    if (vascularSystemRef.current) {
      vascularSystemRef.current.visible = showVascularFlow;
    }
  }, [showVascularFlow]);

  // Exploded View Transition
  useEffect(() => {
    if (leafGroupRef.current) {
      const spread = isExploded ? 1.7 : 1.0;
      leafGroupRef.current.children.forEach((leaf, idx) => {
        const origY = leaf.userData.origY ?? leaf.position.y;
        leaf.userData.origY = origY;
        leaf.position.y = isExploded ? origY * spread + (idx % 2 === 0 ? 0.35 : -0.35) : origY;
        const origX = leaf.userData.origX ?? leaf.position.x;
        leaf.userData.origX = origX;
        leaf.position.x = origX * (isExploded ? 1.5 : 1.0);
      });
    }
  }, [isExploded]);

  // Hotspot Focus smoothly lerped
  useEffect(() => {
    if (selectedHotspot) {
      const [tx, ty, tz] = selectedHotspot.position;
      targetLookAtRef.current.set(tx, ty, tz);
      targetCamPosRef.current.set(tx + 1.1, ty + 0.7, tz + 1.8);
      sound.playInspectChime();
    }
  }, [selectedHotspot]);

  // Main Three.js Scene Setup & Botanical Procedural Sculpting
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, WebGLRenderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x030704);
    scene.fog = new THREE.FogExp2(0x030704, 0.045);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.copy(targetCamPosRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    renderer.localClippingEnabled = true;
    rendererRef.current = renderer;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 14;
    controls.minDistance = 0.7;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 2. Global Clipping Plane
    const clipPlane = new THREE.Plane(new THREE.Vector3(0, -1, 0), 100);
    clipPlaneRef.current = clipPlane;

    // 3. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x064e3b, 1.6);
    scene.add(ambientLight);

    const keySun = new THREE.DirectionalLight(0xf0fdf4, 2.9);
    keySun.position.set(5, 7, 5);
    keySunRef.current = keySun;
    scene.add(keySun);

    const rimCyan = new THREE.PointLight(0x06b6d4, 3.2, 9);
    rimCyan.position.set(-4, 2, -3);
    scene.add(rimCyan);

    const fillGreen = new THREE.PointLight(0x10b981, 2.4, 7);
    fillGreen.position.set(3, -2, 2);
    scene.add(fillGreen);

    // 4. Botanical Hierarchical Groups
    const modelGroup = new THREE.Group();
    modelGroupRef.current = modelGroup;
    scene.add(modelGroup);

    const leafGroup = new THREE.Group();
    leafGroupRef.current = leafGroup;
    modelGroup.add(leafGroup);

    // Get procedural bump textures
    const leafMicro = getLeafMicroTexture();
    const barkMicro = getBarkMicroTexture();

    // High-Fidelity SSS Organic Materials
    const plantMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(specimen.geometryConfig.baseColor),
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.75,
      clearcoatRoughness: 0.18,
      transmission: 0.38,
      thickness: 0.7,
      ior: 1.42,
      bumpMap: leafMicro.bump,
      bumpScale: 0.012,
      side: THREE.DoubleSide,
      clippingPlanes: [clipPlane],
      clipShadows: true,
    });

    const stemMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(specimen.geometryConfig.stemColor),
      roughness: 0.45,
      metalness: 0.1,
      clearcoat: 0.4,
      bumpMap: barkMicro,
      bumpScale: 0.02,
      clippingPlanes: [clipPlane],
      clipShadows: true,
    });

    const { modelType, leafCount } = specimen.geometryConfig;

    // Stem Tube with natural organic spline
    const stemCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, -1.9, 0),
      new THREE.Vector3(0.04, -1.0, 0.03),
      new THREE.Vector3(-0.05, 0.0, -0.04),
      new THREE.Vector3(0.06, 0.9, 0.04),
      new THREE.Vector3(0, 1.7, 0),
    ]);
    const stemRadius = modelType === "sequoia" ? 0.32 : 0.085;
    const stemGeom = new THREE.TubeGeometry(stemCurve, 48, stemRadius, 24, false);

    if (modelType === "sequoia") {
      const pos = stemGeom.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const z = pos.getZ(i);
        const angle = Math.atan2(z, x);
        const ridge = Math.cos(angle * 12) * 0.025;
        pos.setX(i, x + Math.cos(angle) * ridge);
        pos.setZ(i, z + Math.sin(angle) * ridge);
      }
      stemGeom.computeVertexNormals();
    }

    const stemMesh = new THREE.Mesh(stemGeom, stemMaterial);
    stemMesh.name = "botanical_stem";
    modelGroup.add(stemMesh);

    // 5. Specimen-Specific High-Fidelity Botanical Geometries with Double Curvature
    trapLobeRefs.current = [];

    if (modelType === "monstera") {
      for (let i = 0; i < leafCount; i++) {
        const leafAssembly = new THREE.Group();

        const leafShape = new THREE.Shape();
        leafShape.moveTo(0, 0);
        leafShape.bezierCurveTo(0.35, 0.25, 0.75, 0.65, 0.68, 1.25);
        leafShape.bezierCurveTo(0.6, 1.65, 0.25, 2.05, 0, 2.3);
        leafShape.bezierCurveTo(-0.25, 2.05, -0.6, 1.65, -0.68, 1.25);
        leafShape.bezierCurveTo(-0.75, 0.65, -0.35, 0.25, 0, 0);

        const holeConfigs = [
          { x: 0.22, y: 0.65, rx: 0.07, ry: 0.18, rot: 0.25 },
          { x: 0.3, y: 1.15, rx: 0.09, ry: 0.24, rot: 0.2 },
          { x: 0.18, y: 1.6, rx: 0.06, ry: 0.16, rot: 0.1 },
          { x: -0.22, y: 0.65, rx: 0.07, ry: 0.18, rot: -0.25 },
          { x: -0.3, y: 1.15, rx: 0.09, ry: 0.24, rot: -0.2 },
          { x: -0.18, y: 1.6, rx: 0.06, ry: 0.16, rot: -0.1 },
        ];

        holeConfigs.forEach((h) => {
          const holePath = new THREE.Path();
          holePath.absellipse(h.x, h.y, h.rx, h.ry, 0, Math.PI * 2, true, h.rot);
          leafShape.holes.push(holePath);
        });

        const extrudeGeom = new THREE.ExtrudeGeometry(leafShape, {
          depth: 0.015,
          bevelEnabled: true,
          bevelSegments: 3,
          steps: 2,
          bevelSize: 0.008,
          bevelThickness: 0.008,
        });

        // Apply smooth biological double curvature
        applyOrganicCurvature(extrudeGeom, 0.22, 0.1, 0.02);

        const leafMesh = new THREE.Mesh(extrudeGeom, plantMaterial);
        leafMesh.name = `botanical_leaf_monstera_${i}`;
        leafMesh.rotation.x = -Math.PI / 2.4;
        leafAssembly.add(leafMesh);

        // Prominent Midrib Cylinder
        const midribGeom = new THREE.CylinderGeometry(0.018, 0.03, 2.2, 12);
        const midribMesh = new THREE.Mesh(
          midribGeom,
          new THREE.MeshStandardMaterial({ color: 0x86efac, roughness: 0.4 })
        );
        midribMesh.position.set(0, 1.1, 0.02);
        leafMesh.add(midribMesh);

        // Secondary lateral veins
        for (let v = 0; v < 6; v++) {
          const vFrac = (v + 1) / 7;
          const vCurveR = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, vFrac * 2.2, 0.02),
            new THREE.Vector3(0.2, vFrac * 2.2 + 0.1, 0.018),
            new THREE.Vector3(0.5, vFrac * 2.2 + 0.05, 0.015)
          );
          const vCurveL = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, vFrac * 2.2, 0.02),
            new THREE.Vector3(-0.2, vFrac * 2.2 + 0.1, 0.018),
            new THREE.Vector3(-0.5, vFrac * 2.2 + 0.05, 0.015)
          );
          const vLineMat = new THREE.LineBasicMaterial({ color: 0xa7f3d0, transparent: true, opacity: 0.65 });
          const vMeshR = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vCurveR.getPoints(12)), vLineMat);
          const vMeshL = new THREE.Line(new THREE.BufferGeometry().setFromPoints(vCurveL.getPoints(12)), vLineMat);
          leafMesh.add(vMeshR);
          leafMesh.add(vMeshL);
        }

        // Petiole with geniculum joint
        const petioleGeom = new THREE.CylinderGeometry(0.025, 0.035, 0.8, 12);
        const petioleMesh = new THREE.Mesh(petioleGeom, stemMaterial);
        petioleMesh.position.set(0, -0.35, 0);
        petioleMesh.rotation.x = 0.35;
        leafAssembly.add(petioleMesh);

        const progress = i / leafCount;
        leafAssembly.position.y = -0.7 + progress * 2.1;
        leafAssembly.rotation.y = progress * Math.PI * 4;
        leafAssembly.scale.set(0.85, 0.85, 0.85);

        leafAssembly.userData.origY = leafAssembly.position.y;
        leafAssembly.userData.origX = leafAssembly.position.x;
        leafAssembly.userData.baseRotX = leafAssembly.rotation.x;
        leafGroup.add(leafAssembly);
      }

      // Climbing Aerial Roots
      for (let r = 0; r < 3; r++) {
        const rootCurve = new THREE.CatmullRomCurve3([
          new THREE.Vector3(0.05, 0.5 - r * 0.4, 0.05),
          new THREE.Vector3(0.25, 0.1 - r * 0.4, 0.15),
          new THREE.Vector3(0.18, -0.8 - r * 0.3, 0.25),
          new THREE.Vector3(0.08, -1.8, 0.12),
        ]);
        const rootGeom = new THREE.TubeGeometry(rootCurve, 32, 0.022, 10, false);
        const rootMat = new THREE.MeshStandardMaterial({ color: 0x543310, roughness: 0.8 });
        const rootMesh = new THREE.Mesh(rootGeom, rootMat);
        modelGroup.add(rootMesh);
      }
    } else if (modelType === "cannabis") {
      for (let i = 0; i < leafCount; i++) {
        const palmateCluster = new THREE.Group();
        const leafletCount = 7;

        for (let l = 0; l < leafletCount; l++) {
          const leafletGroup = new THREE.Group();
          const length = 1.35 - Math.abs(l - 3) * 0.18;
          const width = 0.16;

          const lShape = new THREE.Shape();
          lShape.moveTo(0, 0);

          const teeth = 8;
          for (let t = 0; t < teeth; t++) {
            const frac = (t + 1) / (teeth + 1);
            const yTooth = frac * length;
            const xOut = width * Math.sin(frac * Math.PI) * 1.2;
            lShape.lineTo(xOut * 0.85, yTooth - 0.04);
            lShape.lineTo(xOut, yTooth);
          }
          lShape.lineTo(0, length);

          for (let t = teeth - 1; t >= 0; t--) {
            const frac = (t + 1) / (teeth + 1);
            const yTooth = frac * length;
            const xOut = -width * Math.sin(frac * Math.PI) * 1.2;
            lShape.lineTo(xOut, yTooth);
            lShape.lineTo(xOut * 0.85, yTooth - 0.04);
          }
          lShape.lineTo(0, 0);

          const lGeom = new THREE.ExtrudeGeometry(lShape, {
            depth: 0.012,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 1,
            bevelSize: 0.005,
            bevelThickness: 0.005,
          });

          // Organic curvature on cannabis leaflets
          applyOrganicCurvature(lGeom, 0.14, 0.04, 0.01);

          const lMesh = new THREE.Mesh(lGeom, plantMaterial);
          lMesh.name = `botanical_cannabis_leaflet_${i}_${l}`;
          leafletGroup.add(lMesh);

          // Glandular Capitate-Stalked Trichomes
          const trichomeCount = 4;
          for (let tc = 0; tc < trichomeCount; tc++) {
            const tGroup = new THREE.Group();
            const stalkGeom = new THREE.CylinderGeometry(0.005, 0.008, 0.04, 8);
            const stalkMat = new THREE.MeshBasicMaterial({ color: 0xdcfce7, transparent: true, opacity: 0.75 });
            const stalkMesh = new THREE.Mesh(stalkGeom, stalkMat);
            tGroup.add(stalkMesh);

            const resinHeadGeom = new THREE.SphereGeometry(0.016, 12, 12);
            const resinHeadMat = new THREE.MeshPhysicalMaterial({
              color: 0xf59e0b,
              emissive: 0xfbbf24,
              emissiveIntensity: 0.6,
              roughness: 0.1,
              transmission: 0.8,
            });
            const resinHeadMesh = new THREE.Mesh(resinHeadGeom, resinHeadMat);
            resinHeadMesh.position.y = 0.025;
            tGroup.add(resinHeadMesh);

            tGroup.position.set((Math.random() - 0.5) * 0.08, 0.2 + tc * 0.25, 0.018);
            leafletGroup.add(tGroup);
          }

          const spreadAngle = (l - 3) * 0.25;
          leafletGroup.rotation.z = spreadAngle;
          palmateCluster.add(leafletGroup);
        }

        palmateCluster.scale.set(0.8, 0.8, 0.8);
        palmateCluster.position.y = -0.9 + (i / leafCount) * 2.3;
        palmateCluster.rotation.y = (i / leafCount) * Math.PI * 4;
        palmateCluster.rotation.x = 0.5;

        palmateCluster.userData.origY = palmateCluster.position.y;
        palmateCluster.userData.origX = palmateCluster.position.x;
        leafGroup.add(palmateCluster);
      }
    } else if (modelType === "sequoia") {
      const branchTiers = 6;
      for (let t = 0; t < branchTiers; t++) {
        const tierGroup = new THREE.Group();
        const branchesInTier = 4;

        for (let b = 0; b < branchesInTier; b++) {
          const branchGroup = new THREE.Group();
          const bCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0.5, -0.05, 0),
            new THREE.Vector3(1.1, -0.15, 0),
          ]);
          const bGeom = new THREE.TubeGeometry(bCurve, 16, 0.03, 8, false);
          const bMesh = new THREE.Mesh(bGeom, stemMaterial);
          branchGroup.add(bMesh);

          const needleCount = 14;
          for (let n = 0; n < needleCount; n++) {
            const needleGeom = new THREE.BoxGeometry(0.18, 0.01, 0.04);
            const needleMesh = new THREE.Mesh(needleGeom, plantMaterial);
            needleMesh.name = `botanical_sequoia_needle_${t}_${b}_${n}`;
            needleMesh.position.set(0.2 + n * 0.06, -0.05 - n * 0.008, (n % 2 === 0 ? 0.06 : -0.06));
            branchGroup.add(needleMesh);
          }

          const coneGeom = new THREE.ConeGeometry(0.08, 0.18, 10);
          coneGeom.rotateX(Math.PI);
          const coneMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
          const coneMesh = new THREE.Mesh(coneGeom, coneMat);
          coneMesh.position.set(1.15, -0.18, 0);
          branchGroup.add(coneMesh);

          branchGroup.rotation.y = (b / branchesInTier) * Math.PI * 2 + t * 0.4;
          tierGroup.add(branchGroup);
        }

        tierGroup.position.y = -0.5 + t * 0.38;
        tierGroup.scale.set(1.0 - t * 0.08, 1.0 - t * 0.08, 1.0 - t * 0.08);
        tierGroup.userData.origY = tierGroup.position.y;
        tierGroup.userData.origX = tierGroup.position.x;
        leafGroup.add(tierGroup);
      }
    } else if (modelType === "arabidopsis") {
      const rosetteCount = 12;
      for (let r = 0; r < rosetteCount; r++) {
        const spatulateShape = new THREE.Shape();
        spatulateShape.moveTo(0, 0);
        spatulateShape.bezierCurveTo(0.12, 0.2, 0.35, 0.5, 0.3, 0.85);
        spatulateShape.bezierCurveTo(0.25, 1.0, 0, 1.1, 0, 1.1);
        spatulateShape.bezierCurveTo(0, 1.1, -0.25, 1.0, -0.3, 0.85);
        spatulateShape.bezierCurveTo(-0.35, 0.5, -0.12, 0.2, 0, 0);

        const spatGeom = new THREE.ExtrudeGeometry(spatulateShape, {
          depth: 0.01,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.004,
          bevelThickness: 0.004,
        });
        applyOrganicCurvature(spatGeom, 0.16, 0.06, 0.02);

        const spatMesh = new THREE.Mesh(spatGeom, plantMaterial);
        spatMesh.name = `botanical_arabidopsis_rosette_${r}`;
        spatMesh.rotation.x = -Math.PI / 2.15;

        const leafHolder = new THREE.Group();
        leafHolder.add(spatMesh);
        leafHolder.rotation.y = r * 2.399;
        leafHolder.position.y = -1.6;
        leafHolder.scale.set(0.65 + (r / rosetteCount) * 0.35, 0.65 + (r / rosetteCount) * 0.35, 1);
        leafHolder.userData.origY = leafHolder.position.y;
        leafHolder.userData.origX = leafHolder.position.x;
        leafGroup.add(leafHolder);
      }

      for (let f = 0; f < 5; f++) {
        const flowerGroup = new THREE.Group();
        for (let p = 0; p < 4; p++) {
          const petalGeom = new THREE.CircleGeometry(0.045, 12);
          const petalMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
          const petalMesh = new THREE.Mesh(petalGeom, petalMat);
          petalMesh.position.set(Math.cos((p * Math.PI) / 2) * 0.05, Math.sin((p * Math.PI) / 2) * 0.05, 0);
          flowerGroup.add(petalMesh);
        }
        const center = new THREE.Mesh(new THREE.CircleGeometry(0.02, 10), new THREE.MeshBasicMaterial({ color: 0xfacc15 }));
        flowerGroup.add(center);

        flowerGroup.position.set(0.08, 1.3 + f * 0.1, 0.08);
        flowerGroup.rotation.y = f * 1.2;
        flowerGroup.rotation.x = 0.5;
        modelGroup.add(flowerGroup);

        const siliqueGeom = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 8);
        const siliqueMesh = new THREE.Mesh(siliqueGeom, plantMaterial);
        siliqueMesh.position.set(0.12, 0.6 + f * 0.15, 0);
        siliqueMesh.rotation.z = 0.65;
        modelGroup.add(siliqueMesh);
      }
    } else if (modelType === "dionaea") {
      for (let i = 0; i < leafCount; i++) {
        const trapAssembly = new THREE.Group();

        const wingShape = new THREE.Shape();
        wingShape.moveTo(0, 0);
        wingShape.bezierCurveTo(0.18, 0.3, 0.24, 0.7, 0.06, 1.1);
        wingShape.bezierCurveTo(-0.06, 1.1, -0.24, 0.7, -0.18, 0.3);
        wingShape.lineTo(0, 0);

        const wingGeom = new THREE.ExtrudeGeometry(wingShape, { depth: 0.01, bevelEnabled: true, bevelSegments: 2, steps: 1 });
        applyOrganicCurvature(wingGeom, 0.12, 0.05, 0.01);
        const wingMesh = new THREE.Mesh(wingGeom, plantMaterial);
        wingMesh.rotation.x = -Math.PI / 2.3;
        trapAssembly.add(wingMesh);

        const trapHead = new THREE.Group();
        trapHead.position.set(0, 0.45, 1.0);

        const leftLobe = new THREE.Group();
        const lobeGeom = new THREE.CylinderGeometry(0.02, 0.32, 0.6, 24, 8, false, 0, Math.PI);
        lobeGeom.scale(0.8, 1, 0.18);
        lobeGeom.rotateZ(Math.PI / 2);

        const innerMat = new THREE.MeshPhysicalMaterial({
          color: 0xdc2626,
          roughness: 0.3,
          clearcoat: 0.5,
          emissive: 0x991b1b,
          emissiveIntensity: 0.4,
        });
        const leftMesh = new THREE.Mesh(lobeGeom, innerMat);
        leftMesh.name = `botanical_dionaea_lobe_left_${i}`;
        leftLobe.add(leftMesh);

        for (let c = 0; c < 10; c++) {
          const toothGeom = new THREE.ConeGeometry(0.015, 0.18, 8);
          toothGeom.rotateZ(Math.PI / 2);
          const toothMesh = new THREE.Mesh(toothGeom, plantMaterial);
          toothMesh.position.set(-0.28 + c * 0.06, 0.18, 0.05);
          leftLobe.add(toothMesh);
        }

        for (let th = 0; th < 3; th++) {
          const hairGeom = new THREE.CylinderGeometry(0.004, 0.007, 0.09, 6);
          const hairMesh = new THREE.Mesh(
            hairGeom,
            new THREE.MeshBasicMaterial({ color: 0xfef08a })
          );
          hairMesh.position.set(-0.08 + th * 0.08, 0.02, 0.04);
          leftLobe.add(hairMesh);
        }

        const rightLobe = new THREE.Group();
        const rightMesh = new THREE.Mesh(lobeGeom.clone(), innerMat);
        rightMesh.name = `botanical_dionaea_lobe_right_${i}`;
        rightLobe.add(rightMesh);

        for (let c = 0; c < 10; c++) {
          const toothGeom = new THREE.ConeGeometry(0.015, 0.18, 8);
          toothGeom.rotateZ(-Math.PI / 2);
          const toothMesh = new THREE.Mesh(toothGeom, plantMaterial);
          toothMesh.position.set(-0.28 + c * 0.06, -0.18, 0.05);
          rightLobe.add(toothMesh);
        }

        for (let th = 0; th < 3; th++) {
          const hairGeom = new THREE.CylinderGeometry(0.004, 0.007, 0.09, 6);
          const hairMesh = new THREE.Mesh(
            hairGeom,
            new THREE.MeshBasicMaterial({ color: 0xfef08a })
          );
          hairMesh.position.set(-0.08 + th * 0.08, -0.02, 0.04);
          rightLobe.add(hairMesh);
        }

        leftLobe.rotation.x = 0.85;
        rightLobe.rotation.x = -0.85;

        trapHead.add(leftLobe);
        trapHead.add(rightLobe);
        trapAssembly.add(trapHead);

        trapLobeRefs.current.push({ left: leftLobe, right: rightLobe });

        const progress = i / leafCount;
        trapAssembly.position.y = -1.2 + (i % 2) * 0.15;
        trapAssembly.rotation.y = progress * Math.PI * 2;
        trapAssembly.userData.origY = trapAssembly.position.y;
        trapAssembly.userData.origX = trapAssembly.position.x;
        leafGroup.add(trapAssembly);
      }
    } else if (modelType === "ginkgo") {
      for (let i = 0; i < leafCount; i++) {
        const ginkgoAssembly = new THREE.Group();

        const fanShape = new THREE.Shape();
        fanShape.moveTo(0, 0);
        fanShape.bezierCurveTo(0.2, 0.2, 0.55, 0.6, 0.65, 1.0);
        fanShape.bezierCurveTo(0.45, 1.15, 0.15, 1.18, 0.05, 0.95);
        fanShape.lineTo(0, 0.85);
        fanShape.lineTo(-0.05, 0.95);
        fanShape.bezierCurveTo(-0.15, 1.18, -0.45, 1.15, -0.65, 1.0);
        fanShape.bezierCurveTo(-0.55, 0.6, -0.2, 0.2, 0, 0);

        const fanGeom = new THREE.ExtrudeGeometry(fanShape, {
          depth: 0.01,
          bevelEnabled: true,
          bevelSegments: 2,
          steps: 1,
          bevelSize: 0.005,
          bevelThickness: 0.005,
        });
        applyOrganicCurvature(fanGeom, 0.18, 0.08, 0.015);

        const fanMesh = new THREE.Mesh(fanGeom, plantMaterial);
        fanMesh.name = `botanical_ginkgo_leaf_${i}`;
        ginkgoAssembly.add(fanMesh);

        const veinCount = 9;
        const veinLineMat = new THREE.LineBasicMaterial({
          color: 0xa7f3d0,
          transparent: true,
          opacity: 0.65,
        });
        for (let v = 0; v < veinCount; v++) {
          const frac = (v - 4) / 4;
          const veinCurve = new THREE.QuadraticBezierCurve3(
            new THREE.Vector3(0, 0.02, 0.012),
            new THREE.Vector3(frac * 0.25, 0.5, 0.012),
            new THREE.Vector3(frac * 0.55, 1.0, 0.012)
          );
          const points = veinCurve.getPoints(16);
          const lineGeom = new THREE.BufferGeometry().setFromPoints(points);
          const veinLine = new THREE.Line(lineGeom, veinLineMat);
          ginkgoAssembly.add(veinLine);
        }

        const gPetioleGeom = new THREE.CylinderGeometry(0.012, 0.015, 0.75, 8);
        const gPetioleMesh = new THREE.Mesh(gPetioleGeom, stemMaterial);
        gPetioleMesh.position.set(0, -0.36, 0);
        ginkgoAssembly.add(gPetioleMesh);

        ginkgoAssembly.scale.set(0.9, 0.9, 0.9);
        ginkgoAssembly.position.y = -0.9 + (i / leafCount) * 2.4;
        ginkgoAssembly.rotation.y = (i / leafCount) * Math.PI * 4;
        ginkgoAssembly.rotation.x = 0.45;
        ginkgoAssembly.userData.origY = ginkgoAssembly.position.y;
        ginkgoAssembly.userData.origX = ginkgoAssembly.position.x;
        leafGroup.add(ginkgoAssembly);
      }
    }

    // 6. Cross-Section Cap Plane (Concentric histological strata)
    const capGroup = new THREE.Group();
    capGroup.visible = false;
    crossSectionCapRef.current = capGroup;
    scene.add(capGroup);

    // Concentric histological rings:
    const pithMesh = new THREE.Mesh(
      new THREE.CircleGeometry(0.16, 32),
      new THREE.MeshBasicMaterial({ color: 0xfef08a, side: THREE.DoubleSide })
    );
    pithMesh.name = "botanical_pith_ring";
    capGroup.add(pithMesh);

    const xylemMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.16, 0.36, 32),
      new THREE.MeshBasicMaterial({ color: 0x06b6d4, side: THREE.DoubleSide })
    );
    xylemMesh.name = "botanical_xylem_ring";
    capGroup.add(xylemMesh);

    const cambiumMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.36, 0.40, 32),
      new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide })
    );
    cambiumMesh.name = "botanical_cambium_ring";
    capGroup.add(cambiumMesh);

    const phloemMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.40, 0.58, 32),
      new THREE.MeshBasicMaterial({ color: 0x10b981, side: THREE.DoubleSide })
    );
    phloemMesh.name = "botanical_phloem_ring";
    capGroup.add(phloemMesh);

    const cortexMesh = new THREE.Mesh(
      new THREE.RingGeometry(0.58, 0.74, 32),
      new THREE.MeshBasicMaterial({ color: 0x064e3b, side: THREE.DoubleSide })
    );
    cortexMesh.name = "botanical_cuticle_ring";
    capGroup.add(cortexMesh);

    // 7. Dual-Channel Vascular Stream Particles
    const flowCount = 420;
    const flowPositions = new Float32Array(flowCount * 3);
    const flowColors = new Float32Array(flowCount * 3);
    const flowDirections = new Float32Array(flowCount);

    const xylemColor = new THREE.Color(0x06b6d4);
    const phloemColor = new THREE.Color(0xf59e0b);

    for (let i = 0; i < flowCount; i++) {
      const isXylem = i % 2 === 0;
      flowDirections[i] = isXylem ? 1 : -1;
      const radius = isXylem ? 0.05 + Math.random() * 0.04 : 0.12 + Math.random() * 0.05;
      const theta = Math.random() * Math.PI * 2;
      flowPositions[i * 3] = Math.cos(theta) * radius;
      flowPositions[i * 3 + 1] = -1.9 + Math.random() * 3.6;
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
      size: 0.038,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });
    const flowPoints = new THREE.Points(flowGeom, flowMat);
    vascularSystemRef.current = flowPoints;
    scene.add(flowPoints);

    // 8. 3D Hotspot Markers
    const pinGroup = new THREE.Group();
    scene.add(pinGroup);
    hotspotMeshesRef.current = [];

    specimen.hotspots.forEach((pin) => {
      const pinGeom = new THREE.SphereGeometry(0.065, 16, 16);
      const pinMat = new THREE.MeshBasicMaterial({ color: 0x22c55e });
      const pinMesh = new THREE.Mesh(pinGeom, pinMat);
      pinMesh.position.set(...pin.position);

      const ringGeom = new THREE.RingGeometry(0.08, 0.11, 24);
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

    // 9. Pointer Interaction for Hotspots, Trigger Hairs & Live Hover Probe
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Check hover on plant meshes
      const intersects = raycaster.intersectObjects(modelGroup.children, true);
      if (intersects.length > 0) {
        const hitName = intersects[0].object.name;
        if (hitName.includes("leaf") || hitName.includes("leaflet") || hitName.includes("needle")) {
          setHoveredTissue("Adaxial Palisade Chlorenchyma & Epicuticular Wax");
        } else if (hitName.includes("stem") || hitName.includes("branch")) {
          setHoveredTissue("Cortex Parenchyma & Lignified Sclerenchyma Fibers");
        } else if (hitName.includes("xylem")) {
          setHoveredTissue("Xylem Vessel Conduits (Lignified Tracheary Elements)");
        } else if (hitName.includes("phloem")) {
          setHoveredTissue("Phloem Sieve Tube Elements & Companion Cells");
        } else if (hitName.includes("cambium")) {
          setHoveredTissue("Vascular Cambium (Lateral Meristematic Ring)");
        } else if (hitName.includes("pith")) {
          setHoveredTissue("Medullary Pith Parenchyma (Intercellular Gas Chambers)");
        } else if (hitName.includes("dionaea_lobe")) {
          setHoveredTissue("Pre-Stressed Mechanosensory Trap Lobe & Digestive Gland Field");
        } else {
          setHoveredTissue(null);
        }
      } else {
        setHoveredTissue(null);
      }
    };
    renderer.domElement.addEventListener("mousemove", onPointerMove);

    const onPointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const meshesToTest = hotspotMeshesRef.current.map((item) => item.mesh);
      const pinIntersects = raycaster.intersectObjects(meshesToTest, true);

      if (pinIntersects.length > 0) {
        let hit = pinIntersects[0].object;
        while (hit.parent && hit.parent !== pinGroup) {
          hit = hit.parent as THREE.Mesh;
        }
        const found = hotspotMeshesRef.current.find((item) => item.mesh === hit);
        if (found) {
          onSelectHotspot(found.pin);
          return;
        }
      }

      if (modelType === "dionaea") {
        const allIntersects = raycaster.intersectObjects(modelGroup.children, true);
        if (allIntersects.length > 0) {
          const hitObj = allIntersects[0].object;
          if (hitObj.name.includes("dionaea_lobe") || hitObj.parent?.name.includes("dionaea")) {
            targetTrapAngleRef.current = 0.06;
            sound.playActionPotential();
            setTimeout(() => {
              sound.playTrapSnap();
            }, 80);
          }
        }
      }
    };
    renderer.domElement.addEventListener("click", onPointerDown);

    // 10. Animation Loop with Smooth Camera Lerping & Living Respiration
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth camera interpolation
      camera.position.lerp(targetCamPosRef.current, 0.05);
      controls.target.lerp(targetLookAtRef.current, 0.05);
      controls.update();

      if (!controls.autoRotate) {
        modelGroup.rotation.y += 0.0016;
      }

      // Gentle living respiration oscillation (0.15 Hz biological pulse)
      const respiration = Math.sin(elapsed * 0.9) * 0.003;
      modelGroup.scale.set(1.0 + respiration, 1.0 + respiration, 1.0 + respiration);

      // Turgor pressure wilt/erect morphing
      const turgorFactor = Math.max(0.0, Math.min(1.5, turgorPressureMPa));
      const wiltAngle = (1.0 - turgorFactor / 1.0) * 0.42;
      if (leafGroupRef.current) {
        leafGroupRef.current.children.forEach((leaf) => {
          leaf.rotation.x = (leaf.userData.baseRotX ?? 0) + wiltAngle;
        });
      }

      // Dionaea trap closure physics lerp
      if (modelType === "dionaea" && trapLobeRefs.current.length > 0) {
        const currentAngle = trapLobeRefs.current[0].left.rotation.x;
        const diff = targetTrapAngleRef.current - currentAngle;
        const speed = targetTrapAngleRef.current < currentAngle ? 0.28 : 0.04;
        trapLobeRefs.current.forEach(({ left, right }) => {
          left.rotation.x += diff * speed;
          right.rotation.x -= diff * speed;
        });
      }

      // Vascular flow particles
      if (showVascularFlow) {
        const posArr = flowGeom.attributes.position.array as Float32Array;
        for (let i = 0; i < flowCount; i++) {
          const dir = flowDirections[i];
          posArr[i * 3 + 1] += dir * 0.012;
          if (dir > 0 && posArr[i * 3 + 1] > 1.7) {
            posArr[i * 3 + 1] = -1.9;
          } else if (dir < 0 && posArr[i * 3 + 1] < -1.9) {
            posArr[i * 3 + 1] = 1.7;
          }
        }
        flowGeom.attributes.position.needsUpdate = true;
      }

      // Hotspots pulsing
      hotspotMeshesRef.current.forEach(({ mesh }, idx) => {
        const s = 1.0 + Math.sin(elapsed * 4 + idx) * 0.16;
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
      renderer.domElement.removeEventListener("mousemove", onPointerMove);
      renderer.domElement.removeEventListener("click", onPointerDown);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [specimen, onSelectHotspot, showVascularFlow]);

  return (
    <div className="relative w-full h-[560px] md:h-[720px] rounded-2xl overflow-hidden glass-panel border border-emerald-500/20">
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Left: 3D Caliper & Scale Bar */}
      <div className="absolute top-4 left-4 pointer-events-none flex flex-col gap-1 font-mono text-[11px] text-emerald-400">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-bold uppercase tracking-widest text-xs">
            {specimen.commonName} // 3D Micro-Dissection
          </span>
        </div>
        <div className="flex items-center gap-2 text-zinc-400 text-[10px]">
          <span>CALIBRATED SCALE:</span>
          <div className="w-20 h-1 bg-emerald-400 rounded-full inline-block" />
          <span className="text-emerald-300 font-bold">5.0 mm</span>
        </div>
      </div>

      {/* Live Raycasting Anatomical Hover Probe */}
      {hoveredTissue && (
        <div className="absolute top-4 right-4 pointer-events-none glass-panel-glow px-3 py-1.5 rounded-xl border border-emerald-400/50 text-xs font-mono text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{hoveredTissue}</span>
        </div>
      )}

      {/* Cross Section Ring Legend (when cut is active) */}
      {dissectionDepth > 0 && (
        <div className="absolute bottom-4 left-4 glass-panel px-4 py-2.5 rounded-xl border border-emerald-500/30 text-xs font-mono space-y-1">
          <div className="text-emerald-300 font-bold uppercase tracking-wider text-[10px] pb-1 border-b border-emerald-500/20">
            {sliceAxis === "transverse" ? "Transverse Cross-Section Strata" : "Longitudinal Vascular Split"}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-950 border border-emerald-500" />
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
});

export default PlantDissection3D;
