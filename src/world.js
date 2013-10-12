var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();

var houseManager;
var statuses;

var objects = [];
var pics = new Array();

var ray;

var blocker = document.getElementById( 'blocker' );
var instructions = document.getElementById( 'instructions' );

// http://www.html5rocks.com/en/tutorials/pointerlock/intro/

var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

if ( havePointerLock ) {

	var element = document.body;

	var pointerlockchange = function ( event ) {

		if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {

			controls.enabled = true;

			blocker.style.display = 'none';

		} else {

			controls.enabled = false;

			blocker.style.display = '-webkit-box';
			blocker.style.display = '-moz-box';
			blocker.style.display = 'box';

			instructions.style.display = '';

		}

	}

	var pointerlockerror = function ( event ) {

		instructions.style.display = '';

	}

	// Hook pointer lock state change events
	document.addEventListener( 'pointerlockchange', pointerlockchange, false );
	document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
	document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

	document.addEventListener( 'pointerlockerror', pointerlockerror, false );
	document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
	document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

	instructions.addEventListener( 'click', function ( event ) {

		instructions.style.display = 'none';

		// Ask the browser to lock the pointer
		element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

		if ( /Firefox/i.test( navigator.userAgent ) ) {

			var fullscreenchange = function ( event ) {

				if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

					document.removeEventListener( 'fullscreenchange', fullscreenchange );
					document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

					element.requestPointerLock();
				}

			}

			document.addEventListener( 'fullscreenchange', fullscreenchange, false );
			document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

			element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

			element.requestFullscreen();

		} else {

			element.requestPointerLock();

		}

	}, false );

} else {

	instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

}

