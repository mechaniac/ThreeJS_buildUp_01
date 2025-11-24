// core/camera.ts
import * as THREE from 'three';
import type { AppCamera, CameraOptions } from '../shared/types';

export function createCamera(opts: CameraOptions = {}): AppCamera {
  const {
    fov = 60,
    near = 0.1,
    far = 100,
    position = [2.5, 2, 3],
  } = opts;

  const camera = new THREE.PerspectiveCamera(
    fov,
    1, // aspect will be set by handleResize
    near,
    far
  );

  if (position instanceof THREE.Vector3) {
    camera.position.copy(position);
  } else {
    camera.position.set(position[0], position[1], position[2]);
  }

  return camera;
}
