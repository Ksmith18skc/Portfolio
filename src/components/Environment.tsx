import {
  Environment as DreiEnvironment,
  Stars,
} from '@react-three/drei';
import { SpaceEffects } from './SpaceEffects';
import { SolarSystem } from './SolarSystem';
import { SpaceObjects } from './SpaceObjects';
import { usePortfolioStore } from '../store';

export function Environment() {
  const { currentSection } = usePortfolioStore();

  return (
    <>
      <DreiEnvironment preset="night" />
      <Stars radius={200} depth={50} count={10000} factor={4} fade />
      <SpaceEffects />
      {currentSection !== 'skills' && <SolarSystem />}
      <SpaceObjects />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#0066ff" />
      <hemisphereLight intensity={0.5} color="#4488ff" groundColor="#000000" />
    </>
  );
}