function House(x,y,z,height,flipped) {
	this.fb_user = null;
	this.xPos = x;
	this.yPos = y;
	this.zPos = z;
	this.height = height;

	this.create = function() {
	    var backWall = new THREE.CubeGeometry( 195, height , 5);

		backWallMesh = new THREE.Mesh(backWall, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		backWallMesh.position = new THREE.Vector3(this.xPos,this.yPos+height/2,this.zPos-100);

		scene.add( backWallMesh );
		var frontWall = new THREE.CubeGeometry( 195, height , 5);

		frontWallMesh = new THREE.Mesh(frontWall, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		frontWallMesh.position = new THREE.Vector3(this.xPos,this.yPos+height/2,this.zPos+100);
		frontWallMesh.rotation.x = Math.PI;

		scene.add( frontWallMesh );


		var leftWall = new THREE.CubeGeometry( 205, height , 5);

		leftWallMesh = new THREE.Mesh(leftWall, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		leftWallMesh.position = new THREE.Vector3(this.xPos+flipped*100,this.yPos+height/2,this.zPos);
		leftWallMesh.rotation.y = Math.PI/2;

		scene.add( leftWallMesh );


		var rightWallLeft = new THREE.CubeGeometry( 80, height , 5);
	    
		rightWallLeftMesh = new THREE.Mesh(rightWallLeft, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		rightWallLeftMesh.position = new THREE.Vector3(this.xPos-flipped*100,this.yPos+height/2,this.zPos-45/2-40);
		rightWallLeftMesh.rotation.y = -Math.PI/2;

		scene.add( rightWallLeftMesh );

		var rightWallMiddle = new THREE.CubeGeometry( 80, height/2 , 5);

		rightWallMiddleMesh = new THREE.Mesh(rightWallMiddle, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		rightWallMiddleMesh.position = new THREE.Vector3(this.xPos-flipped*100,this.yPos+height*3/4,this.zPos);
		rightWallMiddleMesh.rotation.y = -Math.PI/2;

		scene.add( rightWallMiddleMesh );

		var rightWallRight = new THREE.CubeGeometry( 80, height , 5);

		rightWallRightMesh = new THREE.Mesh(rightWallRight, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		rightWallRightMesh.position = new THREE.Vector3(this.xPos-flipped*100,this.yPos+height/2,this.zPos + 45/2+40);
		rightWallRightMesh.rotation.y = -Math.PI/2;

		scene.add( rightWallRightMesh );


		var ceiling = new THREE.CubeGeometry( 205, 205 , 5);

		ceilingMesh = new THREE.Mesh(ceiling, new THREE.MeshBasicMaterial( {color : 0x3B5998} ));
		ceilingMesh.position = new THREE.Vector3(this.xPos,this.yPos+height+2.5,this.zPos);
		ceilingMesh.rotation.x = Math.PI/2;

		scene.add( ceilingMesh );

		/*var light = new THREE.PointLight( 0xff0000, 1, 100 );
		light.position.set(	x, 30, z );
		scene.add( light );*/
	};
}

function loadProfilePic(picURL, position) {
	var photoMaterial = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture(picURL)
    });

    
    // plane
    var photo = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), photoMaterial);
    photo.position.x = position.x - 102.6*position.y;
    photo.position.y = 30;
    photo.position.z = position.z + ((45/2+40) * position.y);

    photo.rotation.y = Math.PI/2 * -1*position.y;

    scene.add(photo);
};

function loadName(name, position) {

    var mesh = new THREE.Mesh();

    var textGeo = new THREE.TextGeometry( name, {
        size: 10,
        height: 1,
        curveSegments: 0,

        font: "helvetiker",

        bevelEnabled: false
    });
    
    var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    mesh.material = material;
    mesh.geometry = textGeo;

    mesh.position.x = position.x - 102.6*position.y;
    mesh.position.y = 90;
    mesh.geometry.computeBoundingBox();
    mesh.position.z = position.z + (mesh.geometry.boundingBox.max.x-mesh.geometry.boundingBox.min.x)/2*-position.y;

    mesh.rotation.y = Math.PI/2 * -1*position.y;

    scene.add(mesh);
}

// called everytime you change houses
function newStatusWall(user) {
    statuses.user = user;
    statuses.interval = 2500;
    statuses.curt = 0;
    get_single_status(statuses.user, getNextStatus);
    //get_friend_photos(statuses.user, setPics);
    
}

// called at the very beginning
function initStatusWall() {
    statuses = new Object();
    statuses.mesh = new THREE.Mesh(); 
    statuses.mesh.geometry.dynamic = true;
    scene.add(statuses.mesh);
    
    //statuses.photo = new THREE.Mesh();
    //statuses.photo.geometry.dynamic = true;
    //scene.add(statuses.photo);
}

function getNextStatus(status) { 
	//scene.remove(statuses.mesh);
	console.log("STATUS:"+status);
    var textGeo = new THREE.TextGeometry( status, {
        size: 15,
        height: 50,
        curveSegments: 0,

        font: "helvetiker",

        bevelEnabled: false
    });
    
    var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    statuses.mesh.material = material;
    statuses.mesh.geometry = textGeo;
    statuses.mesh.geometry.verticesNeedUpdate = true;
    statuses.mesh.geometry.elementsNeedUpdate = true;
    statuses.mesh.geometry.morphTargetsNeedUpdate = true;
    statuses.mesh.geometry.uvsNeedUpdate = true;
    statuses.mesh.geometry.normalsNeedUpdate = true;
    statuses.mesh.geometry.colorsNeedUpdate = true;
    statuses.mesh.geometry.tangentsNeedUpdate = true;
    statuses.mesh.position.x = 0;
    statuses.mesh.position.y = 20;
    statuses.mesh.position.z = 0;
    //scene.add(statuses.mesh);
}

function setPics(friendpics) {
	console.log(friendpics[0]);
    pics = friendpics;
    getPic(0);
}

function getPic(index) {
    var image = document.createElement( 'img' );
    image.crossOrigin = '';
	image.src = pics[index];

	var texture = new THREE.Texture( image );
	texture.needsUpdate = true;

    var photoMaterial = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture(texture)
    });

    var photo = new THREE.Mesh();
    statuses.photo.geometry  = new THREE.PlaneGeometry(80, 80);
    statuses.photo.material = photoMaterial;
    
    //var house = getNearestHouse();
    var house = new THREE.Vector3(0,20,0);
    
    statuses.photo.position.x = house.xPos;
    statuses.photo.position.y = house.yPos + 10;
    statuses.photo.position.z = house.zPos;
    
    statuses.photo.geometry.verticesNeedUpdate = true;
    statuses.photo.geometry.elementsNeedUpdate = true;
    statuses.photo.geometry.morphTargetsNeedUpdate = true;
    statuses.photo.geometry.uvsNeedUpdate = true;
    statuses.photo.geometry.normalsNeedUpdate = true;
    statuses.photo.geometry.colorsNeedUpdate = true;
    statuses.photo.geometry.tangentsNeedUpdate = true;
    
    //scene.add(statuses.photo);
}

