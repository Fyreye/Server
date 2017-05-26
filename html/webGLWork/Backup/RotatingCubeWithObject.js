//
// Colored rotating cube with controls for moving it around.
// Depends on CS336Object.js.  See handleKeyPress() for details
// of key controls.
//

// Creates data for vertices, colors, and normal vectors for
// a unit cube.  Return value is an object with three attributes
// vertices, colors, and normals, each referring to a Float32Array.
function makeCube()
{
	  // vertices of cube
	var rawVertices = new Float32Array([  
	-0.5, -0.5, 0.5,
	0.5, -0.5, 0.5,
	0.5, 0.5, 0.5,
	-0.5, 0.5, 0.5,
	-0.5, -0.5, -0.5,
	0.5, -0.5, -0.5,
	0.5, 0.5, -0.5,
	-0.5, 0.5, -0.5]);

	var rawColors = new Float32Array([
	1.0, 0.0, 0.0, 1.0,  // red
	0.0, 1.0, 0.0, 1.0,  // green
	0.0, 0.0, 1.0, 1.0,  // blue
	1.0, 1.0, 0.0, 1.0,  // yellow
	1.0, 0.0, 1.0, 1.0,  // magenta
	0.0, 1.0, 1.0, 1.0,  // cyan
	]);

	var rawNormals = new Float32Array([
	0, 0, 1,
	1, 0, 0,
	0, 0, -1,
	-1, 0, 0,
	0, 1, 0,
	0, -1, 0 ]);

	var indices = new Uint16Array([
	0, 1, 2, 0, 2, 3,  // z face
	1, 5, 6, 1, 6, 2,  // +x face
	5, 4, 7, 5, 7, 6,  // -z face
	4, 0, 3, 4, 3, 7,  // -x face
	3, 2, 6, 3, 6, 7,  // + y face
	4, 5, 1, 4, 1, 0   // -y face
	]);
	
	var verticesArray = [];
	var colorsArray = [];
	var normalsArray = [];
	for (var i = 0; i < 36; ++i)
	{
		// for each of the 36 vertices...
		var face = Math.floor(i / 6);
		var index = indices[i];
		
		// (x, y, z): three numbers for each point
		for (var j = 0; j < 3; ++j)
		{
			verticesArray.push(rawVertices[3 * index + j]);
		}
		
		// (r, g, b, a): four numbers for each point
		for (var j = 0; j < 4; ++j)
		{
			colorsArray.push(rawColors[4 * face + j]);
		}
		
		// three numbers for each point
		for (var j = 0; j < 3; ++j)
		{
			normalsArray.push(rawNormals[3 * face + j]);
		}
	}
	
	return {
		vertices: new Float32Array(verticesArray),
		colors: new Float32Array(colorsArray),
		normals: new Float32Array(normalsArray)
	};
};


var axisVertices = new Float32Array([
0.0, 0.0, 0.0,
1.5, 0.0, 0.0,
0.0, 0.0, 0.0, 
0.0, 1.5, 0.0, 
0.0, 0.0, 0.0, 
0.0, 0.0, 1.5]);

var axisColors = new Float32Array([
1.0, 0.0, 0.0, 1.0,
1.0, 0.0, 0.0, 1.0, 
0.0, 1.0, 0.0, 1.0, 
0.0, 1.0, 0.0, 1.0, 
0.0, 0.0, 1.0, 1.0,
0.0, 0.0, 1.0, 1.0]);

// A few global variables...

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexBuffer;
var vertexColorBuffer;
var indexBuffer;
var axisBuffer;
var axisColorBuffer;

// handle to the compiled shader program on the GPU
var shader;

// scale, rotation, and position of the cube
var theObject = new CS336Object();


// transformation matrices

//view matrix
//One strategy is to identify a transformation to our camera frame,
//then invert it.  Here we use the inverse of 
//rotate(30, 0, 1, 0) * rotateX(-45) * Translate(0, 0, 5)
//var view = new Matrix4().translate(0, 0, -5).rotate(45, 1, 0, 0).rotate(-30, 0, 1, 0);

//Alternatively use the LookAt function, specifying the view (eye) point,
//a point at which to look, and a direction for "up".
//Approximate view point for above is (1.77, 3.54, 3.06)
var view = new Matrix4().setLookAt(
		1.77, 3.54, 3.06,   // eye
		0, 0, 0,            // at - looking at the origin
		0, 1, 0);           // up vector - y axis



//projection matrix
//Here use aspect ratio 3/2 corresponding to canvas size 600 x 400
var projection = new Matrix4().setPerspective(50, 1.5, 4, 6);

//translate keypress events to strings
//from http://javascript.info/tutorial/keyboard-events
function getChar(event) {
if (event.which == null) {
 return String.fromCharCode(event.keyCode) // IE
} else if (event.which!=0 && event.charCode!=0) {
 return String.fromCharCode(event.which)   // the rest
} else {
 return null // special key
}
}

