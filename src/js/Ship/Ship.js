class Ship extends THREE.Object3D {

  static updatePositionBounds(maxHorizontalAbsolute, maxVerticalAbsolute) {
    Ship.maxHorizontalAbsolute = maxHorizontalAbsolute;
    Ship.maxVerticalAbsolute = maxVerticalAbsolute;
    Ship.minX = -Ship.maxHorizontalAbsolute;
    Ship.maxX = Ship.maxHorizontalAbsolute;
    Ship.minY = -Ship.maxVerticalAbsolute;
    Ship.maxY = Ship.maxVerticalAbsolute;
  }

  speed = 0.01;

  constructor() {
    super();
    this.build();
  }

  build() {
    const loader = new THREE.GLTFLoader();
    loader.load("src/js/Ship/assets/Lo_poly_Spaceship_03_by_Liz_Reddington.gltf", (gltf) => {
      gltf.scene.scale.set(0.001, 0.001, 0.001);
      gltf.scene.position.setZ(-10);
      gltf.scene.rotation.set(0, Math.PI, 0);
      this.add(gltf.scene);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  translate(x, y) {
    const newPosition = this.position.clone();
    newPosition.set(newPosition.x + x, newPosition.y + y, 0);
    const xInBounds = Ship.minX < newPosition.x && newPosition.x < Ship.maxX;
    const yInBounds = Ship.minY < newPosition.y && newPosition.y < Ship.maxY;
    if (xInBounds && yInBounds) {
      this.position.copy(newPosition);
    }
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
  }
}

Ship.updatePositionBounds(10, 10);