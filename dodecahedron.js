function createDodecahedron(gl, translation, rotationAxis1, rotationAxis2) {
  // Geometry form: https://wiki.mcneel.com/developer/scriptsamples/dodecahedron

  const phi = (1.0 + Math.sqrt(5.0)) * 0.5
  const a = 1 / phi
  const b = 1 / (phi * phi)

  const allVertices = [
    [0, 1, b],
    [0, 1, -b],
    [0, -1, b],
    [0, -1, -b],
    [1, b, 0],
    [-1, b, 0],
    [1, -b, 0],
    [-1, -b, 0],
    [a, a, a],
    [-a, a, a],
    [a, a, -a],
    [-a, a, -a],
    [a, -a, a],
    [-a, -a, a],
    [a, -a, -a],
    [-a, -a, -a],
    [b, 0, 1],
    [-b, 0, 1],
    [b, 0, -1],
    [-b, 0, -1],
  ];

  const unionIndices = [
    16, 17, 9, 9, 0, 8, 16, 9, 8,
    17, 16, 12, 12, 2, 13, 17, 12, 13,
    18, 19, 15, 15, 3, 14, 18, 15, 14,
    19, 18, 10, 10, 1, 11, 19, 10, 11,
    1, 0, 8, 8, 4, 10, 1, 8, 10,
    0, 1, 11, 11, 5, 9, 0, 11, 9,
    3, 2, 13, 13, 7, 15, 3, 13, 15,
    2, 3, 14, 14, 6, 12, 2, 14, 12,
    4, 6, 12, 12, 16, 8, 4, 12, 8,
    6, 4, 10, 10, 18, 14, 6, 10, 14,
    5, 7, 15, 15, 19, 11, 5, 15, 11,
    7, 5, 9, 9, 17, 13, 7, 9, 13,
  ];

  const verts = [];

  for (let i of unionIndices) {
    verts.push(...allVertices[i]);
  }

  const faceInfo = [
    { color: BLUE, nov: 9 },
    { color: LIME, nov: 9 },
    { color: SILVER, nov: 9 },
    { color: NAVY, nov: 9 },
    { color: BLACK, nov: 9 },
    { color: RED, nov: 9 },
    { color: MAROON, nov: 9 },
    { color: YELLOW, nov: 9 },
    { color: OLIVE, nov: 9 },
    { color: GREEN, nov: 9 },
    { color: FUCHSIA, nov: 9 },
    { color: TEAL, nov: 9 },
  ];

  const indicesArray = [];
  for (let i = 0; i < unionIndices.length; ++i) {
    indicesArray.push(i);
  }

  var vertexColors = [];
  for (let fi of faceInfo) {
    let fic = fi.color;
    let finov = fi.nov;
    for (var j = 0; j < finov; j++)
      vertexColors.push(...fic);
  }

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  var indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

  var dodecahedron = {
    buffer: vertexBuffer, colorBuffer: colorBuffer, indices: indicesBuffer,
    vertSize: 3, nVerts: verts.length, colorSize: 4, nColors: vertexColors.length, nIndices: indicesArray.length,
    primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
  };

  mat4.translate(dodecahedron.modelViewMatrix, dodecahedron.modelViewMatrix, translation);

  dodecahedron.update = function () {
    var now = Date.now();
    var deltat = now - this.currentTime;
    this.currentTime = now;
    var fract = deltat / duration;
    var angle = Math.PI * 2 * fract;

    // Rotates a mat4 by the given angle
    // mat4 out the receiving matrix
    // mat4 a the matrix to rotate
    // Number rad the angle to rotate the matrix by
    // vec3 axis the axis to rotate around
    mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis2);
    mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis1);
  };

  return dodecahedron;
}