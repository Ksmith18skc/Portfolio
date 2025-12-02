import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Group, Vector3, Color } from 'three';

interface SpaceObject {
  position: Vector3;
  rotation: Vector3;
  scale: number;
  speed: number;
  type: 'station' | 'satellite';
  orbitRadius: number;
  orbitSpeed: number;
  orbitAxis: 'x' | 'y' | 'z';
}

export function SpaceObjects() {
  const groupRef = useRef<Group>(null);

  const spaceObjects = useMemo(() => {
    const objects: SpaceObject[] = [];
    
    // Create space stations
    for (let i = 0; i < 3; i++) {
      objects.push({
        position: new Vector3(
          Math.random() * 100 - 50,
          Math.random() * 100 - 50,
          Math.random() * 100 - 50
        ),
        rotation: new Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: Math.random() * 2 + 3, // Larger scale for stations
        speed: Math.random() * 0.002 + 0.001,
        type: 'station',
        orbitRadius: Math.random() * 30 + 20,
        orbitSpeed: Math.random() * 0.1 + 0.05,
        orbitAxis: ['x', 'y', 'z'][Math.floor(Math.random() * 3)] as 'x' | 'y' | 'z'
      });
    }

    // Create satellites
    for (let i = 0; i < 8; i++) {
      objects.push({
        position: new Vector3(
          Math.random() * 80 - 40,
          Math.random() * 80 - 40,
          Math.random() * 80 - 40
        ),
        rotation: new Vector3(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        ),
        scale: Math.random() * 0.5 + 0.5, // Smaller scale for satellites
        speed: Math.random() * 0.004 + 0.002,
        type: 'satellite',
        orbitRadius: Math.random() * 20 + 10,
        orbitSpeed: Math.random() * 0.2 + 0.1,
        orbitAxis: ['x', 'y', 'z'][Math.floor(Math.random() * 3)] as 'x' | 'y' | 'z'
      });
    }

    return objects;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    spaceObjects.forEach((object, index) => {
      const mesh = groupRef.current?.children[index] as Mesh;
      if (!mesh) return;

      // Update rotation
      mesh.rotation.x += object.speed;
      mesh.rotation.y += object.speed * 0.8;
      mesh.rotation.z += object.speed * 0.5;

      // Calculate orbit position
      const angle = time * object.orbitSpeed;
      switch (object.orbitAxis) {
        case 'x':
          mesh.position.y = Math.sin(angle) * object.orbitRadius;
          mesh.position.z = Math.cos(angle) * object.orbitRadius;
          break;
        case 'y':
          mesh.position.x = Math.sin(angle) * object.orbitRadius;
          mesh.position.z = Math.cos(angle) * object.orbitRadius;
          break;
        case 'z':
          mesh.position.x = Math.sin(angle) * object.orbitRadius;
          mesh.position.y = Math.cos(angle) * object.orbitRadius;
          break;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {spaceObjects.map((object, index) => (
        <group key={index} position={object.position} scale={object.scale}>
          {object.type === 'station' ? (
            // Space Station
            <>
              {/* Central Hub */}
              <mesh>
                <sphereGeometry args={[0.5, 16, 16]} />
                <meshStandardMaterial
                  color={new Color('#88ccff')}
                  metalness={0.8}
                  roughness={0.2}
                  emissive={new Color('#225588')}
                  emissiveIntensity={0.5}
                />
              </mesh>
              {/* Solar Panels */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[2, 0.1, 0.7]} />
                <meshStandardMaterial
                  color={new Color('#4488ff')}
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
              {/* Antenna */}
              <mesh position={[0, 0.7, 0]}>
                <cylinderGeometry args={[0.02, 0.02, 0.4]} />
                <meshStandardMaterial
                  color={new Color('#cccccc')}
                  metalness={0.9}
                  roughness={0.1}
                />
              </mesh>
            </>
          ) : (
            // Satellite
            <>
              {/* Main Body */}
              <mesh>
                <boxGeometry args={[0.5, 0.3, 0.3]} />
                <meshStandardMaterial
                  color={new Color('#dddddd')}
                  metalness={0.7}
                  roughness={0.3}
                  emissive={new Color('#444444')}
                  emissiveIntensity={0.2}
                />
              </mesh>
              {/* Solar Panels */}
              <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[1.2, 0.05, 0.4]} />
                <meshStandardMaterial
                  color={new Color('#4488ff')}
                  metalness={0.5}
                  roughness={0.3}
                />
              </mesh>
              {/* Communication Dish */}
              <mesh position={[0.3, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
                <cylinderGeometry args={[0.15, 0.15, 0.02, 16]} />
                <meshStandardMaterial
                  color={new Color('#ffffff')}
                  metalness={0.8}
                  roughness={0.2}
                />
              </mesh>
            </>
          )}
        </group>
      ))}
    </group>
  );
}