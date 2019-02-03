var group = new THREE.Group();

var geometry = new THREE.SphereBufferGeometry(10, 10, 10);

var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
var meshMaterial = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

group.add(new THREE.LineSegments(geometry, lineMaterial));
group.add(new THREE.Mesh(geometry, meshMaterial));

const rotationAxis = new THREE.Vector3(0, 1, 0);
group.rotateOnAxis(rotationAxis, º2r(10));

universe.addObject(group);