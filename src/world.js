var camera, scene, renderer;
var geometry, material, mesh;
var controls,time = Date.now();

var houseManager;

var objects = [];

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

function House(x,y,z,height) {
	this.fb_user = null;
	this.xPos = x;
	this.yPos = y;
	this.zPos = z;
	this.height = height;

	this.create = function() {
	    var backWall = new THREE.CubeGeometry( 195, height , 5);

		backWallMesh = new THREE.Mesh(backWall, new THREE.MeshBasicMaterial( {color : 0xAAAAAA} ));
		backWallMesh.position = new THREE.Vector3(this.xPos,this.yPos+height/2,this.zPos-100);
		backWallMesh.material.side = THREE.DoubleSide;

		scene.add( backWallMesh );


		var frontWall = new THREE.CubeGeometry( 195, height , 5);

		frontWallMesh = new THREE.Mesh(frontWall, new THREE.MeshBasicMaterial( {color : 0xAAAA00} ));
		frontWallMesh.position = new THREE.Vector3(this.xPos,this.yPos+height/2,this.zPos+100);
		frontWallMesh.rotation.x = Math.PI;
		frontWallMesh.material.side = THREE.DoubleSide;

		scene.add( frontWallMesh );


		var leftWall = new THREE.CubeGeometry( 205, height , 5);

		leftWallMesh = new THREE.Mesh(leftWall, new THREE.MeshBasicMaterial( {color : 0xAA00AA} ));
		leftWallMesh.position = new THREE.Vector3(this.xPos-100,this.yPos+height/2,this.zPos);
		leftWallMesh.rotation.y = Math.PI/2;
		leftWallMesh.material.side = THREE.DoubleSide;

		scene.add( leftWallMesh );


		var rightWall = new THREE.CubeGeometry( 205, height , 5);

		rightWallMesh = new THREE.Mesh(rightWall, new THREE.MeshBasicMaterial( {color : 0x00AAAA} ));
		rightWallMesh.position = new THREE.Vector3(this.xPos+100,this.yPos+height/2,this.zPos);
		rightWallMesh.rotation.y = -Math.PI/2;
		rightWallMesh.material.side = THREE.DoubleSide;

		scene.add( rightWallMesh );


		var ceiling = new THREE.CubeGeometry( 205, 205 , 5);

		ceilingMesh = new THREE.Mesh(ceiling, new THREE.MeshBasicMaterial( {color : 0x555555} ));
		ceilingMesh.position = new THREE.Vector3(this.xPos,this.yPos+height+2.5,this.zPos);
		ceilingMesh.rotation.x = Math.PI/2;

		scene.add( ceilingMesh );
	};
}

function loadProfilePic(picURL, position) {
	var photoMaterial = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture(picURL)
    });

    
    console.log(this.fb_user);
    // plane
    var photo = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), photoMaterial);
    photo.position.x = position.x + 102.6*position.y;
    photo.rotation.y = Math.PI/2 * position.y;
    photo.position.y = 30;
    photo.position.z = position.z;

    scene.add(photo);
};


function StatusWall(id, x, y, z) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.z = z;
    this.interval = 2500;
    this.curt = 0;
}

StatusWall.prototype.init = function() {
    this.textGeoMesh = new THREE.Mesh(); 
    this.getNextStatus();
    scene.add(textGeoMesh);
};

StatusWall.prototype.getNextStatus = function() { 
    var newstatus = getRandomStatus(this.id);
    while (true){
        if (newstatus != this.status) {
            this.status = newstatus;
            break;
        }
        newstatus = getRandomStatus(this.id);
    }
    this.curt = 0;
    
    var textGeo = new THREE.TextGeometry( this.status, {
        size: 70,
        height: 20,
        curveSegments: 0,

        font: "optimer",
        weight: "bold",
        style: "normal",

        bevelEnabled: false,
    });
    
    var material = new THREE.MeshBasicMaterial({color: 0xFFFFFF});
    this.textGeoMesh.material = material;
    this.textGeoMesh.textGeo = textGeo;
}

StatusWall.prototype.update = function(t) {
    this.curt += t;
    if (this.curt > this.interval) {
        this.getNextStatus();
    }
};


function allFriendsReceived(friends) {

	index = 0;

	for(i in houseManager.housesLeft) {
		house = houseManager.housesLeft[i];
		house.fb_user = friends[index];
		get_friend_profile_pic(house.fb_user,loadProfilePic,new THREE.Vector3(house.xPos, 1, house.zPos));
		index+=1;
	}

	for(i in houseManager.housesRight) {
		house = houseManager.housesRight[i];
		house.fb_user = friends[index];
		get_friend_profile_pic(house.fb_user,loadProfilePic,new THREE.Vector3(house.xPos, -1, house.zPos));
		index+=1;
	}
}

function ProfilePicReceived(picURL) {
	var photoMaterial = new THREE.MeshBasicMaterial({
		map : THREE.ImageUtils.loadTexture(picURL)
    });


    // plane
    var photo = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), photoMaterial);
    photo.position.y = 30;

    scene.add(photo);
}


function HouseManager() {
    this.housesLeft = null;
    this.housesRight = null;
}

HouseManager.prototype.init = function() {
    this.housesLeft = new Array();
    this.housesRight = new Array();
    
    for (var i = 0; i < 50; i++) {
    	h = new House(300, 0, -400 * i,100);
    	h.create();
        this.housesRight[i] = h;
        h2 = new House(-300, 0, -400 * i,100);
        h2.create();
        this.housesLeft[i] = h2;
    }
};


function init() {

	camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 3000 );

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog( 0x00dfff, 0, 2000 );

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

	renderer = new THREE.WebGLRenderer();
	renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor(0x00dfff, 1);


	document.body.appendChild( renderer.domElement );

	geometry = new THREE.PlaneGeometry( 20000000, 20000000, 100, 100 );
	geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

	material = new THREE.MeshBasicMaterial( {color : 0x006400} );

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
    
    get_user_picture(ProfilePicReceived);
    get_all_friends(allFriendsReceived);
    window.addEventListener( 'resize', onWindowResize, false );
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

	controls.update( Date.now() - time );

	renderer.render( scene, camera );

	time = Date.now();

}



//init();
//animate();
