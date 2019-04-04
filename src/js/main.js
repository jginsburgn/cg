let renderer = undefined;
let scene = undefined;
let camera = undefined;
let absoluteAccumulatedTime = 0;
let ship = undefined;

$(function () {
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  camera = new THREE.PerspectiveCamera(17, ratio, 0.01, 10000);
  // camera.position.set(0, 0, 0);
  // camera.lookAt(0, 0, 0);
  const controls = new THREE.OrbitControls(camera);
  controls.update();

  renderer = new THREE.WebGLRenderer();
  $("#canvas-container").append(renderer.domElement);

  scene = new THREE.Scene();
  var light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  ship = new Ship();
  scene.add(ship);

  renderer.setAnimationLoop(animationLoop);
  updateViewport();
});

function animationLoop(accumulatedTime) {
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  absoluteAccumulatedTime = accumulatedTime;
  ship.tick();
  Laser.tick();
  Meteor.tick();
  Saucer.tick();
  renderer.render(scene, camera);
}

function getWidthAndHeight() {
  const width = $("#canvas-container").width();
  const height = $("#canvas-container").height();
  return { width, height };
}

function updateViewport() {
  // A trial-and-error-deduced multiplier to achieve a FOV for an average user in front of a computer screen
  const ANGLE_MULTIPLIER = 2.25E-2;
  const { width, height } = getWidthAndHeight();
  const fov = height * ANGLE_MULTIPLIER;
  camera.aspect = width / height;
  camera.fov = fov;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  Ship.updatePositionBounds(camera.aspect * camera.fov / 5.7 / 2, camera.fov / 5.7 / 2);
}

$(window).on(
  "resize",
  updateViewport
);