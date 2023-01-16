var tau = 6.28318530717958637392528;

function deg(number) {
	return (number * tau) / 360;
}

var orbitUp, orbitDown, orbitLeft, orbitRight, run;

var onground = false;

var jumptime = 0;

var onKeyDown = function (event) {
	switch (event.code) {
		case "ArrowUp":
			if (onground == true && orbitUp != true) {
				jumptime = 30;
				onground = false;
			}
			orbitUp = true;
			break;
		case "ArrowLeft":
			new TWEEN.Tween(Mario.rotation).to({_y:tau/2}, 100).easing(TWEEN.Easing.Cubic.Out).onUpdate(Mario.rotation._onChangeCallback).start();
			orbitLeft = true;
			break;
		case "ArrowDown":
			orbitDown = true;
			break;
		case "ArrowRight":
			new TWEEN.Tween(Mario.rotation).to({_y:0}, 100).easing(TWEEN.Easing.Cubic.Out).onUpdate(Mario.rotation._onChangeCallback).start();
			orbitRight = true;
			break;
		case "ShiftLeft":
			run = true;
			break;
	}
};
var onKeyUp = function (event) {
	switch (event.code) {
		case "ArrowUp":
			orbitUp = false;
			jumptime = 0;
			break;
		case "ArrowLeft":
			orbitLeft = false;
			break;
		case "ArrowDown":
			orbitDown = false;
			break;
		case "ArrowRight":
			orbitRight = false;
			break;
		case "ShiftLeft":
			run = false;
			break;
	}
};
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", onWindowResize, false);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x9597FC);

var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);



var Mario = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 4/16), new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load("Images/SMB/Mario.png"),
	alphaMap: new THREE.TextureLoader().load("resources/test copy.png"),
	transparent: true,
	alphaTest: 0.5
}));
Mario.customDepthMaterial = new THREE.MeshDepthMaterial({
	alphaMap: Mario.material.alphaMap,
	depthPacking: THREE.RGBADepthPacking,
	alphaTest: Mario.material.alphaTest
});
Mario.material.map.magFilter = THREE.NearestFilter;
Mario.material.map.minFilter = THREE.NearestFilter;
Mario.castShadow = true;
Mario.receiveShadow = true;
Mario.userData.velocity = new THREE.Vector2();
Mario.userData.immediateBounds = {top: Infinity, bottom: -Infinity, left: -Infinity, right: Infinity};
scene.add(Mario);



var Block = new THREE.Mesh(new THREE.BoxBufferGeometry(1, 1, 1), new THREE.MeshLambertMaterial({
	map: new THREE.TextureLoader().load("Images/SMB/Block.png")
}));
Block.material.map.magFilter = THREE.NearestFilter;
Block.material.map.minFilter = THREE.NearestFilter;
Block.castShadow = true;
Block.receiveShadow = true;


var Tube = new THREE.Group();
Tube.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(14/16, 14/16, 1, 16, 1, true), new THREE.MeshLambertMaterial({
	
})));
//Tube.children[0].material.map.magFilter = THREE.NearestFilter;
//Tube.children[0].material.map.minFilter = THREE.NearestFilter;
Tube.children[0].castShadow = true;
Tube.children[0].receiveShadow = true;
Tube.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(11/16, 11/16, 1, 16, 1, true), new THREE.MeshLambertMaterial({
	side: THREE.BackSide
})));
//Tube.children[1].material.map.magFilter = THREE.NearestFilter;
//Tube.children[1].material.map.minFilter = THREE.NearestFilter;
Tube.children[1].castShadow = true;
Tube.children[1].receiveShadow = true;


