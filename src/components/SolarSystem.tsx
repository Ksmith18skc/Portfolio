import { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Trail } from '@react-three/drei';
import * as THREE from 'three';

interface Planet {
  radius: number;
  orbitRadius: number;
  speed: number;
  color: string;
  trailLength?: number;
}

const planets: Planet[] = [
  { radius: 0.3, orbitRadius: 3, speed: 0.5, color: '#ff9966', trailLength: 20 }, // Mercury
  { radius: 0.4, orbitRadius: 4, speed: 0.4, color: '#ffcc99', trailLength: 25 }, // Venus
  { radius: 0.45, orbitRadius: 5, speed: 0.3, color: '#66ccff', trailLength: 30 }, // Earth
  { radius: 0.35, orbitRadius: 6, speed: 0.25, color: '#ff6666', trailLength: 35 }, // Mars
  { radius: 0.8, orbitRadius: 8, speed: 0.2, color: '#ffcc66', trailLength: 40 }, // Jupiter
  { radius: 0.7, orbitRadius: 10, speed: 0.15, color: '#ffff99', trailLength: 45 }, // Saturn
];

export function SolarSystem() {
  const groupRef = useRef<THREE.Group>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const planetRefs = useRef<THREE.Group[]>([]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1,
      };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    planets.forEach((planet, index) => {
      const planetGroup = planetRefs.current[index];
      if (planetGroup) {
        const angle = time * planet.speed;
        planetGroup.position.set(
          Math.cos(angle) * planet.orbitRadius,
          0,
          Math.sin(angle) * planet.orbitRadius
        );

        // Distance-based visibility
        const distance = Math.sqrt(
          Math.pow(mouseRef.current.x * 10 - planetGroup.position.x, 2) +
          Math.pow(mouseRef.current.y * 10 - planetGroup.position.z, 2)
        );
        const maxDistance = 5;
        const opacity = Math.max(0.1, 1 - distance / maxDistance); // Barely visible by default

        const material = (planetGroup.children[0] as THREE.Mesh).material as THREE.MeshStandardMaterial;
        material.opacity = opacity;
        material.transparent = true;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {/* Hidden Sun (Still Emits Light) */}
      <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial emissive="#ffdd66" emissiveIntensity={2} toneMapped={false} transparent opacity={0} />
      </Sphere>

      {/* Strong Sunlight for Shadows & Realism */}
      <pointLight
        position={[0, 0, 0]}
        intensity={10} // Strong sunlight effect
        distance={30}
        decay={2}
        color={'#ffdd66'}
        castShadow // Enable shadows
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />

      {/* Planets */}
      {planets.map((planet, index) => (
        <group key={index} ref={(el) => (planetRefs.current[index] = el!)}>
          {/* Planet Mesh */}
          <Sphere args={[planet.radius, 32, 32]} castShadow receiveShadow>
            <meshStandardMaterial
              color={planet.color}
              roughness={0.8}
              metalness={0.5}
              transparent
              opacity={0.1} // Planets are barely visible
            />
          </Sphere>

          {/* Trail following the planet */}
          <Trail
            width={0.3}
            length={planet.trailLength}
            color={new THREE.Color(planet.color)}
            attenuation={(t) => t * t}
            target={planetRefs.current[index]} // Attach to planet
          />
        </group>
      ))}
    </group>
  );
}
