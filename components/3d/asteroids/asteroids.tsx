"use client";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import { useMemo, useRef } from "react";
import { Noise } from "noisejs";

const noise = new Noise(Math.random());

// Generate a pool of jagged asteroid geometries
function useAsteroidGeometries(poolSize = 10) {
  return useMemo(() => {
    const geos: THREE.BufferGeometry[] = [];
    for (let i = 0; i < poolSize; i++) {
      const geo = new THREE.IcosahedronGeometry(1, 4);
      const posAttr = geo.attributes.position;

      for (let j = 0; j < posAttr.count; j++) {
        const x = posAttr.getX(j);
        const y = posAttr.getY(j);
        const z = posAttr.getZ(j);

        // Offset noise with pool index so each geometry is unique
        const n = noise.perlin3(
          x * 0.8 + i * 100,
          y * 0.8 + i * 100,
          z * 0.8 + i * 100
        );
        const factor = 1 + n * 0.35;
        posAttr.setXYZ(j, x * factor, y * factor, z * factor);
      }

      posAttr.needsUpdate = true;
      geo.computeVertexNormals();
      geos.push(geo);
    }
    return geos;
  }, [poolSize]);
}

function InstancedAsteroids({ count = 300 }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Load shared textures
  const [colorMap, normalMap, roughnessMap, aoMap] = useTexture([
    "/textures/asteroid/color.jpg",
    "/textures/asteroid/normal2.jpg",
    "/textures/asteroid/roughness.jpg",
    "/textures/asteroid/ao.jpg",
  ]);

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        map: colorMap,
        normalMap,
        roughnessMap,
        aoMap,
        color: new THREE.Color(0x444444), // darker tint
        metalness: 0.05,
        roughness: 1.0,
        depthWrite: true,
      }),
    [colorMap, normalMap, roughnessMap, aoMap]
  );

  const geometries = useAsteroidGeometries(10);

  // Store asteroid transforms + state
  const asteroidData = useMemo(() => {
    return new Array(count).fill(null).map(() => {
      const pos = new THREE.Vector3(
        THREE.MathUtils.randFloatSpread(200), // X
        THREE.MathUtils.randFloatSpread(200), // Y
        THREE.MathUtils.randFloat(-600, -50)  // always in front
      );

      return {
        position: pos,
        scale: THREE.MathUtils.randFloat(0.2, 0.8),
        spin: new THREE.Vector3(
          Math.random() * 0.01,
          Math.random() * 0.01,
          Math.random() * 0.01
        ),
        rotation: new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        geoIndex: Math.floor(Math.random() * geometries.length),
      };
    });
  }, [count, geometries.length]);

  // Animation
  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();

    asteroidData.forEach((asteroid, i) => {
      // spin
      asteroid.rotation.x += asteroid.spin.x * delta * 60;
      asteroid.rotation.y += asteroid.spin.y * delta * 60;
      asteroid.rotation.z += asteroid.spin.z * delta * 60;

      // drift forward
      asteroid.position.z += 10 * delta;

      // recycle if too close
      if (asteroid.position.z > 20) {
        asteroid.position.set(
          THREE.MathUtils.randFloatSpread(200),
          THREE.MathUtils.randFloatSpread(200),
          -600
        );
      }

      dummy.position.copy(asteroid.position);
      dummy.scale.setScalar(asteroid.scale);
      dummy.rotation.copy(asteroid.rotation);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[geometries[0], material, count]} />
  );
}

export default function AsteroidField() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[20, 20, 10]} intensity={5} />
      <InstancedAsteroids count={100} />
      <OrbitControls />
    </>
  );
}
