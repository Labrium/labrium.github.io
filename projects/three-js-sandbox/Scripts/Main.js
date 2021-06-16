var tau = Math.PI * 2;

function deg(number) {
	return (number * tau) / 360;
}

function distance(v1, v2) {
	var dx = v1.x - v2.x;
	var dy = v1.y - v2.y;
	var dz = v1.z - v2.z;
	return Math.sqrt(dx * dx + dy * dy + dz * dz);
}


//scene
var scene = new THREE.Scene();
scene.fog = new THREE.Fog(0xdffdff, 10, 750);
var sky = new THREE.CubeTextureLoader().load(['Images/skybox/right.png', 'Images/skybox/left.png', 'Images/skybox/top.png', 'Images/skybox/bottom.png', 'Images/skybox/front.png', 'Images/skybox/back.png']);
scene.background = sky;
scene.add(new THREE.AmbientLight(0xffffff));



//camera
var camdistance = 20;
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(0, 10, camdistance);
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onWindowResize, false);



//sun
var sun = new THREE.PointLight(0xdfebff, 1.5, 0, 0);
sun.position.set(0, 1000, 0);
sun.position.multiplyScalar(1);
sun.castShadow = true;
sun.shadow.mapSize.width = 1024;
sun.shadow.mapSize.height = 1024;
var d = 1;
sun.shadow.camera.left = - d;
sun.shadow.camera.right = d;
sun.shadow.camera.top = d;
sun.shadow.camera.bottom = - d;
sun.shadow.camera.near = 10;
sun.shadow.camera.far = 1250;
scene.add(sun);
//var test1 = new THREE.CameraHelper(sun.shadow.camera);
//scene.add(test1);



//catch light
var main = new THREE.TextureLoader().load('Images/lensflare/lensflare0.png');
var sub = new THREE.TextureLoader().load('Images/lensflare/hexangle.png');
var lensflare = new THREE.Lensflare();
lensflare.addElement(new THREE.LensflareElement(main, 1000, 0, sun.color));
lensflare.addElement(new THREE.LensflareElement(sub, 75, 0.65, sun.color));
lensflare.addElement(new THREE.LensflareElement(sub, 150, 0.725, sun.color));
lensflare.addElement(new THREE.LensflareElement(sub, 200, 0.8, sun.color));
lensflare.addElement(new THREE.LensflareElement(sub, 150, 0.875, sun.color));
lensflare.addElement(new THREE.LensflareElement(sub, 75, 0.95, sun.color));
sun.add(lensflare);



//water
var waterGeometry = new THREE.PlaneBufferGeometry(10000, 10000);
water = new THREE.Water(waterGeometry, {
	textureWidth: 512,
	textureHeight: 512,
	waterNormals: new THREE.TextureLoader().load('Images/water normal map.png', function (texture) {
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
	}),
	alpha: 0.75,
	sunDirection: sun.position.clone().normalize(),
	sunColor: sun.color,
	waterColor: 0xdffdff, //0x001e0f,
	distortionScale: 1,
	fog: scene.fog !== undefined,
	side: THREE.DoubleSide
});
water.rotation.x = deg(-90);
water.position.y = -0.1;
scene.add(water);



//renderer
var renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.autoClear = false;



//Models
var loadingManager = new THREE.LoadingManager(function () {
	scene.add(Mkart);
	Mkart.position.set(0, 1, 0);
	Mkart.rotation.set(0, 0, 0);
	Mkart.children[1].skeleton.bones[0].scale.set(4.5, 4.5, 4.5);
	Mkart.children[1].skeleton.bones[0].rotation.set(deg(-90), 0, 0);

	Mkart.add(wheels);
	wheels.position.set(0, 0, 0.75);
	wheels.scale.set(0.5, 0.5, 0.5);

	for (var i = 0; i < 350; i++) {
		tree.position.set((Math.random() * 1000) - 500, 0, (Math.random() * 1000) - 500);
		if (distance(tree.position, scene.position) > 490) {
			tree.position.set((Math.random() * 1000) - 500, 0, (Math.random() * 1000) - 500);
		} else {
			var treeScale = Math.random() + 5;
			tree.scale.set(treeScale, treeScale, treeScale);
			scene.add(tree.clone());
		}
	}
	scene.add(bird);
	bird.rotation.set(0, 0, 0);
	bird.position.set(0, 5, 0);
	bird.scale.set(0.2, 0.2, 0.2);

	/*for (var j = 0; j < 10; j++) {
		bird.position.set((Math.random() * 5) - 2.5, (Math.random() * 5), (Math.random() * 5) - 2.5);
		scene.add(bird.clone());
	}*/
	init();
});
var loader = new THREE.ColladaLoader(loadingManager);
//loader.options.convertUpAxis = true;
loader.load('Models/Mariokart Body/M Standard Kart.dae', function (collada) {
	Mkart = collada.scene;
});
loader.load('Models/Mariokart Wheels/TireK_Slk.dae', function (collada) {
	wheels = collada.scene;
});
setTimeout(function () {
	loader.load('Models/N64 Tree/tree.dae', function (collada) {
		tree = collada.scene;
	});
	loader.load('Models/Little Bird/Bird.dae', function (collada) {
		bird = collada.scene;
	});
}, 10);



