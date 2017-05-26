
// Similar to GL_example1b, but illustrates applying a transformation
// in the vertex shader.  Vertices are shifted by an amount that varies by
// frame, and this value is passed to the vertex shader as a uniform variable.


// Raw data for some point positions - this will be a square, consisting
// of two triangles.  We provide two values per vertex for the x and y coordinates
// (z will be zero by default).
var numPoints = 6;
var vertices = new Float32Array([
-0.5, -0.5,
0.5, -0.5,
0.5, 0.5, 
-0.5, -0.5, 
0.5, 0.5,
-0.5, 0.5
]
);


// A few global variables...

// the OpenGL context
var gl;

// handle to a buffer on the GPU
var vertexbuffer;

// handle to the compiled shader program on the GPU
var shader;


// code to actually render our geometry
function draw(shift, scale)
{
	console.log("starting draw");
	
  // clear the framebuffer
  gl.clear(gl.COLOR_BUFFER_BIT);

  // bind the shader
  gl.useProgram(shader);

  var sX = Math.cos(((Math.PI*shift)/180)); //convert the degree shift to radians and save the x value
  var sY = Math.sin(((Math.PI*shift)/180)); //same as x but for y
  
  
  var shiftX_loc = gl.getUniformLocation(shader, "shiftX");
  var shiftY_loc = gl.getUniformLocation(shader, "shiftY");
  var scalar_loc = gl.getUniformLocation(shader, "scalar");  //get locations
  gl.uniform1f(shiftX_loc, sX); 
  gl.uniform1f(shiftY_loc, sY);
  gl.uniform1f(scalar_loc, scale);//set values
  // bind the buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);

  // get the index for the a_Position attribute defined in the vertex shader
  var positionIndex = gl.getAttribLocation(shader, 'a_Position');
  if (positionIndex < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // "enable" the a_position attribute 
  gl.enableVertexAttribArray(positionIndex);
  
  // associate the data in the currently bound buffer with the a_position attribute
  // (The '2' specifies there are 2 floats per vertex in the buffer.  Don't worry about
  // the last three args just yet.)
  gl.vertexAttribPointer(positionIndex, 2, gl.FLOAT, false, 0, 0);

  // we can unbind the buffer now (not really necessary when there is only one buffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  //console.log('scalar: ' + scale);
   
  
  // draw, specifying the type of primitive to assemble from the vertices
  gl.drawArrays(gl.TRIANGLES, 0, numPoints);
  //gl.drawArrays(gl.LINES, 0, numPoints);
  
  // unbind shader and "disable" the attribute indices
  // (not really necessary when there is only one shader)
  gl.disableVertexAttribArray(positionIndex);
  gl.useProgram(null);

}

// entry point when page is loaded
function main() {
  
  // basically this function does setup that "should" only have to be done once,
  // while draw() does things that have to be repeated each time the canvas is 
  // redrawn	
	
  // retrieve <canvas> element
  var canvas = document.getElementById('theCanvas');

  // get the rendering context for WebGL, using the utility from the teal book
  // (Set second argument to true for debug version.  Note the debug version is
  // incompatible with Firefox shader editor.)
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
  
  // request a handle for a chunk of GPU memory
  vertexbuffer = gl.createBuffer();
  if (!vertexbuffer) {
	  console.log('Failed to create the buffer object');
	  return;
  }

  // "bind" the buffer as the current array buffer
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexbuffer);
  
  // load our data onto the GPU (uses the currently bound buffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  
  // now that the buffer is filled with data, we can unbind it
  // (we still have the handle, so we can bind it again when needed)
  gl.bindBuffer(gl.ARRAY_BUFFER, null);
  
  // specify a fill color for clearing the framebuffer
  gl.clearColor(0.0, 0.8, 0.8, 1.0);

  // set up an animation loop in which the shift amount grows by 1 degree each frame
  var shift = 0.0;
  var scale = parseFloat(document.getElementById("scaleBox").value);
  var temp
  
  var increment = 1;
  var animate = function() {
	temp = parseFloat(document.getElementById("scaleBox").value);
	scale = temp > 0 ? temp : scale;
	draw(shift, scale);
	shift += increment;
	if (shift == 360) shift = 0;
	
	// request that the browser calls animate() again "as soon as it can"
    requestAnimationFrame(animate, canvas); 
  };
  
  // draw!
  animate();
  
}