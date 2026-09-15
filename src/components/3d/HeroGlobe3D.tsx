"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import {
  Globe2,
  Radio,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
} from "lucide-react";

interface HeroGlobe3DProps {
  onSelectDomain: (domain: string) => void;
}

interface TechHub {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  domain: string;
  specialty: string;
  activeStories: number;
}

const TECH_HUBS: TechHub[] = [
  {
    id: "sf",
    name: "Silicon Valley",
    country: "USA",
    lat: 37.77,
    lon: -122.41,
    domain: "Artificial Intelligence",
    specialty: "Frontier Models & Compute",
    activeStories: 42,
  },
  {
    id: "tokyo",
    name: "Tokyo",
    country: "Japan",
    lat: 35.67,
    lon: 139.65,
    domain: "Robotics",
    specialty: "Humanoid & Micro-Actuators",
    activeStories: 28,
  },
  {
    id: "london",
    name: "London",
    country: "UK",
    lat: 51.50,
    lon: -0.12,
    domain: "Quantum Computing",
    specialty: "Quantum Algorithms & Policy",
    activeStories: 19,
  },
  {
    id: "bengaluru",
    name: "Bengaluru",
    country: "India",
    lat: 12.97,
    lon: 77.59,
    domain: "Cloud & Software",
    specialty: "Distributed Systems & Scale",
    activeStories: 34,
  },
  {
    id: "taipei",
    name: "Taipei / Hsinchu",
    country: "Taiwan",
    lat: 25.03,
    lon: 121.56,
    domain: "Semiconductors",
    specialty: "2nm Silicon & Lithography",
    activeStories: 31,
  },
  {
    id: "zurich",
    name: "Zurich / CERN",
    country: "Switzerland",
    lat: 46.23,
    lon: 6.05,
    domain: "Deep Tech",
    specialty: "Fundamental Physics & Superconductors",
    activeStories: 15,
  },
  {
    id: "boston",
    name: "Boston",
    country: "USA",
    lat: 42.36,
    lon: -71.05,
    domain: "Biotechnology",
    specialty: "Neural Interfaces & CRISPR",
    activeStories: 22,
  },
  {
    id: "singapore",
    name: "Singapore",
    country: "Singapore",
    lat: 1.35,
    lon: 103.82,
    domain: "Cybersecurity",
    specialty: "Zero-Trust & Quantum Encryption",
    activeStories: 18,
  },
];

// Helper: Convert geographic Lat/Lon to 3D Cartesian Vector matching Three.js equirectangular UV
const latLonToVector3 = (lat: number, lon: number, radius: number): THREE.Vector3 => {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
};

