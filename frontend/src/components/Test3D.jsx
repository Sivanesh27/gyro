import { Canvas } from "@react-three/fiber";

export default function Test3D() {
  return (
    <div style={{ width: 400, height: 400 }}>
      <Canvas>
        <ambientLight />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Canvas>
    </div>
  );
}
