import Room from './Room';
import Lighting from './Lighting';
import Player from './Player';
import RoomArtworks, { distributeOnWall } from './RoomArtworks';
import { useProximityDetector } from '../../hooks/useProximity';
import portfolio from '../../data/portfolio';

function ProximityManager() {
  useProximityDetector();
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

  // Wing B - Projects: east wall (x = 10, faces west → rotY = -π/2) and west wall
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
      <ProximityManager />

      {/* Entrance Hall */}
      <Room position={[0, 0, 0]} size={[20, 5, 15]} doorways={['south']} />
      <RoomArtworks placements={entrancePlacements} />

      {/* Wing A - About */}
      <Room position={[-20, 0, 22.5]} size={[16, 5, 12]} doorways={['east']} />
      <RoomArtworks placements={aboutPlacements} />

      {/* Corridor */}
      <Room position={[0, 0, 18.5]} size={[20, 5, 7]} doorways={['north', 'south', 'east', 'west']} />

      {/* Wing B - Projects */}
      <Room position={[0, 0, 37]} size={[20, 5, 15]} doorways={['north', 'south']} />
      <RoomArtworks placements={[...projectsEast, ...projectsWest]} />

      {/* Wing C - Career */}
      <Room position={[20, 0, 22.5]} size={[16, 5, 12]} doorways={['west']} />
      <RoomArtworks placements={careerPlacements} />

      {/* Wing D - Contact */}
      <Room position={[0, 0, 55]} size={[16, 5, 12]} doorways={['north']} />
      <RoomArtworks placements={contactPlacements} />
    </>
  );
}
