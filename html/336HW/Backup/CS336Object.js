/**
 * Encapsulation of scale, rotation, and position of a 3D object.  
 * The object's transformation matrix is defined as the product of
 * three transformations based on position * rotation * scale.  
 */
var CS336Object = function()
{
  
  // position of this object
  this.position = new Vector3();

  // current rotation matrix
  this.rotation = new Matrix4();
  
  // scale for this object
  this.scale = new Vector3([ 1, 1, 1 ]);

  // the object's current transformation, to be calculated
  // as translate * rotate * scale
  // matrix is cached on call to getMatrix, to avoid recalculation
  // at every frame unless needed
  this.matrix = null;
  this.matrixNeedsUpdate = true;
};

/**
 * Sets the position.
 * @param x
 * @param y
 * @param z
 */
CS336Object.prototype.setPosition = function(x, y, z)
{
  this.position = new Vector3([ x, y, z ]);
  this.matrixNeedsUpdate = true;
};

/**
 * Sets the scale.
 * @param x
 * @param y
 * @param z
 */
CS336Object.prototype.setScale = function(x, y, z)
{
  this.scale = new Vector3([ x, y, z ]);
  this.matrixNeedsUpdate = true;
};

/**
 * Sets the current rotation matrix to the given one.
 */
CS336Object.prototype.setRotation = function(rotationMatrix)
{
  this.rotation = new Matrix4(rotationMatrix);
  this.matrixNeedsUpdate = true;
};

/**
 * Returns the current transformation matrix, defined as
 * translate * rotate * scale.
 * @returns
 */
CS336Object.prototype.getMatrix = function()
{
  if (this.matrixNeedsUpdate)
  {
    // compose the scale, rotation, and translation components
    // and cache the resulting matrix
    var px, py, pz, sx, sy, sz;
    px = this.position.elements[0];
    py = this.position.elements[1];
    pz = this.position.elements[2];
    sx = this.scale.elements[0];
    sy = this.scale.elements[1];
    sz = this.scale.elements[2];

    this.matrixNeedsUpdate = false;
    this.matrix = new Matrix4().setTranslate(px, py, pz)
        .multiply(this.rotation).scale(sx, sy, sz);
  }
  return this.matrix;
};

/**
 * Moves the CS336Object along its negative z-axis by the given amount.
 */
CS336Object.prototype.moveForward = function(distance)
{
  // TODO
  var movement = this.rotation.multiplyVector3(new Vector3([0,0,distance]));
  this.position.elements[0] += movement.elements[0];
  this.position.elements[1] += movement.elements[1];
  this.position.elements[2] += movement.elements[2];
  
  this.matrixNeedsUpdate = true;
  
};

/**
 * Moves the CS336Object along its positive z-axis by the given amount.
 */
CS336Object.prototype.moveBack = function(distance)
{
  this.moveForward(-distance);
};

/**
 * Moves the CS336Object along its positive x-axis by the given amount.
 */
CS336Object.prototype.moveRight = function(distance)
{
  // TODO
  var movement = this.rotation.multiplyVector3(new Vector3([distance,0,0]));
  this.position.elements[0] += movement.elements[0];
  this.position.elements[1] += movement.elements[1];
  this.position.elements[2] += movement.elements[2];
  
  this.matrixNeedsUpdate = true;
  
};

/**
 * Moves the CS336Object along its negative x-axis by the given amount.
 */
CS336Object.prototype.moveLeft = function(distance)
{
  this.moveRight(-distance);
};

/**
 * Moves the CS336Object along its own y-axis by the given amount.
 */
CS336Object.prototype.moveUp = function(distance)
{
  // TODO
  var movement = this.rotation.multiplyVector3(new Vector3([0,distance,0]));
  this.position.elements[0] += movement.elements[0];
  this.position.elements[1] += movement.elements[1];
  this.position.elements[2] += movement.elements[2];
  
  this.matrixNeedsUpdate = true;
  
};

/**
 * Moves the CS336Object along its own negative y-axis by the given amount.
 */