function handleKeyPress(event)
{
  var ch = getChar(event);

  // distance from origin
  var e = theObject.position.elements; // returns Vector3
  var distance = Math.sqrt(e[0] * e[0] + e[1] * e[1] + e[2] * e[2]);

  switch (ch)
  {
  // controls
  case 'w':
    theObject.moveForward(0.1);
    break;
  case 'a':
    theObject.moveLeft(0.1);
    break;
  case 's':
    theObject.moveBack(0.1);
    break;
  case 'd':
    theObject.moveRight(0.1);
    break;
  case 'r':
    theObject.moveUp(0.1);
    break;
  case 'f':
    theObject.moveDown(0.1);
    break;
  case 'j':
    theObject.turnLeft(5);
    break;
  case 'l':
    theObject.turnRight(5);
    break;
  case 'i':
    //theObject.lookUp(5);
    theObject.rotateX(5)
    break;
  case 'k':
    //theObject.lookDown(5);
    theObject.rotateX(-5);
    break;
  case 'O':
    theObject.lookAt(0, 0, 0);
    break;

    // alternates for arrow keys
  case 'J':
    theObject.orbitRight(5, distance);
    break;
  case 'L':
    theObject.orbitLeft(5, distance);
    break;
  case 'I':
    theObject.orbitDown(5, distance);    
    break;
  case 'K':
    theObject.orbitUp(5, distance);
    break;
    
    // axis rotations
  case 'y':
    theObject.rotateY(5);
    break;
  case 'Y':
    theObject.rotateY(-5);
    break;
  case 'z':
    theObject.rotateZ(5);    
    break;
  case 'Z':
    theObject.rotateZ(-5);
    break;
  case 'x':
    theObject.rotateX(5); // same as look up
    break;
  case 'X':
    theObject.rotateX(-5); // same as look down
    break;
   
  }
  
}


// code to actually render our geometry
function drawCube(modelMatrix)
{

  // bind the shader
  gl.useProgram(shader);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(shader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var colorIndex = gl.getAttribLocation(shader, 'a_Color');
  if (colorIndex < 0) {
	    console.log('Failed to get the storage location of a_');
	    return;
	  }
 
  // "enable" the a_position attribute 
  gl.enableVertexAttribArray(positionIndex);
  gl.enableVertexAttribArray(colorIndex);
 
  // bind buffers for points 
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // set uniform in shader for projection * view * model transformation
  var transform = new Matrix4().multiply(projection).multiply(view).multiply(modelMatrix);
  var transformLoc = gl.getUniformLocation(shader, "transform");
  gl.uniformMatrix4fv(transformLoc, false, transform.elements);
  
  gl.drawArrays(gl.TRIANGLES, 0, 36);
  
//  // draw axes (not transformed by model transformation)
//  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
//  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
//  gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
//  gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);
//  gl.bindBuffer(gl.ARRAY_BUFFER, null);
//  
//  // set transformation to projection * view only
//  transform = new Matrix4().multiply(projection).multiply(view);
//  gl.uniformMatrix4fv(transformLoc, false, transform.elements);
//
//  // draw axes
//  gl.drawArrays(gl.LINES, 0, 6);  
  
  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(colorIndex);
  gl.useProgram(null);

}

function drawAxes()
{
  // bind the shader
  gl.useProgram(shader);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(shader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  var colorIndex = gl.getAttribLocation(shader, 'a_Color');
  if (colorIndex < 0) {
    console.log('Failed to get the storage location of a_');
    return;
  }

  // "enable" the a_position attribute 
  gl.enableVertexAttribArray(positionIndex);
  gl.enableVertexAttribArray(colorIndex);

  //draw axes (not transformed by model transformation)
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.vertexAttribPointer(positionIndex, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
  gl.vertexAttribPointer(colorIndex, 4, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  //set transformation to projection * view only
  var transformLoc = gl.getUniformLocation(shader, "transform");
  transform = new Matrix4().multiply(projection).multiply(view);
  gl.uniformMatrix4fv(transformLoc, false, transform.elements);

  //draw axes
  gl.drawArrays(gl.LINES, 0, 6);  

  //unbind shader and "disable" the attribute indices
  //(not really necessary when there is only one shader)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
  gl.disableVertexAttribArray(positionIndex);
  gl.disableVertexAttribArray(colorIndex);
  gl.useProgram(null);
}


function draw(theObject)
{
  // clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BIT);

  drawCube(theObject.getMatrix());
  drawAxes();
}

// entry point when page is loaded
function main() {
  
  // basically this function does setup that "should" only have to be done once,
  // while draw() does things that have to be repeated each time the canvas is 
  // redrawn	
	
  // retrieve <canvas> element
  var canvas = document.getElementById('theCanvas');

  // key handlers
  window.onkeypress = handleKeyPress;

  // get the rendering context for WebGL, using the utility from the teal book
  gl = getWebGLContext(canvas, false);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }

  // load and compile the shader pair, using utility from the teal book
  var vshaderSource = document.getElementById('vertexShader').textContent;
  var fshaderSource = document.getElementById('fragmentShader').textContent;
  if (!initShaders(gl, vshaderSource, fshaderSource)) {
    console.log('Failed to intialize shaders.');
    return;
  }
  
  // retain a handle to the shader program, then unbind it
  // (This looks odd, but the way initShaders works is that it "binds" the shader and
  // stores the handle in an extra property of the gl object.  That's ok, but will really
  // mess things up when we have more than one shader pair.)
  shader = gl.program;
  gl.useProgram(null);
  
  // create model data
  var cube = makeCube();
  
  // buffer for vertex positions for triangles
  vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cube.vertices, gl.STATIC_DRAW);

  // buffer for vertex colors
  vertexColorBuffer = gl.createBuffer();
  if (!vertexColorBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cube.colors, gl.STATIC_DRAW);
  

  // axes
  axisBuffer = gl.createBuffer();
  if (!axisBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, axisBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axisVertices, gl.STATIC_DRAW);
  
  // buffer for axis colors
  axisColorBuffer = gl.createBuffer();
  if (!axisColorBuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, axisColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, axisColors, gl.STATIC_DRAW);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // specify a fill color for clearing the framebuffer
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  
  gl.enable(gl.DEPTH_TEST);
   


  
  // define an animation loop
  var animate = function() {
    draw(theObject);
    // request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate, canvas); 
  };
  
  // start drawing!
  animate();

  
}