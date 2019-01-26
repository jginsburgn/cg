function createOctahedron(gl, translation, rotationAxis) {
  const r = 0.5;

  const allVertices = [
    [r, 0, 0],
    [0, r, 0],
    [-r, 0, 0],
    [0, -r, 0],
    [0, 0, r],
    [0, 0, -r],
  ];

  const unionIndices = [
    0, 1, 4,
    1, 2, 4,
    2, 3, 4,
    0, 3, 4,
    0, 1, 5,
    1, 2, 5,
    2, 3, 5,
    0, 3, 5,
  ];

  const verts = [];

  for (let i of unionIndices) {
    verts.push(...allVertices[i]);
  }

  const faceInfo = [
    { color: PURPLE, nov: 3 },
    { color: LIME, nov: 3 },
    { color: SILVER, nov: 3 },
    { color: NAVY, nov: 3 },
    { color: BLACK, nov: 3 },
    { color: FUCHSIA, nov: 3 },
    { color: MAROON, nov: 3 },
    { color: YELLOW, nov: 3 },
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

  let yDelta = 0.01;
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
    mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    if (Math.abs(this.modelViewMatrix[13]) > 1.55) {
      yDelta = -yDelta;
    }
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, vec3.fromValues(0, yDelta, 0));
  };

  return dodecahedron;
}