/**
 * Basic perspective camera built on CS336Object.  Defaults
 * to position (0, 0, 5).
 */
var Camera = function(fovy, aspect)
{
  CS336Object.call(this);
  
  this.setPosition(0, 0, 5);
  
  // projection matrix attributes,
  // default to aspect ratio 1.0 and 30 degree field of view
  this.aspect = aspect || 1.0;
  this.fovy = fovy || 30.0;
  this.zNear = 0.1;
  this.zFar = 1000;

  // cached copies of view matrix and projection matrix
  // (this is just to avoid recalculation at every frame)
  // view matrix is always the inverse of camera's translation * rotation
  // (initial rotation is the identity, so this is easy to initialize)
  this.viewMatrix = new Matrix4().setTranslate(0, 0, -5);
  this.projectionMatrix = new Matrix4().setPerspective(this.fovy, this.aspect, this.zNear, this.zFar);

  // flag to indicate whether view and/or projection need recalculation
  this.viewNeedsUpdate = false;
  this.projectionNeedsUpdate = false;
};

Camera.prototype = Object.create(CS336Object.prototype);

/**
 * Returns the view matrix for this camera.
 */
Camera.prototype.getView = function()
{ 
  if (this.viewNeedsUpdate || this.matrixNeedsUpdate)
  {
	  var inv = new Matrix4().concat(this.rotation).invert();
    this.viewMatrix = inv.setTranslate(-this.position.elements[0], -this.position.elements[1], -this.position.elements[2]);
  }
  return this.viewMatrix;
};


/**
 * Returns the projection matrix for this camera.
 */
Camera.prototype.getProjection = function()
{
  if (this.projectionNeedsUpdate || this.matrixNeedsUpdate)
  {
    this.projectionMatrix.setPerspective(this.fovy, this.aspect, this.zNear, this.zFar);
  }  
  return this.projectionMatrix;
};

/**
 * Sets the aspect ratio.
 */
Camera.prototype.setAspectRatio = function(aspect)
{
  this.aspect = aspect;
  this.projectionNeedsUpdate = true;
};

/**
 * Gets the aspect ratio.
 */
Camera.prototype.getAspectRatio = function()
{
  return this.aspect;
};

/**
 * Sets the field of view.
 */
Camera.prototype.setFovy = function(degrees)
{
  this.fovy = degrees;
  this.projectionNeedsUpdate = true;
};

/**
 * Gets the field of view.
 */
Camera.prototype.getFovy = function()
{
  return this.fovy;
};

/**
 * Sets the near plane.
 */
Camera.prototype.setNearPlane = function(zNear)
{
  this.zNear = zNear;
  this.projectionNeedsUpdate = true;
};

/**
 * Gets the near plane.
 */
Camera.prototype.getNearPlane = function()
{
  return this.zNear;
};

/**
 * Sets the far plane.
 */
Camera.prototype.setFarPlane = function(zFar)
{
  this.zFar = zFar;
  this.projectionNeedsUpdate = true;
};

/**
 * Gets the far plane.
 */
Camera.prototype.getFarPlane = function()
{
  return this.zFar;
};

