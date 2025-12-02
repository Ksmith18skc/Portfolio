import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls';

export function Controls() {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Export recenter function to be used by Interface component
  window.recenterCamera = () => {
    if (controlsRef.current) {
      camera.position.set(0, 3, 10);
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 3, 10]} />
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={5}
        maxDistance={15}
      />
    </>
  );
}