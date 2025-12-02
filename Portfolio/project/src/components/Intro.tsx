import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Group, Color, Vector3, Euler, DoubleSide } from 'three';
import { usePortfolioStore } from '../store';

export function Intro() {
  const groupRef = useRef<Group>(null);
  const textRef = useRef<THREE.Object3D>(null);
  const nameRef = useRef<THREE.Object3D>(null);
  const [typedText, setTypedText] = useState('');
  const [isLaunched, setIsLaunched] = useState(false);
  const launchVelocity = useRef(new Vector3(0, 0, 0));
  const initialPosition = useRef(new Vector3(0, 2, 0));
  const rotation = useRef(new Euler(0, 0, 0));
  const { camera } = useThree();
  
  // const fullText = "Aspiring full-stack developer passionate about software development, cybersecurity, and machine learning. Exploring scalable tools, automation, AI-driven solutions, and blockchain technology.";

  const fullText = "Full-stack developer and AI enthusiast graduating in May 2026, with professional experience in software engineering and machine learning. Passionate about building scalable applications, secure software, efficient workflow automations, and intelligent systems. Skilled in cross-platform development, AI-driven solutions and cloud infrastructure.";

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (isLaunched || !nameRef.current) return;

      const vector = new Vector3(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1,
        0.5
      );

      vector.unproject(camera);
      const dir = vector.sub(camera.position).normalize();
      const distance = -camera.position.z / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));

      if (nameRef.current) {
        const textBounds = { width: 4, height: 1 };
        const textPos = nameRef.current.getWorldPosition(new Vector3());
        
        if (
          pos.x > textPos.x - textBounds.width / 2 &&
          pos.x < textPos.x + textBounds.width / 2 &&
          pos.y > textPos.y - textBounds.height / 2 &&
          pos.y < textPos.y + textBounds.height / 2
        ) {
          setIsLaunched(true);
          launchVelocity.current = new Vector3(
            (Math.random() - 0.5) * 0.2,
            0.15,
            -0.1
          );
          rotation.current = new Euler(
            Math.random() * Math.PI * 0.5,
            Math.random() * Math.PI * 0.5,
            Math.random() * Math.PI * 0.5
          );
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [camera, isLaunched]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }

    if (textRef.current) {
      const material = (textRef.current as any).material;
      if (material) {
        const hue = (Math.sin(state.clock.elapsedTime) + 1) * 0.1;
        material.color = new Color().setHSL(hue, 0.8, 0.6);
        material.emissiveIntensity = 0.5 + Math.sin(state.clock.elapsedTime) * 0.2;
      }
    }

    if (isLaunched && nameRef.current) {
      const gravity = -0.005;
      launchVelocity.current.y += gravity;
      
      const newPosition = nameRef.current.position.clone().add(launchVelocity.current);
      nameRef.current.position.copy(newPosition);
      
      nameRef.current.rotation.x += 0.02;
      nameRef.current.rotation.y += 0.03;
      nameRef.current.rotation.z += 0.01;

      if (newPosition.y < -20) {
        setIsLaunched(false);
        nameRef.current.position.copy(initialPosition.current);
        nameRef.current.rotation.set(0, 0, 0);
      }
    }
  });

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.substring(0, i));
      i++;
      if (i > fullText.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, -5]}>
      <pointLight position={[0, 2, 5]} intensity={2} color="#ffffff" />
      <spotLight
        position={[5, 5, 0]}
        angle={0.3}
        penumbra={1}
        intensity={1}
        color="#4488ff"
        castShadow
      />

      <group ref={nameRef} position={initialPosition.current}>
        <Text
          ref={textRef}
          fontSize={1.4}
          anchorX="center"
          anchorY="middle"
        >
          Kory Smith
          <meshPhongMaterial
            attach="material"
            color="#88ccff"
            emissive="#4488ff"
            emissiveIntensity={0.5}
            specular="#ffffff"
            shininess={100}
            side={DoubleSide}
          />
        </Text>
      </group>

      <Text
        position={[0, .6, 0]}
        fontSize={0.5}
        anchorX="center"
        anchorY="middle"
      >
        Computer Science Student @ University of Arizona
        <meshBasicMaterial attach="material" color="#ffffff" side={DoubleSide} />
      </Text>

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
        maxWidth={12}
        textAlign="center"
      >
        {typedText}
        <meshBasicMaterial attach="material" color="#aaaaaa" side={DoubleSide} />
      </Text>
    </group>
  );
}