import type * as THREE from 'three';
import type { Disposable } from '../shared/types';

export function addDragRotate(target: THREE.Object3D, domElement: HTMLElement): Disposable {
  let dragging = false;
  let lastX = 0, lastY = 0;

  function onDown(e: PointerEvent) {
    dragging = true;
    lastX = e.clientX; lastY = e.clientY;
  }
  function onMove(e: PointerEvent) {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    const dy = e.clientY - lastY;
    lastX = e.clientX; lastY = e.clientY;
    target.rotation.y += dx * 0.01;
    target.rotation.x += dy * 0.01;
  }
  function onUp() { dragging = false; }

  domElement.addEventListener('pointerdown', onDown);
  window.addEventListener('pointermove', onMove);
  window.addEventListener('pointerup', onUp);

  return {
    dispose() {
      domElement.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    }
  };
}
