// src/modules/draggableSphere.ts
import * as THREE from 'three';
import type { Disposable } from '../shared/types';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';


export interface DraggableSphereOptions {
    position?: THREE.Vector3;
    radius?: number;
    color?: number;
}

export interface DraggableSphere extends Disposable {
    mesh: THREE.Mesh;
}

export function createDraggableSphere(
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    renderer: THREE.WebGLRenderer,
    orbitControls: { controls: OrbitControls },  // <— pass this
    opts: DraggableSphereOptions = {}
): DraggableSphere {
    const radius = opts.radius ?? 0.1;
    const color = opts.color ?? 0xffcc55;
    const position = opts.position ?? new THREE.Vector3(0, 0.5, 0);

    // --- create the sphere mesh
    const geom = new THREE.SphereGeometry(radius, 16, 16);
    const mat = new THREE.MeshStandardMaterial({ color });
    const mesh = new THREE.Mesh(geom, mat);
    mesh.position.copy(position);
    scene.add(mesh);

    // --- raycasting + dragging
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const dragPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -mesh.position.y);
    const dragPoint = new THREE.Vector3();

    let dragging = false;

    function updatePointer(event: PointerEvent) {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    const onPointerDown = (event: PointerEvent) => {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);

        // check if we clicked this sphere
        const hits = raycaster.intersectObject(mesh, false);
        if (hits.length === 0) return;

        dragging = true;
        orbitControls.controls.enabled = false;  // on pointer down
        // set drag plane at current Y
        dragPlane.set(new THREE.Vector3(0, 1, 0), -mesh.position.y);
    };

    const onPointerMove = (event: PointerEvent) => {
        if (!dragging) return;

        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);

        if (raycaster.ray.intersectPlane(dragPlane, dragPoint)) {
            // move mesh to intersection point
            mesh.position.copy(dragPoint);
        }
    };

    const onPointerUp = () => {
        dragging = false;
        orbitControls.controls.enabled = true;  // on pointer up
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const dispose = () => {
        renderer.domElement.removeEventListener('pointerdown', onPointerDown);
        renderer.domElement.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', onPointerUp);

        scene.remove(mesh);
        geom.dispose();
        mat.dispose();
    };

    return { mesh, dispose };
}
