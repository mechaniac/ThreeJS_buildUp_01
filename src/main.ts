import './style.css';
import * as THREE from 'three';
import { createRenderer } from './core/renderer';
import { createCamera } from './core/camera';
import { createScene } from './core/scene';
import { createLoop } from './systems/loop';
import { handleResize } from './systems/resize';
import { addOrbitControls } from './controls/orbit';
import { addDragRotate } from './controls/dragRotate';
import { createCube } from './objects/cube';
import { createGround } from './objects/ground';

import { makeCircleProfile } from './geometry/profiles/circleProfile';
import { buildLoftedCylinder } from './geometry/loft/buildLoftedCylinder';
import { buildLoftTube } from './geometry/loft/buildLoftTube';

const canvas = document.getElementById('scene') as HTMLCanvasElement;

const renderer = createRenderer(canvas);
const camera   = createCamera({fov :50, position:[2,2,2]});
const scene    = createScene();

// const cube = createCube();
// scene.add(cube);

const ground = createGround();
scene.add(ground);

// limb 1
const limb1Profiles = [
  makeCircleProfile(0.4, new THREE.Vector3(0, 0, 0)),
  makeCircleProfile(0.1, new THREE.Vector3(0, 1, 0)),
  makeCircleProfile(0.5, new THREE.Vector3(0, 2, 0)),
];

const limb1Geo = buildLoftTube(limb1Profiles, 8);
const limb1Mat = new THREE.MeshStandardMaterial({ color: 0x4477cc });
const limb1    = new THREE.Mesh(limb1Geo, limb1Mat);
scene.add(limb1);

// limb 2, at another position with different radii
const limb2Profiles = [
  makeCircleProfile(0.2, new THREE.Vector3(1, 0, 0)),
  makeCircleProfile(0.4, new THREE.Vector3(1, 1, 0)),
  makeCircleProfile(0.25, new THREE.Vector3(1, 2, 0)),
];

const limb2Geo = buildLoftTube(limb2Profiles, 32);
const limb2Mat = new THREE.MeshStandardMaterial({ color: 0xcc7744 });
const limb2    = new THREE.Mesh(limb2Geo, limb2Mat);
scene.add(limb2);

const loop = createLoop(renderer, scene, camera);
const orbit = addOrbitControls(camera, renderer.domElement);
// const drag  = addDragRotate(cube, renderer.domElement);
const unresize = handleResize(renderer, camera);

loop.add(orbit.update);
// loop.add((dt) => { cube.rotation.y += dt * 0.3; });
loop.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    loop.stop();
    orbit.dispose();
    // drag.dispose();
    unresize();
  });
}
