import './style.css';
import { createRenderer } from './core/renderer.js';
import { createCamera } from './core/camera.js';
import { createScene } from './core/scene.js';
import { createLoop } from './systems/loop.js';
import { handleResize } from './systems/resize.js';
import { addOrbitControls } from './controls/orbit.js';
import { addDragRotate } from './controls/dragRotate.js';
import { createCube } from './objects/cube.js';
import { createGround } from './objects/ground.js';

// canvas
const canvas = document.getElementById('scene');

// core
const renderer = createRenderer(canvas);
const camera   = createCamera();
const scene    = createScene();

// content
const cube = createCube();
scene.add(cube);

const ground = createGround();
scene.add(ground);

// systems
const loop = createLoop(renderer, scene, camera);
const orbit = addOrbitControls(camera, renderer.domElement);
// const drag  = addDragRotate(cube, renderer.domElement);
const unresize = handleResize(renderer, camera);

// per-frame updates
loop.add(orbit.update);            // keep controls smooth
loop.add((dt) => { cube.rotation.y += dt * 0.3; }); // gentle auto spin

// go
loop.start();

// (optional) clean-up hook if you hot-reload or navigate away
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    loop.stop();
    orbit.dispose();
    // drag.dispose();
    unresize();
  });
}
