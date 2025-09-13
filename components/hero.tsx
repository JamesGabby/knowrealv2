"use client";

import { Sansation } from "next/font/google";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Canvas } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { motion } from "framer-motion";
import { useFrame, useThree } from "@react-three/fiber";

const sansation = Sansation({
  weight: "700",
  subsets: ["latin"],
  fallback: ["mono"],
});

// 🌌 Star layer with breathing + color shift
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
    const pulse = (Math.sin((t / 6) * Math.PI * 2) + 1) / 2;

    if (points.current) {
      const speed = baseSpeed * (0.5 + pulse);
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

// 🎥 Camera breathing effect
function CameraController() {
  const { camera } = useThree();
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const pulse = (Math.sin((t / 6) * Math.PI * 2) + 1) / 2;
    camera.position.z = 1 + (pulse - 0.5) * 0.2; // zoom in/out
  });
  return null;
}

export function Hero({ data }: { data?: any }) {
  console.log(data);
  return (
    <div className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden">
      {/* 🌌 Galaxy Background */}
      <Canvas className="absolute inset-0" camera={{ position: [0, 0, 1] }}>
        <CameraController /> 
        <StarLayer
          count={10000}
          spread={300}
          size={0.3}
          baseSpeed={0.01}
          colorA="#a0c4ff"
          colorB="#ffcad4"
        />
        <StarLayer
          count={5000}
          spread={300}
          size={0.5}
          baseSpeed={0.01}
          colorA="#a0c4ff"
          colorB="#ffcad4"
        />
        <StarLayer
          count={2000}
          spread={200}
          size={0.8}
          baseSpeed={0.008}
          colorA="#ffcad4"
          colorB="#cba6f7"
        />
        <StarLayer
          count={1000}
          spread={100}
          size={1}
          baseSpeed={0.006}
          colorA="#ffffff"
          colorB="#a0c4ff"
        />
      </Canvas>

      {/* 🔮 Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 flex flex-col items-center text-center gap-8 px-6"
      >
        {/* Soft radial background for readability */}
        <div className="absolute inset-0 bg-gradient-radial from-black/60 via-black/20 to-transparent blur-2xl -z-10" />

        <h1
          className={`${sansation.className} text-5xl lg:text-7xl tracking-wide bg-gradient-to-r from-indigo-300 via-pink-300 to-purple-400 bg-clip-text text-transparent`}
        >
          KNOW REAL
        </h1>

        <p className="text-lg lg:text-2xl leading-tight max-w-xl text-white/90">
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

        {/* 👇 Scroll indicator */}
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
