let camera = undefined;
let renderer = undefined;
let controls = undefined;
let universe = undefined;
let target = undefined;

function createCamera() {
  camera = new THREE.OrthographicCamera();
  camera.lookAt(0, 0, 0);
}

// function createCamera() {
//   camera = new THREE.PerspectiveCamera();
//   camera.position.z = 695705;
//   camera.lookAt(0, 0, 0);
// }

function createRenderer() {
  renderer = new THREE.WebGLRenderer();
  renderer.autoClear = true;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap = THREE.PCFShadowMap;
  $("#canvas-holder").append(renderer.domElement);
}

function createControls() {
  controls = new THREE.OrbitControls(camera, $("canvas").get(0));
  // controls.zoomSpeed = 5;
  controls.rotateSpeed = 0.05;
  // controls.maxAzimuthAngle = 0;
  // controls.minAzimuthAngle = 0;
  // controls.enableZoom = false;
}

const cameraDisplacement = new THREE.Vector3(0, 2, 50);
function updateCamera(fieldOfView) {
  if (!fieldOfView) {
    fieldOfView = 2;
  }
  const parent = $("#canvas-holder");
  const width = parent.width();
  const height = parent.height();
  const ratio = width / height;
  camera.left = -fieldOfView / 2 * ratio;
  camera.right = fieldOfView / 2 * ratio;
  camera.top = fieldOfView / 2;
  camera.bottom = -fieldOfView / 2;
  camera.near = 0;
  camera.far = cameraDisplacement.z * 2;
  camera.updateProjectionMatrix();
}

function flyCamera(target) {
  const targetPosition = target.getPosition();
  const cameraPosition = targetPosition.clone();
  updateCamera(target.radius * 10);
  cameraPosition.z = target.radius;
  cameraPosition.add(cameraDisplacement);
  camera.position.copy(cameraPosition);
  camera.lookAt(target.getPosition());
  camera.updateProjectionMatrix();
  controls.target = targetPosition;
  controls.update();
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
  const parent = $("#canvas-holder");
  const width = parent.width();
  const height = parent.height();
  renderer.setSize(width, height);
}

function bootSequence() {
  createCamera();
  createRenderer()
  createControls();
  updateCamera();
  updateRenderer();
}

function loadAstrosInfo(path, cb) {
  $.get(path, function (data) {
    cb(data);
  });
}

function centerCameraOn(target) {
  const targetPosition = target.getPosition && target.getPosition() || target.position;
  // const cameraPosition = targetPosition.clone();
  // cameraPosition.z = target.orbitalRadius;
  // cameraPosition.add(cameraDisplacement);
  // camera.position.copy(cameraPosition);
  // camera.lookAt(target.getPosition());
  // camera.updateProjectionMatrix();
  controls.target = targetPosition;
  controls.update();
}

// setInterval(()=>{
//   console.log(camera.position);
//   console.log(target.getPosition());
//   const vector = new THREE.Vector3();
//   camera.getWorldDirection(vector);
//   console.log(camera.zoom, vector);
// }, 1000);

function startAnimationLoop() {
  animate = function (time) {
    universe.tick(time);
    centerCameraOn(target);
    renderer.render(universe.threeScene, camera);
    requestAnimationFrame(animate);
  }
  animate(0);
}

function main() {
  bootSequence();

  universe = new Universe();

  loadAstrosInfo("index.json", function (astrosInfo) {
    const sunInfo = astrosInfo.sun;
    const sun = Astro.FromInfo("sun", sunInfo);
    universe.addAstro(sun);
    target = sun;
    flyCamera(target);
    startAnimationLoop();
    const tree = sun.getTreeInfo();
    buildTree(tree, function (_, action) {
      const astroName = action.node.text;
      const newTarget = sun.searchForAstro(astroName);
      target = newTarget;
      flyCamera(target);
    });

    // var loader = new THREE.OBJLoader();

    // loader.load('Rock.obj', function (gltf) {
    //   const textureLoader = new THREE.TextureLoader();
    //   const texture = textureLoader.load("Rock.jpg");
    //   console.log(gltf);
    //   gltf.scale.copy(new THREE.Vector3(0.0000001, 0.0000001, 0.0000001));
    //   gltf.position.copy(new THREE.Vector3(0, 0, 0.1));
    //   gltf.children[0].material.map = texture;
    //   universe.addObject(gltf);
    //   target = gltf;
    // }, undefined, function (error) {

    //   console.error(error);

    // });
  });
}

// $(window).keydown(function(event) {
//   console.log(event.key);
//   cameraDisplacement.setY(cameraDisplacement.y + 100);
//   console.log(cameraDisplacement);
// });

window.addEventListener(
  "resize",
  function () {
    updateCamera();
    updateRenderer();
    flyCamera(target);
  },
  false
);