var TubeTop = new THREE.Group();
TubeTop.add(new THREE.Mesh(new THREE.RingBufferGeometry(14/16, 1, 16, 16), new THREE.MeshLambertMaterial({
	
})));
TubeTop.children[0].position.y = -(7/16);
TubeTop.children[0].rotation.x = tau/4;
//TubeTop.children[0].material.map.magFilter = THREE.NearestFilter;
//TubeTop.children[0].material.map.minFilter = THREE.NearestFilter;
TubeTop.children[0].castShadow = true;
TubeTop.children[0].receiveShadow = true;
TubeTop.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(14/16, 14/16, 1/16, 16, 1, true), new THREE.MeshLambertMaterial({
	
})));
TubeTop.children[1].position.y = -(15/16)/2;
//TubeTop.children[1].material.map.magFilter = THREE.NearestFilter;
//TubeTop.children[1].material.map.minFilter = THREE.NearestFilter;
TubeTop.children[1].castShadow = true;
TubeTop.children[1].receiveShadow = true;
TubeTop.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(1, 1, 15/16, 16, 1, true), new THREE.MeshLambertMaterial({
	
})));
TubeTop.children[2].position.y = (1/16)/2;
//TubeTop.children[2].material.map.magFilter = THREE.NearestFilter;
//TubeTop.children[2].material.map.minFilter = THREE.NearestFilter;
TubeTop.children[2].castShadow = true;
TubeTop.children[2].receiveShadow = true;
TubeTop.add(new THREE.Mesh(new THREE.CylinderBufferGeometry(11/16, 11/16, 1, 16, 1, true), new THREE.MeshLambertMaterial({
	side: THREE.BackSide
})));
//TubeTop.children[3].material.map.magFilter = THREE.NearestFilter;
//TubeTop.children[3].material.map.minFilter = THREE.NearestFilter;
TubeTop.children[3].castShadow = true;
TubeTop.children[3].receiveShadow = true;
TubeTop.add(new THREE.Mesh(new THREE.RingBufferGeometry(11/16, 1, 16, 16), new THREE.MeshLambertMaterial({
	
})));
TubeTop.children[4].position.y = (8/16);
TubeTop.children[4].rotation.x = -tau/4;
//TubeTop.children[4].material.map.magFilter = THREE.NearestFilter;
//TubeTop.children[4].material.map.minFilter = THREE.NearestFilter;
TubeTop.children[4].castShadow = true;
TubeTop.children[4].receiveShadow = true;


var light = new THREE.HemisphereLight(0xffffff, 0xaaaaaa, 0.5);
scene.add(light);

var dlight = new THREE.DirectionalLight(0xffffff, 1.25);
dlight.castShadow = true;
var d = 16;
dlight.shadow.mapSize.width = 256;
dlight.shadow.mapSize.height = 256;
dlight.shadow.camera.top = d;
dlight.shadow.camera.bottom = -d;
dlight.shadow.camera.left = -d;
dlight.shadow.camera.right = d;
dlight.shadow.camera.near = 0.1;
dlight.shadow.camera.far = 100;

scene.add(dlight);

var sunangle = new THREE.Vector3(10, 10, 10);

camera.add(dlight.target);
dlight.target.position.set(0, 0, -875*(1/camera.fov));






var level = [
"                                                                                                                                                                                                                     ",
"                                                                                                                                                                                                                     ",
"                                                                                                                                                                                                                     ",
"                                                                                                                                                                                                                     ",
"                                                                                                                                                                                                                     ",
"                      ?                                                         ########   ###?               ?           ###    #??#                                                         XX                     ",
"                                                                                                                                                                                             XXX                     ",
"                                                                                                                                                                                            XXXX                     ",
"                                                                +                                                                                                                          XXXXX                     ",
"               ?    #!#?#                     ==         ==                  #?#              #      ##    ?  ?  ?     #          ##      X  X          XX  X            ##?#             XXXXXX                     ",
"                                      ==      ||         ||                                                                              XX  XX        XXX  XX                           XXXXXXX                     ",
"                            ==        ||      ||         ||                                                                             XXX  XXX      XXXX  XXX     ==               == XXXXXXXX                     ",
"                            ||        ||      ||         ||                                                                            XXXX  XXXX    XXXXX  XXXX    ||               ||XXXXXXXXX        X            ",
"000000000000000000000000000000000000000000000000000000000000000000000  000000000000000   00000000000000000000000000000000000000000000000000000000000000000  000000000000000000000000000000000000000000000000000000000",
"000000000000000000000000000000000000000000000000000000000000000000000  000000000000000   00000000000000000000000000000000000000000000000000000000000000000  000000000000000000000000000000000000000000000000000000000",
];







for (var y = 0; y < level.length; y++) {
	for (var x = 0; x < level[y].length; x++) {
		switch (level[y][x]) {
			case " ":
				break;

			case "=":
				if (level[y][x-1]) {
						if (level[y][x-1] != "=") {
							var t = TubeTop.clone();
							t.position.set(x+0.5, -(y-7), 0);
							scene.add(t);
						}
				}
				break;

			case "|":
				if (level[y][x-1]) {
						if (level[y][x-1] != "|") {
							var t = Tube.clone();
							t.position.set(x+0.5, -(y-7), 0);
							scene.add(t);
						}
				}
				break;

			default:
				if (y > 12) {
					var t = Block.clone();
					t.position.set(x, -(y-7), -1);
					scene.add(t);

					var t = Block.clone();
					t.position.set(x, -(y-7), 0);
					scene.add(t);

					var t = Block.clone();
					t.position.set(x, -(y-7), 1);
					scene.add(t);
				} else {
					var t = Block.clone();
					t.position.set(x, -(y-7), 0);
					scene.add(t);
				}
				break;
		}
	}
}


