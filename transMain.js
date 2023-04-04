  'use strict';

  // Global variables that are set and used
  // across the application
  let gl, program;
  
  // Global declarations of objects that you will be drawing
  var myTeapot = null;
  var myPedistalTop1 = null;
  var myPedistalBottom1 = null;
  var myPedistalMiddle1 = null;

  var myCone = null;
  var myPedistalTop2 = null;
  var myPedistalBottom2 = null;
  var myPedistalMiddle2 = null;

  var mySphere = null;
  var myPedistalTop3 = null;
  var myPedistalBottom3 = null;
  var myPedistalMiddle3 = null;

//
// A function that creates shapes to be drawn and creates a VAO for each
//
// We start you out with an example for the teapot.
//
function createShapes() {

    //set up shapes
    myTeapot = new Teapot();
    myTeapot.VAO = bindVAO (myTeapot);

    myCone = new Cone(10, 4);
    myCone.VAO = bindVAO (myCone);

    mySphere = new Sphere(4);
    mySphere.VAO = bindVAO (mySphere);

    // set up pedistal objs
    myPedistalTop1 = new Cube(4);
    myPedistalTop1.VAO = bindVAO (myPedistalTop1);
    myPedistalBottom1 = new Cube(4);
    myPedistalBottom1.VAO = bindVAO (myPedistalBottom1);
    myPedistalMiddle1 = new Cylinder(15, 8);
    myPedistalMiddle1.VAO = bindVAO (myPedistalMiddle1);

    myPedistalTop2 = new Cube(4);
    myPedistalTop2.VAO = bindVAO (myPedistalTop2);
    myPedistalBottom2 = new Cube(4);
    myPedistalBottom2.VAO = bindVAO (myPedistalBottom2);
    myPedistalMiddle2 = new Cylinder(15, 8);
    myPedistalMiddle2.VAO = bindVAO (myPedistalMiddle2);

    myPedistalTop3 = new Cube(4);
    myPedistalTop3.VAO = bindVAO (myPedistalTop3);
    myPedistalBottom3 = new Cube(4);
    myPedistalBottom3.VAO = bindVAO (myPedistalBottom3);
    myPedistalMiddle3 = new Cylinder(15, 8);
    myPedistalMiddle3.VAO = bindVAO (myPedistalMiddle3);
}

//
// Set up your camera and your projection matrices
//
function setUpCamera() {
    
    // set up your projection
    // defualt is orthographic projection
    let projMatrix = glMatrix.mat4.create();
    //glMatrix.mat4.ortho(projMatrix, -5, 5, -5, 5, 1.0, 300.0);
    glMatrix.mat4.perspective(projMatrix, 1.4, 1, 4, null);
    gl.uniformMatrix4fv (program.uProjT, false, projMatrix);

    
    // set up your view
    // defaut is at (0,0,-5) looking at the origin
    let viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.lookAt(viewMatrix, [0, 2, -6], [0, 0, 0], [0, 1, 0]);
    gl.uniformMatrix4fv (program.uViewT, false, viewMatrix);
}


