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

  // Entrance Hall: 정면 벽 (north wall, z = -7.5)
  const entrancePlacements = distributeOnWall(
    entrance.artworks,
    [-3, 2.2, -7.2], [3, 2.2, -7.2],
    [0, 0, 0],
    2.2, [3, 2],
  );

  // Wing A - About: west wall (x = -28, faces east → rotY = π/2)
  const aboutPlacements = distributeOnWall(
    about.artworks,
    [-27.7, 2.2, 18], [-27.7, 2.2, 27],
    [0, Math.PI / 2, 0],
    2.2,
  );

  // Wing B - Projects: east wall and west wall
  const projectsEast = distributeOnWall(
    projects.artworks.slice(0, 2),
    [9.7, 2.2, 32], [9.7, 2.2, 42],
    [0, -Math.PI / 2, 0],
    2.2,
  );
  const projectsWest = distributeOnWall(
    projects.artworks.slice(2),
    [-9.7, 2.2, 32], [-9.7, 2.2, 42],
    [0, Math.PI / 2, 0],
    2.2,
  );

  // Wing C - Career: east wall (x = 28, faces west → rotY = -π/2)
  const careerPlacements = distributeOnWall(
    career.artworks,
    [27.7, 2.2, 18], [27.7, 2.2, 27],
    [0, -Math.PI / 2, 0],
    2.2,
  );

  // Wing D - Contact: south wall (z = 61, faces north → rotY = π)
  const contactPlacements = distributeOnWall(
    contact.artworks,
    [-3, 2.2, 60.7], [3, 2.2, 60.7],
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
      <Room position={[0, 0, 18.5]} size={[20, 5, 7]} doorways={['north', 'south', 'east', 'west']} />
      <RoomLighting position={[0, 0, 18.5]} theme="warm" />

      {/* Floor guides: corridor → wings */}
      <FloorGuide from={[0, 0.02, 8]} to={[0, 0.02, 15]} />
      <FloorArrow position={[0, 0.02, 14]} rotation={[0, Math.PI, 0]} color="#888" />

      {/* Corridor → Wing A (west) */}
      <FloorGuide from={[-5, 0.02, 18.5]} to={[-10, 0.02, 18.5]} />
      <FloorArrow position={[-9, 0.02, 18.5]} rotation={[0, Math.PI / 2, 0]} color="#e8c47a" />

      {/* Corridor → Wing B (south) */}
      <FloorGuide from={[0, 0.02, 22]} to={[0, 0.02, 28]} />
      <FloorArrow position={[0, 0.02, 27]} rotation={[0, Math.PI, 0]} color="#7ab8e8" />

      {/* Corridor → Wing C (east) */}
      <FloorGuide from={[5, 0.02, 18.5]} to={[10, 0.02, 18.5]} />
      <FloorArrow position={[9, 0.02, 18.5]} rotation={[0, -Math.PI / 2, 0]} color="#c07ae8" />

      {/* ===== Wing A - About ===== */}
      <Room position={[-20, 0, 22.5]} size={[16, 5, 12]} doorways={['east']} />
      <RoomLighting position={[-20, 0, 22.5]} theme="warm" />
      <RoomArtworks placements={aboutPlacements} />

      {/* ===== Wing B - Projects ===== */}
      <Room position={[0, 0, 37]} size={[20, 5, 15]} doorways={['north', 'south']} />
      <RoomLighting position={[0, 0, 37]} theme="cool" />
      <RoomArtworks placements={[...projectsEast, ...projectsWest]} />

      {/* Wing B → Wing D */}
      <FloorGuide from={[0, 0.02, 44]} to={[0, 0.02, 48]} />
      <FloorArrow position={[0, 0.02, 47]} rotation={[0, Math.PI, 0]} color="#e8a07a" />

      {/* ===== Wing C - Career ===== */}
      <Room position={[20, 0, 22.5]} size={[16, 5, 12]} doorways={['west']} />
      <RoomLighting position={[20, 0, 22.5]} theme="dark" />
      <RoomArtworks placements={careerPlacements} />

      {/* ===== Wing D - Contact ===== */}
      <Room position={[0, 0, 55]} size={[16, 5, 12]} doorways={['north']} />
      <RoomLighting position={[0, 0, 55]} theme="cozy" />
      <RoomArtworks placements={contactPlacements} />

      {/* Minimap */}
      <Minimap />
    </>
  );
}
