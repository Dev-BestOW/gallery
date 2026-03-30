import { Canvas } from '@react-three/fiber';
import { Physics } from '@react-three/rapier';
import Gallery from './components/canvas/Gallery';
import HUD from './components/ui/HUD';

export default function App() {
  return (
    <>
      <HUD />
      <Canvas
        shadows
        camera={{ fov: 70, near: 0.1, far: 200 }}
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