var picind = 1;
function updateStatusWall(t) {
    statuses.curt += t;
    if (statuses.curt > statuses.interval) {
        statuses.curt = 0;
        get_single_status(statuses.user, getNextStatus);
        //get_friend_photos(statuses.user, getPic);
        //getPic(picind);
        //picind = (picind + 1) % (pics.length - 1);
    }
}


var userPhotos = null;
var photoCascade = new Object();
photoCascade.curt = 0;
photoCascade.interval = 3000;
photoCascade.canRun = false;

//PATRICK'S CODE
var photosIndex = 0;
function updatePhotoCascade(t) {
	if(photoCascade.canRun) {
	    photoCascade.curt += t;
	    if (photoCascade.curt > photoCascade.interval) {
		console.log("HI");
		console.log(pics);
		var image = 0
	    	image.crossOrigin = '';
			//image.src = pics[index];

			var texture = new THREE.Texture( image );
			texture.needsUpdate = true;
	    	
			var photoMaterial = new THREE.MeshBasicMaterial({
				map : THREE.ImageUtils.loadTexture(userPhotos[photosIndex])
			});
	        var photo = new THREE.Mesh(new THREE.PlaneGeometry(40, 40), photoMaterial);
		    photo.position.x = Math.random()*100;
		    photo.position.y = Math.random()*100;
		    photo.position.z = -50;
		    photosIndex+=1;
		    if(photosIndex>=userPhotos.length) {
		    	photosIndex = 0;
		    }

	        photoCascade.curt = 0;

		    scene.add(photo);
	    }
	}
}

function setPhotosArray(photos) {
	userPhotos = photos;
	photoCascade.canRun = true;
}

function getCurrentUser(user) {
	get_friend_photos(user, setPhotosArray);
}


function allFriendsReceived(friends) {

	index = 0;

	for(var i = 0; i < houseManager.housesLeft.length; i++) {
		house = houseManager.housesLeft[i];
		house.fb_user = friends[index];
		loadName(friends[index].name, new THREE.Vector3(house.xPos, -1, house.zPos));
		get_friend_profile_pic(house.fb_user,loadProfilePic,new THREE.Vector3(house.xPos, -1, house.zPos));
		index+=1;
	}

	for(var i = 0; i < houseManager.housesRight.length; i++) {
		house = houseManager.housesRight[i];
		house.fb_user = friends[index];
		loadName(friends[index].name, new THREE.Vector3(house.xPos, 1, house.zPos));
		get_friend_profile_pic(house.fb_user,loadProfilePic,new THREE.Vector3(house.xPos, 1, house.zPos));
		index+=1;
	}
}

function ProfilePicReceived(picURL) {
	var photoMaterial = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture(picURL)
    });


    // plane
    var photo = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), photoMaterial);
    photo.position.y = 40;

    scene.add(photo);
}


function HouseManager() {
    this.housesLeft = null;
    this.housesRight = null;
}

HouseManager.prototype.init = function() {
    this.housesLeft = new Array();
    this.housesRight = new Array();
    
    for (var i = 0; i < 5; i++) {
    	h = new House(300, 0, -400 * i,100,1);
    	h.create();
        this.housesRight[i] = h;
        h2 = new House(-300, 0, -400 * i,100,-1);
        h2.create();
        this.housesLeft[i] = h2;
    }
};

