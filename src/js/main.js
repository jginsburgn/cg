let renderer = undefined;
let scene = undefined;
let camera = undefined;
let absoluteAccumulatedTime = 0;
let ship = undefined;
let gameRunning = false;
let ui = undefined;
let lastScore = 0;
let bestScore = 0;
let score = 0;
let life = 10;
const totalTime = 180 * 1000;
let beginTime = 0;
let currentTime = 0;

function hideUI() {
  ui.css("display", "none");
}

function showUI() {
  ui.css("display", "");
}

function startGame() {
  hideUI();
  gameRunning = true;
  score = 0;
  life = 10;
  remainingTime = 180 * 1000;
  const { width, height } = getWidthAndHeight();
  const ratio = width / height;

  camera = new THREE.PerspectiveCamera(17, ratio, 0.01, 10000);

  renderer = new THREE.WebGLRenderer();
  $("#canvas-container").html(renderer.domElement);

  scene = new THREE.Scene();
  var light = new THREE.AmbientLight(0xffffff); // soft white light
  scene.add(light);

  ship = new Ship();
  scene.add(ship);

  requestAnimationFrame(time => {
    beginTime = time;
    currentTime = time;
    animationLoop(time);
  })
  updateViewport();
  showStats();
}

function showStats() {
  const lifeSpan = $("#life > span");
  const pointsSpan = $("#points > span");
  lifeSpan.text(life.toString());
  pointsSpan.text(score.toString());
}

function showTime() {
  const clockSpan = $("#clock > span");
  clockSpan.text(Math.floor((totalTime - (currentTime - beginTime))/1000));
}

function displayUI() {
  const lastScoreSpan = ui.find("#last-score > span");
  const bestScoreSpan = ui.find("#best-score > span");
  lastScoreSpan.text(lastScore.toString());
  bestScoreSpan.text(bestScore.toString());
}

function endGame() {
  lastScore = score;
  if (bestScore < lastScore) {
    bestScore = lastScore;
  }
  showUI();
  displayUI();
}

$(function () {
  ui = $("div.ui");
});

function animationLoop(accumulatedTime) {
  if (!gameRunning || currentTime - beginTime >= totalTime) {
    endGame();
    return;
  }
  
  showTime();
  currentTime = accumulatedTime;
  const timeDifference = accumulatedTime - absoluteAccumulatedTime;
  absoluteAccumulatedTime = accumulatedTime;
  ship.tick();
  Laser.tick();
  Meteor.tick();
  Saucer.tick();
  renderer.render(scene, camera);
  requestAnimationFrame(animationLoop);
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