//
// Use this function to draw all of your shapes.
// Recall that VAOs should have been set up the call to createShapes()
// You'll have to provide a Model Matrix for each shape to be drawn that
// places the object in the world.
//
// An example is shown for placing the teapot
//
function drawShapes() {

    let modelMatrix = glMatrix.mat4.create();
    let coneMatrix = glMatrix.mat4.create();
    let sphereMatrix = glMatrix.mat4.create();
    
    // drawing the teapot rotating around Y  180 degrees
    glMatrix.mat4.rotateY (modelMatrix,  modelMatrix, radians(180.0))

    //create translation vertices
    var transVecCone = glMatrix.vec3.create();
    glMatrix.vec3.set(transVecCone, -3, 0.5, 0);
    var transVecSphere = glMatrix.vec3.create();
    glMatrix.vec3.set(transVecSphere, 3, 0.9, 0);
    //apply transformations
    glMatrix.mat4.translate(coneMatrix, coneMatrix, transVecCone);
    glMatrix.mat4.translate(sphereMatrix, sphereMatrix, transVecSphere);
    
    // send the model matrix to the shader and draw.
    gl.uniformMatrix4fv (program.uModelT, false, modelMatrix);
    gl.bindVertexArray(myTeapot.VAO);
    gl.drawElements(gl.TRIANGLES, myTeapot.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniformMatrix4fv (program.uModelT, false, coneMatrix);
    gl.bindVertexArray(myCone.VAO);
    gl.drawElements(gl.TRIANGLES, myCone.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniformMatrix4fv (program.uModelT, false, sphereMatrix);
    gl.bindVertexArray(mySphere.VAO);
    gl.drawElements(gl.TRIANGLES, mySphere.indices.length, gl.UNSIGNED_SHORT, 0);

    //draw pedistals
    drawPedistal(0, myPedistalTop1, myPedistalMiddle1, myPedistalBottom1);
    drawPedistal(-3, myPedistalTop2, myPedistalMiddle2, myPedistalBottom2);
    drawPedistal(3, myPedistalTop3, myPedistalMiddle3, myPedistalBottom3);
}

function drawPedistal(xTranslation, myPedistalTop, myPedistalMiddle, myPedistalBottom){
    let pedTopMatrix = glMatrix.mat4.create();
    let pedMidMatrix = glMatrix.mat4.create();
    let pedBotMatrix = glMatrix.mat4.create();

    var transVecTop = glMatrix.vec3.create();
    glMatrix.vec3.set(transVecTop, xTranslation, -0.25, 0);
    var scaleVecTop = glMatrix.vec3.create();
    glMatrix.vec3.set(scaleVecTop, 2, 0.5, 2);

    var transVecMid = glMatrix.vec3.create();
    glMatrix.vec3.set(transVecMid, xTranslation, -1.5, 0);
    var scaleVecMid = glMatrix.vec3.create();
    glMatrix.vec3.set(scaleVecMid, 1.8, 2, 1.8);

    var transVecBot = glMatrix.vec3.create();
    glMatrix.vec3.set(transVecBot, xTranslation, -2.75, 0);
    var scaleVecBot = glMatrix.vec3.create();
    glMatrix.vec3.set(scaleVecBot, 2, 0.5, 2);

    glMatrix.mat4.translate(pedTopMatrix, pedTopMatrix, transVecTop);
    glMatrix.mat4.scale(pedTopMatrix, pedTopMatrix, scaleVecTop);

    glMatrix.mat4.translate(pedMidMatrix, pedMidMatrix, transVecMid);
    glMatrix.mat4.scale(pedMidMatrix, pedMidMatrix, scaleVecMid);

    glMatrix.mat4.translate(pedBotMatrix, pedBotMatrix, transVecBot);
    glMatrix.mat4.scale(pedBotMatrix, pedBotMatrix, scaleVecBot);

    gl.uniformMatrix4fv (program.uModelT, false, pedTopMatrix);
    gl.bindVertexArray(myPedistalTop.VAO);
    gl.drawElements(gl.TRIANGLES, myPedistalTop.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniformMatrix4fv (program.uModelT, false, pedMidMatrix);
    gl.bindVertexArray(myPedistalMiddle.VAO);
    gl.drawElements(gl.TRIANGLES, myPedistalMiddle.indices.length, gl.UNSIGNED_SHORT, 0);

    gl.uniformMatrix4fv (program.uModelT, false, pedBotMatrix);
    gl.bindVertexArray(myPedistalBottom.VAO);
    gl.drawElements(gl.TRIANGLES, myPedistalBottom.indices.length, gl.UNSIGNED_SHORT, 0);
}

///////////////////////////////////////////////////////////////////
//
//   You shouldn't have to edit below this line
//
///////////////////////////////////////////////////////////////////

  // Given an id, extract the content's of a shader script
  // from the DOM and return the compiled shader
  function getShader(id) {
    const script = document.getElementById(id);
    const shaderString = script.text.trim();

    // Assign shader depending on the type of shader
    let shader;
    if (script.type === 'x-shader/x-vertex') {
      shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else if (script.type === 'x-shader/x-fragment') {
      shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else {
      return null;
    }

    // Compile the shader using the supplied shader code
    gl.shaderSource(shader, shaderString);
    gl.compileShader(shader);

    // Ensure the shader is valid
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      return null;
    }

    return shader;
  }

  // Create a program with the appropriate vertex and fragment shaders
  function initProgram() {
    const vertexShader = getShader('vertex-shader');
    const fragmentShader = getShader('fragment-shader');

    // Create a program
    program = gl.createProgram();
    // Attach the shaders to this program
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Could not initialize shaders');
    }

    // Use this program instance
    gl.useProgram(program);
    // We attach the location of these shader values to the program instance
    // for easy access later in the code
    program.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    program.aBary = gl.getAttribLocation(program, 'bary');
    program.uModelT = gl.getUniformLocation (program, 'modelT');
    program.uViewT = gl.getUniformLocation (program, 'viewT');
    program.uProjT = gl.getUniformLocation (program, 'projT');
  }

  // creates a VAO and returns its ID
  function bindVAO (shape) {
      //create and bind VAO
      let theVAO = gl.createVertexArray();
      gl.bindVertexArray(theVAO);
      
      // create and bind vertex buffer
      let myVertexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myVertexBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.points), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aVertexPosition);
      gl.vertexAttribPointer(program.aVertexPosition, 4, gl.FLOAT, false, 0, 0);
      
      // create and bind bary buffer
      let myBaryBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, myBaryBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(shape.bary), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(program.aBary);
      gl.vertexAttribPointer(program.aBary, 3, gl.FLOAT, false, 0, 0);
      
      // Setting up the IBO
      let myIndexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, myIndexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(shape.indices), gl.STATIC_DRAW);

      // Clean
      gl.bindVertexArray(null);
      gl.bindBuffer(gl.ARRAY_BUFFER, null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
      
      return theVAO;
    
  }

  
  // We call draw to render to our canvas
  function draw() {
    // Clear the scene
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
      
    // draw your shapes
    drawShapes();

    // Clean
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  }

  // Entry point to our application
  function init() {
      
    // Retrieve the canvas
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) {
      console.error(`There is no canvas with id ${'webgl-canvas'} on this page.`);
      return null;
    }


    // Retrieve a WebGL context
    gl = canvas.getContext('webgl2');
    if (!gl) {
        console.error(`There is no WebGL 2.0 context`);
        return null;
      }
      
    // Set the clear color to be black
    gl.clearColor(0, 0, 0, 1);
      
    // some GL initialization
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CCW);
    gl.clearColor(0.0,0.0,0.0,1.0)
    gl.depthFunc(gl.LEQUAL)
    gl.clearDepth(1.0)

    // Read, compile, and link your shaders
    initProgram();
    
    // create and bind your current object
    createShapes();
    
    // set up your camera
    setUpCamera();
    
    // do a draw
    draw();
  }
