let camera = undefined;
let renderer = undefined;
let control = undefined;
let universe = undefined;

function updateRenderer() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function updateCamera(fieldOfView) {
  if (!fieldOfView) {
    fieldOfView = 0.1;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;
  camera.left = -fieldOfView / 2 * ratio;
  camera.right = fieldOfView / 2 * ratio;
  camera.top = fieldOfView / 2;
  camera.bottom = -fieldOfView / 2;
  camera.near = 0;
  camera.far = 10E10;
  camera.updateProjectionMatrix();
  control.update();
}

let current = 0;
function a() {
  current = (current + 1) % universe.objects.length;
  const object = universe.objects[current];
  console.log(object.resourcesURL);
  control.target = object.getPosition();
  updateCamera();
}

function main() {
  camera = new THREE.OrthographicCamera();
  control = new THREE.OrbitControls(camera);

  updateCamera();

  renderer = new THREE.WebGLRenderer();
  document.body.appendChild(renderer.domElement);
  updateRenderer();

  camera.position.y = 10;
  camera.position.z = 10;
  camera.lookAt(0, 0, 0);

  universe = new Universe();
  universe.threeScene.add(camera);

  const earth = new SphericalObject(
    "earth",
    Km2AU(6371.0E1),
    Kg2EM(5.97237E24),
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(0, 0, - KmPs2AUPY(29.78)),
    1 / 365,
    7.155
  );
  universe.addObject(earth);

  const moon = new SphericalObject(
    "moon",
    Km2AU(1737E1),
    Kg2EM(7.342E22),
    new THREE.Vector3(1 + Km2AU(363300), 0, 0),
    new THREE.Vector3(0, 0, - KmPs2AUPY(29.78 + 1.082)),
    1 / 365 * 27.321661,
    0
  );
  universe.addObject(moon);

  const sun = new SphericalObject(
    "sun",
    Km2AU(695700),
    Kg2EM(1.9885E30),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
    1 / 365 * 24.47,
    0
  );
  universe.addObject(sun);

  function animate(time) {
    const mp = moon.getPosition();
    const mv = moon.velocity.clone();
    const ep = earth.getPosition();
    const ev = moon.velocity;
    ep.sub(mp);
    mv.sub(ev);
    console.log(AU2Km(ep.length()), AUPY2KmPs(mv.length()));
    const object = universe.objects[current];
    control.target = object.getPosition();
    updateCamera();
    requestAnimationFrame(animate);
    universe.tick(time)
    renderer.render(universe.threeScene, camera);
  }
  animate(0);
  window.addEventListener('resize', function () {
    updateCamera();
    updateRenderer();

    // renderer.setSize(window.innerWidth, window.innerHeight);

  }, false);
}



