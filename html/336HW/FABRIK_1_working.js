//
// Drawing a square in Three.js
//
function main() {
  
  // create a renderer
  var ourCanvas = document.getElementById('theCanvas');
  var renderer = new THREE.WebGLRenderer({canvas: ourCanvas});
  renderer.setClearColor(0x00cccc);

  // create a scene
  var scene = new THREE.Scene();
  
  // create a camera
  // ortho args are left, right, top, bottom (backwards!!), near, far
  var camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

  //constants for FABRIK
  var tol = .0001;
  var boneLength = .2;
  var boneNum = 3;
  var maxSolve = 10;
  var pathList = [];
  var chainList = [];
  var angleList = [0,0,0];
  var distList = [0,0,0];
  var loc;
  var up = new THREE.Vector3(0, 1, 0);
  
  // create the geometry
  var geometry = new THREE.PlaneGeometry(.05, boneLength); //default x,y
  var dot = new THREE.CircleGeometry(.03, 15);
  // create the material
  var red = new THREE.MeshBasicMaterial( { color: 0xff0000 } );
  var green = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  var blk = new THREE.MeshBasicMaterial( { color: 0x000000 } );
  var wht = new THREE.MeshBasicMaterial({color: 0xffffff});
  var orng = new THREE.MeshBasicMaterial({color: 0xffA500});
  var purp = new THREE.MeshBasicMaterial( { color: 0xff00ff } );
  
  var boneCount = 0;
  
  //create an object which can me manipulated by one end
  function newBone(colorMat1, colorMat2){
	  var joint = new THREE.Object3D();
	  var bone = new THREE.Mesh(geometry, colorMat1);
	  bone.position.y = .5*boneLength;
	  joint.name = "bone";
	  joint.add(bone);
	  boneCount++;
	  var ref = new THREE.Mesh(dot,colorMat2);
	  joint.add(ref);
	  return joint;
  }
  //form a 3 bone IK chain
  function chain(bone0){
	  if(boneCount == boneNum){
		  bone0.add(new THREE.Mesh(dot,wht));
		  return;
	  }
	  var bone = newBone(red, purp);
	  chainList.push(bone);
	  bone.position.y = boneLength + bone0.position.y;
	  scene.add(bone);
	//  bone0.add(bone);
	  chain(bone);
  }
  
  function makePath(){
	  var path = (newBone(green,orng));
	  pathList.push(path);
	  var base = path;
	  path.position.y = .6;
	  path.rotateZ(THREE.Math.degToRad(105));
	  
	  for(var i = 2; i<= 10; i++){
		var path2 = (newBone(green,orng));
		pathList.push(path2);
		path2.position.y = .2;
		base.add(path2);
		if(i==5 || i==9 || i==13){
			path2.rotateZ(THREE.Math.degToRad(90));
		}
		base = path2;
		if(i == 10) path2.remove(path2.children[0]);
	  }
	  return path;
  }
  
  function findAngle(start, end){
	  //var vEnd = end.copy();
	  //var vStart = start.copy();
	  end.z = 0;
	  start.z = 0;
	  
	  end.sub(start);
	  
	  return up.angleTo(end);
  }
  
  function findDist(start, end){
	  //var vEnd = end.copy();
	  //var vStart = start.copy();
	  end.z = 0;
	  start.z = 0;
	  
	  return start.distanceTo(end);
  }
  
  function solve(chain, target){
//	  var b0, b1, b2;
//	  b0 = chain[0];
//	  b1 = chain[1];
//	  b2 = chain[2];
	  
	  //var distT = findDist(chain[0].getWorldPosition(),target.getWorldPosition());//chain[0].getWorldPosition().distanceTo(target.getWorldPosition());
	 /* if(distT >= (3*boneLength+tol) ||distT >= (3*boneLength-tol)){
		  var to = findAngle(chain[0].getWorldPosition(),target.getWorldPosition());
		  chain[0].rotateZ(-angleList[0]);
		  chain[0].rotateZ(to);
		  chain[0].position.x = 0;
		  chain[0].position.y = 0;
		 placeEnd(chain[2],target);
		 placeEnd(chain[1],chain[2]);
		 placeEnd(chain[0],chain[1]);
		 chain[0].position.x = 0;
		 chain[0].position.y = 0;
		 placeTip(chain[1], chain[0], chain[2]);
		 placeTip(chain[2], chain[1], target);
	  }else{*/
		  var dif = findDist(chain[2].getWorldPosition(),target.getWorldPosition());//chain[2].getWorldPosition().distanceTo(target.getWorldPosition());
		  for(var i = 0; i<maxSolve || (((dif-.2) > tol) && ((dif+tol) < .2)); i++){
			  solveFrd(chain, target);
			  solveBack(chain, target);
			  dif = findDist(chain[2].getWorldPosition(), target.getWorldPosition());//chain[2].getWorldPosition().distanceTo(target.getWorldPosition());
		  }
	 // }
  }
  
  function placeEnd(source, dest){
	  var to, V, tV;
		
	  to = findAngle(source.getWorldPosition(),dest.getWorldPosition());
	  tV = new THREE.Vector3(dest.position.x, dest.position.y, 0);
	  V = new THREE.Vector3(tV.x + boneLength*Math.sin(to) ,tV.y - boneLength*Math.cos(to), source.position.z);
	  source.rotation.z = 0;
	  source.rotateZ(to);
	  angleList[2] = to;
	  source.position.y =V.y;
	  source.position.x = V.x;
  }
  
  function solveFrd(chain, target){
		
			//bone2
		  placeEnd(chain[2], target);
		  
			//bone1
		  placeEnd(chain[1], chain[2]);
		  
			//bone0
		  placeEnd(chain[0], chain[1]);
		  
  }
  
  function placeTip(source, base, dest){
	     var fig = base.rotation.z
		 var tV = new THREE.Vector3(base.getWorldPosition().x, base.getWorldPosition().y, base.getWorldPosition().z);
		 var V = new THREE.Vector3(tV.x - boneLength*Math.sin(fig) ,tV.y + boneLength*Math.cos(fig), base.getWorldPosition().z);
		 source.position.x = V.x
		 source.position.y = V.y
		 var to = findAngle(source.getWorldPosition(), dest.getWorldPosition());
		 source.rotation.z = 0;
		 source.rotateZ(to);
		 //angleList[1] = to;
  }
  
  function solveBack(bone, target){
		 //bone0
		 bone[0].position.y = 0;
		 bone[0].position.x = 0;
		 
		 //bone1
		 placeTip(bone[1], bone[0], bone[2]);
		 
		 //bone2
		 placeTip(bone[2], bone[1], target);
  }
  
  // create a meshes
  var path = makePath();
  boneCount = 0;
  var base = newBone(red,purp); // create base of chain
  chainList.push(base);
  base.parent = new THREE.Object3D();
  chain(base); //form remaining chain
  var target = new THREE.Mesh(dot,blk);
  var test = new THREE.Mesh(dot, wht);
  
  path.position.z = -.03;
  base.position.z= -.02;
  test.position.z = -.01;
  target.position.y = .6;
  // add the objects to the scene
  scene.add(path);
  scene.add(base);
  scene.add(target);
  scene.add(test);
  // render the scene using the camera
  
  var frame = 0
  
  var animate = function() {
    renderer.render(scene, camera);
	
	var where;
	switch(frame){
		case 15:
			//test.translateX(0.2);
			where = pathList[0].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 45:
			//test.translateX(-0.2);
			where = pathList[1].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 75:
			//test.translateX(0.2);
			where = pathList[2].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 105:
			//test.translateX(-0.2);
			where = pathList[3].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 135:
			//test.translateX(0.2);
			where = pathList[4].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 165:
			//test.translateX(0.2);
			where = pathList[5].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 195:
			//test.translateX(0.2);
			where = pathList[6].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 215:
			//test.translateX(-0.2);
			where = pathList[7].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 245:
			//test.translateX(0.2);
			where = pathList[8].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 275:
			//test.translateX(-0.2);
			where = pathList[9].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			target.position.z = 0;
			solve(chainList,target);
			break;
		case 305:
			frame = 0;
			where = pathList[0].getWorldPosition();
			target.position.setX(where.x);
			target.position.setY(where.y);
			chainList[0].rotation.z = 0;
		    chainList[0].position.x = 0;
		    chainList[0].position.y = 0;
			chainList[1].rotation.z = 0;
		    chainList[1].position.x = 0;
		    chainList[1].position.y = .2;
			chainList[2].rotation.z = 0;
		    chainList[2].position.x = 0;
		    chainList[2].position.y = .4;
			break;
		default:
			
	} 
	frame++;
	
    requestAnimationFrame(animate);
  };
  
  // go!
  animate();
  
}