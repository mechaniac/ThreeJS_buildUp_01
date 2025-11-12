import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0f0f12);

  const key = new THREE.DirectionalLight(0xffffff, 1.0);
  key.position.set(3, 4, 2);

  const fill = new THREE.AmbientLight(0xffffff, 0.3);

  scene.add(key, fill);
  return scene;
}
