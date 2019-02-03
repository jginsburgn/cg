  // var lights = []
  // lights[0] = new THREE.PointLight(0xffffff, 1, 0, 2);
  // lights[1] = new THREE.PointLight(0xffffff, 1, 0);
  // lights[2] = new THREE.PointLight(0xffffff, 1, 0);

  // lights[0].position.set(-10, 0, 0);
  // lights[1].position.set(100, 200, 100)
  // lights[2].position.set(- 100, - 200, - 100);
  // scene.add(lights[0]);
  // scene.add(lights[1]);
  // scene.add(lights[2]);

  // var light = new THREE.AmbientLight(0xffffff); // soft white light
  // scene.add(light);

  // var group = new THREE.Group();

  // var geometry = new THREE.SphereBufferGeometry(3, 100, 100);

  // var textureLoader = new THREE.TextureLoader();

  // var material = new THREE.MeshPhongMaterial({
  //   color: 0xdddddd,
  //   specular: 0x222222,
  //   shininess: 35,
  //   map: textureLoader.load("earthmap1k.jpg"),
  //   specularMap: textureLoader.load("earthspec1k.jpg"),
  //   bumpMap: textureLoader.load("earthbump1k.jpg"),
  //   bumpScale: 1,
  // });

  var lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
  var meshMaterial = new THREE.MeshPhongMaterial({ color: 0x156289, emissive: 0x072534, side: THREE.DoubleSide, flatShading: true });

  // group.add(new THREE.LineSegments(geometry, lineMaterial));
  // group.add(new THREE.Mesh(geometry, meshMaterial));
  // group.add(new THREE.Mesh(geometry, material));

  // scene.add(group);

    // var geometry = new THREE.SphereBufferGeometry(1, 100, 100);
  // var material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  // var sphere = new THREE.Mesh(geometry, material);
  // // scene.add(sphere);