export const HeroGlobe3D: React.FC<HeroGlobe3DProps> = ({ onSelectDomain }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHub, setSelectedHub] = useState<TechHub | null>(null);
  const [hoveredHub, setHoveredHub] = useState<TechHub | null>(null);
  const [hubScreenPos, setHubScreenPos] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasWebGL, setHasWebGL] = useState<boolean>(true);
  const [isInteracting, setIsInteracting] = useState<boolean>(false);

  // References to communicate with render loop
  const globeRootRef = useRef<THREE.Group | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const activeHubPosRef = useRef<THREE.Vector3 | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setHasWebGL(false);
        setIsLoading(false);
        return;
      }
    } catch {
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 320;

    // ─── 1. Scene, Camera, Renderer ──────────────────────────────────────
    const scene = new THREE.Scene();

    // Field of view 34° gives a cinematic telephoto look (like from a satellite)
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 1000);
    // Adjust camera distance based on aspect ratio for commanding presence
    const updateCameraDistance = (w: number, h: number) => {
      const aspect = w / h;
      if (aspect < 1.0) {
        camera.position.z = 18.5; // Portrait mobile
      } else if (aspect < 1.4) {
        camera.position.z = 16.5; // Square / Tablet
      } else {
        camera.position.z = 15.0; // Widescreen desktop
      }
    };
    updateCameraDistance(width, height);
    camera.position.y = 0.3;
    cameraRef.current = camera;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
      });
    } catch (e) {
      console.warn("WebGL renderer creation failed", e);
      setHasWebGL(false);
      setIsLoading(false);
      return;
    }

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    const GLOBE_RADIUS = 4.8;
    const globeRoot = new THREE.Group();
    // Earth's natural 23.4° axial inclination
    globeRoot.rotation.x = 0.22;
    globeRoot.rotation.z = -0.08;
    scene.add(globeRoot);
    globeRootRef.current = globeRoot;

    // ─── 2. Photorealistic Multi-Layer Earth Textures ────────────────────
    const textureLoader = new THREE.TextureLoader();
    let texturesLoadedCount = 0;
    const totalTextures = 5;

    const onTextureProgress = () => {
      texturesLoadedCount++;
      if (texturesLoadedCount >= 2) {
        // As soon as base diffuse and lights are ready, show globe smoothly
        setIsLoading(false);
      }
    };

    const dayTexture = textureLoader.load("/textures/earth/earth_day.jpg", onTextureProgress);
    const nightTexture = textureLoader.load("/textures/earth/earth_lights.png", onTextureProgress);
    const specularTexture = textureLoader.load("/textures/earth/earth_specular.jpg", onTextureProgress);
    const normalTexture = textureLoader.load("/textures/earth/earth_normal.jpg", onTextureProgress);
    const cloudsTexture = textureLoader.load("/textures/earth/earth_clouds.png", onTextureProgress);

    dayTexture.colorSpace = THREE.SRGBColorSpace;
    nightTexture.colorSpace = THREE.SRGBColorSpace;
    cloudsTexture.colorSpace = THREE.SRGBColorSpace;

    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
    dayTexture.anisotropy = maxAnisotropy;
    nightTexture.anisotropy = maxAnisotropy;
    cloudsTexture.anisotropy = maxAnisotropy;

    // ─── 3. Fixed Celestial Sun Light Direction ──────────────────────────
    // Stationary sunlight in world space from upper-right
    const sunDirection = new THREE.Vector3(14.0, 5.0, 11.0).normalize();

    // ─── 4. Photorealistic Earth Surface Shader ──────────────────────────
    const earthSurfaceGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);
    const earthSurfaceMat = new THREE.ShaderMaterial({
      uniforms: {
        uDayMap: { value: dayTexture },
        uNightMap: { value: nightTexture },
        uSpecularMap: { value: specularTexture },
        uSunDirection: { value: sunDirection },
        uAtmosphereColor: { value: new THREE.Color(0x2f80ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          vec4 worldPos = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPos.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPos;
        }
      `,
      fragmentShader: `
        uniform sampler2D uDayMap;
        uniform sampler2D uNightMap;
        uniform sampler2D uSpecularMap;
        uniform vec3 uSunDirection;
        uniform vec3 uAtmosphereColor;

        varying vec2 vUv;
        varying vec3 vWorldNormal;
        varying vec3 vWorldPosition;

        void main() {
          vec3 normal = normalize(vWorldNormal);
          vec3 viewDir = normalize(cameraPosition - vWorldPosition);

          // Day Diffuse Color
          vec3 dayColor = texture2D(uDayMap, vUv).rgb;

          // Night City Lights (warm amber-gold boost)
          vec3 nightLights = texture2D(uNightMap, vUv).rgb;
          nightLights = pow(nightLights, vec3(1.25)) * vec3(1.4, 1.15, 0.85) * 2.4;

          // Ocean Specular Reflection
          float specIntensity = texture2D(uSpecularMap, vUv).r;
          vec3 halfVector = normalize(uSunDirection + viewDir);
          float NdotH = max(dot(normal, halfVector), 0.0);
          float specular = pow(NdotH, 36.0) * specIntensity * 1.6;
          vec3 specColor = vec3(0.9, 0.95, 1.0) * specular;

          // Sunlight calculation on surface
          float NdotL = dot(normal, uSunDirection);
          // Smooth day/night terminator transition
          float dayFactor = smoothstep(-0.15, 0.22, NdotL);

          // Daylight illumination (ambient + diffuse + specular)
          float diffuse = max(NdotL, 0.0) * 0.88 + 0.12;
          vec3 litDay = (dayColor * diffuse) + specColor;

          // Night side: glowing cities + subtle planetary starlight
          float nightFactor = 1.0 - dayFactor;
          vec3 litNight = nightLights * nightFactor + (dayColor * 0.025);

          // Blend Day & Night
          vec3 surfaceColor = mix(litNight, litDay, dayFactor);

          // Restrained atmospheric rim glow (Rayleigh scattering on limb)
          float fresnel = 1.0 - max(dot(normal, viewDir), 0.0);
          float rimGlow = pow(fresnel, 3.8) * 0.85;
          // Sunlight boosts rim on the lit horizon
          float sunRimBoost = max(dot(normal, uSunDirection), 0.0) * 0.5 + 0.5;
          vec3 atmosphereGlow = uAtmosphereColor * rimGlow * sunRimBoost;

          gl_FragColor = vec4(surfaceColor + atmosphereGlow, 1.0);
        }
      `,
    });

    const earthMesh = new THREE.Mesh(earthSurfaceGeo, earthSurfaceMat);
    globeRoot.add(earthMesh);

    // ─── 5. Realistic Cloud Sphere Layer ─────────────────────────────────
    const cloudsGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const cloudsMat = new THREE.ShaderMaterial({
      uniforms: {
        uCloudsMap: { value: cloudsTexture },
        uSunDirection: { value: sunDirection },
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vWorldNormal;
        void main() {
          vUv = uv;
          vWorldNormal = normalize(mat3(modelMatrix) * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D uCloudsMap;
        uniform vec3 uSunDirection;
        varying vec2 vUv;
        varying vec3 vWorldNormal;

        void main() {
          vec4 cloudSample = texture2D(uCloudsMap, vUv);
          float cloudDensity = cloudSample.r;

          // Sunlight on clouds
          float NdotL = dot(normalize(vWorldNormal), uSunDirection);
          float sunLit = max(NdotL, 0.0) * 0.85 + 0.15;
          float dayFade = smoothstep(-0.2, 0.15, NdotL);

          // High clouds catch sunlight brightly, dark side softly fades
          vec3 cloudColor = vec3(0.96, 0.98, 1.0) * sunLit;
          float alpha = cloudDensity * 0.70 * (dayFade * 0.85 + 0.15);

          gl_FragColor = vec4(cloudColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const cloudsMesh = new THREE.Mesh(cloudsGeo, cloudsMat);
    globeRoot.add(cloudsMesh);

    // ─── 6. Atmospheric Rayleigh Scattering Halo ─────────────────────────
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.15, 64, 64);
    const atmoMat = new THREE.ShaderMaterial({
      uniforms: {
        uSunDirection: { value: sunDirection },
        uAtmosphereColor: { value: new THREE.Color(0x2f80ff) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uAtmosphereColor;
        varying vec3 vNormal;

        void main() {
          // Thin electric blue atmosphere rim seen from orbital distance
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          gl_FragColor = vec4(uAtmosphereColor, 1.0) * intensity * 1.35;
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });

    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeRoot.add(atmoMesh);

    // ─── 7. Global Tech Radar Hub Markers ────────────────────────────────
    const hubsGroup = new THREE.Group();
    globeRoot.add(hubsGroup);

    interface HubObject {
      hub: TechHub;
      pos: THREE.Vector3;
      coreMesh: THREE.Mesh;
      ringMesh: THREE.Mesh;
      hitMesh: THREE.Mesh;
    }

    const hubObjects: HubObject[] = [];
    const hitMeshes: THREE.Mesh[] = [];

    // Subtle connecting data corridors
    const hubPositionsMap: Record<string, THREE.Vector3> = {};

    TECH_HUBS.forEach((hub) => {
      const pos = latLonToVector3(hub.lat, hub.lon, GLOBE_RADIUS + 0.04);
      hubPositionsMap[hub.id] = pos;

      // 1. Core Glowing Hub Marker
      const coreGeo = new THREE.SphereGeometry(0.07, 12, 12);
      const coreMat = new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
      });
      const coreMesh = new THREE.Mesh(coreGeo, coreMat);
      coreMesh.position.copy(pos);
      hubsGroup.add(coreMesh);

      // 2. Pulsing Radar Ping Ring
      const ringGeo = new THREE.RingGeometry(0.06, 0.13, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x2f80ff,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.002));
      ringMesh.lookAt(pos.clone().multiplyScalar(2.0));
      hubsGroup.add(ringMesh);

      // 3. Invisible Hit Target for accurate Raycasting
      const hitGeo = new THREE.SphereGeometry(0.32, 8, 8);
      const hitMat = new THREE.MeshBasicMaterial({
        visible: false,
      });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.copy(pos);
      hitMesh.userData = { hub };
      hubsGroup.add(hitMesh);
      hitMeshes.push(hitMesh);

      hubObjects.push({ hub, pos, coreMesh, ringMesh, hitMesh });
    });

    // ─── 8. Tech Network Orbital Arcs ────────────────────────────────────
    const TECH_CORRIDORS: [string, string][] = [
      ["sf", "tokyo"],
      ["sf", "london"],
      ["london", "zurich"],
      ["london", "bengaluru"],
      ["bengaluru", "singapore"],
      ["singapore", "taipei"],
      ["taipei", "tokyo"],
      ["sf", "boston"],
    ];

    const arcsGroup = new THREE.Group();
    globeRoot.add(arcsGroup);

    interface DataPulse {
      curve: THREE.QuadraticBezierCurve3;
      mesh: THREE.Mesh;
      speed: number;
      progress: number;
    }
    const dataPulses: DataPulse[] = [];

    const pulseGeo = new THREE.SphereGeometry(0.04, 6, 6);
    const pulseMat = new THREE.MeshBasicMaterial({
      color: 0x7dd3fc,
      transparent: true,
      opacity: 0.9,
    });

    TECH_CORRIDORS.forEach(([startId, endId]) => {
      const p1 = hubPositionsMap[startId];
      const p2 = hubPositionsMap[endId];
      if (!p1 || !p2) return;

      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5);
      const distance = p1.distanceTo(p2);
      const altitude = Math.min(distance * 0.22, 1.4);
      const midArc = mid.clone().normalize().multiplyScalar(GLOBE_RADIUS + altitude);

      const curve = new THREE.QuadraticBezierCurve3(p1, midArc, p2);
      const points = curve.getPoints(45);
      const curveGeo = new THREE.BufferGeometry().setFromPoints(points);

      const curveMat = new THREE.LineBasicMaterial({
        color: 0x2f80ff,
        transparent: true,
        opacity: 0.22,
      });
      const arcLine = new THREE.Line(curveGeo, curveMat);
      arcsGroup.add(arcLine);

      // Packet
      const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
      arcsGroup.add(pulseMesh);
      dataPulses.push({
        curve,
        mesh: pulseMesh,
        speed: 0.12 + Math.random() * 0.08,
        progress: Math.random(),
      });
    });

    // ─── 9. Distant Celestial Stars ──────────────────────────────────────
    const starCount = 380;
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const r = 35 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      starPositions[i3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i3 + 2] = r * Math.cos(phi);

      const isBlue = Math.random() > 0.65;
      starColors[i3] = isBlue ? 0.75 : 0.95;
      starColors[i3 + 1] = isBlue ? 0.85 : 0.95;
      starColors[i3 + 2] = 1.0;
    }

    const starsGeo = new THREE.BufferGeometry();
    starsGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starsGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const starsMat = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.65,
      sizeAttenuation: true,
    });
    const stars = new THREE.Points(starsGeo, starsMat);
    scene.add(stars);

    // ─── 10. Smooth Orbit Drag & Touch Controls ──────────────────────────
    let isDragging = false;
    let previousPointerX = 0;
    let previousPointerY = 0;
    let rotationVelocityX = 0;
    let rotationVelocityY = 0.0016; // Initial gentle rotation
    let lastInteractionTime = 0;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const getPointerPos = (e: MouseEvent | TouchEvent): { clientX: number; clientY: number } => {
      if ("touches" in e) {
        return {
          clientX: e.touches[0].clientX,
          clientY: e.touches[0].clientY,
        };
      }
      return { clientX: e.clientX, clientY: e.clientY };
    };

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      const pos = getPointerPos(e);
      isDragging = true;
      setIsInteracting(true);
      previousPointerX = pos.clientX;
      previousPointerY = pos.clientY;
      rotationVelocityX = 0;
      rotationVelocityY = 0;
      lastInteractionTime = Date.now();
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const rect = container.getBoundingClientRect();
      const pos = getPointerPos(e);

      // Update pointer for raycaster
      pointer.x = ((pos.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((pos.clientY - rect.top) / rect.height) * 2 + 1;

      if (isDragging) {
        const deltaX = pos.clientX - previousPointerX;
        const deltaY = pos.clientY - previousPointerY;

        rotationVelocityY = deltaX * 0.006;
        rotationVelocityX = deltaY * 0.004;

        globeRoot.rotation.y += rotationVelocityY;
        // Clamp tilt so earth doesn't flip upside down
        globeRoot.rotation.x = Math.max(-0.6, Math.min(0.8, globeRoot.rotation.x + rotationVelocityX));

        previousPointerX = pos.clientX;
        previousPointerY = pos.clientY;
        lastInteractionTime = Date.now();
      } else {
        // Raycast check for tech hubs when not dragging
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(hitMeshes, false);

        if (intersects.length > 0) {
          const hit = intersects[0].object.userData.hub as TechHub;
          setHoveredHub(hit);
          container.style.cursor = "pointer";

          // Calculate screen position for tooltip
          const worldPos = new THREE.Vector3();
          intersects[0].object.getWorldPosition(worldPos);
          // Check if hub is facing the camera (not around the back of Earth)
          const camDir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
          const normal = worldPos.clone().normalize();
          if (camDir.dot(normal) > 0.1) {
            worldPos.project(camera);
            const x = ((worldPos.x + 1) * rect.width) / 2;
            const y = ((-worldPos.y + 1) * rect.height) / 2;
            setHubScreenPos({ x, y });
            activeHubPosRef.current = worldPos;
          } else {
            setHoveredHub(null);
            setHubScreenPos(null);
          }
        } else {
          setHoveredHub(null);
          setHubScreenPos(null);
          container.style.cursor = "grab";
        }
      }
    };

    const handlePointerUp = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      isDragging = false;
      setIsInteracting(false);

      // If it was a clean tap without dragging, check for hub selection
      const deltaFromStart = Math.hypot(rotationVelocityX, rotationVelocityY);
      if (deltaFromStart < 0.002) {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObjects(hitMeshes, false);
        if (intersects.length > 0) {
          const hit = intersects[0].object.userData.hub as TechHub;
          setSelectedHub(hit);
          onSelectDomain(hit.domain);
        }
      }
    };

    // Attach interaction listeners
    container.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    container.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // ─── 11. Responsive Resize Observer ──────────────────────────────────
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      updateCameraDistance(w, h);
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // ─── 12. Main Render Loop ────────────────────────────────────────────
    let animId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Inertia & Auto-Rotation
      if (!isDragging) {
        // Friction damping on user fling
        rotationVelocityY *= 0.94;
        rotationVelocityX *= 0.94;

        // Auto-resume gentle majestic rotation after 1.8s of inactivity
        if (Date.now() - lastInteractionTime > 1800) {
          const idleSpeed = 0.0014;
          rotationVelocityY += (idleSpeed - rotationVelocityY) * 0.03;
        }

        globeRoot.rotation.y += rotationVelocityY;
        globeRoot.rotation.x = Math.max(-0.6, Math.min(0.8, globeRoot.rotation.x + rotationVelocityX));
      }

      // Independent orbital cloud drift (slightly faster than planet)
      cloudsMesh.rotation.y = globeRoot.rotation.y * 1.08 + elapsed * 0.008;

      // Pulse Radar Rings
      hubObjects.forEach((obj, idx) => {
        const pulse = 1.0 + Math.sin(elapsed * 3.5 + idx * 0.8) * 0.45;
        obj.ringMesh.scale.set(pulse, pulse, pulse);
        const mat = obj.ringMesh.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.85 - (pulse - 1.0) * 0.6;
      });

      // Travel pulses along data corridors
      dataPulses.forEach((dp) => {
        dp.progress += dp.speed * delta;
        if (dp.progress > 1) dp.progress = 0;
        const pos = dp.curve.getPoint(dp.progress);
        dp.mesh.position.copy(pos);
      });

      // Background stars slow drift
      stars.rotation.y = elapsed * 0.002;

      // Update screen position of hovered hub if active
      if (hoveredHub && container) {
        const hubObj = hubObjects.find((h) => h.hub.id === hoveredHub.id);
        if (hubObj) {
          const worldPos = new THREE.Vector3();
          hubObj.hitMesh.getWorldPosition(worldPos);

          const camDir = new THREE.Vector3().subVectors(camera.position, worldPos).normalize();
          const normal = worldPos.clone().normalize();

          // Hide if rotated to back side
          if (camDir.dot(normal) > 0.05) {
            worldPos.project(camera);
            const rect = container.getBoundingClientRect();
            const x = ((worldPos.x + 1) * rect.width) / 2;
            const y = ((-worldPos.y + 1) * rect.height) / 2;
            setHubScreenPos({ x, y });
          } else {
            setHoveredHub(null);
            setHubScreenPos(null);
          }
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // ─── Cleanup ─────────────────────────────────────────────────────────
    return () => {
      container.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      container.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      resizeObserver.disconnect();
      cancelAnimationFrame(animId);

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      earthSurfaceGeo.dispose();
      earthSurfaceMat.dispose();
      cloudsGeo.dispose();
      cloudsMat.dispose();
      atmoGeo.dispose();
      atmoMat.dispose();
      dayTexture.dispose();
      nightTexture.dispose();
      specularTexture.dispose();
      normalTexture.dispose();
      cloudsTexture.dispose();
      starsGeo.dispose();
      starsMat.dispose();
    };
  }, [onSelectDomain]);

  // Reset to default angle
  const handleResetOrientation = useCallback(() => {
    if (!globeRootRef.current) return;
    globeRootRef.current.rotation.x = 0.22;
    globeRootRef.current.rotation.y = 0;
  }, []);

  return (
    <div className="relative w-full h-full min-h-[280px] sm:min-h-[320px] flex items-center justify-center select-none overflow-hidden touch-none">
      {/* 3D WebGL Canvas Container */}
      <div
        ref={mountRef}
        className={`w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing transition-opacity duration-700 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        style={{ touchAction: "none" }}
      />

      {/* Loading Skeleton */}
      {isLoading && hasWebGL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#08090B]">
          <div className="w-16 h-16 rounded-full border border-sky-500/20 border-t-sky-400 animate-spin" />
          <div className="text-[10px] font-mono tracking-widest text-[#70737A] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
            <span>CALIBRATING ORBITAL TELEMETRY...</span>
          </div>
        </div>
      )}

      {/* Fallback if WebGL is unavailable */}
      {!hasWebGL && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#08090B]">
          <Globe2 className="w-12 h-12 text-[#2F80FF]/60 mb-2 animate-pulse" />
          <p className="text-xs font-mono text-[#F5F5F5] font-bold">GLOBAL TECH RADAR</p>
          <p className="text-[10px] font-mono text-[#70737A] mt-1">
            Orbital radar requires WebGL acceleration.
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-1.5">
            {TECH_HUBS.slice(0, 4).map((h) => (
              <button
                key={h.id}
                onClick={() => onSelectDomain(h.domain)}
                className="px-2.5 py-1 rounded text-[10px] font-mono bg-[#111317] border border-[#202328] text-[#2F80FF] hover:border-[#2F80FF]"
              >
                {h.name} · {h.domain}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Deep Celestial Blue Ambient Glow behind Earth */}
      <div
        className="absolute w-[280px] h-[280px] sm:w-[360px] sm:h-[360px] rounded-full pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30,100,220,0.18) 0%, rgba(14,60,140,0.06) 45%, transparent 75%)",
        }}
      />

      {/* Top HUD Strip */}
      <div className="absolute top-2.5 left-3 right-3 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-1.5 text-[9px] font-mono tracking-widest text-sky-400/80 bg-[#08090B]/85 px-2.5 py-1 rounded border border-[#202328] backdrop-blur-sm shadow-md">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping" />
          <span>RADAR ORBIT · 8 GLOBAL HUBS</span>
        </div>

        <button
          onClick={handleResetOrientation}
          aria-label="Reset orientation"
          className="pointer-events-auto flex items-center gap-1 text-[9px] font-mono text-[#70737A] hover:text-[#F5F5F5] bg-[#08090B]/85 px-2 py-1 rounded border border-[#202328] hover:border-[#2F80FF] backdrop-blur-sm transition-colors"
        >
          <RotateCcw className="w-2.5 h-2.5" />
          <span className="hidden xs:inline">RESET</span>
        </button>
      </div>

      {/* Bottom Telemetry HUD */}
      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between pointer-events-none z-20 text-[9px] font-mono text-[#70737A]">
        <div className="flex items-center gap-2 bg-[#08090B]/80 px-2 py-0.5 rounded border border-[#202328]/60 backdrop-blur-sm">
          <span className="text-sky-400">TOUCH / DRAG</span>
          <span>TO ROTATE</span>
        </div>

        <div className="flex items-center gap-2 bg-[#08090B]/80 px-2 py-0.5 rounded border border-[#202328]/60 backdrop-blur-sm">
          <span>DAY / NIGHT TERMINATOR</span>
          <span className="text-emerald-400 font-bold">•</span>
          <span className="text-[#F5F5F5]">ACTIVE</span>
        </div>
      </div>

      {/* Interactive Tooltip / Badge for Hovered Hub */}
      {hoveredHub && hubScreenPos && (
        <div
          style={{
            position: "absolute",
            left: `${hubScreenPos.x}px`,
            top: `${hubScreenPos.y - 12}px`,
            transform: "translate(-50%, -100%)",
            pointerEvents: "auto",
          }}
          onClick={() => onSelectDomain(hoveredHub.domain)}
          className="z-30 cursor-pointer animate-in fade-in zoom-in-95 duration-150"
        >
          <div className="group relative flex flex-col gap-1 p-2.5 min-w-[170px] rounded-md bg-[#0B0D11]/95 border border-[#2F80FF] shadow-2xl backdrop-blur-md hover:bg-[#11141A] transition-all">
            {/* Header */}
            <div className="flex items-center justify-between gap-2 border-b border-[#202328] pb-1">
              <div className="flex items-center gap-1 text-[9px] font-mono text-[#2F80FF] font-bold uppercase tracking-wider">
                <Radio className="w-3 h-3 text-[#2F80FF] animate-pulse" />
                <span>{hoveredHub.name}</span>
              </div>
              <span className="text-[8px] font-mono text-[#70737A] uppercase">
                {hoveredHub.country}
              </span>
            </div>

            {/* Specialty / Domain */}
            <div className="text-[11px] font-sans font-bold text-[#F5F5F5] group-hover:text-[#2F80FF] transition-colors leading-tight">
              {hoveredHub.domain}
            </div>
            <div className="text-[9px] font-mono text-[#A7A9AD]">
              {hoveredHub.specialty}
            </div>

            {/* Action Callout */}
            <div className="mt-1 pt-1 border-t border-[#202328]/70 flex items-center justify-between text-[9px] font-mono text-[#2F80FF]">
              <span>Filter coverage</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </div>

            {/* Downward indicator triangle */}
            <div className="absolute left-1/2 -bottom-1.5 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#2F80FF]" />
          </div>
        </div>
      )}
    </div>
  );
};
