// src/geometry/loft/buildLoftedCylinder.ts
import type { Profile } from '../../shared/types';
import { buildLoftTube } from './buildLoftTube';

export function buildLoftedCylinder(
  profile0: Profile,
  profile1: Profile,
  segmentsU = 32
) {
  return buildLoftTube([profile0, profile1], segmentsU);
}
