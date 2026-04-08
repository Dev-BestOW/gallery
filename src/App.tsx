import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import Gallery from './components/canvas/Gallery';
import HUD from './components/ui/HUD';
import ArtworkDetail from './components/ui/ArtworkDetail';
import WelcomeScreen from './components/ui/WelcomeScreen';
import MobileControls from './components/ui/MobileControls';
import Minimap from './components/ui/Minimap';
import LoadingScreen from './components/ui/LoadingScreen';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { useIsMobile } from './hooks/useIsMobile';

export default function App() {
  const isMobile = useIsMobile();

  return (
    <>
      <WelcomeScreen />
      <HUD />
      <ArtworkDetail />
      {isMobile && <MobileControls />}
      <Minimap />
      <ErrorBoundary>
        <Canvas
          camera={{ fov: 75, near: 0.1, far: 200 }}
          shadows
          dpr={[1, 1.5]}
          style={{ position: 'fixed', inset: 0 }}
        >
          <color attach="background" args={['#f0ece6']} />
          <fog attach="fog" args={['#f0ece6', 20, 60]} />
          <Suspense fallback={null}>
            <Physics gravity={[0, -9.81, 0]}>
              <Gallery />
            </Physics>
          </Suspense>
          {!isMobile && (
            <EffectComposer>
              <Bloom
                luminanceThreshold={0.9}
                luminanceSmoothing={0.9}
                intensity={0.3}
              />
              <Vignette offset={0.3} darkness={0.4} />
            </EffectComposer>
          )}
        </Canvas>
        <LoadingScreen />
      </ErrorBoundary>
    </>
  );
}
