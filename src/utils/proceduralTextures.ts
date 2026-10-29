import * as THREE from "three";

// Procedural biological textures generated via HTML5 Canvas
// Zero external asset downloads, 100% reliable, zero network latency

let cachedLeafTexture: THREE.CanvasTexture | null = null;
let cachedLeafNormal: THREE.CanvasTexture | null = null;
let cachedBarkTexture: THREE.CanvasTexture | null = null;
let cachedCellularTexture: THREE.CanvasTexture | null = null;

export function getLeafMicroTexture(): { map: THREE.CanvasTexture; bump: THREE.CanvasTexture } {
  if (typeof window === "undefined") {
    // SSR guard
    const dummy = new THREE.CanvasTexture(document.createElement("canvas"));
    return { map: dummy, bump: dummy };
  }

  if (cachedLeafTexture && cachedLeafNormal) {
    return { map: cachedLeafTexture, bump: cachedLeafNormal };
  }

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const bumpCanvas = document.createElement("canvas");
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bumpCtx = bumpCanvas.getContext("2d");

  if (ctx && bumpCtx) {
    // 1. Base chlorophyll green gradient
    const grad = ctx.createLinearGradient(0, 0, size, size);
    grad.addColorStop(0, "#15803d");
    grad.addColorStop(0.5, "#16a34a");
    grad.addColorStop(1, "#14532d");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, size, size);

    // Bump base
    bumpCtx.fillStyle = "#808080";
    bumpCtx.fillRect(0, 0, size, size);

    // 2. Micro-cellular parenchyma mesh (Voronoi-like polygonal organic cells)
    const cellCount = 180;
    const points: [number, number][] = [];
    for (let i = 0; i < cellCount; i++) {
      points.push([Math.random() * size, Math.random() * size]);
    }

    ctx.strokeStyle = "rgba(74, 222, 128, 0.12)";
    ctx.lineWidth = 1;

    bumpCtx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    bumpCtx.lineWidth = 1.5;

    // Connect close neighboring points to form organic cellular lattice
    for (let i = 0; i < points.length; i++) {
      for (let j = i + 1; j < points.length; j++) {
        const dx = points[i][0] - points[j][0];
        const dy = points[i][1] - points[j][1];
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 42) {
          ctx.beginPath();
          ctx.moveTo(points[i][0], points[i][1]);
          ctx.lineTo(points[j][0], points[j][1]);
          ctx.stroke();

          bumpCtx.beginPath();
          bumpCtx.moveTo(points[i][0], points[i][1]);
          bumpCtx.lineTo(points[j][0], points[j][1]);
          bumpCtx.stroke();
        }
      }
    }

    // 3. Stomata pores (scattered kidney-shaped guard cell pairs)
    for (let s = 0; s < 35; s++) {
      const sx = 20 + Math.random() * (size - 40);
      const sy = 20 + Math.random() * (size - 40);
      const angle = Math.random() * Math.PI;

      ctx.save();
      ctx.translate(sx, sy);
      ctx.rotate(angle);
      ctx.fillStyle = "rgba(187, 247, 208, 0.35)";
      ctx.beginPath();
      ctx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();

      // Guard pore slit
      ctx.strokeStyle = "rgba(5, 46, 22, 0.6)";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(-2.5, 0);
      ctx.lineTo(2.5, 0);
      ctx.stroke();
      ctx.restore();

      // Stoma bump
      bumpCtx.save();
      bumpCtx.translate(sx, sy);
      bumpCtx.rotate(angle);
      bumpCtx.fillStyle = "#ffffff";
      bumpCtx.beginPath();
      bumpCtx.ellipse(0, 0, 4, 2, 0, 0, Math.PI * 2);
      bumpCtx.fill();
      bumpCtx.restore();
    }
  }

  cachedLeafTexture = new THREE.CanvasTexture(canvas);
  cachedLeafTexture.wrapS = THREE.RepeatWrapping;
  cachedLeafTexture.wrapT = THREE.RepeatWrapping;
  cachedLeafTexture.repeat.set(3, 3);

  cachedLeafNormal = new THREE.CanvasTexture(bumpCanvas);
  cachedLeafNormal.wrapS = THREE.RepeatWrapping;
  cachedLeafNormal.wrapT = THREE.RepeatWrapping;
  cachedLeafNormal.repeat.set(3, 3);

  return { map: cachedLeafTexture, bump: cachedLeafNormal };
}

export function getBarkMicroTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture(document.createElement("canvas"));
  }
  if (cachedBarkTexture) return cachedBarkTexture;

  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#451a03";
    ctx.fillRect(0, 0, size, size);

    // Longitudinal fibrous fissures
    for (let x = 0; x < size; x += 4) {
      const alpha = 0.15 + Math.random() * 0.35;
      const col = Math.random() > 0.5 ? `rgba(120, 53, 15, ${alpha})` : `rgba(28, 12, 4, ${alpha})`;
      ctx.fillStyle = col;
      ctx.fillRect(x, 0, 2 + Math.random() * 3, size);

      // Cracks
      if (Math.random() > 0.8) {
        ctx.strokeStyle = "rgba(10, 4, 1, 0.5)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        const startY = Math.random() * size;
        ctx.moveTo(x, startY);
        ctx.lineTo(x + (Math.random() - 0.5) * 8, startY + 25 + Math.random() * 40);
        ctx.stroke();
      }
    }
  }

  cachedBarkTexture = new THREE.CanvasTexture(canvas);
  cachedBarkTexture.wrapS = THREE.RepeatWrapping;
  cachedBarkTexture.wrapT = THREE.RepeatWrapping;
  cachedBarkTexture.repeat.set(2, 6);
  return cachedBarkTexture;
}

export function getCellularParenchymaTexture(): THREE.CanvasTexture {
  if (typeof window === "undefined") {
    return new THREE.CanvasTexture(document.createElement("canvas"));
  }
  if (cachedCellularTexture) return cachedCellularTexture;

  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.fillStyle = "#052e16";
    ctx.fillRect(0, 0, size, size);

    // Honeycomb hexagonal cell boundaries
    const hexRadius = 16;
    const dx = hexRadius * 1.5;
    const dy = hexRadius * Math.sqrt(3);

    ctx.strokeStyle = "rgba(74, 222, 128, 0.45)";
    ctx.lineWidth = 1.2;

    for (let x = 0; x < size + hexRadius; x += dx) {
      for (let y = 0; y < size + dy; y += dy) {
        const offset = (Math.round(x / dx) % 2 === 0) ? 0 : dy / 2;
        const cy = y + offset;

        ctx.beginPath();
        for (let a = 0; a < 6; a++) {
          const angle = (a * Math.PI) / 3;
          const px = x + hexRadius * Math.cos(angle);
          const py = cy + hexRadius * Math.sin(angle);
          if (a === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();

        // Chloroplast dots inside cell periphery
        for (let c = 0; c < 6; c++) {
          const cAngle = (c * Math.PI) / 3 + 0.3;
          const cx = x + (hexRadius * 0.65) * Math.cos(cAngle);
          const cpy = cy + (hexRadius * 0.65) * Math.sin(cAngle);
          ctx.fillStyle = "#22c55e";
          ctx.beginPath();
          ctx.arc(cx, cpy, 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }
  }

  cachedCellularTexture = new THREE.CanvasTexture(canvas);
  cachedCellularTexture.wrapS = THREE.RepeatWrapping;
  cachedCellularTexture.wrapT = THREE.RepeatWrapping;
  cachedCellularTexture.repeat.set(4, 4);
  return cachedCellularTexture;
}
