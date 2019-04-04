class Saucer extends THREE.Object3D {
  static saucers = [];
  static maxSaucers = 15;

  static Appear() {
    new Saucer();
  }

  static tick() {
    if (this.saucers.length < this.maxSaucers) {
      if (Math.random() < 0.03) {
        this.Appear();
      }
    }
    this.saucers.forEach(element => {
      element.tick();
    });
  }

  speed = 0.4;

  constructor() {
    super();
    this.build();
  }

  build() {
    const loader = new THREE.GLTFLoader();
    loader.load("src/js/Saucer/assets/flying sacuer.gltf", (gltf) => {
      const defaultScale = 0.2;
      gltf.scene.scale.set(defaultScale, defaultScale, defaultScale);
      gltf.scene.rotation.set(0, Math.PI, 0);
      const mha = Ship.maxHorizontalAbsolute;
      const newX = Math.random() * mha * 2 - mha;
      const mva = Ship.maxVerticalAbsolute;
      const newY = Math.random() * mva * 2 - mva;
      this.position.set(newX, newY, Laser.minZ);
      this.add(gltf.scene);
      Saucer.saucers.push(this);
      scene.add(this);
    }, undefined, function (error) {
      console.error(error);
    });
  }

  getBox() {
    const containingBox = new THREE.Box3().setFromObject(this);
    return containingBox;
  }

  tick() {
    this.position.setZ(this.position.z + this.speed);
    const thisBox = this.getBox();
    const laserBoxes = Laser.GetBoxes();
    let destroyed = false;
    for (let box of laserBoxes) {
      if (box.intersectsBox(thisBox)) {
        destroyed = true;
        break; 
      }
    }
    if (this.position.z > 0 || destroyed) {
      scene.remove(this);
      const indexOf = Saucer.saucers.indexOf(this);
      Saucer.saucers.splice(indexOf, 1);
    }
    if (destroyed) ship.saucerDestroyed();
  }
}