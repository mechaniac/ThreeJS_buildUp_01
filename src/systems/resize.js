export function handleResize(renderer, camera) {
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize(); // initial
  return () => window.removeEventListener('resize', resize);
}
