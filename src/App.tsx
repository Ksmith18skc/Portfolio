import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { Controls } from './components/Controls';
import { Environment } from './components/Environment';
import { Experience } from './components/Experience';
import { Interface } from './components/Interface';
import { Projects } from './components/Projects';
import { Skills } from './components/Skills';
import { RocketCursor } from './components/RocketCursor';
import { Intro } from './components/Intro';
import { LoadingScreen } from './components/LoadingScreen';
import { AgentWidget } from './components/AgentWidget';
import { usePortfolioStore } from './store';

function App() {
  const { currentSection, isLoading } = usePortfolioStore();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Canvas>
        <Suspense fallback={null}>
          <Environment />
          <Controls />
          {currentSection === 'intro' && <Intro />}
          {currentSection === 'projects' && <Projects />}
          {currentSection === 'skills' && <Skills />}
          {currentSection === 'experience' && <Experience />}
        </Suspense>
      </Canvas>
      <Interface />
      <RocketCursor />
      <AgentWidget />
    </>
  );
}

export default App