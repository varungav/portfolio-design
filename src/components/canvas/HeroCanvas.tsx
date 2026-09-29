import { Canvas } from "@react-three/fiber";
import FloatingModel from "./FloatingModel";

export default function HeroCanvas() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      className="absolute! inset-0"
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 4]} intensity={1.4} />
      <directionalLight position={[-3, -2, -2]} intensity={0.4} color="#38bdf8" />
      <pointLight position={[0, 0, 3]} intensity={0.6} color="#7dd3fc" />
      <FloatingModel />
    </Canvas>
  );
}
