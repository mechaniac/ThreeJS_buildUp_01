
import type * as THREE from 'three';

export type AppCamera = THREE.PerspectiveCamera;

export interface CameraOptions {
  fov?: number;
  near?: number;
  far?: number;
  position?: THREE.Vector3 | [number, number, number];
}




export type UpdateFn = (dt: number) => void;

export interface Disposable {
  dispose(): void;
}

export interface Updatable {
  update(dt: number): void;
}


export type Profile = (u: number) => THREE.Vector3;