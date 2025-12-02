import { Html, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState } from 'react';
import { Group } from 'three';
import { experiences } from '../data/experiences';

export function Experience() {
  const groupRef = useRef<Group>(null);
  const [selectedExp, setSelectedExp] = useState<string | null>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 2, -5]}>
      {experiences.map((exp, index) => (
        <group 
          key={exp.id} 
          position={[0, -index * 1.5, 0]}
        >
          {/* Invisible hitbox mesh */}
          <mesh
            onClick={() => setSelectedExp(selectedExp === exp.id ? null : exp.id)}
            position={[0, -0.15, 0]} // Centered between title and period
          >
            <planeGeometry args={[12, 1.2]} /> {/* Increased width from 8 to 12 units */}
            <meshBasicMaterial
              transparent
              opacity={0}
              depthWrite={false}
              depthTest={false}
            />
          </mesh>

          <Text
            position={[0, 0, 0]}
            fontSize={0.5}
            color={selectedExp === exp.id ? '#88ccff' : '#ffffff'}
            anchorX="center"
            anchorY="middle"
          >
            {exp.company} - {exp.role}
          </Text>
          <Text
            position={[0, -0.3, 0]}
            fontSize={0.2}
            color="#888888"
            anchorX="center"
            anchorY="middle"
          >
            {exp.period}
          </Text>
          {selectedExp === exp.id && (
            <Html position={[2, 0, 0]} center>
              <div className="bg-black/90 text-white p-4 rounded-lg backdrop-blur-lg transform transition-all duration-300 ease-in-out max-w-[280px] sm:max-w-[340px] md:max-w-[380px]">
                <p className="text-xs sm:text-sm mb-3 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-blue-500/30 px-1.5 py-0.5 rounded text-[10px] sm:text-xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
}