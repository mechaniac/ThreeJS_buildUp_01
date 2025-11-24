import type * as THREE from 'three';

export function handleResize(renderer: THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();
  return () => window.removeEventListener('resize', resize);
}
