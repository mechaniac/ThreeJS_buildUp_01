
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

export interface CircleProfileState {
  center: THREE.Vector3;
  radius: number;
  profile: Profile;
  handle: THREE.Mesh;  // little sphere you drag
}