var inGround = false;

function updateVBounds() {
	// Collide Top
	try {
		Mario.userData.immediateBounds.top = Math.max(Math.min(Math.round(Mario.position.y), 7), -7);
		if (level[-Mario.userData.immediateBounds.top + 7][Math.round(Mario.position.x)]) {
			if (level[-Mario.userData.immediateBounds.top + 7][Math.round(Mario.position.x)] != " ") {
				alert("TOP IN GROUND!");
				inGround = true;
			} else {
				while (level[-Mario.userData.immediateBounds.top + 7][Math.round(Mario.position.x)] == " ") {
					Mario.userData.immediateBounds.top += 1;
				}
				Mario.userData.immediateBounds.top -= 1;
			}
		} else {
			Mario.userData.immediateBounds.top = Infinity;
		}
	} catch {
		Mario.userData.immediateBounds.top = Infinity;
	}



	// Collide Bottom
	try {
		Mario.userData.immediateBounds.bottom = Math.max(Math.min(Math.round(Mario.position.y), 7), -7);
		if (level[-Mario.userData.immediateBounds.bottom + 7][Math.round(Mario.position.x)]) {
			if (level[-Mario.userData.immediateBounds.bottom + 7][Math.round(Mario.position.x)] != " ") {
				alert("BOTTOM IN GROUND!");
				inGround = true;
			} else {
				while (level[-Mario.userData.immediateBounds.bottom + 7][Math.round(Mario.position.x)] == " ") {
					Mario.userData.immediateBounds.bottom -= 1;
				}
				Mario.userData.immediateBounds.bottom += 1;
			}
		} else {
			Mario.userData.immediateBounds.bottom = -Infinity;
		}
	} catch {
		Mario.userData.immediateBounds.bottom = -Infinity;
	}

}


function updateHBounds() {
	// Collide Left
	try {
		Mario.userData.immediateBounds.left = Math.max(Math.min(Math.round(Mario.position.x), level[14].length), 0);
		if (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.left]) {
			if (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.left] != " ") {
				alert("LEFT IN GROUND!");
				inGround = true;
			} else {
				while (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.left] == " ") {
					Mario.userData.immediateBounds.left -= 1;
				}
				Mario.userData.immediateBounds.left += 1;
			}
		} else {
			Mario.userData.immediateBounds.left = -Infinity;
		}
	} catch {
		Mario.userData.immediateBounds.left = -Infinity;
	}



	// Collide Right
	try {
		Mario.userData.immediateBounds.right = Math.max(Math.min(Math.round(Mario.position.x), level[14].length), 0);
		if (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.right]) {
			if (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.right] != " ") {
				alert("RIGHT IN GROUND!");
				inGround = true;
			} else {
				while (level[-Math.round(Mario.position.y) + 7][Mario.userData.immediateBounds.right] == " ") {
					Mario.userData.immediateBounds.right += 1;
				}
				Mario.userData.immediateBounds.right -= 1;
			}
		} else {
			Mario.userData.immediateBounds.right = Infinity;
		}
	} catch {
		Mario.userData.immediateBounds.right = Infinity;
	}
}

updateVBounds();
updateHBounds();

var mpp = new THREE.Vector2();

var hlprmat = new THREE.MeshBasicMaterial({color: "red", depthTest: false, depthWrite: false});
var hlprgeom = new THREE.PlaneBufferGeometry();
var boundhlprs = [new THREE.Mesh(hlprgeom, hlprmat), new THREE.Mesh(hlprgeom, hlprmat), new THREE.Mesh(hlprgeom, hlprmat), new THREE.Mesh(hlprgeom, hlprmat)];

boundhlprs[0].renderOrder = 1;
boundhlprs[1].renderOrder = 1;
boundhlprs[2].renderOrder = 1;
boundhlprs[3].renderOrder = 1;

boundhlprs[0].scale.set(100.5, 2/16);
boundhlprs[1].scale.set(100.5, 2/16);
boundhlprs[2].scale.set(2/16, 100.5);
boundhlprs[3].scale.set(2/16, 100.5);

scene.add(boundhlprs[0]);
scene.add(boundhlprs[1]);
scene.add(boundhlprs[2]);
scene.add(boundhlprs[3]);



