import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

/**
 * Centered placeholder for the project showcase's 3D panel. Swap the
 * geometry for a loaded GLTF (useGLTF("/models/your-model.glb")) once a
 * real asset is ready — the Float/rotation wrapper and materials can stay.
 */
function PlaceholderMesh() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_state, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.6} floatIntensity={1.2}>
      <mesh ref={meshRef} scale={1.1}>
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

export default function ModelPreviewCanvas() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true }} className="absolute! inset-0">
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#38bdf8" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#7dd3fc" />
      <PlaceholderMesh />
    </Canvas>
  );
}
