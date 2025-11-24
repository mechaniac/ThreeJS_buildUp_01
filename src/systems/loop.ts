import type { UpdateFn } from '../types';

export function createLoop(renderer: any, scene: any, camera: any) {
  const updaters = new Set<UpdateFn>();
  let raf = 0;
  let last = performance.now();

  function add(fn: UpdateFn) { updaters.add(fn); return () => updaters.delete(fn); }

  function frame(now: number) {
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
