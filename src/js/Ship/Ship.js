class Ship extends THREE.Object3D {

  static updatePositionBounds(maxHorizontalAbsolute, maxVerticalAbsolute) {
    Ship.maxHorizontalAbsolute = maxHorizontalAbsolute;
    Ship.maxVerticalAbsolute = maxVerticalAbsolute;
    Ship.minX = -Ship.maxHorizontalAbsolute;
    Ship.maxX = Ship.maxHorizontalAbsolute;
    Ship.minY = -Ship.maxVerticalAbsolute;
    Ship.maxY = Ship.maxVerticalAbsolute;
  }

  speed = 0.05;

  constructor() {
    super();
    this.build();
  }

  build() {
    const loader = new THREE.GLTFLoader();
    loader.load("src/js/Ship/assets/Lo_poly_Spaceship_03_by_Liz_Reddington.gltf", (gltf) => {
      gltf.scene.scale.set(0.001, 0.001, 0.001);
      gltf.scene.rotation.set(0, Math.PI, 0);
      this.position.setZ(-10);
      this.add(gltf.scene);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  translate(x, y) {
    const newPosition = this.position.clone();
    newPosition.set(newPosition.x + x, newPosition.y + y, newPosition.z);
    const xInBounds = Ship.minX < newPosition.x && newPosition.x < Ship.maxX;
    const yInBounds = Ship.minY < newPosition.y && newPosition.y < Ship.maxY;
    if (xInBounds && yInBounds) {
      this.position.copy(newPosition);
    }
  }

  shoot() {
    Laser.Shoot(this.position);
  }

  collided(object) {
    console.log(`Collision of ship with ${object instanceof Meteor ? "meteor" : "something"}`);
  }

  saucerDestroyed() {
    console.log("Saucer destroyed");
  }

  getBox() {
    const containingBox = new THREE.Box3().setFromObject(this);
    return containingBox;
  }

  tick() {
    if (keysDown.includes("w")) {
      this.translate(0, this.speed);
    }
    if (keysDown.includes("a")) {
      this.translate(-this.speed, 0);
    }
    if (keysDown.includes("s")) {
      this.translate(0, -this.speed);
    }
    if (keysDown.includes("d")) {
      this.translate(this.speed, 0);
    }
    if (keysDown.includes(" ")) {
      this.shoot();
    }
  }
}

Ship.updatePositionBounds(10, 10);