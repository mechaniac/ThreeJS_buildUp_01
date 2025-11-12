// a tiny game loop that calls registered updaters each frame
export function createLoop(renderer, scene, camera) {
  const updaters = new Set();
  let raf = 0, last = performance.now();

  function add(fn) { updaters.add(fn); return () => updaters.delete(fn); }

  function frame(now) {
    const dt = (now - last) / 1000;
    last = now;

    for (const fn of updaters) fn(dt);
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() { last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop()  { cancelAnimationFrame(raf); }

  return { add, start, stop };
}
