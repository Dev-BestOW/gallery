import Room from './Room';
import Lighting from './Lighting';
import RoomLighting from './RoomLighting';
import Player from './Player';
import RoomArtworks, { distributeOnWall } from './RoomArtworks';
import EntranceTitle from './EntranceTitle';
import EntranceParticles from './EntranceParticles';
import FloorGuide, { FloorArrow } from './FloorGuide';
import Minimap from '../ui/Minimap';
import { useProximityDetector } from '../../hooks/useProximity';
import { useCameraFocus } from '../../hooks/useCameraFocus';
import { useFootsteps } from '../../hooks/useFootsteps';
import { useAmbientSound } from '../../hooks/useAmbientSound';
import { useDeepLink } from '../../hooks/useDeepLink';
import portfolio from '../../data/portfolio';

/*
  Room Layout (walls touching, doors aligned):

  Entrance: [0,0,0]     20x5x15  Z[-7.5, 7.5]
  Corridor: [0,0,11]    20x5x7   Z[7.5, 14.5]
  Wing A:   [-18,0,11]  16x5x12  X[-26,-10] Z[5,17]   (east door at X=-10, Z=11)
  Wing C:   [18,0,11]   16x5x12  X[10,26]   Z[5,17]   (west door at X=10, Z=11)
  Wing B:   [0,0,22]    20x5x15  Z[14.5, 29.5]
  Wing D:   [0,0,35.5]  16x5x12  Z[29.5, 41.5]
*/

function SceneManager() {
  useProximityDetector();
  useCameraFocus();
  useFootsteps();
  useAmbientSound();
  useDeepLink();
  return null;
}

export default function Gallery() {
  const entrance = portfolio.find((w) => w.id === 'entrance')!;
  const about = portfolio.find((w) => w.id === 'about')!;
  const projects = portfolio.find((w) => w.id === 'projects')!;
  const career = portfolio.find((w) => w.id === 'career')!;
  const contact = portfolio.find((w) => w.id === 'contact')!;

  // Entrance Hall: north wall (z = -7.2)
  const entrancePlacements = distributeOnWall(
    entrance.artworks,
    [-3, 2.2, -7.2], [3, 2.2, -7.2],
    [0, 0, 0],
    2.2, [3, 2],
  );

  // Wing A - About: west wall inner face (x = -26 + 0.3 = -25.7), faces east
  const aboutPlacements = distributeOnWall(
    about.artworks,
    [-25.7, 2.2, 7], [-25.7, 2.2, 15],
    [0, Math.PI / 2, 0],
    2.2,
  );

  // Wing B - Projects: east/west walls
  const projectsEast = distributeOnWall(
    projects.artworks.slice(0, 2),
    [9.7, 2.2, 17], [9.7, 2.2, 27],
    [0, -Math.PI / 2, 0],
    2.2,
  );
  const projectsWest = distributeOnWall(
    projects.artworks.slice(2),
    [-9.7, 2.2, 17], [-9.7, 2.2, 27],
    [0, Math.PI / 2, 0],
    2.2,
  );

  // Wing C - Career: east wall inner face (x = 26 - 0.3 = 25.7), faces west
  const careerPlacements = distributeOnWall(
    career.artworks,
    [25.7, 2.2, 7], [25.7, 2.2, 15],
    [0, -Math.PI / 2, 0],
    2.2,
  );

  // Wing D - Contact: south wall inner face (z = 41.5 - 0.3 = 41.2), faces north
  const contactPlacements = distributeOnWall(
    contact.artworks,
    [-3, 2.2, 41.2], [3, 2.2, 41.2],
    [0, Math.PI, 0],
    2.2, [2.5, 1.8],
  );

  return (
    <>
      <Lighting />
      <Player />
      <SceneManager />

      {/* ===== Entrance Hall ===== */}
      <Room position={[0, 0, 0]} size={[20, 5, 15]} doorways={['south']} />
      <RoomLighting position={[0, 0, 0]} theme="grand" />
      <EntranceTitle />
      <EntranceParticles />
      <RoomArtworks placements={entrancePlacements} />

      {/* ===== Corridor ===== */}
      <Room position={[0, 0, 11]} size={[20, 5, 7]} doorways={['north', 'south', 'east', 'west']} />
      <RoomLighting position={[0, 0, 11]} theme="warm" />

      {/* Floor guides: Entrance → Corridor (south) */}
      <FloorGuide from={[0, 0.02, 4]} to={[0, 0.02, 7]} />
      <FloorArrow position={[0, 0.02, 6.5]} rotation={[0, 0, 0]} color="#888" />

      {/* Corridor → Wing A (west) */}
      <FloorGuide from={[-3, 0.02, 11]} to={[-8, 0.02, 11]} />
      <FloorArrow position={[-7.5, 0.02, 11]} rotation={[0, -Math.PI / 2, 0]} color="#e8c47a" />

      {/* Corridor → Wing B (south) */}
      <FloorGuide from={[0, 0.02, 13]} to={[0, 0.02, 14]} />
      <FloorArrow position={[0, 0.02, 13.8]} rotation={[0, 0, 0]} color="#7ab8e8" />

      {/* Corridor → Wing C (east) */}
      <FloorGuide from={[3, 0.02, 11]} to={[8, 0.02, 11]} />
      <FloorArrow position={[7.5, 0.02, 11]} rotation={[0, Math.PI / 2, 0]} color="#c07ae8" />

      {/* ===== Wing A - About ===== */}
      <Room position={[-18, 0, 11]} size={[16, 5, 12]} doorways={['east']} />
      <RoomLighting position={[-18, 0, 11]} theme="warm" />
      <RoomArtworks placements={aboutPlacements} />

      {/* ===== Wing B - Projects ===== */}
      <Room position={[0, 0, 22]} size={[20, 5, 15]} doorways={['north', 'south']} />
      <RoomLighting position={[0, 0, 22]} theme="cool" />
      <RoomArtworks placements={[...projectsEast, ...projectsWest]} />

      {/* Wing B → Wing D (south) */}
      <FloorGuide from={[0, 0.02, 27]} to={[0, 0.02, 29]} />
      <FloorArrow position={[0, 0.02, 28.5]} rotation={[0, 0, 0]} color="#e8a07a" />

      {/* ===== Wing C - Career ===== */}
      <Room position={[18, 0, 11]} size={[16, 5, 12]} doorways={['west']} />
      <RoomLighting position={[18, 0, 11]} theme="dark" />
      <RoomArtworks placements={careerPlacements} />

      {/* ===== Wing D - Contact ===== */}
      <Room position={[0, 0, 35.5]} size={[16, 5, 12]} doorways={['north']} />
      <RoomLighting position={[0, 0, 35.5]} theme="cozy" />
      <RoomArtworks placements={contactPlacements} />

      {/* Minimap */}
      <Minimap />
    </>
  );
}
