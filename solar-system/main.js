let camera = undefined;
let renderer = undefined;
let controls = undefined;
let universe = undefined;
let target = undefined;

function createCamera() {
  camera = new THREE.OrthographicCamera();
  camera.position.z = 1E10;
  //camera.position.y = 61691041.22105463;
  camera.lookAt(0, 0, 0);
}

// function createCamera() {
//   camera = new THREE.PerspectiveCamera();
//   camera.position.z = 695705;
//   camera.lookAt(0, 0, 0);
// }

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  //renderer.autoClear = true;
  document.body.appendChild(renderer.domElement);
}

function createControls() {
  controls = new THREE.OrbitControls(camera);
  // controls.zoomSpeed = 5;
  controls.rotateSpeed = 0.05;
  // controls.maxAzimuthAngle = 0;
  // controls.minAzimuthAngle = 0;
  // controls.enableZoom = false;
}

function updateCamera() {
  const fieldOfView = 1E6;
  const width = window.innerWidth;
  const height = window.innerHeight;
  const ratio = width / height;
  camera.left = -fieldOfView / 2 * ratio;
  camera.right = fieldOfView / 2 * ratio;
  camera.top = fieldOfView / 2;
  camera.bottom = -fieldOfView / 2;
  camera.near = 0;
  camera.far = 1E20;
  camera.updateProjectionMatrix();
  // controls.update();
}

// function updateCamera() {
//   const width = window.innerWidth;
//   const height = window.innerHeight;
//   const ratio = width / height;
//   camera.fov = 20;
//   camera.aspect = ratio;
//   camera.near = 0;
//   camera.far = 1E9;
//   camera.updateProjectionMatrix();
//   controls.update();
// }

function updateRenderer() {
  const width = $(window).width();
  const height = $(window).height();
  renderer.setSize(width, height);
}

function bootSequence() {
  createCamera();
  createRenderer()
  createControls();
  updateCamera();
  updateRenderer();
}

const cameraDisplacement = new THREE.Vector3(0, 0, 1E6);
function centerCameraOn(target) {
  const targetPosition = target.getPosition();
  // const cameraPosition = targetPosition.clone();
  // cameraPosition.z = target.orbitalRadius;
  // cameraPosition.add(cameraDisplacement);
  // camera.position.copy(cameraPosition);
  // camera.lookAt(target.getPosition());
  // camera.updateProjectionMatrix();
  controls.target = targetPosition;
  controls.update();
}

setInterval(()=>{
  console.log(camera.position);
  console.log(target.getPosition());
  const vector = new THREE.Vector3();
  camera.getWorldDirection(vector);
  console.log(camera.zoom, vector);
}, 1000);

function main() {
  bootSequence();

  universe = new Universe();

  const sun = new Astro({
    resourcesURL: "sun",
    radius: 695700,
    obliquityToOrbit: 7.25,
    rotationalPeriod: 1 / 365 * 25,
  });

  const earth = new Astro({
    resourcesURL: "earth",
    radius: 6370,
    orbitalRadius: 147.09E6,
    orbitalPeriod: 1,
    orbitalAzimuth: 0,
    orbitalColor: [1, 0, 1],
    orbitalInclination: 0,
    obliquityToOrbit: -23.4,
    rotationalPeriod: 1 / 365,
  });
  sun.addOrbiter(earth);

  const moon = new Astro({
    resourcesURL: "moon",
    radius: 1737,
    orbitalRadius: 362600,
    orbitalPeriod: 1 / 365 * 27.322,
    orbitalAzimuth: 90,
    orbitalColor: [1, 1, 1],
    orbitalInclination: 5.145,
    obliquityToOrbit: -6.68,
    rotationalPeriod: Infinity,
  });
  earth.addOrbiter(moon);

  universe.addAstro(sun);

  target = earth;

  animate = function(time) {
    universe.tick(time);
    centerCameraOn(target);
    renderer.render(universe.threeScene, camera);
    requestAnimationFrame(animate);
  }
  animate(0);


  window.addEventListener(
    "resize",
    function () {
      updateCamera();
      updateRenderer();
    },
    false
  );
}

$(window).keydown(function(event) {
  console.log(event.key);
  cameraDisplacement.setY(cameraDisplacement.y + 100);
  console.log(cameraDisplacement);
});

