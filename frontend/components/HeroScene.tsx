"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

/* ── Central Intelligence Core ── */
function IntelligenceCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const wireRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = t * 0.08;
      meshRef.current.rotation.y = t * 0.12;
    }
    if (wireRef.current) {
      wireRef.current.rotation.x = t * 0.06;
      wireRef.current.rotation.y = -t * 0.1;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <group>
        {/* Inner solid core */}
        <mesh ref={meshRef}>
          <icosahedronGeometry args={[1.2, 1]} />
          <MeshDistortMaterial
            color="#408CF1"
            emissive="#408CF1"
            emissiveIntensity={0.3}
            roughness={0.2}
            metalness={0.8}
            distort={0.15}
            speed={2}
            transparent
            opacity={0.85}
          />
        </mesh>
        {/* Outer wireframe shell */}
        <mesh ref={wireRef} scale={1.6}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color="#408CF1"
            wireframe
            transparent
            opacity={0.12}
          />
        </mesh>
        {/* Glow sphere */}
        <mesh scale={2.2}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color="#408CF1"
            transparent
            opacity={0.03}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Orbiting Data Node ── */
function DataNode({
  position,
  scale,
  color,
  speed,
  shape,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
  speed: number;
  shape: "octahedron" | "box" | "torus";
}) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    if (ref.current) {
      ref.current.rotation.x = t * 0.4;
      ref.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={position} scale={scale}>
        {shape === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {shape === "box" && <boxGeometry args={[1, 1, 1]} />}
        {shape === "torus" && <torusGeometry args={[1, 0.35, 8, 16]} />}
        {/* meshStandardMaterial — transmission was removed: it forced an extra
            full-scene render pass per node and tanked the frame rate */}
        <meshStandardMaterial
          color={color}
          roughness={0.15}
          metalness={0.7}
          transparent
          opacity={0.55}
          emissive={color}
          emissiveIntensity={0.25}
        />
      </mesh>
    </Float>
  );
}

/* ── Ambient Particles ── */
function Particles({ count = 80 }) {
  const ref = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 18;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.015;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#408CF1"
        transparent
        opacity={0.5}
        sizeAttenuation
      />
    </points>
  );
}

/* ── Connection Lines ── */
function ConnectionRing() {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <mesh ref={ref} rotation={[Math.PI / 2, 0, 0]}>
      <torusGeometry args={[3.5, 0.008, 8, 64]} />
      <meshBasicMaterial color="#408CF1" transparent opacity={0.15} />
    </mesh>
  );
}

/* ── Exported Scene ──
   `active` pauses the render loop (frameloop="never") when the hero is
   scrolled away — WebGL stops consuming GPU entirely until scrolled back. */
export default function HeroScene({ active = true }: { active?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      dpr={[1, 1.25]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={0.8} color="#408CF1" />
      <pointLight position={[-5, -3, 3]} intensity={0.4} color="#72B3F6" />

      <IntelligenceCore />

      <DataNode
        position={[3.2, 1.5, -1]}
        scale={0.35}
        color="#72B3F6"
        speed={0.6}
        shape="octahedron"
      />
      <DataNode
        position={[-3, -1.2, 0.5]}
        scale={0.28}
        color="#a5d0ff"
        speed={0.8}
        shape="box"
      />
      <DataNode
        position={[2, -2, 1]}
        scale={0.3}
        color="#408CF1"
        speed={0.5}
        shape="torus"
      />
      <DataNode
        position={[-2.5, 2, -0.5]}
        scale={0.22}
        color="#72B3F6"
        speed={0.7}
        shape="octahedron"
      />
      <DataNode
        position={[0.5, 3, -1.5]}
        scale={0.2}
        color="#a5d0ff"
        speed={0.9}
        shape="box"
      />

      <ConnectionRing />
      <Particles count={60} />
    </Canvas>
  );
}
