import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('scene');

// --- renderer
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// resize();

// --- scene + camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0f0f12);

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2.5, 2, 3);
resize();
// --- lights
const key = new THREE.DirectionalLight(0xffffff, 1.0);
key.position.set(3, 4, 2);
scene.add(key);

const fill = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(fill);

// --- cube
const cubeGeom = new THREE.BoxGeometry(1, 1, 1);
const cubeMat = new THREE.MeshStandardMaterial({ color: 0x44aa88, roughness: 0.5, metalness: 0.1 });
const cube = new THREE.Mesh(cubeGeom, cubeMat);
scene.add(cube);

// --- ground (subtle)
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.9, metalness: 0.0 })
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -0.51;
ground.receiveShadow = false;
scene.add(ground);

// --- camera orbit (for context)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// --- simple drag-to-rotate the cube itself
let dragging = false;
let lastX = 0, lastY = 0;

canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  lastX = e.clientX;
  lastY = e.clientY;

  // rotate cube (radians per pixel)
  cube.rotation.y += dx * 0.01;
  cube.rotation.x += dy * 0.01;
});

window.addEventListener('pointerup', () => { dragging = false; });

// --- animation loop
const clock = new THREE.Clock();
function tick() {
  const dt = clock.getDelta();

  // gentle auto-spin so it's not static (still user-overridable by drag)
  cube.rotation.y += dt * 0.3;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(tick);
}
tick();

// --- resize
window.addEventListener('resize', resize);
function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
