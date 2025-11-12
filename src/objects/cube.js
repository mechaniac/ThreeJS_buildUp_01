import * as THREE from 'three';

export function createCube() {
  const geom = new THREE.BoxGeometry(1, 3, 1);
  const mat = new THREE.MeshStandardMaterial({
    color: 0x44aa88,
    roughness: 0.5,
    metalness: 0.1,
  });
  return new THREE.Mesh(geom, mat);
}