function init() {
	//sound
	/*setTimeout(function () {
		var listener = new THREE.AudioListener();
		camera.add(listener);
		var sound = new THREE.Audio(listener);
		var audioLoader = new THREE.AudioLoader();
		audioLoader.load('Sounds/Ambient.mp3', function (buffer) {
			sound.setBuffer(buffer);
			sound.setLoop(true);
			sound.setVolume(0.5);
			sound.play();
		});
	}, 20);*/
	console.log(Mkart.children);
	console.log(wheels.children);



	//crate
	var crate = new THREE.TextureLoader().load('Images/crate.gif');
	cubematerial = new THREE.MeshPhysicalMaterial({
		map: crate,
		roughness: 1
	});
	var cube = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), cubematerial);
	cube.castShadow = true;
	cube.position.set(0, 3, 0);
	scene.add(cube);



	//ground
	var grass = new THREE.TextureLoader().load('Images/grasslight-big.jpg');
	var grassNorm = new THREE.TextureLoader().load('Images/grasslight-big-nm.jpg');
	grass.wrapS = grass.wrapT = THREE.RepeatWrapping;
	grass.repeat.set(20, 20);
	grass.anisotropy = 16;
	groundmaterial = new THREE.MeshPhysicalMaterial({
		map: grass,
		normalMap: grassNorm,
		roughness: 1,
		side: THREE.DoubleSide
	});
	var ground = new THREE.Mesh(new THREE.CircleGeometry(500, 128), groundmaterial);
	ground.receiveShadow = true;
	scene.add(ground);
	ground.rotation.x = deg(-90);



	//soccer ball
	var ball = new THREE.TextureLoader().load('Images/soccerball.png');
	ballmat = new THREE.MeshPhysicalMaterial({
		map: ball,
		roughness: 1
	});
	var soccerball = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), ballmat);
	soccerball.castShadow = true;
	soccerball.receiveShadow = true;
	soccerball.position.set(10, 1, 0);
	scene.add(soccerball);



	//kart wheel lights
	var kartLightColor = 0x00ffff;
	var LightEffects = [new THREE.PointLight(kartLightColor, 0, 6, 2), new THREE.PointLight(kartLightColor, 0, 6, 2), new THREE.PointLight(kartLightColor, 0, 6, 2), new THREE.PointLight(kartLightColor, 0, 6, 2)];
	for (var i = 0; i < 4; i++) {
		LightEffects[i].position.multiplyScalar(1);
		LightEffects[i].target = scene;
		LightEffects[i].castShadow = false;
		wheels.add(LightEffects[i]);
	}




	var orbitUp, orbitDown, orbitLeft, orbitRight;
	var ballXVel = 0, ballYVel = 0, ballZVel = 0, ballRestitution = 0.6;
	var MkartForward, MkartBack, MkartLeft, MkartRight, steerangle = 0, drivespeed = 0, height = 1, hover = false, fpv = false;
	var target = Mkart.position;



	var onKeyDown = function (event) {
		switch (event.keyCode) {
			case 104:
				orbitUp = true;
				break;
			case 100:
				orbitLeft = true;
				break;
			case 101:
				orbitDown = true;
				break;
			case 102:
				orbitRight = true;
				break;
			case 82: // r
				cube.position.set(0, 3, 0);
				soccerball.position.set(0, 1, 0);
				break;
			case 13:
				if (target === Mkart.position) {
					target = cube.position;
				} else if (target === cube.position) {
					target = soccerball.position;
				} else if (target === soccerball.position) {
					target = bird.position
				} else if (target === bird.position) {
					target = Mkart.position
				}
				break;
			case 32:
				if (hover === false) {
					hover = true;
				} else if (hover === true) {
					hover = false;
				}
				break;
			case 106:
				if (target === Mkart.position) {
					if (fpv === false) {
						fpv = true;
					} else if (fpv === true) {
						fpv = false;
					}
				}
				break;

			case 107:
				camdistance -= 5;
				break;
			case 109:
				camdistance += 5;
				break;
			case 187:
				camdistance = 15;
				break;

			case 66:
				if (soccerball.position.y < 1.1) {
					ballXVel = (Math.random() * 10);// - 1;
					ballYVel = (Math.random() * 2) - 2.5;
					ballZVel = (Math.random() * 10);// - 1;
				}
				break;


			case 87:

				break;
			case 65:

				break;
			case 83:

				break;
			case 68:

				break;



			case 38:
				MkartForward = true;
				break;
			case 37:
				MkartLeft = true;
				break;
			case 40:
				MkartBack = true;
				break;
			case 39:
				MkartRight = true;
				break;
		}
	};
	var onKeyUp = function (event) {
		switch (event.keyCode) {
			case 104:
				orbitUp = false;
				break;
			case 100:
				orbitLeft = false;
				break;
			case 101:
				orbitDown = false;
				break;
			case 102:
				orbitRight = false;
				break;


			case 87:

				break;
			case 65:

				break;
			case 83:

				break;
			case 68:

				break;


			case 38:
				MkartForward = false;
				break;
			case 37:
				MkartLeft = false;
				break;
			case 40:
				MkartBack = false;
				break;
			case 39:
				MkartRight = false;
				break;
		}
	};
	document.addEventListener('keydown', onKeyDown, false);
	document.addEventListener('keyup', onKeyUp, false);

	var mouseX = 0;
	var mouseY = 0;
	function rotate(event) {
		mouseX = event.pageX - (window.innerWidth / 2);
		mouseY = event.pageY - (window.innerHeight / 2);
	}
	document.addEventListener('mousemove', rotate, false);



	document.body.appendChild(renderer.domElement);




	function animate() {
		requestAnimationFrame(animate);

		scene.traverse(function (child) {
			if (child instanceof THREE.SkinnedMesh) {
				child.castShadow = true;
				child.receiveShadow = true;
			} else if (child instanceof THREE.Mesh && child.id != ground.id && child.id != water.id) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
		});


		for (var i = 1; i < 5; i++) {
			wheels.children[i].material.emissive = new THREE.Color(kartLightColor);
		}
		Mkart.children[1].material.emissive = new THREE.Color(kartLightColor);
		/*var krt = new THREE.TextureLoader().load('Models/Mariokart Body/bodyk_std_nrm.png');
		Mkart.children[1].material.normalMap = krt;
		var wls = new THREE.TextureLoader().load('Models/Mariokart Wheels/Tire_Slk_Nrm .png');
		for (var i = 1; i < 5; i++) {
			wheels.children[i].material.normalMap = wls;
		}*/
		wheels.children[1].skeleton.bones[0].scale.set(1.25, 1.5, 1.5);
		wheels.children[3].skeleton.bones[0].scale.set(1.25, 1.5, 1.5);
		wheels.children[1].skeleton.bones[0].position.y = -0.75;
		wheels.children[3].skeleton.bones[0].position.y = -0.75;
		wheels.children[2].skeleton.bones[0].scale.set(0.75, 1, 1);
		wheels.children[4].skeleton.bones[0].scale.set(0.75, 1, 1);
		if (hover === true) {
			Mkart.children[1].skeleton.bones[0].rotation.z = -steerangle * 10;
			Mkart.children[1].skeleton.bones[0].position.z = (Math.abs(steerangle) * -250);
			wheels.children[1].skeleton.bones[0].position.y = 0;
			//wheels.children[2].skeleton.bones[0].position.y = -steerangle * 25;
			wheels.children[3].skeleton.bones[0].position.y = 0;
			//wheels.children[4].skeleton.bones[0].position.y = steerangle * 25;
			if (height < 2.5) {
				height += 0.1;
				Mkart.position.y = height;
				Mkart.children[1].material.emissiveIntensity += 0.05;
				for (var i = 1; i < 5; i++) {
					wheels.children[i].material.emissiveIntensity += 0.25;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity += 0.25;
				}
				//wheels.children[1].skeleton.bones[0].position.y = 0.25;
				//wheels.children[3].skeleton.bones[0].position.y = 0.25;
			} else {
				Mkart.children[1].material.emissiveIntensity = 1.5;
				for (var i = 1; i < 5; i++) {
					wheels.children[i].material.emissiveIntensity = 5;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = 5;
				}
				for (var i = 1; i < 5; i++) {
					wheels.children[i].skeleton.bones[0].rotation.x = 0;
					//wheels.children[1].skeleton.bones[0].position.y = 0.25;
					//wheels.children[3].skeleton.bones[0].position.y = 0.25;
				}
				/*wheels.children[2].skeleton.bones[0].rotation.y -= Math.abs(drivespeed) + 0.2;
				wheels.children[1].skeleton.bones[0].rotation.y -= Math.abs(drivespeed) + 0.2;
				wheels.children[3].skeleton.bones[0].rotation.y += Math.abs(drivespeed) + 0.2;
				wheels.children[4].skeleton.bones[0].rotation.y += Math.abs(drivespeed) + 0.2;*/
				wheels.children[1].skeleton.bones[0].rotation.z = deg(-(Math.abs(steerangle) * 500) + 82.5);
				wheels.children[2].skeleton.bones[0].rotation.z = deg(-(Math.abs(steerangle) * 500) + 82.5);
				wheels.children[3].skeleton.bones[0].rotation.z = deg((Math.abs(steerangle) * 500) - 82.5);
				wheels.children[4].skeleton.bones[0].rotation.z = deg((Math.abs(steerangle) * 500) - 82.5);
			}
			if (wheels.children[1].skeleton.bones[0].rotation.z < deg(-(Math.abs(steerangle) * 500) + 82.5)) {
				for (var i = 1; i < 5; i++) {
					wheels.children[i].skeleton.bones[0].rotation.x = 0;
				}
				wheels.children[1].skeleton.bones[0].rotation.z += 0.1;
				wheels.children[2].skeleton.bones[0].rotation.z += 0.1;
				wheels.children[1].skeleton.bones[0].position.x += 0.05;
				wheels.children[2].skeleton.bones[0].position.x += 0.05;
			}
			if (wheels.children[3].skeleton.bones[0].rotation.z > deg((Math.abs(steerangle) * 500) - 82.5)) {
				wheels.children[3].skeleton.bones[0].rotation.z -= 0.1;
				wheels.children[4].skeleton.bones[0].rotation.z -= 0.1;
				wheels.children[3].skeleton.bones[0].position.x -= 0.05;
				wheels.children[4].skeleton.bones[0].position.x -= 0.05;
			}
		} else {
			wheels.children[2].skeleton.bones[0].position.y = 0;
			wheels.children[4].skeleton.bones[0].position.y = 0;
			Mkart.children[1].skeleton.bones[0].rotation.z = 0;
			Mkart.children[1].skeleton.bones[0].position.z = 0;
			if (height > 1) {
				height -= 0.1;
				Mkart.position.y = height;
				Mkart.children[1].material.emissiveIntensity -= 0.05;
				for (var i = 1; i < 5; i++) {
					wheels.children[i].material.emissiveIntensity -= 0.25;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity -= 0.25;
				}
			} else {
				Mkart.children[1].material.emissiveIntensity = 0;
				for (var i = 1; i < 5; i++) {
					wheels.children[i].material.emissiveIntensity = 0;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = 0;
				}
				for (var i = 0; i < 4; i++) {
					LightEffects[i].intensity = 0;
				}
				for (var i = 1; i < 5; i++) {
					wheels.children[i].skeleton.bones[0].rotation.z = 0;
				}
				wheels.children[1].skeleton.bones[0].rotation.x += drivespeed / 1.5;
				wheels.children[2].skeleton.bones[0].rotation.x += drivespeed;
				wheels.children[3].skeleton.bones[0].rotation.x += drivespeed / 1.5;
				wheels.children[4].skeleton.bones[0].rotation.x += drivespeed;
			}
			if (wheels.children[3].skeleton.bones[0].rotation.z < 0) {
				for (var i = 1; i < 5; i++) {
					wheels.children[i].skeleton.bones[0].rotation.x = 0;
				}
				wheels.children[3].skeleton.bones[0].rotation.y = 0;
				wheels.children[4].skeleton.bones[0].rotation.y = 0;
				wheels.children[3].skeleton.bones[0].rotation.z += 0.1;
				wheels.children[4].skeleton.bones[0].rotation.z += 0.1;
				wheels.children[3].skeleton.bones[0].position.x += 0.05;
				wheels.children[4].skeleton.bones[0].position.x += 0.05;
			}
			if (wheels.children[1].skeleton.bones[0].rotation.z > 0) {
				wheels.children[1].skeleton.bones[0].rotation.y = 0;
				wheels.children[2].skeleton.bones[0].rotation.y = 0;
				wheels.children[1].skeleton.bones[0].rotation.z -= 0.1;
				wheels.children[2].skeleton.bones[0].rotation.z -= 0.1;
				wheels.children[1].skeleton.bones[0].position.x -= 0.05;
				wheels.children[2].skeleton.bones[0].position.x -= 0.05;
			}
		}




		if (orbitUp === true) {
			camera.translateY(camdistance / 20);
		}
		if (orbitDown === true) {
			camera.translateY(-camdistance / 20);
		}
		if (orbitRight === true) {
			camera.translateX(camdistance / 20);
		}
		if (orbitLeft === true) {
			camera.translateX(-camdistance / 20);
		}




		soccerball.position.x += ballXVel;
		soccerball.position.y += ballYVel;
		soccerball.position.z += ballZVel;
		ballXVel = ballXVel * 0.99;
		ballZVel = ballZVel * 0.99;

		const axis = new THREE.Vector3();
		var ballVelocityAngle = new THREE.Vector3();
		ballVelocityAngle.set(ballXVel, ballYVel, ballZVel);
		axis.set(0, -1, 0).cross(ballVelocityAngle).normalize();
		const totalVelocity = Math.sqrt(ballXVel * ballXVel + ballZVel * ballZVel);
		const angle = -totalVelocity;


		if (distance(soccerball.position, scene.position) < 500) {
			if (soccerball.position.y < 1) {
				soccerball.position.y = 1;
				ballYVel *= -ballRestitution;
			} else {
				ballYVel -= 0.025;
			}
			soccerball.rotateOnWorldAxis(axis, angle);
		} else {
			if (soccerball.position.y < 0) {
				soccerball.position.y *= 0.99;
				ballYVel *= 0.97;
				ballYVel += 0.01;
			} else {
				soccerball.position.y *= 0.99;
				ballYVel *= 0.97;
				ballYVel -= 0.025;
			}
		}
		if (distance(soccerball.position, scene.position) < 500) {
			if (Math.abs(ballYVel) < 0.02 && soccerball.position.y < 1.2) {
				soccerball.position.y = 1;
				ballYVel = 0;
			}
		}
		if (Math.abs(ballXVel) < 0.001) {
			ballXVel = 0;
		}
		if (Math.abs(ballZVel) < 0.001) {
			ballZVel = 0;
		}




		if (MkartForward === true) {
			if (drivespeed > -1.5) {
				drivespeed -= 0.1;
			}
		} else if (MkartBack === true) {
			if (drivespeed < 1.5) {
				drivespeed += 0.1;
			}
		} else {
			drivespeed = drivespeed * 0.97; //0.97
		}

		if (MkartRight === true) {
			steerangle -= (0.05 - 0.005) * (Math.abs(drivespeed) / 25);
		} else if (MkartLeft === true) {
			steerangle += (0.05 - 0.005) * (Math.abs(drivespeed) / 25);
		}
		steerangle = steerangle * 0.95;

		Mkart.translateZ(-drivespeed);
		Mkart.rotateY(steerangle);
		wheels.rotation.set(0, 0, Mkart.children[1].skeleton.bones[0].rotation.z + deg(180));
		wheels.position.y = (-Mkart.children[1].skeleton.bones[0].position.z) / 8.25;

		if (target === Mkart.position && drivespeed < 0) {
			camera.translateY(-drivespeed / 5);
		}
		if (target === Mkart.position) {
			camera.translateX(steerangle * camdistance);
		}

		cube.rotation.x += 0.01;
		cube.rotation.y += 0.01;
		cube.rotation.z += 0.01;
		cube.translateX(0.5);



		bird.rotateX(mouseY / 10000);
		bird.rotateZ(mouseX / 10000);
		bird.translateZ(1);

		if (bird.position.y < 0) {
			bird.position.y = 0;
		}

		if (camera.position.y < 1) {
			camera.position.y = 1;
		}


		if (distance(Mkart.position, scene.position) > 490) {
			hover = true;
		}

		if (fpv === true) {
			target = Mkart.position;
			camera.position.set(Mkart.position.x, Mkart.position.y + 4, Mkart.position.z);
			camera.rotation.set(0, Mkart.rotation.y + deg(180), 0);
		} else {
			camera.lookAt(target);
			camera.translateZ(-(distance(camera.position, target) - camdistance) / 10);
		}



		water.material.uniforms['time'].value += 1.0 / 60.0;

		LightEffects[0].position.set(4.75, 0, 4.75);
		LightEffects[1].position.set(-4.75, 0, 4.75);
		LightEffects[2].position.set(4.75, 0, -4.75);
		LightEffects[3].position.set(-4.75, 0, -4.75);

		renderer.render(scene, camera);
	}
	animate();
}