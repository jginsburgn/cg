const ORBITS_WIDTH = 10;

class Astro {
  constructor(properties) {
    Object.assign(this, properties);
    this.orbiters = [];
    this._buildObject();
  }

  _buildObject() {
    this.geometry = new THREE.SphereBufferGeometry(this.radius, 100, 100);
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
    this.threeObject = new THREE.Mesh(this.geometry, this.material);

    this.astroRoot = new THREE.Group();
    this.astroParent = new THREE.Group();

    this.astroRoot.add(this.astroParent);
    this.astroParent.add(this.threeObject);

    this.astroParent.rotateZ(º2r(this.obliquityToOrbit));

    const whiteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const axisG = new THREE.CylinderBufferGeometry(10, 10, this.radius * 2 + 100000, 32);
    const axis = new THREE.Mesh(axisG, whiteMaterial);
    // this.astroParent.add(axis);
  }

  _addOrbit(astro) {
    const orbitRadius = astro.orbitalRadius;
    const inner = orbitRadius - ORBITS_WIDTH / 2;
    const outer = orbitRadius + ORBITS_WIDTH / 2;
    const geometry = new THREE.RingBufferGeometry(inner, outer, 1000);
    const color = new THREE.Color(...astro.orbitalColor);
    const material = new THREE.PointsMaterial({ color, size: 3 });
    const orbit = new THREE.Points(geometry, material);
    orbit.rotateX(º2r(90));
    orbit.rotateY(º2r(astro.orbitalInclination));
    this.astroRoot.add(orbit);
    return orbit;
  }

  getObject() {
    return this.astroRoot;
  }

  getPosition() {
    const position = new THREE.Vector3();
    this.astroRoot.getWorldPosition(position);
    return position;
  }

  addOrbiter(orbiter) {
    const orbiterObject = orbiter.getObject();
    const orbiterParent = new THREE.Group();
    const localPosition = new THREE.Vector3(orbiter.orbitalRadius, 0, 0);
    orbiterObject.position.copy(localPosition);
    orbiterParent.add(orbiterObject);
    orbiterParent.rotateZ(º2r(orbiter.orbitalInclination));
    orbiterParent.rotateY(º2r(orbiter.orbitalAzimuth));
    const orbit = this._addOrbit(orbiter);
    this.astroRoot.add(orbiterParent);
    this.orbiters.push({ orbiter, orbiterParent, orbit });
  }

  tick(timeDelta) {
    this.threeObject.rotateY(º2r(timeDelta * 360 / this.rotationalPeriod));
    for (let orbiter of this.orbiters) {
      const angleDelta = º2r(timeDelta * 360 / orbiter.orbiter.orbitalPeriod);
      // const orbiterObject = orbiter.getObject();
      // const currentPosition = orbiterObject.position.clone();
      // const x = currentPosition.x;
      // const z = currentPosition.z;
      // const newPosition = new THREE.Vector3(
      //   x * Math.cos(angleDelta) - z * Math.sin(angleDelta),
      //   0,
      //   x * Math.sin(angleDelta) + z * Math.sin(angleDelta)
      // );
      // orbiterObject.position.copy(newPosition);
      orbiter.orbiterParent.rotateY(angleDelta);
      orbiter.orbiter.tick(timeDelta);
    }
  }
}