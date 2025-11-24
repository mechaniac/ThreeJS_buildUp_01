// circles.ts
import * as THREE from 'three';
import type { Profile } from '../../shared/types';

export function makeCircleProfile(
  radius: number,
  center: THREE.Vector3
): Profile {
  return (u: number) => {
    const angle = u * Math.PI * 2; // 0..2π
    return new THREE.Vector3(
      center.x + radius * Math.cos(angle),
      center.y,
      center.z + radius * Math.sin(angle)
    );
  };
}
