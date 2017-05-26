//
// Skybox using Three.js. 
//

var path = "./images/FullMoon/";
////var path = "../images/sky/";
var imageNames = [
                  path + "FullMoonLeft2048.png", // Left px
                  path + "FullMoonRight2048.png", // Right nx
                  path + "FullMoonUp2048.png", // Up py
                  path + "FullMoonDown2048.png", // Down ny
                  path + "FullMoonFront2048.png", // Front pz
                  path + "FullMoonBack2048.png"  // Back nz
                  ];


var axis = 'z';
var paused = false;
var camera;

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

function cameraControl(c, ch)
{
  var distance = c.position.length();
  var q, q2;
  
  switch (ch)
  {
  // camera controls
  case 'w':
    c.translateZ(-0.1);
    return true;
  case 'a':
    c.translateX(-0.1);
    return true;
  case 's':
    c.translateZ(0.1);
    return true;
  case 'd':
    c.translateX(0.1);
    return true;
  case 'r':
    c.translateY(0.1);
    return true;
  case 'f':
    c.translateY(-0.1);
    return true;
  case 'j':
    // need to do extrinsic rotation about world y axis, so multiply camera's quaternion
    // on left
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'l':
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    return true;
  case 'i':
    // intrinsic rotation about camera's x-axis
    c.rotateX(5 * Math.PI / 180);
    return true;
  case 'k':
    c.rotateX(-5 * Math.PI / 180);
    return true;
  case 'O':
    c.lookAt(new THREE.Vector3(0, 0, 0));
    return true;
  case 'S':
    c.fov = Math.min(80, c.fov + 5);
    c.updateProjectionMatrix();
    return true;
  case 'W':
    c.fov = Math.max(5, c.fov  - 5);
    c.updateProjectionMatrix();
    return true;

    // alternates for arrow keys
  case 'J':
    //this.orbitLeft(5, distance)
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance);
    return true;
  case 'L':
    //this.orbitRight(5, distance)  
    c.translateZ(-distance);
    q = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0),  -5 * Math.PI / 180);
    q2 = new THREE.Quaternion().copy(c.quaternion);
    c.quaternion.copy(q).multiply(q2);
    c.translateZ(distance);
    return true;
  case 'I':
    //this.orbitUp(5, distance)      
    c.translateZ(-distance);
    c.rotateX(-5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  case 'K':
    //this.orbitDown(5, distance)  
    c.translateZ(-distance);
    c.rotateX(5 * Math.PI / 180);
    c.translateZ(distance);
    return true;
  }
  return false;
}

function handleKeyPress(event)
{
  var ch = getChar(event);
  if (cameraControl(camera, ch)) return;
}

