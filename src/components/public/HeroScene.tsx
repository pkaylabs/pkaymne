import { useEffect, useRef } from "react";
import * as THREE from "three";

function createLabel(text: string, accent: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 220;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.Texture(canvas);

  ctx.fillStyle = "rgba(15, 23, 42, 0.82)";
  roundRect(ctx, 0, 0, canvas.width, canvas.height, 34);
  ctx.fill();
  ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
  ctx.lineWidth = 3;
  roundRect(ctx, 3, 3, canvas.width - 6, canvas.height - 6, 30);
  ctx.stroke();

  ctx.fillStyle = accent;
  roundRect(ctx, 34, 34, 68, 68, 18);
  ctx.fill();
  ctx.fillStyle = "#f8fafc";
  ctx.font = "700 34px Inter, Arial";
  ctx.fillText(text, 126, 72);
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "500 24px Inter, Arial";
  ctx.fillText("live indicator signal", 126, 112);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

export default function HeroScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(54, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 0.7, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const group = new THREE.Group();
    group.position.set(1.7, -0.25, 0);
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 1.25));
    const cyanLight = new THREE.PointLight(0x38bdf8, 12, 18);
    const amberLight = new THREE.PointLight(0xfacc15, 7, 14);
    cyanLight.position.set(-3, 3, 4);
    amberLight.position.set(4, -1.5, 5);
    scene.add(cyanLight, amberLight);

    const panelGeometry = new THREE.BoxGeometry(5.4, 3.1, 0.08);
    const panelMaterial = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.36,
      metalness: 0.18,
      transparent: true,
      opacity: 0.78,
      emissive: 0x082f49,
      emissiveIntensity: 0.18,
    });
    const dashboardPanel = new THREE.Mesh(panelGeometry, panelMaterial);
    dashboardPanel.position.set(0.25, 0, -0.5);
    group.add(dashboardPanel);

    const grid = new THREE.GridHelper(6.2, 12, 0x38bdf8, 0x1e3a8a);
    grid.rotation.x = Math.PI / 2;
    grid.position.set(0.25, 0, -0.42);
    group.add(grid);

    const barMaterial = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      emissive: 0x0f3a75,
      emissiveIntensity: 0.4,
      roughness: 0.22,
      metalness: 0.34,
    });
    const bars: THREE.Mesh[] = [];
    const barValues = [0.85, 1.35, 1.04, 1.78, 1.48, 2.25, 1.92];
    barValues.forEach((height, index) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.34, height, 0.34), barMaterial.clone());
      bar.position.set(-2.15 + index * 0.56, -1.35 + height / 2, 0.05);
      bars.push(bar);
      group.add(bar);
    });

    const points = [
      new THREE.Vector3(-2.35, -0.65, 0.35),
      new THREE.Vector3(-1.55, -0.3, 0.35),
      new THREE.Vector3(-0.75, -0.52, 0.35),
      new THREE.Vector3(0.05, 0.18, 0.35),
      new THREE.Vector3(0.85, 0.42, 0.35),
      new THREE.Vector3(1.65, 0.95, 0.35),
      new THREE.Vector3(2.45, 1.15, 0.35),
    ];
    const curve = new THREE.CatmullRomCurve3(points);
    const lineGeometry = new THREE.TubeGeometry(curve, 90, 0.035, 8, false);
    const lineMaterial = new THREE.MeshStandardMaterial({
      color: 0xfacc15,
      emissive: 0xf59e0b,
      emissiveIntensity: 0.75,
    });
    const trendLine = new THREE.Mesh(lineGeometry, lineMaterial);
    group.add(trendLine);

    const nodeMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      roughness: 0.2,
    });
    const nodes = points.map((point) => {
      const node = new THREE.Mesh(new THREE.SphereGeometry(0.105, 24, 24), nodeMaterial.clone());
      node.position.copy(point);
      group.add(node);
      return node;
    });

    const labelMaterials = [
      new THREE.MeshBasicMaterial({ map: createLabel("Outcome 82%", "#22c55e"), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createLabel("Data quality 97%", "#38bdf8"), transparent: true }),
      new THREE.MeshBasicMaterial({ map: createLabel("Reports ready", "#facc15"), transparent: true }),
    ];
    const labelGeometry = new THREE.PlaneGeometry(2.05, 0.88);
    const labels = labelMaterials.map((material, index) => {
      const label = new THREE.Mesh(labelGeometry, material);
      label.position.set(index === 0 ? -2.4 : index === 1 ? 2.55 : 0.3, index === 2 ? -2.05 : 1.95, 0.65);
      label.rotation.y = index === 0 ? 0.24 : index === 1 ? -0.28 : 0;
      group.add(label);
      return label;
    });

    const particleCount = 600;
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({ color: 0xbae6fd, size: 0.018, transparent: true, opacity: 0.75 })
    );
    scene.add(particles);

    let frame = 0;
    let animationId = 0;
    const animate = () => {
      frame += 0.012;
      group.rotation.y = Math.sin(frame) * 0.1 - 0.12;
      group.rotation.x = Math.sin(frame * 0.7) * 0.035;
      particles.rotation.y += 0.0015;
      bars.forEach((bar, index) => {
        const pulse = 1 + Math.sin(frame * 2 + index) * 0.055;
        bar.scale.y = pulse;
      });
      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(frame * 3 + index) * 0.16);
      });
      labels.forEach((label, index) => {
        label.position.y += Math.sin(frame + index) * 0.0009;
      });
      renderer.render(scene, camera);
      animationId = window.requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", resize);

    return () => {
      window.cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      panelGeometry.dispose();
      barMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      particlesGeometry.dispose();
      labelMaterials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}
