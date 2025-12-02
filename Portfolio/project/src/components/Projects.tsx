import { Html, Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import { Group, Color, Vector3 } from 'three';
import { projects } from '../data/projects';
import { usePortfolioStore } from '../store';

let audioContext: AudioContext | null = null;
let rocketBuffer: AudioBuffer | null = null;

async function loadRocketSound() {
  try {
    if (!audioContext) {
      audioContext = new AudioContext();
    }

    const duration = 2;
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < buffer.length; i++) {
      const noise = Math.random() * 2 - 1;
      const time = i / sampleRate;
      const rumble = Math.sin(2 * Math.PI * 50 * time) * 0.5;
      channelData[i] = (noise * 0.5 + rumble * 0.5) * Math.min(1, time * 2) * (1 - time / duration);
    }

    rocketBuffer = buffer;
  } catch (error) {
    console.error('Error creating rocket sound:', error);
  }
}

function playRocketSound() {
  const { audioEnabled } = usePortfolioStore.getState();
  if (!audioContext || !rocketBuffer || !audioEnabled) return;

  try {
    const source = audioContext.createBufferSource();
    source.buffer = rocketBuffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.3;

    const lowpass = audioContext.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1000;

    const highpass = audioContext.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 20;

    source.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(gainNode);
    gainNode.connect(audioContext.destination);

    source.start();
  } catch (error) {
    console.error('Error playing rocket sound:', error);
  }
}

interface RocketState {
  isShaking: boolean;
  isLaunching: boolean;
  position: Vector3;
  shakeOffset: Vector3;
  launchStartTime: number;
}

