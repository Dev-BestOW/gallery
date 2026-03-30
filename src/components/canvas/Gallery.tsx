import Room from './Room';
import Lighting from './Lighting';
import Player from './Player';

export default function Gallery() {
  return (
    <>
      <Lighting />
      <Player />

      {/* Entrance Hall */}
      <Room
        position={[0, 0, 0]}
        size={[20, 5, 15]}
        doorways={['south']}
      />

      {/* Wing A - About (south of entrance) */}
      <Room
        position={[-20, 0, 22.5]}
        size={[16, 5, 12]}
        doorways={['east']}
      />

      {/* Corridor connecting entrance to wings */}
      <Room
        position={[0, 0, 18.5]}
        size={[20, 5, 7]}
        doorways={['north', 'south', 'east', 'west']}
      />

      {/* Wing B - Projects (south of corridor) */}
      <Room
        position={[0, 0, 37]}
        size={[20, 5, 15]}
        doorways={['north', 'south']}
      />

      {/* Wing C - Career (east of corridor) */}
      <Room
        position={[20, 0, 22.5]}
        size={[16, 5, 12]}
        doorways={['west']}
      />

      {/* Wing D - Contact (south of projects) */}
      <Room
        position={[0, 0, 55]}
        size={[16, 5, 12]}
        doorways={['north']}
      />
    </>
  );
}
