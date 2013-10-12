var camera, scene, renderer;
var self_id;
var friend_profile_pics = new Array();
var cubesArr = new Array();
var time = Date.now();
var totalTime = 0;

var switchPicTimer = 0;
var switchPicInterval = 1500;

init();
animate();

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;

	scene = new THREE.Scene();

	//get_self(selfIDReceived);
	get_all_friends(findFriends);


	makeCubeWall(10,6,70,new THREE.Vector3(100,0,-50));

	window.addEventListener( 'resize', onWindowResize, false );

}

function makeCubeWall(width, height, cubeSize, offset) {
	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++) {
			var cube = new THREE.CubeGeometry(cubeSize,cubeSize,20);


			var materials = [];

			for (var k=0; k<6; k++) {
				var img = new Image();
				img.src = friend_profile_pics[Math.floor(Math.random()*friend_profile_pics.length)];
				var tex = new THREE.Texture(img);
				img.tex = tex;

				img.onload = function() {
			    	this.tex.needsUpdate = true;
				};
				//var mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: tex});
				/*var mat = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
				if(k==5 || k==4) {
					mat = new THREE.MeshBasicMaterial({color: 0xffff00});
				}*/

				var mat = new THREE.MeshBasicMaterial({color: 0xAAAAAA});
				if(k==4) {
					mat = new THREE.MeshBasicMaterial({map: tex});
				}
				materials.push(mat);
			}

			// for ( var k = 0; k < cube.faces.length; k ++ ) {
			//     cube.faces[ k ].color.setHex( Math.random() * 0xffffff );
			// }

			// var material = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors } );

			var mesh = new THREE.Mesh( cube, new THREE.MeshFaceMaterial( materials ));
			mesh.position = new THREE.Vector3((i-(width/2)-1)*cubeSize*1.2 + offset.x,(j-(height/2)+1)*cubeSize*1.2 + offset.y,offset.z);
			mesh.userData = { timeOffset: Math.random()*5, isBeingFlipped: false , initialRotation: 0, sideShowing: 4}
			cubesArr.push(mesh);
			scene.add(mesh);
		}
	}
}

function findFriends(friends) {
	for(var i = 0; i < friends.length; i++) {
		get_friend_profile_pic(friends[i], profilePictureForFriend);
	}
}

function profilePictureForFriend(picURL,data) {
	friend_profile_pics.push(picURL);
}

function selfIDReceived(id) {
	self_id = id;
	get_friend_profile_pic(id,profilePicReceived,null);
}

function profilePicReceived(picURL,data)  {
	var geometry = new THREE.CubeGeometry( 200, 200, 200 );

	var texture = THREE.ImageUtils.loadTexture( picURL);
	texture.anisotropy = renderer.getMaxAnisotropy();

	var material = new THREE.MeshBasicMaterial( { map: texture } );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function updateCubeWall(t) {
	switchPicTimer+=t;
	if(switchPicTimer>switchPicInterval) {
		switchPicTimer=0;

		cubeChoice = Math.floor(Math.random()*cubesArr.length);
		var tween = new TWEEN.Tween( { rotation: 0 } )
					.to( { rotation: Math.PI }, 1500 )
					.easing( TWEEN.Easing.Elastic.InOut )
					.onUpdate( function () {
						cubesArr[cubeChoice].userData.isBeingFlipped = false;
						cubesArr[cubeChoice].rotation.x = this.rotation+cubesArr[cubeChoice].userData.initialRotation;
					} )
					.onComplete( function() {
						cube = cubesArr[cubeChoice];
						cube.userData.initialRotation+=Math.PI;
						cube.userData.isBeingFlipped = false;
						var img = new Image();
						img.src = friend_profile_pics[Math.floor(Math.random()*friend_profile_pics.length)];
						var tex = new THREE.Texture(img);
						img.tex = tex;

						img.onload = function() {
					    	this.tex.needsUpdate = true;
						};
						cube.material.materials[cube.userData.sideShowing] = new THREE.MeshBasicMaterial({map: tex});
						cube.userData.sideShowing = cube.userData.sideShowing==4 ? 5 : 4;
					})
					.start();
	}
}

function animate() {
	requestAnimationFrame( animate );

	totalTime += Date.now() - time;
	updateCubeWall(Date.now()-time);

	time = Date.now();

	TWEEN.update();

	for(i in cubesArr) {
		//if(!cubesArr[i].userData.isBeingFlipped) {
			cubesArr[i].rotation.z = Math.sin(totalTime/100 + cubesArr[i].userData.timeOffset)/10;
		//}
	}

	renderer.render( scene, camera );

}