function Spaceship({ onLaunch, rocketState, projectUrl, project }: { 
  onLaunch: () => void;
  rocketState: RocketState;
  projectUrl?: string;
  project: Project;
}) {
  const color = new Color('#666666');
  const emissiveColor = new Color('#222222');
  const shipRef = useRef<Group>(null);

  useFrame((state) => {
    if (!shipRef.current) return;

    if (rocketState.isShaking) {
      rocketState.shakeOffset.set(
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05,
        (Math.random() - 0.5) * 0.05
      );
      shipRef.current.position.copy(rocketState.shakeOffset);
    }

    if (rocketState.isLaunching) {
      const elapsedTime = state.clock.getElapsedTime() - rocketState.launchStartTime;
      const launchHeight = Math.pow(elapsedTime, .5) * 1;
      shipRef.current.position.y = launchHeight;
      shipRef.current.position.x += (Math.random() - 0.5) * 0.01;
      shipRef.current.position.z += (Math.random() - 0.5) * 0.01;
      shipRef.current.rotation.z = Math.sin(elapsedTime * 1) * 0.1;
    }
  });

  const handleClick = () => {
    if (!rocketState.isLaunching) {
      onLaunch();
      if (projectUrl) {
        setTimeout(() => {
          window.open(projectUrl, '_blank', 'noopener,noreferrer');
        }, 2500);
      }
    }
  };

  return (
    <group
      ref={shipRef}
      scale={[0.8, 0.8, 0.8]} // Increased from 0.5 to 0.8
    >
      <mesh onClick={handleClick}>
        <boxGeometry args={[4, 8, 4]} />
        <meshBasicMaterial
          transparent
          opacity={0}
          depthWrite={false}
          depthTest={false}
        />
      </mesh>

      <mesh>
        <cylinderGeometry args={[0.5, 1, 3, 8]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
          emissive={emissiveColor}
          emissiveIntensity={0.5}
        />
      </mesh>

      <mesh position={[0, 1.7, 0]}>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={new Color('#88ccff')}
          metalness={0.2}
          roughness={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      <group>
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 4]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
        <mesh position={[0.8, 0, 0]} rotation={[0, 0, -Math.PI / 4]}>
          <boxGeometry args={[1.5, 0.1, 0.8]} />
          <meshStandardMaterial
            color={color}
            metalness={0.7}
            roughness={0.3}
          />
        </mesh>
      </group>

      {[-0.4, 0, 0.4].map((x, i) => (
        <group key={i} position={[x, -1.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.2, 0.3, 0.5, 8]} />
            <meshStandardMaterial
              color={new Color('#444444')}
              metalness={0.9}
              roughness={0.1}
            />
          </mesh>
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.15, 0.1, 0.3, 8]} />
            <meshStandardMaterial
              color={new Color(rocketState.isLaunching ? '#ff8866' : '#ff4422')}
              emissive={new Color(rocketState.isLaunching ? '#ffaa88' : '#ff8866')}
              emissiveIntensity={rocketState.isLaunching ? 2 : 0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
        </group>
      ))}

      <mesh position={[0, 0, 0.6]}>
        <boxGeometry args={[0.3, 1.5, 0.1]} />
        <meshStandardMaterial
          color={new Color('#444444')}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

export function Projects() {
  const groupRef = useRef<Group>(null);
  const [rocketStates, setRocketStates] = useState<RocketState[]>(
    projects.map(() => ({
      isShaking: false,
      isLaunching: false,
      position: new Vector3(0, 0, 0),
      shakeOffset: new Vector3(0, 0, 0),
      launchStartTime: 0
    }))
  );

  useEffect(() => {
    loadRocketSound();
  }, []);

  const handleLaunch = (index: number) => {
    setRocketStates(prev => {
      const newStates = [...prev];
      
      if (newStates[index].isLaunching) return prev;
      
      newStates[index] = {
        ...newStates[index],
        isShaking: true,
      };
      
      return newStates;
    });

    playRocketSound();

    setTimeout(() => {
      setRocketStates(prev => {
        const newStates = [...prev];
        newStates[index] = {
          ...newStates[index],
          isShaking: false,
          isLaunching: true,
          launchStartTime: performance.now() / 1000
        };
        return newStates;
      });
    }, 1500);
  };

  const spacing = 5; // Increased from 4 to 5 to accommodate larger rockets
  const totalWidth = (projects.length - 1) * spacing;
  const startX = -totalWidth / 2;

  return (
    <group ref={groupRef} position={[0, 0, -10]}>  {/* Moved back from -8 to -10 to accommodate larger size */}
      {projects.map((project, index) => {
        const x = startX + (index * spacing);

        return (
          <group
            key={project.id}
            position={[x, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
          >
            <Spaceship
              onLaunch={() => handleLaunch(index)}
              rocketState={rocketStates[index]}
              projectUrl={project.demoUrl}
              project={project}
            />
            {!rocketStates[index].isLaunching && (
              <>
                <Text
                  position={[0, -2.5, 0]} // Adjusted position
                  fontSize={0.45} // Increased from 0.3
                  color="#ffffff"
                  anchorX="center"
                  anchorY="middle"
                  rotation={[0, -Math.PI / 2, 0]}
                >
                  {project.title}
                </Text>
                <Text
                  position={[0, -3.1, 0]} // Adjusted position
                  fontSize={0.3} // Increased from 0.2
                  color="#888888"
                  anchorX="center"
                  anchorY="middle"
                  rotation={[0, -Math.PI / 2, 0]}
                >
                  Click to Launch
                </Text>
                <Text
                  position={[0, -3.7, 0]} // Adjusted position
                  fontSize={0.25} // Increased from 0.15
                  color="#666666"
                  anchorX="center"
                  anchorY="middle"
                  rotation={[0, -Math.PI / 2, 0]}
                  maxWidth={4} // Increased from 3
                >
                  {project.description}
                </Text>
                <Text
                  position={[0, -4.3, 0]} // Adjusted position
                  fontSize={0.2} // Increased from 0.12
                  color="#4488ff"
                  anchorX="center"
                  anchorY="middle"
                  rotation={[0, -Math.PI / 2, 0]}
                >
                  {project.technologies.join(' • ')}
                </Text>
              </>
            )}
          </group>
        );
      })}
    </group>
  );
}