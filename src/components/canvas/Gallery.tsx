import { useMemo } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import Room from './Room';
import Lighting from './Lighting';
import RoomLighting from './RoomLighting';
import { Sparkles } from '@react-three/drei';
import Player from './Player';
import RoomArtworks, { distributeOnWall } from './RoomArtworks';
import EntranceTitle from './EntranceTitle';
import EntranceParticles from './EntranceParticles';
import GalleryObjects from './GalleryObjects';
import { useProximityDetector } from '../../hooks/useProximity';
import { useCameraFocus } from '../../hooks/useCameraFocus';
import { useFootsteps } from '../../hooks/useFootsteps';
import { useAmbientSound } from '../../hooks/useAmbientSound';
import { useDeepLink } from '../../hooks/useDeepLink';
import { useWingDetector } from '../../hooks/useWingDetector';
import { cameraRef } from '../../utils/cameraRef';
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

function CameraTracker() {
  const { camera } = useThree();
  const dirVec = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    camera.getWorldDirection(dirVec);
    cameraRef.pos.x = camera.position.x;
    cameraRef.pos.y = camera.position.y;
    cameraRef.pos.z = camera.position.z;
    cameraRef.dir.x = dirVec.x;
    cameraRef.dir.y = dirVec.y;
    cameraRef.dir.z = dirVec.z;
  });
  return null;
}

function SceneManager() {
  useProximityDetector();
  useCameraFocus();
  useFootsteps();
  useAmbientSound();
  useDeepLink();
  useWingDetector();
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
      <CameraTracker />
      <GalleryObjects />

      {/* ===== Entrance Hall ===== */}
      <Room position={[0, 0, 0]} size={[20, 5, 15]} doorways={['south']} theme="grand" />
      <RoomLighting position={[0, 0, 0]} theme="grand" />
      <EntranceTitle />
      <EntranceParticles />
      <RoomArtworks placements={entrancePlacements} />

      {/* ===== Corridor ===== */}
      <Room position={[0, 0, 11]} size={[20, 5, 7]} doorways={['north', 'south', 'east', 'west']} theme="warm" />
      <RoomLighting position={[0, 0, 11]} theme="warm" />


      {/* ===== Wing A - About ===== */}
      <Room position={[-18, 0, 11]} size={[16, 5, 12]} doorways={['east']} theme="warm" />
      <RoomLighting position={[-18, 0, 11]} theme="warm" />
      <RoomArtworks placements={aboutPlacements} />
      <Sparkles position={[-18, 2.5, 11]} count={15} scale={[14, 4, 10]} size={1.5} speed={0.2} opacity={0.15} color="#ffe4c4" />

      {/* ===== Wing B - Projects ===== */}
      <Room position={[0, 0, 22]} size={[20, 5, 15]} doorways={['north', 'south']} theme="cool" />
      <RoomLighting position={[0, 0, 22]} theme="cool" />
      <RoomArtworks placements={[...projectsEast, ...projectsWest]} />
      <Sparkles position={[0, 2.5, 22]} count={15} scale={[18, 4, 13]} size={1.5} speed={0.2} opacity={0.15} color="#cce0ff" />


      {/* ===== Wing C - Career ===== */}
      <Room position={[18, 0, 11]} size={[16, 5, 12]} doorways={['west']} theme="dark" />
      <RoomLighting position={[18, 0, 11]} theme="dark" />
      <RoomArtworks placements={careerPlacements} />
      <Sparkles position={[18, 2.5, 11]} count={15} scale={[14, 4, 10]} size={1.5} speed={0.2} opacity={0.15} color="#e0d0ff" />

      {/* ===== Wing D - Contact ===== */}
      <Room position={[0, 0, 35.5]} size={[16, 5, 12]} doorways={['north']} theme="cozy" />
      <RoomLighting position={[0, 0, 35.5]} theme="cozy" />
      <RoomArtworks placements={contactPlacements} />
      <Sparkles position={[0, 2.5, 35.5]} count={15} scale={[14, 4, 10]} size={1.5} speed={0.2} opacity={0.15} color="#ffd9a0" />

    </>
  );
}
