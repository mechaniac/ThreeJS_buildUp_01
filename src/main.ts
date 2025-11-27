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
import { createDraggableSphere } from './modules/draggableSphere';

const canvas = document.getElementById('scene') as HTMLCanvasElement;

const renderer = createRenderer(canvas);
const camera   = createCamera({ fov: 50, position: [0, 3, 3] });
const scene    = createScene();

const ground = createGround();
scene.add(ground);
const orbit  = addOrbitControls(camera, renderer.domElement);
const loop   = createLoop(renderer, scene, camera);
const unresize = handleResize(renderer, camera);

// just one draggable sphere for now
const sphere = createDraggableSphere(scene, camera, renderer, orbit, {
  position: new THREE.Vector3(0, 1, 0),
  radius: 0.3,
  color: 0xffaa33,
});



loop.add(orbit.update);
loop.start();

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    loop.stop();
    orbit.dispose();
    sphere.dispose();
    unresize();
  });
}
