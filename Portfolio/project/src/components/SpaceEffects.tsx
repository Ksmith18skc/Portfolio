import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { Group, Vector3, BufferGeometry, Line, LineBasicMaterial, Color, Mesh, Material } from 'three';
import { skills } from '../data/skills';
import { Text } from '@react-three/drei';

interface ShootingStar {
  position: Vector3;
  velocity: Vector3;
  life: number;
  trail: Vector3[];
  size: number;
  color: Color;
}

export function SpaceEffects() {
  const starsRef = useRef<Group>(null);
  const techRef = useRef<Group>(null);

  // Create shooting stars with more variety
  const shootingStars = useMemo(() => {
    const stars: ShootingStar[] = [];
    // Increased number of stars
    for (let i = 0; i < 50; i++) {
      const randomColor = new Color([
        '#ffffff', // White
        '#88ccff', // Light blue
        '#4488ff', // Blue
        '#ffff88', // Light yellow
      ][Math.floor(Math.random() * 4)]);

      stars.push({
        position: new Vector3(
          Math.random() * 200 - 100, // Wider spread
          Math.random() * 200 - 100,
          Math.random() * 200 - 100
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * 0.8, // Faster movement
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        ),
        life: Math.random(),
        trail: [],
        size: Math.random() * 0.15 + 0.05, // Varied sizes
        color: randomColor
      });
    }
    return stars;
  }, []);

  // Create floating tech words
  const techWords = useMemo(() => {
    return skills.map((skill) => ({
      name: skill.name,
      position: new Vector3(
        Math.random() * 60 - 30,
        Math.random() * 60 - 30,
        Math.random() * 60 - 30
      ),
      rotation: new Vector3(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      ),
      speed: Math.random() * 0.001 + 0.001
    }));
  }, []);

  useFrame((state) => {
    const elapsedTime = state.clock.elapsedTime;

    if (starsRef.current) {
      shootingStars.forEach((star, index) => {
        // Move the star
        star.position.add(star.velocity);
        star.life -= 0.005; // Slower fade out

        // Update trail with more points
        star.trail.push(star.position.clone());
        if (star.trail.length > 20) { // Longer trails
          star.trail.shift();
        }

        // Reset shooting star if it "dies" or goes out of bounds
        if (star.life <= 0 || 
            Math.abs(star.position.x) > 100 ||
            Math.abs(star.position.y) > 100 ||
            Math.abs(star.position.z) > 100) {
          star.position.set(
            Math.random() * 200 - 100,
            Math.random() * 200 - 100,
            Math.random() * 200 - 100
          );
          star.velocity.set(
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8,
            (Math.random() - 0.5) * 0.8
          );
          star.life = 1;
          star.trail = [];
        }

        // Find the star group
        const starGroup = starsRef.current?.children[index * 2];
        if (!starGroup) return;

        // Update star mesh
        const starMesh = starGroup.children[0] as Mesh;
        if (starMesh && starMesh.material) {
          starMesh.position.copy(star.position);
          starMesh.scale.setScalar(Math.max(0.1, star.life * star.size));
          
          const material = starMesh.material as Material & { color?: Color, opacity?: number };
          if (material.color) {
            material.color.copy(star.color);
          }
          if ('opacity' in material) {
            material.opacity = star.life;
          }
        }

        // Update trail
        const trailLine = starGroup.children[1] as Line;
        if (trailLine) {
          const geometry = trailLine.geometry as BufferGeometry;
          geometry.setFromPoints(star.trail);
          
          const material = trailLine.material as Material & { color?: Color, opacity?: number };
          if (material.color) {
            material.color.copy(star.color);
          }
          if ('opacity' in material) {
            material.opacity = star.life * 0.5;
          }
        }
      });
    }

    if (techRef.current) {
      techRef.current.children.forEach((child, index) => {
        const tech = techWords[index];
        child.position.y += Math.sin(elapsedTime + index) * 0.002;
        child.rotation.y += tech.speed;
      });
    }
  });

  return (
    <>
      <group ref={starsRef}>
        {shootingStars.map((star, index) => (
          <group key={`star-group-${index}`}>
            <mesh position={star.position}>
              <sphereGeometry args={[star.size, 16, 16]} />
              <meshBasicMaterial
                color={star.color}
                opacity={star.life}
                transparent
                depthWrite={false}
              />
            </mesh>
            <line>
              <bufferGeometry />
              <lineBasicMaterial
                color={star.color}
                transparent
                opacity={0.5}
                depthWrite={false}
              />
            </line>
          </group>
        ))}
      </group>

      <group ref={techRef}>
        {techWords.map((tech, index) => (
          <Text
            key={`tech-${index}`}
            position={tech.position}
            rotation={tech.rotation}
            fontSize={0.5}
            color="#4488ff"
            anchorX="center"
            anchorY="middle"
            opacity={0.7}
          >
            {tech.name}
          </Text>
        ))}
      </group>
    </>
  );
}