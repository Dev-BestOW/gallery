import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Gallery from './components/canvas/Gallery';
import HUD from './components/ui/HUD';
import ArtworkDetail from './components/ui/ArtworkDetail';

export default function App() {
  return (
    <>
      <HUD />
      <ArtworkDetail />
      <Canvas
        camera={{ fov: 70, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        style={{ position: 'fixed', inset: 0 }}
      >
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 30, 80]} />
        <Physics gravity={[0, -9.81, 0]}>
          <Gallery />
        </Physics>
      </Canvas>
    </>
  );
}
