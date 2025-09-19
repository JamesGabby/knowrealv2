"use client";

import { Sansation } from "next/font/google";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Points,
  PointMaterial,
} from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useTexture } from "@react-three/drei";
import { Noise } from "noisejs"; // procedural noise
import AsteroidField from "./3d/asteroids/asteroids";

const sansation = Sansation({
  weight: "700",
  subsets: ["latin"],
  fallback: ["mono"],
});

const noise = new Noise(Math.random()); // seed for randomness

function JaggedAsteroid({
  position,
  size,
  rotationSpeed,
  seed,
}: {
  position: [number, number, number];
  size: number;
  rotationSpeed: [number, number, number];
  seed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  // Generate jagged geometry once in unit space with per-asteroid seed
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1, 4); // unit sphere
    const posAttr = geo.attributes.position;

    for (let i = 0; i < posAttr.count; i++) {
      const x = posAttr.getX(i);
      const y = posAttr.getY(i);
      const z = posAttr.getZ(i);

      // Apply unique seed offset per asteroid
      const n = noise.perlin3(x * 0.8 + seed, y * 0.8 + seed, z * 0.8 + seed);
      const factor = 1 + n * 0.35;
      posAttr.setXYZ(i, x * factor, y * factor, z * factor);
    }

    posAttr.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, [seed]); // depend on seed

  // Load PBR textures
  const [colorMap, normalMap, roughnessMap, aoMap] = useTexture([
    "/textures/asteroid/color.jpg",
    "/textures/asteroid/normal2.jpg",
    "/textures/asteroid/roughness.jpg",
    "/textures/asteroid/ao.jpg",
  ]);

  // Animate rotation
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.x += rotationSpeed[0];
      ref.current.rotation.y += rotationSpeed[1];
      ref.current.rotation.z += rotationSpeed[2];
    }
  });

  return (
    <mesh ref={ref} position={position} scale={size}>
      <primitive object={geometry} attach="geometry" />
      <meshStandardMaterial
        map={colorMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        aoMap={aoMap}
        metalness={0.1}
        roughness={0.9}
        depthWrite
      />
    </mesh>
  );
}


// 🌌 Procedural starfield layer
function StarLayer({
  count,
  spread,
  size,
  baseSpeed,
  colorA,
  colorB,
}: {
  count: number;
  spread: number;
  size: number;
  baseSpeed: number;
  colorA: string;
  colorB: string;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<any>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(spread);
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(spread);
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(spread);
    }
    return pos;
  }, [count, spread]);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    const pulse = (Math.sin((t / 12) * Math.PI * 2) + 1) / 2;

    if (points.current) {
      const speed = baseSpeed * (0.5 + pulse * 0.5);
      points.current.rotation.x -= delta * speed;
      points.current.rotation.y -= delta * speed * 0.6;
    }

    if (material.current) {
      const col = new THREE.Color(colorA).lerp(new THREE.Color(colorB), pulse);
      material.current.color = col;
    }
  });

  return (
    <Points ref={points} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        ref={material}
        transparent
        size={size}
        sizeAttenuation
        depthWrite={false}
      />
    </Points>
  );
}

function Asteroids({ count = 300 }) {
  const asteroids = useMemo(() => {
    return new Array(count).fill(null).map(() => ({
      position: [
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100),
        THREE.MathUtils.randFloatSpread(100),
      ] as [number, number, number],
      size: THREE.MathUtils.randFloat(0.2, 0.8),
      rotationSpeed: [
        Math.random() * 0.01,
        Math.random() * 0.01,
        Math.random() * 0.01,
      ] as [number, number, number],
      seed: Math.random() * 1000, // 🔑 unique seed
    }));
  }, [count]);

  return (
    <>
      {asteroids.map((a, i) => (
        <JaggedAsteroid
          key={i}
          position={a.position}
          size={a.size}
          rotationSpeed={a.rotationSpeed}
          seed={a.seed}
        />
      ))}
    </>
  );
}

/* Helpers */
function randomStart() {
  // spread in X/Y, start Z further back
  return new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(400), // x ∼ [-200,200]
    THREE.MathUtils.randFloatSpread(300), // y ∼ [-150,150]
    THREE.MathUtils.randFloat(-350, -50)  // z ∼ [-350,-50]
  );
}
function randomVelocity() {
  const dir = new THREE.Vector3(
    THREE.MathUtils.randFloatSpread(1),
    THREE.MathUtils.randFloatSpread(1),
    THREE.MathUtils.randFloatSpread(1)
  ).normalize();
  const speed = THREE.MathUtils.randFloat(60, 140); // units/sec (tuneable)
  return dir.multiplyScalar(speed);
}

