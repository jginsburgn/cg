class Laser extends THREE.Object3D {
  static minZ = -200;
  static lasers = [];

  static Shoot(from) {
    new Laser(from);
  }

  static tick() {
    this.lasers.forEach(element => {
      element.tick();
    });
  }

  speed = 1;

  constructor(from) {
    super();
    var geometry = new THREE.SphereGeometry(0.1, 10, 10);
    var material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    var sphere = new THREE.Mesh(geometry, material);
    this.position.set(from.x, from.y, -10);
    this.add(sphere);
    Laser.lasers.push(this);
    scene.add(this);
  }

  tick() {
    this.position.setZ(this.position.z - this.speed);
    if (this.position.z < Laser.minZ) {
      scene.remove(this);
      const indexOf = Laser.lasers.indexOf(this);
      Laser.lasers.splice(indexOf, 1);
    }
  }
}