class SphericalObject extends EventTarget {
  constructor(
    resourcesURL,
    radius,
    mass,
    position,
    velocity,
    stellarPeriod,
    inclination
  ) {
    super();
    this.resourcesURL = resourcesURL;
    this.radius = radius;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity;
    this.stellarPeriod = stellarPeriod;
    this.inclination = inclination;
    this.rotationAxis = new THREE.Vector3(
      -Math.sin(º2r(inclination)),
      Math.cos(º2r(inclination)),
      0
    );
    this.geometry = new THREE.SphereBufferGeometry(this.radius, 100, 100);
    this._loadResources();
  }

  _loadResources() {
    const textureLoader = new THREE.TextureLoader();
    const map = textureLoader.load(`${this.resourcesURL}/texture.jpg`);
    const specularMap = textureLoader.load(`${this.resourcesURL}/specular.jpg`);
    const bumpMap = textureLoader.load(`${this.resourcesURL}/bump.jpg`);
    this.material = new THREE.MeshPhongMaterial({
      color: 0xdddddd,
      specular: 0x222222,
      shininess: 35,
      map,
      specularMap,
      bumpMap,
      bumpScale: 1,
    });

    const event = new Event("resources-loaded");
    this.dispatchEvent(event);

    this._buildThreeObject();
  }

  _buildThreeObject() {
    this.threeObject = new THREE.Mesh(this.geometry, this.material);
    this.threeObject.position.copy(this.position);
    this.threeObject.rotateZ(º2r(this.inclination));
    const event = new Event("three-object-built");
    this.dispatchEvent(event);
  }

  getPosition() {
    return this.position.clone();
  }

  tick(timeDelta, force) {
    // Calculate new position
    const positionDelta = this.velocity.clone().multiplyScalar(timeDelta);
    this.position.add(positionDelta);

    // Calculate new velocity
    const velocityDelta = force.clone().multiplyScalar(1 / this.mass * timeDelta);
    this.velocity.add(velocityDelta);

    // Permeate changes to Three's object
    this.threeObject.position.copy(this.position);
    this.threeObject.rotateOnWorldAxis(this.rotationAxis, º2r(360) / this.stellarPeriod * timeDelta);
  }
};