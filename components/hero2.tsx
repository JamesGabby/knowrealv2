"use client";

import { Sansation } from "next/font/google";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";
import { motion } from "framer-motion";

const sansation = Sansation({ weight: "700", subsets: ["latin"], fallback: ["mono"] });

function CameraController() {
  const { camera } = useThree()

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    // 6s breathing cycle
    const pulse = (Math.sin((t / 6) * Math.PI * 2) + 1) / 2 // 0 → 1 → 0
    // Smooth zoom in/out between 0.9 and 1.1
    camera.position.z = 1 + (pulse - 0.5) * 0.2
  })

  return null
}

// One star layer (configurable)
function StarLayer({
  count,
  spread,
  size,
  baseSpeed,
  colorA,
  colorB,
}: {
  count: number
  spread: number
  size: number
  baseSpeed: number
  colorA: string
  colorB: string
}) {
  const points = useRef<THREE.Points>(null)
  const material = useRef<any>(null)

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = THREE.MathUtils.randFloatSpread(spread)
      pos[i * 3 + 1] = THREE.MathUtils.randFloatSpread(spread)
      pos[i * 3 + 2] = THREE.MathUtils.randFloatSpread(spread)
    }
    return pos
  }, [count, spread])

  useFrame(({ clock }, delta) => {
    if (points.current) {
      // Breathing motion sync
      const t = clock.getElapsedTime()
      const pulse = (Math.sin((t / 6) * Math.PI * 2) + 1) / 2

      // Adjust star rotation
      const speed = baseSpeed * (0.5 + pulse)
      points.current.rotation.x -= delta * speed
      points.current.rotation.y -= delta * speed * 0.6

      // Interpolate star color
      if (material.current) {
        const col = new THREE.Color(colorA).lerp(
          new THREE.Color(colorB),
          pulse
        )
        material.current.color = col
      }
    }
  })

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
  )
}



export function Hero({ data }: { data?: any }) {
  return (
    <div className="relative flex items-center justify-center h-screen w-full overflow-hidden">
      {/* Galaxy background */}
      <div className="absolute inset-0 -z-20">
        <Canvas camera={{ position: [0, 0, 1] }}>
          <CameraController />
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
            size={1.2}
            baseSpeed={0.006}
            colorA="#ffffff"
            colorB="#a0c4ff"
          />
        </Canvas>


      </div>

      {/* Vignette overlay */}
      <div className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(circle,rgba(0,0,0,0)_60%,rgba(0,0,0,0.6)_100%)]" />

      {/* Foreground content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-20 flex flex-col items-center text-center gap-8 px-6"
      >
        <h1
          className={`${sansation.className} text-5xl lg:text-7xl tracking-wide animate-glow`}
        >
          KNOW REAL
        </h1>
        <p className="text-xl lg:text-2xl leading-tight max-w-xl">
          <code>
            Get to <span className="font-bold">know</span> reality.
          </code>
        </p>
        <Link
          href={data ? "/protected" : "/auth/login"}
          className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg hover:bg-white/20 transition animate-button-glow"
        >
          <LogIn />
          <span className="font-semibold">Enter</span>
        </Link>

        <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent my-8" />
      </motion.div>
    </div>
  );
}