var dead = false;
function die() {
	if (dead == false) {
		dead = true;
		setTimeout(function () {
			Mario.position.set(0, 0, 0);
			Mario.userData.velocity.set(0, 0);
			jumptime = 0;
			inGround = false;
			dead = false;
		}, 1000);
	}
}



var animate = function () {
	requestAnimationFrame(animate);

	if (orbitUp === true) {
		if (jumptime == 30) {
			Mario.userData.velocity.y = 30/100;
		}
		if (jumptime > 0) {
			jumptime--;
		}
	}
	if (orbitDown === true) {
		//duck
	}
	if (orbitRight === true) {
		if (run == true) {
			if (Mario.userData.velocity.x < 1/6) {
				Mario.userData.velocity.x += 1/180;
			}
			if (Mario.userData.velocity.x < 0) {
				Mario.userData.velocity.x *= 0.95;
			}
		} else {
			if (Mario.userData.velocity.x < 1/11) {
				Mario.userData.velocity.x += 1/180;
			} else {
				Mario.userData.velocity.x *= 0.95;
			}
			if (Mario.userData.velocity.x < 0) {
				Mario.userData.velocity.x *= 0.95;
			}
		}
	}
	if (orbitLeft === true) {
		if (run == true) {
			if (Mario.userData.velocity.x > -1/6) {
				Mario.userData.velocity.x -= 1/180;
			}
			if (Mario.userData.velocity.x > 0) {
				Mario.userData.velocity.x *= 0.95;
			}
		} else {
			if (Mario.userData.velocity.x > -1/11) {
				Mario.userData.velocity.x -= 1/180;
			} else {
				Mario.userData.velocity.x *= 0.95;
			}
			if (Mario.userData.velocity.x > 0) {
				Mario.userData.velocity.x *= 0.95;
			}
		}
	}

	if (orbitLeft != true && orbitRight != true) {
		Mario.userData.velocity.x *= 0.95;
	}

	if (jumptime > 0) {
		Mario.userData.velocity.y -= 1/100;
	} else {
		Mario.userData.velocity.y -= 2/100;
	}
	

	Mario.position.x += Mario.userData.velocity.x;
	Mario.position.y += Mario.userData.velocity.y;



	if (Math.abs(mpp.x - Mario.position.x) > 0.5) {
		updateVBounds();
		boundhlprs[0].position.set(Mario.position.x, Mario.userData.immediateBounds.top + 0.5, 0);
		boundhlprs[1].position.set(Mario.position.x, Mario.userData.immediateBounds.bottom - 0.5, 0);
		mpp.x = Mario.position.x;
	}
	if (Math.abs(mpp.y - Mario.position.y) > 0.5) {
		updateHBounds();
		boundhlprs[2].position.set(Mario.userData.immediateBounds.left - 0.5, Mario.position.y, 0);
		boundhlprs[3].position.set(Mario.userData.immediateBounds.right + 0.5, Mario.position.y, 0);
		mpp.y = Mario.position.y;
	}



	if (inGround == true) {
		die();
	}




	if (Mario.position.y > Mario.userData.immediateBounds.top) {
		if (Mario.userData.immediateBounds.top != Infinity) {
			Mario.position.y = Mario.userData.immediateBounds.top;
		}
		Mario.userData.velocity.y = 0;
		jumptime = 0;
	}
	if (Mario.position.y < Mario.userData.immediateBounds.bottom) {
		if (Mario.userData.immediateBounds.top != -Infinity) {
			Mario.position.y = Mario.userData.immediateBounds.bottom;
		}
		Mario.userData.velocity.y = 0;
		onground = true;
	}
	if (Mario.position.x < Mario.userData.immediateBounds.left) {
		if (Mario.userData.immediateBounds.left != -Infinity) {
			Mario.position.x = Mario.userData.immediateBounds.left;
		}
		Mario.userData.velocity.x = 0;
	}
	if (Mario.position.x > Mario.userData.immediateBounds.right) {
		if (Mario.userData.immediateBounds.right != Infinity) {
			Mario.position.x = Mario.userData.immediateBounds.right;
		}
		Mario.userData.velocity.x = 0;
	}


	if (Mario.position.y < -8) {
		die();
	}
	


	camera.lookAt(Mario.position.x, 0, 0);
	camera.translateZ(-camera.position.distanceTo(Mario.position) / 10);
	camera.position.z = 875*(1/camera.fov);

	//camera.rotation.set(0, 0, 0);


	TWEEN.update();


	dlight.position.copy(dlight.target.getWorldPosition()).add(sunangle);



	renderer.render(scene, camera);
};

animate();