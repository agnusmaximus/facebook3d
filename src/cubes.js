var camera, scene, renderer;
var self_id;
var friend_profile_pics = new Array();
var cubesArr = new Array();

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

	var size = 4;
	for(var i = 0; i < size; i++) {
		for(var j = 0; j < size; j++) {
			var cube = new THREE.CubeGeometry(50,50,50);
			var mesh = new THREE.Mesh(cube, new THREE.MeshBasicMaterial());
			mesh.position = new THREE.Vector3((i-(size/2)-1)*50,(j-(size/2)-1,0)*50);
			scene.add(mesh);
		}
	}

	window.addEventListener( 'resize', onWindowResize, false );

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

function animate() {

	requestAnimationFrame( animate );

	for(i in cubesArr) {
		cubesArr[i].rotation.x += 0.005;
		cubesArr[i].rotation.y += 0.01;
	}

	renderer.render( scene, camera );

}