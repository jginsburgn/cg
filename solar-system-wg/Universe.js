const GRAVITATIONAL_CONSTANT = 6.67408E-11 / 1000**3 / AU2Km(1)**3 * EM2Kg(1) * Y2s(1)**2;

class Universe {
  constructor() {
    this.threeScene = new THREE.Scene();
    this.objects = [];
    this.pastTime = 0;

    const light = new THREE.AmbientLight(0xffffff);
    this.threeScene.add(light);
  }

  static _realToUniverseTime(time) {
    // Time given in milliseconds
    // Return value must be in years
    // return time / 1000 / 365 / 24 / 60; // Each second is a minute
    return time / 1000 / 365 / 24; // Each second is an hour
    // return time / 1000 / 365; // Each second is a day
    // return time / 1000 / 365 * 5 // Each second is ten days;
    // return time / 3.154E10; // Each second is a second
  }

  addObject(object) {
    this.objects.push(object);
    this.threeScene.add(object.threeObject);
  }

  getTotalGravitationalForceForObjectAt(i) {
    const centralObject = this.objects[i];
    const centralObjectsMass = centralObject.mass;
    const centralObjectsPosition = centralObject.getPosition();
    return this.objects.reduce(
      (accumulator, currentValue, currentIndex, array) => {
        if (currentIndex == i) {
          return accumulator;
        }
        else {

          const currentObjectsPosition = currentValue.getPosition();
          const currentObjectsMass = currentValue.mass;
          const distanceVector = currentObjectsPosition.sub(centralObjectsPosition);
          const distanceSquared = Math.pow(distanceVector.length(), 2);
          distanceVector.normalize();
          const force = distanceVector.multiplyScalar(GRAVITATIONAL_CONSTANT * centralObjectsMass * currentObjectsMass / distanceSquared);
          return accumulator.add(force);
        }
      }, new THREE.Vector3(0, 0, 0)
    );
  }

  tick(time) {
    const timeDelta = Universe._realToUniverseTime(time - this.pastTime);
    for (let i = 0; i < this.objects.length; ++ i) {
      const object = this.objects[i];
      const totalForceOnObject = this.getTotalGravitationalForceForObjectAt(i);
      object.tick(timeDelta, totalForceOnObject);
    }
    this.pastTime = time;
  }
}