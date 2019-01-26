// Create the vertex, color and index data for a multi-colored cube
function createPentagonalPyramid(gl, translation, rotationAxis) {
  // Vertex Data
  var vertexBuffer;
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const angleFraction = Math.PI * 2 / 5;

  instrinsicTransform = mat4.create();
  mat4.rotateX(instrinsicTransform, instrinsicTransform, - Math.PI / 2);
  mat4.scale(instrinsicTransform, instrinsicTransform, vec3.fromValues(0.5, 0.5, 0.5));

  let v0 = vec3.fromValues(0, 0, 1);
  let v1 = vec3.fromValues(1, 0, 0);
  let v2 = vec3.fromValues(Math.cos(angleFraction * 1), Math.sin(angleFraction * 1), 0);
  let v3 = vec3.fromValues(Math.cos(angleFraction * 2), Math.sin(angleFraction * 2), 0);
  let v4 = vec3.fromValues(Math.cos(angleFraction * 3), Math.sin(angleFraction * 3), 0);
  let v5 = vec3.fromValues(Math.cos(angleFraction * 4), Math.sin(angleFraction * 4), 0);

  v0 = vec3.transformMat4(v0, v0, instrinsicTransform);
  v1 = vec3.transformMat4(v1, v1, instrinsicTransform);
  v2 = vec3.transformMat4(v2, v2, instrinsicTransform);
  v3 = vec3.transformMat4(v3, v3, instrinsicTransform);
  v4 = vec3.transformMat4(v4, v4, instrinsicTransform);
  v5 = vec3.transformMat4(v5, v5, instrinsicTransform);

  const verts = [];

  verts.push(...v0);
  verts.push(...v1);
  verts.push(...v2);

  verts.push(...v0);
  verts.push(...v2);
  verts.push(...v3);

  verts.push(...v0);
  verts.push(...v3);
  verts.push(...v4);

  verts.push(...v0);
  verts.push(...v4);
  verts.push(...v5);

  verts.push(...v0);
  verts.push(...v5);
  verts.push(...v1);

  verts.push(...v1);
  verts.push(...v2);
  verts.push(...v3);

  verts.push(...v3);
  verts.push(...v4);
  verts.push(...v5);

  verts.push(...v5);
  verts.push(...v3);
  verts.push(...v1);

  const faceInfo = [
    { color: RED, nov: 3 },
    { color: GREEN, nov: 3 },
    { color: BLUE, nov: 3 },
    { color: YELLOW, nov: 3 },
    { color: NAVY, nov: 3 },
    { color: FUCHSIA, nov: 9 },
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  var vertexColors = [];
  for (let fi of faceInfo) {
    let fic = fi.color;
    let finov = fi.nov;
    for (var j = 0; j < finov; j++)
      vertexColors.push(...fic);
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

  // Index data (defines the triangles to be drawn).
  var indicesBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
  var indicesArray = [];

  for (let i = 0; i < verts.length / 3; ++i) {
    indicesArray.push(i);
  }

  // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
  // Uint16Array: Array of 16-bit unsigned integers.
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indicesArray), gl.STATIC_DRAW);

  var pentagonalPyramid = {
    buffer: vertexBuffer, colorBuffer: colorBuffer, indices: indicesBuffer,
    vertSize: 3, nVerts: verts.length, colorSize: 4, nColors: vertexColors.length, nIndices: indicesArray.length,
    primtype: gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime: Date.now()
  };

  mat4.translate(pentagonalPyramid.modelViewMatrix, pentagonalPyramid.modelViewMatrix, translation);

  pentagonalPyramid.update = function () {
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
  };

  return pentagonalPyramid;
}