function start()
{
  window.onkeypress = handleKeyPress;

  var scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 45, 1.5, 0.1, 1000 );
  camera.rotation.order = "YXZ";
  camera.position.x = 5;
  camera.position.y = 0;
  camera.position.z = 5;
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.BasicShadowMap;
  // load the six images
  //var ourCubeMap = THREE.ImageUtils.loadTextureCube(imageNames);
  var ourCubeMap = new THREE.CubeTextureLoader().load( imageNames );

  // this is too easy...
  scene.background = ourCubeMap;
  
  // comp
  
  
  var imageFilename = "./images/texturesAndNormalmaps/165.JPG";
  var normalMapFilename = "./images/texturesAndNormalmaps/165_norm.JPG";
  //var imageFilename2 = "./images/texturesAndNormalmaps/159.JPG";
  //var normalMapFilename2 = "./images/texturesAndNormalmaps/159_norm.JPG";
 
  var loader = new THREE.TextureLoader();
  var texture = loader.load(normalMapFilename);
  var colorTexture = loader.load(imageFilename);
  var material  = new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x222222, shininess: 50, map: colorTexture, normalMap: texture});
  var material0 = new THREE.MeshPhongMaterial({ color: 0x81a8aa, specular: 0x222222, shininess: 50, shading: THREE.SmoothShading } );
  var material2 = new THREE.MeshPhongMaterial( { color: 0x9442b5, specular: 0x222222, shininess: 50, shading: THREE.FlatShading } );
  var material3 = new THREE.MeshPhongMaterial( { color: 0xd34208, specular: 0x222222, shininess: 50, shading: THREE.FlatShading } );
  //texture = loader.load(normalMapFilename2);
  //colorTexture = loader.load(imageFilename2);
  //var material1 =new THREE.MeshPhongMaterial({color: 0xffffff, specular: 0x222222, shininess: 50, map: colorTexture, normalMap: texture});
  
  var object0, object1, object2, object3, object4, object5, object6, object7, object9;
  var light0, light1, light2;
  var sphere = new THREE.SphereGeometry(1);
  var cube = new THREE.BoxGeometry(1, 1, 1);
  var cone = new THREE.ConeGeometry(.25, 3, 16);
  var torusS = new THREE.TorusGeometry(2,.25,8,32);
  var torusM = new THREE.TorusGeometry(3,.25,8,32);
  var torusL = new THREE.TorusGeometry(4,.25,8,32);
  //add objects to scene
  
  object1 = new THREE.Mesh(sphere, material);
  object1.castShadow = true;
  object1.receiveShadow = true;
  scene.add(object1);
  
  object2 = new THREE.Mesh(torusL,material0);
  object2.castShadow = true;
  object2.receiveShadow = true;
  object2.rotateZ(1.6);
  scene.add(object2);
  object3 = new THREE.Mesh(torusM,material0);
  object3.castShadow = true;
  object3.receiveShadow = true;
  object3.rotateZ(1.6);
  object2.add(object3);
  //scene.add(object3);
  object4 = new THREE.Mesh(torusS,material0);
  object4.castShadow = true;
  object4.receiveShadow = true;
  object3.add(object4);
  //scene.add(object4);
  
  var offset = 6.25;
  
  object5 = new THREE.Mesh(cone, material0);
  object5.castShadow = true;
  object5.receiveShadow = true;
  object5.position.set(0,offset,0);
  scene.add(object5);
  object6 = new THREE.Mesh(cone, material0);
  object6.castShadow = true;
  object6.receiveShadow = true;
  object6.position.set(0,-(2*offset),0);
  object6.rotateZ(3.14);
  object5.add(object6);
  
  var loader1 = new THREE.OBJLoader();
  loader1.load("teapot.obj", function(object) {
    //my main problem seems to be that the teapot model loaded in so large I couldn't see it from where the camera starts	  
	  object.scale.setScalar(.005); 
	  object.traverse(function(child){
		  if (child instanceof THREE.Mesh) child.material = material3;
	  });
	  object.translateY(offset - 1.75);
	  object.rotateX(3.14);
	  scene.add(object);
  });
  loader1.load("teapot.obj", function(object) {
    //my main problem seems to be that the teapot model loaded in so large I couldn't see it from where the camera starts	  
	  object.scale.setScalar(.005); 
	  object.traverse(function(child){
		  if (child instanceof THREE.Mesh) child.material = material3;
	  });
	  object.translateY(-(offset - 1.75));
	  scene.add(object);
  });
  
  
  //Add Lights to scene
  light0 = new THREE.AmbientLight(0x555555, .5);
  scene.add(light0);
  
  
  light1 = new THREE.PointLight(0xffffff, 1.0);
  light1.castShadow = true;
  light1.shadow.camera.near = 1;
  light1.shadow.camera.far = 30;
  light1.shadow.bias = .01;
  light1.position.set(-10, 10, -4); //xyz
  scene.add(light1);
  
  light2 = new THREE.PointLight(0x9442b5, 0.75);
  light2.castShadow = true;
  light2.shadow.camera.near = 1;
  light2.shadow.camera.far = 30;
  light2.shadow.bias = .01;
  light2.position.set(5, -5, 2); //xyz
  
 // light2.add(object0);
  scene.add(light2);
  
  var rotation = 0;
  var increment = 0.01;
  
  var render = function () {
    requestAnimationFrame( render );
	
	//animate
	
	rotation += increment;
	
	object2.traverse(function(object){
		object.rotation.y = rotation;
	});
	
     renderer.render(scene, camera);
  };

  render();
}