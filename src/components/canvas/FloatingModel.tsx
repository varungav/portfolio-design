import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Procedural placeholder for the hero 3D piece. Swap the geometry below for
 * a loaded GLTF (useGLTF("/models/your-model.glb")) once a real asset is ready —
 * the Float/rotation wrapper and materials can stay as-is.
 */
export default function FloatingModel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} position={[1.6, 0, 0]} scale={0.9}>
        <icosahedronGeometry args={[1, 1]} />
        <MeshDistortMaterial
          color="#7dd3fc"
          attach="material"
          distort={0.4}
          speed={1.8}
          roughness={0.15}
          metalness={0.6}
          emissive="#0ea5e9"
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}