CS336Object.prototype.moveDown = function(distance)
{
  this.moveUp(-distance);
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object ccw about its x-axis.
 */
CS336Object.prototype.rotateX = function(degrees)
{
  // TODO
  this.rotation.multiply(new Matrix4().setRotate(degrees, 1,0,0));
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object ccw about its y-axis.
 */
CS336Object.prototype.rotateY = function(degrees)
{
  // TODO
  this.rotation.multiply(new Matrix4().setRotate(degrees, 0,1,0));
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object ccw about its z-axis.
 */
CS336Object.prototype.rotateZ = function(degrees) //  ~, x, y, z~
{
  // TODO
  this.rotation.multiply(new Matrix4().setRotate(degrees, 0,0,1));
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object ccw about the given axis, specified as a vector.
 */
CS336Object.prototype.rotateOnAxis = function(degrees, x, y, z)
{
  // TODO
  this.rotation.multiply(new Matrix4().setRotate(degrees, x,y,z));
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object ccw about the given axis, specified in terms of
 * pitch and head angles (as in spherical coordinates).
 */
CS336Object.prototype.rotateOnAxisEuler = function(degrees, pitch, head)
{
  // TODO
  var euler = new Matrix4().setRotate(head, 0, 1, 0);
  euler.multiply(new Matrix4().setRotate(pitch, 1, 0, 0));
  var v = new Vector3([0, 1, 0]);
  
  var newAxis = euler.multiplyVector3(v);
  var e = newAxis.elements;
  
  this.rotation.multiply(new Matrix4().setRotate(degrees, e[0], e[1], e[2]));
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object counterclockwise about an axis through its center that is
 * parallel to the vector (0, 1, 0).
 */
CS336Object.prototype.turnLeft = function(degrees)
{
  // TODO
  var turn = new Matrix4().setRotate(degrees, 0,1,0)
  this.rotation = turn.multiply(this.rotation);
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object clockwise about an axis through its center that is
 * parallel to the vector (0, 1, 0).
 */
CS336Object.prototype.turnRight = function(degrees)
{
  this.turnLeft(-degrees);
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object counterclockwise about an axis through its center that is
 * parallel to the vector (1, 0, 0).
 */
CS336Object.prototype.lookUp = function(degrees)
{
  // TODO
  var turn = new Matrix4().setRotate(degrees, 1,0,0)
  this.rotation = turn.multiply(this.rotation);
  this.matrixNeedsUpdate = true;
};

/**
 * Rotates the CS336Object clockwise about an axis through its center that is
 * parallel to the vector (1, 0, 0).
 */
CS336Object.prototype.lookDown = function(degrees)
{
  this.lookUp(-degrees);
};
/**
 * Moves the CS336Object the given number of degrees along a great circle. The axis
 * of rotation is parallel to the CS336Object's x-axis and intersects the CS336Object's
 * positive z-axis the given distance in front of the CS336Object. (This operation is
 * equivalent to a moveForward, lookDown and then moveBack.
 */
CS336Object.prototype.orbitUp = function(degrees, distance)
{
  // TODO
  this.moveForward(distance);
  this.lookDown(degrees);
  this.moveBack(distance);
  this.matrixNeedsUpdate = true;
};

/**
 * Moves the CS336Object the given number of degrees along a great circle. The axis
 * of rotation is parallel to the CS336Object's x-axis and intersects the CS336Object's
 * positive z-axis the given distance in front of the CS336Object. (This operation is
 * equivalent to a moveForward, lookUp and then moveBack.
 */
CS336Object.prototype.orbitDown = function(degrees, distance)
{
  this.orbitUp(-degrees, distance);
};

/**
 * Moves the CS336Object the given number of degrees around a circle of latitude. The
 * axis of rotation is parallel to the world up vector and intersects the
 * CS336Object's positive z-axis the given distance in front of the CS336Object. (This
 * operation is equivalent to a moveForward, turnLeft, and moveBack.)
 */
CS336Object.prototype.orbitRight = function(degrees, distance)
{
  // TODO
  this.moveForward(distance);
  this.turnLeft(degrees);
  this.moveBack(distance);
  this.matrixNeedsUpdate = true;
};

/**
 * Moves the CS336Object the given number of degrees around a circle of latitude. The
 * axis of rotation is parallel to the world up vector and intersects the
 * CS336Object's positive z-axis the given distance in front of the CS336Object. (This
 * operation is equivalent to a moveForward, turnRight, and moveBack.)
 */
CS336Object.prototype.orbitLeft = function(degrees, distance)
{
  this.orbitRight(-degrees, distance);
};

/**
 * Orients the CS336Object at its current location to face the given position
 * using (0, 1, 0) as the up-vector.  That is, the given position will lie along
 * the object's negative z-axis, and this object's x-axis will be
 * parallel to the world x-z plane
 */
CS336Object.prototype.lookAt = function(x, y, z)
{
  // TODO
  var up = new Vector3([0,1,0]);
  console.log(this.position.elements[0]);console.log(this.position.elements[1]);console.log(this.position.elements[2]);
  var f = new Vector3([x-this.position.elements[0], y-this.position.elements[1], z-this.position.elements[2]]).normalize();
  var s = new Vector3([ // Calculate cross product of f and up.
	f.elements[1] * up.elements[2] - f.elements[2] * up.elements[1],
    f.elements[2] * up.elements[0] - f.elements[0] * up.elements[2],
    f.elements[0] * up.elements[1] - f.elements[1] * up.elements[0]]).normalize();
	
  var u = new Vector3([// Calculate cross product of s and f.
  s.elements[1] * f.elements[2] - s.elements[2] * f.elements[1],
  s.elements[2] * f.elements[0] - s.elements[0] * f.elements[2],
  s.elements[0] * f.elements[1] - s.elements[1] * f.elements[0]]).normalize();
  
  this.rotation.elements[0] = s.elements[0];// console.log(s.elements[0]);
  this.rotation.elements[1] = u.elements[0];// console.log(u.elements[0]);
  this.rotation.elements[2] = f.elements[0];// console.log(f.elements[0]);

  this.rotation.elements[4] = s.elements[1];// console.log(s.elements[1]);
  this.rotation.elements[5] = u.elements[1];// console.log(u.elements[1]);
  this.rotation.elements[6] = f.elements[1];// console.log(f.elements[1]);

  this.rotation.elements[8] = s.elements[2];// console.log(s.elements[2]);
  this.rotation.elements[9] = u.elements[2];// console.log(u.elements[2]);
  this.rotation.elements[10] = f.elements[2];// console.log(f.elements[2]);
  
  this.matrixNeedsUpdate = true;
  
  // NOTE: The implementation can re-use the calculation in Matri4.setLookAt(),
  // where the computed vectors s, u, and -f become the basis vectors for this
  // object. However, we don't apply a translation and we don't invert
  // the matrix; the basis vectors just become the columns of our rotation
  // matrix.
};
