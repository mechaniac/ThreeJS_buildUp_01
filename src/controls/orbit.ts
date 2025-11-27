import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type * as THREE from 'three';
import type { OrbitControlsWrapper } from '../shared/types';

export function addOrbitControls(
  camera: THREE.Camera,
  domElement: HTMLElement
): OrbitControlsWrapper {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;

  return {
    controls,               // <— add this
    update: () => controls.update(),
    dispose: () => controls.dispose(),
  };
}