function getNearestHouse() {
	var closestHouse = houseManager.housesLeft[0];
	var lowestDistance = 10000000;
	for(i in houseManager.housesLeft) {
		h = houseManager.housesLeft[i];
		if(distance(camera.position,new THREE.Vector3(h.xPos, 0, h.zPos)) < lowestDistance) {
			lowestDistance = distance(camera.position,new THREE.Vector3(h.xPos, 0, h.zPos));
			closestHouse = h;
		}
	}

	for(i in houseManager.housesRight) {
		h = houseManager.housesRight[i];
		if(distance(camera.position,new THREE.Vector3(h.xPos, 0, h.zPos)) < lowestDistance) {
			lowestDistance = distance(camera.position,new THREE.Vector3(h.xPos, 0, h.zPos));
			closestHouse = h;
		}
	}
	console.log(closestHouse.fb_user.name);
	return closestHouse;
}

function distance(vec1, vec2) {
	return (vec2.x-vec1.x)*(vec2.x-vec1.x) + (vec2.z-vec1.z)*(vec2.z-vec1.z);
}

function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0xFFFFFF, 0, 3000 );

	/*var light = new THREE.DirectionalLight( 0xffffff, 1.5 );
	light.position.set( 1, 1, 1 );
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff, 0.75 );
	light.position.set( -1, - 0.5, -1 );
	scene.add( light );*/

	controls = new THREE.PointerLockControls( camera );
	scene.add( controls.getObject() );

	ray = new THREE.Raycaster();
	ray.ray.direction.set( 0, -1, 0 );

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0xFFFFFF, 1);


	document.body.appendChild( renderer.domElement );

	geometry = new THREE.PlaneGeometry( 20000000, 20000000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshBasicMaterial( {color : 0xD8DFEA} );

	mesh = new THREE.Mesh( geometry, material );
	scene.add( mesh );
    
    houseManager = new HouseManager();
    houseManager.init();
    
    // skybox
    
   /* var urlPrefix = "../data/";
    var urls = [ urlPrefix + "1.png", urlPrefix + "2.png",
        urlPrefix + "5.png", urlPrefix + "6.png",
        urlPrefix + "3.png", urlPrefix + "4.png" ];
    var textureCube = THREE.ImageUtils.loadTextureCube( urls );
    
    var shader = THREE.ShaderLib["cube"];
    //var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
    shader.uniforms['tCube'].texture= textureCube;   // textureCube has been init before
    var material = new THREE.ShaderMaterial({
        fragmentShader    : shader.fragmentShader,
        vertexShader  : shader.vertexShader,
        uniforms  : shader.uniforms
    });
    
    // build the skybox Mesh 
    skyboxMesh    = new THREE.Mesh( new THREE.CubeGeometry( 1000, 1000, 1000, 1, 1, 1, null, true ), material );
    // add it to the scene
    scene.add( skyboxMesh );*/


    get_self(getCurrentUser);


    initStatusWall();

    get_self(testingStatuses);
    
    //get_user_picture(ProfilePicReceived);
    get_all_friends(allFriendsReceived);
    window.addEventListener( 'resize', onWindowResize, false );
}

function testingStatuses(user) {
	newStatusWall(user);
	//statuses.photo.position = new THREE.Vector3(0,20,0);
}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

	requestAnimationFrame( animate );

	//

	controls.isOnObject( false );

	ray.ray.origin.copy( controls.getObject().position );
	ray.ray.origin.y -= 10;

	var intersections = ray.intersectObjects( objects );

	if ( intersections.length > 0 ) {

		var distance = intersections[ 0 ].distance;

		if ( distance > 0 && distance < 10 ) {

			controls.isOnObject( true );

		}

	}

	updateStatusWall( Date.now() - time);
	updatePhotoCascade(Date.now() - time);

	controls.update( Date.now() - time );

	renderer.render( scene, camera );

	time = Date.now();

}



//init();
//animate();
