import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export function addOrbitControls(camera, domElement) {
  const controls = new OrbitControls(camera, domElement);
  controls.enableDamping = true;

  function update(dt) { controls.update(); }
  function dispose() { controls.dispose(); }

  return { update, dispose };
}
