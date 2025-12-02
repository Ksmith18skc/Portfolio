import { Text, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Group, Mesh, MeshBasicMaterial } from 'three';
import { skills } from '../data/skills';
import { skillIcons } from '../skillspng';

function SkillIcon({ position, name }: { position: [number, number, number], name: string }) {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const { camera } = useThree();

  // Load texture for the skill
  const texture = useTexture(skillIcons[name as keyof typeof skillIcons] || '');

  useFrame(() => {
    if (meshRef.current) {
      // Make icon face the camera
      meshRef.current.lookAt(camera.position);

      // Scale effect on hover
      const scale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp({ x: scale, y: scale, z: scale } as any, 0.1);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={1}
          side={2} // Double-sided visibility
          depthWrite={false} // Prevents z-fighting
          toneMapped={false}
        />
      </mesh>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        textAlign="center"
        depthWrite={false}
      >
        {name}
      </Text>
    </group>
  );
}

export function Skills() {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slower, smoother rotation
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {skills.map((skill, index) => {
        // Calculate positions in a spherical arrangement
        const phi = Math.acos(-1 + (2 * index) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        const radius = 5;

        const position: [number, number, number] = [
          radius * Math.cos(theta) * Math.sin(phi),
          radius * Math.sin(theta) * Math.sin(phi),
          radius * Math.cos(phi)
        ];

        return (
          <SkillIcon
            key={skill.id}
            position={position}
            name={skill.name}
          />
        );
      })}

      {/* Central light source */}
      <pointLight position={[0, 0, 0]} intensity={2} color="#ffffff" />
    </group>
  );
}
