"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Brain, Bot, Atom, Rocket } from "lucide-react";

interface HeroGlobe3DProps {
  onSelectDomain: (domain: string) => void;
}

export const HeroGlobe3D: React.FC<HeroGlobe3DProps> = ({ onSelectDomain }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    // ─── Scene, Camera, Renderer ───────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 1000);
    camera.position.z = 21;
    camera.position.y = 0.4;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const globeRoot = new THREE.Group();
    scene.add(globeRoot);

    // Earth axial tilt: ~23.4°
    globeRoot.rotation.x = 0.24;
    globeRoot.rotation.z = -0.1;

    const GLOBE_RADIUS = 5.0;

    // ─── 1. Earth Ocean Core ────────────────────────────────────────────────
    // Deep realistic ocean: dark navy-blue with slight shimmer
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS - 0.02, 64, 64);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x03080f,
      emissive: 0x010610,
      emissiveIntensity: 0.5,
      shininess: 60,
    });
    const coreSphere = new THREE.Mesh(coreGeo, coreMat);
    globeRoot.add(coreSphere);

    // ─── 2. Coordinate Helper ───────────────────────────────────────────────
    const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    // ─── 3. Land Coordinate Check ───────────────────────────────────────────
    const isLandCoordinate = (lat: number, lon: number): boolean => {
      // North America
      if (lat >= 15 && lat <= 72 && lon >= -168 && lon <= -52) {
        if (lat < 25 && lon < -95) return false; // Gulf of Mexico
        if (lat > 60 && lon < -140 && lat < 65) return false; // Alaska coastline
        return true;
      }
      // Greenland
      if (lat >= 60 && lat <= 83 && lon >= -55 && lon <= -18) return true;
      // South America
      if (lat >= -56 && lat <= 13 && lon >= -82 && lon <= -34) {
        if (lon < -75 && lat < -22) return false;
        return true;
      }
      // Europe (incl Iberia, Scandinavia)
      if (lat >= 36 && lat <= 71 && lon >= -10 && lon <= 40) return true;
      if (lat >= 55 && lat <= 71 && lon >= 15 && lon <= 30) return true; // Scandinavia east
      // Africa
      if (lat >= -35 && lat <= 37 && lon >= -18 && lon <= 52) {
        if (lon > 43 && lat < 5) return false; // Indian Ocean inlet
        return true;
      }
      // Middle East / Arabian Peninsula
      if (lat >= 12 && lat <= 38 && lon >= 35 && lon <= 60) return true;
      // Asia (mainland)
      if (lat >= 5 && lat <= 77 && lon >= 45 && lon <= 145) {
        if (lat < 20 && lon < 70 && lon > 55) return false; // Arabian Sea
        if (lat < 10 && lon > 100) return false; // SE Asia water
        return true;
      }
      // Southeast Asia islands
      if (lat >= -8 && lat <= 20 && lon >= 95 && lon <= 127) return true;
      // Japan archipelago
      if (lat >= 30 && lat <= 45 && lon >= 130 && lon <= 145) return true;
      // Taiwan
      if (lat >= 22 && lat <= 25 && lon >= 120 && lon <= 122) return true;
      // Sri Lanka
      if (lat >= 6 && lat <= 10 && lon >= 79 && lon <= 82) return true;
      // Australia
      if (lat >= -45 && lat <= -10 && lon >= 113 && lon <= 154) {
        if (lon > 137 && lat < -35) return false;
        return true;
      }
      // New Zealand
      if (lat >= -47 && lat <= -34 && lon >= 166 && lon <= 178) return true;
      // British Isles
      if (lat >= 50 && lat <= 59 && lon >= -8 && lon <= 2) return true;
      // Iceland
      if (lat >= 63 && lat <= 67 && lon >= -24 && lon <= -13) return true;
      // Madagascar
      if (lat >= -26 && lat <= -12 && lon >= 43 && lon <= 50) return true;

      return false;
    };

    // ─── 4. High-Fidelity Continent Dot Map ─────────────────────────────────
    // 14,000 samples → dense, realistic continent silhouettes
    const totalSamples = 14000;
    const landPoints: THREE.Vector3[] = [];
    const colors: number[] = [];

    // Premium color palette: warm continental whites + cool coastal blues
    const continentCoreColor = new THREE.Color(0xd4dde8); // warm grey-white
    const continentMidColor = new THREE.Color(0x8fa8c0);  // steel blue-grey
    const coastalColor = new THREE.Color(0x4a9ede);       // medium blue
    const coastalBrightColor = new THREE.Color(0x7ec8f0); // bright coastal

    for (let i = 0; i < totalSamples; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalSamples);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const lat = 90 - (phi * 180) / Math.PI;
      const lon = ((theta * 180) / Math.PI) % 360 - 180;

      if (isLandCoordinate(lat, lon)) {
        const pos = latLonToVector3(lat, lon, GLOBE_RADIUS + 0.03);
        landPoints.push(pos);

        const rand = Math.random();
        let col: THREE.Color;
        if (rand > 0.88) {
          col = continentCoreColor;
        } else if (rand > 0.65) {
          col = continentMidColor;
        } else if (rand > 0.35) {
          col = coastalColor;
        } else {
          col = coastalBrightColor;
        }
        colors.push(col.r, col.g, col.b);
      }
    }

    const pointsGeo = new THREE.BufferGeometry().setFromPoints(landPoints);
    pointsGeo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    const continentPoints = new THREE.Points(pointsGeo, pointsMat);
    globeRoot.add(continentPoints);

    // ─── 5. City Light Nodes — Nightside Urban Glow ────────────────────────
    const MAJOR_CITIES = [
      // North America
      { lat: 40.7, lon: -74.0 },   // New York
      { lat: 34.0, lon: -118.2 },  // Los Angeles
      { lat: 41.8, lon: -87.6 },   // Chicago
      { lat: 37.4, lon: -122.1 },  // Silicon Valley
      { lat: 43.7, lon: -79.4 },   // Toronto
      { lat: 19.4, lon: -99.1 },   // Mexico City
      // Europe
      { lat: 51.5, lon: -0.1 },    // London
      { lat: 48.9, lon: 2.3 },     // Paris
      { lat: 52.5, lon: 13.4 },    // Berlin
      { lat: 41.9, lon: 12.5 },    // Rome
      { lat: 40.4, lon: -3.7 },    // Madrid
      { lat: 55.8, lon: 37.6 },    // Moscow
      // Asia
      { lat: 35.7, lon: 139.7 },   // Tokyo
      { lat: 31.2, lon: 121.5 },   // Shanghai
      { lat: 39.9, lon: 116.4 },   // Beijing
      { lat: 22.5, lon: 114.1 },   // Hong Kong / Shenzhen
      { lat: 1.35, lon: 103.8 },   // Singapore
      { lat: 28.6, lon: 77.2 },    // New Delhi
      { lat: 12.9, lon: 77.6 },    // Bengaluru
      { lat: 19.1, lon: 72.9 },    // Mumbai
      { lat: 37.6, lon: 127.0 },   // Seoul
      { lat: 23.1, lon: 113.3 },   // Guangzhou
      { lat: 25.2, lon: 55.3 },    // Dubai
      // Africa & Oceania
      { lat: -33.9, lon: 18.4 },   // Cape Town
      { lat: -1.3, lon: 36.8 },    // Nairobi
      { lat: -33.9, lon: 151.2 },  // Sydney
      { lat: -37.8, lon: 144.9 },  // Melbourne
      // South America
      { lat: -23.5, lon: -46.6 },  // São Paulo
      { lat: -34.6, lon: -58.4 },  // Buenos Aires
      { lat: -12.0, lon: -77.0 },  // Lima
    ];

    const cityLightsGroup = new THREE.Group();
    globeRoot.add(cityLightsGroup);

    MAJOR_CITIES.forEach((city) => {
      const pos = latLonToVector3(city.lat, city.lon, GLOBE_RADIUS + 0.05);

      // Core city node — bright warm white
      const coreGeo = new THREE.SphereGeometry(0.055, 8, 8);
      const coreCityMat = new THREE.MeshBasicMaterial({
        color: 0xfff8e7,
        transparent: true,
        opacity: 0.95,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreCityMat);
      coreMesh.position.copy(pos);
      cityLightsGroup.add(coreMesh);

      // Outer glow halo — amber/orange warmth
      const haloGeo = new THREE.SphereGeometry(0.14, 8, 8);
      const haloMat = new THREE.MeshBasicMaterial({
        color: 0xffb347,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      haloMesh.position.copy(pos);
      cityLightsGroup.add(haloMesh);
    });

    // ─── 6. Tech Hub Network Arcs (refined, subtle) ─────────────────────────
    const TECH_HUBS = [
      { lat: 37.4, lon: -122.1 },  // Silicon Valley
      { lat: 40.7, lon: -74.0 },   // New York
      { lat: 51.5, lon: -0.1 },    // London
      { lat: 48.9, lon: 2.3 },     // Paris
      { lat: 35.7, lon: 139.7 },   // Tokyo
      { lat: 12.9, lon: 77.6 },    // Bengaluru
      { lat: 1.35, lon: 103.8 },   // Singapore
      { lat: -33.9, lon: 151.2 },  // Sydney
      { lat: 22.5, lon: 114.1 },   // Shenzhen
    ];

    const hubPositions: THREE.Vector3[] = TECH_HUBS.map((hub) =>
      latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS + 0.06)
    );

    const arcConnections = [
      [0, 1], [1, 2], [2, 3], [2, 4],
      [4, 8], [8, 6], [6, 5], [0, 4], [6, 7],
    ];

    const arcsGroup = new THREE.Group();
    globeRoot.add(arcsGroup);

    interface PulseData {
      curve: THREE.QuadraticBezierCurve3;
      mesh: THREE.Mesh;
      speed: number;
      progress: number;
    }
    const pulsePulses: PulseData[] = [];

    const pulseGeom = new THREE.SphereGeometry(0.045, 6, 6);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.85,
    });

    arcConnections.forEach(([i, j]) => {
      const p1 = hubPositions[i];
      const p2 = hubPositions[j];
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const lift = Math.min(distance * 0.3, 2.0);
      const midArc = mid.clone().normalize().multiplyScalar(GLOBE_RADIUS + lift);

      const curve = new THREE.QuadraticBezierCurve3(p1, midArc, p2);
      const points = curve.getPoints(50);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: 0x4a9ede,
        transparent: true,
        opacity: 0.28,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);

      const pulseMesh = new THREE.Mesh(pulseGeom, pulseMat);
      arcsGroup.add(pulseMesh);
      pulsePulses.push({
        curve,
        mesh: pulseMesh,
        speed: 0.1 + Math.random() * 0.1,
        progress: Math.random(),
      });
    });

    // ─── 7. Three-Layer Realistic Atmosphere ────────────────────────────────

    // Layer A: Outer deep-space fade (very subtle blue haze)
    const atmoOuterGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.22, 48, 48);
    const atmoOuterMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.55 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
          gl_FragColor = vec4(0.05, 0.30, 0.65, 1.0) * intensity * 1.2;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmoOuter = new THREE.Mesh(atmoOuterGeo, atmoOuterMat);
    globeRoot.add(atmoOuter);

    // Layer B: Mid-atmosphere cobalt blue scatter band
    const atmoMidGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.12, 48, 48);
    const atmoMidMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.68 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.4);
          gl_FragColor = vec4(0.08, 0.50, 0.92, 1.0) * intensity * 1.8;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmoMid = new THREE.Mesh(atmoMidGeo, atmoMidMat);
    globeRoot.add(atmoMid);

    // Layer C: Inner warm limb glow (sunrise/terminator rim)
    const atmoInnerGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.05, 48, 48);
    const atmoInnerMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float intensity = pow(rim, 4.5) * 0.9;
          // Warm sunrise orange-white on the terminator
          vec3 warmColor = vec3(0.85, 0.55, 0.20);
          vec3 coolColor = vec3(0.15, 0.55, 0.95);
          vec3 finalColor = mix(coolColor, warmColor, pow(rim, 6.0));
          gl_FragColor = vec4(finalColor, 1.0) * intensity;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
    const atmoInner = new THREE.Mesh(atmoInnerGeo, atmoInnerMat);
    globeRoot.add(atmoInner);

    // ─── 8. Subtle Equatorial Depth Ring (very faint, for spatial grounding) ─
    const eqRingGeo = new THREE.TorusGeometry(GLOBE_RADIUS * 1.35, 0.012, 12, 160);
    const eqRingMat = new THREE.MeshBasicMaterial({
      color: 0x4a9ede,
      transparent: true,
      opacity: 0.07,
    });
    const eqRing = new THREE.Mesh(eqRingGeo, eqRingMat);
    eqRing.rotation.x = Math.PI / 2;
    globeRoot.add(eqRing);

    // ─── 9. Scene Lighting for the Earth Sphere ──────────────────────────────
    const sunLight = new THREE.DirectionalLight(0xfff5e0, 2.2);
    sunLight.position.set(12, 4, 10);
    scene.add(sunLight);

    const fillLight = new THREE.AmbientLight(0x080c20, 0.8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0x1a6fa8, 1.5, 35);
    rimLight.position.set(-10, 3, -8);
    scene.add(rimLight);

    // ─── 10. Deep Space Star Field ──────────────────────────────────────────
    const starCount = 500;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    const starWhite = new THREE.Color(0xffffff);
    const starBlue = new THREE.Color(0xc8dfff);
    const starWarm = new THREE.Color(0xfff8dc);

    for (let s = 0; s < starCount * 3; s += 3) {
      const r = 38 + Math.random() * 15;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[s] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[s + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[s + 2] = r * Math.cos(phi);

      const col = Math.random() > 0.7 ? starBlue : Math.random() > 0.4 ? starWhite : starWarm;
      starColors[s] = col.r;
      starColors[s + 1] = col.g;
      starColors[s + 2] = col.b;
    }

    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starMat = new THREE.PointsMaterial({
      size: 0.12,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // ─── Mouse Tracking ──────────────────────────────────────────────────────
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      targetX = x * 0.28;
      targetY = -y * 0.22;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // ─── Resize Handler ──────────────────────────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(() => handleResize());
    resizeObserver.observe(container);

    // ─── Animation Loop ──────────────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth lerped mouse parallax
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;

      // Deliberate slow rotation — premium, not frantic
      globeRoot.rotation.y = elapsed * 0.045 + currentX;
      globeRoot.rotation.x = 0.24 + currentY;

      // Subtle equatorial ring pulse
      eqRing.rotation.z = elapsed * 0.02;

      // Data pulse packets along arcs
      pulsePulses.forEach((pulse) => {
        pulse.progress += pulse.speed * delta;
        if (pulse.progress > 1) pulse.progress = 0;
        const currentPos = pulse.curve.getPoint(pulse.progress);
        pulse.mesh.position.copy(currentPos);
      });

      // Gentle star field drift
      stars.rotation.y = elapsed * 0.004;

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ──────────────────────────────────────────────────────────────
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      pointsGeo.dispose();
      pointsMat.dispose();
      atmoOuterGeo.dispose();
      atmoOuterMat.dispose();
      atmoMidGeo.dispose();
      atmoMidMat.dispose();
      atmoInnerGeo.dispose();
      atmoInnerMat.dispose();
      eqRingGeo.dispose();
      eqRingMat.dispose();
      starGeo.dispose();
      starMat.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] sm:h-[550px] lg:h-[620px] flex items-center justify-center select-none">
      {/* WebGL Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none"
      />

      {/* Deep radial bloom behind Earth */}
      <div className="absolute w-80 h-80 sm:w-[420px] sm:h-[420px] rounded-full pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse, rgba(14,100,200,0.1) 0%, rgba(14,100,200,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Telemetry label — top center */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-sky-400/70 bg-black/50 px-3 py-1 rounded-full border border-sky-500/15 backdrop-blur-md pointer-events-none z-20">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
        <span>GLOBAL TECH NETWORK — LIVE</span>
      </div>

      {/* Side labels */}
      <div className="absolute left-1 top-1/2 -translate-y-1/2 -rotate-90 hidden sm:flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-500/70 pointer-events-none z-20">
        <span>LAT 37.4°N</span>
        <span className="text-sky-500/60 font-bold">•</span>
        <span>SILICON VALLEY</span>
      </div>

      <div className="absolute right-1 top-1/2 -translate-y-1/2 rotate-90 hidden sm:flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-500/70 pointer-events-none z-20">
        <span>NEXBYTEES</span>
        <span className="text-sky-500/60 font-bold">•</span>
        <span>CONNECTED</span>
      </div>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 text-[9px] font-mono tracking-widest text-slate-500/60 pointer-events-none z-20">
        <span>EARTH — 30 CITIES — {new Date().getFullYear()}</span>
      </div>

      {/* SVG connection lines — Earth to cards */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4a9ede" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a9ede" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lg2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a9ede" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a9ede" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d="M 170 130 C 230 175, 258 215, 282 265" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 430 130 C 370 175, 342 215, 318 265" stroke="url(#lg2)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 170 470 C 228 422, 258 378, 282 335" stroke="url(#lg1)" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 430 470 C 372 422, 342 378, 318 335" stroke="url(#lg2)" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* FOUR DOMAIN GLASS PANELS */}

      {/* TOP-LEFT: AI */}
      <div
        onClick={() => onSelectDomain("Artificial Intelligence")}
        style={{
          transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * -8}px, 0)`,
          transition: "transform 0.18s ease-out",
        }}
        className="absolute top-8 sm:top-12 left-2 sm:left-4 z-20 cursor-pointer group"
      >
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-black/65 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] hover:border-white/20 hover:bg-black/75 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-400/25 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:bg-sky-500/20 transition-all">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/90 group-hover:text-white uppercase tracking-widest font-mono">
              AI
            </div>
            <div className="text-[10px] text-white/40 font-normal mt-0.5">
              Smarter Tomorrow
            </div>
          </div>
        </div>
      </div>

      {/* TOP-RIGHT: ROBOTICS */}
      <div
        onClick={() => onSelectDomain("Robotics")}
        style={{
          transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * -8}px, 0)`,
          transition: "transform 0.18s ease-out",
        }}
        className="absolute top-8 sm:top-12 right-2 sm:right-4 z-20 cursor-pointer group"
      >
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-black/65 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] hover:border-white/20 hover:bg-black/75 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-400/25 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:bg-sky-500/20 transition-all">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/90 group-hover:text-white uppercase tracking-widest font-mono">
              ROBOTICS
            </div>
            <div className="text-[10px] text-white/40 font-normal mt-0.5">
              Humans. Amplified.
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-LEFT: QUANTUM */}
      <div
        onClick={() => onSelectDomain("Quantum Computing")}
        style={{
          transform: `translate3d(${mousePos.x * -10}px, ${mousePos.y * 10}px, 0)`,
          transition: "transform 0.18s ease-out",
        }}
        className="absolute bottom-8 sm:bottom-12 left-2 sm:left-4 z-20 cursor-pointer group"
      >
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-black/65 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] hover:border-white/20 hover:bg-black/75 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-400/25 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:bg-sky-500/20 transition-all">
            <Atom className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/90 group-hover:text-white uppercase tracking-widest font-mono">
              QUANTUM
            </div>
            <div className="text-[10px] text-white/40 font-normal mt-0.5">
              Beyond the Limits
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM-RIGHT: SPACE */}
      <div
        onClick={() => onSelectDomain("Space Technology")}
        style={{
          transform: `translate3d(${mousePos.x * 10}px, ${mousePos.y * 10}px, 0)`,
          transition: "transform 0.18s ease-out",
        }}
        className="absolute bottom-8 sm:bottom-12 right-2 sm:right-4 z-20 cursor-pointer group"
      >
        <div className="flex items-center gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-black/65 border border-white/10 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.9)] hover:border-white/20 hover:bg-black/75 transition-all duration-300">
          <div className="w-8 h-8 rounded-lg bg-sky-500/12 border border-sky-400/25 flex items-center justify-center text-sky-400 group-hover:border-sky-400/50 group-hover:bg-sky-500/20 transition-all">
            <Rocket className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white/90 group-hover:text-white uppercase tracking-widest font-mono">
              SPACE
            </div>
            <div className="text-[10px] text-white/40 font-normal mt-0.5">
              Further. Faster.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
