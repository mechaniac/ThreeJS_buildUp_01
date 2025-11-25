// src/modules/movableLimb.ts
import * as THREE from 'three';
import { makeCircleProfile } from '../geometry/profiles/circleProfile';
import { buildLoftTube } from '../geometry/loft/buildLoftTube';
import type { CircleProfileState, Disposable } from '../shared/types';

export interface MovableLimbOptions {
  radii?: [number, number, number];
  centers?: [THREE.Vector3, THREE.Vector3, THREE.Vector3];
  segmentsU?: number;
  meshColor?: THREE.ColorRepresentation
}

export function createMovableLimb(
  scene: THREE.Scene,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer,
  opts: MovableLimbOptions = {}
): Disposable {
  const radii = opts.radii ?? [0.4, 0.3, 0.2];
  const centers =
    opts.centers ??
    [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, 2, 0),
    ];
  const segmentsU = opts.segmentsU ?? 32;
  const meshColor = opts.meshColor ?? 0x4477cc;

  // --- circle states + handles
  const circleStates: CircleProfileState[] = [];

  function createCircleState(radius: number, center: THREE.Vector3): CircleProfileState {
    const profile = makeCircleProfile(radius, center);

    const handleGeom = new THREE.SphereGeometry(0.05, 12, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xffcc55 });
    const handle = new THREE.Mesh(handleGeom, handleMat);
    handle.position.copy(center);
    scene.add(handle);

    return { center, radius, profile, handle };
  }

  for (let i = 0; i < radii.length; i++) {
    circleStates.push(createCircleState(radii[i]!, centers[i]!));
  }

  // --- lofted mesh
  function buildLimbGeometry(): THREE.BufferGeometry {
    const profiles = circleStates.map((s) => s.profile);
    return buildLoftTube(profiles, segmentsU);
  }

  let limbGeom = buildLimbGeometry();
  const limbMat = new THREE.MeshStandardMaterial({
    color: meshColor,
    metalness: 0.1,
    roughness: 0.6,
  });
  const limbMesh = new THREE.Mesh(limbGeom, limbMat);
  scene.add(limbMesh);

  function rebuildLimb() {
    const newGeom = buildLimbGeometry();
    limbMesh.geometry.dispose();
    limbMesh.geometry = newGeom;
  }

  // --- interaction (raycast + drag)
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const dragPlane = new THREE.Plane();
  const dragPoint = new THREE.Vector3();

  let activeCircle: CircleProfileState | null = null;

  function updatePointer(event: PointerEvent) {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  }

  const onPointerDown = (event: PointerEvent) => {
    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);

    const handles = circleStates.map((s) => s.handle);
    const hits = raycaster.intersectObjects(handles, false);
    if (hits.length === 0) return;

    const hit = hits[0]!.object;
    activeCircle = circleStates.find((s) => s.handle === hit) ?? null;
  };

  const onPointerMove = (event: PointerEvent) => {
    if (!activeCircle) return;

    updatePointer(event);
    raycaster.setFromCamera(pointer, camera);

    // drag on horizontal plane at circle's current Y
    dragPlane.set(new THREE.Vector3(0, 1, 0), -activeCircle.center.y);

    if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
      activeCircle.center.copy(dragPoint);
      activeCircle.handle.position.copy(dragPoint);
      rebuildLimb();
    }
  };

  const onPointerUp = () => {
    activeCircle = null;
  };

  renderer.domElement.addEventListener('pointerdown', onPointerDown);
  renderer.domElement.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);

  // --- dispose hook
  const dispose = () => {
    renderer.domElement.removeEventListener('pointerdown', onPointerDown);
    renderer.domElement.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);

    // remove meshes
    scene.remove(limbMesh);
    limbGeom.dispose();
    limbMat.dispose();

    for (const s of circleStates) {
      scene.remove(s.handle);
      s.handle.geometry.dispose();
      (s.handle.material as THREE.Material).dispose();
    }
  };

  return { dispose };
}
