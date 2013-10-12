var camera, scene, renderer;
var mesh;
var self_id;

function init() {

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 );
	camera.position.z = 400;

	scene = new THREE.Scene();

	get_self(selfIDReceived);

	window.addEventListener( 'resize', onWindowResize, false );

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

	mesh.rotation.x += 0.005;
	mesh.rotation.y += 0.01;

	renderer.render( scene, camera );

}