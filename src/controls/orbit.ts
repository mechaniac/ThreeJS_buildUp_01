import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type * as THREE from 'three';
import type { Disposable, UpdateFn } from '../types';

export function addOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement
): { update: UpdateFn } & Disposable {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;

  return {
    update: () => controls.update(),
    dispose: () => controls.dispose(),
  };
}