/* Single shooting star - tip = mesh.position, base leads forward */
function ShootingStar({
  length = 3,
  baseRadius = 0.18,
}: {
  length?: number;
  baseRadius?: number;
}) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const velocityRef = useRef(new THREE.Vector3());
  const startRef = useRef(new THREE.Vector3());

  // Build cone geometry once: put tip at origin and make cone extend to -Z
  const coneGeometry = useMemo(() => {
    const h = length;
    const radius = baseRadius;
    const g = new THREE.ConeGeometry(radius, h, 8, 1);
    // Many Three geometries are centered; move tip to origin:
    // For a Cone geometry the tip sits at +h/2 (centered at origin), so translate down by h/2:
    g.translate(0, -h / 2, 0);     // move tip to (0,0,0) along Y
    g.rotateX(Math.PI / 2);       // rotate so cone axis runs along Z (tip at z=0, base at z=-h)
    return g;
    // note: we intentionally do not call computeBoundingBox here
  }, [length, baseRadius]);

  // initialize
  useEffect(() => {
    startRef.current.copy(randomStart());
    velocityRef.current.copy(randomVelocity());

    if (meshRef.current) {
      meshRef.current.position.copy(startRef.current);

      // orient so the cone's local tip->base vector (0,0,-1) maps to velocity direction:
      const axisFrom = new THREE.Vector3(0, 0, -1);
      const axisTo = velocityRef.current.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(axisFrom, axisTo);
      meshRef.current.quaternion.copy(q);
    }
  }, [coneGeometry]); // run once (coneGeometry stable)

  // animate + respawn
  useFrame((_, delta) => {
    const m = meshRef.current;
    if (!m) return;

    // move
    m.position.addScaledVector(velocityRef.current, delta);

    // optional tiny spin for variation
    m.rotation.x += 0.02 * delta;
    m.rotation.z += 0.02 * delta;

    // If it leaves scene bounds, respawn + reorient
    const maxDist = 600;
    if (m.position.length() > maxDist) {
      startRef.current.copy(randomStart());
      velocityRef.current.copy(randomVelocity());

      m.position.copy(startRef.current);

      const axisFrom = new THREE.Vector3(0, 0, -1);
      const axisTo = velocityRef.current.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(axisFrom, axisTo);
      m.quaternion.copy(q);
    }
  });

  return (
    <mesh ref={meshRef} geometry={coneGeometry}>
      <meshBasicMaterial
        transparent
        opacity={0.95}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

/* Group wrapper */
export function ShootingStars({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <ShootingStar key={i} length={3} baseRadius={0.18} />
      ))}
    </>
  );
}

// 🎥 Camera breathing + drag control
function CameraController() {
  const { camera } = useThree();
  const isDragging = useRef(false);
  const lastMouse = useRef({ x: 0, y: 0 });
  const rotation = useRef({ x: 0, y: 0 });

  // limits (radians)
  const MAX_Y = Math.PI / 4; // up/down limit (45°)
  const MIN_Y = -Math.PI / 4;
  const MAX_X = Math.PI / 3; // left/right limit (60°)
  const MIN_X = -Math.PI / 3;

  useEffect(() => {
    const handleDown = (e: MouseEvent) => {
      isDragging.current = true;
      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    const handleUp = () => {
      isDragging.current = false;
    };

    const handleMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = (e.clientX - lastMouse.current.x) * 0.002;
      const dy = (e.clientY - lastMouse.current.y) * 0.002;

      rotation.current.x += dx;
      rotation.current.y += dy;

      // clamp values
      rotation.current.x = Math.max(MIN_X, Math.min(MAX_X, rotation.current.x));
      rotation.current.y = Math.max(MIN_Y, Math.min(MAX_Y, rotation.current.y));

      lastMouse.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    window.addEventListener("mousemove", handleMove);

    return () => {
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (Math.sin((t / 8) * Math.PI * 2) + 1) / 2;
    const baseZ = 1 + (pulse - 0.5) * 0.05;

    camera.position.x = Math.sin(rotation.current.x) * 3;
    camera.position.y = rotation.current.y * 2;
    camera.position.z = baseZ + Math.cos(rotation.current.x) * 3;

    camera.lookAt(0, 0, 0);
  });

  return null;
}


export function Hero({ data }: { data?: any }) {
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
      <Canvas className="absolute inset-0 bg-black" camera={{ position: [0, 0, 1], fov: 75 }}>

        <ambientLight intensity={0.3} />
        <pointLight position={[20, 20, 20]} intensity={1} />
        <CameraController />
        

        {/* Depth starfield */}
        <StarLayer count={150000} spread={600} size={0.15} baseSpeed={0.006} colorA="#a0c4ff" colorB="#ffcad4" />
        <StarLayer count={8000} spread={300} size={0.7} baseSpeed={0.004} colorA="#ffffff" colorB="#ffd6ff" />

        {/* Space features */}
        <AsteroidField />
        <ShootingStars count={2} />
        
      </Canvas>

      {/* Foreground Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center gap-8 px-6"
      >
        <div className="absolute inset-0 bg-gradient-radial from-black/70 via-black/30 to-transparent blur-3xl -z-10" />
        <h1
          className={`${sansation.className} text-5xl lg:text-7xl tracking-wide`}
        >
          KNOW REAL
        </h1>
        <p className="text-lg lg:text-2xl leading-tight max-w-xl">
          <code>
            Get to <span className="font-bold">know</span> reality.
          </code>
        </p>
        <Link
          href={data ? "/protected" : "/auth/login"}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-8 py-4 rounded-2xl shadow-lg hover:bg-white/20 transition text-lg font-semibold animate-pulse-slow"
        >
          <LogIn />
          <span>Enter</span>
        </Link>
        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent my-8" />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="text-white/60 "
        >
          ↓ Scroll to discover more
        </motion.div>
      </motion.div>
    </div>
  );
}
