import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Procedural wind turbine blade: tapered, twisted airfoil-like profile.
 * - cgPosition: 0..1 along the blade (0 = root, 1 = tip)
 * - idealCG:    0..1, the target CG position
 * - showHeatmap: boolean — color vertices by deviation
 */
export function buildBladeGeometry({ length = 8, segments = 60, profilePoints = 28 }) {
  const positions = [];
  const colors = [];
  const indices = [];
  const uvs = [];
  const tValues = [];

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    // Chord tapers, with slight shoulder bulge near root
    const shoulder = 1 + 0.22 * Math.exp(-Math.pow((t - 0.06) / 0.14, 2));
    const chord = THREE.MathUtils.lerp(1.5, 0.22, Math.pow(t, 0.7)) * shoulder;
    const thickness = chord * (0.32 - 0.18 * t);
    const twist = THREE.MathUtils.degToRad(-26 * t * t);
    const x = t * length;

    for (let j = 0; j < profilePoints; j++) {
      const a = (j / profilePoints) * Math.PI * 2;
      // Airfoil-ish profile: thicker top, thinner bottom
      const top = Math.sin(a) > 0 ? 1.15 : 0.5;
      const py = Math.cos(a) * thickness * top;
      const pz = Math.sin(a) * chord * 0.5;
      const yT = py * Math.cos(twist) - pz * Math.sin(twist);
      const zT = py * Math.sin(twist) + pz * Math.cos(twist);
      positions.push(x, yT, zT);
      uvs.push(t, j / profilePoints);
      colors.push(0.0, 0.94, 1.0);
      tValues.push(t);
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < profilePoints; j++) {
      const j2 = (j + 1) % profilePoints;
      const a = i * profilePoints + j;
      const b = (i + 1) * profilePoints + j;
      const c = (i + 1) * profilePoints + j2;
      const d = i * profilePoints + j2;
      indices.push(a, b, c, a, c, d);
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geo.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  geo.userData.tValues = tValues;
  return geo;
}

function applyHeatmap(geo, cgPosition, idealCG, intensity = 1) {
  const tValues = geo.userData.tValues;
  const colorAttr = geo.getAttribute("color");
  const dev = Math.abs(cgPosition - idealCG); // 0..1
  for (let i = 0; i < tValues.length; i++) {
    const t = tValues[i];
    // Distance of this point from CG
    const dCG = Math.abs(t - cgPosition);
    // Stress band: peaks near tip side opposite the CG offset
    const sign = cgPosition > idealCG ? 1 : -1;
    const directional = sign * (t - idealCG);
    const stress = Math.max(0, directional) * dev * 4 * intensity;
    const closeness = Math.exp(-Math.pow(dCG / 0.18, 2)); // glow at CG
    const r = THREE.MathUtils.clamp(stress + closeness * 0.3, 0, 1);
    const g = THREE.MathUtils.clamp(0.9 - stress * 0.7 + closeness * 0.4, 0, 1);
    const b = THREE.MathUtils.clamp(1 - stress * 0.85, 0, 1);
    colorAttr.setXYZ(i, r, g, b);
  }
  colorAttr.needsUpdate = true;
}

export default function Blade3D({
  cgPosition = 0.5,
  idealCG = 0.5,
  showHeatmap = false,
  autoRotate = true,
  rotationSpeed = 0.25,
  length = 8,
}) {
  const groupRef = useRef();
  const meshRef = useRef();
  const geometry = useMemo(() => buildBladeGeometry({ length }), [length]);

  useMemo(() => {
    if (showHeatmap) applyHeatmap(geometry, cgPosition, idealCG, 1.0);
    else applyHeatmap(geometry, 0.5, 0.5, 0); // reset to neutral cyan
  }, [showHeatmap, cgPosition, idealCG, geometry]);

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) groupRef.current.rotation.y += delta * rotationSpeed;
  });

  // CG marker world position
  const cgX = cgPosition * length;
  const idealX = idealCG * length;

  return (
    <group ref={groupRef} rotation={[0, 0, 0.18]}>
      <group position={[-length / 2, 0, 0]}>
        <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
          <meshStandardMaterial
            vertexColors
            metalness={0.55}
            roughness={0.32}
            emissive={new THREE.Color("#001a22")}
            emissiveIntensity={0.4}
          />
        </mesh>
        {/* Root cap */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.28, 0.28, 0.18, 32]} />
          <meshStandardMaterial color="#0f1f33" metalness={0.8} roughness={0.25} />
        </mesh>
        {/* CG marker (gold) */}
        <group position={[cgX, 0.55, 0]}>
          <mesh>
            <sphereGeometry args={[0.12, 24, 24]} />
            <meshStandardMaterial
              color="#FFB600"
              emissive="#FFB600"
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
          <pointLight color="#FFB600" intensity={2} distance={3} />
        </group>
        {/* Ideal CG marker (cyan, dashed look using scale) */}
        <group position={[idealX, -0.55, 0]}>
          <mesh>
            <torusGeometry args={[0.16, 0.02, 12, 24]} />
            <meshStandardMaterial
              color="#00F0FF"
              emissive="#00F0FF"
              emissiveIntensity={1.8}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}
