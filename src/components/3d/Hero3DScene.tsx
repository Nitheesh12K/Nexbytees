"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export const Hero3DScene: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.035);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 24;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group to hold all 3D tech elements
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Core: Holographic Polyhedron
    const coreGeometry = new THREE.IcosahedronGeometry(4.2, 2);
    const coreWireframe = new THREE.WireframeGeometry(coreGeometry);
    const coreMaterial = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.45,
    });
    const coreLines = new THREE.LineSegments(coreWireframe, coreMaterial);
    mainGroup.add(coreLines);

    // 2. Inner Glowing Octahedron
    const innerGeo = new THREE.OctahedronGeometry(2.4, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0ea5e9,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: true,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerMesh);

    // 3. Orbital Ring Systems
    const ringGroup = new THREE.Group();
    mainGroup.add(ringGroup);

    const createRing = (radius: number, tube: number, color: number, rotX: number, rotY: number) => {
      const geo = new THREE.TorusGeometry(radius, tube, 16, 100);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.35,
        wireframe: true,
      });
      const ring = new THREE.Mesh(geo, mat);
      ring.rotation.x = rotX;
      ring.rotation.y = rotY;
      return ring;
    };

    const ring1 = createRing(6.8, 0.04, 0x38bdf8, Math.PI / 3, Math.PI / 6);
    const ring2 = createRing(8.2, 0.03, 0x60a5fa, -Math.PI / 4, Math.PI / 4);
    const ring3 = createRing(9.6, 0.03, 0x0284c7, Math.PI / 2.2, 0);
    ringGroup.add(ring1, ring2, ring3);

    // 4. Floating Hologram Shards (3D nodes)
    const shardsGroup = new THREE.Group();
    mainGroup.add(shardsGroup);

    const shardGeom = new THREE.BoxGeometry(0.6, 0.6, 0.08);
    const shardMat = new THREE.MeshStandardMaterial({
      color: 0x0369a1,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1,
      transparent: true,
      opacity: 0.7,
    });

    const shardCount = 18;
    const shards: THREE.Mesh[] = [];
    for (let i = 0; i < shardCount; i++) {
      const shard = new THREE.Mesh(shardGeom, shardMat);
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 6.5 + (i % 3) * 1.8;
      shard.position.x = Math.cos(angle) * radius;
      shard.position.y = (Math.sin(i * 1.5) * 2.8) + (Math.sin(angle) * 1.5);
      shard.position.z = Math.sin(angle) * radius;
      shard.rotation.x = Math.random() * Math.PI;
      shard.rotation.y = Math.random() * Math.PI;
      shardsGroup.add(shard);
      shards.push(shard);
    }

    // 5. Particle Field (Constellation / Data Streams)
    const particleCount = 1200;
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor1 = new THREE.Color(0x38bdf8);
    const baseColor2 = new THREE.Color(0x1e3a8a);
    const baseColor3 = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Spread across a wide volume
      positions[i] = (Math.random() - 0.5) * 70;
      positions[i + 1] = (Math.random() - 0.5) * 45;
      positions[i + 2] = (Math.random() - 0.5) * 55;

      const mixedColor =
        Math.random() > 0.6
          ? baseColor1
          : Math.random() > 0.3
          ? baseColor2
          : baseColor3;

      colors[i] = mixedColor.r;
      colors[i + 1] = mixedColor.g;
      colors[i + 2] = mixedColor.b;
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
    scene.add(ambientLight);

    const blueLight = new THREE.PointLight(0x38bdf8, 3.5, 40);
    blueLight.position.set(10, 10, 12);
    scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x0284c7, 2.5, 35);
    cyanLight.position.set(-12, -8, 8);
    scene.add(cyanLight);

    const cursorLight = new THREE.PointLight(0x60a5fa, 2, 25);
    cursorLight.position.set(0, 0, 15);
    scene.add(cursorLight);

    // Mouse Parallax Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      targetX = (x / rect.width) * 2;
      targetY = -(y / rect.height) * 2;
    };

    window.addEventListener("mousemove", onMouseMove);

    // Responsive Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth lerp mouse parallax
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      // Rotate central core
      coreLines.rotation.y = elapsedTime * 0.12;
      coreLines.rotation.x = Math.sin(elapsedTime * 0.08) * 0.2;

      innerMesh.rotation.y = -elapsedTime * 0.25;
      innerMesh.rotation.z = elapsedTime * 0.15;

      // Orbit rings
      ring1.rotation.z = elapsedTime * 0.1;
      ring2.rotation.y = elapsedTime * 0.08;
      ring3.rotation.x = elapsedTime * 0.12;

      // Shard rotation
      shards.forEach((shard, idx) => {
        shard.rotation.x += 0.008 * (idx % 2 === 0 ? 1 : -1);
        shard.rotation.y += 0.01;
        shard.position.y += Math.sin(elapsedTime * 2 + idx) * 0.004;
      });

      // Particle subtle drifting
      particleSystem.rotation.y = elapsedTime * 0.015;
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.05;

      // Apply parallax camera offset
      mainGroup.rotation.y = mouseX * 0.45;
      mainGroup.rotation.x = -mouseY * 0.35;
      cursorLight.position.x = mouseX * 12;
      cursorLight.position.y = mouseY * 8;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeometry.dispose();
      coreMaterial.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  );
};
