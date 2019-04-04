class Meteor extends THREE.Object3D {
  static meteors = [];

  static Appear() {
    new Meteor();
  }

  static tick() {
    this.meteors.forEach(element => {
      element.tick();
    });
  }

  speed = 1;

  constructor() {
    super();
    this.build();
  }

  build() {
    const loader = new THREE.GLTFLoader();
    loader.load("src/js/Meteor/assets/PUSHILIN_boulder.gltf", (gltf) => {
      const defaultScale = 0.6;
      gltf.scene.scale.set(defaultScale, defaultScale, defaultScale);
      gltf.scene.rotation.set(0, Math.PI, 0);
      this.position.setZ(Laser.minZ);
      this.add(gltf.scene);
      Meteor.meteors.push(this);
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
    if (this.position.z > -8) {
      scene.remove(this);
      const indexOf = Meteor.meteors.indexOf(this);
      Meteor.meteors.splice(indexOf, 1);
    }
    else {
      const thisBox = this.getBox();
      const shipBox = ship.getBox();
      if (thisBox.intersectsBox(shipBox)) ship.collided(this);
    }
  }
}