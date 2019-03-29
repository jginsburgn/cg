let renderer = undefined;
let scene = undefined;
let camera = undefined;
let bunny = undefined;
let absoluteAccumulatedTime = 0;

$(function () {
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  camera = new THREE.PerspectiveCamera(17, ratio, 0.01, 10000);
  camera.position.set(0, 12, 10);
  camera.lookAt(0, 0, -1000);

  const controls = new THREE.OrbitControls(camera);
  controls.update();

  renderer = new THREE.WebGLRenderer();
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
  updateViewport();
  $("#canvas-container").append(renderer.domElement);

  scene = new THREE.Scene();

  const light = new THREE.PointLight(0xffffff, 1, 100);
  light.position.set(0, 10, 0);
  light.castShadow = true;
  scene.add(light);

  light.shadow.mapSize.width = 800;  // default
  light.shadow.mapSize.height = 800; // default
  light.shadow.camera.far = 20      // default

  bunny = new Bunny();
  scene.add(bunny);

  const geometry = new THREE.PlaneGeometry(1000, 1000);
  const material = new THREE.MeshPhongMaterial({ color: 0x7cfc00, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(geometry, material);
  plane.receiveShadow = true;
  plane.rotation.set(Math.PI / 2, 0, 0);
  scene.add(plane);

  // var helper = new THREE.CameraHelper(light.shadow.camera);
  // scene.add( helper );

  renderer.setAnimationLoop(animationLoop)
});

function animationLoop(accumulatedTime) {
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  const oldPosition = bunny.position.clone();
  bunny.position.setY(0.5 * Math.abs(Math.sin(accumulatedTime * 0.005)));
  bunny.position.setX(2 * Math.sin(accumulatedTime * 0.0005));
  bunny.position.setZ(Math.sin(2 * accumulatedTime * 0.0005));
  const newPosition = bunny.position.clone();
  const oldHorizontal = new THREE.Vector2(oldPosition.x, oldPosition.z);
  const newHorizontal = new THREE.Vector2(newPosition.x, newPosition.z);
  const angle = - newHorizontal.sub(oldHorizontal).angle() + Math.PI * 1.05;

  bunny.rotation.set(0, angle, 0);
  absoluteAccumulatedTime = accumulatedTime;
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
}

$(window).on(
  "resize",
  updateViewport
);