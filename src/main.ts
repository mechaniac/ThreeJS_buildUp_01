// src/main.ts
import './style.css';
import * as THREE from 'three';
import { createRenderer } from './core/renderer';
import { createCamera } from './core/camera';
import { createScene } from './core/scene';
import { createLoop } from './systems/loop';
import { handleResize } from './systems/resize';
import { addOrbitControls } from './controls/orbit';
import { createGround } from './objects/ground';
import { createMovableLimb } from './modules/movableLimb';

const canvas = document.getElementById('scene') as HTMLCanvasElement;

const renderer = createRenderer(canvas);
const camera = createCamera({ fov: 50, position: [0, 5, 5] });
const scene = createScene();

const ground = createGround();
scene.add(ground);

// modules
const limb = createMovableLimb(scene, camera, renderer, {
  radii: [0.4, 0.3, 0.2],
  centers: [
    new THREE.Vector3(-1, 0, 0),
    new THREE.Vector3(-1, 1, 0),
    new THREE.Vector3(-1, 2, 0),
  ],
  segmentsU: 8,
  meshColor: 0xFF2600
});

const limb2 = createMovableLimb(scene, camera, renderer, {
  radii: [0.4, 0.3, 0.2],
  centers: [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(1, 1, 0),
    new THREE.Vector3(1, 2, 0),
  ],
  segmentsU: 8
});

const loop = createLoop(renderer, scene, camera);
const orbit = addOrbitControls(camera, renderer.domElement);
const unresize = handleResize(renderer, camera);

loop.add(orbit.update);
loop.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    loop.stop();
    orbit.dispose();
    limb.dispose();
    unresize();
  });
}
