import * as THREE from 'three';

export function createGround() {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: 0x222226, roughness: 0.9 })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.51;
  return ground;
}
