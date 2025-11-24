// src/geometry/loft/buildLoftTube.ts
import * as THREE from 'three';
import type { Profile } from '../../shared/types';

export function buildLoftTube(
  profiles: Profile[],
  segmentsU = 32
): THREE.BufferGeometry {
  if (profiles.length < 2) {
    throw new Error('buildLoftTube requires at least 2 profiles');
  }

  const geometry = new THREE.BufferGeometry();

  const vertsU = segmentsU + 1;       // seam closed
  const vertsV = profiles.length;     // one ring per profile

  const vertexCount = vertsU * vertsV;
  const positions = new Float32Array(vertexCount * 3);

  // positions
  let index = 0;
  for (let j = 0; j < vertsV; j++) {
    const profile = profiles[j]!;
    for (let i = 0; i < vertsU; i++) {
      const u = i / segmentsU;
      const p = profile(u);
      positions[index++] = p.x;
      positions[index++] = p.y;
      positions[index++] = p.z;
    }
  }

  // indices (quads between rings j and j+1)
  const segmentsV = vertsV - 1;
  const quadCount = segmentsU * segmentsV;
  const indexCount = quadCount * 6;
  const indices = new Uint32Array(indexCount);

  let idx = 0;
  for (let j = 0; j < segmentsV; j++) {
    for (let i = 0; i < segmentsU; i++) {
      const a = j * vertsU + i;
      const b = j * vertsU + (i + 1);
      const c = (j + 1) * vertsU + (i + 1);
      const d = (j + 1) * vertsU + i;

      // OUTWARD winding:
      indices[idx++] = a;
      indices[idx++] = d;
      indices[idx++] = b;

      indices[idx++] = b;
      indices[idx++] = d;
      indices[idx++] = c;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setIndex(new THREE.BufferAttribute(indices, 1));
  geometry.computeVertexNormals();

  return geometry;
}
